npx create-next-app@latest
https://tailwindcss.com/docs/guides/nextjs
npm install -D tailwindcss postcss autoprefixer
npx tailwindcss init -p

# in tailwind.config.js

```
/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./app/**/*.{js,ts,jsx,tsx}",
    "./pages/**/*.{js,ts,jsx,tsx}",
    "./components/**/*.{js,ts,jsx,tsx}",
 
    // Or if using `src` directory:
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {},
  },
  plugins: [],
}
```
# in global.css

```
@tailwind base;
@tailwind components;
@tailwind utilities;
```

* create header component

npm install react-icons --save


* create sidebar
* https://bobbyhadz.com/blog/react-type-children-has-no-properties-in-common
* create header
* create barchart
* create recent orders

npm install --save chart.js react-chartjs-2
npm install @types/chart.js
