import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Button from "../components/Button";
import Input from "../components/Input";
import Label from "../components/Label";
import logo from "../assets/logo.png";
import backgroundImage from "../assets/bgImage.jpg";
import { Eye, EyeOff, Loader2 } from "lucide-react";
import { useFormik } from 'formik';
import * as yup from 'yup';
import axios from "axios";

const Signin = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            userName: '',
            password: ''
        },
        onSubmit: (values) => {
            setIsLoading(true);

            axios.post("https://backend-e54z.onrender.com/api/users/signin", values, { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` } })
                .then((res) => {                    
                    if (res.data.success && res.data.message === "Login Successful") {
                        const { token, user } = res.data;
                        
                        // ✅ CRITICAL FIX: Store data correctly
                        localStorage.setItem('token', token);
                        localStorage.setItem('user', JSON.stringify(user));
                        localStorage.setItem('userId', user._id || user.id);
                        ;

                        // ✅ REDIRECT TO SPLASH/DASHBOARD
                        navigate("/splash");
                    } else {
                        alert(res.data.message || "Invalid credentials");
                        setIsLoading(false);
                    }
                })
                .catch((err) => {
                    
                    const errorMessage = err.response?.data?.message || "Login failed. Please check your username or password.";
                    alert(errorMessage);
                    
                    setIsLoading(false);

                    if (err.response?.status === 400 && err.response.data.errors) {
                        formik.setErrors(err.response.data.errors);
                        formik.setTouched({
                            userName: true,
                            password: true
                        });
                    }
                });
        },
        validationSchema: yup.object({
            userName: yup.string().required("Username is required"),
            password: yup.string().required("Password is required").min(6, "Password must be at least 6 characters")
        })
    });

    const [isFloated, setIsFloated] = useState({
        userName: false,
        password: false
    });

    const handleFocus = (fieldName) => {
        setIsFloated(prev => ({ ...prev, [fieldName]: true }));
    };

    const handleBlur = (fieldName) => {
        if (!formik.values[fieldName]) {
            setIsFloated(prev => ({ ...prev, [fieldName]: false }));
        }
    };

    useEffect(() => {
        const newIsFloated = {
            userName: !!formik.values.userName,
            password: !!formik.values.password
        };
        setIsFloated(newIsFloated);
    }, [formik.values]);

    return (
        <>
            <div 
                className="fixed inset-0 bg-cover bg-fixed bg-center flex items-center justify-center p-4 z-[-1]" 
                style={{ backgroundImage: `url(${backgroundImage})` }}
            >
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] z-0"></div>
                <div className="w-full max-w-md relative z-10">
                    <div className="bg-card rounded-2xl shadow-2xl px-8 py-6 !text-left">
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-8">
                                <img src={logo} width={200} alt="Logo" />
                            </div>
                            <h1 className="text-xl font-bold text-foreground mb-2">
                                Sign In to your account
                            </h1>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            {/* USERNAME */}
                            <div className="relative">
                                <Input
                                    id="userName"
                                    type="text"
                                    name="userName"
                                    value={formik.values.userName}
                                    onChange={formik.handleChange}
                                    onFocus={() => handleFocus('userName')}
                                    onBlur={(e) => { formik.handleBlur(e); handleBlur('userName'); }}
                                    placeholder=" "
                                    disabled={isLoading}
                                />
                                <Label htmlFor="userName" floated={isFloated.userName}>
                                    Username
                                </Label>
                                {formik.touched.userName && formik.errors.userName && (
                                    <p className="text-red-400 text-xs mt-1">{formik.errors.userName}</p>
                                )}
                            </div>

                            {/* PASSWORD */}
                            <div className="relative">
                                <div className="relative">
                                    <Input
                                        id="password"
                                        type={showPassword ? "text" : "password"}
                                        name="password"
                                        value={formik.values.password}
                                        onChange={formik.handleChange}
                                        onFocus={() => handleFocus('password')}
                                        onBlur={(e) => { formik.handleBlur(e); handleBlur('password'); }}
                                        placeholder=" "
                                        className="pr-10"
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="password" floated={isFloated.password}>
                                        Password
                                    </Label>
                                    <button
                                        type="button"
                                        onClick={() => !isLoading && setShowPassword(!showPassword)}
                                        disabled={isLoading}
                                        className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors disabled:opacity-50"
                                    >
                                        {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                                    </button>
                                </div>
                                {formik.touched.password && formik.errors.password && (
                                    <p className="text-red-400 text-xs mt-1">{formik.errors.password}</p>
                                )}
                            </div>

                            {/* LOGIN BUTTON */}
                            <Button 
                                type="submit" 
                                disabled={isLoading || !formik.isValid} 
                                className="w-full h-11 text-base font-medium bg-primary my-4 hover:bg-[#4169e1] text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing in...
                                    </>
                                ) : (
                                    'Sign In'
                                )}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Don't have an account?{' '}
                            <Link to="/" className="font-medium text-link hover:text-link-hover">
                                Sign up
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signin;