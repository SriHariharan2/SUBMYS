package backend.service;

import backend.dto.TeacherReportResponse;
import backend.entity.Assignment;
import backend.entity.Attendance;
import backend.entity.AttendanceStatus;
import backend.entity.Course;
import backend.entity.Enrollment;
import backend.entity.Grade;
import backend.entity.Quiz;

import backend.repository.AssignmentRepository;
import backend.repository.AttendanceRepository;
import backend.repository.CourseRepository;
import backend.repository.EnrollmentRepository;
import backend.repository.GradeRepository;
import backend.repository.QuizRepository;

import org.springframework.stereotype.Service;

import java.util.ArrayList;
import java.util.LinkedHashMap;
import java.util.List;
import java.util.Map;
import java.util.Objects;

@Service
public class ReportService {

    private final CourseRepository courseRepository;
    private final EnrollmentRepository enrollmentRepository;
    private final AssignmentRepository assignmentRepository;
    private final QuizRepository quizRepository;
    private final GradeRepository gradeRepository;
    private final AttendanceRepository attendanceRepository;

    public ReportService(
            CourseRepository courseRepository,
            EnrollmentRepository enrollmentRepository,
            AssignmentRepository assignmentRepository,
            QuizRepository quizRepository,
            GradeRepository gradeRepository,
            AttendanceRepository attendanceRepository
    ) {
        this.courseRepository = courseRepository;
        this.enrollmentRepository = enrollmentRepository;
        this.assignmentRepository = assignmentRepository;
        this.quizRepository = quizRepository;
        this.gradeRepository = gradeRepository;
        this.attendanceRepository = attendanceRepository;
    }

    // =====================================================
    // TEACHER REPORT
    // =====================================================

    public TeacherReportResponse getTeacherReport(Long teacherId) {

        // =====================================================
        // COURSES
        // =====================================================

        List<Course> teacherCourses =
                courseRepository.findAll()
                        .stream()
                        .filter(course ->
                                course.getInstructor() != null
                                        && course.getInstructor().getId() != null
                                        && course.getInstructor()
                                                .getId()
                                                .equals(teacherId)
                        )
                        .toList();

        List<Long> courseIds =
                teacherCourses.stream()
                        .map(Course::getId)
                        .filter(Objects::nonNull)
                        .toList();

        // =====================================================
        // STUDENTS
        // =====================================================

        long totalStudents =
                enrollmentRepository.findAll()
                        .stream()
                        .filter(enrollment ->
                                enrollment.getCourse() != null
                                        && enrollment.getCourse().getId() != null
                                        && courseIds.contains(
                                                enrollment.getCourse().getId()
                                        )
                        )
                        .map(enrollment ->
                                enrollment.getStudent() != null
                                        ? enrollment.getStudent().getId()
                                        : null
                        )
                        .filter(Objects::nonNull)
                        .distinct()
                        .count();

        // =====================================================
        // ASSIGNMENTS
        // =====================================================

        long totalAssignments =
                assignmentRepository.findAll()
                        .stream()
                        .filter(assignment ->
                                assignment.getTopic() != null
                                        && assignment.getTopic().getSubject() != null
                                        && assignment.getTopic()
                                                .getSubject()
                                                .getCourse() != null
                                        && assignment.getTopic()
                                                .getSubject()
                                                .getCourse()
                                                .getId() != null
                                        && courseIds.contains(
                                                assignment.getTopic()
                                                        .getSubject()
                                                        .getCourse()
                                                        .getId()
                                        )
                        )
                        .count();

        // =====================================================
        // QUIZZES
        // =====================================================

        long totalQuizzes =
                quizRepository.findAll()
                        .stream()
                        .filter(quiz ->
                                quiz.getTopic() != null
                                        && quiz.getTopic().getSubject() != null
                                        && quiz.getTopic()
                                                .getSubject()
                                                .getCourse() != null
                                        && quiz.getTopic()
                                                .getSubject()
                                                .getCourse()
                                                .getId() != null
                                        && courseIds.contains(
                                                quiz.getTopic()
                                                        .getSubject()
                                                        .getCourse()
                                                        .getId()
                                        )
                        )
                        .count();

        // =====================================================
        // GRADES
        // =====================================================

        List<Grade> grades =
                gradeRepository.findAll()
                        .stream()
                        .filter(grade ->
                                grade.getStudent() != null
                                        && grade.getStudent().getId() != null
                                        && isStudentInCourses(
                                                grade.getStudent().getId(),
                                                courseIds
                                        )
                        )
                        .toList();

        double averageGrade =
                grades.stream()
                        .filter(grade ->
                                grade.getScore() != null
                                        && grade.getMaxScore() != null
                                        && grade.getMaxScore() > 0
                        )
                        .mapToDouble(grade ->
                                grade.getScore() * 100.0
                                        / grade.getMaxScore()
                        )
                        .average()
                        .orElse(0.0);

        // =====================================================
        // ATTENDANCE
        // =====================================================

        List<Attendance> attendance =
                attendanceRepository.findAll()
                        .stream()
                        .filter(record ->
                                record.getCourse() != null
                                        && record.getCourse().getId() != null
                                        && courseIds.contains(
                                                record.getCourse().getId()
                                        )
                        )
                        .toList();

        double attendancePercentage =
                calculateAttendancePercentage(attendance);

        return new TeacherReportResponse(
                teacherCourses.size(),
                totalStudents,
                totalAssignments,
                totalQuizzes,
                averageGrade,
                attendancePercentage
        );
    }


