package backend.dto;

public class CourseResponse {

    private Long id;
    private String title;
    private String description;
    private String courseCode;

    private Long instructorId;
    private String instructorName;

    public CourseResponse() {
    }

    public CourseResponse(
            Long id,
            String title,
            String description,
            String courseCode,
            Long instructorId,
            String instructorName
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.courseCode = courseCode;
        this.instructorId = instructorId;
        this.instructorName = instructorName;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public Long getInstructorId() {
        return instructorId;
    }

    public String getInstructorName() {
        return instructorName;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public void setInstructorId(Long instructorId) {
        this.instructorId = instructorId;
    }

    public void setInstructorName(String instructorName) {
        this.instructorName = instructorName;
    }
}