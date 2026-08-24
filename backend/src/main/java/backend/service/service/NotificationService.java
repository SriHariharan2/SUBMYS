package backend.service;

import backend.entity.Notification;
import backend.entity.User;
import backend.repository.NotificationRepository;
import backend.repository.UserRepository;

import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class NotificationService {

    private final NotificationRepository notificationRepository;
    private final UserRepository userRepository;

    public NotificationService(
            NotificationRepository notificationRepository,
            UserRepository userRepository
    ) {
        this.notificationRepository = notificationRepository;
        this.userRepository = userRepository;
    }

    // =========================================================
    // CREATE NOTIFICATION
    // =========================================================

    public Notification createNotification(
            Long userId,
            Notification notification
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new RuntimeException("User not found.")
                );

        notification.setUser(user);

        return notificationRepository.save(notification);
    }

    // =========================================================
    // GET ALL NOTIFICATIONS
    // =========================================================

    public List<Notification> getAllNotifications() {

        return notificationRepository.findAll();
    }

    // =========================================================
    // GET NOTIFICATION BY ID
    // =========================================================

    public Notification getNotificationById(Long id) {

        return notificationRepository.findById(id)
                .orElseThrow(() ->
                        new RuntimeException("Notification not found.")
                );
    }

    // =========================================================
    // GET ALL NOTIFICATIONS FOR USER
    // =========================================================

    public List<Notification> getNotificationsByUser(Long userId) {

        return notificationRepository
                .findByUserIdOrderByCreatedAtDesc(userId);
    }

    // =========================================================
    // GET UNREAD NOTIFICATIONS
    // =========================================================

    public List<Notification> getUnreadNotifications(Long userId) {

        return notificationRepository
                .findByUserIdAndIsReadFalseOrderByCreatedAtDesc(userId);
    }

    // =========================================================
    // GET LATEST 3 NOTIFICATIONS
    // =========================================================

    public List<Notification> getLatestThreeNotifications(Long userId) {

        return notificationRepository
                .findTop3ByUserIdOrderByCreatedAtDesc(userId);
    }

    // =========================================================
    // MARK AS READ
    // =========================================================

    public Notification markAsRead(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found.")
                        );

        notification.setRead(true);

        return notificationRepository.save(notification);
    }

    // =========================================================
    // DELETE
    // =========================================================

    public void deleteNotification(Long id) {

        Notification notification =
                notificationRepository.findById(id)
                        .orElseThrow(() ->
                                new RuntimeException("Notification not found.")
                        );

        notificationRepository.delete(notification);
    }
}