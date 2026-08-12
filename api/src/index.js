import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;


app.use(cors());
app.use(bodyParser.json());


app.get("/", (res, req) => res.send("Welcome to the APi"));
//escucha al servidor
app.listen(port, () => console.log(`Server running on port ${port}`));