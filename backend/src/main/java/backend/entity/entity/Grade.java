package backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

@Entity
@Table(name = "grades")
public class Grade {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private Double score;

    private Double maxScore;

    private String remarks;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "student_id", nullable = false)
    @JsonIgnoreProperties({
            "password",
            "hibernateLazyInitializer",
            "handler"
    })
    private User student;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "assignment_id")
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Assignment assignment;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Quiz quiz;


    public Grade() {
    }


    public Grade(
            Long id,
            Double score,
            Double maxScore,
            String remarks,
            User student,
            Assignment assignment,
            Quiz quiz
    ) {

        this.id = id;
        this.score = score;
        this.maxScore = maxScore;
        this.remarks = remarks;
        this.student = student;
        this.assignment = assignment;
        this.quiz = quiz;
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


    public User getStudent() {
        return student;
    }


    public Assignment getAssignment() {
        return assignment;
    }


    public Quiz getQuiz() {
        return quiz;
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


    public void setStudent(User student) {
        this.student = student;
    }


    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }


    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
}