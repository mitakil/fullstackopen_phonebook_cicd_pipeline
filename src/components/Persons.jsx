const Persons = ({ persons, deleteNameNumber }) => {
    return (
        <div>
        {persons.map(person => (
            <li key={person.id}>
                {person.name} {person.number} 
                <button onClick={() => {deleteNameNumber(person)}}>delete</button>
            </li>
        ))}
    </div>
    )
}

export default Persons
