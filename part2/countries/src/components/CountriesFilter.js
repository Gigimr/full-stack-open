import React, { useState } from 'react';

const CountriesFilter = ({ handleFilter }) => {
  const [filter, setFilter] = useState('');

  const handleChange = (e) => {
    const value = e.target.value;
    setFilter(value);
    handleFilter(value);
  };

  return (
    <form>
      Find countries
      <input type="text" value={filter} onChange={handleChange} />
    </form>
  );
};

export default CountriesFilter;
