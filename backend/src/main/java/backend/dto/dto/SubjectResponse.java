package backend.dto;

public class SubjectResponse {

    private Long id;
    private String name;
    private Long courseId;
    private String courseTitle;

    public SubjectResponse() {
    }

    public SubjectResponse(Long id, String name, Long courseId, String courseTitle) {
        this.id = id;
        this.name = name;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
    }

    public Long getId() {
        return id;
    }

    public String getName() {
        return name;
    }

    public Long getCourseId() {
        return courseId;
    }

    public String getCourseTitle() {
        return courseTitle;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setName(String name) {
        this.name = name;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }
}