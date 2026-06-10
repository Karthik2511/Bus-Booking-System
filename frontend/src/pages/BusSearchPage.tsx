import React, { useEffect, useState } from 'react';
import { useLocation, Link } from 'react-router-dom';
import './BusSearchPage.css';
import { CITIES } from '../data/cities';
import { calculateDistance, estimateTime, formatTime } from '../utils/distance';

interface Bus {
  id: string;
  name: string;
  availableSeats: number;
  price: number;
  seatTypes: string[];
  isAC: boolean;
  stops: { stopName: string; arrivalTime?: string; departureTime?: string }[];
}

const BusSearchPage: React.FC = () => {
  const [buses, setBuses] = useState<Bus[]>([]);
  const [loading, setLoading] = useState(false);
  
  const location = useLocation();
  const query = new URLSearchParams(location.search);
  const depCity = query.get('departureCity') || '';
  const arrCity = query.get('arrivalCity') || '';

  const [distance, setDistance] = useState<number | null>(null);
  const [timeStr, setTimeStr] = useState<string>('');

  useEffect(() => {
    if (depCity && arrCity) {
      const dCity = CITIES.find(c => c.name.toLowerCase() === depCity.toLowerCase());
      const aCity = CITIES.find(c => c.name.toLowerCase() === arrCity.toLowerCase());
      if (dCity && aCity) {
        const dist = calculateDistance(dCity.lat, dCity.lng, aCity.lat, aCity.lng);
        setDistance(dist);
        const time = estimateTime(dist);
        setTimeStr(formatTime(time.hours, time.minutes));
      }
    }
  }, [depCity, arrCity]);

  // Generic mock fetch for display
  useEffect(() => {
    fetchBuses();
  }, [location.search]);

  const fetchBuses = async () => {
    setLoading(true);
    try {
      // In a real app we'd construct the query string
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/buses${location.search}`);
      const data = await res.json();
      if (data.buses) setBuses(data.buses);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="search-page-container">
      <div className="search-header">
        <h1>Available Buses</h1>
        {distance !== null && (
          <p className="route-meta" style={{ marginTop: '10px', fontSize: '1.1rem', color: '#e0e0e0' }}>
            Distance: <strong>{distance} km</strong> | Estimated Time: <strong>{timeStr}</strong>
          </p>
        )}
      </div>
      <div className="search-content">
        <aside className="filters-sidebar">
          <h3>Filters</h3>
          <div className="filter-group">
            <label>Seat Type</label>
            <div><input type="checkbox"/> <label>Normal</label></div>
            <div><input type="checkbox"/> <label>Semi-Sleeper</label></div>
            <div><input type="checkbox"/> <label>Sleeper</label></div>
          </div>
          <div className="filter-group">
            <label>AC Type</label>
            <div><input type="checkbox"/> <label>AC</label></div>
            <div><input type="checkbox"/> <label>NON-AC</label></div>
          </div>
          <div className="filter-group">
            <label>Departure Time</label>
            <div><input type="checkbox"/> <label>Morning</label></div>
            <div><input type="checkbox"/> <label>Afternoon</label></div>
            <div><input type="checkbox"/> <label>Evening</label></div>
            <div><input type="checkbox"/> <label>Night</label></div>
          </div>
        </aside>

        <section className="buses-list">
          {loading ? <p>Loading buses...</p> : (
            buses.length > 0 ? buses.map(bus => (
              <div key={bus.id} className="bus-card">
                <div className="bus-info">
                  <h3>{bus.name}</h3>
                  <p className="bus-route">{depCity} to {arrCity}</p>
                  <p className="bus-time">{bus.stops[0]?.departureTime} - {bus.stops[bus.stops.length-1]?.arrivalTime}</p>
                  <div className="bus-tags">
                    {bus.seatTypes.map(t => <span key={t} className="tag tag-blue">{t}</span>)}
                    {bus.isAC ? <span className="tag tag-yellow">AC</span> : null}
                  </div>
                </div>
                <div className="bus-action">
                  <div className="bus-price">₹ {bus.price}</div>
                  <Link to={`/bus/${bus.id}`} className="book-btn">Book Now</Link>
                </div>
              </div>
            )) : <p>No buses found for this route.</p>
          )}
        </section>
      </div>
    </div>
  );
};

export default BusSearchPage;
