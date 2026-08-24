package backend.service;




import backend.entity.Attendance;
import backend.entity.Course;
import backend.entity.User;
import backend.repository.AttendanceRepository;
import backend.repository.CourseRepository;
import backend.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.util.List;

@Service
public class AttendanceService {

    @Autowired
    private AttendanceRepository attendanceRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CourseRepository courseRepository;

    // ================= MARK ATTENDANCE =================

    public Attendance markAttendance(
            Long studentId,
            Long courseId,
            Attendance attendance) {

        User student = userRepository.findById(studentId)
                .orElseThrow(() -> new RuntimeException("Student not found"));

        Course course = courseRepository.findById(courseId)
                .orElseThrow(() -> new RuntimeException("Course not found"));

        if (attendanceRepository.existsByStudentIdAndCourseIdAndAttendanceDate(
                studentId,
                courseId,
                attendance.getAttendanceDate())) {

            throw new RuntimeException(
                    "Attendance already marked for this student on this date."
            );
        }

        attendance.setStudent(student);
        attendance.setCourse(course);

        return attendanceRepository.save(attendance);
    }

    // ================= UPDATE =================

    public Attendance updateAttendance(
            Long id,
            Attendance updatedAttendance) {

        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));

        attendance.setAttendanceDate(updatedAttendance.getAttendanceDate());
        attendance.setStatus(updatedAttendance.getStatus());
        attendance.setRemarks(updatedAttendance.getRemarks());

        return attendanceRepository.save(attendance);
    }

    // ================= DELETE =================

    public void deleteAttendance(Long id) {

        Attendance attendance = attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));

        attendanceRepository.delete(attendance);
    }

    // ================= GET ALL =================

    public List<Attendance> getAllAttendance() {

        return attendanceRepository.findAll();
    }

    // ================= GET BY ID =================

    public Attendance getAttendanceById(Long id) {

        return attendanceRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Attendance not found"));
    }

    // ================= GET STUDENT =================

    public List<Attendance> getStudentAttendance(Long studentId) {

        return attendanceRepository.findByStudentId(studentId);
    }

    // ================= GET COURSE =================

    public List<Attendance> getCourseAttendance(Long courseId) {

        return attendanceRepository.findByCourseId(courseId);
    }

    // ================= GET DATE =================

    public List<Attendance> getAttendanceByDate(LocalDate date) {

        return attendanceRepository.findByAttendanceDate(date);
    }

    // ================= ATTENDANCE PERCENTAGE =================

    public double calculateAttendancePercentage(
            Long studentId,
            Long courseId) {

        List<Attendance> attendanceList =
                attendanceRepository.findByCourseId(courseId);

        long totalClasses = attendanceList.stream()
                .filter(a -> a.getStudent().getId().equals(studentId))
                .count();

        if (totalClasses == 0) {
            return 0;
        }

        long presentClasses = attendanceList.stream()
                .filter(a -> a.getStudent().getId().equals(studentId))
                .filter(a -> a.getStatus().name().equals("PRESENT"))
                .count();

        return (double) presentClasses / totalClasses * 100;
    }

}