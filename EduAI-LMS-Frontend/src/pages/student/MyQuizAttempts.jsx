import { useEffect, useState } from "react";

import QuizAttemptService
    from "../../services/QuizAttemptService";

import { getUserId }
    from "../../utils/localStorage";


function MyQuizAttempts() {

    const [attempts, setAttempts] = useState([]);

    const [loading, setLoading] = useState(true);


    useEffect(() => {

        loadAttempts();

    }, []);


    const loadAttempts = async () => {

        try {

            const studentId = getUserId();

            console.log(
                "Student ID:",
                studentId
            );


            const response =
                await QuizAttemptService
                    .getAttemptsByStudent(
                        studentId
                    );


            console.log(
                "Attempts:",
                response.data
            );


            setAttempts(
                response.data
            );

        } catch (error) {

            console.error(
                "Failed to load attempts:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    const deleteAttempt = async (id) => {

        const confirmDelete =
            window.confirm(
                "Delete this quiz attempt?"
            );


        if (!confirmDelete) {

            return;

        }


        try {

            await QuizAttemptService
                .deleteAttempt(id);


            alert(
                "Attempt deleted successfully."
            );


            loadAttempts();

        } catch (error) {

            console.error(
                error
            );

            alert(
                "Failed to delete attempt."
            );

        }

    };


    if (loading) {

        return (
            <div className="container mt-4">

                <h3>
                    Loading attempts...
                </h3>

            </div>
        );

    }


    return (

        <div className="container mt-4">

            <h2 className="mb-4">
                My Quiz Attempts
            </h2>


            {attempts.length === 0 ? (

                <div className="alert alert-info">

                    No quiz attempts found.

                </div>

            ) : (

                <table
                    className="table table-bordered table-hover"
                >

                    <thead className="table-dark">

                        <tr>

                            <th>
                                Attempt ID
                            </th>

                            <th>
                                Quiz
                            </th>

                            <th>
                                Status
                            </th>

                            <th>
                                Score
                            </th>

                            <th>
                                Actions
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {attempts.map(
                            (attempt) => (

                                <tr
                                    key={
                                        attempt.id
                                    }
                                >

                                    <td>
                                        {attempt.id}
                                    </td>


                                    <td>

                                        {
                                            attempt.quiz
                                                ?.title
                                        }

                                    </td>


                                    <td>
                                        {
                                            attempt.status
                                        }
                                    </td>


                                    <td>

                                        {
                                            attempt.score
                                        }

                                        /

                                        {
                                            attempt.totalMarks
                                        }

                                    </td>


                                    <td>

                                        <button
                                            className="btn btn-danger btn-sm"
                                            onClick={() =>
                                                deleteAttempt(
                                                    attempt.id
                                                )
                                            }
                                        >
                                            Delete
                                        </button>

                                    </td>

                                </tr>

                            )
                        )}

                    </tbody>

                </table>

            )}

        </div>

    );

}


export default MyQuizAttempts;