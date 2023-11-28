import { useState, useEffect } from 'react';
import axios from 'axios';
import CountriesFilter from './components/CountriesFilter';
import CountriesList from './components/CountriesList';
import CountryDetails from './components/CountryDetails';

function App() {
  const [countries, setCountries] = useState([]);
  const [filteredCountries, setFilteredCountries] = useState([]);
  const [selectedCountry, setSelectedCountry] = useState(null);

  useEffect(() => {
    axios.get('https://restcountries.com/v3.1/all').then((response) => {
      setCountries(response.data);
    });
  }, []);

  const handleFilter = (value) => {
    if (!value.length) {
      setFilteredCountries([]);
    } else {
      const filtered = countries.filter((country) =>
        country.name.common.toLowerCase().includes(value.toLowerCase())
      );
      setFilteredCountries(filtered);
      setSelectedCountry(null);
    }
  };
  const handleShowDetails = (country) => {
    setSelectedCountry(country);
  };
  return (
    <div>
      <CountriesFilter handleFilter={handleFilter} />
      <CountriesList
        countries={filteredCountries}
        handleShowDetails={handleShowDetails}
      />
      {selectedCountry && <CountryDetails country={selectedCountry} />}
    </div>
  );
}

export default App;
