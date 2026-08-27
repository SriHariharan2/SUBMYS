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

    // =====================================================
    // SENDLIB CONFIGURATION
    // =====================================================

    @Value("${sendlib.api-key}")
    private String sendlibApiKey;

    @Value("${sendlib.url}")
    private String sendlibUrl;

    @Value("${sendlib.from}")
    private String sendlibFrom;

    // =====================================================
    // OTP CONFIGURATION
    // =====================================================

    private static final int OTP_EXPIRATION_MINUTES = 5;

    private final Map<String, OtpData> otpStorage =
            new ConcurrentHashMap<>();


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public OtpService(UserRepository userRepository) {

        this.userRepository = userRepository;

        /*
         * Do NOT use sendlibUrl here.
         *
         * @Value fields are injected after the constructor.
         */
        this.restClient = RestClient.builder()
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

        // -------------------------------------------------
        // CHECK EMAIL
        // -------------------------------------------------

        if (email == null || email.isBlank()) {

            System.err.println(
                    "OTP failed: email is empty"
            );

            return false;
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
                                    () -> new RuntimeException(
                                            "User not found: "
                                                    + normalizedEmail
                                    )
                            );


            // =================================================
            // ROLE CHECK
            // =================================================

            /*
             * STUDENT:
             * No OTP.
             *
             * TEACHER:
             * OTP required.
             *
             * ADMIN:
             * OTP required.
             */

            if (
                    user.getRole() != Role.ADMIN &&
                    user.getRole() != Role.TEACHER
            ) {

                System.out.println(
                        "OTP not required for role: "
                                + user.getRole()
                );

                return false;
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
            // EMAIL HTML
            // =================================================

            String html =
                    "<!DOCTYPE html>"
                    + "<html>"
                    + "<head>"
                    + "<meta charset=\"UTF-8\">"
                    + "<title>SUBMYS Login Verification</title>"
                    + "</head>"

                    + "<body style=\""
                    + "margin:0;"
                    + "padding:0;"
                    + "background:#f4f6f8;"
                    + "font-family:Arial,sans-serif;"
                    + "\">"

                    + "<div style=\""
                    + "max-width:600px;"
                    + "margin:40px auto;"
                    + "background:white;"
                    + "padding:30px;"
                    + "border-radius:12px;"
                    + "\">"

                    + "<h2 style=\""
                    + "color:#2563eb;"
                    + "margin-bottom:20px;"
                    + "\">"
                    + "SUBMYS Login Verification"
                    + "</h2>"

                    + "<p>"
                    + "Hello "
                    + user.getFullName()
                    + ","
                    + "</p>"

                    + "<p>"
                    + "Your SUBMYS login verification code is:"
                    + "</p>"

                    + "<div style=\""
                    + "font-size:32px;"
                    + "font-weight:bold;"
                    + "letter-spacing:8px;"
                    + "text-align:center;"
                    + "padding:20px;"
                    + "margin:25px 0;"
                    + "background:#f3f4f6;"
                    + "border-radius:10px;"
                    + "\">"

                    + otp

                    + "</div>"

                    + "<p>"
                    + "This OTP will expire in "
                    + OTP_EXPIRATION_MINUTES
                    + " minutes."
                    + "</p>"

                    + "<p>"
                    + "If you did not attempt to log in, "
                    + "please ignore this email."
                    + "</p>"

                    + "<p>"
                    + "Regards,<br>"
                    + "<strong>SUBMYS</strong>"
                    + "</p>"

                    + "</div>"

                    + "</body>"
                    + "</html>";


            // =================================================
            // SENDLIB REQUEST
            // =================================================

            Map<String, Object> request =
                    Map.of(
                            "from",
                            sendlibFrom,

                            "to",
                            normalizedEmail,

                            "subject",
                            "SUBMYS Login Verification Code",

                            "html",
                            html
                    );


            // =================================================
            // CALL SENDLIB API
            // =================================================

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "SENDING OTP THROUGH SENDLIB"
            );

            System.out.println(
                    "From: " + sendlibFrom
            );

            System.out.println(
                    "To: " + normalizedEmail
            );

            System.out.println(
                    "======================================"
            );


            String response =
                    restClient
                            .post()
                            .uri(sendlibUrl)
                            .header(
                                    "Authorization",
                                    "Bearer " + sendlibApiKey
                            )
                            .contentType(
                                    MediaType.APPLICATION_JSON
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
                    "SENDLIB OTP SUCCESS"
            );

            System.out.println(
                    "OTP email sent to: "
                            + normalizedEmail
            );

            System.out.println(
                    "Sendlib response: "
                            + response
            );

            System.out.println(
                    "======================================"
            );

            return true;


        } catch (Exception e) {

            // =================================================
            // ERROR
            // =================================================

            System.err.println(
                    "======================================"
            );

            System.err.println(
                    "SENDLIB OTP FAILED"
            );

            System.err.println(
                    "Recipient: "
                            + normalizedEmail
            );

            System.err.println(
                    "Error: "
                            + e.getMessage()
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

        // -------------------------------------------------
        // VALIDATION
        // -------------------------------------------------

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