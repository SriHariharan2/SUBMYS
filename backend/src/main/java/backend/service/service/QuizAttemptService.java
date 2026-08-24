package backend.service;

import backend.entity.Grade;
import backend.entity.Notification;
import backend.entity.Question;
import backend.entity.Quiz;
import backend.entity.QuizAttempt;
import backend.entity.StudentAnswer;
import backend.entity.User;

import backend.repository.GradeRepository;
import backend.repository.QuizAttemptRepository;
import backend.repository.QuizRepository;
import backend.repository.StudentAnswerRepository;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Service
public class QuizAttemptService {

    // =========================================================
    // REPOSITORIES
    // =========================================================

    private final QuizAttemptRepository quizAttemptRepository;

    private final UserRepository userRepository;

    private final QuizRepository quizRepository;

    private final StudentAnswerRepository studentAnswerRepository;

    private final GradeRepository gradeRepository;

    private final NotificationService notificationService;


    // =========================================================
    // CONSTRUCTOR
    // =========================================================

    public QuizAttemptService(
            QuizAttemptRepository quizAttemptRepository,
            UserRepository userRepository,
            QuizRepository quizRepository,
            StudentAnswerRepository studentAnswerRepository,
            GradeRepository gradeRepository,
            NotificationService notificationService
    ) {

        this.quizAttemptRepository =
                quizAttemptRepository;

        this.userRepository =
                userRepository;

        this.quizRepository =
                quizRepository;

        this.studentAnswerRepository =
                studentAnswerRepository;

        this.gradeRepository =
                gradeRepository;

        this.notificationService =
                notificationService;
    }


    // =========================================================
    // START / RESUME QUIZ
    // =========================================================

    @Transactional
    public QuizAttempt startQuiz(
            Long studentId,
            Long quizId
    ) {

        if (studentId == null) {

            throw new RuntimeException(
                    "Student ID is required."
            );
        }

        if (quizId == null) {

            throw new RuntimeException(
                    "Quiz ID is required."
            );
        }


        // =====================================================
        // FIND STUDENT
        // =====================================================

        User student =
                userRepository
                        .findById(studentId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Student not found."
                                )
                        );


        // =====================================================
        // FIND QUIZ
        // =====================================================

