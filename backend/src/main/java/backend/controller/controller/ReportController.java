package backend.controller;

import backend.service.ReportService;

import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/reports")
@CrossOrigin(origins = "http://localhost:5173")
public class ReportController {

    private final ReportService reportService;

    public ReportController(
            ReportService reportService
    ) {

        this.reportService = reportService;
    }


    // =====================================================
    // DASHBOARD SUMMARY
    // =====================================================

    @GetMapping("/dashboard")
    public Map<String, Object> getDashboardSummary() {

        return reportService.getDashboardSummary();

    }


    // =====================================================
    // STUDENT REPORT
    // =====================================================

    @GetMapping("/student/{studentId}")
    public Map<String, Object> getStudentReport(
            @PathVariable Long studentId
    ) {

        return reportService.getStudentReport(
                studentId
        );

    }


    // =====================================================
    // TEACHER REPORT
    // =====================================================

    @GetMapping("/teacher/{teacherId}")
    public Object getTeacherReport(
            @PathVariable Long teacherId
    ) {

        return reportService.getTeacherReport(
                teacherId
        );

    }

}