package backend.repository;

import backend.entity.AssignmentSubmission;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface AssignmentSubmissionRepository
        extends JpaRepository<AssignmentSubmission, Long> {

    // All submissions of one student
    List<AssignmentSubmission> findByStudentId(Long studentId);

    // All submissions for one assignment
    List<AssignmentSubmission> findByAssignmentId(Long assignmentId);

    // One student's submission for one assignment
    Optional<AssignmentSubmission> findByStudentIdAndAssignmentId(
            Long studentId,
            Long assignmentId
    );

}