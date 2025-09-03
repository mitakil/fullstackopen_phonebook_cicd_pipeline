import { useState, useEffect } from 'react'
//import axios from 'axios'


import Filter from './components/Filter'
import PersonForm from './components/PersonForm'
import Persons from './components/Persons'
import Notification from './components/Notification'

import personService from './services/persons'



const App = () => {
  const [persons, setPersons] = useState([]) 
  const [newName, setNewName] = useState('a new name...')
  const [newNumber, setNewNumber] = useState('a new number...')
  const [filter, setFilter] = useState('')
  const [notification, setNotification] = useState(null)


  //getAll from persons.js service to get all persons in the list
  useEffect(() => {
    personService.getAll().then(initialPersons => {
        setPersons(initialPersons)
      })
  }, [])

  // Add name and number IF person is not found through persons.js service "add"
  const addNameNumber = (event) => {
    event.preventDefault()
    const nameObject = { name: newName, number: newNumber }
    
    //Here we have logic to modify person number
    const personFound = persons.find(
      person => person.name === newName
    )
    if(nameExists(newName)) {
      const userConfirm = window.confirm(`${newName} is already in phonebook, do you want to replace old number with new one?`)
      if(userConfirm) {
        personService
          .update(personFound.id, nameObject)
          .then(updatedPerson => {
            setPersons(persons.map(p =>
              p.id !== personFound.id ? p: updatedPerson
            ))
            setNewName('')
            setNewNumber('')
            setNotification({message: `Person ${nameObject.name} number modified`, type: 'success'})
              setTimeout(() => {
                setNotification(null)
              }, 5000)
          })
          .catch(error => {
            setNotification({message: `The person ${personFound.name} was already removed from server. Error: ${error}`, type: 'error'})
            setTimeout(() => {
              setNotification(null)
            }, 5000)
            setPersons(persons.filter(p => p.id !== personFound.id))
          }) 
      }
      return
    }
    //Here we add name and number if no name is found on list already
    personService
      .add(nameObject)
      .then(response => {
        setPersons(persons.concat(response))
        setNewName('')
        setNewNumber('')
        setNotification({ message: `Person ${nameObject.name} added to phonebook`, type: 'success' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
      .catch(error => {
        console.log(error.response.data.error)
        console.log(error.response)
        setNotification({ message: `Error ${error.response.status}. ${error.response.data.error}`, type: 'error' })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
      })
  }

  const filteredPersons = persons.filter(person => 
       person.name.toLowerCase().includes(filter.toLowerCase())
      )

  const nameExists = (name) => {
    return persons.some(person => person.name === name)
  }

  const deleteNameNumber = (person) => {
    if (window.confirm(`You are deleting ${person.name} from phonebook, are you sure?`)) {
      personService
      .remove(person.id)
      .then(() => {
        setPersons(i => 
          i.filter(j => j.id !== person.id)
        )
      })
      setNotification({
        message: `Person ${person.name} removed from phonebook`, type: 'success'
        })
        setTimeout(() => {
          setNotification(null)
        }, 5000)
    }
  }



  return (
    <div>
      <h2>Phonebook</h2>
      {notification && <Notification message={notification} />}
      <Filter filter={filter} handleFilterChange={(i) => setFilter(i.target.value)} />
      <h2>Add a new</h2>
      <PersonForm
        onSubmit={addNameNumber}
        newName={newName}
        newNumber={newNumber}
        handleNewName={i => setNewName(i.target.value)}
        handleNewNumber={i => setNewNumber(i.target.value)}
      />
      <h2>Numbers</h2>
      <Persons persons={filteredPersons} deleteNameNumber={deleteNameNumber}/>
    </div>
  )
}

export default App