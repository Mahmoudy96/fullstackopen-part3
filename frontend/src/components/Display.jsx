const DisplayPerson = ({person, deletePerson}) => {
return(
<li>{person.name} : {person.number} <button onClick={deletePerson}>delete</button></li>
)
}

const Display = ({people, deletePerson}) => {
  // console.log('people', people)
  return(
    <ul>
    {people.map(person => <DisplayPerson key={person.id} person={person} deletePerson={() => deletePerson(person)}/>)
    }
    </ul>

  )
}

export default Display