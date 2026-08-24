package backend.service;

import backend.entity.Assignment;
import backend.entity.Submission;
import backend.entity.User;
import backend.repository.AssignmentRepository;
import backend.repository.SubmissionRepository;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.util.List;

@Service
public class SubmissionService {

    private final SubmissionRepository submissionRepository;
    private final UserRepository userRepository;
    private final AssignmentRepository assignmentRepository;

    public SubmissionService(
            SubmissionRepository submissionRepository,
            UserRepository userRepository,
            AssignmentRepository assignmentRepository
    ) {
        this.submissionRepository = submissionRepository;
        this.userRepository = userRepository;
        this.assignmentRepository = assignmentRepository;
    }

    // Student submits assignment
    public Submission submitAssignment(
            Long studentId,
            Long assignmentId,
            Submission submission
    ) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() ->
                        new RuntimeException("Student not found"));

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() ->
                        new RuntimeException("Assignment not found"));

        submissionRepository.findByStudentIdAndAssignmentId(studentId, assignmentId)
                .ifPresent(s -> {
                    throw new RuntimeException("Assignment already submitted.");
                });

        submission.setStudent(student);
        submission.setAssignment(assignment);
        submission.setSubmittedAt(LocalDateTime.now());

        return submissionRepository.save(submission);
    }

    // Get all submissions
    public List<Submission> getAllSubmissions() {
        return submissionRepository.findAll();
    }

    // Get submission by ID
    public Submission getSubmissionById(Long id) {
        return submissionRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Submission not found"));
    }

    // Get submissions of a student
    public List<Submission> getStudentSubmissions(Long studentId) {
        return submissionRepository.findByStudentId(studentId);
    }

    // Get submissions for an assignment
    public List<Submission> getAssignmentSubmissions(Long assignmentId) {
        return submissionRepository.findByAssignmentId(assignmentId);
    }

    // Grade submission
    public Submission gradeSubmission(
            Long submissionId,
            Integer marks,
            String feedback
    ) {

        Submission submission = getSubmissionById(submissionId);

        submission.setMarks(marks);
        submission.setFeedback(feedback);

        return submissionRepository.save(submission);
    }

    // Delete submission
    public void deleteSubmission(Long id) {

        Submission submission = getSubmissionById(id);

        submissionRepository.delete(submission);
    }
}