const Todo = require('../models/Todo');

const create = async (req, res, next) => {
    try {
        const todo = new Todo({
            title: req.body.title,
            userId: req.user._id
        })
        await todo.save();
        res.status(201).json(todo)
    } catch (error) {
        next(error)
    }
}

const todos = async (req, res, next) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;
    const total = await Todo.countDocuments();
    const todos = await Todo.find().skip(skip).limit(limit);
    res.status(200).json({ todos, page, limit, total });
}

const getById = async (req, res, next) => {
    try {
        const todo = await Todo.findById(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' })
        }
        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
}

const update = async (req, res, next) => {
    try {
        const todo = await Todo.findByIdAndUpdate(
            req.params.id,
            { complete: true },
            { new: true }
        );
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' })
        }
        res.status(200).json(todo);
    } catch (error) {
        next(error);
    }
}

const remove = async (req, res, next) => {
    try {
        const todo = await Todo.findByIdAndDelete(req.params.id);
        if (!todo) {
            return res.status(404).json({ message: 'Todo not found' })
        }
        res.sendStatus(200);
    } catch (error) {
        next(error);
    }
}

module.exports = {
    create,
    todos,
    getById,
    update,
    remove
}