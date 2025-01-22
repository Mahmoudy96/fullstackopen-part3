const express = require('express')
const morgan = require('morgan')
const cors = require('cors')
const dotenv = require('dotenv')
dotenv.config({path: './.env'})
const Person = require('./models/person')
//app.use(morgan('tiny'))


const app = express()


/*
if (process.argv.length < 3) {
  console.log('Please provide the password as an argument: node index.js <password>')
  process.exit(1)
}*/

app.use(express.static('dist'))
app.use(cors())


app.use(morgan(':method :url :status :res[content-length] - :response-time ms :person'))
morgan.token('person', function (req, res) {
  return JSON.stringify(req.body)
})

app.use(express.json())

/*
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
*/

app.get('/api/persons', (request, response) => {
  //response.json(phonebook)
  Person.find({}).then(persons => {
    response.json(persons)
  })
  //    response.json(Person.find({}))
})

app.get('/api/persons/:id', (request, response) => {
  Person.findById(request.params.id).then(person => {
    if(person){
    response.json(person)
  } else {
    response.status(404).end()
  }}

)
    .catch(error => {
      console.log(error)
      response.status(400).send({ error: 'malformatted id' }) 
    }
    )
})

app.get('/info', (request, response) => {
  Person.find({}).then(persons => {
    response.send(    
      `Phonebook contains ${persons.length} people        <br/>
      ${new Date().toLocaleString()}`)
  })
})

app.delete('/api/persons/:id', (request, response,next) => {
  Person.findByIdAndDelete(request.params.id).then(() => {
    response.status(204).end()
    .catch(error => next(error))
  })
}
)
const generateId = () => {
  const randId = phonebook.length > 0
    ? Math.floor(Math.random() * 100000)
    : 0
  return randId
}


app.put('/api/persons/:id', (request, response,next) => {
  const body = request.body

  const person = {
    name: body.name,
    number: body.number
  }

  Person.findByIdAndUpdate  (request.params.id, person, { new: true })
    .then(updatedPerson => {
      response.json(updatedPerson)
    })
    .catch(error => next(error))
})

app.post('/api/persons', (request, response,next) => {
  const body = request.body

  if (!body.name || !body.number) {
    return response.status(400).json({
      error: 'name or number missing!'
    })
   /*} else if (Person.findById(body.id)) {
    return response.status(400).json({
      error: 'name must be unique'
    })*/
  }
  const person = new Person({
      name: body.name,
      number: body.number,  
    })
  //console.log('person', person)
  person.save().then(savedPerson => {
    response.json(savedPerson)
  }).catch(error => next(error))
})


const errorHandler = (error, request, response, next) => {
  console.error(error.message)

  if (error.name === 'CastError') {
    return response.status(400).send({ error: 'malformatted id' })
  } 

  next(error)
}

app.use(errorHandler)


const PORT = process.env.PORT
app.listen(PORT)
console.log(`Server running on port ${PORT}`)