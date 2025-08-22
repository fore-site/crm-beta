// This file tells PostCSS to use the Tailwind CSS and Autoprefixer plugins.
// It is required for the Tailwind build process to work correctly.
export default {
    plugins: {
        // The tailwindcss plugin reads your tailwind.config.js and
        // generates the CSS you need.
        tailwindcss: {},

        // The autoprefixer plugin adds vendor prefixes to your CSS
        // to ensure cross-browser compatibility.
        autoprefixer: {},
    },
};
