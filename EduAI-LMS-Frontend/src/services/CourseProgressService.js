import axios from "axios";
import authHeader from "./AuthHeader";

const API_URL =
    "https://submys.onrender.com/api/course-progress";


// =====================================================
// GET ALL PROGRESS
// =====================================================
// ADMIN / TEACHER
// =====================================================

const getAllProgress = () => {

    return axios.get(
        API_URL,
        {
            headers: authHeader(),
        }
    );
};


// =====================================================
// GET PROGRESS BY STUDENT
// =====================================================
// STUDENT
// =====================================================

const getProgressByStudent = (
    studentId
) => {

    return axios.get(
        `${API_URL}/student/${studentId}`,
        {
            headers: authHeader(),
        }
    );
};


// =====================================================
// GET PROGRESS BY COURSE
// =====================================================

const getProgressByCourse = (
    courseId
) => {

    return axios.get(
        `${API_URL}/course/${courseId}`,
        {
            headers: authHeader(),
        }
    );
};


// =====================================================
// GET SINGLE PROGRESS
// =====================================================

const getProgress = (
    studentId,
    courseId
) => {

    return axios.get(
        `${API_URL}/${studentId}/${courseId}`,
        {
            headers: authHeader(),
        }
    );
};


// =====================================================
// CREATE PROGRESS
// =====================================================
// ADMIN / TEACHER
// =====================================================

const createProgress = (
    studentId,
    courseId
) => {

    return axios.post(
        `${API_URL}/create/${studentId}/${courseId}`,
        {},
        {
            headers: authHeader(),
        }
    );
};


// =====================================================
// UPDATE PROGRESS
// =====================================================

const updateProgress = (
    studentId,
    courseId,
    completedTopics
) => {

    return axios.put(
        `${API_URL}/update/${studentId}/${courseId}?completedTopics=${completedTopics}`,
        {},
        {
            headers: authHeader(),
        }
    );
};


// =====================================================
// DELETE PROGRESS
// =====================================================

const deleteProgress = (
    id
) => {

    return axios.delete(
        `${API_URL}/${id}`,
        {
            headers: authHeader(),
        }
    );
};


// =====================================================
// EXPORT
// =====================================================

const CourseProgressService = {

    getAllProgress,

    getProgressByStudent,

    getProgressByCourse,

    getProgress,

    createProgress,

    updateProgress,

    deleteProgress,
};


export default CourseProgressService;