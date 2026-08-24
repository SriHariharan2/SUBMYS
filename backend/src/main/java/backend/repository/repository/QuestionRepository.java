package backend.repository;

import backend.entity.Question;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuestionRepository
        extends JpaRepository<Question, Long> {

    // =====================================================
    // GET QUESTIONS BY QUIZ
    // ORDERED BY QUESTION ORDER
    // =====================================================

    List<Question> findByQuizIdOrderByQuestionOrderAsc(
            Long quizId
    );

    // =====================================================
    // GET LAST QUESTION ORDER
    // =====================================================

    Question findTopByQuizIdOrderByQuestionOrderDesc(
            Long quizId
    );
}