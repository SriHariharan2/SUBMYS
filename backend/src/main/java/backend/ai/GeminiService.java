package backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.Map;

@Service
public class GeminiService {

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com";

    private static final String MODEL =
            "gemini-3.5-flash-lite";

    private final RestClient restClient;
    private final ObjectMapper objectMapper;

    public GeminiService(ObjectMapper objectMapper) {
        this.objectMapper = objectMapper;

        this.restClient = RestClient.builder()
                .baseUrl(GEMINI_URL)
                .build();
    }

    public String askGemini(String prompt) {

        if (prompt == null || prompt.isBlank()) {
            throw new IllegalArgumentException(
                    "Prompt cannot be empty"
            );
        }

        String apiKey = System.getenv("GEMINI_API_KEY");

        if (apiKey == null || apiKey.isBlank()) {
            throw new RuntimeException(
                    "GEMINI_API_KEY environment variable is not set"
            );
        }

        try {

            Map<String, Object> request = Map.of(
                    "contents", new Object[]{
                            Map.of(
                                    "parts", new Object[]{
                                            Map.of(
                                                    "text",
                                                    prompt
                                            )
                                    }
                            )
                    },
                    "generationConfig", Map.of(
                            "temperature", 0.3,
                            "maxOutputTokens", 2500
                    )
            );

            String rawResponse =
                    restClient
                            .post()
                            .uri(uriBuilder -> uriBuilder
                                    .path(
                                            "/v1beta/models/"
                                                    + MODEL
                                                    + ":generateContent"
                                    )
                                    .queryParam(
                                            "key",
                                            apiKey
                                    )
                                    .build()
                            )
                            .contentType(
                                    MediaType.APPLICATION_JSON
                            )
                            .body(request)
                            .retrieve()
                            .body(String.class);

            if (rawResponse == null ||
                    rawResponse.isBlank()) {

                throw new RuntimeException(
                        "Gemini returned an empty response"
                );
            }

            System.out.println(
                    "Gemini response received."
            );

            JsonNode root =
                    objectMapper.readTree(rawResponse);

            JsonNode textNode =
                    root.path("candidates")
                            .path(0)
                            .path("content")
                            .path("parts")
                            .path(0)
                            .path("text");

            if (textNode.isMissingNode() ||
                    textNode.isNull()) {

                throw new RuntimeException(
                        "Gemini response did not contain text: "
                                + rawResponse
                );
            }

            String response =
                    textNode.asText();

            if (response.isBlank()) {
                throw new RuntimeException(
                        "Gemini generated an empty response"
                );
            }

            return response.trim();

        } catch (Exception e) {

            System.err.println(
                    "Gemini API failed: "
                            + e.getMessage()
            );

            throw new RuntimeException(
                    "Gemini API error: "
                            + e.getMessage(),
                    e
            );
        }
    }
}