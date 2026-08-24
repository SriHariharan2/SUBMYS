package backend.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "course_progress")
public class CourseProgress {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    @ManyToOne
    @JoinColumn(name = "course_id")
    private Course course;

    private Double progressPercentage;

    private Integer completedTopics;

    private Integer totalTopics;

    private boolean completed;

    public CourseProgress() {
    }

    public Long getId() {
        return id;
    }

    public User getStudent() {
        return student;
    }

    public Course getCourse() {
        return course;
    }

    public Double getProgressPercentage() {
        return progressPercentage;
    }

    public Integer getCompletedTopics() {
        return completedTopics;
    }

    public Integer getTotalTopics() {
        return totalTopics;
    }

    public boolean isCompleted() {
        return completed;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public void setCourse(Course course) {
        this.course = course;
    }

    public void setProgressPercentage(Double progressPercentage) {
        this.progressPercentage = progressPercentage;
        this.completed = progressPercentage != null && progressPercentage >= 100.0;
    }

    public void setCompletedTopics(Integer completedTopics) {
        this.completedTopics = completedTopics;
    }

    public void setTotalTopics(Integer totalTopics) {
        this.totalTopics = totalTopics;
    }

    public void setCompleted(boolean completed) {
        this.completed = completed;
    }
}