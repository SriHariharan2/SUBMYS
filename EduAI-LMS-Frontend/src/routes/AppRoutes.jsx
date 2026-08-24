import { BrowserRouter, Routes, Route } from "react-router-dom";

// ================= AUTHENTICATION =================

import Login from "../pages/auth/Login";

import Unauthorized from "../pages/auth/Unauthorized";

// ================= ROUTE PROTECTION =================

import RoleProtectedRoute from "./RoleProtectedRoute";

// ================= DASHBOARDS =================

import AdminDashboard from "../pages/admin/AdminDashboard";
import StudentDashboard from "../pages/student/StudentDashboard";

const TeacherDashboard = AdminDashboard;


// ================= COURSES =================

import CourseList from "../pages/courses/CourseList";
import AddCourse from "../pages/courses/AddCourse";
import EditCourse from "../pages/courses/EditCourse";
import ViewCourse from "../pages/courses/ViewCourse";

// ================= SUBJECTS =================

import SubjectList from "../pages/subjects/SubjectList";
import AddSubject from "../pages/subjects/AddSubject";
import EditSubject from "../pages/subjects/EditSubject";
import ViewSubject from "../pages/subjects/ViewSubject";

// ================= TOPICS =================

import TopicList from "../pages/topics/TopicList";
import AddTopic from "../pages/topics/AddTopic";
import EditTopic from "../pages/topics/EditTopic";
import ViewTopic from "../pages/topics/ViewTopic";

// ================= RESOURCES =================

import ResourceList from "../pages/resources/ResourceList";
import AddResource from "../pages/resources/AddResource";
import EditResource from "../pages/resources/EditResource";

// ================= ASSIGNMENTS =================

import AssignmentList from "../pages/assignments/AssignmentList";
import AddAssignment from "../pages/assignments/AddAssignment";
import EditAssignment from "../pages/assignments/EditAssignment";

// ================= SUBMISSIONS =================

import SubmissionList from "../pages/submissions/SubmissionList";
import MySubmissionList from "../pages/submissions/MySubmissionList";
import AddSubmission from "../pages/submissions/AddSubmission";
import GradeSubmission from "../pages/submissions/GradeSubmission";

// ================= QUIZZES =================

import QuizList from "../pages/quizzes/QuizList";
import AddQuiz from "../pages/quizzes/AddQuiz";
import EditQuiz from "../pages/quizzes/EditQuiz";

import AttendQuiz from "../pages/student/AttendQuiz";

import AddQuestion from "../pages/questions/AddQuestion";

// ================= ANNOUNCEMENTS =================

import AnnouncementList from "../pages/announcements/AnnouncementList";
import AnnouncementForm from "../pages/announcements/AnnouncementForm";

// ================= DISCUSSIONS =================

import DiscussionList from "../pages/discussions/DiscussionList";
import DiscussionForm from "../pages/discussions/DiscussionForm";
import ReplyList from "../pages/discussions/ReplyList";
import ReplyForm from "../pages/discussions/ReplyForm";

// ================= NOTIFICATIONS =================

import NotificationList from "../pages/notifications/NotificationList";
import NotificationForm from "../pages/notifications/NotificationForm";

// ================= COURSE PROGRESS =================

import CourseProgressList from "../pages/progress/CourseProgressList";
import CourseProgressForm from "../pages/progress/CourseProgressForm";

// ================= CERTIFICATES =================


import CertificateList
    from "../pages/certificates/CertificateList";

import CertificateView
    from "../pages/certificates/CertificateView";

import CertificateUpload
    from "../pages/certificates/CertificateUpload";

import StudentCertificates
    from "../pages/certificates/StudentCertificates";

// ================= ENROLLMENTS =================

import EnrollmentList from "../pages/enrollments/EnrollmentList";
import EnrollmentForm from "../pages/enrollments/EnrollmentForm";

// ================= USERS =================

import UserList from "../pages/users/UserList";
import UserForm from "../pages/users/UserForm";
import UserProfile from "../pages/users/UserProfile";

// ================= GRADES =================

import GradeList from "../pages/grades/GradeList";
import GradeForm from "../pages/grades/GradeForm";
import StudentGrades from "../pages/grades/StudentGrades";

// ================= ATTENDANCE =================

import AttendanceList from "../pages/attendance/AttendanceList";
import AttendanceForm from "../pages/attendance/AttendanceForm";
import StudentAttendance from "../pages/attendance/StudentAttendance";

// ================= EVENTS =================

