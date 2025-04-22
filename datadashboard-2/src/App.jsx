import { useState, useEffect } from 'react'
import './App.css'
import { Link } from "react-router-dom"
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  ScatterChart, Scatter
} from 'recharts';



function App() {
 ' const ACCESS_KEY = import.meta.env.VITE_APP_ACCESS_KEY;'

const API_KEY = "";
const [weather, setWeather] = useState(null);
const [value, setValue] = useState('');
const [weatherList, setWeatherList] = useState([]);
const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());

const fetchWeatherData = async () => {

try {
  const forecastRes  = await fetch (
`https://api.weatherbit.io/v2.0/forecast/daily?lat=35.7796&lon=-78.6382&key=47fe9e4bf0ae4af8bd9bdaba98a27c46&include=minutely
`
  );
  const forecastData = await forecastRes.json();

  const currentRes = await fetch(
    `https://api.weatherbit.io/v2.0/current?lat=35.7796&lon=-78.6382&key=47fe9e4bf0ae4af8bd9bdaba98a27c46`
  );
  const currentData = await currentRes.json();
  if (forecastData.data && currentData.data) {
    setWeather({
      ...forecastData.data[0],
      city_name: currentData.data[0].city_name,
      elev_angle: currentData.data[0].elev_angle
    });
    setWeatherList(forecastData.data);
  }

}catch (error) {}
console.log("Something went wrong: ", error);


};


const fetchSearchedWeather = async ()=> {
  if (!value) return;
  try {
 const forecastRes  = await fetch (
`https://api.weatherbit.io/v2.0/forecast/daily?city=${value}&key=47fe9e4bf0ae4af8bd9bdaba98a27c46&include=minutely`

);
 const forecastData  = await forecastRes.json();

 const currentRes = await fetch(
  `https://api.weatherbit.io/v2.0/current?city=${value}&key=47fe9e4bf0ae4af8bd9bdaba98a27c46`
);
const currentData = await currentRes.json();
if (forecastData.data && currentData.data) {
  setWeather({
    ...forecastData.data[0],
    city_name: currentData.data[0].city_name,
    elev_angle: currentData.data[0].elev_angle
  });
  setWeatherList(forecastData.data);
}

  }
  catch (error) {
    console.log("Error fetching search results: ", error);
  }

  


};


useEffect (() => {
  fetchWeatherData();
  const timer = setInterval(() => setCurrentTime(new Date().toLocaleTimeString()), 1000);
  return () => clearInterval(timer);
}, []);

const renderTemperatureChart = () => {
  const chartData = weatherList.map(day => ({
    time: day.datetime || new Date().toLocaleTimeString(),
    temperature: day.temp,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={chartData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="time" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="temperature" stroke="#8884d8" />
      </LineChart>
    </ResponsiveContainer>
  );
};

const renderHumidityWindChart = () => {
  const chartData = weatherList.map(day => ({
    humidity: day.rh,
    windSpeed: day.wind_spd,
  }));

  return (
    <ResponsiveContainer width="100%" height={300}>
      <ScatterChart>
        <CartesianGrid />
        <XAxis type="number" dataKey="humidity" name="Humidity" unit="%" />
        <YAxis type="number" dataKey="windSpeed" name="Wind Speed" unit="m/s" />
        <Tooltip cursor={{ strokeDasharray: '3 3' }} />
        <Legend />
        <Scatter name="Weather Data" data={chartData} fill="#82ca9d" />
      </ScatterChart>
    </ResponsiveContainer>
  );
};

return (
  <div className="App">
    <header className="header">
      <h1>Weather Forecast</h1>
      <p>
  This line chart shows the 7-day forecast for temperature. You can observe how temperatures fluctuate and identify trends. Below, the scatter plot helps compare humidity with wind speed.
</p>
      <h2>Current Time: {currentTime}</h2>
      <h3>Weather Time</h3>
    </header>

    {weather ? (
      <>
        <div className="dashboard">
        
          <div className="card">
            <h2>{weather.city_name}</h2>
            <p>{weather.country_code}</p>
            <p>City Name</p>
          </div>
          <div className="card">
            <h2>{weather.temp}°C</h2>
            <p>Temperature</p>
          </div>
          <div className="card">
            <h2>{weather.weather.description}</h2>
            <p>Condition</p>
          </div>
          
        </div>

        <div className="weather-container">
          <p>Elevation: {weather.elev_angle}</p>
        </div>
      </>
    ) : (
      <p>Loading weather ...</p>
    )}

    <div className="search-controls">
      <input
        type="text"
        value={value}
        placeholder="Search city weather"
        onChange={(e) => setValue(e.target.value)}
      />
      <button onClick={fetchSearchedWeather}>Search</button>
    </div>
    {weatherList.length > 0 && (
  <div className="weather-list">
    <table>
      <thead>
        <tr>
          <th>Date</th>
          <th>Temperature (°C)</th>
          <th>Humidity</th>
        </tr>
      </thead>
      <tbody>
      {weatherList.map((day, index) => (
  <tr key={index}>
    <td>{day.datetime}</td>
    <td>{day.temp}</td>
    <td>{day.rh}%</td> {/* rh = relative humidity */}
  </tr>
))}
      </tbody>
    </table>
  </div>
)}

{weatherList.length > 0 && (
  <div className="charts-container">
    <h3>Temperature Over Time</h3>
    {renderTemperatureChart()}
    <h3>Humidity vs Wind Speed</h3>
    {renderHumidityWindChart()}
  </div>
)}

  </div>
);
}

export default App
