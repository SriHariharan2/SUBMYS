package  backend.controller;

import  backend.entity.Attendance;
import  backend.service.AttendanceService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/attendance")
@CrossOrigin(origins = "http://localhost:5173")
public class AttendanceController {

    @Autowired
    private AttendanceService attendanceService;

    // ================= MARK ATTENDANCE =================

    @PostMapping("/student/{studentId}/course/{courseId}")
    public Attendance markAttendance(
            @PathVariable Long studentId,
            @PathVariable Long courseId,
            @RequestBody Attendance attendance) {

        return attendanceService.markAttendance(
                studentId,
                courseId,
                attendance
        );
    }

    // ================= UPDATE =================

    @PutMapping("/{id}")
    public Attendance updateAttendance(
            @PathVariable Long id,
            @RequestBody Attendance attendance) {

        return attendanceService.updateAttendance(id, attendance);
    }

    // ================= DELETE =================

    @DeleteMapping("/{id}")
    public void deleteAttendance(@PathVariable Long id) {

        attendanceService.deleteAttendance(id);
    }

    // ================= GET ALL =================

    @GetMapping
    public List<Attendance> getAllAttendance() {

        return attendanceService.getAllAttendance();
    }

    // ================= GET BY ID =================

    @GetMapping("/{id}")
    public Attendance getAttendanceById(
            @PathVariable Long id) {

        return attendanceService.getAttendanceById(id);
    }

    // ================= GET STUDENT =================

    @GetMapping("/student/{studentId}")
    public List<Attendance> getStudentAttendance(
            @PathVariable Long studentId) {

        return attendanceService.getStudentAttendance(studentId);
    }

    // ================= GET COURSE =================

    @GetMapping("/course/{courseId}")
    public List<Attendance> getCourseAttendance(
            @PathVariable Long courseId) {

        return attendanceService.getCourseAttendance(courseId);
    }

    // ================= GET DATE =================

    @GetMapping("/date/{date}")
    public List<Attendance> getAttendanceByDate(
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date) {

        return attendanceService.getAttendanceByDate(date);
    }

    // ================= ATTENDANCE PERCENTAGE =================

    @GetMapping("/percentage/{studentId}/{courseId}")
    public double calculateAttendancePercentage(
            @PathVariable Long studentId,
            @PathVariable Long courseId) {

        return attendanceService.calculateAttendancePercentage(
                studentId,
                courseId
        );
    }

}