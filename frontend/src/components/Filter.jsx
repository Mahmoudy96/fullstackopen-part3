const Filter = ({value, onChange}) => {
    return(
    <div>
    Filter phonebook by name: <input value={value} onChange={onChange}/>
    </div>)
  }

  export default Filter