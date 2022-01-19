const express = require('express')
const app = express()

app.use(express.json())

let persons = [
    {
      id: 1,
      name: "Arto Hellas",
      number:"040-123456"
    },
    {
      id: 2,
      name: "Ada Lovelace",
      number:"39-44-53235321"
    },
    {
      id: 3,
      name: "Dan Abramov",
      number:"12-43-236493"
    },
    {
        id: 4,
        name: "Mary Poppendick",
        number:"39-23-6523122"
    }
]

app.get('/', (req, res) => {
  res.send('<h1>API for persons</h1>')
})

app.get('/info', (req, res) => {
    res.send(`<p>Phonebook has info for ${persons.length} people</p><p>${new Date()}</p>`)
})  

app.get('/api/persons', (req, res) => {
    res.json(persons)
})

app.get('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    const person = persons.find(person => person.id === id)
    if (person) {
      res.json(person)
    } else {
      res.status(404).end()
    }
})

app.delete('/api/persons/:id', (req, res) => {
    const id = Number(req.params.id)
    persons = persons.filter(person => person.id !== id)
    res.status(204).end()
})

const getRandomId = (min, max) => {
    return Math.floor(Math.random() * (max - min) + min); //The maximum is exclusive and the minimum is inclusive
    }

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

    if (persons.find(person => person.name === body.name)) {
        return res.status(400).json({ 
            error: 'name must be unique' 
        })
    }
  
    const person = {
        id: getRandomId(0,100000),
        name: body.name,
        numbre: body.number
    }
  
    persons = persons.concat(person)
    res.json(person)
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})