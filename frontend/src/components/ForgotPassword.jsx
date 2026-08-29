import { useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { Link } from "react-router-dom";
import "./../css/ForgotPassword.css";

function ForgotPassword() {

    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {

        e.preventDefault();

        toast.dismiss();

        if (!email.trim()) {
            toast.error("Please enter your email address");
            return;
        }

        setLoading(true);

        try {

            const response = await axios.post(
                "https://authentication-mediatize.onrender.com/forgot-password",
                {
                    email: email
                }
            );

            toast.success(
                response.data.message ||
                "Password reset link has been sent to your email"
            );

            setEmail("");

        } catch (error) {

            console.error(error);

            if (error.response) {

                toast.error(
                    error.response.data.detail ||
                    "Unable to send reset link"
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

        <div className="forgot-password-page">

            <div className="forgot-password-card">

                {/* Header */}

                <div className="forgot-password-header">

                    <h2>Forgot Password?</h2>

                    <p>
                        Enter your registered email address
                        and we'll send you a password reset link.
                    </p>

                </div>


                {/* Form */}

                <form
                    className="forgot-password-form"
                    onSubmit={handleSubmit}
                >

                    <div className="forgot-form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(e) =>
                                setEmail(e.target.value)
                            }
                            required
                        />

                    </div>


                    <button
                        type="submit"
                        className="forgot-password-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Sending..."
                            : "Send Reset Link"
                        }

                    </button>

                </form>


                {/* Back to Login */}

                <div className="back-to-login">

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

export default ForgotPassword;