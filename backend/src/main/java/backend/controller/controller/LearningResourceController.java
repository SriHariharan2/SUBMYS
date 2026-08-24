package backend.controller;

import backend.dto.LearningResourceResponse;
import backend.entity.LearningResource;
import backend.service.LearningResourceService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;

@RestController
@RequestMapping("/api/resources")
@CrossOrigin(origins = "*")
public class LearningResourceController {

    private final LearningResourceService learningResourceService;

    public LearningResourceController(
            LearningResourceService learningResourceService
    ) {
        this.learningResourceService = learningResourceService;
    }

    // ================= Create VIDEO / LINK =================

    @PostMapping("/topic/{topicId}")
    public LearningResource createResource(

            @PathVariable Long topicId,

            @RequestBody LearningResource resource

    ) {

        return learningResourceService.createResource(
                topicId,
                resource
        );

    }

    // ================= Upload PDF / PPT =================

    @PostMapping("/topic/{topicId}/upload")
    public ResponseEntity<LearningResource> uploadResource(

            @PathVariable Long topicId,

            @RequestParam String title,

            @RequestParam String description,

            @RequestParam String resourceType,

            @RequestParam("file") MultipartFile file

    ) {

        LearningResource resource =
                learningResourceService.createResourceWithFile(

                        topicId,

                        title,

                        description,

                        resourceType,

                        file

                );

        return ResponseEntity.ok(resource);

    }

    // ================= Replace File =================

    @PutMapping("/{id}/upload")
    public ResponseEntity<LearningResource> replaceFile(

            @PathVariable Long id,

            @RequestParam String title,

            @RequestParam String description,

            @RequestParam String resourceType,

            @RequestParam("file") MultipartFile file

    ) {

        LearningResource resource =
                learningResourceService.replaceFile(

                        id,

                        title,

                        description,

                        resourceType,

                        file

                );

        return ResponseEntity.ok(resource);

    }

    // ================= Update VIDEO / LINK =================

    @PutMapping("/{id}")
    public LearningResource updateResource(

            @PathVariable Long id,

            @RequestBody LearningResource resource

    ) {

        return learningResourceService.updateResource(
                id,
                resource
        );

    }

    // ================= Get All =================

    @GetMapping
    public List<LearningResourceResponse> getAllResources() {

        return learningResourceService.getAllResources();

    }

    // ================= Get By ID =================

    @GetMapping("/{id}")
    public LearningResource getResourceById(
            @PathVariable Long id
    ) {

        return learningResourceService.getResourceById(id);

    }

    // ================= Get By Topic =================

    @GetMapping("/topic/{topicId}")
    public List<LearningResource> getResourcesByTopic(
            @PathVariable Long topicId
    ) {

        return learningResourceService.getResourcesByTopic(topicId);

    }

    // ================= Delete =================

    @DeleteMapping("/{id}")
    public String deleteResource(
            @PathVariable Long id
    ) {

        learningResourceService.deleteResource(id);

        return "Learning Resource deleted successfully.";

    }

}