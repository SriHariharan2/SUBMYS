package backend.repository;

import backend.entity.Assignment;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AssignmentRepository
        extends JpaRepository<Assignment, Long> {

    // Get all assignments belonging to a topic
    List<Assignment> findByTopicId(Long topicId);

}