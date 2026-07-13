package com.mahesh.login_auth_api.service;

import java.time.LocalDateTime;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import com.mahesh.login_auth_api.dto.ForgotPasswordRequest;
import com.mahesh.login_auth_api.dto.LoginRequest;
import com.mahesh.login_auth_api.dto.OtpRequest;
import com.mahesh.login_auth_api.dto.RegisterRequest;
import com.mahesh.login_auth_api.dto.ResetPasswordRequest;
import com.mahesh.login_auth_api.entity.User;
import com.mahesh.login_auth_api.repository.UserRepository;
import com.mahesh.login_auth_api.util.OtpGenerator;
import com.mahesh.login_auth_api.exception.InvalidCredentialsException;
import com.mahesh.login_auth_api.exception.ResourceNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import com.mahesh.login_auth_api.util.JwtUtil;

@Service
public class AuthService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private JwtUtil jwtUtil;

    @Autowired
    private EmailService emailService;

    @Value("${app.otp.expiry-minutes}")
    private int otpExpiryMinutes;

    @Value("${app.otp.print-console}")
    private boolean otpPrintConsole;

    // Stricter email pattern (requires a proper TLD)
    private static final String EMAIL_REGEX =
            "^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+\\.[A-Za-z]{2,}$";

    // ================= REGISTER =================

    public String registerUser(RegisterRequest request) {

        // Empty Full Name Check
        if (request.getFullName() == null || request.getFullName().trim().isEmpty()) {
            return "Full Name is required";
        }

        // Empty Email Check
        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            return "Email is required";
        }

        // Email Format Validation
        if (!request.getEmail().matches(EMAIL_REGEX)) {
            return "Invalid Email Format";
        }

        // Empty Phone Number Check
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            return "Phone Number is required";
        }

        // Phone Number Format (10 digits)
        if (!request.getPhoneNumber().matches("^[0-9]{10}$")) {
            return "Phone Number must be 10 digits";
        }

        // Empty Password Check
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return "Password is required";
        }

        // Password Strength Validation
        String passwordError = validatePasswordStrength(request.getPassword());
        if (passwordError != null) {
            return passwordError;
        }

        // Confirm Password Check
        if (request.getConfirmPassword() == null
                || !request.getConfirmPassword().equals(request.getPassword())) {
            return "Passwords do not match";
        }

        // Duplicate Email Check
        if (userRepository.findByEmail(request.getEmail()).isPresent()) {
            return "Email already exists";
        }

        // Duplicate Phone Number Check
        if (userRepository.findByPhoneNumber(request.getPhoneNumber()).isPresent()) {
            return "Phone number already exists";
        }

        User user = new User();

        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setPhoneNumber(request.getPhoneNumber());
        user.setPassword(passwordEncoder.encode(request.getPassword()));

        userRepository.save(user);

        return "User Registered Successfully";
    }

    // ================= LOGIN =================

    public String loginUser(LoginRequest request) {

        if (request.getEmail() == null || request.getEmail().trim().isEmpty()) {
            throw new InvalidCredentialsException("Email is required");
        }

        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            throw new InvalidCredentialsException("Password is required");
        }

        User user = userRepository.findByEmail(request.getEmail()).orElse(null);

        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid Password");
        }

        String token = jwtUtil.generateToken(user.getEmail());

        return token;
    }

    // ================= FORGOT PASSWORD =================

    public String forgotPassword(ForgotPasswordRequest request) {

        User user = null;

        String username = request.getUsername();

        if (username == null || username.trim().isEmpty()) {
            return "Email or Phone Number is required";
        }

        // Check Email
        if (username.contains("@")) {
            user = userRepository.findByEmail(username).orElse(null);
        }
        // Check Phone Number
        else {
            user = userRepository.findByPhoneNumber(username).orElse(null);
        }

        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        String otp = OtpGenerator.generateOtp();

        user.setOtp(otp);
        user.setOtpExpiry(LocalDateTime.now().plusMinutes(otpExpiryMinutes));
        user.setVerified(false);

        userRepository.save(user);

        // Send OTP by email (always dispatched to the user's registered email)

        System.out.println("===== BEFORE EMAIL SERVICE =====");

emailService.sendOtpEmail(
        user.getEmail(),
        user.getFullName(),
        otp,
        otpExpiryMinutes
);

System.out.println("===== AFTER EMAIL SERVICE =====");

        emailService.sendOtpEmail(
                user.getEmail(),
                user.getFullName(),
                otp,
                otpExpiryMinutes
        );

        if (otpPrintConsole) {
            System.out.println("Generated OTP : " + otp);
        }

        return "OTP Sent to Registered Email";
    }

    // ================= VERIFY OTP =================

    public String verifyOtp(OtpRequest request) {

        User user = null;

        String username = request.getUsername();

        // Check Email
        if (username != null && username.contains("@")) {
            user = userRepository.findByEmail(username).orElse(null);
        }
        // Check Phone Number
        else if (username != null) {
            user = userRepository.findByPhoneNumber(username).orElse(null);
        }

        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        if (user.getOtp() == null) {
            throw new ResourceNotFoundException("OTP not generated");
        }

        // OTP Expiry Check
        if (user.getOtpExpiry() == null
                || LocalDateTime.now().isAfter(user.getOtpExpiry())) {

            // Clear the expired OTP so it cannot be reused
            user.setOtp(null);
            user.setOtpExpiry(null);
            userRepository.save(user);

            return "OTP has expired. Please request a new one";
        }

        if (!user.getOtp().equals(request.getOtp())) {
            return "Invalid OTP";
        }

        // OTP Verified
        user.setVerified(true);

        userRepository.save(user);

        return "OTP Verified Successfully";
    }

    // ================= RESET PASSWORD =================

    public String resetPassword(ResetPasswordRequest request) {

        User user = null;

        String username = request.getUsername();

        // Check Email
        if (username != null && username.contains("@")) {
            user = userRepository.findByEmail(username).orElse(null);
        }
        // Check Phone Number
        else if (username != null) {
            user = userRepository.findByPhoneNumber(username).orElse(null);
        }

        if (user == null) {
            throw new ResourceNotFoundException("User not found");
        }

        // Check OTP Verification
        if (user.getVerified() == null || !user.getVerified()) {
            return "Please verify OTP first";
        }

        // Empty Password Check
        if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
            return "New Password is required";
        }

        // Password Strength Validation
        String passwordError = validatePasswordStrength(request.getNewPassword());
        if (passwordError != null) {
            return passwordError;
        }

        // Confirm Password Check
        if (request.getConfirmPassword() == null
                || !request.getConfirmPassword().equals(request.getNewPassword())) {
            return "Passwords do not match";
        }

        // Update Password
        user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // Clear OTP + verification state
        user.setOtp(null);
        user.setOtpExpiry(null);
        user.setVerified(false);

        userRepository.save(user);

        return "Password Reset Successfully";
    }

    // ================= PASSWORD STRENGTH HELPER =================

    private String validatePasswordStrength(String password) {

        if (password.length() < 6) {
            return "Password must be at least 6 characters";
        }

        boolean hasLetter = password.matches(".*[A-Za-z].*");
        boolean hasDigit = password.matches(".*[0-9].*");

        if (!hasLetter || !hasDigit) {
            return "Password must contain both letters and numbers";
        }

        return null;
    }

}
