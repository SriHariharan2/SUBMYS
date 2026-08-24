package backend.controller;

import backend.entity.Grade;
import backend.service.GradeService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
@CrossOrigin(origins = "http://localhost:5173")
public class GradeController {

    @Autowired
    private GradeService gradeService;

    // ================= ADD GRADE =================

    @PostMapping("/student/{studentId}")
    public Grade addGrade(
            @PathVariable Long studentId,
            @RequestParam(required = false) Long assignmentId,
            @RequestParam(required = false) Long quizId,
            @RequestBody Grade grade) {

        return gradeService.addGrade(
                studentId,
                assignmentId,
                quizId,
                grade
        );
    }

    // ================= UPDATE =================

    @PutMapping("/{id}")
    public Grade updateGrade(
            @PathVariable Long id,
            @RequestBody Grade grade) {

        return gradeService.updateGrade(id, grade);
    }

    // ================= DELETE =================

    @DeleteMapping("/{id}")
    public void deleteGrade(@PathVariable Long id) {

        gradeService.deleteGrade(id);
    }

    // ================= GET ALL =================

    @GetMapping
    public List<Grade> getAllGrades() {

        return gradeService.getAllGrades();
    }

    // ================= GET BY ID =================

    @GetMapping("/{id}")
    public Grade getGradeById(@PathVariable Long id) {

        return gradeService.getGradeById(id);
    }

    // ================= GET STUDENT =================

    @GetMapping("/student/{studentId}")
    public List<Grade> getStudentGrades(
            @PathVariable Long studentId) {

        return gradeService.getStudentGrades(studentId);
    }

    // ================= GET ASSIGNMENT =================

    @GetMapping("/assignment/{assignmentId}")
    public List<Grade> getAssignmentGrades(
            @PathVariable Long assignmentId) {

        return gradeService.getAssignmentGrades(assignmentId);
    }

    // ================= GET QUIZ =================

    @GetMapping("/quiz/{quizId}")
    public List<Grade> getQuizGrades(
            @PathVariable Long quizId) {

        return gradeService.getQuizGrades(quizId);
    }

    // ================= PERCENTAGE =================

    @GetMapping("/percentage/{id}")
    public double calculatePercentage(
            @PathVariable Long id) {

        return gradeService.calculatePercentage(id);
    }

}