package  backend.repository;

import  backend.entity.Event;
import  backend.entity.EventType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.time.LocalDate;
import java.util.List;

@Repository
public interface EventRepository extends JpaRepository<Event, Long> {

    // ================= COURSE =================

    List<Event> findByCourseId(Long courseId);

    // ================= CREATED BY =================

    List<Event> findByCreatedById(Long createdById);

    // ================= EVENT DATE =================

    List<Event> findByEventDate(LocalDate eventDate);

    // ================= DATE RANGE =================

    List<Event> findByEventDateBetween(
            LocalDate startDate,
            LocalDate endDate
    );

    // ================= COURSE + DATE =================

    List<Event> findByCourseIdAndEventDate(
            Long courseId,
            LocalDate eventDate
    );

    // ================= EVENT TYPE =================

    List<Event> findByEventType(EventType eventType);

}