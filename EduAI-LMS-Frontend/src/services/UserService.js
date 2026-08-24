import api from "../api/axiosConfig";

class UserService {

    // ================= GET ALL USERS =================

    getAllUsers() {
        return api.get("/users");
    }

    // ================= GET USER BY ID =================

    getUser(id) {
        return api.get(`/users/${id}`);
    }

    // ================= CREATE USER =================

    createUser(user) {
        return api.post("/users", user);
    }

    // ================= UPDATE USER =================

    updateUser(id, user) {
        return api.put(`/users/${id}`, user);
    }

    // ================= CHANGE PASSWORD =================

    changePassword(id, passwordData) {
        return api.put(
            `/users/${id}/change-password`,
            passwordData
        );
    }

    // ================= DELETE USER =================

    deleteUser(id) {
        return api.delete(`/users/${id}`);
    }

    // ================= GET USER BY EMAIL =================

    getUserByEmail(email) {
        return api.get(
            `/users/email/${encodeURIComponent(email)}`
        );
    }

    // ================= GET USERS BY ROLE =================

    getUsersByRole(role) {
        return api.get(`/users/role/${role}`);
    }

    // ================= SEARCH BY NAME =================

    searchByName(name) {
        return api.get(
            `/users/search/name/${encodeURIComponent(name)}`
        );
    }

    // ================= SEARCH BY EMAIL =================

    searchByEmail(email) {
        return api.get(
            `/users/search/email/${encodeURIComponent(email)}`
        );
    }

    // ================= GET USER PROFILE =================
    // This requires:
    // GET /api/users/{id}/profile

    getUserProfile(id) {
        return api.get(`/users/${id}/profile`);
    }
}

export default new UserService();