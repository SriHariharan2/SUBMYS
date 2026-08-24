package backend.repository;

import backend.entity.Course;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface CourseRepository
        extends JpaRepository<Course, Long> {

    // Count courses created by a particular teacher
    long countByInstructorId(Long instructorId);

}