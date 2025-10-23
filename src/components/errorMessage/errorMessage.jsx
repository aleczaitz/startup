import React from 'react';
import './errorMessage.css';


export function ErrorMessage({ message }) {
    return (
        <div className="error-message">
            {message}
        </div>
    );
}
