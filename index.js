const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const app = express()

//app.use(morgan('tiny'))
app.use(cors())

app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
morgan.token('person', function(req,res) {
  return JSON.stringify(req.body)
})

app.use(express.json())

let phonebook = [
    { 
      "id": 1,
      "name": "Arto Hellas", 
      "number": "040-123456"
    },
    { 
      "id": 2,
      "name": "Ada Lovelace", 
      "number": "39-44-5323523"
    },
    { 
      "id": 3,
      "name": "Dan Abramov", 
      "number": "12-43-234345"
    },
    { 
      "id": 4,
      "name": "Mary Poppendieck", 
      "number": "39-23-6423122"
    }
]


app.get('/api/persons', (request,response) => {
    response.json(phonebook)
})

app.get('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    const person = phonebook.find(person => person.id === id)
    if(person) {
        response.json(person)
    } else {
        response.status(404).end()
    }
    
})

app.get('/info', (request,response) =>{
    response.send(
        `Phonebook contains ${phonebook.length} people        <br/>
        ${new Date().toLocaleString()}`

        )
})

app.delete('/api/persons/:id', (request,response) => {
    const id = Number(request.params.id)
    phonebook = phonebook.filter(person => person.id !== id)
    //console.log('id', id)

    response.status(204).end()

})
const generateId = () => {
    const randId = phonebook.length > 0
      ? Math.floor(Math.random() * 100000)
      : 0
    return randId
  }
  
app.post('/api/persons', (request, response) => {
    const body = request.body
    
    if (!body.name || !body.number) {
    return response.status(400).json({ 
        error: 'name or number missing!' 
    })
    } else if (phonebook.find(person => person.name == body.name)){
        return response.status(400).json({
            error: 'name must be unique'
        })
    }
    const person = {
    name: body.name,
    number: body.number,
    id: generateId(),
    }
    //console.log('person', person)

    phonebook = phonebook.concat(person)

    response.json(person)
})


const PORT = 3001
app.listen(PORT)
console.log(`Server running on port ${PORT}`)