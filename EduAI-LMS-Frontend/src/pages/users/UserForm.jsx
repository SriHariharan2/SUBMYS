import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import UserService from "../../services/UserService";

function UserForm() {

    const navigate = useNavigate();
    const { id } = useParams();

    const isEdit = Boolean(id);

    const [user, setUser] = useState({
        fullName: "",
        email: "",
        password: "",
        role: "STUDENT"
    });

    const [saving, setSaving] = useState(false);

    // =========================================================
    // LOAD USER FOR EDIT
    // =========================================================

    useEffect(() => {

        if (!isEdit) {
            return;
        }

        UserService.getUser(id)
            .then((response) => {

                setUser({
                    fullName: response.data.fullName || "",
                    email: response.data.email || "",
                    password: "",
                    role: response.data.role || "STUDENT"
                });

            })
            .catch((error) => {

                console.error("Error loading user:", error);

                alert("Unable to load user.");

            });

    }, [id, isEdit]);


    // =========================================================
    // HANDLE INPUT
    // =========================================================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setUser((prev) => ({
            ...prev,
            [name]: value
        }));

    };


    // =========================================================
    // SAVE USER
    // =========================================================

    const saveUser = async (e) => {

        e.preventDefault();

        // -----------------------------------------------------
        // VALIDATION
        // -----------------------------------------------------

        if (!user.fullName.trim()) {

            alert("Please enter full name.");

            return;
        }

        if (!user.email.trim()) {

            alert("Please enter email.");

            return;
        }

        // Password is required ONLY when creating a user
        if (!isEdit && !user.password.trim()) {

            alert("Please enter a password.");

            return;
        }

        // -----------------------------------------------------
        // CLEAN VALUES
        // -----------------------------------------------------

        const fullName = user.fullName.trim();
        const email = user.email.trim().toLowerCase();
        const role = user.role;

        setSaving(true);

        try {

            // =================================================
            // CREATE USER
            // =================================================

            if (!isEdit) {

                // IMPORTANT:
                // Explicitly send password to backend.
                // Backend will BCrypt encode it.

                const createRequest = {
                    fullName: fullName,
                    email: email,
                    password: user.password,
                    role: role
                };

                console.log("Creating user:", {
                    fullName: createRequest.fullName,
                    email: createRequest.email,
                    role: createRequest.role,
                    passwordProvided:
                        Boolean(createRequest.password)
                });

                await UserService.createUser(createRequest);

                alert("User created successfully.");

                navigate("/users");

                return;
            }


            // =================================================
            // UPDATE USER
            // =================================================

            const updateRequest = {
                fullName: fullName,
                email: email,
                role: role
            };

            // -------------------------------------------------
            // Only send password if admin entered a new one.
            // -------------------------------------------------

            if (user.password.trim()) {

                updateRequest.password = user.password;

            }

            console.log("Updating user:", {
                fullName: updateRequest.fullName,
                email: updateRequest.email,
                role: updateRequest.role,
                passwordProvided:
                    Boolean(updateRequest.password)
            });

            await UserService.updateUser(
                id,
                updateRequest
            );

            alert("User updated successfully.");

            navigate("/users");

        } catch (error) {

            console.error("User save error:", error);

            const message =
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to save user.";

            alert(message);

        } finally {

            setSaving(false);

        }
    };


    // =========================================================
    // UI
    // =========================================================

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h3 className="mb-0">

                            {isEdit
                                ? "Edit User"
                                : "Add User"}

                        </h3>

                    </div>


                    <div className="card-body">

                        <form onSubmit={saveUser}>

                            {/* =================================
                                FULL NAME
                            ================================= */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Full Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    name="fullName"
                                    value={user.fullName}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* =================================
                                EMAIL
                            ================================= */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Email
                                </label>

                                <input
                                    type="email"
                                    className="form-control"
                                    name="email"
                                    value={user.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>


                            {/* =================================
                                PASSWORD
                            ================================= */}

                            <div className="mb-3">

                                <label className="form-label">
                                    Password
                                </label>

                                <input
                                    type="password"
                                    className="form-control"
                                    name="password"
                                    value={user.password}
                                    onChange={handleChange}
                                    placeholder={
                                        isEdit
                                            ? "Leave blank to keep current password"
                                            : "Enter password"
                                    }
                                    required={!isEdit}
                                    minLength={6}
                                />

                                {!isEdit && (

                                    <small className="text-muted">
                                        Password must be at least 6 characters.
                                    </small>

                                )}

                            </div>


                            {/* =================================
                                ROLE
                            ================================= */}

                            <div className="mb-4">

                                <label className="form-label">
                                    Role
                                </label>

                                <select
                                    className="form-select"
                                    name="role"
                                    value={user.role}
                                    onChange={handleChange}
                                >

                                    <option value="ADMIN">
                                        ADMIN
                                    </option>

                                    <option value="TEACHER">
                                        TEACHER
                                    </option>

                                    <option value="STUDENT">
                                        STUDENT
                                    </option>

                                </select>

                            </div>


                            {/* =================================
                                BUTTONS
                            ================================= */}

                            <button
                                type="submit"
                                className="btn btn-success me-2"
                                disabled={saving}
                            >

                                {saving
                                    ? "Saving..."
                                    : isEdit
                                        ? "Update"
                                        : "Save"}

                            </button>


                            <button
                                type="button"
                                className="btn btn-secondary"
                                disabled={saving}
                                onClick={() =>
                                    navigate("/users")
                                }
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

export default UserForm;