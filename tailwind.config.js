/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./src/**/*.{js,jsx,ts,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                primary: "#16A085",
                secondary: "#F4D03F",
                back: "#121212",
                mtext: "#121212"
            },

            fontFamily: {
                poppins: ["Poppins", "sans-serif"],
                averia: ["Averia Serif Libre", "serif"]
            },

            container: {
                center: true,
                padding: {
                    DEFAULT: "1rem",
                    sm: "2rem",
                    lg: "4rem",
                    xl: "5rem",
                    "2xl": "6rem"
                }
            }
        },
    },
    plugins: [],
}