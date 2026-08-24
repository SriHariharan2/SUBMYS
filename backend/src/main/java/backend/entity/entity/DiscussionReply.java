package backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "discussion_replies")
public class DiscussionReply {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(columnDefinition = "TEXT")
    private String message;

    private LocalDateTime createdAt;

    @ManyToOne
    @JoinColumn(name = "discussion_post_id")
    @JsonIgnore
    private DiscussionPost discussionPost;

    @ManyToOne
    @JoinColumn(name = "user_id")
    private User user;

    public DiscussionReply() {
    }

    @PrePersist
    public void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    // ================= GETTERS =================

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public DiscussionPost getDiscussionPost() {
        return discussionPost;
    }

    public User getUser() {
        return user;
    }

        // ================= SETTERS =================

    public void setId(Long id) {
        this.id = id;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setDiscussionPost(DiscussionPost discussionPost) {
        this.discussionPost = discussionPost;
    }

    public void setUser(User user) {
        this.user = user;
    }

}