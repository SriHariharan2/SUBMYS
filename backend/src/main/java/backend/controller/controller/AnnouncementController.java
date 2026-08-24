package backend.controller;

import backend.dto.AnnouncementRequest;
import backend.dto.AnnouncementResponse;
import backend.service.AnnouncementService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/announcements")
@CrossOrigin
public class AnnouncementController {

    private final AnnouncementService announcementService;


    public AnnouncementController(
            AnnouncementService announcementService
    ) {

        this.announcementService = announcementService;
    }


    // =========================================================
    // CREATE ANNOUNCEMENT
    // =========================================================

    @PostMapping("/course/{courseId}")
    public ResponseEntity<AnnouncementResponse> createAnnouncement(

            @PathVariable Long courseId,

            @RequestBody AnnouncementRequest request

    ) {

        AnnouncementResponse response =
                announcementService.createAnnouncement(
                        courseId,
                        request
                );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // UPDATE ANNOUNCEMENT
    // =========================================================

    @PutMapping("/{id}")
    public ResponseEntity<AnnouncementResponse> updateAnnouncement(

            @PathVariable Long id,

            @RequestBody AnnouncementRequest request

    ) {

        AnnouncementResponse response =
                announcementService.updateAnnouncement(
                        id,
                        request
                );

        return ResponseEntity.ok(response);
    }


    // =========================================================
    // GET ALL ANNOUNCEMENTS
    // =========================================================

    @GetMapping
    public ResponseEntity<List<AnnouncementResponse>> getAllAnnouncements() {

        return ResponseEntity.ok(
                announcementService.getAllAnnouncements()
        );
    }


    // =========================================================
    // GET ANNOUNCEMENT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<AnnouncementResponse> getAnnouncementById(

            @PathVariable Long id

    ) {

        return ResponseEntity.ok(
                announcementService.getAnnouncementById(id)
        );
    }


    // =========================================================
    // GET ANNOUNCEMENTS BY COURSE
    // =========================================================

    @GetMapping("/course/{courseId}")
    public ResponseEntity<List<AnnouncementResponse>> getAnnouncementsByCourse(

            @PathVariable Long courseId

    ) {

        return ResponseEntity.ok(
                announcementService.getAnnouncementsByCourse(courseId)
        );
    }


    // =========================================================
    // DELETE ANNOUNCEMENT
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteAnnouncement(

            @PathVariable Long id

    ) {

        announcementService.deleteAnnouncement(id);

        return ResponseEntity.ok(
                "Announcement deleted successfully."
        );
    }
}