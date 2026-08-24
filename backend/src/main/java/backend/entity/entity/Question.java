package backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "questions")
public class Question {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =====================================================
    // QUESTION
    // =====================================================

    @Column(length = 1000)
    private String questionText;

    // =====================================================
    // OPTIONS
    // =====================================================

    private String optionA;

    private String optionB;

    private String optionC;

    private String optionD;

    // =====================================================
    // CORRECT ANSWER
    // =====================================================

    private String correctAnswer;

    // =====================================================
    // MARKS
    // =====================================================

    private Integer marks;

    // =====================================================
    // QUESTION ORDER
    // =====================================================

    @Column(name = "question_order")
    private Integer questionOrder;

    // =====================================================
    // QUIZ
    // =====================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "quiz_id")
    private Quiz quiz;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public Question() {
    }

    public Question(
            Long id,
            String questionText,
            String optionA,
            String optionB,
            String optionC,
            String optionD,
            String correctAnswer,
            Integer marks,
            Integer questionOrder,
            Quiz quiz
    ) {

        this.id = id;
        this.questionText = questionText;
        this.optionA = optionA;
        this.optionB = optionB;
        this.optionC = optionC;
        this.optionD = optionD;
        this.correctAnswer = correctAnswer;
        this.marks = marks;
        this.questionOrder = questionOrder;
        this.quiz = quiz;
    }

    // =====================================================
    // GETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public String getQuestionText() {
        return questionText;
    }

    public String getOptionA() {
        return optionA;
    }

    public String getOptionB() {
        return optionB;
    }

    public String getOptionC() {
        return optionC;
    }

    public String getOptionD() {
        return optionD;
    }

    public String getCorrectAnswer() {
        return correctAnswer;
    }

    public Integer getMarks() {
        return marks;
    }

    public Integer getQuestionOrder() {
        return questionOrder;
    }

    public Quiz getQuiz() {
        return quiz;
    }

    // =====================================================
    // SETTERS
    // =====================================================

    public void setId(Long id) {
        this.id = id;
    }

    public void setQuestionText(String questionText) {
        this.questionText = questionText;
    }

    public void setOptionA(String optionA) {
        this.optionA = optionA;
    }

    public void setOptionB(String optionB) {
        this.optionB = optionB;
    }

    public void setOptionC(String optionC) {
        this.optionC = optionC;
    }

    public void setOptionD(String optionD) {
        this.optionD = optionD;
    }

    public void setCorrectAnswer(String correctAnswer) {
        this.correctAnswer = correctAnswer;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }

    public void setQuestionOrder(Integer questionOrder) {
        this.questionOrder = questionOrder;
    }

    public void setQuiz(Quiz quiz) {
        this.quiz = quiz;
    }
}