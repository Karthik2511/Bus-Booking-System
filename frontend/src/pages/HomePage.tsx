import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './HomePage.css';
import { CITIES, type City } from '../data/cities';
import { calculateDistance, estimateTime, formatTime } from '../utils/distance';

const HomePage: React.FC = () => {
  const navigate = useNavigate();
  const [departure, setDeparture] = useState('');
  const [arrival, setArrival] = useState('');
  const [date, setDate] = useState('');

  const [depSuggestions, setDepSuggestions] = useState<City[]>([]);
  const [arrSuggestions, setArrSuggestions] = useState<City[]>([]);
  const [showDep, setShowDep] = useState(false);
  const [showArr, setShowArr] = useState(false);
  
  const [selectedDepCity, setSelectedDepCity] = useState<City | null>(null);
  const [selectedArrCity, setSelectedArrCity] = useState<City | null>(null);
  const [distance, setDistance] = useState<number | null>(null);
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    if (selectedDepCity && selectedArrCity) {
      const dist = calculateDistance(selectedDepCity.lat, selectedDepCity.lng, selectedArrCity.lat, selectedArrCity.lng);
      setDistance(dist);
      const time = estimateTime(dist);
      setTimeStr(formatTime(time.hours, time.minutes));
    } else {
      setDistance(null);
      setTimeStr('');
    }
  }, [selectedDepCity, selectedArrCity]);

  
  const handleCityChange = (value: string, type: 'dep' | 'arr') => {
    if (type === 'dep') {
      setDeparture(value);
      setSelectedDepCity(null);
      if (value.length >= 3) {
        setDepSuggestions(CITIES.filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
        setShowDep(true);
      } else {
        setShowDep(false);
      }
    } else {
      setArrival(value);
      setSelectedArrCity(null);
      if (value.length >= 3) {
        setArrSuggestions(CITIES.filter(c => c.name.toLowerCase().includes(value.toLowerCase())));
        setShowArr(true);
      } else {
        setShowArr(false);
      }
    }
  };

  const selectCity = (city: City, type: 'dep' | 'arr') => {
    if (type === 'dep') {
      setDeparture(city.name);
      setSelectedDepCity(city);
      setShowDep(false);
    } else {
      setArrival(city.name);
      setSelectedArrCity(city);
      setShowArr(false);
    }
  };

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (departure && arrival && date) {
      navigate(`/search?departureCity=${encodeURIComponent(departure)}&arrivalCity=${encodeURIComponent(arrival)}&date=${date}`);
    }
  };

  return (
    <div className="home-container" onClick={() => { setShowDep(false); setShowArr(false); }}>
      <div className="search-card" onClick={e => e.stopPropagation()}>
        <h2 className="search-title">Find Your Bus</h2>
        <form onSubmit={handleSearch} className="search-form">
          <div className="form-group autocomplete-group">
            <label>Departure City</label>
            <input 
              type="text" 
              placeholder="Enter departure city" 
              value={departure} 
              onChange={e => handleCityChange(e.target.value, 'dep')} 
              onFocus={() => { if(departure.length >= 3) setShowDep(true); setShowArr(false); }}
              required
            />
            {showDep && depSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {depSuggestions.map(city => (
                  <li key={city.name} onClick={() => selectCity(city, 'dep')}>{city.name}, {city.state}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group autocomplete-group">
            <label>Arrival City</label>
            <input 
              type="text" 
              placeholder="Enter arrival city" 
              value={arrival} 
              onChange={e => handleCityChange(e.target.value, 'arr')} 
              onFocus={() => { if(arrival.length >= 3) setShowArr(true); setShowDep(false); }}
              required
            />
            {showArr && arrSuggestions.length > 0 && (
              <ul className="suggestions-list">
                {arrSuggestions.map(city => (
                  <li key={city.name} onClick={() => selectCity(city, 'arr')}>{city.name}, {city.state}</li>
                ))}
              </ul>
            )}
          </div>
          <div className="form-group">
            <label>Date of Travel</label>
            <input 
              type="date" 
              value={date} 
              onChange={e => setDate(e.target.value)} 
              onFocus={() => { setShowDep(false); setShowArr(false); }}
              required
            />
          </div>
          <button type="submit" className="search-btn">Search Buses</button>
        </form>
        {distance !== null && (
          <div className="route-info-display">
            <p className="route-distance-text">
              <strong>Distance:</strong> {distance} km <span className="divider">|</span> <strong>Time:</strong> {timeStr}
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default HomePage;
