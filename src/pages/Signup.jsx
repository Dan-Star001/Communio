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

const Signup = () => {
    const navigate = useNavigate();
    const [isLoading, setIsLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);

    const formik = useFormik({
        initialValues: {
            userName: '',
            fullName: '',
            email: '',
            password: ''
        },
        onSubmit: (values) => {  // ✅ NO 'async' - PROMISE STYLE
            setIsLoading(true);

            axios.post("http://localhost:1709/api/users/signup", values)
                .then((response) => {
                    if (response.data.success) {
                        navigate("/signin");
                    }
                })
                .catch((error) => {
                    // 4e5 FIXED: HANDLE YOUR EXACT ERROR FORMAT!
                    if (error.response?.status === 400 && error.response.data.message) {
                        // Map message to specific field
                        if (error.response.data.message.includes('Username')) {
                            formik.setErrors({ userName: error.response.data.message });
                        } else if (error.response.data.message.includes('Email')) {
                            formik.setErrors({ email: error.response.data.message });
                        } else {
                            formik.setErrors({ userName: error.response.data.message });
                        }
                        // 4e5 CRITICAL: SET TOUCHED!
                        formik.setTouched({
                            userName: true,
                            fullName: true,
                            email: true,
                            password: true
                        });
                        return
                    }
                })
                .finally(() => {
                    setIsLoading(false);
                });
        },
        validationSchema: yup.object({
            userName: yup.string().required("Username is Required"),
            fullName: yup.string().required("Full Name is Required"),
            email: yup.string().email("Email must be valid").required("Email is required"),
            password: yup.string()
                .required("Password is required")
                .min(6, "Password must be at least 6 characters")
                .matches(/[!@#$%^&*(),.?":{}|<>]/, "Password must contain special character")
                .matches(/^(?=.*[A-Za-z])(?=.*\d)/, "Password must contain letters and numbers")
        })
    });

    const [isFloated, setIsFloated] = useState({
        fullName: false,
        userName: false,
        email: false,
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
            fullName: !!formik.values.fullName,
            userName: !!formik.values.userName,
            email: !!formik.values.email,
            password: !!formik.values.password
        };
        setIsFloated(newIsFloated);
    }, [formik.values]);

    return (
        <>
            <div className="fixed inset-0 bg-cover bg-fixed bg-center flex items-center justify-center p-4 z-[-1]" 
                style={{ backgroundImage: `url(${backgroundImage})` }}>
                <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] z-0"></div>
                <div className="w-full max-w-md relative z-10">
                    <div className="bg-card rounded-2xl shadow-2xl px-8 py-6 !text-left">
                        <div className="text-center mb-8">
                            <div className="flex justify-center mb-8">
                                <img src={logo} width={200} alt="Logo" />
                            </div>                            
                            <h1 className="text-xl font-bold text-foreground mb-2">
                                Sign Up to have an account
                            </h1>
                        </div>

                        <form onSubmit={formik.handleSubmit} className="space-y-4">
                            {/* FULLNAME */}
                            <div>
                                <div className="relative">
                                    <Input
                                        id="fullName"
                                        type="text"
                                        name="fullName"
                                        value={formik.values.fullName}
                                        onChange={formik.handleChange}
                                        onFocus={() => handleFocus('fullName')}
                                        onBlur={(e) => { formik.handleBlur(e); handleBlur('fullName'); }}
                                        placeholder=" "
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="fullName" floated={isFloated.fullName}>
                                        Fullname
                                    </Label>
                                </div>
                                {formik.touched.fullName && formik.errors.fullName && (
                                    <p className="text-red-400 text-xs mt-1">{formik.errors.fullName}</p>
                                )}
                            </div>

                            {/* USERNAME */}
                            <div>
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
                                </div>
                                {formik.touched.userName && formik.errors.userName && (
                                    <p className="text-red-400 text-xs mt-1">{formik.errors.userName}</p>
                                )}
                            </div>

                            {/* EMAIL */}
                            <div>
                                <div className="relative">
                                    <Input
                                        id="email"
                                        type="email"
                                        name="email"
                                        value={formik.values.email}
                                        onChange={formik.handleChange}
                                        onFocus={() => handleFocus('email')}
                                        onBlur={(e) => { formik.handleBlur(e); handleBlur('email'); }}
                                        placeholder=" "
                                        disabled={isLoading}
                                    />
                                    <Label htmlFor="email" floated={isFloated.email}>
                                        Email
                                    </Label>
                                </div>
                                {formik.touched.email && formik.errors.email && (
                                    <p className="text-red-400 text-xs mt-1">{formik.errors.email}</p>
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

                            <Button 
                                type="submit" 
                                disabled={isLoading || !formik.isValid} 
                                className="w-full h-11 text-base font-medium bg-primary my-4 hover:bg-[#4169e1] text-primary-foreground disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                            >
                                {isLoading ? (
                                    <>
                                        <Loader2 className="w-4 h-4 animate-spin" />
                                        Signing up...
                                    </>
                                ) : (
                                    'Sign Up'
                                )}
                            </Button>
                        </form>

                        <p className="text-center text-sm text-muted-foreground mt-6">
                            Already have an account?{' '}
                            <Link to="/signin" className="font-medium text-link hover:text-link-hover">
                                Sign in
                            </Link>
                        </p>
                    </div>
                </div>
            </div>
        </>
    );
};

export default Signup;