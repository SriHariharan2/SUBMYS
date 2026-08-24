package backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.*;

@Entity
@Table(name = "learning_resources")
public class LearningResource {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    private String description;

    private String resourceType;

    private String resourceUrl;

    // =====================================================
    // TOPIC
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    @JsonIgnore
    private Topic topic;


    // =====================================================
    // CONSTRUCTORS
    // =====================================================

    public LearningResource() {
    }


    public LearningResource(
            Long id,
            String title,
            String description,
            String resourceType,
            String resourceUrl,
            Topic topic
    ) {

        this.id = id;

        this.title = title;

        this.description = description;

        this.resourceType = resourceType;

        this.resourceUrl = resourceUrl;

        this.topic = topic;
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

    public Topic getTopic() {
        return topic;
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

    public void setTopic(Topic topic) {
        this.topic = topic;
    }
}