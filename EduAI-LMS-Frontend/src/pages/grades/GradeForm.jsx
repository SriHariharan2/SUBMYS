import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";

import GradeService from "../../services/GradeService";
import UserService from "../../services/UserService";
import AssignmentService from "../../services/AssignmentService";
import QuizService from "../../services/QuizService";

function GradeForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const [students, setStudents] = useState([]);
    const [assignments, setAssignments] = useState([]);
    const [quizzes, setQuizzes] = useState([]);

    const [grade, setGrade] = useState({
        studentId: "",
        assignmentId: "",
        quizId: "",
        score: "",
        maxScore: "",
        remarks: ""
    });

    useEffect(() => {

        loadData();

        if (id) {
            loadGrade();
        }

    }, [id]);

    const loadData = () => {

        UserService.getUsersByRole("STUDENT")
            .then(res => setStudents(res.data))
            .catch(console.error);

        AssignmentService.getAllAssignments()
            .then(res => setAssignments(res.data))
            .catch(console.error);

        QuizService.getAllQuizzes()
            .then(res => setQuizzes(res.data))
            .catch(console.error);

    };

    const loadGrade = () => {

        GradeService.getGrade(id)
            .then((res) => {

                const g = res.data;

                setGrade({
                    studentId: g.student?.id || "",
                    assignmentId: g.assignment?.id || "",
                    quizId: g.quiz?.id || "",
                    score: g.score,
                    maxScore: g.maxScore,
                    remarks: g.remarks || ""
                });

            })
            .catch(console.error);

    };

    const handleChange = (e) => {

        setGrade({
            ...grade,
            [e.target.name]: e.target.value
        });

    };

    const handleSubmit = (e) => {

        e.preventDefault();

        if (!grade.studentId) {
            alert("Please select a student.");
            return;
        }

        if (!grade.assignmentId && !grade.quizId) {
            alert("Select either an Assignment or a Quiz.");
            return;
        }

        const payload = {
            score: Number(grade.score),
            maxScore: Number(grade.maxScore),
            remarks: grade.remarks
        };

        if (id) {

            GradeService.updateGrade(id, payload)
                .then(() => navigate("/grades"))
                .catch(console.error);

        } else {

            GradeService.addGrade(
                grade.studentId,
                grade.assignmentId || null,
                grade.quizId || null,
                payload
            )
                .then(() => navigate("/grades"))
                .catch(console.error);

        }

    };

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h3>

                            {id ? "Edit Grade" : "Add Grade"}

                        </h3>

                    </div>

                    <div className="card-body">

                        <form onSubmit={handleSubmit}>

                            <div className="mb-3">

                                <label className="form-label">

                                    Student

                                </label>

                                <select
                                    className="form-select"
                                    name="studentId"
                                    value={grade.studentId}
                                    onChange={handleChange}
                                    disabled={!!id}
                                    required
                                >

                                    <option value="">
                                        Select Student
                                    </option>

                                    {students.map(student => (

                                        <option
                                            key={student.id}
                                            value={student.id}
                                        >

                                            {student.fullName}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Assignment

                                </label>

                                <select
                                    className="form-select"
                                    name="assignmentId"
                                    value={grade.assignmentId}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        None
                                    </option>

                                    {assignments.map(item => (

                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >

                                            {item.title}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Quiz

                                </label>

                                <select
                                    className="form-select"
                                    name="quizId"
                                    value={grade.quizId}
                                    onChange={handleChange}
                                >

                                    <option value="">
                                        None
                                    </option>

                                    {quizzes.map(item => (

                                        <option
                                            key={item.id}
                                            value={item.id}
                                        >

                                            {item.title}

                                        </option>

                                    ))}

                                </select>

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Score

                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="score"
                                    value={grade.score}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Maximum Score

                                </label>

                                <input
                                    type="number"
                                    className="form-control"
                                    name="maxScore"
                                    value={grade.maxScore}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                            <div className="mb-3">

                                <label className="form-label">

                                    Remarks

                                </label>

                                <textarea
                                    className="form-control"
                                    rows="3"
                                    name="remarks"
                                    value={grade.remarks}
                                    onChange={handleChange}
                                />

                            </div>

                            <button
                                type="submit"
                                className="btn btn-primary me-2"
                            >

                                {id ? "Update Grade" : "Save Grade"}

                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/grades")}
                            >

                                Cancel

                            </button>

                        </form>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default GradeForm;