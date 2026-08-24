package backend.controller;

import backend.entity.Notification;
import backend.service.NotificationService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notifications")
public class NotificationController {

    private final NotificationService notificationService;

    public NotificationController(NotificationService notificationService) {
        this.notificationService = notificationService;
    }

    // =========================================================
    // CREATE NOTIFICATION
    // =========================================================

    @PostMapping("/user/{userId}")
    public ResponseEntity<Notification> createNotification(
            @PathVariable Long userId,
            @RequestBody Notification notification
    ) {

        Notification createdNotification =
                notificationService.createNotification(
                        userId,
                        notification
                );

        return ResponseEntity.ok(createdNotification);
    }

    // =========================================================
    // GET ALL NOTIFICATIONS - ADMIN / TEACHER
    // =========================================================

    @GetMapping
    public ResponseEntity<List<Notification>> getAllNotifications() {

        return ResponseEntity.ok(
                notificationService.getAllNotifications()
        );
    }

    // =========================================================
    // GET NOTIFICATION BY ID
    // =========================================================

    @GetMapping("/{id}")
    public ResponseEntity<Notification> getNotificationById(
            @PathVariable Long id
    ) {

        return ResponseEntity.ok(
                notificationService.getNotificationById(id)
        );
    }

    // =========================================================
    // GET ALL NOTIFICATIONS FOR USER
    // =========================================================

    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Notification>> getNotificationsByUser(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                notificationService.getNotificationsByUser(userId)
        );
    }

    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    @GetMapping("/user/{userId}/unread")
    public ResponseEntity<List<Notification>> getUnreadNotifications(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                notificationService.getUnreadNotifications(userId)
        );
    }

    // =========================================================
    // GET LATEST 3 NOTIFICATIONS
    // =========================================================

    @GetMapping("/user/{userId}/latest")
    public ResponseEntity<List<Notification>> getLatestThreeNotifications(
            @PathVariable Long userId
    ) {

        return ResponseEntity.ok(
                notificationService.getLatestThreeNotifications(userId)
        );
    }

    // =========================================================
    // MARK AS READ
    // =========================================================

    @PutMapping("/{id}/read")
    public ResponseEntity<Notification> markAsRead(
            @PathVariable Long id
    ) {

        Notification notification =
                notificationService.markAsRead(id);

        return ResponseEntity.ok(notification);
    }

    // =========================================================
    // DELETE
    // =========================================================

    @DeleteMapping("/{id}")
    public ResponseEntity<String> deleteNotification(
            @PathVariable Long id
    ) {

        notificationService.deleteNotification(id);

        return ResponseEntity.ok(
                "Notification deleted successfully."
        );
    }
}