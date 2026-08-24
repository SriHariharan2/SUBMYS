import api from "../api/axiosConfig";

// =====================================================
// GET ALL COURSES
// =====================================================
// ADMIN USE
// =====================================================

const getAllCourses = () => {
    return api.get("/courses");
};


// =====================================================
// GET COURSES FOR STUDENT
// =====================================================
// STUDENT USE
//
// Returns only courses where the student is enrolled.
//
// Example:
// /api/courses/student/3
// =====================================================

const getStudentCourses = (studentId) => {
    return api.get(`/courses/student/${studentId}`);
};


// =====================================================
// GET COURSE BY ID
// =====================================================

const getCourseById = (id) => {
    return api.get(`/courses/${id}`);
};


// =====================================================
// CREATE COURSE
// =====================================================
// ADMIN USE
// =====================================================

const createCourse = (course) => {
    return api.post("/courses", course);
};


// =====================================================
// UPDATE COURSE
// =====================================================
// ADMIN USE
// =====================================================

const updateCourse = (id, course) => {
    return api.put(`/courses/${id}`, course);
};


// =====================================================
// DELETE COURSE
// =====================================================
// ADMIN USE
// =====================================================

const deleteCourse = (id) => {
    return api.delete(`/courses/${id}`);
};


// =====================================================
// EXPORT
// =====================================================

const CourseService = {

    getAllCourses,

    getStudentCourses,

    getCourseById,

    createCourse,

    updateCourse,

    deleteCourse
};

export default CourseService;