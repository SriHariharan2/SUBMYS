package backend.repository;

import backend.entity.Submission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface SubmissionRepository extends JpaRepository<Submission, Long> {

    // Get all submissions of a student
    List<Submission> findByStudentId(Long studentId);

    // Get all submissions for an assignment
    List<Submission> findByAssignmentId(Long assignmentId);

    // Check if student has already submitted
    Optional<Submission> findByStudentIdAndAssignmentId(
            Long studentId,
            Long assignmentId
    );
}