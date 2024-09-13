const express = require('express');
const app = express();
app.listen(7777);
app.use(express.json());

const usersRouter = require('./routes/users');
const channelsRouter = require('./routes/channels');

app.use('/', usersRouter);
app.use('/channels/', channelsRouter);
