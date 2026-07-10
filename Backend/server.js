require("dotenv").config();
const app = require("./src/app");
const connectToDB = require("./src/config/database");
const { resume, selfDescription, jobDescription } = require("./src/services/temp");
console.log(resume, selfDescription, jobDescription);

// connectToDB();

// const PORT = 3000;
// app.listen(PORT, () => {
//   console.log(`Server is running on http://localhost:${PORT}`);
// });
