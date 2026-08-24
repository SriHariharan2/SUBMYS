package backend.service;

import backend.dto.AuthResponse;
import backend.dto.LoginRequest;
import backend.dto.OtpLoginResponse;
import backend.dto.UserResponse;

import backend.entity.Role;
import backend.entity.User;

import backend.repository.UserRepository;

import backend.security.JwtService;

import org.springframework.security.crypto.password.PasswordEncoder;

import org.springframework.stereotype.Service;


@Service
public class AuthService {

    private final UserRepository userRepository;

    private final PasswordEncoder passwordEncoder;

    private final JwtService jwtService;

    private final OtpService otpService;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AuthService(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService,
            OtpService otpService
    ) {

        this.userRepository = userRepository;

        this.passwordEncoder = passwordEncoder;

        this.jwtService = jwtService;

        this.otpService = otpService;
    }


    // =====================================================
    // LOGIN
    // =====================================================

    public AuthResponse login(
            LoginRequest request
    ) {

        // -------------------------------------------------
        // FIND USER
        // -------------------------------------------------

        User user =
                userRepository
                        .findByEmail(
                                request.getEmail()
                        )
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "Invalid email or password"
                                        )
                        );


        // -------------------------------------------------
        // CHECK PASSWORD
        // -------------------------------------------------

        if (
                !passwordEncoder.matches(
                        request.getPassword(),
                        user.getPassword()
                )
        ) {

            throw new RuntimeException(
                    "Invalid email or password"
            );
        }


        // -------------------------------------------------
        // CHECK ROLE
        // -------------------------------------------------

        if (user.getRole() == null) {

            throw new RuntimeException(
                    "User account does not have a valid role"
            );
        }


        // =================================================
        // ADMIN / TEACHER
        // =================================================

        if (
                user.getRole() == Role.ADMIN ||
                user.getRole() == Role.TEACHER
        ) {

            // -------------------------------------------------
            // SEND OTP
            // -------------------------------------------------

            otpService.sendOtp(
                    user.getEmail()
            );


            // -------------------------------------------------
            // USER RESPONSE
            // -------------------------------------------------

            UserResponse userResponse =
                    new UserResponse(
                            user.getId(),
                            user.getFullName(),
                            user.getEmail(),
                            user.getRole()
                    );


            // -------------------------------------------------
            // IMPORTANT
            // NO JWT YET
            // -------------------------------------------------

            return new AuthResponse(
                    null,
                    userResponse,
                    true
            );
        }


        // =================================================
        // STUDENT
        // =================================================

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        UserResponse userResponse =
                new UserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole()
                );


        return new AuthResponse(
                token,
                userResponse,
                false
        );
    }


    // =====================================================
    // VERIFY OTP
    // =====================================================

    public AuthResponse verifyOtp(
            String email,
            String otp
    ) {

        // -------------------------------------------------
        // VERIFY OTP FIRST
        // -------------------------------------------------

        boolean verified =
                otpService.verifyOtp(
                        email,
                        otp
                );


        // -------------------------------------------------
        // STOP IF OTP IS WRONG
        // -------------------------------------------------

        if (!verified) {

            throw new RuntimeException(
                    "Invalid or expired OTP"
            );
        }


        // -------------------------------------------------
        // GET USER
        // -------------------------------------------------

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "User not found"
                                        )
                        );


        // -------------------------------------------------
        // MAKE SURE OTP IS ONLY FOR ADMIN / TEACHER
        // -------------------------------------------------

        if (
                user.getRole() != Role.ADMIN &&
                user.getRole() != Role.TEACHER
        ) {

            throw new RuntimeException(
                    "OTP verification is only required for administrators and teachers"
            );
        }


        // -------------------------------------------------
        // GENERATE JWT AFTER OTP SUCCESS
        // -------------------------------------------------

        String token =
                jwtService.generateToken(
                        user.getEmail()
                );


        // -------------------------------------------------
        // USER RESPONSE
        // -------------------------------------------------

        UserResponse userResponse =
                new UserResponse(
                        user.getId(),
                        user.getFullName(),
                        user.getEmail(),
                        user.getRole()
                );


        // -------------------------------------------------
        // LOGIN COMPLETE
        // -------------------------------------------------

        return new AuthResponse(
                token,
                userResponse,
                false
        );
    }


    // =====================================================
    // RESEND OTP
    // =====================================================

    public OtpLoginResponse resendOtp(
            String email
    ) {

        // -------------------------------------------------
        // FIND USER
        // -------------------------------------------------

        User user =
                userRepository
                        .findByEmail(email)
                        .orElseThrow(
                                () ->
                                        new RuntimeException(
                                                "User not found"
                                        )
                        );


        // -------------------------------------------------
        // CHECK ROLE
        // -------------------------------------------------

        if (
                user.getRole() != Role.ADMIN &&
                user.getRole() != Role.TEACHER
        ) {

            throw new RuntimeException(
                    "OTP is only required for administrators and teachers"
            );
        }


        // -------------------------------------------------
        // SEND NEW OTP
        // -------------------------------------------------

        otpService.sendOtp(
                user.getEmail()
        );


        // -------------------------------------------------
        // RESPONSE
        // -------------------------------------------------

        return new OtpLoginResponse(
                "A new OTP has been sent to your email.",
                true
        );
    }
}