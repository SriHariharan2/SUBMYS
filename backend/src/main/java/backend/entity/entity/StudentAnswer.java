package backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "student_answers")
public class StudentAnswer {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Quiz Attempt
    @ManyToOne
    @JoinColumn(name = "attempt_id")
    private QuizAttempt quizAttempt;

    // Question
    @ManyToOne
    @JoinColumn(name = "question_id")
    private Question question;

    // Selected Answer
    private String selectedAnswer;

    public StudentAnswer() {
    }

    public StudentAnswer(Long id,
                         QuizAttempt quizAttempt,
                         Question question,
                         String selectedAnswer) {
        this.id = id;
        this.quizAttempt = quizAttempt;
        this.question = question;
        this.selectedAnswer = selectedAnswer;
    }

    public Long getId() {
        return id;
    }

    public QuizAttempt getQuizAttempt() {
        return quizAttempt;
    }

    public void setQuizAttempt(QuizAttempt quizAttempt) {
        this.quizAttempt = quizAttempt;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Question getQuestion() {
        return question;
    }

    public void setQuestion(Question question) {
        this.question = question;
    }

    public String getSelectedAnswer() {
        return selectedAnswer;
    }

    public void setSelectedAnswer(String selectedAnswer) {
        this.selectedAnswer = selectedAnswer;
    }
}