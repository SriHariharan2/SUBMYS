package backend.service;

import backend.entity.Role;
import backend.entity.User;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.mail.SimpleMailMessage;
import org.springframework.mail.javamail.JavaMailSender;
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

    private final Map<String, OtpData> otpStorage =
            new ConcurrentHashMap<>();

    private static final int OTP_EXPIRATION_MINUTES = 5;

    private String generateOtp() {

        SecureRandom random = new SecureRandom();

        int otpNumber =
                100000 + random.nextInt(900000);

        return String.valueOf(otpNumber);
    }

    public void sendOtp(String email) {

        if (email == null || email.isBlank()) {
            throw new RuntimeException("Email is required");
        }

        String normalizedEmail =
                email.trim().toLowerCase();

        User user =
                userRepository
                        .findByEmail(normalizedEmail)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "User not found"
                                )
                        );

        if (
                user.getRole() != Role.ADMIN &&
                user.getRole() != Role.TEACHER
        ) {
            throw new RuntimeException(
                    "OTP verification is only required for administrators and teachers"
            );
        }

        String otp = generateOtp();

        LocalDateTime expiresAt =
                LocalDateTime.now()
                        .plusMinutes(OTP_EXPIRATION_MINUTES);

        // Save OTP immediately
        otpStorage.put(
                normalizedEmail,
                new OtpData(
                        otp,
                        expiresAt
                )
        );

        /*
         * IMPORTANT:
         * Send email in a separate thread so the login request
         * does not have to wait for the SMTP server.
         */
        sendEmailAsync(
                normalizedEmail,
                user.getFullName(),
                otp
        );
    }

    private void sendEmailAsync(
            String email,
            String fullName,
            String otp
    ) {

        Thread emailThread = new Thread(() -> {

            try {

                SimpleMailMessage message =
                        new SimpleMailMessage();

                message.setTo(email);

                message.setSubject(
                        "SUBMYS Login Verification Code"
                );

                message.setText(
                        "Hello "
                                + fullName
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

                mailSender.send(message);

                System.out.println(
                        "OTP email sent successfully to: "
                                + email
                );

            } catch (Exception e) {

                System.err.println(
                        "Failed to send OTP email to: "
                                + email
                );

                e.printStackTrace();
            }

        });

        emailThread.setName("otp-email-thread");

        emailThread.start();
    }

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

        OtpData otpData =
                otpStorage.get(
                        normalizedEmail
                );

        if (otpData == null) {
            return false;
        }

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

        if (
                !otpData.getOtp()
                        .equals(normalizedOtp)
        ) {
            return false;
        }

        otpStorage.remove(
                normalizedEmail
        );

        return true;
    }

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