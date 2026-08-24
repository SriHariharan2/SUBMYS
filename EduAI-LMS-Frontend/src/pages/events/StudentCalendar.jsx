import { useEffect, useState } from "react";

import DashboardLayout from "../../components/layout/DashboardLayout";
import EventService from "../../services/EventService";

function StudentCalendar() {

    const [events, setEvents] = useState([]);

    useEffect(() => {

        loadEvents();

    }, []);

    const loadEvents = () => {

        const today = new Date().toISOString().split("T")[0];

        EventService.getEventsByDateRange(
            today,
            "2099-12-31"
        )
            .then((response) => {

                setEvents(response.data);

            })
            .catch(console.error);

    };

    const formatTime = (time) => {

        if (!time) return "-";

        return time.substring(0, 5);

    };

    const badgeColor = (type) => {

        switch (type) {

            case "LECTURE":
                return "bg-primary";

            case "ASSIGNMENT_DEADLINE":
                return "bg-danger";

            case "QUIZ":
                return "bg-warning text-dark";

            case "EXAM":
                return "bg-dark";

            case "LIVE_SESSION":
                return "bg-success";

            case "MEETING":
                return "bg-info text-dark";

            case "WORKSHOP":
                return "bg-secondary";

            default:
                return "bg-light text-dark";

        }

    };

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <h2 className="mb-4">

                    Upcoming Events

                </h2>

                {events.length > 0 ? (

                    <div className="row">

                        {events.map(event => (

                            <div
                                className="col-lg-6 mb-4"
                                key={event.id}
                            >

                                <div className="card shadow h-100">

                                    <div className="card-body">

                                        <div className="d-flex justify-content-between align-items-center mb-3">

                                            <h4>

                                                {event.title}

                                            </h4>

                                            <span
                                                className={`badge ${badgeColor(event.eventType)}`}
                                            >

                                                {event.eventType.replaceAll("_", " ")}

                                            </span>

                                        </div>

                                        <p>

                                            <strong>Course:</strong>{" "}
                                            {event.course?.title}

                                        </p>

                                        <p>

                                            <strong>Date:</strong>{" "}
                                            {event.eventDate}

                                        </p>

                                        <p>

                                            <strong>Time:</strong>{" "}
                                            {formatTime(event.startTime)}
                                            {" - "}
                                            {formatTime(event.endTime)}

                                        </p>

                                        <p>

                                            <strong>Description:</strong>

                                        </p>

                                        <p>

                                            {event.description || "No description available."}

                                        </p>

                                    </div>

                                </div>

                            </div>

                        ))}

                    </div>

                ) : (

                    <div className="alert alert-info">

                        No upcoming events.

                    </div>

                )}

            </div>

        </DashboardLayout>

    );

}

export default StudentCalendar;