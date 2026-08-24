package backend.dto;

import backend.entity.Role;

public class UserProfileResponse {

    private Long id;
    private String fullName;
    private String email;
    private Role role;

    private long totalCourses;
    private long totalStudents;
    private long totalAssignments;
    private long totalQuizzes;

    public UserProfileResponse() {
    }

    public UserProfileResponse(
            Long id,
            String fullName,
            String email,
            Role role,
            long totalCourses,
            long totalStudents,
            long totalAssignments,
            long totalQuizzes
    ) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.role = role;

        this.totalCourses = totalCourses;
        this.totalStudents = totalStudents;
        this.totalAssignments = totalAssignments;
        this.totalQuizzes = totalQuizzes;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Role getRole() {
        return role;
    }

    public void setRole(Role role) {
        this.role = role;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
    }

    public long getTotalStudents() {
        return totalStudents;
    }

    public void setTotalStudents(long totalStudents) {
        this.totalStudents = totalStudents;
    }

    public long getTotalAssignments() {
        return totalAssignments;
    }

    public void setTotalAssignments(long totalAssignments) {
        this.totalAssignments = totalAssignments;
    }

    public long getTotalQuizzes() {
        return totalQuizzes;
    }

    public void setTotalQuizzes(long totalQuizzes) {
        this.totalQuizzes = totalQuizzes;
    }
}