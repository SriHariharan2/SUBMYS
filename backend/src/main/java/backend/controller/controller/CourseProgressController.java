package backend.controller;

import backend.entity.CourseProgress;
import backend.service.CourseProgressService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/course-progress")
@CrossOrigin(origins = "http://localhost:5173")
public class CourseProgressController {

    private final CourseProgressService courseProgressService;

    public CourseProgressController(
            CourseProgressService courseProgressService
    ) {

        this.courseProgressService =
                courseProgressService;
    }


    // =====================================================
    // CREATE PROGRESS
    // =====================================================

    @PostMapping("/create/{studentId}/{courseId}")
    public CourseProgress createProgress(

            @PathVariable Long studentId,

            @PathVariable Long courseId

    ) {

        return courseProgressService.createProgress(
                studentId,
                courseId
        );
    }


    // =====================================================
    // UPDATE PROGRESS
    // =====================================================

    @PutMapping("/update/{studentId}/{courseId}")
    public CourseProgress updateProgress(

            @PathVariable Long studentId,

            @PathVariable Long courseId,

            @RequestParam Integer completedTopics

    ) {

        return courseProgressService.updateProgress(
                studentId,
                courseId,
                completedTopics
        );
    }


    // =====================================================
    // GET ALL PROGRESS
    // =====================================================
    // ADMIN
    // =====================================================

    @GetMapping
    public List<CourseProgress> getAllProgress() {

        return courseProgressService.getAllProgress();
    }


    // =====================================================
    // GET STUDENT PROGRESS
    // =====================================================
    // STUDENT
    // =====================================================

    @GetMapping("/student/{studentId}")
    public List<CourseProgress> getStudentProgress(

            @PathVariable Long studentId

    ) {

        return courseProgressService.getStudentProgress(
                studentId
        );
    }


    // =====================================================
    // GET COURSE PROGRESS
    // =====================================================

    @GetMapping("/course/{courseId}")
    public List<CourseProgress> getCourseProgress(

            @PathVariable Long courseId

    ) {

        return courseProgressService.getCourseProgress(
                courseId
        );
    }


    // =====================================================
    // GET SINGLE PROGRESS
    // =====================================================

    @GetMapping("/{studentId}/{courseId}")
    public CourseProgress getProgress(

            @PathVariable Long studentId,

            @PathVariable Long courseId

    ) {

        return courseProgressService.getProgress(
                studentId,
                courseId
        );
    }


    // =====================================================
    // DELETE PROGRESS
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteProgress(

            @PathVariable Long id

    ) {

        courseProgressService.deleteProgress(id);

        return "Course progress deleted successfully.";
    }
}