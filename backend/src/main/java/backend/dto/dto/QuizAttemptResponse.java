package backend.dto;

import backend.entity.QuizAttempt;

import java.time.LocalDateTime;

public class QuizAttemptResponse {

    private Long id;

    private Long studentId;

    private Long quizId;

    private String quizTitle;

    private Integer score;

    private Integer totalMarks;

    private LocalDateTime startedAt;

    private LocalDateTime submittedAt;

    private String status;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public QuizAttemptResponse() {
    }


    // =========================================================
    // CONVERT ENTITY -> DTO
    // =========================================================

    public QuizAttemptResponse(QuizAttempt attempt) {

        this.id = attempt.getId();

        if (attempt.getStudent() != null) {
            this.studentId =
                    attempt.getStudent().getId();
        }

        if (attempt.getQuiz() != null) {

            this.quizId =
                    attempt.getQuiz().getId();

            this.quizTitle =
                    attempt.getQuiz().getTitle();
        }

        this.score =
                attempt.getScore();

        this.totalMarks =
                attempt.getTotalMarks();

        this.startedAt =
                attempt.getStartedAt();

        this.submittedAt =
                attempt.getSubmittedAt();

        this.status =
                attempt.getStatus();
    }


    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }


    public Long getStudentId() {
        return studentId;
    }


    public Long getQuizId() {
        return quizId;
    }


    public String getQuizTitle() {
        return quizTitle;
    }


    public Integer getScore() {
        return score;
    }


    public Integer getTotalMarks() {
        return totalMarks;
    }


    public LocalDateTime getStartedAt() {
        return startedAt;
    }


    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }


    public String getStatus() {
        return status;
    }


    // =========================================================
    // SETTERS
    // =========================================================

    public void setId(Long id) {
        this.id = id;
    }


    public void setStudentId(Long studentId) {
        this.studentId = studentId;
    }


    public void setQuizId(Long quizId) {
        this.quizId = quizId;
    }


    public void setQuizTitle(String quizTitle) {
        this.quizTitle = quizTitle;
    }


    public void setScore(Integer score) {
        this.score = score;
    }


    public void setTotalMarks(Integer totalMarks) {
        this.totalMarks = totalMarks;
    }


    public void setStartedAt(LocalDateTime startedAt) {
        this.startedAt = startedAt;
    }


    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }


    public void setStatus(String status) {
        this.status = status;
    }
}