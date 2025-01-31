require('dotenv').config();

const express = require('express');

const connectDB = require('./config/mongodb');
const errorHandler = require('./middleware/errorHandler');

const userRouter = require('./routes/user')

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use('/api/v1/users', userRouter)

app.use(errorHandler);

const start = async () => {
    try {
        await connectDB(process.env.DATABASE_URL)
        app.listen(port, () => {
            console.log(`Server listening on port: ${port}`);
        })
    } catch (error) {
        console.error(error);
    }
}

start();