import { useState } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";

import api from "../api/axios";
import "../css/Login.css";


function Login() {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        email: "",
        department: "",
        password: ""
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


    // Handle login
    const handleSubmit = async (e) => {

        e.preventDefault();

        toast.dismiss();

        setLoading(true);

        try {

            // Send login request to FastAPI
            const response = await api.post(
                "/login",
                {
                    email: formData.email,
                    department: formData.department,
                    password: formData.password
                }
            );

            const data = response.data;


            // Store JWT access token
            localStorage.setItem(
                "access_token",
                data.access_token
            );


            // Store token type
            localStorage.setItem(
                "token_type",
                data.token_type
            );


            // Store basic user information
            localStorage.setItem(
                "user",
                JSON.stringify({
                    user_id: data.user_id,
                    name: data.name,
                    email: data.email,
                    department: data.department
                })
            );


            // Success message
            toast.success(
                data.message || "Login successful!"
            );


            // Clear form
            setFormData({
                email: "",
                department: "",
                password: ""
            });


            // Navigate to profile
            setTimeout(() => {
                navigate("/profile");
            }, 800);


        } catch (error) {

            console.error("Login error:", error);


            // Backend error
            if (error.response) {

                toast.error(
                    error.response.data.detail ||
                    "Login failed"
                );

            } else {

                // Network/server error
                toast.error(
                    "Unable to connect to the server"
                );
            }


        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="login-page">

            <div className="login-card">


                {/* Header */}

                <div className="login-header">

                    <h2>Welcome Back</h2>

                    <p>
                        Login to access your account
                    </p>

                </div>


                {/* Login Form */}

                <form
                    className="login-form"
                    onSubmit={handleSubmit}
                >


                    {/* Email */}

                    <div className="login-form-group">

                        <label htmlFor="email">
                            Email Address
                        </label>

                        <input
                            id="email"
                            type="email"
                            name="email"
                            placeholder="Enter your email"
                            value={formData.email}
                            onChange={handleChange}
                            autoComplete="email"
                            required
                        />

                    </div>


                    {/* Department */}

                    <div className="login-form-group">

                        <label htmlFor="department">
                            Department
                        </label>

                        <select
                            id="department"
                            name="department"
                            value={formData.department}
                            onChange={handleChange}
                            required
                        >

                            <option value="">
                                Select Department
                            </option>

                            <option value="development">
                                Development
                            </option>

                            <option value="sales">
                                Sales
                            </option>

                            <option value="hr">
                                HR
                            </option>

                            <option value="manager">
                                Manager
                            </option>

                            <option value="intern">
                                Intern
                            </option>

                        </select>

                    </div>


                    {/* Password */}

                    <div className="login-form-group">

                        <label htmlFor="password">
                            Password
                        </label>

                        <input
                            id="password"
                            type="password"
                            name="password"
                            placeholder="Enter your password"
                            value={formData.password}
                            onChange={handleChange}
                            autoComplete="current-password"
                            required
                        />

                    </div>


                    {/* Forgot Password */}

                    <div className="forgot-password">

                        <Link to="/forgot-password">
                            Forgot Password?
                        </Link>

                    </div>


                    {/* Login Button */}

                    <button
                        type="submit"
                        className="login-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Logging in..."
                            : "Login"
                        }

                    </button>

                </form>


                {/* Register Link */}

                <div className="register-link">

                    <span>
                        Don't have an account?
                    </span>

                    <Link to="/register">
                        Register
                    </Link>

                </div>


            </div>

        </div>
    );
}


export default Login;