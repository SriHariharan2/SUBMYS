import api from "../api/axiosConfig";


// =====================================================
// GET ALL ENROLLMENTS
// =====================================================

const getAllEnrollments = () => {

    return api.get(
        "/enrollments"
    );
};


// =====================================================
// GET STUDENT ENROLLMENTS
// =====================================================

const getStudentEnrollments = (
    studentId
) => {

    return api.get(
        `/enrollments/student/${studentId}`
    );
};


// =====================================================
// GET STUDENT COURSE IDS
// =====================================================

const getStudentCourseIds = (
    studentId
) => {

    return api.get(
        `/enrollments/student/${studentId}/course-ids`
    );
};


// =====================================================
// GET COURSE ENROLLMENTS
// =====================================================

const getCourseEnrollments = (
    courseId
) => {

    return api.get(
        `/enrollments/course/${courseId}`
    );
};


// =====================================================
// ENROLL STUDENT
// =====================================================

const enrollStudent = (
    studentId,
    courseId
) => {

    return api.post(
        `/enrollments/student/${studentId}/course/${courseId}`
    );
};


// =====================================================
// CHECK ENROLLMENT
// =====================================================

const isStudentEnrolled = (
    studentId,
    courseId
) => {

    return api.get(
        `/enrollments/student/${studentId}/course/${courseId}`
    );
};


// =====================================================
// DELETE
// =====================================================

const deleteEnrollment = (
    id
) => {

    return api.delete(
        `/enrollments/${id}`
    );
};


// =====================================================
// EXPORT
// =====================================================

const EnrollmentService = {

    getAllEnrollments,

    getStudentEnrollments,

    getStudentCourseIds,

    getCourseEnrollments,

    enrollStudent,

    isStudentEnrolled,

    deleteEnrollment,

};

export default EnrollmentService;