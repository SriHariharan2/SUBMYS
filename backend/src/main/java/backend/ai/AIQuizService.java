package backend.ai;

import backend.ai.dto.Question;
import backend.ai.dto.QuizGeneratorRequest;
import backend.ai.dto.QuizGeneratorResponse;

import com.fasterxml.jackson.databind.ObjectMapper;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AIQuizService {

    private final OllamaService ollamaService;
    private final ObjectMapper objectMapper;

    public AIQuizService(
            OllamaService ollamaService,
            ObjectMapper objectMapper
    ) {

        this.ollamaService =
                ollamaService;

        this.objectMapper =
                objectMapper;
    }

    public QuizGeneratorResponse generateQuiz(
            QuizGeneratorRequest request
    ) {

        // =====================================================
        // VALIDATE REQUEST
        // =====================================================

        if (request == null) {

            throw new IllegalArgumentException(
                    "Quiz request cannot be null"
            );
        }

        if (request.getSubject() == null ||
                request.getSubject().isBlank()) {

            throw new IllegalArgumentException(
                    "Subject is required"
            );
        }

        if (request.getTopic() == null ||
                request.getTopic().isBlank()) {

            throw new IllegalArgumentException(
                    "Topic is required"
            );
        }

        if (request.getNumberOfQuestions() <= 0) {

            throw new IllegalArgumentException(
                    "Number of questions must be greater than zero"
            );
        }

        if (request.getNumberOfQuestions() > 50) {

            throw new IllegalArgumentException(
                    "Maximum 50 questions are allowed"
            );
        }

        // =====================================================
        // DEFAULT VALUES
        // =====================================================

        String difficulty =
                request.getDifficulty();

        if (difficulty == null ||
                difficulty.isBlank()) {

            difficulty = "Easy";
        }

        String questionType =
                request.getQuestionType();

        if (questionType == null ||
                questionType.isBlank()) {

            questionType = "MCQ";
        }

        // =====================================================
        // PROMPT
        // =====================================================

        String prompt = """
                You are an expert educational quiz generator.

                Generate a quiz using these details:

                Subject: %s
                Topic: %s
                Difficulty: %s
                Question Type: %s
                Number of Questions: %d

                IMPORTANT:

                Return ONLY a valid JSON object.

                Do NOT return Markdown.

                Do NOT use ```json.

                Do NOT use ```.

                Do NOT add any text before the JSON.

                Do NOT add any text after the JSON.

                The JSON must have exactly this structure:

                {
                  "questions": [
                    {
                      "question": "Question text",
                      "options": [
                        "Option A",
                        "Option B",
                        "Option C",
                        "Option D"
                      ],
                      "answer": "Correct answer",
                      "explanation": "Explanation"
                    }
                  ]
                }

                RULES:

                1. Generate exactly %d questions.

                2. Every question must have exactly
                   four options.

                3. Every option must be a string.

                4. The answer must exactly match
                   one of the option strings.

                5. The explanation must explain
                   why the answer is correct.

                6. Do not include question numbers
                   outside the JSON.

                7. For MCQ, always provide exactly
                   four options.

                8. Questions must be appropriate
                   for the requested difficulty.

                9. Do not create duplicate questions.

                10. Return only the JSON object.
                """
                .formatted(
                        request.getSubject().trim(),
                        request.getTopic().trim(),
                        difficulty.trim(),
                        questionType.trim(),
                        request.getNumberOfQuestions(),
                        request.getNumberOfQuestions()
                );

        // =====================================================
        // LOG REQUEST
        // =====================================================

        System.out.println(
                "======================================"
        );

        System.out.println(
                "AI QUIZ REQUEST"
        );

        System.out.println(
                "======================================"
        );

        System.out.println(
                "Subject: "
                        + request.getSubject()
        );

        System.out.println(
                "Topic: "
                        + request.getTopic()
        );

        System.out.println(
                "Difficulty: "
                        + difficulty
        );

        System.out.println(
                "Question Type: "
                        + questionType
        );

        System.out.println(
                "Number of Questions: "
                        + request.getNumberOfQuestions()
        );

        System.out.println(
                "======================================"
        );

        try {

            // =================================================
            // CALL OLLAMA
            // =================================================

            String json =
                    ollamaService.askOllama(
                            prompt
                    );

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "OLLAMA QUIZ JSON"
            );

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    json
            );

            System.out.println(
                    "======================================"
            );

            // =================================================
            // PARSE JSON
            // =================================================

            QuizGeneratorResponse response =
                    objectMapper.readValue(
                            json,
                            QuizGeneratorResponse.class
                    );

            if (response == null) {

                throw new RuntimeException(
                        "Ollama returned null response"
                );
            }

            List<Question> questions =
                    response.getQuestions();

            if (questions == null) {

                throw new RuntimeException(
                        "Ollama response does not contain questions"
                );
            }

            if (questions.isEmpty()) {

                throw new RuntimeException(
                        "Ollama returned zero questions"
                );
            }

            // =================================================
            // VALIDATE NUMBER OF QUESTIONS
            // =================================================

            if (questions.size() !=
                    request.getNumberOfQuestions()) {

                throw new RuntimeException(
                        "Ollama returned "
                                + questions.size()
                                + " questions instead of "
                                + request.getNumberOfQuestions()
                );
            }

            // =================================================
            // VALIDATE EACH QUESTION
            // =================================================

            for (int i = 0;
                 i < questions.size();
                 i++) {

                Question question =
                        questions.get(i);

                if (question == null) {

                    throw new RuntimeException(
                            "Question "
                                    + (i + 1)
                                    + " is null"
                    );
                }

                // ---------------------------------------------
                // Question text
                // ---------------------------------------------

                if (question.getQuestion() == null ||
                        question.getQuestion().isBlank()) {

                    throw new RuntimeException(
                            "Question "
                                    + (i + 1)
                                    + " has empty question text"
                    );
                }

                // ---------------------------------------------
                // Options
                // ---------------------------------------------

                if (question.getOptions() == null) {

                    throw new RuntimeException(
                            "Question "
                                    + (i + 1)
                                    + " has no options"
                    );
                }

                if (question.getOptions().size() != 4) {

                    throw new RuntimeException(
                            "Question "
                                    + (i + 1)
                                    + " must contain exactly 4 options"
                    );
                }

                // ---------------------------------------------
                // Check empty options
                // ---------------------------------------------

                for (String option :
                        question.getOptions()) {

                    if (option == null ||
                            option.isBlank()) {

                        throw new RuntimeException(
                                "Question "
                                        + (i + 1)
                                        + " contains an empty option"
                        );
                    }
                }

                // ---------------------------------------------
                // Answer
                // ---------------------------------------------

                if (question.getAnswer() == null ||
                        question.getAnswer().isBlank()) {

                    throw new RuntimeException(
                            "Question "
                                    + (i + 1)
                                    + " has no answer"
                    );
                }

                // ---------------------------------------------
                // Answer must match option
                // ---------------------------------------------

                boolean answerExists =
                        question.getOptions()
                                .stream()
                                .anyMatch(
                                        option ->
                                                option.trim()
                                                        .equals(
                                                                question
                                                                        .getAnswer()
                                                                        .trim()
                                                        )
                                );

                if (!answerExists) {

                    throw new RuntimeException(
                            "Question "
                                    + (i + 1)
                                    + " answer does not match any option"
                    );
                }

                // ---------------------------------------------
                // Explanation
                // ---------------------------------------------

                if (question.getExplanation() == null ||
                        question.getExplanation().isBlank()) {

                    throw new RuntimeException(
                            "Question "
                                    + (i + 1)
                                    + " has no explanation"
                    );
                }
            }

            // =================================================
            // SUCCESS
            // =================================================

            System.out.println(
                    "======================================"
            );

            System.out.println(
                    "AI QUIZ GENERATED SUCCESSFULLY"
            );

            System.out.println(
                    "Questions: "
                            + questions.size()
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
                    "AI QUIZ GENERATION FAILED"
            );

            System.err.println(
                    "======================================"
            );

            e.printStackTrace();

            System.err.println(
                    "======================================"
            );

            throw new RuntimeException(
                    "Failed to generate AI quiz: "
                            + e.getMessage(),
                    e
            );
        }
    }
}