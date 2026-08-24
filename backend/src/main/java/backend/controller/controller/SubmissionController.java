package backend.controller;

import backend.entity.Submission;
import backend.service.SubmissionService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/submissions")
public class SubmissionController {

    private final SubmissionService submissionService;

    public SubmissionController(SubmissionService submissionService) {
        this.submissionService = submissionService;
    }

    // Student submits an assignment
    @PostMapping("/{studentId}/{assignmentId}")
    public Submission submitAssignment(
            @PathVariable Long studentId,
            @PathVariable Long assignmentId,
            @RequestBody Submission submission
    ) {
        return submissionService.submitAssignment(studentId, assignmentId, submission);
    }

    // Get all submissions
    @GetMapping
    public List<Submission> getAllSubmissions() {
        return submissionService.getAllSubmissions();
    }

    // Get submission by ID
    @GetMapping("/{id}")
    public Submission getSubmissionById(@PathVariable Long id) {
        return submissionService.getSubmissionById(id);
    }

    // Get all submissions of a student
    @GetMapping("/student/{studentId}")
    public List<Submission> getStudentSubmissions(
            @PathVariable Long studentId
    ) {
        return submissionService.getStudentSubmissions(studentId);
    }

    // Get all submissions for an assignment
    @GetMapping("/assignment/{assignmentId}")
    public List<Submission> getAssignmentSubmissions(
            @PathVariable Long assignmentId
    ) {
        return submissionService.getAssignmentSubmissions(assignmentId);
    }

    // Grade a submission
    @PutMapping("/{submissionId}/grade")
    public Submission gradeSubmission(
            @PathVariable Long submissionId,
            @RequestParam Integer marks,
            @RequestParam String feedback
    ) {
        return submissionService.gradeSubmission(
                submissionId,
                marks,
                feedback
        );
    }

    // Delete submission
    @DeleteMapping("/{id}")
    public String deleteSubmission(@PathVariable Long id) {
        submissionService.deleteSubmission(id);
        return "Submission deleted successfully.";
    }
}