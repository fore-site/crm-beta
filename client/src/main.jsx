import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './app.jsx';

// This is the entry point where the React application is attached to the DOM.
ReactDOM.createRoot(document.getElementById('root')).render(
    // React.StrictMode is a development tool that helps find potential problems.
    // It checks for deprecated lifecycles and other issues.
    <React.StrictMode>
        {/* The main App component is rendered here. */}
        <App />
    </React.StrictMode>
);
