package backend.dto;

public class GradeResponse {

    private Long id;

    private Double score;

    private Double maxScore;

    private String remarks;

    private Long studentId;
    private String studentName;

    private Long assignmentId;
    private String assignmentTitle;

    private Long quizId;
    private String quizTitle;

    private Long topicId;
    private String topicTitle;

    private Long subjectId;
    private String subjectName;

    private Long courseId;
    private String courseTitle;

    public GradeResponse() {
    }

    public GradeResponse(
            Long id,
            Double score,
            Double maxScore,
            String remarks,
            Long studentId,
            String studentName,
            Long assignmentId,
            String assignmentTitle,
            Long quizId,
            String quizTitle,
            Long topicId,
            String topicTitle,
            Long subjectId,
            String subjectName,
            Long courseId,
            String courseTitle
    ) {
        this.id = id;
        this.score = score;
        this.maxScore = maxScore;
        this.remarks = remarks;
        this.studentId = studentId;
        this.studentName = studentName;
        this.assignmentId = assignmentId;
        this.assignmentTitle = assignmentTitle;
        this.quizId = quizId;
        this.quizTitle = quizTitle;
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

    public Double getScore() {
        return score;
    }

    public Double getMaxScore() {
        return maxScore;
    }

    public String getRemarks() {
        return remarks;
    }

    public Long getStudentId() {
        return studentId;
    }

    public String getStudentName() {
        return studentName;
    }

    public Long getAssignmentId() {
        return assignmentId;
    }

    public String getAssignmentTitle() {
        return assignmentTitle;
    }

    public Long getQuizId() {
        return quizId;
    }

    public String getQuizTitle() {
        return quizTitle;
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

    public void setScore(Double score) {
        this.score = score;
    }

    public void setMaxScore(Double maxScore) {
        this.maxScore = maxScore;
    }

    public void setRemarks(String remarks) {
        this.remarks = remarks;
    }

    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }

    public void setStudentName(String studentName) {
        this.studentName = studentName;
    }

    public void setAssignmentId(Long assignmentId) {
        this.assignmentId = assignmentId;
    }

    public void setAssignmentTitle(String assignmentTitle) {
        this.assignmentTitle = assignmentTitle;
    }

    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }

    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
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