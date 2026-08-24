package backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.List;

@Entity
@Table(name = "quizzes")
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class Quiz {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // TITLE
    // =========================================================

    private String title;


    // =========================================================
    // DESCRIPTION
    // =========================================================

    private String description;


    // =========================================================
    // TOTAL MARKS
    // =========================================================

    private Integer totalMarks;


    // =========================================================
    // DURATION
    // =========================================================

    private Integer durationMinutes;


    // =========================================================
    // MAXIMUM ATTEMPTS
    // =========================================================
    //
    // Example:
    //
    // 1 = student can attempt once
    // 2 = student can attempt twice
    //
    // Default is 1.
    // =========================================================

    @Column(nullable = false)
    private Integer maxAttempts = 1;


    // =========================================================
    // TOPIC
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "topic_id")
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Topic topic;


    // =========================================================
    // QUESTIONS
    // =========================================================

    @JsonIgnore
    @OneToMany(
            mappedBy = "quiz",
            cascade = CascadeType.ALL
    )
    private List<Question> questions;


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public Quiz() {
    }


    // =========================================================
    // FULL CONSTRUCTOR
    // =========================================================

    public Quiz(
            Long id,
            String title,
            String description,
            Integer totalMarks,
            Integer durationMinutes,
            Integer maxAttempts,
            Topic topic,
            List<Question> questions
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

        this.topic = topic;

        this.questions = questions;
    }


    // =========================================================
    // GET ID
    // =========================================================

    public Long getId() {
        return id;
    }


    // =========================================================
    // SET ID
    // =========================================================

    public void setId(Long id) {
        this.id = id;
    }


    // =========================================================
    // GET TITLE
    // =========================================================

    public String getTitle() {
        return title;
    }


    // =========================================================
    // SET TITLE
    // =========================================================

    public void setTitle(String title) {
        this.title = title;
    }


    // =========================================================
    // GET DESCRIPTION
    // =========================================================

    public String getDescription() {
        return description;
    }


    // =========================================================
    // SET DESCRIPTION
    // =========================================================

    public void setDescription(String description) {
        this.description = description;
    }


    // =========================================================
    // GET TOTAL MARKS
    // =========================================================

    public Integer getTotalMarks() {
        return totalMarks;
    }


    // =========================================================
    // SET TOTAL MARKS
    // =========================================================

    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }


    // =========================================================
    // GET DURATION
    // =========================================================

    public Integer getDurationMinutes() {
        return durationMinutes;
    }


    // =========================================================
    // SET DURATION
    // =========================================================

    public void setDurationMinutes(Integer durationMinutes) {
        this.durationMinutes = durationMinutes;
    }


    // =========================================================
    // GET MAX ATTEMPTS
    // =========================================================

    public Integer getMaxAttempts() {
        return maxAttempts;
    }


    // =========================================================
    // SET MAX ATTEMPTS
    // =========================================================

    public void setMaxAttempts(Integer maxAttempts) {

        if (maxAttempts == null || maxAttempts < 1) {
            this.maxAttempts = 1;
        } else {
            this.maxAttempts = maxAttempts;
        }
    }


    // =========================================================
    // GET TOPIC
    // =========================================================

    public Topic getTopic() {
        return topic;
    }


    // =========================================================
    // SET TOPIC
    // =========================================================

    public void setTopic(Topic topic) {
        this.topic = topic;
    }


    // =========================================================
    // GET QUESTIONS
    // =========================================================

    public List<Question> getQuestions() {
        return questions;
    }


    // =========================================================
    // SET QUESTIONS
    // =========================================================

    public void setQuestions(List<Question> questions) {
        this.questions = questions;
    }
}