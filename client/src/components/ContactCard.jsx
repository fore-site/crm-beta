import React, { useState, useRef, useEffect } from 'react';
import { Clock, Mail, Phone, ClipboardList } from 'lucide-react';

// Reusable Contact Card component (extracted from app.jsx)
export default function ContactCard({ contact, onClick }) {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const menuRef = useRef(null);

    // Determine last contact status for display
    const lastContactDisplay = contact.lastContactDate
        ? `Last Contact: ${new Date(
              contact.lastContactDate
          ).toLocaleDateString()}`
        : 'No campaign yet';

    const contactTextColor = contact.lastContactDate
        ? 'text-gray-500'
        : 'text-accent-500 font-semibold';

    // Simple click-outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (menuRef.current && !menuRef.current.contains(event.target)) {
                setIsMenuOpen(false);
            }
        };
        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [menuRef]);

    const handleEdit = (e) => {
        e?.stopPropagation();
        console.log(`ACTION: Opening edit modal for: ${contact.name}`);
        setIsMenuOpen(false);
    };

    const handleDelete = (e) => {
        e?.stopPropagation();
        console.log(
            `ACTION: Request to delete contact: ${contact.name}. (Confirmation step skipped for demo)`
        );
        setIsMenuOpen(false);
    };

    return (
        <div
            className="bg-white p-4 rounded-xl shadow-sm hover:shadow-md transition-shadow duration-200 flex items-start relative border border-gray-100 cursor-pointer focus:outline-none focus:ring-2 focus:ring-brand-100"
            onClick={() => onClick(contact)}
            tabIndex={0}
            onKeyDown={(e) => {
                if (e.key === 'Enter' || e.key === ' ') onClick(contact);
            }}
        >
            <div
                className="flex justify-end absolute top-2 right-2 z-10"
                ref={menuRef}
                onClick={(e) => e.stopPropagation()}
            >
                <button
                    className="p-1 rounded-full text-gray-500 hover:bg-brand-50 transition-colors"
                    onClick={(e) => {
                        e.stopPropagation();
                        setIsMenuOpen(!isMenuOpen);
                    }}
                    aria-label="Contact actions menu"
                >
                    <svg
                        className="h-6 w-6"
                        viewBox="0 0 24 24"
                        fill="currentColor"
                    >
                        <path d="M12 8c1.1 0 2-.9 2-2s-.9-2-2-2-2 .9-2 2 .9 2 2 2zm0 2c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2zm0 6c-1.1 0-2 .9-2 2s.9 2 2 2 2-.9 2-2-.9-2-2-2z" />
                    </svg>
                </button>
                {isMenuOpen && (
                    <div className="absolute z-20 right-0 mt-8 w-44 rounded-lg shadow-lg bg-white ring-1 ring-black ring-opacity-5">
                        <div className="py-1">
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors"
                                onClick={handleEdit}
                            >
                                Edit Details
                            </button>
                            <button
                                className="block w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors"
                                onClick={handleDelete}
                            >
                                Delete Contact
                            </button>
                        </div>
                    </div>
                )}
            </div>

            {/* Contact Content */}
            <div className="h-10 w-10 bg-brand-50 text-brand-700 rounded-full flex-shrink-0 mr-3 mt-1 flex items-center justify-center font-semibold">
                {(contact.name || '?').slice(0, 2).toUpperCase()}
            </div>
            <div className="flex-1 min-w-0">
                <h3 className="font-semibold text-gray-900">{contact.name}</h3>
                <p className={`text-xs ${contactTextColor} flex items-center`}>
                    <Clock size={12} className="mr-1" />
                    {lastContactDisplay}
                </p>
                <div className="mt-2 text-sm text-gray-500 space-y-1">
                    {/* Phone */}
                    <div className="flex items-start">
                        <svg
                            className="h-4 w-4 flex-shrink-0 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-3.961a18.06 18.06 0 01-13.486-13.486V5a2 2 0 012-2z"
                            />
                        </svg>
                        <p className="flex-1 min-w-0 break-words text-gray-700">
                            {contact.phone || 'N/A'}
                        </p>
                    </div>
                    {/* Email */}
                    <div className="flex items-start">
                        <svg
                            className="h-4 w-4 flex-shrink-0 mr-2"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth="2"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8m-17 4v7a2 2 0 002 2h14a2 2 0 002-2v-7"
                            />
                        </svg>
                        <p className="flex-1 min-w-0 break-words text-gray-700">
                            {contact.email || 'N/A'}
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}
