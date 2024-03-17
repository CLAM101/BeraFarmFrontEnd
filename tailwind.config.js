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
        75: "92%",
        80: "95%",
        112: "28rem",
        128: "32rem",
        144: "36rem",
        155: "40rem",
        156: "45rem",
        158: "55rem",
        160: "73rem",
        165: "80rem",
        170: "90rem",
        180: "100rem",
        190: "110rem",
        200: "120rem",
        210: "130rem",
        220: "140rem",

        // Add more custom sizes as needed
      },
    },
  },
  plugins: [],
};
