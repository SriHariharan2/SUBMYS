package backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;
import java.util.List;

@Entity
@JsonIgnoreProperties({"hibernateLazyInitializer","handler"})
@Table(name = "topics")
public class Topic {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String title;

    @Column(length = 5000)
    private String content;

@ManyToOne(fetch = FetchType.LAZY)
@JoinColumn(name = "subject_id")
@JsonIgnoreProperties({
        "topics",
        "hibernateLazyInitializer",
        "handler"
})
private Subject subject;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<Quiz> quizzes;

    @OneToMany(mappedBy = "topic", cascade = CascadeType.ALL)
    @JsonIgnore
    private List<LearningResource> learningResources;

    public Topic() {}

    public Topic(Long id, String title, String content, Subject subject) {
        this.id = id;
        this.title = title;
        this.content = content;
        this.subject = subject;
    }

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getContent() {
        return content;
    }

    public Subject getSubject() {
        return subject;
    }

    public List<Quiz> getQuizzes() {
        return quizzes;
    }

    public List<LearningResource> getLearningResources() {
        return learningResources;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setContent(String content) {
        this.content = content;
    }

    public void setSubject(Subject subject) {
        this.subject = subject;
    }

    public void setQuizzes(List<Quiz> quizzes) {
        this.quizzes = quizzes;
    }

    public void setLearningResources(List<LearningResource> learningResources) {
        this.learningResources = learningResources;
    }
}