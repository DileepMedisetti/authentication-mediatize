import { useState } from "react";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";

import api from "../api/axios";
import "../css/Registration.css";


function Register() {

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        contact: "",
        department: "",
        password: "",
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


    // Handle registration
    const handleSubmit = async (e) => {

        e.preventDefault();

        toast.dismiss();


        // Password validation
        if (formData.password !== formData.confirmPassword) {

            toast.error("Passwords do not match");

            return;
        }


        if (formData.password.length < 6) {

            toast.error(
                "Password must be at least 6 characters"
            );

            return;
        }


        setLoading(true);


        try {

            const response = await api.post(
                "/register",
                {
                    name: formData.name,
                    email: formData.email,
                    contact: formData.contact,
                    department: formData.department,
                    password: formData.password
                }
            );


            toast.success(
                response.data.message ||
                "Registration successful!"
            );


            // Clear form
            setFormData({
                name: "",
                email: "",
                contact: "",
                department: "",
                password: "",
                confirmPassword: ""
            });


        } catch (error) {

            console.error("Registration error:", error);


            if (error.response) {

                toast.error(
                    error.response.data.detail ||
                    "Registration failed"
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

        <div className="registration-page">

            <div className="registration-card">


                {/* Header */}

                <div className="registration-header">

                    <h2>Create Account</h2>

                    <p>
                        Register to access your account
                    </p>

                </div>


                {/* Registration Form */}

                <form
                    className="registration-form"
                    onSubmit={handleSubmit}
                >


                    {/* Name */}

                    <div className="form-group">

                        <label htmlFor="name">
                            Full Name
                        </label>

                        <input
                            id="name"
                            type="text"
                            name="name"
                            placeholder="Enter your full name"
                            value={formData.name}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Email */}

                    <div className="form-group">

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
                            required
                        />

                    </div>


                    {/* Contact */}

                    <div className="form-group">

                        <label htmlFor="contact">
                            Contact Number
                        </label>

                        <input
                            id="contact"
                            type="tel"
                            name="contact"
                            placeholder="Enter your contact number"
                            value={formData.contact}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Department */}

                    <div className="form-group">

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

                    <div className="form-group">

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
                            required
                        />

                    </div>


                    {/* Confirm Password */}

                    <div className="form-group">

                        <label htmlFor="confirmPassword">
                            Confirm Password
                        </label>

                        <input
                            id="confirmPassword"
                            type="password"
                            name="confirmPassword"
                            placeholder="Confirm your password"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                        />

                    </div>


                    {/* Register Button */}

                    <button
                        type="submit"
                        className="register-button"
                        disabled={loading}
                    >

                        {loading
                            ? "Creating Account..."
                            : "Create Account"
                        }

                    </button>

                </form>


                {/* Login Link */}

                <div className="login-link">

                    <span>
                        Already have an account?
                    </span>

                    <Link to="/login">
                        Login
                    </Link>

                </div>


            </div>

        </div>
    );
}


export default Register;