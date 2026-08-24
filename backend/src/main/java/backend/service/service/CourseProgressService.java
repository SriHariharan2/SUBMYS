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

import java.util.List;

@Service
public class CourseProgressService {

    private final CourseProgressRepository courseProgressRepository;
    private final UserRepository userRepository;
    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;

    public CourseProgressService(
            CourseProgressRepository courseProgressRepository,
            UserRepository userRepository,
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository
    ) {
        this.courseProgressRepository = courseProgressRepository;
        this.userRepository = userRepository;
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
    }

    // =====================================================
    // CREATE PROGRESS
    // =====================================================

    @Transactional
    public CourseProgress createProgress(
            Long studentId,
            Long courseId
    ) {

        User student = userRepository
                .findById(studentId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Student not found"
                        )
                );

        Course course = courseRepository
                .findById(courseId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Course not found"
                        )
                );

        // -------------------------------------------------
        // CHECK EXISTING PROGRESS
        // -------------------------------------------------

        if (
                courseProgressRepository
                        .findByStudentIdAndCourseId(
                                studentId,
                                courseId
                        )
                        .isPresent()
        ) {

            throw new RuntimeException(
                    "Progress already exists."
            );
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
                            subject.getTopics().size();
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

        return courseProgressRepository.save(progress);
    }

    // =====================================================
    // CREATE PROGRESS IF MISSING
    // =====================================================

    @Transactional
    public CourseProgress createProgressIfMissing(
            Long studentId,
            Long courseId
    ) {

        return courseProgressRepository
                .findByStudentIdAndCourseId(
                        studentId,
                        courseId
                )
                .orElseGet(
                        () ->
                                createProgress(
                                        studentId,
                                        courseId
                                )
                );
    }

    // =====================================================
    // UPDATE PROGRESS
    // =====================================================

    @Transactional
    public CourseProgress updateProgress(
            Long studentId,
            Long courseId,
            Integer completedTopics
    ) {

        CourseProgress progress =
                courseProgressRepository
                        .findByStudentIdAndCourseId(
                                studentId,
                                courseId
                        )
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Progress not found"
                                )
                        );

        // -------------------------------------------------
        // VALIDATE
        // -------------------------------------------------

        if (completedTopics == null) {

            throw new RuntimeException(
                    "Completed topics is required."
            );
        }

        if (completedTopics < 0) {
            completedTopics = 0;
        }

        // -------------------------------------------------
        // DON'T EXCEED TOTAL
        // -------------------------------------------------

        if (
                progress.getTotalTopics() != null &&
                completedTopics >
                        progress.getTotalTopics()
        ) {

            completedTopics =
                    progress.getTotalTopics();
        }

        progress.setCompletedTopics(
                completedTopics
        );

        // -------------------------------------------------
        // CALCULATE PERCENTAGE
        // -------------------------------------------------

        double percentage = 0.0;

        if (
                progress.getTotalTopics() != null &&
                progress.getTotalTopics() > 0
        ) {

            percentage =
                    (
                            (double) completedTopics
                                    /
                            progress.getTotalTopics()
                    ) * 100.0;
        }

        // -------------------------------------------------
        // ROUND
        // -------------------------------------------------

        percentage =
                Math.round(
                        percentage * 100.0
                ) / 100.0;

        progress.setProgressPercentage(
                percentage
        );

        // -------------------------------------------------
        // SAVE
        // -------------------------------------------------

        /*
         * IMPORTANT:
         *
         * Certificate generation has intentionally been
         * removed from here.
         *
         * Admin/Teacher will upload certificates manually
         * using CertificateService.uploadCertificate().
         *
         * Therefore CourseProgressService does NOT need
         * CertificateService anymore.
         */

        return courseProgressRepository.save(
                progress
        );
    }

    // =====================================================
    // GET ALL PROGRESS
    // =====================================================

    public List<CourseProgress> getAllProgress() {

        return courseProgressRepository.findAll();
    }

    // =====================================================
    // GET STUDENT PROGRESS
    // =====================================================

    /*
     * If the student is already enrolled but does not have
     * a CourseProgress record, create it automatically.
     */

    @Transactional
    public List<CourseProgress> getStudentProgress(
            Long studentId
    ) {

        // -------------------------------------------------
        // CHECK STUDENT
        // -------------------------------------------------

        userRepository
                .findById(studentId)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Student not found"
                        )
                );

        // -------------------------------------------------
        // GET STUDENT ENROLLMENTS
        // -------------------------------------------------

        List<Enrollment> enrollments =
                enrollmentRepository
                        .findByStudentId(
                                studentId
                        );

        // -------------------------------------------------
        // CREATE MISSING PROGRESS
        // -------------------------------------------------

        for (Enrollment enrollment : enrollments) {

            if (
                    enrollment == null ||
                    enrollment.getCourse() == null
            ) {

                continue;
            }

            Long courseId =
                    enrollment
                            .getCourse()
                            .getId();

            if (courseId == null) {
                continue;
            }

            createProgressIfMissing(
                    studentId,
                    courseId
            );
        }

        // -------------------------------------------------
        // RETURN STUDENT PROGRESS
        // -------------------------------------------------

        return courseProgressRepository
                .findByStudentId(
                        studentId
                );
    }

    // =====================================================
    // GET COURSE PROGRESS
    // =====================================================

    public List<CourseProgress> getCourseProgress(
            Long courseId
    ) {

        return courseProgressRepository
                .findByCourseId(
                        courseId
                );
    }

    // =====================================================
    // GET SINGLE PROGRESS
    // =====================================================

    public CourseProgress getProgress(
            Long studentId,
            Long courseId
    ) {

        return courseProgressRepository
                .findByStudentIdAndCourseId(
                        studentId,
                        courseId
                )
                .orElseThrow(
                        () -> new RuntimeException(
                                "Progress not found"
                        )
                );
    }

    // =====================================================
    // DELETE PROGRESS
    // =====================================================

    @Transactional
    public void deleteProgress(
            Long id
    ) {

        CourseProgress progress =
                courseProgressRepository
                        .findById(id)
                        .orElseThrow(
                                () -> new RuntimeException(
                                        "Progress not found"
                                )
                        );

        courseProgressRepository.delete(
                progress
        );
    }
}