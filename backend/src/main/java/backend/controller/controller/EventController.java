package backend.controller;

import backend.entity.Event;
import backend.entity.EventType;
import backend.service.EventService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/events")
@CrossOrigin(origins = "http://localhost:5173")
public class EventController {

    @Autowired
    private EventService eventService;

    // =========================================================
    // CREATE EVENT
    // =========================================================

    @PostMapping("/course/{courseId}/creator/{createdById}")
    public Event createEvent(
            @PathVariable Long courseId,
            @PathVariable Long createdById,
            @RequestBody Event event
    ) {

        return eventService.createEvent(
                courseId,
                createdById,
                event
        );
    }

    // =========================================================
    // UPDATE EVENT
    // =========================================================

    @PutMapping("/{id}")
    public Event updateEvent(
            @PathVariable Long id,
            @RequestBody Event event
    ) {

        return eventService.updateEvent(
                id,
                event
        );
    }

    // =========================================================
    // DELETE EVENT
    // =========================================================

    @DeleteMapping("/{id}")
    public void deleteEvent(
            @PathVariable Long id
    ) {

        eventService.deleteEvent(id);
    }

    // =========================================================
    // GET ALL EVENTS
    // =========================================================

    @GetMapping
    public List<Event> getAllEvents() {

        return eventService.getAllEvents();
    }

    // =========================================================
    // GET EVENT BY ID
    // =========================================================

    @GetMapping("/{id}")
    public Event getEventById(
            @PathVariable Long id
    ) {

        return eventService.getEventById(id);
    }

    // =========================================================
    // GET EVENTS BY COURSE
    // =========================================================

    @GetMapping("/course/{courseId}")
    public List<Event> getEventsByCourse(
            @PathVariable Long courseId
    ) {

        return eventService.getEventsByCourse(courseId);
    }

    // =========================================================
    // GET EVENTS BY CREATOR
    // =========================================================

    @GetMapping("/creator/{createdById}")
    public List<Event> getEventsByCreator(
            @PathVariable Long createdById
    ) {

        return eventService.getEventsByCreator(createdById);
    }

    // =========================================================
    // GET EVENTS BY DATE
    // =========================================================

    @GetMapping("/date/{date}")
    public List<Event> getEventsByDate(
            @PathVariable
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate date
    ) {

        return eventService.getEventsByDate(date);
    }

    // =========================================================
    // GET EVENTS BY DATE RANGE
    // =========================================================

    @GetMapping("/range")
    public List<Event> getEventsByDateRange(
            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate startDate,

            @RequestParam
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE)
            LocalDate endDate
    ) {

        return eventService.getEventsByDateRange(
                startDate,
                endDate
        );
    }

    // =========================================================
    // GET EVENTS BY TYPE
    // =========================================================

    @GetMapping("/type/{eventType}")
    public List<Event> getEventsByType(
            @PathVariable EventType eventType
    ) {

        return eventService.getEventsByType(eventType);
    }
}