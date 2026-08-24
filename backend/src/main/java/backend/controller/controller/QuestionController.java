package backend.controller;

import backend.dto.QuestionForStudentResponse;
import backend.entity.Question;
import backend.service.QuestionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/questions")
@CrossOrigin(origins = "*")
public class QuestionController {

    private final QuestionService questionService;

    public QuestionController(
            QuestionService questionService
    ) {
        this.questionService = questionService;
    }

    // =====================================================
    // CREATE QUESTION
    // =====================================================

    @PostMapping("/{quizId}")
    public Question createQuestion(
            @PathVariable Long quizId,
            @RequestBody Question question
    ) {

        return questionService.createQuestion(
                quizId,
                question
        );
    }

    // =====================================================
    // GET ALL QUESTIONS - ADMIN
    // =====================================================

    @GetMapping
    public List<Question> getAllQuestions() {

        return questionService.getAllQuestions();
    }

    // =====================================================
    // GET QUESTIONS BY QUIZ - ADMIN
    // =====================================================

    @GetMapping("/quiz/{quizId}")
    public List<Question> getQuestionsByQuiz(
            @PathVariable Long quizId
    ) {

        return questionService.getQuestionsByQuiz(
                quizId
        );
    }

    // =====================================================
    // GET QUESTIONS FOR STUDENT
    // =====================================================

    @GetMapping("/quiz/{quizId}/student")
    public List<QuestionForStudentResponse> getQuestionsForStudent(
            @PathVariable Long quizId
    ) {

        return questionService.getQuestionsForStudent(
                quizId
        );
    }

    // =====================================================
    // GET QUESTION BY ID
    // =====================================================

    @GetMapping("/{id}")
    public Question getQuestionById(
            @PathVariable Long id
    ) {

        return questionService.getQuestionById(id);
    }

    // =====================================================
    // UPDATE QUESTION
    // =====================================================

    @PutMapping("/{id}")
    public Question updateQuestion(
            @PathVariable Long id,
            @RequestBody Question question
    ) {

        return questionService.updateQuestion(
                id,
                question
        );
    }

    // =====================================================
    // SHUFFLE QUESTIONS
    // =====================================================

    @PutMapping("/quiz/{quizId}/shuffle")
    public List<Question> shuffleQuestions(
            @PathVariable Long quizId
    ) {

        return questionService.shuffleQuestions(
                quizId
        );
    }

    // =====================================================
    // DELETE QUESTION
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteQuestion(
            @PathVariable Long id
    ) {

        questionService.deleteQuestion(id);

        return "Question deleted successfully.";
    }
}