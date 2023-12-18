require('dotenv').config();
const express = require('express');
const app = express();
const morgan = require('morgan');
const bodyParser = require('body-parser');
const cors = require('cors');
const Person = require('./models/person');

app.use(cors());
app.use(express.static('build'));
app.use(express.json());
app.use(morgan('tiny'));

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

app.get('/api/persons', (request, response) => {
  Person.find({})
    .then((persons) => {
      response.json(persons);
    })
    .catch((error) => next(error));
});

app.get('/info', (request, response, next) => {
  const dateInfo = new Date();
  Person.find({})
    .then((response) => {
      response.send(`<p>Phonebook has info for ${persons.length} people</p>
  <p> ${dateInfo}</p>`);
    })
    .catch((error) => next(error));
});

app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id)
    .then((person) => {
      if (person) {
        response.json(person);
      } else {
        response.status(404).end();
      }
    })
    .catch((error) => next(error));
});

app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then((result) => {
      response.status(204).end();
    })
    .catch((error) => next(error));
});

// Configuración de Morgan con token personalizado para el logging body
morgan.token('body', (req) => JSON.stringify(req.body));

const morganPost = morgan(
  ':method :url :status :res[content-length] - :response-time ms :body '
);
app.post('/api/persons', morganPost, (request, response, next) => {
  const body = request.body;
  if (!body.name || !body.number) {
    return response.status(400).json({ error: 'content missing' });
  } else {
    const person = new Person({
      name: body.name,
      number: body.number,
    });
    person
      .save()
      .then((person) => {
        response.json(person);
      })
      .catch((error) => next(error));
  }
});

app.put('/api/persons/:id', (request, response, next) => {
  const body = request.body;
  const person = {
    name: body.name,
    number: body.number,
  };
  Person.findByIdAndUpdate(request.params.id, person, { new: true })
    .then((updatedPerson) => {
      response.json(updatedPerson);
    })
    .catch((error) => {
      console.log('error', error);
      next(error);
    });
});
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' });
};
app.use(unknownEndpoint);

const errorHandler = (error, request, response, next) => {
  console.log(error.message);
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' });
  }
  if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message });
  }
  next(error);
};

app.use(errorHandler);

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
