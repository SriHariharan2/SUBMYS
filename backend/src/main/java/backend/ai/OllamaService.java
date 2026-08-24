package backend.ai;

import com.fasterxml.jackson.databind.JsonNode;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
public class OllamaService {

    // =========================================================
    // GEMINI CONFIGURATION
    // =========================================================

    private static final String GEMINI_URL =
            "https://generativelanguage.googleapis.com";

    /*
     * Gemini model.
     *
     * Your previous model:
     *
     * gemini-2.5-flash-lite
     *
     * was returning 404 for your API key.
     *
     * Use the model shown as available by Gemini
     * in your current API response.
     */
    private static final String MODEL =
            "gemini-3.5-flash-lite";

    private final RestClient restClient;

    private final ObjectMapper objectMapper;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public OllamaService(ObjectMapper objectMapper) {

        this.objectMapper = objectMapper;

        this.restClient =
                RestClient.builder()
                        .baseUrl(GEMINI_URL)
                        .build();
    }


    // =========================================================
    // ASK GEMINI
    // =========================================================

    /*
     * Keep the method name askOllama()
     * so your existing AIService and other
     * classes do not need to be changed.
     *
     * Internally this now calls Gemini.
     */
    public String askOllama(String prompt) {

        if (prompt == null ||
                prompt.isBlank()) {

            throw new IllegalArgumentException(
                    "Prompt cannot be empty"
            );
        }


        // =====================================================
        // GET GEMINI API KEY
        // =====================================================

        String apiKey =
                System.getenv("GEMINI_API_KEY");


        if (apiKey == null ||
                apiKey.isBlank()) {

            throw new RuntimeException(
                    "GEMINI_API_KEY environment variable is not configured"
            );
        }


        try {

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "SENDING REQUEST TO GEMINI"
            );

            System.out.println(
                    "MODEL: " + MODEL
            );

            System.out.println(
                    "======================================"
            );


            // =================================================
            // PART
            // =================================================

            Map<String, Object> part =
                    new HashMap<>();

            part.put(
                    "text",
                    prompt
            );


            // =================================================
            // CONTENT
            // =================================================

            Map<String, Object> content =
                    new HashMap<>();

            content.put(
                    "parts",
                    List.of(part)
            );


            // =================================================
            // GENERATION CONFIG
            // =================================================

            Map<String, Object> generationConfig =
                    new HashMap<>();

            /*
             * Lower temperature gives
             * more predictable educational answers.
             */
            generationConfig.put(
                    "temperature",
                    0.3
            );

            /*
             * Maximum generated tokens.
             */
            generationConfig.put(
                    "maxOutputTokens",
                    2500
            );


            // =================================================
            // REQUEST
            // =================================================

            Map<String, Object> request =
                    new HashMap<>();

            request.put(
                    "contents",
                    List.of(content)
            );

            request.put(
                    "generationConfig",
                    generationConfig
            );


            // =================================================
            // CALL GEMINI
            // =================================================

            System.out.println(
                    "Calling Gemini..."
            );


            String rawResponse =
                    restClient
                            .post()
                            .uri(
                                    uriBuilder ->
                                            uriBuilder
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


            // =================================================
            // VALIDATE RESPONSE
            // =================================================

            if (rawResponse == null ||
                    rawResponse.isBlank()) {

                throw new RuntimeException(
                        "Gemini returned an empty response"
                );
            }


            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "GEMINI RAW RESPONSE"
            );

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    rawResponse
            );


            // =================================================
            // PARSE JSON
            // =================================================

            JsonNode root =
                    objectMapper.readTree(
                            rawResponse
                    );


            if (root == null ||
                    !root.isObject()) {

                throw new RuntimeException(
                        "Invalid response received from Gemini"
                );
            }


            // =================================================
            // CHECK GEMINI ERROR
            // =================================================

            JsonNode errorNode =
                    root.get("error");


