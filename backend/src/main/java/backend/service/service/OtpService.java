package backend.service;

import backend.entity.Role;
import backend.entity.User;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.scheduling.annotation.Async;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    @Autowired
    private JavaMailSender mailSender;

    @Autowired
    private UserRepository userRepository;


    // =====================================================
    // OTP STORAGE
    // =====================================================

    private final Map<String, OtpData> otpStorage =
            new ConcurrentHashMap<>();


    // =====================================================
    // OTP EXPIRATION
    // =====================================================

    private static final int OTP_EXPIRATION_MINUTES = 5;


    // =====================================================
    // GENERATE OTP
    // =====================================================

    private String generateOtp() {

        SecureRandom random = new SecureRandom();

        int otpNumber =
                100000 + random.nextInt(900000);

        return String.valueOf(otpNumber);
    }


    // =====================================================
    // SEND OTP
    // =====================================================

    @Async
    public void sendOtp(String email) {

        if (email == null || email.isBlank()) {

            System.err.println(
                    "OTP failed: Email is empty"
            );

            return;
        }


        String normalizedEmail =
                email.trim().toLowerCase();


        try {

            // =================================================
            // FIND USER
            // =================================================

            User user =
                    userRepository
                            .findByEmail(normalizedEmail)
                            .orElseThrow(
                                    () ->
                                            new RuntimeException(
                                                    "User not found"
                                            )
                            );


            // =================================================
            // CHECK ROLE
            // =================================================

            if (
                    user.getRole() != Role.ADMIN &&
                    user.getRole() != Role.TEACHER
            ) {

                System.err.println(
                        "OTP not required for user: "
                                + normalizedEmail
                );

                return;
            }


            // =================================================
            // GENERATE OTP
            // =================================================

            String otp =
                    generateOtp();


            // =================================================
            // OTP EXPIRATION
            // =================================================

            LocalDateTime expiresAt =
                    LocalDateTime.now()
                            .plusMinutes(
                                    OTP_EXPIRATION_MINUTES
                            );


            // =================================================
            // SAVE OTP
            // =================================================

            otpStorage.put(
                    normalizedEmail,
                    new OtpData(
                            otp,
                            expiresAt
                    )
            );


            // =================================================
            // CREATE EMAIL
            // =================================================

            SimpleMailMessage message =
                    new SimpleMailMessage();


            message.setTo(
                    normalizedEmail
            );


            message.setSubject(
                    "SUBMYS Login Verification Code"
            );


            message.setText(
                    "Hello "
                            + user.getFullName()
                            + ",\n\n"

                            + "Your SUBMYS login verification code is:\n\n"

                            + otp
                            + "\n\n"

                            + "This OTP will expire in "
                            + OTP_EXPIRATION_MINUTES
                            + " minutes.\n\n"

                            + "If you did not attempt to log in, "
                            + "please ignore this email.\n\n"

                            + "Regards,\n"
                            + "SUBMYS"
            );


            // =================================================
            // LOG
            // =================================================

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "OTP EMAIL"
            );

            System.out.println(
                    "Sending OTP to: "
                            + normalizedEmail
            );

            System.out.println(
                    "OTP generated successfully"
            );

            System.out.println(
                    "======================================"
            );


            // =================================================
            // SEND EMAIL
            // =================================================

            mailSender.send(message);


            // =================================================
            // SUCCESS
            // =================================================

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "OTP EMAIL SENT SUCCESSFULLY"
            );

            System.out.println(
                    "Recipient: "
                            + normalizedEmail
            );

            System.out.println(
                    "======================================"
            );

        } catch (Exception e) {

            // =================================================
            // EMAIL FAILED
            // =================================================

            System.err.println(
                    "======================================"
            );

            System.err.println(
                    "OTP EMAIL FAILED"
            );

            System.err.println(
                    "Recipient: "
                            + normalizedEmail
            );

            System.err.println(
                    "======================================"
            );

            e.printStackTrace();


            // =================================================
            // REMOVE OTP
            // =================================================

            otpStorage.remove(
                    normalizedEmail
            );
        }
    }


    // =====================================================
    // VERIFY OTP
    // =====================================================

    public boolean verifyOtp(
            String email,
            String otp
    ) {

        if (
                email == null ||
                email.isBlank() ||
                otp == null ||
                otp.isBlank()
        ) {

            return false;
        }


        String normalizedEmail =
                email.trim().toLowerCase();


        String normalizedOtp =
                otp.trim();


        // =================================================
        // GET STORED OTP
        // =================================================

        OtpData otpData =
                otpStorage.get(
                        normalizedEmail
                );


        if (otpData == null) {

            return false;
        }


        // =================================================
        // CHECK EXPIRATION
        // =================================================

        if (
                LocalDateTime.now()
                        .isAfter(
                                otpData.getExpiresAt()
                        )
        ) {

            otpStorage.remove(
                    normalizedEmail
            );

            return false;
        }


        // =================================================
        // CHECK OTP
        // =================================================

        if (
                !otpData.getOtp()
                        .equals(normalizedOtp)
        ) {

            return false;
        }


        // =================================================
        // OTP SUCCESS
        // =================================================

        otpStorage.remove(
                normalizedEmail
        );


        return true;
    }


    // =====================================================
    // OTP DATA
    // =====================================================

    private static class OtpData {

        private final String otp;

        private final LocalDateTime expiresAt;


        public OtpData(
                String otp,
                LocalDateTime expiresAt
        ) {

            this.otp = otp;

            this.expiresAt = expiresAt;
        }


        public String getOtp() {

            return otp;
        }


        public LocalDateTime getExpiresAt() {

            return expiresAt;
        }
    }
}