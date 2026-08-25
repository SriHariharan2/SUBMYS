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

    private final String resendApiKey;

    private final String resendFrom;


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
    // RESEND API
    // =====================================================

    private static final String RESEND_URL =
            "https://api.resend.com/emails";


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public OtpService(
            UserRepository userRepository,
            @Value("${resend.api-key}") String resendApiKey,
            @Value("${resend.from}") String resendFrom
    ) {

        this.userRepository = userRepository;

        this.resendApiKey = resendApiKey;

        this.resendFrom = resendFrom;

        this.restClient =
                RestClient.builder()
                        .baseUrl(RESEND_URL)
                        .build();
    }


    // =====================================================
    // GENERATE OTP
    // =====================================================

    private String generateOtp() {

        SecureRandom random =
                new SecureRandom();

        int otpNumber =
                100000 + random.nextInt(900000);

        return String.valueOf(otpNumber);
    }


    // =====================================================
    // SEND OTP
    // =====================================================

    public void sendOtp(String email) {

        if (email == null || email.isBlank()) {

            throw new RuntimeException(
                    "Email is required"
            );
        }


        String normalizedEmail =
                email.trim().toLowerCase();


        // =================================================
        // FIND USER
        // =================================================

        User user =
                userRepository
                        .findByEmail(normalizedEmail)
                        .orElseThrow(
                                () -> new RuntimeException(
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

            throw new RuntimeException(
                    "OTP verification is only required for administrators and teachers"
            );
        }


        // =================================================
        // GENERATE OTP
        // =================================================

        String otp =
                generateOtp();


        // =================================================
        // EXPIRATION
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
        // EMAIL SUBJECT
        // =================================================

        String subject =
                "SUBMYS Login Verification Code";


        // =================================================
        // EMAIL CONTENT
        // =================================================

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


        // =================================================
        // LOG
        // =================================================

        System.out.println(
                "======================================"
        );

        System.out.println(
                "SENDING OTP USING RESEND"
        );

        System.out.println(
                "To: " + normalizedEmail
        );

        System.out.println(
                "From: " + resendFrom
        );

        System.out.println(
                "======================================"
        );


        try {

            // =================================================
            // RESEND API REQUEST
            // =================================================

            Map<String, String> request =
                    Map.of(
                            "from", resendFrom,
                            "to", normalizedEmail,
                            "subject", subject,
                            "text", text
                    );


            String response =
                    restClient
                            .post()
                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )
                            .header(
                                    "Authorization",
                                    "Bearer " + resendApiKey
                            )
                            .body(request)
                            .retrieve()
                            .body(String.class);


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
                    "To: " + normalizedEmail
            );

            System.out.println(
                    "Resend response: " + response
            );

            System.out.println(
                    "======================================"
            );

        } catch (Exception e) {

            // =================================================
            // FAILED
            // =================================================

            otpStorage.remove(
                    normalizedEmail
            );

            System.err.println(
                    "======================================"
            );

            System.err.println(
                    "OTP EMAIL FAILED"
            );

            System.err.println(
                    "To: " + normalizedEmail
            );

            System.err.println(
                    "======================================"
            );

            e.printStackTrace();


            throw new RuntimeException(
                    "Unable to send OTP email. Please try again later."
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
        // GET OTP
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