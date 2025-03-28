/** @type {import('tailwindcss').Config} */
export default {
	content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
	theme: {
		extend: {
			colors: {
			  primary: {
				DEFAULT: '#0F4C44',
				light: '#1A6B61'
			  },
			  success: {
				50: '#F0F9EF',
				100: '#E1F3DF',
				200: '#C3E7BF',
				300: '#A6E3A1',
				400: '#88D683',
				500: '#6AC964',
				600: '#4FAB49',
				700: '#3D8A3A',
				800: '#2C692B',
				900: '#1B481C',
				DEFAULT: '#A6E3A1'
			  }
			}
		  },
	},
	plugins: [],
};
