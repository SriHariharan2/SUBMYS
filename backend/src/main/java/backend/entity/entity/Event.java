package backend.entity;

import com.fasterxml.jackson.annotation.JsonFormat;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.time.LocalDate;
import java.time.LocalTime;

@Entity
@Table(name = "events")
@JsonIgnoreProperties({
        "hibernateLazyInitializer",
        "handler"
})
public class Event {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // =========================================================
    // TITLE
    // =========================================================

    @Column(nullable = false)
    private String title;

    // =========================================================
    // DESCRIPTION
    // =========================================================

    @Column(length = 1000)
    private String description;

    // =========================================================
    // EVENT DATE
    // =========================================================

    @JsonFormat(pattern = "yyyy-MM-dd")
    @Column(nullable = false)
    private LocalDate eventDate;

    // =========================================================
    // START TIME
    // =========================================================

    @JsonFormat(pattern = "HH:mm")
    private LocalTime startTime;

    // =========================================================
    // END TIME
    // =========================================================

    @JsonFormat(pattern = "HH:mm")
    private LocalTime endTime;

    // =========================================================
    // EVENT TYPE
    // =========================================================

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private EventType eventType;

    // =========================================================
    // COURSE
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "course_id", nullable = false)
    @JsonIgnoreProperties({
            "hibernateLazyInitializer",
            "handler"
    })
    private Course course;

    // =========================================================
    // CREATED BY
    // =========================================================

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "created_by", nullable = false)
    @JsonIgnoreProperties({
            "password",
            "hibernateLazyInitializer",
            "handler"
    })
    private User createdBy;

    // =========================================================
    // DEFAULT CONSTRUCTOR
    // =========================================================

    public Event() {
    }

    // =========================================================
    // FULL CONSTRUCTOR
    // =========================================================

    public Event(
            Long id,
            String title,
            String description,
            LocalDate eventDate,
            LocalTime startTime,
            LocalTime endTime,
            EventType eventType,
            Course course,
            User createdBy
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.eventDate = eventDate;
        this.startTime = startTime;
        this.endTime = endTime;
        this.eventType = eventType;
        this.course = course;
        this.createdBy = createdBy;
    }

    // =========================================================
    // GETTERS
    // =========================================================

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public LocalDate getEventDate() {
        return eventDate;
    }

    public LocalTime getStartTime() {
        return startTime;
    }

    public LocalTime getEndTime() {
        return endTime;
    }

    public EventType getEventType() {
        return eventType;
    }

    public Course getCourse() {
        return course;
    }

    public User getCreatedBy() {
        return createdBy;
    }

    // =========================================================
    // SETTERS
    // =========================================================

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setEventDate(LocalDate eventDate) {
        this.eventDate = eventDate;
    }

    public void setStartTime(LocalTime startTime) {
        this.startTime = startTime;
    }

    public void setEndTime(LocalTime endTime) {
        this.endTime = endTime;
    }

    public void setEventType(EventType eventType) {
        this.eventType = eventType;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setCreatedBy(User createdBy) {
        this.createdBy = createdBy;
    }
}