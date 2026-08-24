import axiosInstance from "../api/axiosConfig";

const CertificateService = {

    // =====================================================
    // ADMIN / TEACHER
    // =====================================================

    getAllCertificates: () => {
        return axiosInstance.get("/certificates");
    },

    uploadCertificate: (studentId, courseId, file) => {

        const formData = new FormData();

        formData.append("studentId", String(studentId));
        formData.append("courseId", String(courseId));
        formData.append("file", file);

        console.log("===== CERTIFICATE UPLOAD =====");
        console.log("studentId:", studentId);
        console.log("courseId:", courseId);
        console.log("file:", file);

        return axiosInstance.post(
            "/certificates/upload",
            formData
        );
    },

    deleteCertificate: (id) => {
        return axiosInstance.delete(
            `/certificates/${id}`
        );
    },

    // =====================================================
    // STUDENT
    // =====================================================

    getStudentCertificates: (studentId) => {
        return axiosInstance.get(
            `/certificates/student/${studentId}`
        );
    },

    // =====================================================
    // COURSE
    // =====================================================

    getCourseCertificates: (courseId) => {
        return axiosInstance.get(
            `/certificates/course/${courseId}`
        );
    },

    // =====================================================
    // SINGLE CERTIFICATE
    // =====================================================

    getCertificate: (id) => {
        return axiosInstance.get(
            `/certificates/${id}`
        );
    }
};

export default CertificateService;