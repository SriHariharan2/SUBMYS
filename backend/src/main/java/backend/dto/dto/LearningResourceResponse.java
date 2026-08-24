package backend.dto;

public class LearningResourceResponse {

    private Long id;

    private String title;

    private String description;

    private String resourceType;

    private String resourceUrl;

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

    public LearningResourceResponse() {
    }


    public LearningResourceResponse(
            Long id,
            String title,
            String description,
            String resourceType,
            String resourceUrl,

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
        this.resourceType = resourceType;
        this.resourceUrl = resourceUrl;

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

    public String getResourceType() {
        return resourceType;
    }

    public String getResourceUrl() {
        return resourceUrl;
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

    public void setResourceType(String resourceType) {
        this.resourceType = resourceType;
    }

    public void setResourceUrl(String resourceUrl) {
        this.resourceUrl = resourceUrl;
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