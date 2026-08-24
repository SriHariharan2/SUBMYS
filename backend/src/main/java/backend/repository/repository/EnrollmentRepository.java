package backend.repository;

import backend.entity.Enrollment;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface EnrollmentRepository extends JpaRepository<Enrollment, Long> {

    // Get all enrollments of a student
    List<Enrollment> findByStudentId(Long studentId);

    // Get all students enrolled in a course
    List<Enrollment> findByCourseId(Long courseId);

    // Check if a student is already enrolled
    Optional<Enrollment> findByStudentIdAndCourseId(
            Long studentId,
            Long courseId
    );
}