package backend.repository;

import backend.entity.Notification;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface NotificationRepository extends JpaRepository<Notification, Long> {

    // All notifications for a user - newest first
    List<Notification> findByUserIdOrderByCreatedAtDesc(Long userId);

    // Unread notifications for a user - newest first
    List<Notification> findByUserIdAndIsReadFalseOrderByCreatedAtDesc(Long userId);

    // Latest 3 notifications for a user
    List<Notification> findTop3ByUserIdOrderByCreatedAtDesc(Long userId);
}