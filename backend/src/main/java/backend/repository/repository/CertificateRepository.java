package backend.repository;

import backend.entity.Certificate;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface CertificateRepository
        extends JpaRepository<Certificate, Long> {

    List<Certificate> findByStudentId(Long studentId);

    List<Certificate> findByCourseId(Long courseId);

    Optional<Certificate> findByStudentIdAndCourseId(
            Long studentId,
            Long courseId
    );

    Optional<Certificate> findByCertificateNumber(
            String certificateNumber
    );
}