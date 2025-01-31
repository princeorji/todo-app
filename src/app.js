require('dotenv').config();

const express = require('express');

const connectDB = require('./config/mongodb');
const errorHandler = require('./middleware/errorHandler');
const protect = require('./middleware/auth')

const userRouter = require('./routes/user')
const todoRouter = require('./routes/todo')

const port = process.env.PORT || 3000;
const app = express();

app.use(express.json());

app.use('/api/v1/users', userRouter)
app.use('/api/v1/todos', protect, todoRouter)

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