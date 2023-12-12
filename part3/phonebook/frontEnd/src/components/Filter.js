const Filter = ({ handleFilter, filteredPersons }) => {
  return (
    <div>
      filter shown with <input type="text" onChange={handleFilter} />
      {filteredPersons.map((person) => (
        <div key={person.name}>
          <p>{person.name}</p>
        </div>
      ))}
    </div>
  );
};
export default Filter;
