import axios from "axios";

const API_URL = "http://localhost:8080/api/ai";

const reviewAssignment = (data) => {
    return axios.post(
        `${API_URL}/assignment-review`,
        data,
        {
            headers: {
                Authorization: `Bearer ${localStorage.getItem("token")}`
            }
        }
    );
};

export default {
    reviewAssignment
};