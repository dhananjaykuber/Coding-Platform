const express = require('express');
const mongoose = require('mongoose');
const dotenv = require('dotenv');
const cors = require('cors');

const userRoute = require('./routes/userRoute');
const codeRoute = require('./routes/codeRoute');
const questionRoute = require('./routes/questionRoute');
const adminRoute = require('./routes/adminRoute');

dotenv.config();

const app = express();

app.use(cors());
app.use(express.json());

app.use('/api/auth', userRoute);
app.use('/api/code', codeRoute);
app.use('/api/question', questionRoute);
app.use('/api/admin', adminRoute);

mongoose
  .connect(process.env.DATABASE_URI)
  .then(() => {
    app.listen(process.env.PORT, () => {
      console.log(`Server listening on port ${process.env.PORT} 🚀`);
    });
  })
  .catch((error) => {
    console.log(error);
  });
