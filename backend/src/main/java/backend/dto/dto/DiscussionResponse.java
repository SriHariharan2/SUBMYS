package backend.dto;

import java.time.LocalDateTime;

public class DiscussionResponse {

    private Long id;

    private String title;

    private String content;

    private LocalDateTime createdAt;

    private Long courseId;

    private String courseTitle;

    private Long userId;

    private String userName;

    private boolean discussionEnabled;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public DiscussionResponse(
            Long id,
            String title,
            String content,
            LocalDateTime createdAt,
            Long courseId,
            String courseTitle,
            Long userId,
            String userName,
            boolean discussionEnabled
    ) {

        this.id = id;

        this.title = title;

        this.content = content;

        this.createdAt = createdAt;

        this.courseId = courseId;

        this.courseTitle = courseTitle;

        this.userId = userId;

        this.userName = userName;

        this.discussionEnabled =
                discussionEnabled;
    }

    // =====================================================
    // GETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public Long getUserId() {
        return userId;
    }

    public String getUserName() {
        return userName;
    }

    public boolean isDiscussionEnabled() {
        return discussionEnabled;
    }

    // =====================================================
    // SETTERS
    // =====================================================

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setCreatedAt(
            LocalDateTime createdAt
    ) {
        this.createdAt = createdAt;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public void setCourseTitle(
            String courseTitle
    ) {
        this.courseTitle = courseTitle;
    }

    public void setUserId(Long userId) {
        this.userId = userId;
    }

    public void setUserName(String userName) {
        this.userName = userName;
    }

    public void setDiscussionEnabled(
            boolean discussionEnabled
    ) {
        this.discussionEnabled =
                discussionEnabled;
    }
}