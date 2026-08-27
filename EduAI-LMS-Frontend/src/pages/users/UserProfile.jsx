import { useEffect, useState } from "react";
import DashboardLayout from "../../components/layout/DashboardLayout";
import UserService from "../../services/UserService";

import {
    getUserId,
    saveUser
} from "../../utils/localStorage";


function UserProfile() {

    const [user, setUser] = useState(null);

    const [loading, setLoading] = useState(true);

    const [showEdit, setShowEdit] = useState(false);

    const [showPassword, setShowPassword] = useState(false);

    const [fullName, setFullName] = useState("");

    const [email, setEmail] = useState("");

    const [currentPassword, setCurrentPassword] = useState("");

    const [newPassword, setNewPassword] = useState("");

    const [confirmPassword, setConfirmPassword] = useState("");

    const [saving, setSaving] = useState(false);

    const [passwordSaving, setPasswordSaving] = useState(false);


    // =========================================================
    // LOAD USER PROFILE
    // =========================================================

    useEffect(() => {

        loadUser();

    }, []);


    const loadUser = async () => {

        setLoading(true);

        try {

            const userId = getUserId();

            if (!userId) {

                console.error("User ID not found.");

                setLoading(false);

                return;
            }


            /*
             * IMPORTANT:
             *
             * Load the PROFILE endpoint instead of
             * the normal user endpoint.
             *
             * The profile endpoint should return:
             *
             * totalCourses
             * totalStudents
             * totalAssignments
             * totalQuizzes
             */

            const response =
                await UserService.getUserProfile(userId);


            console.log(
                "Profile API Response:",
                response.data
            );


            setUser(response.data);


            setFullName(
                response.data.fullName || ""
            );


            setEmail(
                response.data.email || ""
            );


        } catch (error) {

            console.error(
                "Unable to load profile:",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================================================
    // UPDATE PROFILE
    // =========================================================

    const handleUpdateProfile = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);


            const response =
                await UserService.updateUser(
                    user.id,
                    {
                        fullName: fullName,
                        email: email
                    }
                );


            console.log(
                "Update Profile Response:",
                response.data
            );


            /*
             * Keep the existing Activity values.
             *
             * The normal update endpoint may not return
             * the Activity statistics.
             */

            const updatedUser = {

                ...user,

                ...response.data,

                fullName:
                    response.data.fullName ||
                    fullName,

                email:
                    response.data.email ||
                    email,

                role:
                    response.data.role ||
                    user.role,

                totalCourses:
                    user.totalCourses || 0,

                totalStudents:
                    user.totalStudents || 0,

                totalAssignments:
                    user.totalAssignments || 0,

                totalQuizzes:
                    user.totalQuizzes || 0

            };


            console.log(
                "Updated User:",
                updatedUser
            );


            setUser(updatedUser);


            saveUser(updatedUser);


            setFullName(
                updatedUser.fullName || ""
            );


            setEmail(
                updatedUser.email || ""
            );


            setShowEdit(false);


            /*
             * Reload the profile so Activity
             * statistics are refreshed.
             */

            await loadUser();


            alert(
                "Profile updated successfully."
            );


        } catch (error) {

            console.error(
                "Unable to update profile:",
                error
            );


            let message =
                "Unable to update profile.";


            if (error.response?.data) {

                if (
                    typeof error.response.data ===
                    "string"
                ) {

                    message =
                        error.response.data;

                } else if (
                    error.response.data.message
                ) {

                    message =
                        error.response.data.message;

                }

            }


            alert(message);


        } finally {

            setSaving(false);

        }

    };


    // =========================================================
    // CHANGE PASSWORD
    // =========================================================

    const handleChangePassword = async (e) => {

        e.preventDefault();


        if (
            newPassword !==
            confirmPassword
        ) {

            alert(
                "New password and confirm password do not match."
            );

            return;
        }


        if (newPassword.length < 6) {

            alert(
                "Password must be at least 6 characters."
            );

            return;
        }


        try {

            setPasswordSaving(true);


            await UserService.changePassword(
                user.id,
                {
                    currentPassword:
                        currentPassword,

                    newPassword:
                        newPassword
                }
            );


            alert(
                "Password changed successfully."
            );


            setCurrentPassword("");

            setNewPassword("");

            setConfirmPassword("");

            setShowPassword(false);


        } catch (error) {

            console.error(
                "Unable to change password:",
                error
            );


            let message =
                "Unable to change password.";


            if (error.response?.data) {

                if (
                    typeof error.response.data ===
                    "string"
                ) {

                    message =
                        error.response.data;

                } else if (
                    error.response.data.message
                ) {

                    message =
                        error.response.data.message;

                }

            }


            alert(message);


        } finally {

            setPasswordSaving(false);

        }

    };


    // =========================================================
    // GET ROLE
    // =========================================================

    const getRoleName = () => {

        if (user?.role) {

            return user.role
                .toString()
                .replace("ROLE_", "")
                .toUpperCase();

        }


        if (
            Array.isArray(user?.roles) &&
            user.roles.length > 0
        ) {

            return user.roles[0]
                .toString()
                .replace("ROLE_", "")
                .toUpperCase();

        }


        if (
            Array.isArray(user?.authorities) &&
            user.authorities.length > 0
        ) {

            return user.authorities[0]
                .toString()
                .replace("ROLE_", "")
                .toUpperCase();

        }


        return "USER";

    };


    // =========================================================
    // LOADING
    // =========================================================

    if (loading) {

        return (

            <DashboardLayout>

                <div className="container mt-5">

                    <div className="text-center">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        >
                        </div>


                        <p className="mt-3">

                            Loading Profile...

                        </p>

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    // =========================================================
    // NO USER
    // =========================================================

    if (!user) {

        return (

            <DashboardLayout>

                <div className="container mt-5">

                    <div className="alert alert-danger">

                        Unable to load your profile.

                    </div>

                </div>

            </DashboardLayout>

        );

    }


    const roleName =
        getRoleName();


    // =========================================================
    // PROFILE
    // =========================================================

    return (

        <DashboardLayout>

            <div className="container mt-4 mb-5">


                {/* ================================================= */}
                {/* PROFILE HEADER */}
                {/* ================================================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-body">

                        <div className="d-flex align-items-center">


                            {/* AVATAR */}

                            <div
                                className="
                                    rounded-circle
                                    bg-primary
                                    text-white
                                    d-flex
                                    justify-content-center
                                    align-items-center
                                    me-3
                                "
                                style={{
                                    width: "75px",
                                    height: "75px",
                                    fontSize: "32px",
                                    fontWeight: "bold"
                                }}
                            >

                                {user.fullName
                                    ?.charAt(0)
                                    ?.toUpperCase() ||
                                    "U"}

                            </div>


                            {/* USER */}

                            <div>

                                <h3 className="mb-1">

                                    {user.fullName}

                                </h3>


                                <p className="text-muted mb-1">

                                    {user.email}

                                </p>


                                <span className="badge bg-success">

                                    {roleName}

                                </span>

                            </div>

                        </div>

                    </div>

                </div>


                {/* ================================================= */}
                {/* ACCOUNT INFORMATION */}
                {/* ================================================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-header">

                        <h5 className="mb-0">

                            Account Information

                        </h5>

                    </div>


                    <div className="card-body">

                        <div className="row">


                            {/* USER ID */}

                            <div className="col-md-6 mb-3">

                                <small className="text-muted">

                                    User ID

                                </small>


                                <h6 className="mt-1">

                                    {user.id}

                                </h6>

                            </div>


                            {/* FULL NAME */}

                            <div className="col-md-6 mb-3">

                                <small className="text-muted">

                                    Full Name

                                </small>


                                <h6 className="mt-1">

                                    {user.fullName}

                                </h6>

                            </div>


                            {/* EMAIL */}

                            <div className="col-md-6 mb-3">

                                <small className="text-muted">

                                    Email

                                </small>


                                <h6 className="mt-1">

                                    {user.email}

                                </h6>

                            </div>


                            {/* ROLE */}

                            <div className="col-md-6 mb-3">

                                <small className="text-muted">

                                    Role

                                </small>


                                <div className="mt-1">

                                    <span className="badge bg-success">

                                        {roleName}

                                    </span>

                                </div>

                            </div>


                        </div>


                        {/* EDIT BUTTON */}

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() =>
                                setShowEdit(
                                    !showEdit
                                )
                            }
                        >

                            {showEdit
                                ? "Cancel"
                                : "Edit Profile"}

                        </button>


                        {/* ================================================= */}
                        {/* EDIT FORM */}
                        {/* ================================================= */}

                        {showEdit && (

                            <form
                                className="border-top mt-4 pt-4"
                                onSubmit={
                                    handleUpdateProfile
                                }
                            >

                                <h6 className="mb-3">

                                    Edit Profile

                                </h6>


                                {/* FULL NAME */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Full Name

                                    </label>


                                    <input
                                        type="text"
                                        className="form-control"
                                        value={fullName}
                                        onChange={(e) =>
                                            setFullName(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                {/* EMAIL */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Email

                                    </label>


                                    <input
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                {/* SAVE */}

                                <button
                                    type="submit"
                                    className="btn btn-success"
                                    disabled={saving}
                                >

                                    {saving
                                        ? "Saving..."
                                        : "Save Changes"}

                                </button>

                            </form>

                        )}

                    </div>

                </div>


                {/* ================================================= */}
                {/* SECURITY */}
                {/* ================================================= */}

                <div className="card shadow-sm mb-4">

                    <div className="card-header">

                        <h5 className="mb-0">

                            Security

                        </h5>

                    </div>


                    <div className="card-body">

                        <div className="d-flex justify-content-between align-items-center">


                            <div>

                                <small className="text-muted">

                                    Password

                                </small>


                                <div className="mt-1">

                                    <strong>

                                        ********

                                    </strong>

                                </div>

                            </div>


                            <button
                                type="button"
                                className="btn btn-outline-primary"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >

                                {showPassword
                                    ? "Cancel"
                                    : "Change Password"}

                            </button>

                        </div>


                        {/* ================================================= */}
                        {/* PASSWORD FORM */}
                        {/* ================================================= */}

                        {showPassword && (

                            <form
                                className="border-top mt-4 pt-4"
                                onSubmit={
                                    handleChangePassword
                                }
                            >

                                <h6 className="mb-3">

                                    Change Password

                                </h6>


                                {/* CURRENT PASSWORD */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Current Password

                                    </label>


                                    <input
                                        type="password"
                                        className="form-control"
                                        value={
                                            currentPassword
                                        }
                                        onChange={(e) =>
                                            setCurrentPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                {/* NEW PASSWORD */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        New Password

                                    </label>


                                    <input
                                        type="password"
                                        className="form-control"
                                        value={newPassword}
                                        onChange={(e) =>
                                            setNewPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                {/* CONFIRM PASSWORD */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Confirm Password

                                    </label>


                                    <input
                                        type="password"
                                        className="form-control"
                                        value={
                                            confirmPassword
                                        }
                                        onChange={(e) =>
                                            setConfirmPassword(
                                                e.target.value
                                            )
                                        }
                                        required
                                    />

                                </div>


                                {/* CHANGE PASSWORD */}

                                <button
                                    type="submit"
                                    className="btn btn-primary"
                                    disabled={
                                        passwordSaving
                                    }
                                >

                                    {passwordSaving
                                        ? "Changing..."
                                        : "Change Password"}

                                </button>

                            </form>

                        )}

                    </div>

                </div>


                {/* ================================================= */}
                {/* ACTIVITY */}
                {/* ================================================= */}

                <div className="card shadow-sm">

                    <div className="card-header">

                        <h5 className="mb-0">

                            Activity

                        </h5>

                    </div>


                    <div className="card-body">

                        <div className="row">


                            {/* COURSES */}

                            <div className="col-md-3 mb-3">

                                <div className="border rounded p-3 text-center">

                                    <h4 className="text-primary mb-1">

                                        {user.totalCourses ?? 0}

                                    </h4>


                                    <small className="text-muted">

                                        Courses

                                    </small>

                                </div>

                            </div>


                            {/* STUDENTS */}

                            <div className="col-md-3 mb-3">

                                <div className="border rounded p-3 text-center">

                                    <h4 className="text-success mb-1">

                                        {user.totalStudents ?? 0}

                                    </h4>


                                    <small className="text-muted">

                                        Students

                                    </small>

                                </div>

                            </div>


                            {/* ASSIGNMENTS */}

                            <div className="col-md-3 mb-3">

                                <div className="border rounded p-3 text-center">

                                    <h4 className="text-warning mb-1">

                                        {user.totalAssignments ?? 0}

                                    </h4>


                                    <small className="text-muted">

                                        Assignments

                                    </small>

                                </div>

                            </div>


                            {/* QUIZZES */}

                            <div className="col-md-3 mb-3">

                                <div className="border rounded p-3 text-center">

                                    <h4 className="text-info mb-1">

                                        {user.totalQuizzes ?? 0}

                                    </h4>


                                    <small className="text-muted">

                                        Quizzes

                                    </small>

                                </div>

                            </div>





                        </div>


                    </div>

                </div>


            </div>

<div
  style={{
    background: "#fff",
    border: "1px solid #d9d9d9",
    borderRadius: "6px",
    padding: "28px 20px",
    marginTop: "20px",
    textAlign: "center",
    boxShadow: "0 2px 5px rgba(0,0,0,0.08)"
  }}
>
  <div
    style={{
      width: "64px",
      height: "64px",
      margin: "0 auto 16px",
      borderRadius: "50%",
      background: "#eef2ff",
      display: "flex",
      alignItems: "center",
      justifyContent: "center",
      fontSize: "30px"
    }}
  >
    👨‍💻
  </div>

  <h2 style={{ margin: "0 0 8px", color: "#111827" }}>
    Developed by Sri Hariharan
  </h2>

  <p style={{ margin: "0 0 20px", color: "#64748b" }}>
    SUBMYS – Smart Learning Management Platform
  </p>

  <a
    href="https://www.linkedin.com/in/sri-hariharan-muralikumar-a50276240/"
    target="_blank"
    rel="noopener noreferrer"
    style={{
      display: "inline-block",
      padding: "10px 18px",
      background: "#0a66c2",
      color: "#fff",
      textDecoration: "none",
      borderRadius: "6px",
      fontWeight: "500"
    }}
  >
    View LinkedIn Profile
  </a>
</div>
        </DashboardLayout>

    );

}


export default UserProfile;