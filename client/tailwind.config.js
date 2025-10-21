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
        extend: {},
    },
    // 'plugins' allow you to add extra functionality to Tailwind.
    // For now, we'll leave this empty.
    plugins: [],
};
