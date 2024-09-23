import express, { json } from 'express';
const app = express();
app.listen(7777);
app.use(json());

import usersRouter from './routes/users.js';
import channelsRouter from './routes/channels.js';

app.use('/', usersRouter);
app.use('/channels/', channelsRouter);
