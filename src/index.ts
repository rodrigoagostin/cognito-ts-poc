import dotenv from 'dotenv';
import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
dotenv.config();

import AuthController from './AuthController';

const PORT = 8080;

const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post('/signIn', new AuthController().signIn);


app.listen(PORT, () =>
  console.log(`Server running on ${PORT}`));