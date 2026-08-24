package backend.service;

import backend.dto.QuizResponse;
import backend.entity.Quiz;
import backend.entity.Topic;
import backend.repository.QuizRepository;
import backend.repository.TopicRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class QuizService {

    private final QuizRepository quizRepository;

    private final TopicRepository topicRepository;

    private final EnrollmentService enrollmentService;


    public QuizService(
            QuizRepository quizRepository,
            TopicRepository topicRepository,
            EnrollmentService enrollmentService
    ) {

        this.quizRepository =
                quizRepository;

        this.topicRepository =
                topicRepository;

        this.enrollmentService =
                enrollmentService;
    }


    // =====================================================
    // CREATE QUIZ
    // =====================================================

    public Quiz createQuiz(
            Long topicId,
            Quiz quiz
    ) {

        Topic topic =
                topicRepository.findById(
                        topicId
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Topic not found"
                        )
                );


        quiz.setTopic(topic);


        if (
                quiz.getMaxAttempts() == null ||
                quiz.getMaxAttempts() < 1
        ) {

            quiz.setMaxAttempts(1);
        }


        return quizRepository.save(
                quiz
        );
    }


    // =====================================================
    // ENTITY -> DTO
    // =====================================================

    private QuizResponse mapToResponse(
            Quiz quiz
    ) {

        return new QuizResponse(

                quiz.getId(),

                quiz.getTitle(),

                quiz.getDescription(),

                quiz.getTotalMarks(),

                quiz.getDurationMinutes(),

                quiz.getMaxAttempts(),

                quiz.getTopic() != null
                        ? quiz.getTopic().getId()
                        : null,

                quiz.getTopic() != null
                        ? quiz.getTopic().getTitle()
                        : null,

                quiz.getTopic() != null
                        && quiz.getTopic().getSubject() != null
                        ? quiz.getTopic()
                                .getSubject()
                                .getId()
                        : null,

                quiz.getTopic() != null
                        && quiz.getTopic().getSubject() != null
                        ? quiz.getTopic()
                                .getSubject()
                                .getName()
                        : null,

                quiz.getTopic() != null
                        && quiz.getTopic().getSubject() != null
                        && quiz.getTopic()
                                .getSubject()
                                .getCourse() != null
                        ? quiz.getTopic()
                                .getSubject()
                                .getCourse()
                                .getId()
                        : null,

                quiz.getTopic() != null
                        && quiz.getTopic().getSubject() != null
                        && quiz.getTopic()
                                .getSubject()
                                .getCourse() != null
                        ? quiz.getTopic()
                                .getSubject()
                                .getCourse()
                                .getTitle()
                        : null
        );
    }


    // =====================================================
    // GET ALL
    // =====================================================
    //
    // ADMIN
    //
    // =====================================================

    public List<QuizResponse> getAllQuizzes() {

        return quizRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET QUIZZES FOR STUDENT
    // =====================================================

    public List<QuizResponse> getQuizzesForStudent(
            Long studentId
    ) {

        List<Long> enrolledCourseIds =
                enrollmentService
                        .getStudentCourseIds(
                                studentId
                        );


        if (enrolledCourseIds.isEmpty()) {

            return List.of();
        }


        return quizRepository.findAll()
                .stream()
                .filter(quiz -> {

                    if (
                            quiz.getTopic() == null
                    ) {
                        return false;
                    }

                    if (
                            quiz.getTopic()
                                    .getSubject() == null
                    ) {
                        return false;
                    }

                    if (
                            quiz.getTopic()
                                    .getSubject()
                                    .getCourse() == null
                    ) {
                        return false;
                    }


                    Long courseId =
                            quiz.getTopic()
                                    .getSubject()
                                    .getCourse()
                                    .getId();


                    return courseId != null
                            &&
                            enrolledCourseIds.contains(
                                    courseId
                            );
                })
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    public QuizResponse getQuizById(
            Long id
    ) {

        Quiz quiz =
                quizRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Quiz not found"
                                )
                        );

        return mapToResponse(quiz);
    }


    // =====================================================
    // GET QUIZ FOR STUDENT
    // =====================================================

    public QuizResponse getQuizForStudent(
            Long studentId,
            Long quizId
    ) {

        Quiz quiz =
                quizRepository.findById(
                        quizId
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Quiz not found"
                        )
                );


        if (
                quiz.getTopic() == null ||
                quiz.getTopic().getSubject() == null ||
                quiz.getTopic()
                        .getSubject()
                        .getCourse() == null
        ) {

            throw new RuntimeException(
                    "Quiz is not associated with a course."
            );
        }


        Long courseId =
                quiz.getTopic()
                        .getSubject()
                        .getCourse()
                        .getId();


        if (
                !enrollmentService
                        .isStudentEnrolled(
                                studentId,
                                courseId
                        )
        ) {

            throw new RuntimeException(
                    "Student is not enrolled in this course."
            );
        }


        return mapToResponse(quiz);
    }


    // =====================================================
    // GET BY TOPIC
    // =====================================================

    public List<QuizResponse> getQuizzesByTopic(
            Long topicId
    ) {

        return quizRepository
                .findByTopicId(topicId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET BY TOPIC FOR STUDENT
    // =====================================================

    public List<QuizResponse>
    getQuizzesByTopicForStudent(
            Long studentId,
            Long topicId
    ) {

        Topic topic =
                topicRepository.findById(
                        topicId
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Topic not found"
                        )
                );


        if (
                topic.getSubject() == null ||
                topic.getSubject().getCourse() == null
        ) {

            throw new RuntimeException(
                    "Topic is not associated with a course."
            );
        }


        Long courseId =
                topic.getSubject()
                        .getCourse()
                        .getId();


        if (
                !enrollmentService
                        .isStudentEnrolled(
                                studentId,
                                courseId
                        )
        ) {

            throw new RuntimeException(
                    "Student is not enrolled in this course."
            );
        }


        return quizRepository
                .findByTopicId(topicId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // UPDATE
    // =====================================================

    public Quiz updateQuiz(
            Long id,
            Quiz updatedQuiz
    ) {

        Quiz quiz =
                quizRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Quiz not found"
                                )
                        );


        quiz.setTitle(
                updatedQuiz.getTitle()
        );

        quiz.setDescription(
                updatedQuiz.getDescription()
        );

        quiz.setTotalMarks(
                updatedQuiz.getTotalMarks()
        );

        quiz.setDurationMinutes(
                updatedQuiz.getDurationMinutes()
        );


        Integer maxAttempts =
                updatedQuiz.getMaxAttempts();


        if (
                maxAttempts == null ||
                maxAttempts < 1
        ) {

            maxAttempts = 1;
        }


        quiz.setMaxAttempts(
                maxAttempts
        );


        return quizRepository.save(
                quiz
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    public void deleteQuiz(
            Long id
    ) {

        Quiz quiz =
                quizRepository.findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Quiz not found"
                                )
                        );

        quizRepository.delete(quiz);
    }
}