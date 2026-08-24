package backend.controller;

import backend.entity.QuizAttempt;
import backend.entity.Quiz;
import backend.service.QuizAttemptService;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;
import java.util.Optional;


@RestController
@RequestMapping("/api/quiz-attempts")
@CrossOrigin(origins = "*")
public class QuizAttemptController {

    private final QuizAttemptService quizAttemptService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public QuizAttemptController(
            QuizAttemptService quizAttemptService
    ) {

        this.quizAttemptService =
                quizAttemptService;
    }


    // =========================================================
    // CONVERT ATTEMPT TO SAFE RESPONSE
    // =========================================================

    private Map<String, Object> toResponse(
            QuizAttempt attempt
    ) {

        Map<String, Object> response =
                new HashMap<>();


        // =====================================================
        // BASIC ATTEMPT INFORMATION
        // =====================================================

        response.put(
                "id",
                attempt.getId()
        );


        response.put(
                "studentId",
                attempt.getStudent() != null
                        ? attempt.getStudent().getId()
                        : null
        );


        response.put(
                "quizId",
                attempt.getQuiz() != null
                        ? attempt.getQuiz().getId()
                        : null
        );


        response.put(
                "score",
                attempt.getScore() != null
                        ? attempt.getScore()
                        : 0
        );


        response.put(
                "totalMarks",
                attempt.getTotalMarks() != null
                        ? attempt.getTotalMarks()
                        : 0
        );


        response.put(
                "status",
                attempt.getStatus()
        );


        response.put(
                "startedAt",
                attempt.getStartedAt()
        );


        response.put(
                "submittedAt",
                attempt.getSubmittedAt()
        );


        // =====================================================
        // STUDENT
        // =====================================================

        if (attempt.getStudent() != null) {

            Map<String, Object> student =
                    new HashMap<>();


            student.put(
                    "id",
                    attempt.getStudent().getId()
            );


            student.put(
                    "fullName",
                    attempt.getStudent().getFullName()
            );


            student.put(
                    "email",
                    attempt.getStudent().getEmail()
            );


            response.put(
                    "student",
                    student
            );
        }


        // =====================================================
        // QUIZ
        // =====================================================

        if (attempt.getQuiz() != null) {

            Map<String, Object> quiz =
                    new HashMap<>();


            quiz.put(
                    "id",
                    attempt.getQuiz().getId()
            );


            quiz.put(
                    "title",
                    attempt.getQuiz().getTitle()
            );


            quiz.put(
                    "totalMarks",
                    attempt.getQuiz().getTotalMarks()
            );


            quiz.put(
                    "durationMinutes",
                    attempt.getQuiz().getDurationMinutes()
            );


            // =================================================
            // MAXIMUM ATTEMPTS
            // =================================================

            Integer maxAttempts =
                    attempt.getQuiz().getMaxAttempts();


            if (
                    maxAttempts == null
                    || maxAttempts < 1
            ) {

                maxAttempts = 1;
            }


            quiz.put(
                    "maxAttempts",
                    maxAttempts
            );


            response.put(
                    "quiz",
                    quiz
            );


            // =================================================
            // ATTEMPT COUNT
            // =================================================

            if (
                    attempt.getStudent() != null
                    && attempt.getStudent().getId() != null
                    && attempt.getQuiz().getId() != null
            ) {

                long attemptCount =
                        quizAttemptService.getAttemptCount(
                                attempt.getStudent().getId(),
                                attempt.getQuiz().getId()
                        );


                response.put(
                        "attemptCount",
                        attemptCount
                );


                response.put(
                        "remainingAttempts",
                        Math.max(
                                0,
                                maxAttempts - attemptCount
                        )
                );


                response.put(
                        "attempted",
                        attemptCount > 0
                );


                response.put(
                        "completed",
                        "COMPLETED".equalsIgnoreCase(
                                attempt.getStatus()
                        )
                );
            }
        }


        return response;
    }


    // =========================================================
    // START / RESUME QUIZ
    // =========================================================

