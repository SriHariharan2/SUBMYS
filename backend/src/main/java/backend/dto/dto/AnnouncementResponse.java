package backend.dto;

import java.time.LocalDateTime;

public class AnnouncementResponse {

    private Long id;

    private String title;

    private String message;

    private LocalDateTime createdAt;

    private Long courseId;

    private String courseTitle;


    public AnnouncementResponse() {
    }


    public AnnouncementResponse(
            Long id,
            String title,
            String message,
            LocalDateTime createdAt,
            Long courseId,
            String courseTitle
    ) {

        this.id = id;
        this.title = title;
        this.message = message;
        this.createdAt = createdAt;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
    }


    public Long getId() {
        return id;
    }


    public void setId(Long id) {
        this.id = id;
    }


    public String getTitle() {
        return title;
    }


    public void setTitle(String title) {
        this.title = title;
    }


    public String getMessage() {
        return message;
    }


    public void setMessage(String message) {
        this.message = message;
    }


    public LocalDateTime getCreatedAt() {
        return createdAt;
    }


    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }


    public Long getCourseId() {
        return courseId;
    }


    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }


    public String getCourseTitle() {
        return courseTitle;
    }


    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
}