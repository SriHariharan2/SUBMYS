package backend.controller;

import backend.dto.AssignmentSubmissionResponse;
import backend.entity.AssignmentSubmission;
import backend.service.AssignmentSubmissionService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignment-submissions")
@CrossOrigin(origins = "*")
public class AssignmentSubmissionController {

    private final AssignmentSubmissionService submissionService;

    public AssignmentSubmissionController(
            AssignmentSubmissionService submissionService
    ) {
        this.submissionService = submissionService;
    }

    // ================= SUBMIT ASSIGNMENT =================

    @PostMapping("/assignment/{assignmentId}/student/{studentId}")
    public ResponseEntity<AssignmentSubmission> submitAssignment(
            @PathVariable Long assignmentId,
            @PathVariable Long studentId,
            @RequestBody AssignmentSubmission submission
    ) {

        return ResponseEntity.ok(
                submissionService.submitAssignment(
                        assignmentId,
                        studentId,
                        submission
                )
        );
    }

    // ================= GRADE SUBMISSION =================

    @PutMapping("/{submissionId}/grade")
    public ResponseEntity<AssignmentSubmissionResponse> gradeSubmission(
            @PathVariable Long submissionId,
            @RequestParam Double score,
            @RequestParam String feedback
    ) {

        return ResponseEntity.ok(
                submissionService.gradeSubmission(
                        submissionId,
                        score,
                        feedback
                )
        );
    }

    // ================= GET ALL =================

    @GetMapping
    public ResponseEntity<List<AssignmentSubmissionResponse>> getAll() {

        return ResponseEntity.ok(
                submissionService.getAllSubmissions()
        );
    }

    // ================= GET BY ID =================

    @GetMapping("/{id}")
    public ResponseEntity<AssignmentSubmissionResponse> getById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                submissionService.getSubmission(id)
        );
    }

    // ================= GET BY STUDENT =================

    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<AssignmentSubmissionResponse>> getByStudent(
            @PathVariable Long studentId
    ) {

        return ResponseEntity.ok(
                submissionService.getByStudent(studentId)
        );
    }

    // ================= GET BY ASSIGNMENT =================

    @GetMapping("/assignment/{assignmentId}")
    public ResponseEntity<List<AssignmentSubmissionResponse>> getByAssignment(
            @PathVariable Long assignmentId
    ) {

        return ResponseEntity.ok(
                submissionService.getByAssignment(assignmentId)
        );
    }

    // ================= DELETE =================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> delete(
            @PathVariable Long id
    ) {

        submissionService.deleteSubmission(id);

        return ResponseEntity.ok(
                "Submission deleted successfully."
        );
    }

}