package com.mahesh.login_auth_api.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import com.mahesh.login_auth_api.dto.ForgotPasswordRequest;
import com.mahesh.login_auth_api.dto.LoginRequest;
import com.mahesh.login_auth_api.dto.OtpRequest;
import com.mahesh.login_auth_api.dto.RegisterRequest;
import com.mahesh.login_auth_api.service.AuthService;
import com.mahesh.login_auth_api.dto.ResetPasswordRequest;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthService authService;

    // ================= REGISTER =================

    @PostMapping("/register")
    public String register(@RequestBody RegisterRequest request) {
        return authService.registerUser(request);
    }

    // ================= LOGIN =================

    @PostMapping("/login")
    public String login(@RequestBody LoginRequest request) {
        return authService.loginUser(request);
    }

    // ================= FORGOT PASSWORD =================

    @PostMapping("/forgot-password")
    public String forgotPassword(@RequestBody ForgotPasswordRequest request) {
        return authService.forgotPassword(request);
    }

    // ================= VERIFY OTP =================

    @PostMapping("/verify-otp")
    public String verifyOtp(@RequestBody OtpRequest request) {
        return authService.verifyOtp(request);
    }

    // ================= RESET PASSWORD =================

    @PostMapping("/reset-password")
public String resetPassword(@RequestBody ResetPasswordRequest request) {
    return authService.resetPassword(request);
}
}