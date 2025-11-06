/** @type {import('tailwindcss').Config} */


export default {

   //"content" tells Tailwind where to look for class names in the project.
  //It scans these files and automatically removes unused CSS (tree-shaking).

  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],


  theme: {
    // "extend" allows you to add to Tailwind’s default theme
    // instead of replacing it completely.
    extend: {
      fontFamily: {

        // Default font (from bubble)
        sans: ['Inter', 'sans-serif'],
        // Secondary / display font (used via "font-display")
        display: ['Bebas Neue', 'cursive'],
      },
    },
  },
  plugins: [require("daisyui")],
};
