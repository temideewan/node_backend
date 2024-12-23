const express = require('express');
const app = express();
const port = 8383;
const data = ['John']
;

// middleware 
app.use(express.json());

// Website endpoints
app.get('/', (req, res) => {
  res.send(`
    <body style="background: pink; color: blue">
      <h1>Data</h1>
      <p>${JSON.stringify(data)}</p>
      <a href="/dashboard">Dashboard</a>
      <script>console.log("This is my script")</script>
    </body>
    `);
});

app.get('/dashboard', (req, res) => {
  res.send(`
      <body style="background: pink; color: blue">
        <h1>Dashboard</h1>
        <a href="/">Home</a>
      </body>
    `)
});

// API endpoints

app.get('/api/data', (req, res) => {
  console.log('API data endpoint being hit');
  res.status(200).send(data);
});

app.post('/api/data', (req, res) => {
  const newEntry = req.body;
  console.log('Received new data:', newEntry);
  data.push(newEntry.name);
  res.sendStatus(201)
});

app.delete('/api/data', (req, res) => {
  const deleted = data.pop();
  console.log('Deleted data:', deleted);
  res.status(200).json({message: 'deleted item'})
})

app.listen(port, () => {
  console.log(`listening on port ${port}`);
});

process.on('uncaughtException', (error) => {
  console.error('An uncaught exception occurred');
  console.error(error);
  process.exit(1);
})
