/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./src/**/*.{html,ts}"],
  theme: {
    extend: {
      fontFamily: {
        custom: ["Minecraftia", "sans-serif"], // Add your custom font here
        RobotoMonoBold: ["RobotoMono-Bold", "sans-serif"],
      },
      spacing: {
        112: "28rem",
        128: "32rem",
        144: "36rem",
        155: "40rem",
        156: "50rem",
        160: "73rem",
        80: "95%",
        // Add more custom sizes as needed
      },
    },
  },
  plugins: [],
};
