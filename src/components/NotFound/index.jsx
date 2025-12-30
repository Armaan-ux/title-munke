import React from 'react';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
    const navigate = useNavigate();

    return (
        <div className="flex flex-col items-center justify-center min-h-[80vh] bg-background px-6 text-center">
            <h1 className="text-9xl font-pt-serif font-bold text-primary mb-2">404</h1>
            <h2 className="text-3xl md:text-4xl font-pt-serif font-bold text-secondary mb-4">Page Not Found</h2>
            <p className="text-base md:text-lg text-muted-foreground mb-8 max-w-lg font-poppins leading-relaxed">
                Sorry, the page you are trying to access does not exist or you do not have permission to view it.
            </p>
            <button 
                onClick={() => navigate('/')}
                className="bg-primary hover:bg-coffee-light text-white font-poppins font-medium py-3 px-8 rounded-lg transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-0.5"
            >
                Return Home
            </button>
        </div>
    );
};

export default NotFound;
