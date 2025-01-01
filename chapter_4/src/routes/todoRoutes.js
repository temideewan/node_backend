import express from 'express';
import db from '../db.js';

const router = express.Router();

// get all todos for logged in users
router.get('/', (req, res) => {
  const todoFields = ['id', 'user_id', 'task', 'completed']
  const getTodos = db.prepare(`select ${todoFields.join(',')}, task from todos where deleted = 0 AND user_id = ?`);
  const todos = getTodos.all(req.userId);
  res.json(todos);
});

//  create a new todo
router.post('/', (req, res) => {
  const { task } = req.body;
  const insertTodo = db.prepare(
    `insert into todos(user_id, task) values(?, ?)`
  );
  const todo = insertTodo.run(req.userId, task);
  res.json({ id: todo.lastInsertRowid, task, completed: 0 });
});

// update a todo

router.put('/:id', (req, res) => {
  const { completed } = req.body;
  const { id } = req.params;
  const updatedTodo = db.prepare(`update todos set completed= ? where id = ?`)
  updatedTodo.run(completed, id)
  res.status(200).json({message: "Todo updated successfully"});
});

// delete a todo
router.delete('/:id', (req, res) => {
  const {id} = req.params;
  //  hard delete
  // const deleteTodo = db.prepare(`delete from todos where user_id= ? AND id=?`)
  // deleteTodo.run(req.userId, id)

  // soft delete preferred
  const deleteTodo = db.prepare(`update todos set deleted= 1 where id =?`)
  deleteTodo.run(id)
  res.status(200).json({message: "Todo deleted successfully"});
});

export default router;
