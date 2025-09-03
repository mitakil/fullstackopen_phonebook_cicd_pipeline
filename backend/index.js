require('dotenv').config()

const express = require('express')

const Person = require('./models/person')

const app = express()

const requestLogger = (request, response, next) => {
  console.log('Method:', request.method)
  console.log('Path:  ', request.path)
  console.log('Body:  ', request.body)
  console.log('---')
  next()
}

const errorHandler = (error, request, response, next) => {
  console.log(error.message)
  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'wrong id' })
  } else if (error.name === 'ValidationError') {
    return response.status(400).json({ error: error.message })
  }
  next(error)
}

// Midlewares
app.use(express.static('dist'))
app.use(express.json())
app.use(requestLogger)

// --- Routes ---
// Front page
app.get('/', (request, response) => {
  response.send('<h1>Full stack open -course phonebook project of Github user mitakil</h1>')
})

// List of all persons
app.get('/api/persons', (request, response) => {
  Person.find({}).then(persons => {
    response.json(persons)
  })
})

// Part 3.13 - Specific person by ID
app.get('/api/persons/:id', (request, response, next) => {
  Person.findById(request.params.id).then(person => {
    if (person) {
      response.json(person)
    } else {
      response.status(404).end()
    }
  })
    .catch(error => next(error))
})

// Part 3.13 - Add person
app.post('/api/persons', (request, response, next) => {
  const body = request.body

  // Check if request contains name, if not return 400
  if (!body.name) {
    return response.status(400).json({ error: 'Name missing' })
  }
  // New version with MongoDB
  const person = new Person({
    name: body.name,
    number: body.number,
  })
  person.save().then(savedPerson => {
    response.json(savedPerson)
  })
    .catch(error => next(error))
    // .catch(error => console.log(`Got error message ${error.response.data}`))
})

// Part 3.15 - Delete person
app.delete('/api/persons/:id', (request, response, next) => {
  Person.findByIdAndDelete(request.params.id)
    .then(() => {
      response.status(204).end()
    })
    .catch(error => next(error))
})

// Part 3.17 - Modify persons number
app.put('/api/persons/:id', (request, response, next) => {
  const { name, number } = request.body

  Person.findById(request.params.id)
    .then(person => {
      if (!person) {
        return response.status(404).end()
      }

      person.name = name
      person.number = number

      return person.save().then((updatedPerson) => {
        response.json(updatedPerson)
      })
    })
    .catch(error => next(error))
})

// Part 3.18 - Add /info
app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(`<p>There is ${persons.length} contacts in phonebook</p>
            <p>Request was done at ${new Date()}</p>`)
  })
})

// --- ----- ---

// Part 3.16 - Add unknown endpoint middleware
const unknownEndpoint = (request, response) => {
  response.status(404).send({ error: 'unknown endpoint' })
}

app.use(unknownEndpoint)
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})
