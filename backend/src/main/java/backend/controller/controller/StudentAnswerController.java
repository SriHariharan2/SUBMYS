package backend.controller;

import backend.entity.StudentAnswer;
import backend.service.StudentAnswerService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/student-answers")
public class StudentAnswerController {

    private final StudentAnswerService studentAnswerService;

    public StudentAnswerController(StudentAnswerService studentAnswerService) {
        this.studentAnswerService = studentAnswerService;
    }

    // Save or Update Student Answer
    @PostMapping("/save")
    public StudentAnswer saveAnswer(
            @RequestParam Long attemptId,
            @RequestParam Long questionId,
            @RequestParam String selectedAnswer
    ) {
        return studentAnswerService.saveAnswer(
                attemptId,
                questionId,
                selectedAnswer
        );
    }

    // Get All Answers of an Attempt
    @GetMapping("/attempt/{attemptId}")
    public List<StudentAnswer> getAnswersByAttempt(
            @PathVariable Long attemptId
    ) {
        return studentAnswerService.getAnswersByAttempt(attemptId);
    }

    // Delete Answer
    @DeleteMapping("/{id}")
    public String deleteAnswer(
            @PathVariable Long id
    ) {
        studentAnswerService.deleteAnswer(id);
        return "Student answer deleted successfully.";
    }
}