    @PostMapping(
            "/start/{studentId}/{quizId}"
    )
    public ResponseEntity<?> startQuiz(

            @PathVariable Long studentId,

            @PathVariable Long quizId

    ) {

        try {

            QuizAttempt attempt =
                    quizAttemptService.startQuiz(
                            studentId,
                            quizId
                    );


            return ResponseEntity.ok(
                    toResponse(attempt)
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.BAD_REQUEST
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "Bad Request",

                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to start quiz."
                            )
                    );
        }
    }


    // =========================================================
    // GET ALL ATTEMPTS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Map<String, Object>>>
    getAllAttempts() {

        List<Map<String, Object>> result =
                quizAttemptService
                        .getAllAttempts()
                        .stream()
                        .map(this::toResponse)
                        .toList();


        return ResponseEntity.ok(
                result
        );
    }


    // =========================================================
    // GET ATTEMPT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<?> getAttemptById(

            @PathVariable Long id

    ) {

        try {

            QuizAttempt attempt =
                    quizAttemptService
                            .getAttemptById(id);


            return ResponseEntity.ok(
                    toResponse(attempt)
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.NOT_FOUND
                    )
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Attempt not found."
                            )
                    );
        }
    }


    // =========================================================
    // GET ATTEMPTS BY STUDENT
    // =========================================================

    @GetMapping(
            "/student/{studentId}"
    )
    public ResponseEntity<List<Map<String, Object>>>
    getAttemptsByStudent(

            @PathVariable Long studentId

    ) {

        List<Map<String, Object>> result =
                quizAttemptService
                        .getAttemptsByStudent(
                                studentId
                        )
                        .stream()
                        .map(this::toResponse)
                        .toList();


        return ResponseEntity.ok(
                result
        );
    }


    // =========================================================
    // GET ATTEMPTS BY QUIZ
    // =========================================================

    @GetMapping(
            "/quiz/{quizId}"
    )
    public ResponseEntity<List<Map<String, Object>>>
    getAttemptsByQuiz(

            @PathVariable Long quizId

    ) {

        List<Map<String, Object>> result =
                quizAttemptService
                        .getAttemptsByQuiz(
                                quizId
                        )
                        .stream()
                        .map(this::toResponse)
                        .toList();


        return ResponseEntity.ok(
                result
        );
    }


    // =========================================================
    // GET EXACT STUDENT + QUIZ ATTEMPT
    // =========================================================

    @GetMapping(
            "/student/{studentId}/quiz/{quizId}"
    )
    public ResponseEntity<?> getAttemptByStudentAndQuiz(

            @PathVariable Long studentId,

            @PathVariable Long quizId

    ) {

        try {

            Optional<QuizAttempt> optionalAttempt =
                    quizAttemptService
                            .getAttemptByStudentAndQuiz(
                                    studentId,
                                    quizId
                            );


            // =================================================
            // NO ATTEMPT
            // =================================================

            if (optionalAttempt.isEmpty()) {

                return ResponseEntity
                        .status(
                                HttpStatus.NOT_FOUND
                        )
                        .body(
                                Map.of(
                                        "message",
                                        "No quiz attempt found."
                                )
                        );
            }


            // =================================================
            // ATTEMPT FOUND
            // =================================================

            QuizAttempt attempt =
                    optionalAttempt.get();


            return ResponseEntity.ok(
                    toResponse(attempt)
            );


        } catch (Exception e) {

            e.printStackTrace();


            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "Internal Server Error",

                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to load attempt."
                            )
                    );
        }
    }


    // =========================================================
    // GET ATTEMPT SUMMARY
    // =========================================================

    @GetMapping(
            "/student/{studentId}/quiz/{quizId}/summary"
    )
    public ResponseEntity<?> getAttemptSummary(

            @PathVariable Long studentId,

            @PathVariable Long quizId

    ) {

        try {

            // =================================================
            // GET ALL STUDENT ATTEMPTS
            // =================================================

            List<QuizAttempt> studentAttempts =
                    quizAttemptService
                            .getAttemptsByStudent(
                                    studentId
                            );


            // =================================================
            // FIND ATTEMPTS FOR THIS QUIZ
            // =================================================

            List<QuizAttempt> matchingAttempts =
                    studentAttempts
                            .stream()
                            .filter(
                                    attempt ->
                                            attempt != null
                                            &&
                                            attempt.getQuiz() != null
                                            &&
                                            attempt.getQuiz().getId() != null
                                            &&
                                            attempt.getQuiz()
                                                    .getId()
                                                    .equals(quizId)
                            )
                            .toList();


            // =================================================
            // GET QUIZ
            // =================================================

            Quiz quiz = null;


            if (!matchingAttempts.isEmpty()) {

                quiz =
                        matchingAttempts
                                .get(0)
                                .getQuiz();
            }


            // =================================================
            // ATTEMPT COUNT
            // =================================================

            long attemptCount =
                    matchingAttempts.size();


            // =================================================
            // DEFAULT MAX ATTEMPTS
            // =================================================

            int maxAttempts = 1;


            if (quiz != null) {

                if (
                        quiz.getMaxAttempts() != null
                        &&
                        quiz.getMaxAttempts() > 0
                ) {

                    maxAttempts =
                            quiz.getMaxAttempts();
                }
            }


            // =================================================
            // FIND LATEST ATTEMPT
            // =================================================

            Optional<QuizAttempt> latestAttempt =
                    matchingAttempts
                            .stream()
                            .sorted(
                                    (a, b) -> {

                                        if (
                                                a.getStartedAt()
                                                        == null
                                                &&
                                                b.getStartedAt()
                                                        == null
                                        ) {

                                            return 0;
                                        }


                                        if (
                                                a.getStartedAt()
                                                        == null
                                        ) {

                                            return 1;
                                        }


                                        if (
                                                b.getStartedAt()
                                                        == null
                                        ) {

                                            return -1;
                                        }


                                        return b.getStartedAt()
                                                .compareTo(
                                                        a.getStartedAt()
                                                );
                                    }
                            )
                            .findFirst();


            // =================================================
            // RESPONSE
            // =================================================

            Map<String, Object> response =
                    new HashMap<>();


            response.put(
                    "studentId",
                    studentId
            );


            response.put(
                    "quizId",
                    quizId
            );


            response.put(
                    "attemptCount",
                    attemptCount
            );


            response.put(
                    "maxAttempts",
                    maxAttempts
            );


            response.put(
                    "remainingAttempts",
                    Math.max(
                            0,
                            maxAttempts - attemptCount
                    )
            );


            response.put(
                    "attempted",
                    attemptCount > 0
            );


            if (latestAttempt.isPresent()) {

                QuizAttempt attempt =
                        latestAttempt.get();


                response.put(
                        "attemptId",
                        attempt.getId()
                );


                response.put(
                        "status",
                        attempt.getStatus()
                );


                response.put(
                        "score",
                        attempt.getScore() != null
                                ? attempt.getScore()
                                : 0
                );


                response.put(
                        "totalMarks",
                        attempt.getTotalMarks() != null
                                ? attempt.getTotalMarks()
                                : 0
                );


                response.put(
                        "startedAt",
                        attempt.getStartedAt()
                );


                response.put(
                        "submittedAt",
                        attempt.getSubmittedAt()
                );


                response.put(
                        "completed",
                        "COMPLETED".equalsIgnoreCase(
                                attempt.getStatus()
                        )
                );

            } else {

                response.put(
                        "attemptId",
                        null
                );


                response.put(
                        "status",
                        "NOT_ATTEMPTED"
                );


                response.put(
                        "score",
                        0
                );


                response.put(
                        "totalMarks",
                        0
                );


                response.put(
                        "startedAt",
                        null
                );


                response.put(
                        "submittedAt",
                        null
                );


                response.put(
                        "completed",
                        false
                );
            }


            return ResponseEntity.ok(
                    response
            );


        } catch (Exception e) {

            e.printStackTrace();


            return ResponseEntity
                    .status(
                            HttpStatus.INTERNAL_SERVER_ERROR
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "Internal Server Error",

                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to get attempt summary."
                            )
                    );
        }
    }


    // =========================================================
    // SUBMIT QUIZ
    // =========================================================

    @PutMapping(
            "/{attemptId}/submit"
    )
    public ResponseEntity<?> submitQuiz(

            @PathVariable Long attemptId

    ) {

        try {

            QuizAttempt attempt =
                    quizAttemptService
                            .submitQuiz(
                                    attemptId
                            );


            return ResponseEntity.ok(
                    toResponse(attempt)
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.BAD_REQUEST
                    )
                    .body(
                            Map.of(
                                    "error",
                                    "Bad Request",

                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to submit quiz."
                            )
                    );
        }
    }


    // =========================================================
    // DELETE ATTEMPT
    // =========================================================

    @DeleteMapping(
            "/{id}"
    )
    public ResponseEntity<?> deleteAttempt(

            @PathVariable Long id

    ) {

        try {

            quizAttemptService.deleteAttempt(
                    id
            );


            return ResponseEntity.ok(
                    Map.of(
                            "message",
                            "Attempt deleted successfully."
                    )
            );


        } catch (RuntimeException e) {

            return ResponseEntity
                    .status(
                            HttpStatus.BAD_REQUEST
                    )
                    .body(
                            Map.of(
                                    "message",
                                    e.getMessage() != null
                                            ? e.getMessage()
                                            : "Unable to delete attempt."
                            )
                    );
        }
    }
}