import { useEffect, useState } from "react";
import { toast } from "react-toastify";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import "./../css/Profile.css";

function Profile() {

    const navigate = useNavigate();

    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {

        const fetchProfile = async () => {

            const token = localStorage.getItem("access_token");

            // No token
            if (!token) {
                toast.error("Please login first");
                navigate("/login");
                return;
            }

            try {

                const response = await axios.get(
                    "https://authentication-mediatize.onrender.com/profile",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                setUser(response.data);

            } catch (error) {

                console.error(error);

                if (error.response?.status === 401) {

                    toast.error(
                        "Session expired. Please login again."
                    );

                    localStorage.removeItem("access_token");
                    localStorage.removeItem("token_type");
                    localStorage.removeItem("user");

                    navigate("/login");

                } else {

                    toast.error(
                        error.response?.data?.detail ||
                        "Unable to load profile"
                    );
                }

            } finally {

                setLoading(false);

            }
        };

        fetchProfile();

    }, [navigate]);


    // Logout
    const handleLogout = () => {

        localStorage.removeItem("access_token");
        localStorage.removeItem("token_type");
        localStorage.removeItem("user");

        toast.success("Logged out successfully");

        setTimeout(() => {
            navigate("/login");
        }, 500);
    };


    // Loading
    if (loading) {

        return (
            <div className="profile-page">

                <div className="profile-card">

                    <p className="profile-loading">
                        Loading profile...
                    </p>

                </div>

            </div>
        );
    }


    // Profile
    return (

        <div className="profile-page">

            <div className="profile-card">

                <div className="profile-header">

                    <div className="profile-avatar">
                        {user?.name?.charAt(0).toUpperCase()}
                    </div>

                    <h2>
                        Welcome, {user?.name}
                    </h2>

                    <p>
                        Your Profile
                    </p>

                </div>


                <div className="profile-details">

                    <div className="profile-item">

                        <span className="profile-label">
                            User ID
                        </span>

                        <span className="profile-value">
                            {user?.user_id}
                        </span>

                    </div>


                    <div className="profile-item">

                        <span className="profile-label">
                            Name
                        </span>

                        <span className="profile-value">
                            {user?.name}
                        </span>

                    </div>


                    <div className="profile-item">

                        <span className="profile-label">
                            Email
                        </span>

                        <span className="profile-value">
                            {user?.email}
                        </span>

                    </div>


                    <div className="profile-item">

                        <span className="profile-label">
                            Contact
                        </span>

                        <span className="profile-value">
                            {user?.contact}
                        </span>

                    </div>


                    <div className="profile-item">

                        <span className="profile-label">
                            Department
                        </span>

                        <span className="profile-value department">
                            {user?.department}
                        </span>

                    </div>

                </div>


                <button
                    className="logout-button"
                    onClick={handleLogout}
                >
                    Logout
                </button>

            </div>

        </div>
    );
}

export default Profile;