package backend.controller;

import backend.dto.CourseResponse;
import backend.entity.Course;
import backend.service.CourseService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/courses")
@CrossOrigin(origins = "*")
public class CourseController {

    private final CourseService courseService;


    public CourseController(
            CourseService courseService
    ) {

        this.courseService =
                courseService;
    }


    // =====================================================
    // CREATE COURSE
    // =====================================================

    @PostMapping
    public Course createCourse(
            @RequestBody Course course
    ) {

        return courseService.createCourse(
                course
        );
    }


    // =====================================================
    // GET ALL COURSES
    // =====================================================
    //
    // ADMIN
    //
    // =====================================================

    @GetMapping
    public List<CourseResponse> getAllCourses() {

        return courseService.getAllCourses();
    }


    // =====================================================
    // GET COURSES FOR STUDENT
    // =====================================================
    //
    // STUDENT SHOULD USE THIS ENDPOINT.
    //
    // Example:
    //
    // GET /api/courses/student/3
    //
    // =====================================================

    @GetMapping("/student/{studentId}")
    public List<CourseResponse> getCoursesForStudent(
            @PathVariable Long studentId
    ) {

        return courseService
                .getCoursesForStudent(
                        studentId
                );
    }


    // =====================================================
    // GET COURSE BY ID
    // =====================================================

    @GetMapping("/{id}")
    public Course getCourseById(
            @PathVariable Long id
    ) {

        return courseService.getCourseById(id);
    }


    // =====================================================
    // GET COURSE FOR STUDENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}/{courseId}"
    )
    public Course getCourseForStudent(

            @PathVariable Long studentId,

            @PathVariable Long courseId

    ) {

        return courseService
                .getCourseForStudent(
                        studentId,
                        courseId
                );
    }


    // =====================================================
    // UPDATE COURSE
    // =====================================================

    @PutMapping("/{id}")
    public Course updateCourse(
            @PathVariable Long id,
            @RequestBody Course course
    ) {

        return courseService.updateCourse(
                id,
                course
        );
    }


    // =====================================================
    // DELETE COURSE
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteCourse(
            @PathVariable Long id
    ) {

        courseService.deleteCourse(id);

        return "Course deleted successfully.";
    }
}