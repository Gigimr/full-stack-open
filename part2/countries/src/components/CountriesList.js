import React from 'react';

function CountriesList({ countries, handleShowDetails }) {
  if (countries.length > 10) {
    return <p>Too many matches, specify another filter</p>;
  }

  return (
    <div>
      {countries.map((country) => (
        <div key={country.name.common}>
          <p>
            {country.name.common}
            <button onClick={() => handleShowDetails(country)}>show</button>
          </p>
        </div>
      ))}
    </div>
  );
}

export default CountriesList;
