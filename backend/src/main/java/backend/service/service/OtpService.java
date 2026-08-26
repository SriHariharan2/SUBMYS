package backend.service;

import backend.entity.Role;
import backend.entity.User;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class OtpService {

    private final UserRepository userRepository;

    private final RestClient restClient;

    @Value("${resend.api-key}")
    private String resendApiKey;

    @Value("${resend.from}")
    private String resendFrom;

    private static final int OTP_EXPIRATION_MINUTES = 5;

    private final Map<String, OtpData> otpStorage =
            new ConcurrentHashMap<>();


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public OtpService(UserRepository userRepository) {

        this.userRepository = userRepository;

        this.restClient = RestClient.builder()
                .baseUrl("https://api.resend.com")
                .build();
    }


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

    public boolean sendOtp(String email) {

        if (email == null || email.isBlank()) {
            return false;
        }

        String normalizedEmail =
                email.trim().toLowerCase();

        try {

            // -------------------------------------------------
            // FIND USER
            // -------------------------------------------------

            User user =
                    userRepository
                            .findByEmail(normalizedEmail)
                            .orElseThrow(
                                    () -> new RuntimeException(
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

                System.err.println(
                        "OTP not allowed for role: "
                                + user.getRole()
                );

                return false;
            }


            // -------------------------------------------------
            // GENERATE OTP
            // -------------------------------------------------

            String otp =
                    generateOtp();


            // -------------------------------------------------
            // EXPIRATION
            // -------------------------------------------------

            LocalDateTime expiresAt =
                    LocalDateTime.now()
                            .plusMinutes(
                                    OTP_EXPIRATION_MINUTES
                            );


            // -------------------------------------------------
            // SAVE OTP
            // -------------------------------------------------

            otpStorage.put(
                    normalizedEmail,
                    new OtpData(
                            otp,
                            expiresAt
                    )
            );


            // -------------------------------------------------
            // EMAIL TEXT
            // -------------------------------------------------

            String text =
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
                            + "SUBMYS";


            // -------------------------------------------------
            // RESEND REQUEST
            // -------------------------------------------------

            Map<String, Object> request =
                    Map.of(
                            "from", resendFrom,
                            "to", new String[]{
                                    normalizedEmail
                            },
                            "subject",
                            "SUBMYS Login Verification Code",
                            "text",
                            text
                    );


            // -------------------------------------------------
            // SEND USING RESEND
            // -------------------------------------------------

            String response =
                    restClient
                            .post()
                            .uri("/emails")
                            .header(
                                    "Authorization",
                                    "Bearer " + resendApiKey
                            )
                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )
                            .body(request)
                            .retrieve()
                            .body(String.class);


            // -------------------------------------------------
            // SUCCESS
            // -------------------------------------------------

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "RESEND OTP SUCCESS"
            );

            System.out.println(
                    "To: " + normalizedEmail
            );

            System.out.println(
                    "Resend response: " + response
            );

            System.out.println(
                    "======================================"
            );

            return true;


        } catch (Exception e) {

            // -------------------------------------------------
            // ERROR
            // -------------------------------------------------

            System.err.println(
                    "======================================"
            );

            System.err.println(
                    "RESEND OTP FAILED"
            );

            System.err.println(
                    "To: " + normalizedEmail
            );

            System.err.println(
                    "Error: " + e.getMessage()
            );

            e.printStackTrace();

            System.err.println(
                    "======================================"
            );

            return false;
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


        // -------------------------------------------------
        // GET OTP
        // -------------------------------------------------

        OtpData otpData =
                otpStorage.get(
                        normalizedEmail
                );


        if (otpData == null) {

            return false;
        }


        // -------------------------------------------------
        // CHECK EXPIRATION
        // -------------------------------------------------

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


        // -------------------------------------------------
        // CHECK OTP
        // -------------------------------------------------

        if (
                !otpData.getOtp()
                        .equals(normalizedOtp)
        ) {

            return false;
        }


        // -------------------------------------------------
        // REMOVE OTP
        // -------------------------------------------------

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