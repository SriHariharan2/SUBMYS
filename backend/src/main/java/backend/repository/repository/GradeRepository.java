package backend.repository;

import backend.entity.Grade;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface GradeRepository
        extends JpaRepository<Grade, Long> {

    List<Grade> findByStudentId(
            Long studentId
    );


    List<Grade> findByAssignmentId(
            Long assignmentId
    );


    List<Grade> findByQuizId(
            Long quizId
    );


    Optional<Grade> findByStudentIdAndAssignmentId(
            Long studentId,
            Long assignmentId
    );


    Optional<Grade> findByStudentIdAndQuizId(
            Long studentId,
            Long quizId
    );
}