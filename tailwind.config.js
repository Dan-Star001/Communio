/** @type {import('tailwindcss').Config} */
export default {
    darkMode: ["class"],
    content: ["./pages/**/*.{js,jsx}", "./components/**/*.{js,jsx}", "./app/**/*.{js,jsx}", "./src/**/*.{js,jsx}", "node_modules/flowbite-react/**/*.{js,jsx,ts,tsx}",
    './node_modules/flowbite/**/*.js',],
    prefix: "",
    theme: {
        extend: {
            colors: {
                'toast-success': '#10b981', // Custom success color
                'toast-error': '#ef4444',   // Custom error color
            },
        },
    },
    plugins: [
        require("tailwindcss-animate"),
        require('flowbite/plugin')
    ],
};