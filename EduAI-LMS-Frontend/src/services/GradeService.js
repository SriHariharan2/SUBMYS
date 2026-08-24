import api from "../api/axiosConfig";

class GradeService {

    // ================= GET ALL =================

    getAllGrades() {
        return api.get("/grades");
    }

    // ================= GET BY ID =================

    getGrade(id) {
        return api.get(`/grades/${id}`);
    }

    // ================= ADD GRADE =================

    addGrade(studentId, assignmentId, quizId, grade) {

        let url = `/grades/student/${studentId}?`;

        if (assignmentId) {
            url += `assignmentId=${assignmentId}`;
        }

        if (quizId) {

            if (assignmentId) {
                url += "&";
            }

            url += `quizId=${quizId}`;
        }

        return api.post(url, grade);
    }

    // ================= UPDATE =================

    updateGrade(id, grade) {
        return api.put(`/grades/${id}`, grade);
    }

    // ================= DELETE =================

    deleteGrade(id) {
        return api.delete(`/grades/${id}`);
    }

    // ================= GET STUDENT GRADES =================

    getStudentGrades(studentId) {
        return api.get(`/grades/student/${studentId}`);
    }

    // ================= GET ASSIGNMENT GRADES =================

    getAssignmentGrades(assignmentId) {
        return api.get(`/grades/assignment/${assignmentId}`);
    }

    // ================= GET QUIZ GRADES =================

    getQuizGrades(quizId) {
        return api.get(`/grades/quiz/${quizId}`);
    }

    // ================= PERCENTAGE =================

    calculatePercentage(id) {
        return api.get(`/grades/percentage/${id}`);
    }

}

export default new GradeService();