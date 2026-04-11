import dotenv from 'dotenv';
dotenv.config();
const { default: app } = await import("./src/app.js");

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Server is running on port http://localhost:${PORT}`);
})