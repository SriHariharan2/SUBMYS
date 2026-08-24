import {
    createContext,
    useContext,
    useEffect,
    useState,
} from "react";

import {
    getToken,
    getUser,
    logout as clearStorage,
} from "../utils/localStorage";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {

    // =========================================================
    // INITIAL AUTH STATE
    // =========================================================

    const [token, setToken] = useState(() => {
        try {
            return getToken() || null;
        } catch (error) {
            console.error("Error loading JWT token:", error);
            return null;
        }
    });

    const [user, setUser] = useState(() => {
        try {
            return getUser() || null;
        } catch (error) {
            console.error("Error loading logged-in user:", error);
            return null;
        }
    });


    // =========================================================
    // GET USER ID
    // =========================================================
    //
    // Different parts of the application may return the user ID
    // using different property names.
    //
    // We check the common possibilities so Notifications,
    // Certificates, Assignments, etc. can use the same context.
    //

    const userId =
        user?.id ??
        user?.userId ??
        user?.studentId ??
        user?.user?.id ??
        null;


    // =========================================================
    // LOGIN
    // =========================================================

    const login = (jwtToken, loggedInUser) => {

        console.log("========== AUTH CONTEXT LOGIN ==========");
        console.log("JWT:", jwtToken);
        console.log("Logged-in user:", loggedInUser);

        setToken(jwtToken || null);
        setUser(loggedInUser || null);

        console.log("User ID:", loggedInUser?.id);
        console.log("User UserID:", loggedInUser?.userId);
        console.log("User StudentID:", loggedInUser?.studentId);

        console.log("========================================");
    };


    // =========================================================
    // LOGOUT
    // =========================================================

    const logout = () => {

        console.log("Logging out...");

        try {
            clearStorage();
        } catch (error) {
            console.error("Error clearing localStorage:", error);
        }

        setToken(null);
        setUser(null);
    };


    // =========================================================
    // REFRESH AUTH FROM LOCAL STORAGE
    // =========================================================

    const refreshAuth = () => {

        try {

            const storedToken = getToken();
            const storedUser = getUser();

            setToken(storedToken || null);
            setUser(storedUser || null);

            console.log("========== AUTH REFRESH ==========");
            console.log("Token:", storedToken);
            console.log("User:", storedUser);
            console.log(
                "User ID:",
                storedUser?.id ??
                storedUser?.userId ??
                storedUser?.studentId ??
                storedUser?.user?.id ??
                null
            );
            console.log("==================================");

        } catch (error) {

            console.error(
                "Failed to refresh authentication:",
                error
            );

            setToken(null);
            setUser(null);
        }
    };


    // =========================================================
    // REFRESH WHEN APPLICATION STARTS
    // =========================================================

    useEffect(() => {

        refreshAuth();

    }, []);


    // =========================================================
    // LISTEN FOR LOCAL STORAGE CHANGES
    // =========================================================
    //
    // Useful when login/logout changes localStorage.
    //

    useEffect(() => {

        const handleStorageChange = () => {
            refreshAuth();
        };

        window.addEventListener(
            "storage",
            handleStorageChange
        );

        return () => {

            window.removeEventListener(
                "storage",
                handleStorageChange
            );

        };

    }, []);


    // =========================================================
    // REFRESH WHEN USER RETURNS TO THE TAB
    // =========================================================

    useEffect(() => {

        const handleFocus = () => {
            refreshAuth();
        };

        window.addEventListener(
            "focus",
            handleFocus
        );

        return () => {

            window.removeEventListener(
                "focus",
                handleFocus
            );

        };

    }, []);


    // =========================================================
    // AUTHENTICATION STATUS
    // =========================================================

    const isAuthenticated = !!token;


    // =========================================================
    // CONTEXT VALUE
    // =========================================================

    const contextValue = {

        // JWT
        token,

        // Logged-in user object
        user,

        // Convenient user ID
        userId,

        // Authentication status
        isAuthenticated,

        // Login
        login,

        // Logout
        logout,

        // Manually refresh user/token
        refreshAuth,
    };


    // =========================================================
    // PROVIDER
    // =========================================================

    return (

        <AuthContext.Provider value={contextValue}>

            {children}

        </AuthContext.Provider>

    );
}


// =============================================================
// USE AUTH HOOK
// =============================================================

export function useAuth() {

    const context = useContext(AuthContext);

    if (!context) {

        throw new Error(
            "useAuth must be used inside an AuthProvider"
        );

    }

    return context;
}

export default AuthContext;