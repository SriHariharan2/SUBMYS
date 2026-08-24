package backend.dto;

public class TopicResponse {

    private Long id;
    private String title;
    private String content;

    private Long subjectId;
    private String subjectName;

    // NEW
    private Long courseId;
    private String courseTitle;

    public TopicResponse() {
    }

    public TopicResponse(
            Long id,
            String title,
            String content,
            Long subjectId,
            String subjectName,
            Long courseId,
            String courseTitle
    ) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
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

    public String getContent() {
        return content;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public String getSubjectName() {
        return subjectName;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    // NEW

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