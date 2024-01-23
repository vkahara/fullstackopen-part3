require('dotenv').config()
const express = require('express')
const cors = require('cors')
const morgan = require('morgan')
const app = express()
const Person = require('./models/person')

// define token for morgan in order to log request content
morgan.token('data', function (req, res) {
     return(
        JSON.stringify(req.body)
     ) 
    })

app.use(cors())
app.use(express.json())
app.use(morgan(':method :url :status :res[content-length] - :response-time ms :data' ))
app.use(express.static('dist'))

// display info page with info on how may persons
// the phonebook has and date
app.get('/info', (request, response) => {
    date = new Date()
    response.send(
        `Phonebook has info for ${persons.length} people
        <br>
        ${date}`
    )
})

// get all data on persons
app.get('/api/persons', (request, response) => {
    Person.find({}).then(persons => {
        response.json(persons)
    })
})

// functionality for displaying the information for a single phonebook entry. 
app.get('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    const person = persons.find(person => person.id === id)

    if (person) {
        response.json(person)
      } else {
        response.status(404).end()
      }
})

// delete a single phonebook entry 
app.delete('/api/persons/:id', (request, response) => {
    const id = Number(request.params.id)
    persons = persons.filter(person => person.id !== id)

    response.status(204).end()
})


// generate new id that is 1 larger
//than the previous largest id
const generateId = () => {
    const randomId = Math.floor(Math.random() * 10000000)
    return randomId
  }

// add new phonebook entry. 
app.post('/api/persons', (request, response) => {
    const body = request.body

    //check for duplicate name
    if (persons.some((person) => person.name === body.name)) {
        return response.status(409).json({
            error: 'name must be unique'
        })
    }

    // check if information missing
    if (!body.name) {
        return response.status(400).json({
            error: 'name is missing'
        })
    }
    if (!body.number) {
        return response.status(400).json({
            error: 'number is missing'
        })
    }
    
    const person = {
        id: generateId(),
        name: body.name,
        number: body.number,
    }

    persons = persons.concat(person)
    response.json(person)
})

const PORT = process.env.PORT
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`)
})