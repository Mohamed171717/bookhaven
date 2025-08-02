/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        // TODO: Uncomment when font files are added
        // 'playwrite-magyar': ['var(--font-playwrite-magyar)', 'Playwrite Magyarország', 'sans-serif'],
      },
    },
  },
  plugins: [],
}


