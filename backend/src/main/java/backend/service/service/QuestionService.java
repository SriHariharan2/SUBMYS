package backend.service;

import backend.dto.QuestionForStudentResponse;
import backend.entity.Question;
import backend.entity.Quiz;
import backend.repository.QuestionRepository;
import backend.repository.QuizRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.Collections;
import java.util.List;

@Service
public class QuestionService {

    private final QuestionRepository questionRepository;

    private final QuizRepository quizRepository;

    public QuestionService(
            QuestionRepository questionRepository,
            QuizRepository quizRepository
    ) {

        this.questionRepository =
                questionRepository;

        this.quizRepository =
                quizRepository;
    }

    // =====================================================
    // CREATE QUESTION
    // =====================================================

    public Question createQuestion(
            Long quizId,
            Question question
    ) {

        Quiz quiz =
                quizRepository.findById(quizId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Quiz not found"
                                )
                        );

        question.setQuiz(quiz);

        // =================================================
        // AUTOMATIC QUESTION ORDER
        // =================================================

        Question lastQuestion =
                questionRepository
                        .findTopByQuizIdOrderByQuestionOrderDesc(
                                quizId
                        );

        int nextOrder = 1;

        if (
                lastQuestion != null
                && lastQuestion.getQuestionOrder() != null
        ) {

            nextOrder =
                    lastQuestion.getQuestionOrder() + 1;
        }

        question.setQuestionOrder(
                nextOrder
        );

        return questionRepository.save(
                question
        );
    }

    // =====================================================
    // GET ALL QUESTIONS
    // =====================================================

    public List<Question> getAllQuestions() {

        return questionRepository.findAll();
    }

    // =====================================================
    // GET QUESTION BY ID
    // =====================================================

    public Question getQuestionById(
            Long id
    ) {

        return questionRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Question not found"
                        )
                );
    }

    // =====================================================
    // GET QUESTIONS BY QUIZ
    // =====================================================

    public List<Question> getQuestionsByQuiz(
            Long quizId
    ) {

        return questionRepository
                .findByQuizIdOrderByQuestionOrderAsc(
                        quizId
                );
    }

    // =====================================================
    // GET QUESTIONS FOR STUDENT
    // =====================================================

    public List<QuestionForStudentResponse>
    getQuestionsForStudent(
            Long quizId
    ) {

        return questionRepository
                .findByQuizIdOrderByQuestionOrderAsc(
                        quizId
                )
                .stream()
                .map(
                        question ->
                                new QuestionForStudentResponse(

                                        question.getId(),

                                        question.getQuestionText(),

                                        question.getOptionA(),

                                        question.getOptionB(),

                                        question.getOptionC(),

                                        question.getOptionD(),

                                        question.getMarks()
                                )
                )
                .toList();
    }

    // =====================================================
    // UPDATE QUESTION
    // =====================================================

    public Question updateQuestion(
            Long id,
            Question updatedQuestion
    ) {

        Question question =
                getQuestionById(id);

        question.setQuestionText(
                updatedQuestion.getQuestionText()
        );

        question.setOptionA(
                updatedQuestion.getOptionA()
        );

        question.setOptionB(
                updatedQuestion.getOptionB()
        );

        question.setOptionC(
                updatedQuestion.getOptionC()
        );

        question.setOptionD(
                updatedQuestion.getOptionD()
        );

        question.setCorrectAnswer(
                updatedQuestion.getCorrectAnswer()
        );

        question.setMarks(
                updatedQuestion.getMarks()
        );

        // Do NOT change questionOrder
        // when editing.

        return questionRepository.save(
                question
        );
    }

    // =====================================================
    // DELETE QUESTION
    // =====================================================

    public void deleteQuestion(
            Long id
    ) {

        Question question =
                getQuestionById(id);

        questionRepository.delete(
                question
        );
    }

    // =====================================================
    // SHUFFLE QUESTIONS
    // =====================================================

    @Transactional
    public List<Question> shuffleQuestions(
            Long quizId
    ) {

        Quiz quiz =
                quizRepository.findById(quizId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Quiz not found"
                                )
                        );

        List<Question> questions =
                questionRepository
                        .findByQuizIdOrderByQuestionOrderAsc(
                                quizId
                        );

        if (questions.isEmpty()) {

            return questions;
        }

        // =================================================
        // SHUFFLE
        // =================================================

        Collections.shuffle(
                questions
        );

        // =================================================
        // SAVE NEW ORDER
        // =================================================

        int order = 1;

        for (
                Question question :
                questions
        ) {

            question.setQuiz(quiz);

            question.setQuestionOrder(
                    order++
            );
        }

        return questionRepository.saveAll(
                questions
        );
    }
}