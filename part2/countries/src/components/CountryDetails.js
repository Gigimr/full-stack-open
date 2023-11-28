import React from 'react';
import Weather from './Weather';

function CountryDetails({ country }) {
  return (
    <div>
      <h2>{country.name.common}</h2>
      <p>capital {country.capital[0]}</p>
      <p>population {country.population}</p>
      <h2>Languages</h2>
      <div>
        {Object.keys(country.languages).map((language) => (
          <li key={language}>{country.languages[language]}</li>
        ))}
      </div>
      <img src={country.flags.svg} width="120px" alt={country.flags.alt} />
      <Weather country={country} />
    </div>
  );
}

export default CountryDetails;
