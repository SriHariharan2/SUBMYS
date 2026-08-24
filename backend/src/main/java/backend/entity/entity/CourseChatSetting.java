package backend.entity;

import jakarta.persistence.*;

@Entity
@Table(
        name = "course_chat_settings",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = "course_id"
                )
        }
)
public class CourseChatSetting {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @OneToOne(fetch = FetchType.LAZY)
    @JoinColumn(
            name = "course_id",
            nullable = false,
            unique = true
    )
    private Course course;

    @Column(
            name = "enabled",
            nullable = false
    )
    private boolean enabled = true;

    // =====================================================
    // CONSTRUCTOR
    // =====================================================

    public CourseChatSetting() {
    }

    public CourseChatSetting(
            Course course,
            boolean enabled
    ) {
        this.course = course;
        this.enabled = enabled;
    }

    // =====================================================
    // GETTERS
    // =====================================================

    public Long getId() {
        return id;
    }

    public Course getCourse() {
        return course;
    }

    public boolean isEnabled() {
        return enabled;
    }

    // =====================================================
    // SETTERS
    // =====================================================

    public void setId(Long id) {
        this.id = id;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setEnabled(boolean enabled) {
        this.enabled = enabled;
    }
}