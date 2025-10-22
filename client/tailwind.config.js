/** @type {import('tailwindcss').Config} */
export default {
    // The 'content' array is the most important part.
    // It tells Tailwind which files to scan for class names.
    // We've configured it to look in your HTML file and all
    // JavaScript, TypeScript, JSX, and TSX files inside the 'src' folder.
    content: [
        './index.html',
        // scan everything under src (components, pages, utils, etc.)
        './src/**/*.{js,jsx,ts,tsx,html}',
    ],
    // The 'theme' object is where you can customize Tailwind's default design system.
    // You can extend it to add your own colors, fonts, spacing, etc.
    theme: {
        extend: {
            colors: {
                // From PROMPT_GUIDE: primary blue and amber accent
                // provide a set of blue shades so classes like brand-50..brand-700 exist
                brand: {
                    50: '#EFF6FF',
                    100: '#DBEAFE',
                    200: '#BFDBFE',
                    300: '#93C5FD',
                    400: '#60A5FA',
                    500: '#3B82F6',
                    600: '#2563EB',
                    700: '#1D4ED8',
                },
                accent: {
                    DEFAULT: '#F59E0B', // amber-500
                    500: '#F59E0B',
                },
                neutral: {
                    50: '#F9FAFB',
                    800: '#1F2937',
                },
            },
            fontFamily: {
                sans: ['Inter', 'ui-sans-serif', 'system-ui'],
            },
            container: {
                center: true,
                padding: '1.5rem',
                screens: {
                    lg: '1120px',
                    xl: '1280px',
                    '2xl': '1400px',
                },
            },
            borderRadius: {
                '2xl': '1rem',
            },
            boxShadow: {
                sm: '0 1px 2px rgba(16,24,40,0.05)',
                md: '0 4px 12px rgba(16,24,40,0.08)',
            },
        },
    },
    // 'plugins' allow you to add extra functionality to Tailwind.
    // For now, we'll leave this empty.
    plugins: [],
};
