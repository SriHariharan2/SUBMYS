package backend.repository;

import backend.entity.StudentAnswer;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface StudentAnswerRepository extends JpaRepository<StudentAnswer, Long> {

    // Get all answers of a quiz attempt
    List<StudentAnswer> findByQuizAttemptId(Long attemptId);

    // Get answer for a specific question in an attempt
    Optional<StudentAnswer> findByQuizAttemptIdAndQuestionId(
            Long attemptId,
            Long questionId
    );
}