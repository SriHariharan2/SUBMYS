package backend.controller;

import backend.dto.QuizResponse;
import backend.entity.Quiz;
import backend.service.QuizService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/quizzes")
@CrossOrigin(origins = "*")
public class QuizController {

    private final QuizService quizService;


    public QuizController(
            QuizService quizService
    ) {

        this.quizService =
                quizService;
    }


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping("/{topicId}")
    public Quiz createQuiz(
            @PathVariable Long topicId,
            @RequestBody Quiz quiz
    ) {

        return quizService.createQuiz(
                topicId,
                quiz
        );
    }


    // =====================================================
    // GET ALL
    // =====================================================
    //
    // ADMIN
    //
    // =====================================================

    @GetMapping
    public List<QuizResponse> getAllQuizzes() {

        return quizService.getAllQuizzes();
    }


    // =====================================================
    // GET QUIZZES FOR STUDENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}"
    )
    public List<QuizResponse> getQuizzesForStudent(
            @PathVariable Long studentId
    ) {

        return quizService
                .getQuizzesForStudent(
                        studentId
                );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public QuizResponse getQuizById(
            @PathVariable Long id
    ) {

        return quizService.getQuizById(id);
    }


    // =====================================================
    // GET QUIZ FOR STUDENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}/{quizId}"
    )
    public QuizResponse getQuizForStudent(

            @PathVariable Long studentId,

            @PathVariable Long quizId

    ) {

        return quizService
                .getQuizForStudent(
                        studentId,
                        quizId
                );
    }


    // =====================================================
    // GET BY TOPIC
    // =====================================================

    @GetMapping(
            "/topic/{topicId}"
    )
    public List<QuizResponse> getQuizzesByTopic(
            @PathVariable Long topicId
    ) {

        return quizService
                .getQuizzesByTopic(
                        topicId
                );
    }


    // =====================================================
    // GET BY TOPIC FOR STUDENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}/topic/{topicId}"
    )
    public List<QuizResponse>
    getQuizzesByTopicForStudent(

            @PathVariable Long studentId,

            @PathVariable Long topicId

    ) {

        return quizService
                .getQuizzesByTopicForStudent(
                        studentId,
                        topicId
                );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public Quiz updateQuiz(
            @PathVariable Long id,
            @RequestBody Quiz quiz
    ) {

        return quizService.updateQuiz(
                id,
                quiz
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteQuiz(
            @PathVariable Long id
    ) {

        quizService.deleteQuiz(id);

        return "Quiz deleted successfully.";
    }
}