package backend.dto;

public class OtpLoginResponse {

    private String message;

    private boolean verified;


    public OtpLoginResponse(
            String message,
            boolean verified
    ) {

        this.message = message;

        this.verified = verified;
    }


    public String getMessage() {

        return message;
    }


    public boolean isVerified() {

        return verified;
    }
}