package backend.dto;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public class OtpRequest {

    // =====================================================
    // EMAIL
    // =====================================================

    @NotBlank(message = "Email is required")
    @Email(message = "Please enter a valid email address")
    private String email;


    // =====================================================
    // OTP
    // =====================================================

    @NotBlank(message = "OTP is required")
    @Pattern(
            regexp = "\\d{6}",
            message = "OTP must be exactly 6 digits"
    )
    private String otp;


    // =====================================================
    // DEFAULT CONSTRUCTOR
    // =====================================================

    public OtpRequest() {
    }


    // =====================================================
    // GET EMAIL
    // =====================================================

    public String getEmail() {
        return email;
    }


    // =====================================================
    // SET EMAIL
    // =====================================================

    public void setEmail(String email) {
        this.email = email;
    }


    // =====================================================
    // GET OTP
    // =====================================================

    public String getOtp() {
        return otp;
    }


    // =====================================================
    // SET OTP
    // =====================================================

    public void setOtp(String otp) {
        this.otp = otp;
    }
}