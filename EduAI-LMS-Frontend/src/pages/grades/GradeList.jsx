import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import GradeService from "../../services/GradeService";

function GradeList() {

    const [grades, setGrades] = useState([]);

    const [search, setSearch] = useState("");

    const [studentFilter, setStudentFilter] =
        useState("");

    const [assignmentFilter, setAssignmentFilter] =
        useState("");

    const [quizFilter, setQuizFilter] =
        useState("");

    const [gradeFilter, setGradeFilter] =
        useState("ALL");

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");


    // =========================================================
    // LOAD GRADES
    // =========================================================

    useEffect(() => {

        loadGrades();

    }, []);


    const loadGrades = () => {

        setLoading(true);

        setError("");


        GradeService.getAllGrades()

            .then((response) => {

                setGrades(
                    Array.isArray(response.data)
                        ? response.data
                        : []
                );

            })

            .catch((error) => {

                console.error(
                    "Unable to load grades:",
                    error
                );

                setError(
                    error.response?.data?.message ||
                    "Unable to load grades."
                );

                setGrades([]);

            })

            .finally(() => {

                setLoading(false);

            });
    };


    // =========================================================
    // DELETE GRADE
    // =========================================================

    const deleteGrade = (id) => {

        if (
            !window.confirm(
                "Delete this grade?"
            )
        ) {
            return;
        }


        GradeService.deleteGrade(id)

            .then(() => {

                loadGrades();

            })

            .catch((error) => {

                console.error(
                    "Unable to delete grade:",
                    error
                );

                alert(
                    error.response?.data?.message ||
                    "Unable to delete grade."
                );

            });
    };


    // =========================================================
    // PERCENTAGE
    // =========================================================

    const percentage = (grade) => {

        if (
            grade?.score == null ||
            grade?.maxScore == null ||
            Number(grade.maxScore) === 0
        ) {
            return 0;
        }


        return (
            Number(grade.score) /
            Number(grade.maxScore)
        ) * 100;
    };


    // =========================================================
    // LETTER GRADE
    // =========================================================

    const getLetterGrade = (grade) => {

        if (
            grade?.score == null ||
            grade?.maxScore == null ||
            Number(grade.maxScore) === 0
        ) {
            return "-";
        }


        const p =
            percentage(grade);


        if (p >= 80) return "A";

        if (p >= 70) return "B";

        if (p >= 60) return "C";

        if (p >= 50) return "D";

        return "F";
    };


    // =========================================================
    // RESET FILTERS
    // =========================================================

    const resetFilters = () => {

        setSearch("");

        setStudentFilter("");

        setAssignmentFilter("");

        setQuizFilter("");

        setGradeFilter("ALL");
    };


    // =========================================================
    // FILTER GRADES
    // =========================================================

    const filteredGrades =
        grades.filter((grade) => {

            const studentName =
                grade.student?.fullName || "";


            const searchMatch =
                studentName
                    .toLowerCase()
                    .includes(
                        search.toLowerCase()
                    );


            const studentMatch =
                studentFilter === "" ||
                grade.student?.id ===
                    Number(studentFilter);


            const assignmentMatch =
                assignmentFilter === "" ||
                grade.assignment?.id ===
                    Number(assignmentFilter);


            const quizMatch =
                quizFilter === "" ||
                grade.quiz?.id ===
                    Number(quizFilter);


            const gradeMatch =
                gradeFilter === "ALL" ||
                getLetterGrade(grade) ===
                    gradeFilter;


            return (
                searchMatch &&
                studentMatch &&
                assignmentMatch &&
                quizMatch &&
                gradeMatch
            );
        });


    // =========================================================
    // RENDER
    // =========================================================

    return (
        <DashboardLayout>

            <div className="container mt-4">

                {/* =================================================
                    HEADER
                ================================================= */}

                <div className="d-flex justify-content-between align-items-center mb-3">

                    <h2>
                        Grade Management
                    </h2>


                    <div>

                        <button
                            type="button"
                            className="btn btn-secondary me-2"
                            onClick={loadGrades}
                            disabled={loading}
                        >
                            {loading
                                ? "Loading..."
                                : "Refresh"}
                        </button>


                        <Link
                            to="/grades/add"
                            className="btn btn-primary"
                        >
                            Add Grade
                        </Link>

                    </div>

                </div>


                {/* =================================================
                    ERROR
                ================================================= */}

                {error && (

                    <div
                        className="alert alert-danger"
                        role="alert"
                    >
                        {error}
                    </div>

                )}


                {/* =================================================
                    CARD
                ================================================= */}

                <div className="card shadow">

                    <div className="card-body">

                        {/* =================================================
                            SEARCH
                        ================================================= */}

                        <div className="mb-3">

                            <label className="form-label">
                                Search Student
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Student..."
                                value={search}
                                onChange={(e) =>
                                    setSearch(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* =================================================
                            FILTERS
                        ================================================= */}

                        <div className="row mb-3">

                            {/* Student */}

                            <div className="col-md-2">

                                <label className="form-label">
                                    Student
                                </label>

                                <select
                                    className="form-select"
                                    value={studentFilter}
                                    onChange={(e) =>
                                        setStudentFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All Students
                                    </option>


                                    {[
                                        ...new Map(
                                            grades
                                                .filter(
                                                    (g) =>
                                                        g.student
                                                )
                                                .map(
                                                    (g) => [
                                                        g.student.id,
                                                        g.student
                                                    ]
                                                )
                                        ).values()
                                    ].map(
                                        (student) => (

                                            <option
                                                key={
                                                    student.id
                                                }
                                                value={
                                                    student.id
                                                }
                                            >
                                                {
                                                    student.fullName
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Assignment */}

                            <div className="col-md-2">

                                <label className="form-label">
                                    Assignment
                                </label>

                                <select
                                    className="form-select"
                                    value={assignmentFilter}
                                    onChange={(e) =>
                                        setAssignmentFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All Assignments
                                    </option>


                                    {[
                                        ...new Map(
                                            grades
                                                .filter(
                                                    (g) =>
                                                        g.assignment
                                                )
                                                .map(
                                                    (g) => [
                                                        g.assignment.id,
                                                        g.assignment
                                                    ]
                                                )
                                        ).values()
                                    ].map(
                                        (assignment) => (

                                            <option
                                                key={
                                                    assignment.id
                                                }
                                                value={
                                                    assignment.id
                                                }
                                            >
                                                {
                                                    assignment.title
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Quiz */}

                            <div className="col-md-2">

                                <label className="form-label">
                                    Quiz
                                </label>

                                <select
                                    className="form-select"
                                    value={quizFilter}
                                    onChange={(e) =>
                                        setQuizFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="">
                                        All Quizzes
                                    </option>


                                    {[
                                        ...new Map(
                                            grades
                                                .filter(
                                                    (g) =>
                                                        g.quiz
                                                )
                                                .map(
                                                    (g) => [
                                                        g.quiz.id,
                                                        g.quiz
                                                    ]
                                                )
                                        ).values()
                                    ].map(
                                        (quiz) => (

                                            <option
                                                key={
                                                    quiz.id
                                                }
                                                value={
                                                    quiz.id
                                                }
                                            >
                                                {
                                                    quiz.title
                                                }
                                            </option>

                                        )
                                    )}

                                </select>

                            </div>


                            {/* Grade */}

                            <div className="col-md-2">

                                <label className="form-label">
                                    Grade
                                </label>

                                <select
                                    className="form-select"
                                    value={gradeFilter}
                                    onChange={(e) =>
                                        setGradeFilter(
                                            e.target.value
                                        )
                                    }
                                >

                                    <option value="ALL">
                                        All
                                    </option>

                                    <option value="A">
                                        A
                                    </option>

                                    <option value="B">
                                        B
                                    </option>

                                    <option value="C">
                                        C
                                    </option>

                                    <option value="D">
                                        D
                                    </option>

                                    <option value="F">
                                        F
                                    </option>

                                </select>

                            </div>


                            {/* Reset */}

                            <div className="col-md-2 d-flex align-items-end">

                                <button
                                    type="button"
                                    className="btn btn-secondary w-100"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </button>

                            </div>

                        </div>


                        {/* =================================================
                            TABLE
                        ================================================= */}

                        {loading ? (

                            <div className="text-center py-5">

                                <div
                                    className="spinner-border"
                                    role="status"
                                >

                                    <span className="visually-hidden">
                                        Loading...
                                    </span>

                                </div>

                                <p className="mt-2">
                                    Loading grades...
                                </p>

                            </div>

                        ) : (

                            <div className="table-responsive">

                                <table className="table table-bordered table-hover">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>ID</th>

                                            <th>Student</th>

                                            <th>Assignment</th>

                                            <th>Quiz</th>

                                            <th>Score</th>

                                            <th>Max Score</th>

                                            <th>%</th>

                                            <th>Grade</th>

                                            <th>Remarks</th>

                                            <th>Actions</th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredGrades.length > 0 ? (

                                            filteredGrades.map(
                                                (grade) => (

                                                    <tr
                                                        key={
                                                            grade.id
                                                        }
                                                    >

                                                        {/* ID */}

                                                        <td>
                                                            {
                                                                grade.id
                                                            }
                                                        </td>


                                                        {/* Student */}

                                                        <td>

                                                            {
                                                                grade
                                                                    .student
                                                                    ?.fullName ||
                                                                "-"
                                                            }

                                                        </td>


                                                        {/* Assignment */}

                                                        <td>

                                                            {
                                                                grade
                                                                    .assignment
                                                                    ?.title ||
                                                                "-"
                                                            }

                                                        </td>


                                                        {/* Quiz */}

                                                        <td>

                                                            {
                                                                grade
                                                                    .quiz
                                                                    ?.title ||
                                                                "-"
                                                            }

                                                        </td>


                                                        {/* Score */}

                                                        <td>

                                                            {grade.score != null
                                                                ? grade.score
                                                                : "-"}

                                                        </td>


                                                        {/* Max Score */}

                                                        <td>

                                                            {grade.maxScore != null
                                                                ? grade.maxScore
                                                                : "-"}

                                                        </td>


                                                        {/* Percentage */}

                                                        <td>

                                                            {grade.score != null &&
                                                            grade.maxScore != null &&
                                                            Number(
                                                                grade.maxScore
                                                            ) !== 0

                                                                ? percentage(
                                                                      grade
                                                                  ).toFixed(
                                                                      2
                                                                  ) + "%"

                                                                : "-"}

                                                        </td>


                                                        {/* Grade */}

                                                        <td>

                                                            {getLetterGrade(
                                                                grade
                                                            )}

                                                        </td>


                                                        {/* Remarks */}

                                                        <td>

                                                            {
                                                                grade
                                                                    .remarks ||
                                                                "-"
                                                            }

                                                        </td>


                                                        {/* Actions */}

                                                        <td>

                                                            <Link
                                                                to={`/grades/edit/${grade.id}`}
                                                                className="btn btn-warning btn-sm me-2"
                                                            >
                                                                Edit
                                                            </Link>


                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    deleteGrade(
                                                                        grade.id
                                                                    )
                                                                }
                                                            >
                                                                Delete
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan="10"
                                                    className="text-center py-4"
                                                >
                                                    No grades found.
                                                </td>

                                            </tr>

                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </div>

                </div>

            </div>

        </DashboardLayout>
    );
}

export default GradeList;