import path, { dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
import express from 'express';
import authRoutes from './routes/authRoutes.js';
import todoRoutes from './routes/todoRoutes.js';
import authMiddleware from './middleware/authMiddleware.js';

const app = express();

const PORT = process.env.PORT || 5003;
console.log('Hello world!');

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// middleware to handle json
app.use(express.json());
// serve the html from public directory, serve all files from public as static files

app.use(express.static(path.join(__dirname, '../public')));

// serving up html from public directory
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Routes
app.use('/auth', authRoutes);
app.use('/todos', authMiddleware, todoRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
