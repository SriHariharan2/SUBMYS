package backend.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import jakarta.persistence.*;

import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "courses")
public class Course {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false)
    private String title;

    @Column(length = 2000)
    private String description;

    @Column(unique = true)
    private String courseCode;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "instructor_id")
    @JsonIgnoreProperties({
            "password",
            "hibernateLazyInitializer",
            "handler"
    })
    private User instructor;

    // =====================================================
    // DISCUSSION CHAT ENABLE / DISABLE
    // =====================================================

    @Column(nullable = false)
    private boolean discussionEnabled = true;

    @OneToMany(
            mappedBy = "course",
            cascade = CascadeType.ALL,
            orphanRemoval = true
    )
    @JsonIgnore
    private List<Subject> subjects = new ArrayList<>();

    // =====================================================
    // CONSTRUCTORS
    // =====================================================

    public Course() {
    }

    public Course(
            Long id,
            String title,
            String description,
            String courseCode,
            User instructor
    ) {
        this.id = id;
        this.title = title;
        this.description = description;
        this.courseCode = courseCode;
        this.instructor = instructor;
        this.discussionEnabled = true;
    }

    // =====================================================
    // GETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public String getTitle() {
        return title;
    }

    public String getDescription() {
        return description;
    }

    public String getCourseCode() {
        return courseCode;
    }

    public User getInstructor() {
        return instructor;
    }

    public List<Subject> getSubjects() {
        return subjects;
    }

    public boolean isDiscussionEnabled() {
        return discussionEnabled;
    }

    // =====================================================
    // SETTERS
    // =====================================================

    public void setId(Long id) {
        this.id = id;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public void setCourseCode(String courseCode) {
        this.courseCode = courseCode;
    }

    public void setInstructor(User instructor) {
        this.instructor = instructor;
    }

    public void setSubjects(List<Subject> subjects) {
        this.subjects = subjects;
    }

    public void setDiscussionEnabled(
            boolean discussionEnabled
    ) {
        this.discussionEnabled = discussionEnabled;
    }
}