package backend.controller;

import backend.entity.Enrollment;
import backend.service.EnrollmentService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/enrollments")
@CrossOrigin(origins = "*")
public class EnrollmentController {

    private final EnrollmentService enrollmentService;

    public EnrollmentController(
            EnrollmentService enrollmentService
    ) {
        this.enrollmentService = enrollmentService;
    }


    // =====================================================
    // ENROLL STUDENT
    // =====================================================

    @PostMapping(
            "/student/{studentId}/course/{courseId}"
    )
    public ResponseEntity<Enrollment> enrollStudent(

            @PathVariable Long studentId,

            @PathVariable Long courseId

    ) {

        return ResponseEntity.ok(

                enrollmentService.enrollStudent(
                        studentId,
                        courseId
                )

        );
    }


    // =====================================================
    // GET ALL ENROLLMENTS
    // =====================================================

    @GetMapping
    public ResponseEntity<List<Enrollment>>
    getAllEnrollments() {

        return ResponseEntity.ok(

                enrollmentService.getAllEnrollments()

        );
    }


    // =====================================================
    // GET STUDENT ENROLLMENTS
    // =====================================================

    @GetMapping(
            "/student/{studentId}"
    )
    public ResponseEntity<List<Enrollment>>
    getStudentEnrollments(

            @PathVariable Long studentId

    ) {

        return ResponseEntity.ok(

                enrollmentService.getStudentEnrollments(
                        studentId
                )

        );
    }


    // =====================================================
    // GET STUDENT COURSE IDS
    // =====================================================
    //
    // Example:
    //
    // GET
    // /api/enrollments/student/3/course-ids
    //
    // Response:
    //
    // [1, 5, 7]
    //
    // =====================================================

    @GetMapping(
            "/student/{studentId}/course-ids"
    )
    public ResponseEntity<List<Long>>
    getStudentCourseIds(

            @PathVariable Long studentId

    ) {

        return ResponseEntity.ok(

                enrollmentService.getStudentCourseIds(
                        studentId
                )

        );
    }


    // =====================================================
    // CHECK STUDENT ENROLLED IN COURSE
    // =====================================================

    @GetMapping(
            "/student/{studentId}/course/{courseId}"
    )
    public ResponseEntity<Boolean>
    isStudentEnrolled(

            @PathVariable Long studentId,

            @PathVariable Long courseId

    ) {

        return ResponseEntity.ok(

                enrollmentService.isStudentEnrolled(
                        studentId,
                        courseId
                )

        );
    }


    // =====================================================
    // GET COURSE ENROLLMENTS
    // =====================================================

    @GetMapping(
            "/course/{courseId}"
    )
    public ResponseEntity<List<Enrollment>>
    getCourseEnrollments(

            @PathVariable Long courseId

    ) {

        return ResponseEntity.ok(

                enrollmentService.getCourseEnrollments(
                        courseId
                )

        );
    }


    // =====================================================
    // STUDENT HAS ANY ENROLLMENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}/has-enrollment"
    )
    public ResponseEntity<Boolean>
    studentHasEnrollment(

            @PathVariable Long studentId

    ) {

        return ResponseEntity.ok(

                enrollmentService.studentHasEnrollment(
                        studentId
                )

        );
    }


    // =====================================================
    // STUDENT COURSE COUNT
    // =====================================================

    @GetMapping(
            "/student/{studentId}/course-count"
    )
    public ResponseEntity<Long>
    getStudentCourseCount(

            @PathVariable Long studentId

    ) {

        return ResponseEntity.ok(

                enrollmentService.getStudentCourseCount(
                        studentId
                )

        );
    }


    // =====================================================
    // DELETE ENROLLMENT
    // =====================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String>
    deleteEnrollment(

            @PathVariable Long id

    ) {

        enrollmentService.deleteEnrollment(id);

        return ResponseEntity.ok(
                "Enrollment deleted successfully."
        );
    }
}