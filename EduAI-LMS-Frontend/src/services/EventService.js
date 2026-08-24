import api from "../api/axiosConfig";

const API_URL = "/events";

class EventService {

    // ================= GET ALL EVENTS =================

    getAllEvents() {
        return api.get(API_URL);
    }

    // ================= GET EVENT BY ID =================

    getEvent(id) {
        return api.get(`${API_URL}/${id}`);
    }

    // ================= CREATE EVENT =================

    createEvent(courseId, createdById, event) {

        return api.post(
            `${API_URL}/course/${courseId}/creator/${createdById}`,
            event
        );
    }

    // ================= UPDATE EVENT =================

    updateEvent(id, event) {

        return api.put(
            `${API_URL}/${id}`,
            event
        );
    }

    // ================= DELETE EVENT =================

    deleteEvent(id) {

        return api.delete(
            `${API_URL}/${id}`
        );
    }

    // ================= GET EVENTS BY COURSE =================

    getEventsByCourse(courseId) {

        return api.get(
            `${API_URL}/course/${courseId}`
        );
    }

    // ================= GET EVENTS BY CREATOR =================

    getEventsByCreator(createdById) {

        return api.get(
            `${API_URL}/creator/${createdById}`
        );
    }

    // ================= GET EVENTS BY DATE =================

    getEventsByDate(date) {

        return api.get(
            `${API_URL}/date/${date}`
        );
    }

    // ================= GET EVENTS BY DATE RANGE =================

    getEventsByDateRange(startDate, endDate) {

        return api.get(
            `${API_URL}/range`,
            {
                params: {
                    startDate,
                    endDate
                }
            }
        );
    }

    // ================= GET EVENTS BY TYPE =================

    getEventsByType(eventType) {

        return api.get(
            `${API_URL}/type/${eventType}`
        );
    }
}

export default new EventService();