package backend.controller;

import backend.dto.SubjectResponse;
import backend.entity.Subject;
import backend.service.SubjectService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/subjects")
@CrossOrigin(origins = "*")
public class SubjectController {

    private final SubjectService subjectService;


    public SubjectController(
            SubjectService subjectService
    ) {

        this.subjectService =
                subjectService;
    }


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping("/{courseId}")
    public Subject createSubject(
            @PathVariable Long courseId,
            @RequestBody Subject subject
    ) {

        return subjectService.createSubject(
                courseId,
                subject
        );
    }


    // =====================================================
    // GET ALL
    // =====================================================
    //
    // ADMIN
    //
    // =====================================================

    @GetMapping
    public List<SubjectResponse> getAllSubjects() {

        return subjectService.getAllSubjects();
    }


    // =====================================================
    // GET SUBJECTS FOR STUDENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}"
    )
    public List<SubjectResponse> getSubjectsForStudent(
            @PathVariable Long studentId
    ) {

        return subjectService
                .getSubjectsForStudent(
                        studentId
                );
    }


    // =====================================================
    // GET SUBJECT BY ID
    // =====================================================

    @GetMapping("/{id}")
    public Subject getSubjectById(
            @PathVariable Long id
    ) {

        return subjectService.getSubjectById(id);
    }


    // =====================================================
    // GET SUBJECT FOR STUDENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}/{subjectId}"
    )
    public Subject getSubjectForStudent(

            @PathVariable Long studentId,

            @PathVariable Long subjectId

    ) {

        return subjectService
                .getSubjectForStudent(
                        studentId,
                        subjectId
                );
    }


    // =====================================================
    // GET BY COURSE
    // =====================================================

    @GetMapping(
            "/course/{courseId}"
    )
    public List<Subject> getSubjectsByCourse(
            @PathVariable Long courseId
    ) {

        return subjectService
                .getSubjectsByCourse(
                        courseId
                );
    }


    // =====================================================
    // GET BY COURSE FOR STUDENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}/course/{courseId}"
    )
    public List<Subject>
    getSubjectsByCourseForStudent(

            @PathVariable Long studentId,

            @PathVariable Long courseId

    ) {

        return subjectService
                .getSubjectsByCourseForStudent(
                        studentId,
                        courseId
                );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}/{courseId}")
    public Subject updateSubject(

            @PathVariable Long id,

            @PathVariable Long courseId,

            @RequestBody Subject subject

    ) {

        return subjectService.updateSubject(
                id,
                courseId,
                subject
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteSubject(
            @PathVariable Long id
    ) {

        subjectService.deleteSubject(id);

        return "Subject deleted successfully.";
    }
}