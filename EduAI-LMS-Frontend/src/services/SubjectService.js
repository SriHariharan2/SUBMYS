import api from "../api/axiosConfig";

// =====================================================
// GET ALL SUBJECTS
// =====================================================
// ADMIN USE
// =====================================================

const getAllSubjects = () => {
    return api.get("/subjects");
};


// =====================================================
// GET SUBJECTS FOR STUDENT
// =====================================================
// STUDENT USE
//
// Returns subjects belonging only to the student's
// enrolled courses.
//
// Example:
// /api/subjects/student/3
// =====================================================

const getStudentSubjects = (studentId) => {
    return api.get(`/subjects/student/${studentId}`);
};


// =====================================================
// GET SUBJECT BY ID
// =====================================================

const getSubjectById = (id) => {
    return api.get(`/subjects/${id}`);
};


// =====================================================
// GET SUBJECTS BY COURSE
// =====================================================

const getSubjectsByCourse = (courseId) => {
    return api.get(`/subjects/course/${courseId}`);
};


// =====================================================
// CREATE SUBJECT
// =====================================================
// ADMIN USE
// =====================================================

const createSubject = (courseId, subject) => {
    return api.post(
        `/subjects/${courseId}`,
        subject
    );
};


// =====================================================
// UPDATE SUBJECT
// =====================================================
// ADMIN USE
// =====================================================

const updateSubject = (
    id,
    courseId,
    subject
) => {

    return api.put(
        `/subjects/${id}/${courseId}`,
        subject
    );
};


// =====================================================
// DELETE SUBJECT
// =====================================================
// ADMIN USE
// =====================================================

const deleteSubject = (id) => {
    return api.delete(
        `/subjects/${id}`
    );
};


// =====================================================
// EXPORT
// =====================================================

const SubjectService = {

    getAllSubjects,

    getStudentSubjects,

    getSubjectById,

    getSubjectsByCourse,

    createSubject,

    updateSubject,

    deleteSubject
};

export default SubjectService;