package backend.repository;

import backend.entity.Quiz;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface QuizRepository extends JpaRepository<Quiz, Long> {

    // Get all quizzes belonging to a topic
    List<Quiz> findByTopicId(Long topicId);

}