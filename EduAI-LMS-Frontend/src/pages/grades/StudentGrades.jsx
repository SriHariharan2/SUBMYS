import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import GradeService from "../../services/GradeService";
import { getUser } from "../../utils/localStorage";

function StudentGrades() {
    const [grades, setGrades] = useState([]);

    const [search, setSearch] = useState("");
    const [assignmentFilter, setAssignmentFilter] = useState("");
    const [quizFilter, setQuizFilter] = useState("");
    const [gradeFilter, setGradeFilter] = useState("ALL");

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");


    // =========================================================
    // LOAD STUDENT GRADES
    // =========================================================

    useEffect(() => {
        loadGrades();
    }, []);


    const loadGrades = () => {

        const user = getUser();

        if (!user) {
            setError("Student information not found.");
            setLoading(false);
            return;
        }


        setLoading(true);
        setError("");


        GradeService.getStudentGrades(user.id)
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
    // CALCULATE PERCENTAGE
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


        const p = percentage(grade);


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

        setAssignmentFilter("");

        setQuizFilter("");

        setGradeFilter("ALL");
    };


    // =========================================================
    // FILTER GRADES
    // =========================================================

    const filteredGrades =
        grades.filter((grade) => {

            const assignmentTitle =
                grade.assignment?.title || "";


            const quizTitle =
                grade.quiz?.title || "";


            const searchValue =
                search.toLowerCase();


            const searchMatch =
                assignmentTitle
                    .toLowerCase()
                    .includes(searchValue) ||

                quizTitle
                    .toLowerCase()
                    .includes(searchValue);


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

                <div className="card shadow">

                    {/* =================================================
                        HEADER
                    ================================================= */}

                    <div className="card-header">

                        <div className="d-flex justify-content-between align-items-center">

                            <h2 className="mb-0">
                                My Grades
                            </h2>

                            <button
                                type="button"
                                className="btn btn-primary"
                                onClick={loadGrades}
                                disabled={loading}
                            >
                                {loading
                                    ? "Loading..."
                                    : "Refresh"}
                            </button>

                        </div>

                    </div>


                    <div className="card-body">

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
                            SEARCH
                        ================================================= */}

                        <div className="mb-3">

                            <label className="form-label">
                                Search
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                placeholder="Search Assignment or Quiz..."
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

                            {/* Assignment */}

                            <div className="col-md-3">

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

                            <div className="col-md-3">

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

                            <div className="col-md-3">

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
                                        All Grades
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

                            <div className="col-md-3 d-flex align-items-end">

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
                            LOADING
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

                            /* =================================================
                               TABLE
                            ================================================= */

                            <div className="table-responsive">

                                <table className="table table-bordered table-hover">

                                    <thead className="table-dark">

                                        <tr>

                                            <th>#</th>

                                            <th>Assignment</th>

                                            <th>Quiz</th>

                                            <th>Score</th>

                                            <th>Max Score</th>

                                            <th>Percentage</th>

                                            <th>Grade</th>

                                            <th>Remarks</th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {filteredGrades.length > 0 ? (

                                            filteredGrades.map(
                                                (grade, index) => (

                                                    <tr
                                                        key={
                                                            grade.id
                                                        }
                                                    >

                                                        {/* Number */}

                                                        <td>
                                                            {index + 1}
                                                        </td>


                                                        {/* Assignment */}

                                                        <td>

                                                            {grade.assignment
                                                                ? grade
                                                                      .assignment
                                                                      .title
                                                                : "-"}

                                                        </td>


                                                        {/* Quiz */}

                                                        <td>

                                                            {grade.quiz
                                                                ? grade
                                                                      .quiz
                                                                      .title
                                                                : "-"}

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

                                                            {grade.remarks ||
                                                                "-"}

                                                        </td>

                                                    </tr>

                                                )
                                            )

                                        ) : (

                                            <tr>

                                                <td
                                                    colSpan="8"
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

export default StudentGrades;