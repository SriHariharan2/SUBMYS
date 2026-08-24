package backend.ai;

import org.springframework.stereotype.Service;

@Service
public class AIService {

    private final GeminiService geminiService;

    public AIService(GeminiService geminiService) {
        this.geminiService = geminiService;
    }

    public String chat(String message) {

        if (message == null || message.isBlank()) {
            throw new IllegalArgumentException(
                    "Message cannot be empty"
            );
        }

        String prompt = """
                You are SUBMYS AI, an AI assistant
                for the SUBMYS Educational Learning Management System.

                Help students learn clearly and accurately.

                Answer the user's question in a helpful,
                educational and easy-to-understand way.

                Do not return JSON for normal chat responses.

                User question:
                %s
                """.formatted(message.trim());

        System.out.println(
                "Sending chat prompt to Gemini..."
        );

        return geminiService.askGemini(prompt);
    }
}