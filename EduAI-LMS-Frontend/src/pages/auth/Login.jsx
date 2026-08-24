import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

import AuthService from "../../services/AuthService";
import { useAuth } from "../../context/AuthContext";

import "./Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    // =====================================================
    // LOGIN STATE
    // =====================================================

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    // =====================================================
    // OTP STATE
    // =====================================================

    const [otpMode, setOtpMode] = useState(false);
    const [otp, setOtp] = useState("");

    const [otpLoading, setOtpLoading] = useState(false);
    const [resendLoading, setResendLoading] = useState(false);

    // =====================================================
    // ERROR / SUCCESS
    // =====================================================

    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    // =====================================================
    // LOGIN
    // =====================================================

    const handleLogin = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!email.trim()) {
            setError("Please enter your email address.");
            return;
        }

        if (!password) {
            setError("Please enter your password.");
            return;
        }

        try {
            setLoading(true);

            const response = await AuthService.login({
                email: email.trim(),
                password: password,
            });

            const data = response.data;

            console.log("LOGIN RESPONSE:", data);

            // =================================================
            // ADMIN / TEACHER
            // =================================================

            if (data?.otpRequired) {
                setOtpMode(true);

                setSuccess(
                    "A 6-digit verification code has been sent to your email."
                );

                return;
            }

            // =================================================
            // STUDENT / NORMAL LOGIN
            // =================================================

            if (data?.token && data?.user) {
                login(
                    data.token,
                    data.user
                );

                redirectByRole(data.user);

                return;
            }

            throw new Error("Invalid login response.");

        } catch (err) {
            console.error("LOGIN ERROR:", err);

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Authentication failed";

            setError(message);

        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // VERIFY OTP
    // =====================================================

    const handleVerifyOtp = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!otp.trim()) {
            setError("Please enter the verification code.");
            return;
        }

        if (otp.trim().length !== 6) {
            setError("OTP must contain 6 digits.");
            return;
        }

        try {
            setOtpLoading(true);

            const response =
                await AuthService.verifyOtp(
                    email.trim(),
                    otp.trim()
                );

            const data = response.data;

            console.log(
                "OTP VERIFY RESPONSE:",
                data
            );

            // =================================================
            // OTP SUCCESS
            // =================================================

            if (data?.token && data?.user) {
                login(
                    data.token,
                    data.user
                );

                redirectByRole(data.user);

                return;
            }

            throw new Error(
                "OTP verification failed."
            );

        } catch (err) {
            console.error(
                "OTP ERROR:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                err?.message ||
                "Invalid or expired OTP";

            setError(message);

        } finally {
            setOtpLoading(false);
        }
    };

    // =====================================================
    // RESEND OTP
    // =====================================================

    const handleResendOtp = async () => {
        setError("");
        setSuccess("");

        try {
            setResendLoading(true);

            const response =
                await AuthService.resendOtp(
                    email.trim()
                );

            console.log(
                "RESEND OTP RESPONSE:",
                response.data
            );

            setSuccess(
                response?.data?.message ||
                "A new OTP has been sent to your email."
            );

            setOtp("");

        } catch (err) {
            console.error(
                "RESEND OTP ERROR:",
                err
            );

            const message =
                err?.response?.data?.message ||
                err?.response?.data?.error ||
                "Unable to resend OTP.";

            setError(message);

        } finally {
            setResendLoading(false);
        }
    };

    // =====================================================
    // BACK TO LOGIN
    // =====================================================

    const handleBackToLogin = () => {
        setOtpMode(false);
        setOtp("");
        setError("");
        setSuccess("");
    };

    // =====================================================
    // REDIRECT BASED ON ROLE
    // =====================================================

    const redirectByRole = (user) => {
        const role =
            String(user?.role || "")
                .trim()
                .toUpperCase();

        console.log(
            "Redirecting user with role:",
            role
        );

        switch (role) {

            case "ADMIN":
                navigate("/admin/dashboard");
                break;

            case "TEACHER":
                navigate("/teacher/dashboard");
                break;

            case "STUDENT":
                navigate("/student/dashboard");
                break;

            default:
                navigate("/");
        }
    };

    // =====================================================
    // OTP SCREEN
    // =====================================================

    if (otpMode) {
        return (
            <div className="login-page">

                {/* Background decoration */}
                <div className="login-decoration decoration-one"></div>
                <div className="login-decoration decoration-two"></div>

                <div className="login-container">

                    <div className="login-card otp-card">

                        {/* BRAND */}
                        <div className="brand-section">

                            <div className="brand-icon">
                                <img
                                    src="/mains.png"
                                    alt="SUBMYS Logo"
                                    className="brand-logo"
                                />
                            </div>

                            <h1>
                                SUBMYS
                            </h1>

                            <p>
                                Smart Learning Management Platform
                            </p>

                        </div>

                        {/* OTP HEADER */}
                        <div className="form-section">

                            <div className="otp-icon">
                                ✉️
                            </div>

                            <h2>
                                Email Verification
                            </h2>

                            <p className="otp-description">
                                A 6-digit verification code
                                has been sent to
                            </p>

                            <div className="otp-email">
                                {email}
                            </div>

                            {/* ERROR */}
                            {error && (
                                <div className="message error-message">
                                    {error}
                                </div>
                            )}

                            {/* SUCCESS */}
                            {success && (
                                <div className="message success-message">
                                    {success}
                                </div>
                            )}

                            <form
                                onSubmit={handleVerifyOtp}
                                autoComplete="off"
                            >

                                <label htmlFor="otp">
                                    Verification Code
                                </label>

                                <input
                                    id="otp"
                                    name="otp"
                                    type="text"
                                    inputMode="numeric"
                                    maxLength={6}
                                    placeholder="Enter 6-digit code"
                                    value={otp}
                                    onChange={(e) =>
                                        setOtp(
                                            e.target.value.replace(
                                                /\D/g,
                                                ""
                                            )
                                        )
                                    }
                                    className="otp-input"
                                    autoFocus
                                    autoComplete="one-time-code"
                                />

                                <button
                                    type="submit"
                                    className="login-button"
                                    disabled={otpLoading}
                                >
                                    {otpLoading
                                        ? "Verifying..."
                                        : "Verify OTP"}
                                </button>

                            </form>

                            <button
                                type="button"
                                className="resend-button"
                                onClick={handleResendOtp}
                                disabled={resendLoading}
                            >
                                {resendLoading
                                    ? "Sending..."
                                    : "Resend OTP"}
                            </button>

                            <button
                                type="button"
                                className="back-login-button"
                                onClick={handleBackToLogin}
                            >
                                ← Back to Login
                            </button>

                        </div>

                        <div className="login-footer">
                            <p>
                                © 2026 SUBMYS
                            </p>

                            <span>
                                Secure • Simple • Smart Learning
                            </span>
                        </div>

                    </div>

                </div>

            </div>
        );
    }

    // =====================================================
    // LOGIN SCREEN
    // =====================================================

    return (
        <div className="login-page">

            {/* Background decoration */}
            <div className="login-decoration decoration-one"></div>
            <div className="login-decoration decoration-two"></div>

            <div className="login-container">

                <div className="login-card">

                    {/* =================================================
                        BRAND
                    ================================================= */}

                    <div className="brand-section">

                        <div className="brand-icon">
                            <img
                                src="/mains.png"
                                alt="SUBMYS Logo"
                                className="brand-logo"
                            />
                        </div>

                        <h1>
                            SUBMYS
                        </h1>

                        <p>
                            Smart Learning Management Platform
                        </p>

                    </div>

                    {/* =================================================
                        LOGIN CONTENT
                    ================================================= */}

                    <div className="form-section">

                        <h2>
                            Welcome back
                        </h2>

                        <p className="login-subtitle">
                            Sign in to continue to SUBMYS
                        </p>

                        {/* ERROR */}

                        {error && (
                            <div className="message error-message">
                                {error}
                            </div>
                        )}

                        {/* SUCCESS */}

                        {success && (
                            <div className="message success-message">
                                {success}
                            </div>
                        )}

                        <form
                            onSubmit={handleLogin}
                            autoComplete="off"
                        >

                            {/* EMAIL */}

                            <div className="form-group">

                                <label htmlFor="email">
                                    Email Address
                                </label>

                                <div className="input-wrapper">

                                 

                                    <input
                                        id="email"
                                        name="login-email"
                                        type="email"
                                        placeholder="Enter your email"
                                        value={email}
                                        onChange={(e) =>
                                            setEmail(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="off"
                                    />

                                </div>

                            </div>

                            {/* PASSWORD */}

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="input-wrapper">

                                 

                                    <input
                                        id="password"
                                        name="login-password"
                                        type="password"
                                        placeholder="Enter your password"
                                        value={password}
                                        onChange={(e) =>
                                            setPassword(
                                                e.target.value
                                            )
                                        }
                                        autoComplete="new-password"
                                    />

                                </div>

                            </div>

                            {/* LOGIN BUTTON */}

                            <button
                                type="submit"
                                className="login-button"
                                disabled={loading}
                            >

                                {loading ? (
                                    <>
                                        <span className="spinner"></span>
                                        Signing in...
                                    </>
                                ) : (
                                    <>
                                        Sign In

                                        <span className="button-arrow">
                                            →
                                        </span>
                                    </>
                                )}

                            </button>

                        </form>

                        {/* INFORMATION */}

                    </div>

                    {/* =================================================
                        FOOTER
                    ================================================= */}

                    <div className="login-footer">

                        <p>
                            © 2026 SUBMYS
                        </p>

                        <span>
                            Secure • Simple • Smart Learning
                        </span>

                    </div>

                </div>

            </div>

        </div>
    );
}

export default Login;