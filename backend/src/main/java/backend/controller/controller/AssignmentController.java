package backend.controller;

import backend.dto.AssignmentResponse;
import backend.entity.Assignment;
import backend.service.AssignmentService;

import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/assignments")
@CrossOrigin(origins = "*")
public class AssignmentController {

    private final AssignmentService assignmentService;


    public AssignmentController(
            AssignmentService assignmentService
    ) {

        this.assignmentService =
                assignmentService;
    }


    // =====================================================
    // CREATE
    // =====================================================

    @PostMapping("/{topicId}")
    public Assignment createAssignment(
            @PathVariable Long topicId,
            @RequestBody Assignment assignment
    ) {

        return assignmentService.createAssignment(
                topicId,
                assignment
        );
    }


    // =====================================================
    // GET ALL
    // =====================================================
    //
    // ADMIN
    //
    // =====================================================

    @GetMapping
    public List<AssignmentResponse>
    getAllAssignments() {

        return assignmentService
                .getAllAssignments();
    }


    // =====================================================
    // GET ASSIGNMENTS FOR STUDENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}"
    )
    public List<AssignmentResponse>
    getAssignmentsForStudent(
            @PathVariable Long studentId
    ) {

        return assignmentService
                .getAssignmentsForStudent(
                        studentId
                );
    }


    // =====================================================
    // GET BY ID
    // =====================================================

    @GetMapping("/{id}")
    public AssignmentResponse
    getAssignmentById(
            @PathVariable Long id
    ) {

        return assignmentService
                .getAssignmentById(id);
    }


    // =====================================================
    // GET ASSIGNMENT FOR STUDENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}/{assignmentId}"
    )
    public AssignmentResponse
    getAssignmentForStudent(

            @PathVariable Long studentId,

            @PathVariable Long assignmentId

    ) {

        return assignmentService
                .getAssignmentForStudent(
                        studentId,
                        assignmentId
                );
    }


    // =====================================================
    // GET BY TOPIC
    // =====================================================

    @GetMapping(
            "/topic/{topicId}"
    )
    public List<AssignmentResponse>
    getAssignmentsByTopic(
            @PathVariable Long topicId
    ) {

        return assignmentService
                .getAssignmentsByTopic(
                        topicId
                );
    }


    // =====================================================
    // GET BY TOPIC FOR STUDENT
    // =====================================================

    @GetMapping(
            "/student/{studentId}/topic/{topicId}"
    )
    public List<AssignmentResponse>
    getAssignmentsByTopicForStudent(

            @PathVariable Long studentId,

            @PathVariable Long topicId

    ) {

        return assignmentService
                .getAssignmentsByTopicForStudent(
                        studentId,
                        topicId
                );
    }


    // =====================================================
    // UPDATE
    // =====================================================

    @PutMapping("/{id}")
    public Assignment updateAssignment(
            @PathVariable Long id,
            @RequestBody Assignment assignment
    ) {

        return assignmentService.updateAssignment(
                id,
                assignment
        );
    }


    // =====================================================
    // DELETE
    // =====================================================

    @DeleteMapping("/{id}")
    public String deleteAssignment(
            @PathVariable Long id
    ) {

        assignmentService.deleteAssignment(id);

        return "Assignment deleted successfully.";
    }
}