        Quiz quiz =
                quizRepository
                        .findById(quizId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Quiz not found."
                                )
                        );


        // =====================================================
        // MAX ATTEMPTS
        // =====================================================

        Integer maxAttempts =
                quiz.getMaxAttempts();

        if (
                maxAttempts == null ||
                maxAttempts < 1
        ) {

            maxAttempts = 1;
        }


        // =====================================================
        // GET ALL STUDENT ATTEMPTS
        // =====================================================

        List<QuizAttempt> studentAttempts =
                quizAttemptRepository
                        .findByStudentId(studentId);


        // =====================================================
        // COUNT ATTEMPTS FOR THIS QUIZ
        // =====================================================

        long attemptCount =
                studentAttempts
                        .stream()
                        .filter(
                                a ->
                                        a != null
                                        && a.getQuiz() != null
                                        && a.getQuiz().getId() != null
                                        && a.getQuiz()
                                                .getId()
                                                .equals(quizId)
                        )
                        .count();


        // =====================================================
        // FIND IN-PROGRESS ATTEMPT
        // =====================================================

        Optional<QuizAttempt>
                inProgressAttempt =
                studentAttempts
                        .stream()
                        .filter(
                                a ->
                                        a != null
                                        && a.getQuiz() != null
                                        && a.getQuiz().getId() != null
                                        && a.getQuiz()
                                                .getId()
                                                .equals(quizId)
                                        && a.getStatus() != null
                                        && "IN_PROGRESS"
                                                .equalsIgnoreCase(
                                                        a.getStatus()
                                                )
                        )
                        .findFirst();


        // =====================================================
        // RESUME EXISTING ATTEMPT
        // =====================================================

        if (inProgressAttempt.isPresent()) {

            QuizAttempt existing =
                    inProgressAttempt.get();


            if (existing.getStartedAt() == null) {

                existing.setStartedAt(
                        LocalDateTime.now()
                );
            }


            if (existing.getScore() == null) {

                existing.setScore(0);
            }


            if (existing.getTotalMarks() == null) {

                existing.setTotalMarks(
                        quiz.getTotalMarks()
                );
            }


            return quizAttemptRepository.save(
                    existing
            );
        }


        // =====================================================
        // CHECK MAXIMUM ATTEMPTS
        // =====================================================

        if (attemptCount >= maxAttempts) {

            throw new RuntimeException(
                    "Maximum attempts reached. "
                    + "You have used "
                    + attemptCount
                    + " of "
                    + maxAttempts
                    + " attempts."
            );
        }


        // =====================================================
        // CREATE NEW ATTEMPT
        // =====================================================

        QuizAttempt attempt =
                new QuizAttempt();


        attempt.setStudent(
                student
        );


        attempt.setQuiz(
                quiz
        );


        attempt.setScore(
                0
        );


        attempt.setTotalMarks(
                quiz.getTotalMarks()
        );


        attempt.setStartedAt(
                LocalDateTime.now()
        );


        attempt.setSubmittedAt(
                null
        );


        attempt.setStatus(
                "IN_PROGRESS"
        );


        return quizAttemptRepository.save(
                attempt
        );
    }


    // =========================================================
    // GET ALL ATTEMPTS
    // =========================================================

    public List<QuizAttempt> getAllAttempts() {

        return quizAttemptRepository.findAll();
    }


    // =========================================================
    // GET ATTEMPT BY ID
    // =========================================================

    public QuizAttempt getAttemptById(
            Long id
    ) {

        if (id == null) {

            throw new RuntimeException(
                    "Attempt ID is required."
            );
        }


        return quizAttemptRepository
                .findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Attempt not found."
                        )
                );
    }


    // =========================================================
    // GET ATTEMPTS BY STUDENT
    // =========================================================

    public List<QuizAttempt> getAttemptsByStudent(
            Long studentId
    ) {

        return quizAttemptRepository
                .findByStudentId(
                        studentId
                );
    }


    // =========================================================
    // GET ATTEMPTS BY QUIZ
    // =========================================================

    public List<QuizAttempt> getAttemptsByQuiz(
            Long quizId
    ) {

        return quizAttemptRepository
                .findByQuizId(
                        quizId
                );
    }


    // =========================================================
    // GET EXACT STUDENT + QUIZ ATTEMPT
    // =========================================================

    public Optional<QuizAttempt>
    getAttemptByStudentAndQuiz(
            Long studentId,
            Long quizId
    ) {

        List<QuizAttempt> attempts =
                quizAttemptRepository
                        .findByStudentId(
                                studentId
                        );


        return attempts
                .stream()
                .filter(
                        a ->
                                a != null
                                && a.getQuiz() != null
                                && a.getQuiz().getId() != null
                                && a.getQuiz()
                                        .getId()
                                        .equals(quizId)
                )
                .sorted(
                        (a, b) -> {

                            if (
                                    a.getStartedAt() == null
                                    && b.getStartedAt() == null
                            ) {

                                return 0;
                            }


                            if (
                                    a.getStartedAt() == null
                            ) {

                                return 1;
                            }


                            if (
                                    b.getStartedAt() == null
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
    }


    // =========================================================
    // GET ATTEMPT COUNT
    // =========================================================

    public long getAttemptCount(
            Long studentId,
            Long quizId
    ) {

        List<QuizAttempt> attempts =
                quizAttemptRepository
                        .findByStudentId(
                                studentId
                        );


        return attempts
                .stream()
                .filter(
                        a ->
                                a != null
                                && a.getQuiz() != null
                                && a.getQuiz().getId() != null
                                && a.getQuiz()
                                        .getId()
                                        .equals(quizId)
                )
                .count();
    }


    // =========================================================
    // SUBMIT QUIZ
    // =========================================================

    @Transactional
    public QuizAttempt submitQuiz(
            Long attemptId
    ) {

        QuizAttempt attempt =
                getAttemptById(
                        attemptId
                );


        // =====================================================
        // ALREADY COMPLETED
        // =====================================================

        if (
                attempt.getStatus() != null
                && "COMPLETED"
                        .equalsIgnoreCase(
                                attempt.getStatus()
                        )
        ) {

            // IMPORTANT:
            // Re-save the grade and ALWAYS attach
            // the student and quiz.

            saveOrUpdateQuizGrade(
                    attempt
            );

            return attempt;
        }


        // =====================================================
        // GET STUDENT ANSWERS
        // =====================================================

        List<StudentAnswer> answers =
                studentAnswerRepository
                        .findByQuizAttemptId(
                                attemptId
                        );


        int score = 0;


        // =====================================================
        // AUTOMATIC GRADING
        // =====================================================

        for (
                StudentAnswer answer :
                answers
        ) {

            if (answer == null) {

                continue;
            }


            Question question =
                    answer.getQuestion();


            if (question == null) {

                continue;
            }


            String selectedAnswer =
                    answer.getSelectedAnswer();


            String correctAnswer =
                    question.getCorrectAnswer();


            if (
                    selectedAnswer != null
                    && correctAnswer != null
                    && selectedAnswer
                            .trim()
                            .equalsIgnoreCase(
                                    correctAnswer.trim()
                            )
            ) {

                if (
                        question.getMarks() != null
                ) {

                    score +=
                            question.getMarks();
                }
            }
        }


        // =====================================================
        // UPDATE ATTEMPT SCORE
        // =====================================================

        attempt.setScore(
                score
        );


        // =====================================================
        // UPDATE TOTAL MARKS
        // =====================================================

        if (
                attempt.getQuiz() != null
                && attempt.getQuiz()
                        .getTotalMarks() != null
        ) {

            attempt.setTotalMarks(
                    attempt.getQuiz()
                            .getTotalMarks()
            );

        } else if (
                attempt.getTotalMarks() == null
        ) {

            attempt.setTotalMarks(
                    score
            );
        }


        // =====================================================
        // SUBMITTED TIME
        // =====================================================

        attempt.setSubmittedAt(
                LocalDateTime.now()
        );


        // =====================================================
        // STATUS
        // =====================================================

        attempt.setStatus(
                "COMPLETED"
        );


        // =====================================================
        // SAVE QUIZ ATTEMPT
        // =====================================================

        QuizAttempt savedAttempt =
                quizAttemptRepository.save(
                        attempt
                );


        // =====================================================
        // SAVE / UPDATE GRADE
        // =====================================================

        saveOrUpdateQuizGrade(
                savedAttempt
        );


        // =====================================================
        // NOTIFICATION
        // =====================================================

        try {

            Notification notification =
                    new Notification();


            notification.setTitle(
                    "Quiz Graded"
            );


            String quizTitle =
                    savedAttempt.getQuiz() != null
                            ? savedAttempt
                                    .getQuiz()
                                    .getTitle()
                            : "Quiz";


            Integer totalMarks =
                    savedAttempt
                            .getTotalMarks() != null
                            ? savedAttempt
                                    .getTotalMarks()
                            : 0;


            notification.setMessage(
                    "Your quiz \""
                            + quizTitle
                            + "\" has been graded. "
                            + "Score: "
                            + score
                            + "/"
                            + totalMarks
            );


            if (
                    savedAttempt.getStudent() != null
                    && savedAttempt
                            .getStudent()
                            .getId() != null
            ) {

                notificationService
                        .createNotification(
                                savedAttempt
                                        .getStudent()
                                        .getId(),
                                notification
                        );
            }


        } catch (Exception e) {

            // Notification failure should NOT
            // make quiz submission fail.

            System.err.println(
                    "Notification error: "
                            + e.getMessage()
            );
        }


        return savedAttempt;
    }


    // =========================================================
    // SAVE / UPDATE QUIZ GRADE
    // =========================================================

    private void saveOrUpdateQuizGrade(
            QuizAttempt attempt
    ) {

        if (attempt == null) {

            return;
        }


        // =====================================================
        // CHECK STUDENT
        // =====================================================

        if (attempt.getStudent() == null) {

            System.err.println(
                    "Cannot save quiz grade: student is null."
            );

            return;
        }


        // =====================================================
        // CHECK QUIZ
        // =====================================================

        if (attempt.getQuiz() == null) {

            System.err.println(
                    "Cannot save quiz grade: quiz is null."
            );

            return;
        }


        Long studentId =
                attempt.getStudent().getId();


        Long quizId =
                attempt.getQuiz().getId();


        if (studentId == null) {

            System.err.println(
                    "Cannot save quiz grade: student ID is null."
            );

            return;
        }


        if (quizId == null) {

            System.err.println(
                    "Cannot save quiz grade: quiz ID is null."
            );

            return;
        }


        // =====================================================
        // FIND EXISTING QUIZ GRADE
        // =====================================================

        Optional<Grade> existingGrade =
                gradeRepository
                        .findByStudentIdAndQuizId(
                                studentId,
                                quizId
                        );


        Grade grade;


        if (existingGrade.isPresent()) {

            grade =
                    existingGrade.get();

        } else {

            grade =
                    new Grade();
        }


        // =====================================================
        // IMPORTANT FIX
        // ALWAYS SET STUDENT
        // =====================================================

        grade.setStudent(
                attempt.getStudent()
        );


        // =====================================================
        // IMPORTANT FIX
        // ALWAYS SET QUIZ
        // =====================================================

        grade.setQuiz(
                attempt.getQuiz()
        );


        // =====================================================
        // IMPORTANT
        // QUIZ GRADE MUST NOT BE ASSIGNMENT GRADE
        // =====================================================

        grade.setAssignment(
                null
        );


        // =====================================================
        // SCORE
        // =====================================================

        Double score =
                attempt.getScore() != null
                        ? attempt.getScore()
                                .doubleValue()
                        : 0.0;


        // =====================================================
        // MAX SCORE
        // =====================================================

        Double maxScore =
                attempt.getTotalMarks() != null
                        ? attempt.getTotalMarks()
                                .doubleValue()
                        : (
                            attempt.getQuiz()
                                    .getTotalMarks() != null
                                    ? attempt.getQuiz()
                                            .getTotalMarks()
                                            .doubleValue()
                                    : 0.0
                        );


        // =====================================================
        // SET SCORE
        // =====================================================

        grade.setScore(
                score
        );


        grade.setMaxScore(
                maxScore
        );


        // =====================================================
        // REMARKS
        // =====================================================

        grade.setRemarks(
                "Quiz auto-graded"
        );


        // =====================================================
        // SAVE GRADE
        // =====================================================

        Grade savedGrade =
                gradeRepository.save(
                        grade
                );


        // =====================================================
        // DEBUG
        // =====================================================

        System.out.println(
                "===================================="
        );

        System.out.println(
                "QUIZ GRADE SAVED"
        );

        System.out.println(
                "Grade ID: "
                        + savedGrade.getId()
        );

        System.out.println(
                "Student ID: "
                        + studentId
        );

        System.out.println(
                "Quiz ID: "
                        + quizId
        );

        System.out.println(
                "Quiz Title: "
                        + (
                            savedGrade.getQuiz() != null
                                    ? savedGrade.getQuiz()
                                            .getTitle()
                                    : "NULL"
                        )
        );

        System.out.println(
                "Score: "
                        + score
                        + "/"
                        + maxScore
        );

        System.out.println(
                "===================================="
        );
    }


    // =========================================================
    // DELETE ATTEMPT
    // =========================================================

    @Transactional
    public void deleteAttempt(
            Long id
    ) {

        QuizAttempt attempt =
                getAttemptById(
                        id
                );


        quizAttemptRepository.delete(
                attempt
        );
    }
}