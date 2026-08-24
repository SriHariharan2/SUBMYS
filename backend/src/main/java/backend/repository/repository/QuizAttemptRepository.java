package backend.repository;

import backend.entity.QuizAttempt;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface QuizAttemptRepository
        extends JpaRepository<QuizAttempt, Long> {

    // =========================================================
    // GET ALL ATTEMPTS OF STUDENT
    // =========================================================

    List<QuizAttempt> findByStudentId(
            Long studentId
    );


    // =========================================================
    // GET ALL ATTEMPTS OF QUIZ
    // =========================================================

    List<QuizAttempt> findByQuizId(
            Long quizId
    );


    // =========================================================
    // GET EXACT / EXISTING STUDENT + QUIZ ATTEMPT
    // =========================================================
    //
    // Kept for your existing AttendQuiz.jsx code.
    //
    // IMPORTANT:
    // This returns an Optional and therefore is only suitable
    // when your frontend wants one/latest matching attempt.
    //
    // =========================================================

    Optional<QuizAttempt> findByStudentIdAndQuizId(
            Long studentId,
            Long quizId
    );


    // =========================================================
    // GET ALL ATTEMPTS FOR STUDENT + QUIZ
    // =========================================================
    //
    // Example:
    //
    // Student 3 + Quiz 2
    //
    // Attempt 1
    // Attempt 2
    // Attempt 3
    //
    // =========================================================

    List<QuizAttempt> findAllByStudentIdAndQuizId(
            Long studentId,
            Long quizId
    );


    // =========================================================
    // COUNT STUDENT ATTEMPTS FOR QUIZ
    // =========================================================
    //
    // Example:
    //
    // maxAttempts = 2
    //
    // count = 0 -> can start
    // count = 1 -> can start
    // count = 2 -> cannot start
    //
    // =========================================================

    long countByStudentIdAndQuizId(
            Long studentId,
            Long quizId
    );


    // =========================================================
    // GET ATTEMPTS BY STATUS
    // =========================================================
    //
    // Used for completed quiz grade processing / backfill.
    //
    // Example:
    //
    // COMPLETED
    // IN_PROGRESS
    //
    // =========================================================

    List<QuizAttempt> findByStatus(
            String status
    );
}