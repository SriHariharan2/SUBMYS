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

    useEffect(() => {

        if (isEdit) {

            UserService.getUser(id)
                .then((response) => {

                    setUser({
                        fullName: response.data.fullName,
                        email: response.data.email,
                        password: "",
                        role: response.data.role
                    });

                })
                .catch((error) => console.error(error));

        }

    }, [id, isEdit]);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setUser(prev => ({
            ...prev,
            [name]: value
        }));

    };

    const saveUser = (e) => {

        e.preventDefault();

        if (
            !user.fullName.trim() ||
            !user.email.trim() ||
            (!isEdit && !user.password.trim())
        ) {

            alert("Please fill in all required fields.");

            return;

        }

        if (isEdit) {

            UserService.updateUser(id, user)
                .then(() => {

                    alert("User updated successfully.");

                    navigate("/users");

                })
                .catch((error) => {

                    console.error(error);

                    alert("Unable to update user.");

                });

        } else {

            UserService.createUser(user)
                .then(() => {

                    alert("User created successfully.");

                    navigate("/users");

                })
                .catch((error) => {

                    console.error(error);

                    alert("Unable to create user.");

                });

        }

    };

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="card shadow">

                    <div className="card-header">

                        <h3>

                            {isEdit ? "Edit User" : "Add User"}

                        </h3>

                    </div>

                    <div className="card-body">

                        <form onSubmit={saveUser}>

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
                                            : ""
                                    }
                                    required={!isEdit}
                                />

                            </div>

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

                            <button
                                type="submit"
                                className="btn btn-success me-2"
                            >

                                {isEdit ? "Update" : "Save"}

                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => navigate("/users")}
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