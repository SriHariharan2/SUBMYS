import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import DashboardLayout from "../../components/layout/DashboardLayout";
import UserService from "../../services/UserService";

function UserList() {

    const [users, setUsers] = useState([]);
    const [filteredUsers, setFilteredUsers] = useState([]);

    const [search, setSearch] = useState("");
    const [roleFilter, setRoleFilter] = useState("");
    const [sortBy, setSortBy] = useState("NAME_ASC");

    useEffect(() => {
        loadUsers();
    }, []);

    useEffect(() => {
        filterUsers();
    }, [users, search, roleFilter, sortBy]);

    const loadUsers = () => {

        UserService.getAllUsers()
            .then((response) => {
                setUsers(response.data);
            })
            .catch(console.error);

    };

    const filterUsers = () => {

        let filtered = [...users];

        // Search

        if (search.trim() !== "") {

            filtered = filtered.filter(user =>

                user.fullName
                    .toLowerCase()
                    .includes(search.toLowerCase())

                ||

                user.email
                    .toLowerCase()
                    .includes(search.toLowerCase())

            );

        }

        // Role Filter

        if (roleFilter !== "") {

            filtered = filtered.filter(
                user => user.role === roleFilter
            );

        }

        // Sorting

        switch (sortBy) {

            case "NAME_ASC":
                filtered.sort((a, b) =>
                    a.fullName.localeCompare(b.fullName)
                );
                break;

            case "NAME_DESC":
                filtered.sort((a, b) =>
                    b.fullName.localeCompare(a.fullName)
                );
                break;

            case "ID_ASC":
                filtered.sort((a, b) =>
                    a.id - b.id
                );
                break;

            case "ID_DESC":
                filtered.sort((a, b) =>
                    b.id - a.id
                );
                break;

            default:
                break;

        }

        setFilteredUsers(filtered);

    };

    const resetFilters = () => {

        setSearch("");
        setRoleFilter("");
        setSortBy("NAME_ASC");

    };

    const deleteUser = (id) => {

        if (!window.confirm("Delete this user?")) return;

        UserService.deleteUser(id)
            .then(() => loadUsers())
            .catch(console.error);

    };

    return (

        <DashboardLayout>

            <div className="container mt-4">

                <div className="d-flex justify-content-between align-items-center mb-4">

                    <h2>User Management</h2>

                    <Link
                        to="/users/add"
                        className="btn btn-primary"
                    >
                        + Add User
                    </Link>

                </div>

                <div className="card shadow">

                    <div className="card-body">

                        {/* Filters */}

                        <div className="row mb-3">

                            <div className="col-md-4">

                                <input
                                    type="text"
                                    className="form-control"
                                    placeholder="Search by Name or Email..."
                                    value={search}
                                    onChange={(e) =>
                                        setSearch(e.target.value)
                                    }
                                />

                            </div>

                            <div className="col-md-2">

                                <select
                                    className="form-select"
                                    value={roleFilter}
                                    onChange={(e) =>
                                        setRoleFilter(e.target.value)
                                    }
                                >

                                    <option value="">All Roles</option>
                                    <option value="ADMIN">ADMIN</option>
                                    <option value="TEACHER">TEACHER</option>
                                    <option value="STUDENT">STUDENT</option>

                                </select>

                            </div>

                            <div className="col-md-3">

                                <select
                                    className="form-select"
                                    value={sortBy}
                                    onChange={(e) =>
                                        setSortBy(e.target.value)
                                    }
                                >

                                    <option value="NAME_ASC">
                                        Name (A-Z)
                                    </option>

                                    <option value="NAME_DESC">
                                        Name (Z-A)
                                    </option>

                                    <option value="ID_ASC">
                                        ID (Ascending)
                                    </option>

                                    <option value="ID_DESC">
                                        ID (Descending)
                                    </option>

                                </select>

                            </div>

                            <div className="col-md-2">

                                <button
                                    className="btn btn-secondary w-100"
                                    onClick={resetFilters}
                                >
                                    Reset
                                </button>

                            </div>

                            <div className="col-md-1 text-end">

                                <span className="badge bg-primary fs-6">

                                    {filteredUsers.length}

                                </span>

                            </div>

                        </div>

                        <table className="table table-bordered table-hover">

                            <thead className="table-dark">

                                <tr>

                                    <th>ID</th>
                                    <th>Full Name</th>
                                    <th>Email</th>
                                    <th>Role</th>
                                    <th width="180">Actions</th>

                                </tr>

                            </thead>

                            <tbody>

                                {filteredUsers.length > 0 ? (

                                    filteredUsers.map((user) => (

                                        <tr key={user.id}>

                                            <td>{user.id}</td>

                                            <td>{user.fullName}</td>

                                            <td>{user.email}</td>

                                            <td>

                                                <span
                                                    className={
                                                        user.role === "ADMIN"
                                                            ? "badge bg-danger"
                                                            : user.role === "TEACHER"
                                                            ? "badge bg-warning text-dark"
                                                            : "badge bg-success"
                                                    }
                                                >
                                                    {user.role}
                                                </span>

                                            </td>

                                            <td>

                                                <Link
                                                    to={`/users/edit/${user.id}`}
                                                    className="btn btn-warning btn-sm me-2"
                                                >
                                                    Edit
                                                </Link>

                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        deleteUser(user.id)
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
                                            colSpan="5"
                                            className="text-center"
                                        >
                                            No users found.
                                        </td>

                                    </tr>

                                )}

                            </tbody>

                        </table>

                    </div>

                </div>

            </div>

        </DashboardLayout>

    );

}

export default UserList;