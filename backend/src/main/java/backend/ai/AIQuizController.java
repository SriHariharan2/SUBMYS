package backend.ai;

import backend.ai.dto.QuizGeneratorRequest;
import backend.ai.dto.QuizGeneratorResponse;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(origins = "http://localhost:5173")
public class AIQuizController {

    private final AIQuizService aiQuizService;

    public AIQuizController(
            AIQuizService aiQuizService
    ) {

        this.aiQuizService =
                aiQuizService;
    }

    @PostMapping("/quiz")
    public ResponseEntity<?> generateQuiz(
            @RequestBody QuizGeneratorRequest request
    ) {

        try {

            QuizGeneratorResponse response =
                    aiQuizService.generateQuiz(
                            request
                    );

            return ResponseEntity.ok(
                    response
            );

        } catch (IllegalArgumentException e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            error.put(
                    "status",
                    400
            );

            return ResponseEntity
                    .status(HttpStatus.BAD_REQUEST)
                    .body(error);

        } catch (Exception e) {

            Map<String, Object> error =
                    new HashMap<>();

            error.put(
                    "message",
                    e.getMessage()
            );

            error.put(
                    "status",
                    500
            );

            return ResponseEntity
                    .status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(error);
        }
    }
}