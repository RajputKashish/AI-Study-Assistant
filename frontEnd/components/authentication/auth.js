import { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { loginUser, registerUser } from "../../store/slices/authSlice.js";
import "./auth.css";

export default function Auth() {
    const [isLogin, setIsLogin] = useState(true);
    const [form, setForm] = useState({ name: "", email: "", password: "" });
    const [errors, setErrors] = useState({});
    const dispatch = useDispatch();
    const { loading, error } = useSelector((state) => state.auth);

    const validateField = (field, value) => {
        let errorMsg = "";

        if (field === "name" && !isLogin) {
            if (!value.trim()) errorMsg = "Full name is required.";
            else if (value.trim().length < 2) errorMsg = "Full name must be at least 2 characters.";
        }

        if (field === "email") {
            if (!value) errorMsg = "Email is required.";
            else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) errorMsg = "Invalid email format.";
        }

        if (field === "password") {
            if (!value) errorMsg = "Password is required.";
            else if (value.length < 6) errorMsg = "Password must be at least 6 characters.";
        }

        setErrors((prev) => ({ ...prev, [field]: errorMsg }));
    };

    const handleChange = (field, value) => {
        setForm((prev) => ({ ...prev, [field]: value }));
        validateField(field, value);
    };

    const validateForm = () => {
        const fields = ["email", "password"];
        if (!isLogin) fields.unshift("name");
        fields.forEach((f) => validateField(f, form[f]));
        return Object.values(errors).every((err) => !err) &&
            fields.every((f) => form[f]);
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        if (!validateForm()) return;

        if (isLogin) {
            dispatch(loginUser({ email: form.email, password: form.password }));
        } else {
            dispatch(registerUser(form));
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card">
                <div className="auth-header">
                    <h2 className="auth-title">AI Study Assistant</h2>
                    <p className="auth-subtitle">{isLogin ? "Welcome back!" : "Create your account"}</p>
                </div>

                <form className="auth-form" onSubmit={handleSubmit}>
                    {!isLogin && (
                        <div className="input-group">
                            <label htmlFor="name">Full Name</label>
                            <input
                                id="name"
                                type="text"
                                placeholder="Enter your full name"
                                value={form.name}
                                onChange={(e) => handleChange("name", e.target.value)}
                            />
                            {errors.name && <p className="error-text">{errors.name}</p>}
                        </div>
                    )}

                    <div className="input-group">
                        <label htmlFor="email">Email Address</label>
                        <input
                            id="email"
                            type="email"
                            placeholder="Enter your email"
                            value={form.email}
                            onChange={(e) => handleChange("email", e.target.value)}
                        />
                        {errors.email && <p className="error-text">{errors.email}</p>}
                    </div>

                    <div className="input-group">
                        <label htmlFor="password">Password</label>
                        <input
                            id="password"
                            type="password"
                            placeholder="Enter your password"
                            value={form.password}
                            onChange={(e) => handleChange("password", e.target.value)}
                        />
                        {errors.password && <p className="error-text">{errors.password}</p>}
                    </div>

                    <button type="submit" className="auth-submit-btn" disabled={loading}>
                        {loading ? <span className="loading-spinner"></span> : isLogin ? "Sign In" : "Create Account"}
                    </button>
                </form>

                {error && <p className="error-text">{error}</p>}

                <div className="auth-switch">
                    <p onClick={() => { setIsLogin(!isLogin); setErrors({}) }} className="switch-text">
                        {isLogin ? "Don't have an account? Sign up" : "Already have an account? Sign in"}
                    </p>
                </div>
            </div>
        </div>
    );
}
