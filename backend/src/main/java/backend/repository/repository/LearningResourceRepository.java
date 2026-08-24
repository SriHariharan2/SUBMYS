package backend.repository;

import backend.entity.LearningResource;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface LearningResourceRepository extends JpaRepository<LearningResource, Long> {

    // Get all resources of a topic
    List<LearningResource> findByTopicId(Long topicId);

}