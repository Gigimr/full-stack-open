import { useState, useEffect } from 'react';
import Filter from './components/Filter';
import PersonForm from './components/PersonForm';
import Persons from './components/Persons';
import personService from './services/personServices';
import Notification from './components/Notification';
const App = () => {
  const [persons, setPersons] = useState([]);
  const [newName, setNewName] = useState('');
  const [newNumber, setNewNumber] = useState('');
  const [filteredPersons, setFilteredPersons] = useState([]);
  const [notificationInfo, setNotificationInfo] = useState({});

  useEffect(() => {
    personService
      .getAll()
      .then((response) => {
        setPersons(response);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setNotificationInfo({
          type: 'error',
          message: 'Error fetching data. Please try again later.',
        });
      });
  }, []);

  const handleFilter = (e) => {
    const value = e.target.value;
    if (!value.length) return setFilteredPersons([]);

    const filtered = persons.filter((person) =>
      person.name.toLowerCase().includes(value.toLowerCase())
    );
    setFilteredPersons(filtered);
  };

  const addPerson = (e) => {
    e.preventDefault();
    const existingPerson = persons.find((person) => person.name === newName);
    if (!newName.length) {
      return alert('Name is empty');
    }
    if (existingPerson) {
      const confirmUpdate = window.confirm(
        `${newName} is already added to phonebook, replace the old number with the new one?`
      );
      if (confirmUpdate) {
        updatedPerson(existingPerson);
      }
    } else {
      createPerson(newName, newNumber);
    }
  };

  const updatedPerson = (existingPerson) => {
    const updatedPerson = { ...existingPerson, number: newNumber };
    personService
      .update(existingPerson.id, updatedPerson)
      .then((response) => {
        setPersons(
          persons.map((p) => (p.id !== existingPerson.id ? p : response))
        );
        setNotificationInfo({
          type: 'success',
          message: `${updatedPerson.name} has been updated`,
        });
      })
      .catch((error) => {
        console.error('Error updating person:', error);
      });
  };

  const createPerson = (name, number) => {
    const personDetail = {
      name,
      number,
    };
    personService
      .create(personDetail)
      .then((response) => {
        setPersons(persons.concat(response));
        setNewName('');
        setNewNumber('');
        setNotificationInfo({
          type: 'success',
          message: `Added ${personDetail.name}`,
        });
        setTimeout(() => setNotificationInfo({}), 5000);
      })
      .catch((error) => {
        if (error?.response?.data?.error) {
          const errorMessage = error.response.data.error;
          setNotificationInfo({
            type: 'error',
            message: `${errorMessage}`,
          });
          setTimeout(() => setNotificationInfo({}), 5000);
        }
        console.error('Error:', error);
      });
  };

  const deletePerson = (id) => {
    const personFound = persons.find((p) => p.id === id);
    if (personFound && window.confirm(`Delete ${personFound.name} ?`))
      personService
        .deleted(id)
        .then(() => {
          setPersons(persons.filter((p) => p.id !== id));
          setNotificationInfo({
            type: 'success',
            message: `${personFound.name} has been deleted`,
          });
        })
        .catch((error) => {
          console.error('Status: ', error);
          setNotificationInfo({
            type: 'error',
            message: `Information of ${personFound.name} has already been removed from server`,
          });
          setTimeout(() => setNotificationInfo({}), 5000);
        });
  };

  const handleNewName = (e) => {
    setNewName(e.target.value);
  };

  const handleNewNumber = (e) => {
    setNewNumber(e.target.value);
  };

  return (
    <div>
      <h2>Phonebook</h2>
      <Notification notificationInfo={notificationInfo} />
      <Filter handleFilter={handleFilter} filteredPersons={filteredPersons} />
      <h2>Add a new </h2>
      <PersonForm
        addPerson={addPerson}
        newName={newName}
        handleNewName={handleNewName}
        newNumber={newNumber}
        handleNewNumber={handleNewNumber}
      />
      <h3>Numbers</h3>
      <Persons persons={persons} deletePerson={deletePerson} />
    </div>
  );
};
export default App;
