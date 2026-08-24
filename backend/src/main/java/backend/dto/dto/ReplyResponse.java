package backend.dto;

import java.time.LocalDateTime;

public class ReplyResponse {

    private Long id;

    private String message;

    private LocalDateTime createdAt;

    private Long discussionId;

    private String discussionTitle;

    private Long userId;

    private String userName;

    public ReplyResponse() {
    }

    public ReplyResponse(
            Long id,
            String message,
            LocalDateTime createdAt,
            Long discussionId,
            String discussionTitle,
            Long userId,
            String userName
    ) {
        this.id = id;
        this.message = message;
        this.createdAt = createdAt;
        this.discussionId = discussionId;
        this.discussionTitle = discussionTitle;
        this.userId = userId;
        this.userName = userName;
    }

    public Long getId() {
        return id;
    }

    public String getMessage() {
        return message;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getDiscussionId() {
        return discussionId;
    }

    public String getDiscussionTitle() {
        return discussionTitle;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setMessage(String message) {
        this.message = message;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public void setDiscussionId(Long discussionId) {
        this.discussionId = discussionId;
    }

    public void setDiscussionTitle(String discussionTitle) {
        this.discussionTitle = discussionTitle;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }
}