    // =====================================================
    // STUDENT REPORT
    // =====================================================

    public Map<String, Object> getStudentReport(
            Long studentId
    ) {

        Map<String, Object> report =
                new LinkedHashMap<>();

        // =====================================================
        // ENROLLMENTS
        // =====================================================

        List<Enrollment> enrollments =
                enrollmentRepository.findAll()
                        .stream()
                        .filter(enrollment ->
                                enrollment.getStudent() != null
                                        && enrollment.getStudent().getId() != null
                                        && enrollment.getStudent()
                                                .getId()
                                                .equals(studentId)
                        )
                        .toList();

        // =====================================================
        // STUDENT INFORMATION
        // =====================================================

        Map<String, Object> student =
                new LinkedHashMap<>();

        student.put(
                "id",
                studentId
        );

        if (!enrollments.isEmpty()
                && enrollments.get(0).getStudent() != null) {

            student.put(
                    "name",
                    enrollments.get(0)
                            .getStudent()
                            .getFullName()
            );
        }

        report.put(
                "student",
                student
        );

        // =====================================================
        // COURSES
        // =====================================================

        List<Map<String, Object>> courses =
                new ArrayList<>();

        for (Enrollment enrollment : enrollments) {

            Course course =
                    enrollment.getCourse();

            if (course == null) {
                continue;
            }

            Map<String, Object> courseData =
                    new LinkedHashMap<>();

            courseData.put(
                    "id",
                    course.getId()
            );

            courseData.put(
                    "title",
                    course.getTitle()
            );

            courseData.put(
                    "courseCode",
                    course.getCourseCode()
            );

            courseData.put(
                    "description",
                    course.getDescription()
            );

            courses.add(courseData);
        }

        report.put(
                "courses",
                courses
        );

        // =====================================================
        // COMPLETED COURSES
        // =====================================================

        long completedCourses =
                courses.size();

        report.put(
                "completedCourses",
                completedCourses
        );

        report.put(
                "totalCourses",
                courses.size()
        );

        // =====================================================
        // COURSE IDS
        // =====================================================

        List<Long> courseIds =
                enrollments.stream()
                        .filter(enrollment ->
                                enrollment.getCourse() != null
                                        && enrollment.getCourse().getId() != null
                        )
                        .map(enrollment ->
                                enrollment.getCourse().getId()
                        )
                        .toList();

        // =====================================================
        // STUDENT GRADES
        // =====================================================

        List<Grade> studentGrades =
                gradeRepository.findAll()
                        .stream()
                        .filter(grade ->
                                grade.getStudent() != null
                                        && grade.getStudent().getId() != null
                                        && grade.getStudent()
                                                .getId()
                                                .equals(studentId)
                        )
                        .toList();

        // =====================================================
        // AVERAGE SCORE
        // =====================================================

        double averageScore =
                studentGrades.stream()
                        .filter(grade ->
                                grade.getScore() != null
                                        && grade.getMaxScore() != null
                                        && grade.getMaxScore() > 0
                        )
                        .mapToDouble(grade ->
                                grade.getScore() * 100.0
                                        / grade.getMaxScore()
                        )
                        .average()
                        .orElse(0.0);

        report.put(
                "averageScore",
                averageScore
        );

        // =====================================================
        // GRADES LIST
        // =====================================================

        List<Map<String, Object>> gradeList =
                new ArrayList<>();

        for (Grade grade : studentGrades) {

            Map<String, Object> gradeData =
                    new LinkedHashMap<>();

            // =================================================
            // BASIC GRADE INFORMATION
            // =================================================

            gradeData.put(
                    "id",
                    grade.getId()
            );

            gradeData.put(
                    "score",
                    grade.getScore()
            );

            gradeData.put(
                    "maxScore",
                    grade.getMaxScore()
            );

            gradeData.put(
                    "remarks",
                    grade.getRemarks()
            );

            // =================================================
            // PERCENTAGE
            // =================================================

            double percentage = 0.0;

            if (grade.getScore() != null
                    && grade.getMaxScore() != null
                    && grade.getMaxScore() > 0) {

                percentage =
                        grade.getScore() * 100.0
                                / grade.getMaxScore();
            }

            gradeData.put(
                    "percentage",
                    percentage
            );

            // =================================================
            // ASSIGNMENT INFORMATION
            // =================================================

            Assignment assignment =
                    grade.getAssignment();

            if (assignment != null) {

                gradeData.put(
                        "assignmentId",
                        assignment.getId()
                );

                gradeData.put(
                        "assignmentTitle",
                        assignment.getTitle()
                );

                // =============================================
                // COURSE FROM ASSIGNMENT
                // =============================================

                if (assignment.getTopic() != null
                        && assignment.getTopic().getSubject() != null
                        && assignment.getTopic()
                                .getSubject()
                                .getCourse() != null) {

                    Course course =
                            assignment.getTopic()
                                    .getSubject()
                                    .getCourse();

                    gradeData.put(
                            "courseId",
                            course.getId()
                    );

                    gradeData.put(
                            "courseTitle",
                            course.getTitle()
                    );
                }

                // =============================================
                // SUBJECT
                // =============================================

                if (assignment.getTopic() != null
                        && assignment.getTopic().getSubject() != null) {

                    gradeData.put(
                            "subjectTitle",
                            assignment.getTopic()
                                    .getSubject()
                                    .getName()
                    );
                }

                // =============================================
                // TOPIC
                // =============================================

                if (assignment.getTopic() != null) {

                    gradeData.put(
                            "topicTitle",
                            assignment.getTopic()
                                    .getTitle()
                    );
                }
            }

            // =================================================
            // QUIZ INFORMATION
            // =================================================

            Quiz quiz =
                    grade.getQuiz();

            if (quiz != null) {

                gradeData.put(
                        "quizId",
                        quiz.getId()
                );

                gradeData.put(
                        "quizTitle",
                        quiz.getTitle()
                );

                // =============================================
                // COURSE FROM QUIZ
                // =============================================

                if (quiz.getTopic() != null
                        && quiz.getTopic().getSubject() != null
                        && quiz.getTopic()
                                .getSubject()
                                .getCourse() != null) {

                    Course course =
                            quiz.getTopic()
                                    .getSubject()
                                    .getCourse();

                    gradeData.put(
                            "courseId",
                            course.getId()
                    );

                    gradeData.put(
                            "courseTitle",
                            course.getTitle()
                    );
                }

                // =============================================
                // SUBJECT
                // =============================================

                if (quiz.getTopic() != null
                        && quiz.getTopic().getSubject() != null) {

                    gradeData.put(
                            "subjectTitle",
                            quiz.getTopic()
                                    .getSubject()
                                    .getName()
                    );
                }

                // =============================================
                // TOPIC
                // =============================================

                if (quiz.getTopic() != null) {

                    gradeData.put(
                            "topicTitle",
                            quiz.getTopic()
                                    .getTitle()
                    );
                }
            }

            // =================================================
            // ADD TO LIST
            // =================================================

            gradeList.add(
                    gradeData
            );
        }

        report.put(
                "grades",
                gradeList
        );

        // =====================================================
        // ATTENDANCE
        // =====================================================

        List<Attendance> studentAttendance =
                attendanceRepository.findAll()
                        .stream()
                        .filter(record ->
                                record.getStudent() != null
                                        && record.getStudent().getId() != null
                                        && record.getStudent()
                                                .getId()
                                                .equals(studentId)
                        )
                        .toList();

        double attendancePercentage =
                calculateAttendancePercentage(
                        studentAttendance
                );

        report.put(
                "attendancePercentage",
                attendancePercentage
        );

        // =====================================================
        // ATTENDANCE LIST
        // =====================================================

        List<Map<String, Object>> attendanceList =
                new ArrayList<>();

        for (Attendance record :
                studentAttendance) {

            Map<String, Object> attendanceData =
                    new LinkedHashMap<>();

            attendanceData.put(
                    "id",
                    record.getId()
            );

            attendanceData.put(
                    "status",
                    record.getStatus()
            );

            attendanceData.put(
                    "date",
                    record.getAttendanceDate()
            );

            attendanceData.put(
                    "remarks",
                    record.getRemarks()
            );

            if (record.getCourse() != null) {

                attendanceData.put(
                        "courseId",
                        record.getCourse().getId()
                );

                attendanceData.put(
                        "courseTitle",
                        record.getCourse().getTitle()
                );
            }

            attendanceList.add(
                    attendanceData
            );
        }

        report.put(
                "attendance",
                attendanceList
        );

        // =====================================================
        // COURSE PROGRESS
        // =====================================================

        List<Map<String, Object>> courseProgress =
                new ArrayList<>();

        for (Enrollment enrollment :
                enrollments) {

            if (enrollment.getCourse() == null) {
                continue;
            }

            Map<String, Object> progress =
                    new LinkedHashMap<>();

            progress.put(
                    "courseId",
                    enrollment.getCourse().getId()
            );

            progress.put(
                    "courseTitle",
                    enrollment.getCourse().getTitle()
            );

            progress.put(
                    "progress",
                    0
            );

            courseProgress.add(
                    progress
            );
        }

        report.put(
                "courseProgress",
                courseProgress
        );

        // =====================================================
        // ADDITIONAL SUMMARY
        // =====================================================

        report.put(
                "studentId",
                studentId
        );

        report.put(
                "totalGrades",
                studentGrades.size()
        );

        report.put(
                "totalAttendanceRecords",
                studentAttendance.size()
        );

        long presentCount =
                studentAttendance.stream()
                        .filter(record ->
                                record.getStatus()
                                        == AttendanceStatus.PRESENT
                        )
                        .count();

        long absentCount =
                studentAttendance.stream()
                        .filter(record ->
                                record.getStatus()
                                        == AttendanceStatus.ABSENT
                        )
                        .count();

        long lateCount =
                studentAttendance.stream()
                        .filter(record ->
                                record.getStatus()
                                        == AttendanceStatus.LATE
                        )
                        .count();

        long excusedCount =
                studentAttendance.stream()
                        .filter(record ->
                                record.getStatus()
                                        == AttendanceStatus.EXCUSED
                        )
                        .count();

        report.put(
                "presentCount",
                presentCount
        );

        report.put(
                "absentCount",
                absentCount
        );

        report.put(
                "lateCount",
                lateCount
        );

        report.put(
                "excusedCount",
                excusedCount
        );

        return report;
    }


