package backend.dto;

public class QuizResponse {

    // =====================================================
    // QUIZ ID
    // =====================================================

    private Long id;

    // =====================================================
    // TITLE
    // =====================================================

    private String title;

    // =====================================================
    // DESCRIPTION
    // =====================================================

    private String description;

    // =====================================================
    // TOTAL MARKS
    // =====================================================

    private Integer totalMarks;

    // =====================================================
    // DURATION
    // =====================================================

    private Integer durationMinutes;

    // =====================================================
    // MAXIMUM ATTEMPTS
    // =====================================================

    private Integer maxAttempts;

    // =====================================================
    // TOPIC
    // =====================================================

    private Long topicId;

    private String topicTitle;

    // =====================================================
    // SUBJECT
    // =====================================================

    private Long subjectId;

    private String subjectName;

    // =====================================================
    // COURSE
    // =====================================================

    private Long courseId;

    private String courseTitle;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public QuizResponse() {
    }

    public QuizResponse(
            Long id,
            String title,
            String description,
            Integer totalMarks,
            Integer durationMinutes,
            Integer maxAttempts,
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

        this.totalMarks = totalMarks;

        this.durationMinutes = durationMinutes;

        this.maxAttempts =
                maxAttempts != null
                        ? maxAttempts
                        : 1;

        this.topicId = topicId;

        this.topicTitle = topicTitle;

        this.subjectId = subjectId;

        this.subjectName = subjectName;

        this.courseId = courseId;

        this.courseTitle = courseTitle;
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

    public String getDescription() {
        return description;
    }

    public Integer getTotalMarks() {
        return totalMarks;
    }

    public Integer getDurationMinutes() {
        return durationMinutes;
    }

    public Integer getMaxAttempts() {
        return maxAttempts;
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

    // =====================================================
    // SETTERS
    // =====================================================

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }

    public void setMaxAttempts(Integer maxAttempts) {

        if (maxAttempts == null || maxAttempts < 1) {
            this.maxAttempts = 1;
        } else {
            this.maxAttempts = maxAttempts;
        }
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