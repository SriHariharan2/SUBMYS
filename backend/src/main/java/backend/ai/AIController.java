package backend.ai;

import backend.ai.dto.ChatRequest;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/ai")
@CrossOrigin(
        origins = "http://localhost:5173",
        allowedHeaders = "*",
        methods = {
                RequestMethod.GET,
                RequestMethod.POST,
                RequestMethod.PUT,
                RequestMethod.DELETE,
                RequestMethod.OPTIONS
        }
)
public class AIController {

    private final AIService aiService;

    public AIController(AIService aiService) {
        this.aiService = aiService;
    }

    @PostMapping("/chat")
    public ResponseEntity<?> chat(
            @RequestBody ChatRequest request
    ) {

        System.out.println("======================================");
        System.out.println("AI CHAT REQUEST");
        System.out.println("======================================");

        try {

            if (request == null) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "Request cannot be null"
                                )
                        );
            }

            if (request.getMessage() == null ||
                    request.getMessage().trim().isEmpty()) {

                return ResponseEntity
                        .badRequest()
                        .body(
                                Map.of(
                                        "error",
                                        "Message cannot be empty"
                                )
                        );
            }

            String message =
                    request.getMessage().trim();

            System.out.println(
                    "User message: " + message
            );

            String response =
                    aiService.chat(message);

            System.out.println(
                    "AI response: " + response
            );

            System.out.println(
                    "======================================"
            );

            return ResponseEntity.ok(
                    new ChatResponse(response)
            );

        } catch (Exception e) {

            System.err.println(
                    "======================================"
            );

            System.err.println(
                    "AI CHAT ERROR"
            );

            System.err.println(
                    "======================================"
            );

            e.printStackTrace();

            return ResponseEntity
                    .internalServerError()
                    .body(
                            Map.of(
                                    "error",
                                    "Failed to contact EduAI",
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unknown error"
                            )
                    );
        }
    }
}