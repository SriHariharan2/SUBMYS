package backend.service;

import backend.dto.CourseResponse;
import backend.entity.Course;
import backend.repository.CourseRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CourseService {

    private final CourseRepository courseRepository;

    private final EnrollmentService enrollmentService;


    public CourseService(
            CourseRepository courseRepository,
            EnrollmentService enrollmentService
    ) {

        this.courseRepository =
                courseRepository;

        this.enrollmentService =
                enrollmentService;
    }


    // =====================================================
    // CREATE COURSE
    // =====================================================

    public Course createCourse(
            Course course
    ) {

        return courseRepository.save(course);
    }


    // =====================================================
    // GET ALL COURSES
    // =====================================================
    //
    // ADMIN USE
    //
    // Returns every course.
    //
    // =====================================================

    public List<CourseResponse> getAllCourses() {

        return courseRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET COURSES FOR STUDENT
    // =====================================================
    //
    // ONLY COURSES WHERE THE STUDENT IS ENROLLED
    //
    // =====================================================

    public List<CourseResponse> getCoursesForStudent(
            Long studentId
    ) {

        List<Long> enrolledCourseIds =
                enrollmentService
                        .getStudentCourseIds(studentId);


        if (enrolledCourseIds.isEmpty()) {

            return List.of();
        }


        return courseRepository.findAll()
                .stream()
                .filter(course ->
                        course.getId() != null
                                &&
                        enrolledCourseIds.contains(
                                course.getId()
                        )
                )
                .map(this::mapToResponse)
                .toList();
    }


    // =====================================================
    // GET COURSE BY ID
    // =====================================================

    public Course getCourseById(
            Long id
    ) {

        return courseRepository.findById(id)
                .orElseThrow(
                        () -> new RuntimeException(
                                "Course not found"
                        )
                );
    }


    // =====================================================
    // CHECK STUDENT COURSE ACCESS
    // =====================================================

    public boolean studentCanAccessCourse(
            Long studentId,
            Long courseId
    ) {

        return enrollmentService
                .isStudentEnrolled(
                        studentId,
                        courseId
                );
    }


    // =====================================================
    // GET COURSE FOR STUDENT
    // =====================================================

    public Course getCourseForStudent(
            Long studentId,
            Long courseId
    ) {

        if (
                !studentCanAccessCourse(
                        studentId,
                        courseId
                )
        ) {

            throw new RuntimeException(
                    "Student is not enrolled in this course."
            );
        }


        return getCourseById(courseId);
    }


    // =====================================================
    // ENTITY -> DTO
    // =====================================================

    private CourseResponse mapToResponse(
            Course course
    ) {

        return new CourseResponse(

                course.getId(),

                course.getTitle(),

                course.getDescription(),

                course.getCourseCode(),

                course.getInstructor() != null
                        ? course.getInstructor().getId()
                        : null,

                course.getInstructor() != null
                        ? course.getInstructor().getFullName()
                        : null
        );
    }


    // =====================================================
    // UPDATE COURSE
    // =====================================================

    public Course updateCourse(
            Long id,
            Course updatedCourse
    ) {

        Course course =
                getCourseById(id);


        course.setTitle(
                updatedCourse.getTitle()
        );

        course.setDescription(
                updatedCourse.getDescription()
        );

        course.setInstructor(
                updatedCourse.getInstructor()
        );


        return courseRepository.save(course);
    }


    // =====================================================
    // DELETE COURSE
    // =====================================================

    public void deleteCourse(
            Long id
    ) {

        Course course =
                getCourseById(id);

        courseRepository.delete(course);
    }
}