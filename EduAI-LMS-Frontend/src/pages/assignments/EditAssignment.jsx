import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import AssignmentService from "../../services/AssignmentService";

function EditAssignment() {

    const { id } = useParams();

    const navigate = useNavigate();

    const [title, setTitle] = useState("");

    const [description, setDescription] = useState("");

    const [dueDate, setDueDate] = useState("");

    const [maxMarks, setMaxMarks] = useState("");

    useEffect(() => {

        loadAssignment();

    }, []);

    const loadAssignment = async () => {

        try {

            const response = await AssignmentService.getAssignmentById(id);

            const assignment = response.data;

            setTitle(assignment.title);

            setDescription(assignment.description);

            setDueDate(assignment.dueDate);

            setMaxMarks(assignment.maxMarks);

        }

        catch (error) {

            console.error(error);

            alert("Unable to load assignment.");

        }

    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            await AssignmentService.updateAssignment(id, {

                title,

                description,

                dueDate,

                maxMarks

            });

            alert("Assignment updated successfully.");

            navigate("/assignments");

        }

        catch (error) {

            console.error(error);

            alert("Update failed.");

        }

    };

    return (

        <DashboardLayout>

            <div className="container">

                <h2 className="mb-4">

                    Edit Assignment

                </h2>

                <form onSubmit={handleSubmit}>

                    <div className="mb-3">

                        <label className="form-label">

                            Assignment Title

                        </label>

                        <input
                            type="text"
                            className="form-control"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">

                            Description

                        </label>

                        <textarea
                            rows="5"
                            className="form-control"
                            value={description}
                            onChange={(e) =>
                                setDescription(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">

                            Due Date

                        </label>

                        <input
                            type="date"
                            className="form-control"
                            value={dueDate}
                            onChange={(e) =>
                                setDueDate(e.target.value)
                            }
                            required
                        />

                    </div>

                    <div className="mb-3">

                        <label className="form-label">

                            Maximum Marks

                        </label>

                        <input
                            type="number"
                            className="form-control"
                            value={maxMarks}
                            onChange={(e) =>
                                setMaxMarks(e.target.value)
                            }
                            required
                        />

                    </div>

                    <button
                        className="btn btn-primary"
                        type="submit"
                    >

                        Update Assignment

                    </button>

                </form>

            </div>

        </DashboardLayout>

    );

}

export default EditAssignment;