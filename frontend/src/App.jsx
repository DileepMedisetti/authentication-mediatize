import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import ForgotPassword from "./components/ForgotPassword";
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Profile from "./components/Profile";
import ResetPassword from "./components/ResetPassword";

function App() {
    return (
        <BrowserRouter>

            <Routes>

                {/* Default page */}
                <Route
                    path="/"
                    element={<Navigate to="/register" replace />}
                />

                {/* Registration */}
                <Route
                    path="/register"
                    element={<Register />}
                />

                {/* Login */}
                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/forgot-password"
                    element={<ForgotPassword />}
                />

                <Route 
                  path="/profile"
                  element={<Profile />}
                />

                <Route
                    path="/reset-password"
                    element={<ResetPassword />}
                />

            </Routes>

            {/* Toast Notifications */}
            <ToastContainer
                position="top-right"
                autoClose={3000}
                hideProgressBar={false}
                newestOnTop
                closeOnClick
                pauseOnHover
            />

        </BrowserRouter>
    );
}

export default App;