    // =====================================================
    // DASHBOARD SUMMARY
    // =====================================================

    public Map<String, Object> getDashboardSummary() {

        Map<String, Object> summary =
                new LinkedHashMap<>();

        long totalCourses =
                courseRepository.count();

        long totalStudents =
                enrollmentRepository.findAll()
                        .stream()
                        .filter(enrollment ->
                                enrollment.getStudent() != null
                                        && enrollment.getStudent().getId() != null
                        )
                        .map(enrollment ->
                                enrollment.getStudent().getId()
                        )
                        .distinct()
                        .count();

        long totalAssignments =
                assignmentRepository.count();

        long totalQuizzes =
                quizRepository.count();

        List<Grade> grades =
                gradeRepository.findAll();

        double averageGrade =
                grades.stream()
                        .filter(grade ->
                                grade.getScore() != null
                                        && grade.getMaxScore() != null
                                        && grade.getMaxScore() > 0
                        )
                        .mapToDouble(grade ->
                                grade.getScore() * 100.0
                                        / grade.getMaxScore()
                        )
                        .average()
                        .orElse(0.0);

        List<Attendance> attendance =
                attendanceRepository.findAll();

        double attendancePercentage =
                calculateAttendancePercentage(
                        attendance
                );

        summary.put(
                "totalCourses",
                totalCourses
        );

        summary.put(
                "totalStudents",
                totalStudents
        );

        summary.put(
                "totalAssignments",
                totalAssignments
        );

        summary.put(
                "totalQuizzes",
                totalQuizzes
        );

        summary.put(
                "averageGrade",
                averageGrade
        );

        summary.put(
                "attendancePercentage",
                attendancePercentage
        );

        return summary;
    }


    // =====================================================
    // ATTENDANCE CALCULATION
    // =====================================================

    private double calculateAttendancePercentage(
            List<Attendance> attendance
    ) {

        if (attendance == null
                || attendance.isEmpty()) {

            return 0.0;
        }

        long present =
                attendance.stream()
                        .filter(record ->
                                record.getStatus()
                                        == AttendanceStatus.PRESENT
                        )
                        .count();

        return present * 100.0
                / attendance.size();
    }


    // =====================================================
    // CHECK STUDENT COURSE
    // =====================================================

    private boolean isStudentInCourses(
            Long studentId,
            List<Long> courseIds
    ) {

        return enrollmentRepository.findAll()
                .stream()
                .anyMatch(enrollment ->
                        enrollment.getStudent() != null
                                && enrollment.getStudent().getId() != null
                                && enrollment.getStudent()
                                        .getId()
                                        .equals(studentId)
                                && enrollment.getCourse() != null
                                && enrollment.getCourse().getId() != null
                                && courseIds.contains(
                                        enrollment.getCourse().getId()
                                )
                );
    }
}