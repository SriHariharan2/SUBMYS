package backend.service;

import backend.entity.Course;
import backend.entity.CourseProgress;
import backend.entity.Enrollment;
import backend.entity.Subject;
import backend.entity.User;

import backend.repository.CourseProgressRepository;
import backend.repository.CourseRepository;
import backend.repository.EnrollmentRepository;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class EnrollmentService {

    private final EnrollmentRepository enrollmentRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final CourseProgressRepository courseProgressRepository;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public EnrollmentService(
            EnrollmentRepository enrollmentRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            CourseProgressRepository courseProgressRepository
    ) {

        this.enrollmentRepository = enrollmentRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.courseProgressRepository = courseProgressRepository;
    }

    // =====================================================
    // ENROLL STUDENT
    // =====================================================
    //
    // Teacher/Admin enrolls a student.
    //
    // When enrollment is created:
    //
    // 1. Enrollment is created
    // 2. CourseProgress is automatically created
    //
    // =====================================================

    @Transactional
    public Enrollment enrollStudent(
            Long studentId,
            Long courseId
    ) {

        // -------------------------------------------------
        // CHECK STUDENT ID
        // -------------------------------------------------

        if (studentId == null) {

            throw new RuntimeException(
                    "Student ID is required."
            );
        }

        // -------------------------------------------------
        // CHECK COURSE ID
        // -------------------------------------------------

        if (courseId == null) {

            throw new RuntimeException(
                    "Course ID is required."
            );
        }

        // -------------------------------------------------
        // CHECK DUPLICATE ENROLLMENT
        // -------------------------------------------------

        if (
                enrollmentRepository
                        .findByStudentIdAndCourseId(
                                studentId,
                                courseId
                        )
                        .isPresent()
        ) {

            throw new RuntimeException(
                    "Student is already enrolled in this course."
            );
        }

        // -------------------------------------------------
        // FIND STUDENT
        // -------------------------------------------------

        User student =
                userRepository
                        .findById(studentId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Student not found."
                                )
                        );

        // -------------------------------------------------
        // FIND COURSE
        // -------------------------------------------------

        Course course =
                courseRepository
                        .findById(courseId)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Course not found."
                                )
                        );

        // -------------------------------------------------
        // CREATE ENROLLMENT
        // -------------------------------------------------

        Enrollment enrollment =
                new Enrollment();

        enrollment.setStudent(student);

        enrollment.setCourse(course);

        enrollment.setEnrollmentDate(
                LocalDate.now()
        );

        Enrollment savedEnrollment =
                enrollmentRepository.save(
                        enrollment
                );

        // =================================================
        // CREATE COURSE PROGRESS AUTOMATICALLY
        // =================================================

        createInitialCourseProgress(
                student,
                course
        );

        return savedEnrollment;
    }

    // =====================================================
    // CREATE INITIAL COURSE PROGRESS
    // =====================================================

    private void createInitialCourseProgress(
            User student,
            Course course
    ) {

        // -------------------------------------------------
        // CHECK IF PROGRESS ALREADY EXISTS
        // -------------------------------------------------

        boolean progressExists =
                courseProgressRepository
                        .findByStudentIdAndCourseId(
                                student.getId(),
                                course.getId()
                        )
                        .isPresent();

        if (progressExists) {

            return;
        }

        // -------------------------------------------------
        // COUNT TOTAL TOPICS
        // -------------------------------------------------

        int totalTopics = 0;

        if (course.getSubjects() != null) {

            for (Subject subject : course.getSubjects()) {

                if (
                        subject != null &&
                        subject.getTopics() != null
                ) {

                    totalTopics +=
                            subject
                                    .getTopics()
                                    .size();
                }
            }
        }

        // -------------------------------------------------
        // CREATE PROGRESS
        // -------------------------------------------------

        CourseProgress progress =
                new CourseProgress();

        progress.setStudent(student);

        progress.setCourse(course);

        progress.setCompletedTopics(0);

        progress.setTotalTopics(totalTopics);

        progress.setProgressPercentage(0.0);

        courseProgressRepository.save(
                progress
        );
    }

    // =====================================================
    // GET ALL ENROLLMENTS
    // =====================================================

    public List<Enrollment> getAllEnrollments() {

        return enrollmentRepository.findAll();
    }

    // =====================================================
    // GET STUDENT ENROLLMENTS
    // =====================================================

    public List<Enrollment> getStudentEnrollments(
            Long studentId
    ) {

        if (studentId == null) {

            return List.of();
        }

        return enrollmentRepository
                .findByStudentId(
                        studentId
                );
    }

    // =====================================================
    // GET STUDENT COURSE IDS
    // =====================================================
    //
    // IMPORTANT:
    // This method exists ONLY ONCE in this class.
    //
    // Example:
    //
    // Student 3 enrolled in:
    //
    // Course 2
    // Course 5
    //
    // returns:
    //
    // [2, 5]
    //
    // =====================================================

    public List<Long> getStudentCourseIds(
            Long studentId
    ) {

        if (studentId == null) {

            return List.of();
        }

        return enrollmentRepository
                .findByStudentId(
                        studentId
                )
                .stream()

                // -------------------------------------------------
                // Only valid enrollments
                // -------------------------------------------------

                .filter(
                        enrollment ->
                                enrollment != null
                                &&
                                enrollment.getCourse() != null
                )

                // -------------------------------------------------
                // Get course ID
                // -------------------------------------------------

                .map(
                        enrollment ->
                                enrollment
                                        .getCourse()
                                        .getId()
                )

                // -------------------------------------------------
                // Remove null IDs
                // -------------------------------------------------

                .filter(
                        courseId ->
                                courseId != null
                )

                // -------------------------------------------------
                // Remove duplicate courses
                // -------------------------------------------------

                .distinct()

                .collect(
                        Collectors.toList()
                );
    }

    // =====================================================
    // CHECK STUDENT ENROLLED IN COURSE
    // =====================================================

    public boolean isStudentEnrolled(
            Long studentId,
            Long courseId
    ) {

        if (
                studentId == null ||
                courseId == null
        ) {

            return false;
        }

        return enrollmentRepository
                .findByStudentIdAndCourseId(
                        studentId,
                        courseId
                )
                .isPresent();
    }

    // =====================================================
    // GET COURSE ENROLLMENTS
    // =====================================================
    //
    // Returns all students enrolled in a course.
    //
    // =====================================================

    public List<Enrollment> getCourseEnrollments(
            Long courseId
    ) {

        if (courseId == null) {

            return List.of();
        }

        return enrollmentRepository
                .findByCourseId(
                        courseId
                );
    }

    // =====================================================
    // CHECK STUDENT HAS ANY ENROLLMENT
    // =====================================================

    public boolean studentHasEnrollment(
            Long studentId
    ) {

        if (studentId == null) {

            return false;
        }

        return !enrollmentRepository
                .findByStudentId(
                        studentId
                )
                .isEmpty();
    }

    // =====================================================
    // GET NUMBER OF ENROLLED COURSES
    // =====================================================

    public long getStudentCourseCount(
            Long studentId
    ) {

        return getStudentCourseIds(
                studentId
        ).size();
    }

    // =====================================================
    // DELETE ENROLLMENT
    // =====================================================

    @Transactional
    public void deleteEnrollment(
            Long id
    ) {

        if (id == null) {

            throw new RuntimeException(
                    "Enrollment ID is required."
            );
        }

        Enrollment enrollment =
                enrollmentRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Enrollment not found."
                                )
                        );

        // -------------------------------------------------
        // DELETE COURSE PROGRESS TOO
        // -------------------------------------------------

        if (
                enrollment.getStudent() != null &&
                enrollment.getCourse() != null
        ) {

            courseProgressRepository
                    .findByStudentIdAndCourseId(
                            enrollment
                                    .getStudent()
                                    .getId(),

                            enrollment
                                    .getCourse()
                                    .getId()
                    )
                    .ifPresent(
                            courseProgressRepository::delete
                    );
        }

        // -------------------------------------------------
        // DELETE ENROLLMENT
        // -------------------------------------------------

        enrollmentRepository.delete(
                enrollment
        );
    }
}