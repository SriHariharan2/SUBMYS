package backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;

import jakarta.persistence.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "quiz_attempts")
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class QuizAttempt {

    // =========================================================
    // ID
    // =========================================================

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;


    // =========================================================
    // STUDENT
    // =========================================================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "student_id")
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler",
            "password"
    })
    private User student;


    // =========================================================
    // QUIZ
    // =========================================================

    @ManyToOne(fetch = FetchType.EAGER)
    @JoinColumn(name = "quiz_id")
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler",
            "questions"
    })
    private Quiz quiz;


    // =========================================================
    // STUDENT ANSWERS
    // =========================================================
    //
    // IMPORTANT:
    //
    // Do NOT serialize studentAnswers here.
    //
    // Otherwise:
    //
    // QuizAttempt
    //    -> StudentAnswer
    //       -> QuizAttempt
    //          -> StudentAnswer
    //             -> ...
    //
    // can create huge/circular JSON.
    // =========================================================

    @JsonIgnore
    @OneToMany(
            mappedBy = "quizAttempt",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    private List<StudentAnswer> studentAnswers;


    // =========================================================
    // SCORE
    // =========================================================

    private Integer score;


    // =========================================================
    // TOTAL MARKS
    // =========================================================

    private Integer totalMarks;


    // =========================================================
    // STARTED TIME
    // =========================================================

    private LocalDateTime startedAt;


    // =========================================================
    // SUBMITTED TIME
    // =========================================================

    private LocalDateTime submittedAt;


    // =========================================================
    // STATUS
    // =========================================================
    //
    // IN_PROGRESS
    // COMPLETED
    //
    // =========================================================

    private String status;


    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public QuizAttempt() {
    }


    // =========================================================
    // FULL CONSTRUCTOR
    // =========================================================

    public QuizAttempt(
            Long id,
            User student,
            Quiz quiz,
            Integer score,
            Integer totalMarks,
            LocalDateTime startedAt,
            LocalDateTime submittedAt,
            String status
    ) {

        this.id = id;

        this.student = student;

        this.quiz = quiz;

        this.score = score;

        this.totalMarks = totalMarks;

        this.startedAt = startedAt;

        this.submittedAt = submittedAt;

        this.status = status;
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
    // GET STUDENT
    // =========================================================

    public User getStudent() {
        return student;
    }


    // =========================================================
    // SET STUDENT
    // =========================================================

    public void setStudent(User student) {
        this.student = student;
    }


    // =========================================================
    // GET QUIZ
    // =========================================================

    public Quiz getQuiz() {
        return quiz;
    }


    // =========================================================
    // SET QUIZ
    // =========================================================

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }


    // =========================================================
    // GET STUDENT ANSWERS
    // =========================================================

    @JsonIgnore
    public List<StudentAnswer> getStudentAnswers() {
        return studentAnswers;
    }


    // =========================================================
    // SET STUDENT ANSWERS
    // =========================================================

    public void setStudentAnswers(
            List<StudentAnswer> studentAnswers
    ) {

        this.studentAnswers = studentAnswers;
    }


    // =========================================================
    // GET SCORE
    // =========================================================

    public Integer getScore() {
        return score;
    }


    // =========================================================
    // SET SCORE
    // =========================================================

    public void setScore(Integer score) {
        this.score = score;
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
    // GET STARTED AT
    // =========================================================

    public LocalDateTime getStartedAt() {
        return startedAt;
    }


    // =========================================================
    // SET STARTED AT
    // =========================================================

    public void setStartedAt(
            LocalDateTime startedAt
    ) {

        this.startedAt = startedAt;
    }


    // =========================================================
    // GET SUBMITTED AT
    // =========================================================

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }


    // =========================================================
    // SET SUBMITTED AT
    // =========================================================

    public void setSubmittedAt(
            LocalDateTime submittedAt
    ) {

        this.submittedAt = submittedAt;
    }


    // =========================================================
    // GET STATUS
    // =========================================================

    public String getStatus() {
        return status;
    }


    // =========================================================
    // SET STATUS
    // =========================================================

    public void setStatus(String status) {
        this.status = status;
    }
}