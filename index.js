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

app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const note = persons.find(note => note.id === id)
    if (note) {
      response.json(note)
    } else {
      response.status(404).end()
    }
})

const PORT = 3001
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`)
})