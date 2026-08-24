import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function Navbar() {

    const { logout, user } = useAuth();
    const navigate = useNavigate();

    const [currentTime, setCurrentTime] = useState(new Date());


    // =====================================================
    // CURRENT DATE & TIME
    // =====================================================

    useEffect(() => {

        const timer = setInterval(() => {
            setCurrentTime(new Date());
        }, 1000);

        return () => clearInterval(timer);

    }, []);


    // =====================================================
    // GET HOME PATH BASED ON ROLE
    // =====================================================

    const getHomePath = () => {

        const role =
            user?.role ||
            localStorage.getItem("role");

        switch (String(role || "").toUpperCase()) {

            case "STUDENT":
                return "/student/dashboard";

            case "TEACHER":
                return "/teacher/dashboard";

            case "ADMIN":
                return "/admin/dashboard";

            default:
                return "/login";
        }
    };


    // =====================================================
    // HOME
    // =====================================================

    const handleHome = () => {

        navigate(getHomePath());

    };


    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {

        logout();

        navigate("/login");

    };


    // =====================================================
    // UI
    // =====================================================

    return (

        <nav
            className="navbar navbar-dark"
            style={{
                background:
                    "linear-gradient(90deg, #1268f3, #08a9c9)",
                minHeight: "72px"
            }}
        >

            <div className="container-fluid px-4">


                {/* =================================================
                    SUBMYS BRAND
                ================================================= */}

                <div
                    className="d-flex align-items-center"
                    style={{
                        cursor: "pointer"
                    }}
                    onClick={handleHome}
                >

                    {/* LOGO */}

                 <div 
    className="d-flex align-items-center justify-content-center me-2" 
    style={{ 
        width: "42px", 
        height: "42px", 
        borderRadius: "12px",
        overflow: "hidden"
    }} 
>
    <img
        src="/mains.png"
        alt="SUBMYS"
        style={{
            width: "100%",
            height: "100%",
            objectFit: "contain"
        }}
    />
</div>
                    {/* BRAND NAME */}

                    <div>

                        <div
                            className="fw-bold text-white"
                            style={{
                                fontSize: "21px"
                            }}
                        >
                            SUBMYS
                        </div>

                        <small className="text-white">
                            Smart Learning Management Platform
                        </small>

                    </div>

                </div>


                {/* =================================================
                    RIGHT SIDE
                ================================================= */}

                <div className="d-flex align-items-center gap-2">


                    {/* HOME */}

                    <button
                        className="btn btn-link text-white text-decoration-none"
                        onClick={handleHome}
                    >
                        🏠 Home
                    </button>


                    {/* =================================================
                        DATE & TIME
                    ================================================= */}

                    <div
                        className="text-white px-3 py-2"
                        style={{
                            background:
                                "rgba(255,255,255,0.10)",
                            borderRadius: "10px",
                            minWidth: "170px",
                            textAlign: "center"
                        }}
                    >

                        <div
                            style={{
                                fontSize: "13px"
                            }}
                        >
                            📅 {currentTime.toLocaleDateString()}
                        </div>

                        <div
                            className="fw-semibold"
                            style={{
                                fontSize: "14px"
                            }}
                        >
                            🕐 {currentTime.toLocaleTimeString()}
                        </div>

                    </div>


                    {/* PROFILE */}

                    <button
                        className="btn btn-light"
                        onClick={() => navigate("/profile")}
                    >
                        👤 Profile
                    </button>


                    {/* LOGOUT */}

                    <button
                        className="btn btn-outline-light"
                        onClick={handleLogout}
                    >
                        ↪ Logout
                    </button>

                </div>

            </div>

        </nav>

    );
}

export default Navbar;