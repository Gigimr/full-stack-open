import { useState, useEffect } from 'react';
import axios from 'axios';

const Weather = ({ country }) => {
  const [weather, setWeather] = useState(null);

  const getWeather = (city) => {
    const api_key = process.env.REACT_APP_API_KEY;
    axios
      .get(
        `https://weather.visualcrossing.com/VisualCrossingWebServices/rest/services/timeline/${city}/today/?key=${api_key}`
      )
      .then((response) => {
        const weatherData = response.data;
        console.log('weater', response);
        setWeather(weatherData);
      })
      .catch((error) => {
        console.error('Error:', error);
      });
  };

  useEffect(() => {
    getWeather(`${country.capital},${country.altSpellings[0]}`);
  }, [country]);

  return (
    <div>
      <h2>{`Weather in ${country.capital}`}</h2>
      {weather && (
        <>
          <p>{`Temperature: ${weather.currentConditions.temp} Celcius`}</p>
          <img src={weather.currentConditions.icon} alt="Weather icon" />
          <p>{`Wind ${weather.currentConditions.windspeed} mph direction SSW`}</p>
        </>
      )}
    </div>
  );
};

export default Weather;
