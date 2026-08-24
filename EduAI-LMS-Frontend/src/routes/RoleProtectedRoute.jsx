import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleProtectedRoute({ allowedRoles, children }) {

    const { token, user, isAuthenticated } = useAuth();

    // =====================================================
    // NOT LOGGED IN
    // =====================================================

    if (!token || !isAuthenticated) {

        return (
            <Navigate
                to="/login"
                replace
            />
        );
    }

    // =====================================================
    // USER STILL LOADING
    // =====================================================

    if (!user) {

        return (
            <div className="text-center mt-5">
                Loading...
            </div>
        );
    }

    // =====================================================
    // USER ROLE
    // =====================================================

    const userRole =
        String(user.role || "")
            .trim()
            .toUpperCase();

    // =====================================================
    // NORMALIZE ALLOWED ROLES
    // =====================================================

    const roles =
        Array.isArray(allowedRoles)
            ? allowedRoles.map(
                role =>
                    String(role)
                        .trim()
                        .toUpperCase()
            )
            : [];

    console.log(
        "RoleProtectedRoute:",
        {
            userRole,
            allowedRoles: roles
        }
    );

    // =====================================================
    // ROLE CHECK
    // =====================================================

    if (
        roles.length > 0 &&
        !roles.includes(userRole)
    ) {

        console.warn(
            "Unauthorized route access",
            {
                userRole,
                allowedRoles: roles
            }
        );

        return (
            <Navigate
                to="/unauthorized"
                replace
            />
        );
    }

    // =====================================================
    // ACCESS GRANTED
    // =====================================================

    return children;
}

export default RoleProtectedRoute;