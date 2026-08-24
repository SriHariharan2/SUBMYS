package backend.dto;

public class AuthResponse {

    private String token;

    private UserResponse user;

    private boolean otpRequired;


    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public AuthResponse(
            String token,
            UserResponse user,
            boolean otpRequired
    ) {

        this.token = token;

        this.user = user;

        this.otpRequired = otpRequired;
    }


    // =====================================================
    // GET TOKEN
    // =====================================================

    public String getToken() {

        return token;
    }


    // =====================================================
    // GET USER
    // =====================================================

    public UserResponse getUser() {

        return user;
    }


    // =====================================================
    // OTP REQUIRED
    // =====================================================

    public boolean isOtpRequired() {

        return otpRequired;
    }
}