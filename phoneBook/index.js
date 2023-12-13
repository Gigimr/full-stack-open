const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');

app.use(express.json());
app.use(morgan('tiny'));
app.use(cors());
//to parse JSON bodies
app.use(bodyParser.json());

let persons = [
  { id: 1, name: 'Arto Hellas', number: '040-123456' },
  {
    id: 2,
    name: 'Ada Lovelace',
    number: '39-44-5323523',
  },
  {
    id: 3,
    name: 'Dan Abramov',
    number: '12-43-234345',
  },
  {
    id: 4,
    name: 'Mary Poppendick',
    number: '39-23-6423122',
  },
  {
    id: 5,
    name: 'Gigi Rust',
    number: '99-93-6623326',
  },
];

app.get('/', (request, response) => {
  response.send('<h1>Hello World!</h1>');
});

app.get('/api/persons', (request, response) => {
  response.json(persons);
});

app.use((request, response, next) => {
  const now = new Date();

  request.requestTime = `${now}`;

  next();
});
app.get('/info', (request, response) => {
  const requestTime = request.requestTime.toLocaleString();
  response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p> ${requestTime}</p>`);
});

app.get('/api/persons/:id', (request, response) => {
  const id = Number(request.params.id);
  const person = persons.find((person) => person.id === id);

  response.json(person);
});

app.delete('/api/persons/:id', (request, response) => {
  try {
    const id = Number(request.params.id);
    persons = persons.filter((person) => person.id !== id);

    response.status(204).end();
  } catch (error) {
    console.error('Error al eliminar persona:', error);
    response.status(500).json({ error: 'Internal Server Error' });
  }
});

// Configuración de Morgan con token personalizado para el logging body
morgan.token('body', (req) => JSON.stringify(req.body));

const morganPost = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body '
);
app.post('/api/persons', morganPost, (request, response, next) => {
  try {
    const newPerson = {
      name: request.body.name,
      number: request.body.number,
    };
    if (
      typeof newPerson.name !== 'string' ||
      typeof newPerson.number !== 'string'
    ) {
      return response.status(400).json({
        error: 'Invalid data format',
      });
    }
    if (!newPerson.name || !newPerson.number) {
      return response.status(400).json({
        error: 'Content missing',
      });
    }
    if (persons.some((person) => person.name === newPerson.name)) {
      return response.status(400).json({
        error: 'name must be unique',
      });
    }

    const newId = Math.floor(Math.random() * 100) + 15000;
    newPerson.id = newId;
    persons.push(newPerson);

    response.json(newPerson);
  } catch (error) {
    next(error);
  }
});

const PORT = 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
