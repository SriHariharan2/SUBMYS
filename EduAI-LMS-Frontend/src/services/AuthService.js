import api from "../api/axiosConfig";

import {
    saveToken,
    saveUser,
    removeToken,
    removeUser,
} from "../utils/localStorage";


// =====================================================
// LOGIN
// =====================================================

const login = async (loginData) => {

    const response = await api.post(
        "/auth/login",
        loginData
    );

    console.log(
        "LOGIN RESPONSE:",
        response.data
    );


    const data = response.data;


    // =================================================
    // SAVE JWT ONLY IF AVAILABLE
    // =================================================

    if (data?.token) {

        saveToken(data.token);

        console.log(
            "JWT saved successfully"
        );
    }


    // =================================================
    // SAVE USER
    // =================================================

    if (data?.user) {

        saveUser(data.user);
    }


    return response;
};


// =====================================================
// VERIFY OTP
// =====================================================

const verifyOtp = async (
    email,
    otp
) => {

    const response = await api.post(
        "/auth/verify-otp",
        null,
        {
            params: {
                email,
                otp,
            },
        }
    );


    console.log(
        "OTP VERIFY RESPONSE:",
        response.data
    );


    const data =
        response.data;


    if (data?.token) {

        saveToken(
            data.token
        );
    }


    if (data?.user) {

        saveUser(
            data.user
        );
    }


    return response;
};


// =====================================================
// RESEND OTP
// =====================================================

const resendOtp = async (
    email
) => {

    return api.post(
        "/auth/resend-otp",
        null,
        {
            params: {
                email,
            },
        }
    );
};


// =====================================================
// LOGOUT
// =====================================================

const logout = () => {

    removeToken();

    removeUser();
};


// =====================================================
// GET CURRENT USER
// =====================================================

const getCurrentUser = () => {

    const userString =
        localStorage.getItem("user");


    if (!userString) {

        return null;
    }


    try {

        return JSON.parse(
            userString
        );

    } catch (error) {

        console.error(
            "Invalid user data:",
            error
        );

        return null;
    }
};


// =====================================================
// GET TOKEN
// =====================================================

const getTokenFromStorage = () => {

    return localStorage.getItem(
        "jwtToken"
    );
};


// =====================================================
// EXPORT
// =====================================================

const AuthService = {

    login,

    verifyOtp,

    resendOtp,

    logout,

    getCurrentUser,

    getToken: getTokenFromStorage,
};


export default AuthService;