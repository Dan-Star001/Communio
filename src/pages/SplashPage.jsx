import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import logo from '../assets/logo.png';
import backgroundImage from '../assets/bgImage.jpg';
import { Loader2 } from 'lucide-react';

const SplashPage = () => {
    const navigate = useNavigate();
    const [showSplash, setShowSplash] = useState(true);

    useEffect(() => {
        // ✅ SHOW SPLASH FOR 3 SECONDS
        const timer = setTimeout(() => {
            setShowSplash(false);
            // ✅ REDIRECT TO HOME
            navigate('/home');
        }, 3000);

        return () => clearTimeout(timer);
    }, [navigate]);

    if (!showSplash) return null;

    return (
        <div 
            className="fixed inset-0 bg-cover bg-fixed bg-center flex items-center justify-center p-4 z-[9999]" 
            style={{ backgroundImage: `url(${backgroundImage})` }}
        >
            {/* DARK OVERLAY */}
            <div className="absolute inset-0 bg-[rgba(0,0,0,0.7)] z-0"></div>
            
            {/* SPLASH CONTENT */}
            <div className="w-full max-w-md relative z-10 text-center">
                {/* LOGO */}
                <div className="mb-8">
                    <img src={logo} width={200} alt="Communio" className="mx-auto" />
                </div>

                {/* WELCOME TEXT */}
                <h1 className="text-3xl font-bold text-white mb-4 animate-pulse">
                    Welcome Back!
                </h1>
                <p className="text-white/80 text-lg mb-8">
                    Loading your feed...
                </p>

                {/* ANIMATED LOADER */}
                <div className="flex flex-col items-center gap-4">
                    <div className="relative">
                        <div className="animate-spin rounded-full h-16 w-16 border-4 border-white/20 border-t-white mx-auto"></div>
                        <Loader2 className="absolute inset-0 w-16 h-16 text-primary animate-spin" />
                    </div>
                    <p className="text-white/70 text-sm">3</p>
                </div>

                {/* PROGRESS BAR */}
                <div className="w-full bg-white/10 rounded-full h-2 mt-6">
                    <div 
                        className="bg-gradient-to-r from-primary to-blue-500 h-2 rounded-full transition-all duration-1000"
                        style={{ width: '100%' }}
                    ></div>
                </div>
            </div>
        </div>
    );
};

export default SplashPage;