            if (errorNode != null &&
                    !errorNode.isNull()) {

                String errorMessage =
                        errorNode
                                .path("message")
                                .asText(
                                        "Unknown Gemini API error"
                                );

                throw new RuntimeException(
                        "Gemini API error: "
                                + errorMessage
                );
            }


            // =================================================
            // CANDIDATES
            // =================================================

            JsonNode candidates =
                    root.get("candidates");


            if (candidates == null ||
                    !candidates.isArray() ||
                    candidates.isEmpty()) {

                throw new RuntimeException(
                        "Gemini response does not contain candidates"
                );
            }


            // =================================================
            // FIRST CANDIDATE
            // =================================================

            JsonNode firstCandidate =
                    candidates.get(0);


            // =================================================
            // CONTENT
            // =================================================

            JsonNode responseContent =
                    firstCandidate.get("content");


            if (responseContent == null ||
                    responseContent.isNull()) {

                throw new RuntimeException(
                        "Gemini response does not contain content"
                );
            }


            // =================================================
            // PARTS
            // =================================================

            JsonNode responseParts =
                    responseContent.get("parts");


            if (responseParts == null ||
                    !responseParts.isArray()) {

                throw new RuntimeException(
                        "Gemini response does not contain parts"
                );
            }


            // =================================================
            // EXTRACT TEXT
            // =================================================

            StringBuilder responseBuilder =
                    new StringBuilder();


            for (JsonNode responsePart :
                    responseParts) {

                JsonNode textNode =
                        responsePart.get("text");


                if (textNode != null &&
                        !textNode.isNull()) {

                    if (!responseBuilder.isEmpty()) {

                        responseBuilder.append("\n");
                    }

                    responseBuilder.append(
                            textNode.asText()
                    );
                }
            }


            String response =
                    responseBuilder
                            .toString()
                            .trim();


            // =================================================
            // EMPTY RESPONSE
            // =================================================

            if (response.isBlank()) {

                throw new RuntimeException(
                        "Gemini generated empty content"
                );
            }


            // =================================================
            // CLEAN JSON
            // =================================================

            response =
                    cleanJsonResponse(
                            response
                    );


            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "CLEAN GEMINI RESPONSE"
            );

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    response
            );

            System.out.println(
                    "======================================"
            );


            return response;


        } catch (Exception e) {

            System.err.println(
                    "======================================"
            );

            System.err.println(
                    "GEMINI FAILED"
            );

            System.err.println(
                    "======================================"
            );

            e.printStackTrace();

            System.err.println(
                    "======================================"
            );


            throw new RuntimeException(
                    "Gemini API error: "
                            + e.getMessage(),
                    e
            );
        }
    }


    // =========================================================
    // CLEAN JSON RESPONSE
    // =========================================================

    private String cleanJsonResponse(
            String response
    ) {

        response =
                response.trim();


        // =====================================================
        // REMOVE ```json
        // =====================================================

        if (response.startsWith("```json")) {

            response =
                    response.substring(7);
        }


        // =====================================================
        // REMOVE ```JSON
        // =====================================================

        else if (response.startsWith("```JSON")) {

            response =
                    response.substring(7);
        }


        // =====================================================
        // REMOVE ```
        // =====================================================

        else if (response.startsWith("```")) {

            response =
                    response.substring(3);
        }


        // =====================================================
        // REMOVE CLOSING ```
        // =====================================================

        if (response.endsWith("```")) {

            response =
                    response.substring(
                            0,
                            response.length() - 3
                    );
        }


        response =
                response.trim();


        /*
         * If Gemini returned JSON surrounded by
         * additional text, extract the JSON object.
         */
        int start =
                response.indexOf("{");

        int end =
                response.lastIndexOf("}");


        if (start >= 0 &&
                end > start) {

            response =
                    response.substring(
                            start,
                            end + 1
                    );
        }


        return response.trim();
    }
}