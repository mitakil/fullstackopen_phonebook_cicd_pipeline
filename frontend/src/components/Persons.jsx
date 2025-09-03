// const Person = ({ person }) => (
//     <div>{person.name} {person.number}</div>
// )

// const Persons = ({ persons }) => (
//     <div>
//         {persons.map(person => (
//             <Person key={`${person.name} ${person.name}`} person={person} />
//         ))}
//     </div>
// )

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
