package backend.repository;

import backend.entity.CourseProgress;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CourseProgressRepository extends JpaRepository<CourseProgress, Long> {

    // Get all progress records of a student
    List<CourseProgress> findByStudentId(Long studentId);

    // Get all progress records of a course
    List<CourseProgress> findByCourseId(Long courseId);

    // Get a student's progress in a specific course
    Optional<CourseProgress> findByStudentIdAndCourseId(
            Long studentId,
            Long courseId
    );
}