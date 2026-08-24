package backend.service;

import backend.dto.AssignmentResponse;
import backend.entity.Assignment;
import backend.entity.Course;
import backend.entity.Enrollment;
import backend.entity.Notification;
import backend.entity.Topic;
import backend.repository.AssignmentRepository;
import backend.repository.EnrollmentRepository;
import backend.repository.TopicRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AssignmentService {

    private final AssignmentRepository assignmentRepository;

    private final TopicRepository topicRepository;

    private final EnrollmentRepository enrollmentRepository;

    private final NotificationService notificationService;


    public AssignmentService(
            AssignmentRepository assignmentRepository,
            TopicRepository topicRepository,
            EnrollmentRepository enrollmentRepository,
            NotificationService notificationService
    ) {

        this.assignmentRepository =
                assignmentRepository;

        this.topicRepository =
                topicRepository;

        this.enrollmentRepository =
                enrollmentRepository;

        this.notificationService =
                notificationService;
    }


    // =====================================================
    // CREATE ASSIGNMENT
    // =====================================================

    public Assignment createAssignment(
            Long topicId,
            Assignment assignment
    ) {

        Topic topic =
                topicRepository.findById(topicId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Topic not found"
                                )
                        );


        assignment.setTopic(topic);


        Assignment savedAssignment =
                assignmentRepository.save(
                        assignment
                );


        // =================================================
        // GET COURSE
        // =================================================

        if (
                topic.getSubject() != null &&
                topic.getSubject().getCourse() != null
        ) {

            Course course =
                    topic.getSubject()
                            .getCourse();


            // =============================================
            // GET ENROLLED STUDENTS
            // =============================================

            List<Enrollment> enrollments =
                    enrollmentRepository
                            .findByCourseId(
                                    course.getId()
                            );


            // =============================================
            // SEND NOTIFICATION
            // =============================================

            for (
                    Enrollment enrollment :
                    enrollments
            ) {

                if (
                        enrollment.getStudent() == null
                ) {
                    continue;
                }


                Notification notification =
                        new Notification();


                notification.setTitle(
                        "New Assignment"
                );


                notification.setMessage(
                        "A new assignment has been added in "
                                + course.getTitle()
                                + ": "
                                + assignment.getTitle()
                );


                notificationService.createNotification(

                        enrollment
                                .getStudent()
                                .getId(),

                        notification
                );
            }
        }


        return savedAssignment;
    }


    // =====================================================
    // ENTITY -> DTO
    // =====================================================

    private AssignmentResponse mapToResponse(
            Assignment assignment
    ) {

        return new AssignmentResponse(

                // =========================================
                // ASSIGNMENT
                // =========================================

                assignment.getId(),

                assignment.getTitle(),

                assignment.getDescription(),

                assignment.getDueDate(),

                assignment.getMaxMarks(),


                // =========================================
                // TOPIC
                // =========================================

                assignment.getTopic() != null
                        ? assignment.getTopic().getId()
                        : null,

                assignment.getTopic() != null
                        ? assignment.getTopic().getTitle()
                        : null,


                // =========================================
                // SUBJECT
                // =========================================

                assignment.getTopic() != null
                        &&
                        assignment.getTopic()
                                .getSubject() != null

                        ? assignment.getTopic()
                                .getSubject()
                                .getId()

                        : null,


                assignment.getTopic() != null
                        &&
                        assignment.getTopic()
                                .getSubject() != null

                        ? assignment.getTopic()
                                .getSubject()
                                .getName()

                        : null,


                // =========================================
                // COURSE
                // =========================================

                assignment.getTopic() != null
                        &&
                        assignment.getTopic()
                                .getSubject() != null
                        &&
                        assignment.getTopic()
                                .getSubject()
                                .getCourse() != null

                        ? assignment.getTopic()
                                .getSubject()
                                .getCourse()
                                .getId()

                        : null,


                assignment.getTopic() != null
                        &&
                        assignment.getTopic()
                                .getSubject() != null
                        &&
                        assignment.getTopic()
                                .getSubject()
                                .getCourse() != null

                        ? assignment.getTopic()
                                .getSubject()
                                .getCourse()
                                .getTitle()

                        : null
        );
    }


    // =====================================================
    // GET ALL ASSIGNMENTS
    // =====================================================
    //
    // ADMIN USE
    //
    // Returns all assignments.
    //
    // =====================================================

    public List<AssignmentResponse>
    getAllAssignments() {

        return assignmentRepository
                .findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET ASSIGNMENTS FOR STUDENT
    // =====================================================
    //
    // ONLY ASSIGNMENTS BELONGING TO COURSES
    // WHERE THE STUDENT IS ENROLLED.
    //
    // =====================================================

    public List<AssignmentResponse>
    getAssignmentsForStudent(
            Long studentId
    ) {

        // ================================================
        // GET STUDENT ENROLLMENTS
        // ================================================

        List<Enrollment> enrollments =
                enrollmentRepository
                        .findByStudentId(
                                studentId
                        );


        // ================================================
        // GET COURSE IDS
        // ================================================

        List<Long> enrolledCourseIds =
                enrollments
                        .stream()
                        .filter(
                                enrollment ->
                                        enrollment.getCourse() != null
                        )
                        .map(
                                enrollment ->
                                        enrollment
                                                .getCourse()
                                                .getId()
                        )
                        .filter(
                                id -> id != null
                        )
                        .toList();


        // ================================================
        // NO ENROLLMENTS
        // ================================================

        if (
                enrolledCourseIds.isEmpty()
        ) {

            return List.of();
        }


        // ================================================
        // FILTER ASSIGNMENTS
        // ================================================

        return assignmentRepository
                .findAll()
                .stream()
                .filter(
                        assignment -> {

                            // No topic
                            if (
                                    assignment.getTopic() == null
                            ) {

                                return false;
                            }


                            // No subject
                            if (
                                    assignment
                                            .getTopic()
                                            .getSubject() == null
                            ) {

                                return false;
                            }


                            // No course
                            if (
                                    assignment
                                            .getTopic()
                                            .getSubject()
                                            .getCourse() == null
                            ) {

                                return false;
                            }


                            Long courseId =
                                    assignment
                                            .getTopic()
                                            .getSubject()
                                            .getCourse()
                                            .getId();


                            return courseId != null
                                    &&
                                    enrolledCourseIds
                                            .contains(
                                                    courseId
                                            );
                        }
                )
                .map(
                        this::mapToResponse
                )
                .toList();
    }


    // =====================================================
    // GET ASSIGNMENT BY ID
    // =====================================================

    public AssignmentResponse
    getAssignmentById(
            Long id
    ) {

        Assignment assignment =
                assignmentRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assignment not found"
                                )
                        );


        return mapToResponse(
                assignment
        );
    }


    // =====================================================
    // GET ASSIGNMENT FOR STUDENT
    // =====================================================
    //
    // Prevents a student from manually entering an
    // assignment ID belonging to another course.
    //
    // =====================================================

    public AssignmentResponse
    getAssignmentForStudent(
            Long studentId,
            Long assignmentId
    ) {

        Assignment assignment =
                assignmentRepository
                        .findById(assignmentId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assignment not found"
                                )
                        );


        // ================================================
        // CHECK HIERARCHY
        // ================================================

        if (
                assignment.getTopic() == null
        ) {

            throw new RuntimeException(
                    "Assignment is not associated with a topic."
            );
        }


        if (
                assignment
                        .getTopic()
                        .getSubject() == null
        ) {

            throw new RuntimeException(
                    "Assignment is not associated with a subject."
            );
        }


        if (
                assignment
                        .getTopic()
                        .getSubject()
                        .getCourse() == null
        ) {

            throw new RuntimeException(
                    "Assignment is not associated with a course."
            );
        }


        Long courseId =
                assignment
                        .getTopic()
                        .getSubject()
                        .getCourse()
                        .getId();


        // ================================================
        // CHECK ENROLLMENT
        // ================================================

        boolean enrolled =
                enrollmentRepository
                        .findByStudentIdAndCourseId(
                                studentId,
                                courseId
                        )
                        .isPresent();


        if (!enrolled) {

            throw new RuntimeException(
                    "Student is not enrolled in this course."
            );
        }


        return mapToResponse(
                assignment
        );
    }


    // =====================================================
    // GET BY TOPIC
    // =====================================================
    //
    // ADMIN USE
    //
    // =====================================================

    public List<AssignmentResponse>
    getAssignmentsByTopic(
            Long topicId
    ) {

        return assignmentRepository
                .findByTopicId(topicId)
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();
    }


    // =====================================================
    // GET BY TOPIC FOR STUDENT
    // =====================================================

    public List<AssignmentResponse>
    getAssignmentsByTopicForStudent(
            Long studentId,
            Long topicId
    ) {

        Topic topic =
                topicRepository
                        .findById(topicId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Topic not found"
                                )
                        );


        // ================================================
        // CHECK SUBJECT
        // ================================================

        if (
                topic.getSubject() == null
        ) {

            throw new RuntimeException(
                    "Topic is not associated with a subject."
            );
        }


        // ================================================
        // CHECK COURSE
        // ================================================

        if (
                topic
                        .getSubject()
                        .getCourse() == null
        ) {

            throw new RuntimeException(
                    "Topic is not associated with a course."
            );
        }


        Long courseId =
                topic
                        .getSubject()
                        .getCourse()
                        .getId();


        // ================================================
        // CHECK ENROLLMENT
        // ================================================

        boolean enrolled =
                enrollmentRepository
                        .findByStudentIdAndCourseId(
                                studentId,
                                courseId
                        )
                        .isPresent();


        if (!enrolled) {

            throw new RuntimeException(
                    "Student is not enrolled in this course."
            );
        }


        // ================================================
        // RETURN ASSIGNMENTS
        // ================================================

        return assignmentRepository
                .findByTopicId(topicId)
                .stream()
                .map(
                        this::mapToResponse
                )
                .toList();
    }


    // =====================================================
    // UPDATE ASSIGNMENT
    // =====================================================

    public Assignment updateAssignment(
            Long id,
            Assignment updatedAssignment
    ) {

        Assignment assignment =
                assignmentRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assignment not found"
                                )
                        );


        assignment.setTitle(
                updatedAssignment.getTitle()
        );


        assignment.setDescription(
                updatedAssignment.getDescription()
        );


        assignment.setDueDate(
                updatedAssignment.getDueDate()
        );


        assignment.setMaxMarks(
                updatedAssignment.getMaxMarks()
        );


        return assignmentRepository.save(
                assignment
        );
    }


    // =====================================================
    // DELETE ASSIGNMENT
    // =====================================================

    public void deleteAssignment(
            Long id
    ) {

        Assignment assignment =
                assignmentRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Assignment not found"
                                )
                        );


        assignmentRepository.delete(
                assignment
        );
    }
}