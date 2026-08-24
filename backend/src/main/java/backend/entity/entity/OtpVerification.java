package backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "otp_verifications")
public class OtpVerification {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // USER
    // =====================================================

    @OneToOne
    @JoinColumn(
            name = "user_id",
            nullable = false,
            unique = true
    )
    private User user;


    // =====================================================
    // OTP
    // =====================================================

    @Column(nullable = false)
    private String otp;


    // =====================================================
    // EXPIRATION
    // =====================================================

    @Column(nullable = false)
    private LocalDateTime expiresAt;


    // =====================================================
    // ATTEMPTS
    // =====================================================

    @Column(nullable = false)
    private int attempts = 0;


    // =====================================================
    // CREATED
    // =====================================================

    @Column(nullable = false)
    private LocalDateTime createdAt;


    // =====================================================
    // CONSTRUCTORS
    // =====================================================

    public OtpVerification() {
    }


    public OtpVerification(
            User user,
            String otp,
            LocalDateTime expiresAt,
            LocalDateTime createdAt
    ) {

        this.user = user;
        this.otp = otp;
        this.expiresAt = expiresAt;
        this.createdAt = createdAt;
        this.attempts = 0;
    }


    // =====================================================
    // GETTERS / SETTERS
    // =====================================================

    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public User getUser() {
        return user;
    }


    public void setUser(User user) {
        this.user = user;
    }


    public String getOtp() {
        return otp;
    }


    public void setOtp(String otp) {
        this.otp = otp;
    }


    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }


    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }


    public int getAttempts() {
        return attempts;
    }


    public void setAttempts(int attempts) {
        this.attempts = attempts;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }
}