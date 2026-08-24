package backend.dto;

import java.time.LocalDate;

public class AssignmentResponse {

    private Long id;
    private String title;
    private String description;
    private LocalDate dueDate;
    private Integer maxMarks;

    private Long topicId;
    private String topicTitle;

    private Long subjectId;
    private String subjectName;

    private Long courseId;
    private String courseTitle;

    public AssignmentResponse() {
    }

    public AssignmentResponse(
            Long id,
            String title,
            String description,
            LocalDate dueDate,
            Integer maxMarks,
            Long topicId,
            String topicTitle,
            Long subjectId,
            String subjectName,
            Long courseId,
            String courseTitle
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.dueDate = dueDate;
        this.maxMarks = maxMarks;
        this.topicId = topicId;
        this.topicTitle = topicTitle;
        this.subjectId = subjectId;
        this.subjectName = subjectName;
        this.courseId = courseId;
        this.courseTitle = courseTitle;
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

    public LocalDate getDueDate() {
        return dueDate;
    }

    public Integer getMaxMarks() {
        return maxMarks;
    }

    public Long getTopicId() {
        return topicId;
    }

    public String getTopicTitle() {
        return topicTitle;
    }

    public Long getSubjectId() {
        return subjectId;
    }

    public String getSubjectName() {
        return subjectName;
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

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setDueDate(LocalDate dueDate) {
        this.dueDate = dueDate;
    }

    public void setMaxMarks(Integer maxMarks) {
        this.maxMarks = maxMarks;
    }

    public void setTopicId(Long topicId) {
        this.topicId = topicId;
    }

    public void setTopicTitle(String topicTitle) {
        this.topicTitle = topicTitle;
    }

    public void setSubjectId(Long subjectId) {
        this.subjectId = subjectId;
    }

    public void setSubjectName(String subjectName) {
        this.subjectName = subjectName;
    }

    public void setCourseId(Long courseId) {
        this.courseId = courseId;
    }

    public void setCourseTitle(String courseTitle) {
        this.courseTitle = courseTitle;
    }

}