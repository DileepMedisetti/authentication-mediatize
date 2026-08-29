import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate, useSearchParams } from "react-router-dom";

import api from "../api/axios";
import "../css/ResetPassword.css";


function ResetPassword() {

    const navigate = useNavigate();

    // Get token from URL
    const [searchParams] = useSearchParams();

    const token = searchParams.get("token");


    const [formData, setFormData] = useState({
        newPassword: "",
        confirmPassword: ""
    });

    const [loading, setLoading] = useState(false);


    // Handle input changes
    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value
        }));
    };


    // Handle reset password
    const handleSubmit = async (e) => {

        e.preventDefault();

        toast.dismiss();


        // Check token
        if (!token) {

            toast.error(
                "Invalid password reset link"
            );

            return;
        }


        // Check password match
        if (
            formData.newPassword !==
            formData.confirmPassword
        ) {

            toast.error(
                "Passwords do not match"
            );

            return;
        }


        // Check password length
        if (formData.newPassword.length < 6) {

            toast.error(
                "Password must be at least 6 characters"
            );

            return;
        }


        setLoading(true);


        try {

            const response = await api.post(
                "/reset-password",
                {
                    token: token,
                    new_password: formData.newPassword
                }
            );


            toast.success(
                response.data.message ||
                "Password reset successfully!"
            );


            // Clear form
            setFormData({
                newPassword: "",
                confirmPassword: ""
            });


            // Go to login
            setTimeout(() => {

                navigate("/login");

            }, 1500);


        } catch (error) {

            console.error(
                "Reset password error:",
                error
            );


            if (error.response) {

                toast.error(
                    error.response.data.detail ||
                    "Unable to reset password"
                );

            } else {

                toast.error(
                    "Unable to connect to the server"
                );
            }


        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="reset-password-page">

            <div className="reset-password-card">


                {/* Header */}

                <div className="reset-password-header">

                    <h2>Reset Password</h2>

                    <p>
                        Create a new password for your account
                    </p>

                </div>


                {/* Invalid Token */}

                {!token ? (

                    <div className="invalid-token">

                        <p>
                            This password reset link is
                            invalid or incomplete.
                        </p>

                        <Link to="/forgot-password">
                            Request a new link
                        </Link>

                    </div>

                ) : (

                    /* Reset Password Form */

                    <form
                        className="reset-password-form"
                        onSubmit={handleSubmit}
                    >


                        {/* New Password */}

                        <div className="reset-form-group">

                            <label htmlFor="newPassword">
                                New Password
                            </label>

                            <input
                                id="newPassword"
                                type="password"
                                name="newPassword"
                                placeholder="Enter new password"
                                value={
                                    formData.newPassword
                                }
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />

                        </div>


                        {/* Confirm Password */}

                        <div className="reset-form-group">

                            <label htmlFor="confirmPassword">
                                Confirm New Password
                            </label>

                            <input
                                id="confirmPassword"
                                type="password"
                                name="confirmPassword"
                                placeholder="Confirm new password"
                                value={
                                    formData.confirmPassword
                                }
                                onChange={handleChange}
                                autoComplete="new-password"
                                required
                            />

                        </div>


                        {/* Reset Button */}

                        <button
                            type="submit"
                            className="reset-password-button"
                            disabled={loading}
                        >

                            {loading
                                ? "Resetting Password..."
                                : "Reset Password"
                            }

                        </button>

                    </form>
                )}


                {/* Login Link */}

                <div className="reset-login-link">

                    <span>
                        Remember your password?
                    </span>

                    <Link to="/login">
                        Login
                    </Link>

                </div>


            </div>

        </div>
    );
}


export default ResetPassword;