package backend.service;

import backend.entity.Role;
import backend.entity.User;
import backend.repository.UserRepository;

import com.resend.Resend;
import com.resend.services.emails.model.SendEmailRequest;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final UserRepository userRepository;

    private final Resend resend;

    private final String fromEmail;

    private final Map<String, OtpData> otpStorage =
            new ConcurrentHashMap<>();

    private static final int OTP_EXPIRATION_MINUTES = 5;

    public OtpService(
            UserRepository userRepository,
            @Value("${resend.api-key}") String apiKey,
            @Value("${resend.from}") String fromEmail
    ) {

        this.userRepository = userRepository;
        this.resend = new Resend(apiKey);
        this.fromEmail = fromEmail;
    }

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

        otpStorage.put(
                normalizedEmail,
                new OtpData(
                        otp,
                        expiresAt
                )
        );

        try {

            SendEmailRequest request =
                    SendEmailRequest.builder()
                            .from(fromEmail)
                            .to(normalizedEmail)
                            .subject(
                                    "SUBMYS Login Verification Code"
                            )
                            .html(
                                    "<h2>SUBMYS</h2>" +

                                    "<p>Hello "
                                    + user.getFullName()
                                    + ",</p>" +

                                    "<p>Your login verification code is:</p>" +

                                    "<h1>"
                                    + otp
                                    + "</h1>" +

                                    "<p>This OTP will expire in "
                                    + OTP_EXPIRATION_MINUTES
                                    + " minutes.</p>" +

                                    "<p>If you did not attempt to log in, "
                                    + "please ignore this email.</p>" +

                                    "<p>Regards,<br>SUBMYS</p>"
                            )
                            .build();

            resend.emails().send(request);

            System.out.println(
                    "OTP SENT SUCCESSFULLY TO: "
                    + normalizedEmail
            );

        } catch (Exception e) {

            otpStorage.remove(normalizedEmail);

            System.err.println(
                    "RESEND OTP ERROR: "
                    + e.getMessage()
            );

            e.printStackTrace();

            throw new RuntimeException(
                    "Unable to send OTP email"
            );
        }
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
                otpStorage.get(normalizedEmail);

        if (otpData == null) {
            return false;
        }

        if (
                LocalDateTime.now()
                        .isAfter(
                                otpData.getExpiresAt()
                        )
        ) {

            otpStorage.remove(normalizedEmail);

            return false;
        }

        if (
                !otpData.getOtp()
                        .equals(normalizedOtp)
        ) {

            return false;
        }

        otpStorage.remove(normalizedEmail);

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