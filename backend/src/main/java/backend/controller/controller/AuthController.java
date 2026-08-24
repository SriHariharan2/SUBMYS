package backend.controller;

import backend.dto.AuthResponse;
import backend.dto.LoginRequest;
import backend.dto.OtpLoginResponse;

import backend.service.AuthService;

import jakarta.validation.Valid;

import org.springframework.web.bind.annotation.*;


@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:5173")
public class AuthController {

    private final AuthService authService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AuthController(
            AuthService authService
    ) {

        this.authService = authService;
    }


    // =====================================================
    // LOGIN
    // =====================================================

    @PostMapping("/login")
    public AuthResponse login(
            @Valid @RequestBody LoginRequest request
    ) {

        return authService.login(request);
    }


    // =====================================================
    // VERIFY OTP
    // =====================================================

    @PostMapping("/verify-otp")
    public AuthResponse verifyOtp(
            @RequestParam String email,
            @RequestParam String otp
    ) {

        return authService.verifyOtp(
                email,
                otp
        );
    }


    // =====================================================
    // RESEND OTP
    // =====================================================

    @PostMapping("/resend-otp")
    public OtpLoginResponse resendOtp(
            @RequestParam String email
    ) {

        return authService.resendOtp(
                email
        );
    }
}