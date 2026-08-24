package backend.dto;

import java.time.LocalDateTime;


public class AssignmentSubmissionResponse {

    private Long id;

    private Long studentId;
    private String studentName;

    private Long assignmentId;
    private String assignmentTitle;

    private String fileUrl;

    private Double score;

    private String feedback;

    private LocalDateTime submittedAt;

    private Integer maxMarks;

    public AssignmentSubmissionResponse() {
    }

    public AssignmentSubmissionResponse(
            Long id,
            Long studentId,
            String studentName,
            Long assignmentId,
            String assignmentTitle,
               Integer maxMarks,
            String fileUrl,
            Double score,
            String feedback,
            LocalDateTime submittedAt
    ) {
        this.id = id;
        this.studentId = studentId;
        this.studentName = studentName;
        this.assignmentId = assignmentId;
        this.assignmentTitle = assignmentTitle;
        this.maxMarks = maxMarks;
        this.fileUrl = fileUrl;
        this.score = score;
        this.feedback = feedback;
        this.submittedAt = submittedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Long getStudentId() {
        return studentId;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public String getAssignmentTitle() {
        return assignmentTitle;
    }

    public void setAssignmentTitle(String assignmentTitle) {
        this.assignmentTitle = assignmentTitle;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public Double getScore() {
        return score;
    }

    public void setScore(Double score) {
        this.score = score;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }

    public Integer getMaxMarks() {
    return maxMarks;
}

public void setMaxMarks(Integer maxMarks) {
    this.maxMarks = maxMarks;
}
}
