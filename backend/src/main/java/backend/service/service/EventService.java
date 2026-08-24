package backend.service;

import backend.entity.Course;
import backend.entity.Event;
import backend.entity.EventType;
import backend.entity.User;
import backend.repository.CourseRepository;
import backend.repository.EventRepository;
import backend.repository.UserRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
import java.time.LocalTime;
import java.util.List;

@Service
public class EventService {

    @Autowired
    private EventRepository eventRepository;

    @Autowired
    private CourseRepository courseRepository;

    @Autowired
    private UserRepository userRepository;

    // =========================================================
    // CREATE EVENT
    // =========================================================

    public Event createEvent(
            Long courseId,
            Long createdById,
            Event event
    ) {

        if (event == null) {
            throw new RuntimeException("Event data is required");
        }

        if (event.getTitle() == null ||
                event.getTitle().trim().isEmpty()) {

            throw new RuntimeException("Event title is required");
        }

        if (event.getEventDate() == null) {
            throw new RuntimeException("Event date is required");
        }

        if (event.getEventType() == null) {
            throw new RuntimeException("Event type is required");
        }

        if (event.getStartTime() != null &&
                event.getEndTime() != null &&
                !event.getEndTime().isAfter(event.getStartTime())) {

            throw new RuntimeException(
                    "End time must be after start time"
            );
        }

        Course course = courseRepository
                .findById(courseId)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Course not found: " + courseId
                        )
                );

        User createdBy = userRepository
                .findById(createdById)
                .orElseThrow(() ->
                        new RuntimeException(
                                "User not found: " + createdById
                        )
                );

        event.setCourse(course);
        event.setCreatedBy(createdBy);

        return eventRepository.save(event);
    }

    // =========================================================
    // UPDATE EVENT
    // =========================================================

    public Event updateEvent(
            Long id,
            Event updatedEvent
    ) {

        Event event = eventRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Event not found: " + id
                        )
                );

        event.setTitle(updatedEvent.getTitle());
        event.setDescription(updatedEvent.getDescription());
        event.setEventDate(updatedEvent.getEventDate());
        event.setStartTime(updatedEvent.getStartTime());
        event.setEndTime(updatedEvent.getEndTime());
        event.setEventType(updatedEvent.getEventType());

        return eventRepository.save(event);
    }

    // =========================================================
    // DELETE EVENT
    // =========================================================

    public void deleteEvent(Long id) {

        Event event = eventRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Event not found: " + id
                        )
                );

        eventRepository.delete(event);
    }

    // =========================================================
    // GET ALL EVENTS
    // =========================================================

    public List<Event> getAllEvents() {

        return eventRepository.findAll();
    }

    // =========================================================
    // GET EVENT BY ID
    // =========================================================

    public Event getEventById(Long id) {

        return eventRepository
                .findById(id)
                .orElseThrow(() ->
                        new RuntimeException(
                                "Event not found: " + id
                        )
                );
    }

    // =========================================================
    // GET EVENTS BY COURSE
    // =========================================================

    public List<Event> getEventsByCourse(Long courseId) {

        return eventRepository.findByCourseId(courseId);
    }

    // =========================================================
    // GET EVENTS BY CREATOR
    // =========================================================

    public List<Event> getEventsByCreator(Long createdById) {

        return eventRepository.findByCreatedById(createdById);
    }

    // =========================================================
    // GET EVENTS BY DATE
    // =========================================================

    public List<Event> getEventsByDate(LocalDate date) {

        return eventRepository.findByEventDate(date);
    }

    // =========================================================
    // GET EVENTS BY DATE RANGE
    // =========================================================

    public List<Event> getEventsByDateRange(
            LocalDate startDate,
            LocalDate endDate
    ) {

        return eventRepository.findByEventDateBetween(
                startDate,
                endDate
        );
    }

    // =========================================================
    // GET EVENTS BY TYPE
    // =========================================================

    public List<Event> getEventsByType(
            EventType eventType
    ) {

        return eventRepository.findByEventType(eventType);
    }
}