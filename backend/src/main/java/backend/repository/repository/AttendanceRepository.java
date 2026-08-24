package  backend.repository;

import  backend.entity.Attendance;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Repository
public interface AttendanceRepository extends JpaRepository<Attendance, Long> {

    // ================= STUDENT =================

    List<Attendance> findByStudentId(Long studentId);

    // ================= COURSE =================

    List<Attendance> findByCourseId(Long courseId);

    // ================= DATE =================

    List<Attendance> findByAttendanceDate(LocalDate attendanceDate);

    // ================= STUDENT + DATE =================

    Optional<Attendance> findByStudentIdAndAttendanceDate(
            Long studentId,
            LocalDate attendanceDate
    );

    // ================= COURSE + DATE =================

    List<Attendance> findByCourseIdAndAttendanceDate(
            Long courseId,
            LocalDate attendanceDate
    );

    // ================= DUPLICATE CHECK =================

    boolean existsByStudentIdAndCourseIdAndAttendanceDate(
            Long studentId,
            Long courseId,
            LocalDate attendanceDate
    );

}