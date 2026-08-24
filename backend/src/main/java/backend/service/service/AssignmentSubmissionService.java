package backend.service;

import backend.dto.AssignmentSubmissionResponse;
import backend.entity.Assignment;
import backend.entity.AssignmentSubmission;
import backend.entity.Grade;
import backend.entity.User;
import backend.repository.AssignmentRepository;
import backend.repository.AssignmentSubmissionRepository;
import backend.repository.GradeRepository;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class AssignmentSubmissionService {

    private final AssignmentSubmissionRepository submissionRepository;
    private final AssignmentRepository assignmentRepository;
    private final UserRepository userRepository;
    private final GradeRepository gradeRepository;

    public AssignmentSubmissionService(
            AssignmentSubmissionRepository submissionRepository,
            AssignmentRepository assignmentRepository,
            UserRepository userRepository,
            GradeRepository gradeRepository
    ) {
        this.submissionRepository = submissionRepository;
        this.assignmentRepository = assignmentRepository;
        this.userRepository = userRepository;
        this.gradeRepository = gradeRepository;
    }

    // ================= CREATE SUBMISSION =================

    public AssignmentSubmission submitAssignment(
            Long assignmentId,
            Long studentId,
            AssignmentSubmission submission
    ) {

        Assignment assignment = assignmentRepository.findById(assignmentId)
                .orElseThrow(() -> new RuntimeException("Assignment not found."));

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found."));

        submission.setAssignment(assignment);
        submission.setStudent(student);

        return submissionRepository.save(submission);
    }

    // ================= GRADE SUBMISSION =================

 // ================= GRADE SUBMISSION =================

public AssignmentSubmissionResponse gradeSubmission(
        Long submissionId,
        Double score,
        String feedback
) {

    AssignmentSubmission submission = submissionRepository.findById(submissionId)
            .orElseThrow(() -> new RuntimeException("Submission not found."));

    submission.setScore(score);
    submission.setFeedback(feedback);

    AssignmentSubmission savedSubmission = submissionRepository.save(submission);

    Grade grade = gradeRepository
            .findByStudentIdAndAssignmentId(
                    savedSubmission.getStudent().getId(),
                    savedSubmission.getAssignment().getId()
            )
            .orElse(new Grade());

    grade.setStudent(savedSubmission.getStudent());
    grade.setAssignment(savedSubmission.getAssignment());
    grade.setScore(score);

    if (savedSubmission.getAssignment().getMaxMarks() != null) {
        grade.setMaxScore(
                savedSubmission.getAssignment().getMaxMarks().doubleValue()
        );
    }

    grade.setRemarks(feedback);

    gradeRepository.save(grade);

    return mapToResponse(savedSubmission);
}

    // ================= CONVERT ENTITY TO DTO =================

    private AssignmentSubmissionResponse mapToResponse(
        AssignmentSubmission submission
) {

    return new AssignmentSubmissionResponse(

            submission.getId(),

            submission.getStudent().getId(),

            submission.getStudent().getFullName(),

            submission.getAssignment().getId(),

            submission.getAssignment().getTitle(),

            submission.getAssignment().getMaxMarks(),

            submission.getFileUrl(),

            submission.getScore(),

            submission.getFeedback(),

            submission.getSubmittedAt()

    );

}

    // ================= GET ALL =================

    public List<AssignmentSubmissionResponse> getAllSubmissions() {

        return submissionRepository.findAll()

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }

    // ================= GET BY ID =================

    public AssignmentSubmissionResponse getSubmission(Long id) {

        AssignmentSubmission submission = submissionRepository.findById(id)

                .orElseThrow(() ->
                        new RuntimeException("Submission not found."));

        return mapToResponse(submission);

    }

    // ================= GET BY STUDENT =================

    public List<AssignmentSubmissionResponse> getByStudent(Long studentId) {

        return submissionRepository.findByStudentId(studentId)

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }

    // ================= GET BY ASSIGNMENT =================

    public List<AssignmentSubmissionResponse> getByAssignment(Long assignmentId) {

        return submissionRepository.findByAssignmentId(assignmentId)

                .stream()

                .map(this::mapToResponse)

                .collect(Collectors.toList());

    }

    // ================= DELETE =================

    public void deleteSubmission(Long id) {

        submissionRepository.deleteById(id);

    }

}