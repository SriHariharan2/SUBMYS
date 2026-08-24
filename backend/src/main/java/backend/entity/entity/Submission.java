package backend.entity;

import jakarta.persistence.*;

import java.time.LocalDateTime;

@Entity
@Table(name = "submissions")
public class Submission {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // Student who submitted
    @ManyToOne
    @JoinColumn(name = "student_id")
    private User student;

    // Assignment being submitted
    @ManyToOne
    @JoinColumn(name = "assignment_id")
    private Assignment assignment;

    // Student answer (text)
    @Column(length = 10000)
    private String answer;

    // File URL (Cloudinary later)
    private String fileUrl;

    // Teacher feedback
    @Column(length = 5000)
    private String feedback;

    // Marks obtained
    private Integer marks;

    // Submission time
    private LocalDateTime submittedAt;

    public Submission() {
    }

    public Submission(Long id,
                      User student,
                      Assignment assignment,
                      String answer,
                      String fileUrl,
                      String feedback,
                      Integer marks,
                      LocalDateTime submittedAt) {
        this.id = id;
        this.student = student;
        this.assignment = assignment;
        this.answer = answer;
        this.fileUrl = fileUrl;
        this.feedback = feedback;
        this.marks = marks;
        this.submittedAt = submittedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getStudent() {
        return student;
    }

    public void setStudent(User student) {
        this.student = student;
    }

    public Assignment getAssignment() {
        return assignment;
    }

    public void setAssignment(Assignment assignment) {
        this.assignment = assignment;
    }

    public String getAnswer() {
        return answer;
    }

    public void setAnswer(String answer) {
        this.answer = answer;
    }

    public String getFileUrl() {
        return fileUrl;
    }

    public void setFileUrl(String fileUrl) {
        this.fileUrl = fileUrl;
    }

    public String getFeedback() {
        return feedback;
    }

    public void setFeedback(String feedback) {
        this.feedback = feedback;
    }

    public Integer getMarks() {
        return marks;
    }

    public void setMarks(Integer marks) {
        this.marks = marks;
    }

    public LocalDateTime getSubmittedAt() {
        return submittedAt;
    }

    public void setSubmittedAt(LocalDateTime submittedAt) {
        this.submittedAt = submittedAt;
    }
}