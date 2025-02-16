import express from "express";
import cors from "cors";
import helmet from "helmet";
import dotenv from "dotenv-flow";

dotenv.config();


const app = express();
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    console.log(`Backend listening at ${PORT}`)
});