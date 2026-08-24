import api from "../api/axiosConfig";

const AttendanceService = {

    // =====================================================
    // GET ALL ATTENDANCE
    // =====================================================

    getAllAttendance() {
        return api.get("/attendance");
    },


    // =====================================================
    // GET ATTENDANCE BY ID
    // =====================================================

    getAttendance(id) {
        return api.get(`/attendance/${id}`);
    },


    // =====================================================
    // MARK ATTENDANCE
    // =====================================================

    markAttendance(studentId, courseId, attendance) {

        console.log("MARK ATTENDANCE REQUEST");
        console.log("Student ID:", studentId);
        console.log("Course ID:", courseId);
        console.log("Payload:", attendance);

        return api.post(
            `/attendance/student/${studentId}/course/${courseId}`,
            attendance
        );
    },


    // =====================================================
    // UPDATE ATTENDANCE
    // =====================================================

    updateAttendance(id, attendance) {

        console.log("UPDATE ATTENDANCE REQUEST");
        console.log("Attendance ID:", id);
        console.log("Payload:", attendance);

        return api.put(
            `/attendance/${id}`,
            attendance
        );
    },


    // =====================================================
    // DELETE ATTENDANCE
    // =====================================================

    deleteAttendance(id) {

        return api.delete(
            `/attendance/${id}`
        );
    },


    // =====================================================
    // GET STUDENT ATTENDANCE
    // =====================================================

    getStudentAttendance(studentId) {

        return api.get(
            `/attendance/student/${studentId}`
        );
    },


    // =====================================================
    // GET COURSE ATTENDANCE
    // =====================================================

    getCourseAttendance(courseId) {

        return api.get(
            `/attendance/course/${courseId}`
        );
    },


    // =====================================================
    // GET ATTENDANCE BY DATE
    // =====================================================

    getAttendanceByDate(date) {

        return api.get(
            `/attendance/date/${date}`
        );
    },


    // =====================================================
    // GET ATTENDANCE PERCENTAGE
    // =====================================================

    calculateAttendancePercentage(
        studentId,
        courseId
    ) {

        return api.get(
            `/attendance/percentage/${studentId}/${courseId}`
        );
    }

};

export default AttendanceService;