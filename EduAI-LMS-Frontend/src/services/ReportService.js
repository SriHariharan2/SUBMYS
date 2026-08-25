import axios from "axios";
import { getToken } from "../utils/localStorage";

const API_URL =
    "https://submys.onrender.com/api/reports";

class ReportService {

    // =====================================================
    // DASHBOARD
    // =====================================================

    getDashboardSummary() {

        return axios.get(
            `${API_URL}/dashboard`,
            {
                headers: {
                    Authorization:
                        `Bearer ${getToken()}`
                }
            }
        );
    }


    // =====================================================
    // STUDENT REPORT
    // =====================================================

    getStudentReport(studentId) {

        return axios.get(
            `${API_URL}/student/${studentId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${getToken()}`
                }
            }
        );
    }


    // =====================================================
    // TEACHER REPORT
    // =====================================================

    getTeacherReport(teacherId) {

        return axios.get(
            `${API_URL}/teacher/${teacherId}`,
            {
                headers: {
                    Authorization:
                        `Bearer ${getToken()}`
                }
            }
        );
    }
}

export default new ReportService();