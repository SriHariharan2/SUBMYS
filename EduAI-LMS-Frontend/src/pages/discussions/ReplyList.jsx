import { useEffect, useState } from "react";
import { Link, useParams } from "react-router-dom";
import DashboardLayout from "../../components/layout/DashboardLayout";
import ReplyService from "../../services/ReplyService";

function ReplyList() {

    const { discussionId } = useParams();

    const [replies, setReplies] = useState([]);

    useEffect(() => {
        loadReplies();
    }, []);

    const loadReplies = async () => {

        try {

            const response =
                await ReplyService.getByDiscussion(discussionId);

            setReplies(response.data);

        } catch (error) {

            console.error(error);

            alert("Unable to load replies.");

        }

    };

    const deleteReply = async (id) => {

        if (!window.confirm("Delete this reply?")) {

            return;

        }

        try {

            await ReplyService.remove(id);

            alert("Reply deleted successfully.");

            loadReplies();

        } catch (error) {

            console.error(error);

            alert("Delete failed.");

        }

    };

    return (

        <DashboardLayout>

            <div className="container">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2>Discussion Replies</h2>

                    <Link
                        to={`/discussions/${discussionId}/replies/add`}
                        className="btn btn-success"
                    >
                        Add Reply
                    </Link>

                </div>

                <table className="table table-bordered table-hover">

                    <thead className="table-dark">

                        <tr>

                            <th>Discussion</th>

                            <th>User</th>

                            <th>Reply</th>

                            <th>Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            replies.length > 0 ? (

                                replies.map((reply) => (

                                    <tr key={reply.id}>

                                        <td>

                                            {

                                                reply.discussionTitle ||

                                                "No Discussion"

                                            }

                                        </td>

                                        <td>

                                            {

                                                reply.userName ||

                                                "No User"

                                            }

                                        </td>

                                        <td>

                                            {reply.message}

                                        </td>

                                        <td>

                                            <Link
                                                to={`/replies/edit/${reply.id}`}
                                                className="btn btn-warning btn-sm me-2"
                                            >
                                                Edit
                                            </Link>

                                            <button
                                                className="btn btn-danger btn-sm"
                                                onClick={() =>
                                                    deleteReply(reply.id)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>

                                ))

                            ) : (

                                <tr>

                                    <td
                                        colSpan="4"
                                        className="text-center"
                                    >

                                        No replies found.

                                    </td>

                                </tr>

                            )

                        }

                    </tbody>

                </table>

            </div>

        </DashboardLayout>

    );

}

export default ReplyList;