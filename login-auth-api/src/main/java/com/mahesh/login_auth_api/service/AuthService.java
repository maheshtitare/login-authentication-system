package com.mahesh.login_auth_api.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.mahesh.login_auth_api.dto.ForgotPasswordRequest;
import com.mahesh.login_auth_api.dto.LoginRequest;
import com.mahesh.login_auth_api.dto.OtpRequest;
import com.mahesh.login_auth_api.dto.RegisterRequest;
import com.mahesh.login_auth_api.dto.ResetPasswordRequest;
import com.mahesh.login_auth_api.entity.User;
import com.mahesh.login_auth_api.repository.UserRepository;
import com.mahesh.login_auth_api.util.OtpGenerator;
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
        if (!request.getEmail().matches("^[A-Za-z0-9+_.-]+@[A-Za-z0-9.-]+$")) {
            return "Invalid Email Format";
        }

        // Empty Phone Number Check
        if (request.getPhoneNumber() == null || request.getPhoneNumber().trim().isEmpty()) {
            return "Phone Number is required";
        }

        // Empty Password Check
        if (request.getPassword() == null || request.getPassword().trim().isEmpty()) {
            return "Password is required";
        }

        // Password Length Validation
        if (request.getPassword().length() < 6) {
            return "Password must be at least 6 characters";
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

    User user = userRepository.findByEmail(request.getEmail()).orElse(null);

    if (user == null) {
        throw new ResourceNotFoundException("User not found");
    }

 if (!passwordEncoder.matches(request.getPassword(), user.getPassword())) {
    return "Invalid Password";
}

    String token = jwtUtil.generateToken(user.getEmail());

return token;
}
    // ================= FORGOT PASSWORD =================

    public String forgotPassword(ForgotPasswordRequest request) {

        User user = null;

        String username = request.getUsername();

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

        userRepository.save(user);

        System.out.println("Generated OTP : " + otp);

        return "OTP Generated Successfully";
    }

    // ================= VERIFY OTP =================

    public String verifyOtp(OtpRequest request) {

        User user = null;

        String username = request.getUsername();

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

       if (user.getOtp() == null) {
    throw new ResourceNotFoundException("OTP not generated");
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

        // Check OTP Verification
         if (!user.getVerified()) {
         return "Please verify OTP first";
}

        // Empty Password Check
        if (request.getNewPassword() == null || request.getNewPassword().trim().isEmpty()) {
            return "New Password is required";
        }

        // Password Length Validation
        if (request.getNewPassword().length() < 6) {
            return "Password must be at least 6 characters";
        }

        // Update Password
    user.setPassword(passwordEncoder.encode(request.getNewPassword()));

        // Clear OTP
        user.setOtp(null);

        // Reset Verification Status
        user.setVerified(false);

        userRepository.save(user);

        return "Password Reset Successfully";
    }

}