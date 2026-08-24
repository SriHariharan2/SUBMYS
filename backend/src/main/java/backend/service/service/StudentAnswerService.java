package backend.service;

import backend.entity.Question;
import backend.entity.QuizAttempt;
import backend.entity.StudentAnswer;
import backend.repository.QuestionRepository;
import backend.repository.QuizAttemptRepository;
import backend.repository.StudentAnswerRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StudentAnswerService {

    private final StudentAnswerRepository studentAnswerRepository;
    private final QuizAttemptRepository quizAttemptRepository;
    private final QuestionRepository questionRepository;

    public StudentAnswerService(
            StudentAnswerRepository studentAnswerRepository,
            QuizAttemptRepository quizAttemptRepository,
            QuestionRepository questionRepository
    ) {
        this.studentAnswerRepository = studentAnswerRepository;
        this.quizAttemptRepository = quizAttemptRepository;
        this.questionRepository = questionRepository;
    }

    // Save Student Answer
    public StudentAnswer saveAnswer(
            Long attemptId,
            Long questionId,
            String selectedAnswer
    ) {

        QuizAttempt attempt = quizAttemptRepository.findById(attemptId)
                .orElseThrow(() ->
                        new RuntimeException("Quiz Attempt not found"));

        Question question = questionRepository.findById(questionId)
                .orElseThrow(() ->
                        new RuntimeException("Question not found"));

        StudentAnswer answer = studentAnswerRepository
                .findByQuizAttemptIdAndQuestionId(attemptId, questionId)
                .orElse(new StudentAnswer());

        answer.setQuizAttempt(attempt);
        answer.setQuestion(question);
        answer.setSelectedAnswer(selectedAnswer);

        return studentAnswerRepository.save(answer);
    }

    // Get All Answers of an Attempt
    public List<StudentAnswer> getAnswersByAttempt(Long attemptId) {
        return studentAnswerRepository.findByQuizAttemptId(attemptId);
    }

    // Delete Answer
    public void deleteAnswer(Long id) {

        StudentAnswer answer = studentAnswerRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Answer not found"));

        studentAnswerRepository.delete(answer);
    }
}