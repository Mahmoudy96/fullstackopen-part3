const mongoose = require('mongoose')
const password = process.argv[2]  
const url =`mongodb+srv://mahmoudy:${password}@cluster0.9aebf.mongodb.net/phonebook?retryWrites=true&w=majority&appName=Cluster0`
mongoose.set('strictQuery', false) 
mongoose.connect(url)
const personSchema = new mongoose.Schema({
    name: String,
    number: String,
    id: Number
})
const Person = mongoose.model('Person', personSchema)
const name = process.argv[3]  
const number = process.argv[4]  
const person = new Person({
    id: 1,
    name: name,
    number: number
})
if (process.argv.length = 3) {
    Person.find({}).then(result => {
        console.log("Phonebook:")
        result.forEach(p => {
        console.log(p.name, p.number)               
        })
        mongoose.connection.close()
    }
)
} else {
    person.save().then(result => {
        console.log(`added ${name} number ${number} to phonebook`)
        mongoose.connection.close()
    })  
}