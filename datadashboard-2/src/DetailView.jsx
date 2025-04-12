import { useParams } from 'react-router-dom';
import { useEffect, useState } from 'react';
const API_KEY = import.meta.env.VITE_APP_API_KEY;


function DetailView() {
    const { city } = useParams();
    const [detail, setDetail] = useState(null);
    const [cityName, setCityName] = useState('');


    useEffect(() => {
        fetch(`https://api.weatherbit.io/v2.0/forecast/daily?city=${city}&key=47fe9e4bf0ae4af8bd9bdaba98a27c46`)
          .then(res => res.json())
          .then(data => setDetail(data.data[0]))
          .catch(err => console.error("Error loading detail", err));
      }, [city]);
    
      if (!detail) return <p>Loading detail...</p>;
    
      return (
        <div className="detail-view">
          <h2>3-Day Forecast for {cityName}</h2>
      {detail.slice(0, 3).map((day, idx) => (
        <div key={idx} className="forecast-card">
          <p><strong>Date:</strong> {day.datetime}</p>
          <p>Temperature: {detail.temp}°C</p>
          <p>Condition: {detail.weather.description}</p>
          <p>Wind Speed: {detail.wind_spd} m/s</p>
          <p>Humidity: {detail.rh}%</p>
          <p>Visibility: {detail.vis} km</p>
          {/* More fields as needed */}
        </div>
      ))}
      </div>
      );
}

  export default DetailView;