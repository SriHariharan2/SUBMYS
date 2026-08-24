package backend.dto;

public class UserStatisticsResponse {

    private long totalCourses;
    private long totalAssignments;
    private long totalQuizzes;
    private long totalSubmissions;

    public UserStatisticsResponse() {
    }

    public UserStatisticsResponse(
            long totalCourses,
            long totalAssignments,
            long totalQuizzes,
            long totalSubmissions) {

        this.totalCourses = totalCourses;
        this.totalAssignments = totalAssignments;
        this.totalQuizzes = totalQuizzes;
        this.totalSubmissions = totalSubmissions;
    }

    public long getTotalCourses() {
        return totalCourses;
    }

    public void setTotalCourses(long totalCourses) {
        this.totalCourses = totalCourses;
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

    public long getTotalSubmissions() {
        return totalSubmissions;
    }

    public void setTotalSubmissions(long totalSubmissions) {
        this.totalSubmissions = totalSubmissions;
    }
}