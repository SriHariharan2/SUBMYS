// =====================================================
// AuthHeader.js
// =====================================================

const authHeader = () => {

    const userString = localStorage.getItem("user");

    console.log(
        "AuthHeader - localStorage user:",
        userString
    );

    if (!userString) {

        console.error(
            "AuthHeader: No user found in localStorage"
        );

        return {};
    }

    let storedUser;

    try {

        storedUser = JSON.parse(userString);

    } catch (error) {

        console.error(
            "AuthHeader: Invalid user JSON",
            error
        );

        return {};
    }

    console.log(
        "AuthHeader - parsed user:",
        storedUser
    );

    // -------------------------------------------------
    // Support both possible structures
    // -------------------------------------------------

    const token =
        storedUser?.token ||
        storedUser?.accessToken ||
        storedUser?.jwt ||
        storedUser?.user?.token ||
        storedUser?.user?.accessToken ||
        storedUser?.user?.jwt ||
        localStorage.getItem("token") ||
        localStorage.getItem("accessToken") ||
        localStorage.getItem("jwt");

    // -------------------------------------------------
    // No token
    // -------------------------------------------------

    if (!token) {

        console.error(
            "AuthHeader: JWT token not found."
        );

        return {};
    }

    console.log(
        "AuthHeader: JWT token found."
    );

    // -------------------------------------------------
    // Return Authorization header
    // -------------------------------------------------

    return {
        Authorization: `Bearer ${token}`
    };
};

export default authHeader;