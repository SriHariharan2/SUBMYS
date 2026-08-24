package backend.dto;

public class TeacherReportResponse {

    private long totalCourses;
    private long totalStudents;
    private long totalAssignments;
    private long totalQuizzes;
    private double averageGrade;
    private double attendancePercentage;

    public TeacherReportResponse() {
    }

    public TeacherReportResponse(
            long totalCourses,
            long totalStudents,
            long totalAssignments,
            long totalQuizzes,
            double averageGrade,
            double attendancePercentage
    ) {
        this.totalCourses = totalCourses;
        this.totalStudents = totalStudents;
        this.totalAssignments = totalAssignments;
        this.totalQuizzes = totalQuizzes;
        this.averageGrade = averageGrade;
        this.attendancePercentage = attendancePercentage;
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

    public double getAverageGrade() {
        return averageGrade;
    }

    public void setAverageGrade(double averageGrade) {
        this.averageGrade = averageGrade;
    }

    public double getAttendancePercentage() {
        return attendancePercentage;
    }

    public void setAttendancePercentage(double attendancePercentage) {
        this.attendancePercentage = attendancePercentage;
    }
}