import EventList from "../pages/events/EventList";
import EventForm from "../pages/events/EventForm";
import StudentCalendar from "../pages/events/StudentCalendar";

// ================= REPORTS =================

import AnalyticsDashboard from "../pages/reports/AnalyticsDashboard";
import StudentReport from "../pages/reports/StudentReport";
import TeacherReport from "../pages/reports/TeacherReport";

// ================= AI =================

import AIChat from "../pages/ai/AIChat";
import AIQuizGenerator from "../pages/ai/AIQuizGenerator";
import AIAssignmentReviewer from "../pages/ai/AIAssignmentReviewer";

// ================= QUIZ ATTEMPTS =================

import MyQuizAttempts from "../pages/student/MyQuizAttempts";


// =====================================================
// APP ROUTES
// =====================================================

function AppRoutes() {

    return (

        <BrowserRouter>

            <Routes>

                {/* ==================================================
                    AUTHENTICATION
                ================================================== */}

                <Route
                    path="/"
                    element={<Login />}
                />

                <Route
                    path="/login"
                    element={<Login />}
                />


                <Route
                    path="/unauthorized"
                    element={<Unauthorized />}
                />


                {/* ==================================================
                    ADMIN DASHBOARD
                ================================================== */}

                <Route
                    path="/admin/dashboard"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN"
                            ]}
                        >
                            <AdminDashboard />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    TEACHER DASHBOARD
                ================================================== */}

                <Route
                    path="/teacher/dashboard"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "TEACHER"
                            ]}
                        >
                            <TeacherDashboard />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    STUDENT DASHBOARD
                ================================================== */}

                <Route
                    path="/student/dashboard"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <StudentDashboard />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    COURSES
                    ADMIN + TEACHER + STUDENT
                ================================================== */}

                <Route
                    path="/courses"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <CourseList />
                        </RoleProtectedRoute>
                    }
                />

                {/* STUDENT MY COURSES */}

                <Route
                    path="/my-courses"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <CourseList />
                        </RoleProtectedRoute>
                    }
                />

                {/* VIEW COURSE */}

                <Route
                    path="/courses/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <ViewCourse />
                        </RoleProtectedRoute>
                    }
                />

                {/* ADD COURSE */}

                <Route
                    path="/courses/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AddCourse />
                        </RoleProtectedRoute>
                    }
                />

                {/* EDIT COURSE */}

                <Route
                    path="/courses/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EditCourse />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    SUBJECTS
                    STUDENT CAN VIEW
                ================================================== */}

                <Route
                    path="/subjects"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <SubjectList />
                        </RoleProtectedRoute>
                    }
                />

                {/* VIEW SUBJECT */}

                <Route
                    path="/subjects/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <ViewSubject />
                        </RoleProtectedRoute>
                    }
                />

                {/* ADD SUBJECT */}

                <Route
                    path="/subjects/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AddSubject />
                        </RoleProtectedRoute>
                    }
                />

                {/* EDIT SUBJECT */}

                <Route
                    path="/subjects/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EditSubject />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    TOPICS
                    STUDENT CAN VIEW
                ================================================== */}

                <Route
                    path="/topics"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <TopicList />
                        </RoleProtectedRoute>
                    }
                />

                {/* VIEW TOPIC */}

                <Route
                    path="/topics/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <ViewTopic />
                        </RoleProtectedRoute>
                    }
                />

                {/* ADD TOPIC */}

                <Route
                    path="/topics/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AddTopic />
                        </RoleProtectedRoute>
                    }
                />

                {/* EDIT TOPIC */}

                <Route
                    path="/topics/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EditTopic />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    RESOURCES
                    STUDENT CAN VIEW
                ================================================== */}

                <Route
                    path="/resources"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <ResourceList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/resources/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AddResource />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/resources/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EditResource />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    ASSIGNMENTS
                    STUDENT CAN VIEW
                ================================================== */}

                <Route
                    path="/assignments"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <AssignmentList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/assignments/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AddAssignment />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/assignments/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EditAssignment />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    SUBMISSIONS
                ================================================== */}

                <Route
                    path="/submissions"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <SubmissionList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/my-submissions"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <MySubmissionList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/submissions/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <AddSubmission />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/submissions/grade/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <GradeSubmission />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    QUIZZES
                ================================================== */}

                <Route
                    path="/quizzes"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <QuizList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/quizzes/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AddQuiz />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/quizzes/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EditQuiz />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/quizzes/attend/:quizId"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <AttendQuiz />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/student/quiz-attempts"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <MyQuizAttempts />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/questions/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AddQuestion />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    ANNOUNCEMENTS
                ================================================== */}

                <Route
                    path="/announcements"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <AnnouncementList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/announcements/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AnnouncementForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/announcements/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AnnouncementForm />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    DISCUSSIONS
                ================================================== */}

                <Route
                    path="/discussions"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <DiscussionList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/discussions/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <DiscussionForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/discussions/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <DiscussionForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/discussions/:discussionId/replies"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <ReplyList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/discussions/:discussionId/replies/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <ReplyForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/replies/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <ReplyForm />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    ENROLLMENTS
                ================================================== */}

                <Route
                    path="/enrollments"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EnrollmentList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/enrollments/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EnrollmentForm />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    COURSE PROGRESS
                ================================================== */}

                <Route
                    path="/course-progress"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <CourseProgressList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/course-progress/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <CourseProgressForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/course-progress/edit/:studentId/:courseId"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <CourseProgressForm />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    CERTIFICATES
                ================================================== */}

                <Route
                    path="/certificates"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <CertificateList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/certificates/view/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <CertificateView />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    USERS
                ================================================== */}

                <Route
                    path="/users"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN"
                            ]}
                        >
                            <UserList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/users/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN"
                            ]}
                        >
                            <UserForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/users/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN"
                            ]}
                        >
                            <UserForm />
                        </RoleProtectedRoute>
                    }
                />

                {/* PROFILE */}

                <Route
                    path="/profile"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <UserProfile />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    GRADES
                ================================================== */}

                <Route
                    path="/grades"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <GradeList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/grades/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <GradeForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/grades/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <GradeForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/my-grades"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <StudentGrades />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/student-grades"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <StudentGrades />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    ATTENDANCE
                ================================================== */}

                <Route
                    path="/attendance"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AttendanceList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/attendance/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AttendanceForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/attendance/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AttendanceForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/my-attendance"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <StudentAttendance />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/student-attendance"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <StudentAttendance />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    EVENTS
                ================================================== */}

                <Route
                    path="/events"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EventList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/events/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EventForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/events/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <EventForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/calendar"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <StudentCalendar />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    REPORTS
                ================================================== */}

                <Route
                    path="/reports"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN"
                            ]}
                        >
                            <AnalyticsDashboard />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/teacher-report"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "TEACHER"
                            ]}
                        >
                            <TeacherReport />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/student-report"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "STUDENT"
                            ]}
                        >
                            <StudentReport />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    AI
                ================================================== */}

                <Route
                    path="/ai-chat"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <AIChat />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/ai-quiz-generator"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <AIQuizGenerator />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/ai-assignment-reviewer"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <AIAssignmentReviewer />
                        </RoleProtectedRoute>
                    }
                />


                {/* ==================================================
                    NOTIFICATIONS
                ================================================== */}

                <Route
                    path="/notifications"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER",
                                "STUDENT"
                            ]}
                        >
                            <NotificationList />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/notifications/add"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <NotificationForm />
                        </RoleProtectedRoute>
                    }
                />

                <Route
                    path="/notifications/edit/:id"
                    element={
                        <RoleProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "TEACHER"
                            ]}
                        >
                            <NotificationForm />
                        </RoleProtectedRoute>
                    }
                />

<Route
    path="/certificates"
    element={
        <RoleProtectedRoute
            allowedRoles={[
                "ADMIN",
                "TEACHER"
            ]}
        >
            <CertificateList />
        </RoleProtectedRoute>
    }
/>

<Route
    path="/certificates/upload"
    element={
        <RoleProtectedRoute
            allowedRoles={[
                "ADMIN",
                "TEACHER"
            ]}
        >
            <CertificateUpload />
        </RoleProtectedRoute>
    }
/>

<Route
    path="/certificates/view/:id"
    element={
        <RoleProtectedRoute
            allowedRoles={[
                "ADMIN",
                "TEACHER",
                "STUDENT"
            ]}
        >
            <CertificateView />
        </RoleProtectedRoute>
    }
/>

<Route
    path="/student/certificates"
    element={
        <RoleProtectedRoute
            allowedRoles={[
                "STUDENT"
            ]}
        >
            <StudentCertificates />
        </RoleProtectedRoute>
    }
/>

                {/* ==================================================
                    FALLBACK
                ================================================== */}

                <Route
                    path="*"
                    element={<Unauthorized />}
                />

            </Routes>

        </BrowserRouter>
    );
}

export default AppRoutes;