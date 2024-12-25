import { useState, useEffect } from 'react'
import Display from './components/Display'
import Filter from './components/Filter'
import AddPerson from './components/AddPerson'
import Notification from './components/Notification'
import phonebookService from './services/phonebook'
import axios from 'axios'
import './index.css'

const App = () => {
  // const initialPeople = [{ name: 'Arto Hellas',number: "19-82-34772",id: 1 },
  // { name: 'Mary Poppendieck', number: '39-23-6423122', id: 2 }]
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('')
  const [newNumber, setNewNumber] = useState('')
  const [newSearch, setNewSearch] = useState('')
  const [peopleToShow, setPeopleToShow] = useState([])
  const [message, setMessage] = useState(null)
  const [errorMessage, setErrorMessage] = useState(null)  
  const hook = () => {
    phonebookService
      .getAll()
      .then(initialPeople => {
        setPersons(initialPeople)
        setPeopleToShow(initialPeople)
      })
  }
  useEffect(hook,[])
  
  const filterPeople = (persons, name) => {
    const filtered_people = persons.filter(person => person.name.toLowerCase().includes(name.toLowerCase()))
    return(structuredClone(filtered_people))
  }
  const addPerson = (event) => {
    event.preventDefault()
    const newPerson = {
      name: newName,
      number: newNumber,
      // id: persons.length+1
    }
    const personIndex = persons.map(person => person.name).indexOf(newName)
    if(personIndex != -1){
      if(persons[personIndex].number == newNumber) {
        alert(`${newName} is already in the phonebook with this number`)
      } else {
        const id = persons[personIndex].id
        phonebookService
        .update(id, newPerson)
        .then(returnedPerson => {
          const newPeople = persons.map( person => person.id == returnedPerson.id ? returnedPerson : person)
          setPersons(newPeople)
          setPeopleToShow(filterPeople(newPeople,newSearch))
        })
        .catch(error=>{
          setErrorMessage(`'${newName}' has already been deleted from the phonebook`)
          setTimeout(() => {
            setErrorMessage(null)}, 5000)
          const newPeople = persons.filter( p => p.id !== id)
          setPersons(newPeople)
          setPeopleToShow(filterPeople(newPeople,newSearch))
        })


      }
    } else if(newName=='') {
      alert('Name cannot be empty')
    }
     else {
      phonebookService
        .create(newPerson)
        .then(returnedPerson => {
          const newPeople = persons.concat(returnedPerson)
          setPersons(newPeople)
          setPeopleToShow(filterPeople(newPeople,newSearch))
          setMessage(`added '${returnedPerson.name}' to phonebook`)
          setTimeout(() => {
            setMessage(null)}, 5000)
        }
      )
    }
  }
  const deletePerson = (person) => {
    if (confirm(`Delete ${person.name}?`)) {
      phonebookService
      .remove(person.id)
      .then(hook) 
    }
  }
  const handleNameChange = (event) => {
    // console.log('hi', event.target.value)
    setNewName(event.target.value)  

  }
  const handleNumberChange = (event) => {
    // console.log('hi', event.target.value)
    setNewNumber(event.target.value)  

  }
  const handleNameFiltering = (event) =>{
    const nameToFilter = event.target.value
    setNewSearch(nameToFilter)
    const filtered_people = filterPeople(persons,nameToFilter)
    setPeopleToShow(filtered_people)
    // console.log('peopleToShow', peopleToShow)
  }

  return (
    <div>
      <h1>Phonebook</h1>
      <Filter value={newSearch} onChange={handleNameFiltering}></Filter>
      <h2>Add person to phonebook</h2>
      <Notification message={errorMessage} style="error"></Notification>
      <Notification message={message} style="message"></Notification>
      <AddPerson addPerson={addPerson} newName={newName} handleNameChange={handleNameChange}
        newNumber={newNumber} handleNumberChange={handleNumberChange}></AddPerson>
      <h2>Numbers</h2>
      <Display people = {peopleToShow} deletePerson = {deletePerson}/>
    </div>
  )
}

export default App