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


app.get('/', (req, res) => {
  res.send('<h1>API for persons</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})  

app.get('/api/persons', (req, res) => {
    Person.find({}).then(persons => {
      res.json(persons)
    })
})

app.get('/api/persons/:id', (req, res) => {
    Person.findById(req.params.id).then(person => {
      res.json(person)
    })
})

/* Poistaminen ei toimi vielä
app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})
*/

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

const PORT = process.env.PORT
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})