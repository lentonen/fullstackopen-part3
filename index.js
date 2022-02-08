const express = require('express')
const morgan = require('morgan')
const cors = require('cors')

require('dotenv').config();
const Person = require('./models/person');
const { response } = require('express');

const app = express()
app.use(express.json())
morgan.token('body', (req, res) => JSON.stringify(req.body));
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :body'));
app.use(cors())
app.use(express.static('build'))

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res, next) => {
    Person.findById(req.params.id).then(person => {
      if (person) {
        res.json(person)
      } else {
        res.status(404).end()
      }
    })
    .catch(error => next(error))
})


app.delete('/api/persons/:id', (req, res, next) => {
  Person.findByIdAndDelete(req.params.id)
    .then(result => {
      res.status(204).end()
    })
    .catch(error => next(error))  
})


app.post('/api/persons', (req, res) => {
    const body = req.body

    if (!body.name) {
      return res.status(400).json({ 
        error: 'name missing' 
      })
    }

    if (!body.number) {
        return res.status(400).json({ 
            error: 'number missing' 
        })
    }

    /* Ei välitetä siitä, onko tietokannassa samanniminen henkilö
    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({ 
            error: 'name must be unique' 
        })
    }
    */

    const person = new Person({
      name: body.name,
      number: body.number
    }) 
  
    person.save().then(savedPerson => {
      res.json(savedPerson)
    })
})

// Virheidenkäsittelijä rekisteröidään viimeisenä!
const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  }

  next(error)
}

// tämä tulee kaikkien muiden middlewarejen rekisteröinnin jälkeen!
app.use(errorHandler)

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})