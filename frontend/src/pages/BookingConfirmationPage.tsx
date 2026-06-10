import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import './BookingConfirmationPage.css';

interface Passenger {
  name: string;
  age: string;
  gender: string;
}

const BookingConfirmationPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as { busId: string; selectedSeats: number[]; price: number } | null;

  const [passengers, setPassengers] = useState<Passenger[]>([]);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes (user needs time)
  const [timerExpired, setTimerExpired] = useState(false);
  const [loading, setLoading] = useState(false);
  
  const [busDetails, setBusDetails] = useState<any>(null);

  useEffect(() => {
    if (!state || !state.selectedSeats || state.selectedSeats.length === 0) {
      navigate('/');
      return;
    }

    setPassengers(state.selectedSeats.map(() => ({ name: '', age: '', gender: '' })));
    fetchBusDetails(state.busId);
  }, [state, navigate]);

  const fetchBusDetails = async (id: string) => {
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/buses/${id}`);
      if (res.ok) {
        const data = await res.json();
        setBusDetails(data);
      }
    } catch (e) {
      console.error(e);
    }
  };

  useEffect(() => {
    if (timeLeft <= 0) {
      setTimerExpired(true);
      return;
    }

    const timer = setInterval(() => {
      setTimeLeft(prev => prev - 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [timeLeft]);

  const handlePassengerChange = (index: number, field: keyof Passenger, value: string) => {
    const newPass = [...passengers];
    newPass[index][field] = value;
    setPassengers(newPass);
  };

  const handleConfirm = async () => {
    if (timerExpired) {
      alert('Your session logic has expired. Please select seats again.');
      navigate(`/bus/${state?.busId}`);
      return;
    }

    const isValid = passengers.every(p => p.name.trim() !== '' && p.age.trim() !== '' && p.gender !== '');
    if (!isValid) {
      alert('Please fill in all passenger details.');
      return;
    }

    setLoading(true);
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          busId: state?.busId,
          seats: state?.selectedSeats,
          passengerDetails: passengers
        })
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Booking failed');

      navigate('/ticket', { 
        state: { 
          ticketId: data.ticketId,
          passengers,
          busId: state?.busId,
          seats: state?.selectedSeats,
          price: (state?.price || 0) * (state?.selectedSeats?.length || 0)
        }
      });
    } catch (err: any) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds: number) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  if (!state) return null;

  return (
    <div className="confirmation-container">
      <div className="confirm-page-header">
        <h2>Payment and Booking Confirmation</h2>
        <div className={`timer-badge ${timerExpired ? 'expired' : ''}`}>
           Time remaining: <span className="countdown">{formatTime(timeLeft)}</span>
        </div>
      </div>

      <div className="confirm-layout">
        {/* Left Column: Passenger Forms */}
        <div className="left-column">
          <div className="passengers-container-card">
            <h3 className="section-title">Passenger Details</h3>
            
            <div className="passenger-forms-wrapper">
              {passengers.map((p, index) => (
                <div key={index} className="passenger-form-group">
                  <div className="p-header">
                    <h4>Passenger {index + 1}</h4>
                    <span className="p-seat-badge">Seat {state.selectedSeats[index]}</span>
                  </div>
                  
                  <div className="input-row">
                    <div className="input-field">
                      <label>Name</label>
                      <input
                        type="text"
                        value={p.name}
                        onChange={e => handlePassengerChange(index, 'name', e.target.value)}
                        placeholder="Full Name"
                        disabled={timerExpired}
                      />
                    </div>
                    <div className="input-field">
                      <label>Age</label>
                      <input
                        type="number"
                        value={p.age}
                        onChange={e => handlePassengerChange(index, 'age', e.target.value)}
                        placeholder="Age"
                        min="1"
                        disabled={timerExpired}
                      />
                    </div>
                  </div>
                  <div className="p-gender-row">
                    <label>Gender:</label>
                    <div className="radio-group">
                      <label className="custom-radio">
                        <input type="radio" name={`gender-${index}`} value="Male" onChange={e => handlePassengerChange(index, 'gender', e.target.value)} disabled={timerExpired}/>
                        <span className="radio-mark"></span> Male
                      </label>
                      <label className="custom-radio">
                        <input type="radio" name={`gender-${index}`} value="Female" onChange={e => handlePassengerChange(index, 'gender', e.target.value)} disabled={timerExpired}/>
                        <span className="radio-mark"></span> Female
                      </label>
                      <label className="custom-radio">
                        <input type="radio" name={`gender-${index}`} value="Other" onChange={e => handlePassengerChange(index, 'gender', e.target.value)} disabled={timerExpired}/>
                        <span className="radio-mark"></span> Other
                      </label>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <button 
              className="confirm-btn"
              onClick={handleConfirm}
              disabled={loading || timerExpired}
            >
              {loading ? 'Processing...' : 'Confirm Booking'}
            </button>
          </div>
        </div>

        {/* Right Column: Summaries */}
        <div className="right-column">
          <div className="summary-card bus-details">
            <h3>Bus Details</h3>
            {busDetails ? (
              <div className="b-info">
                <p className="b-name">{busDetails.name}</p>
                <p className="b-type">{busDetails.isAC ? 'AC' : 'Non-AC'} {busDetails.seatTypes.join(', ')}</p>
                <div className="b-route">
                   <div className="route-point">
                      <span className="dot"></span>
                      <span className="place">{busDetails.stops[0]?.stopName}</span>
                      <span className="time">{busDetails.stops[0]?.departureTime}</span>
                   </div>
                   <div className="route-line"></div>
                   <div className="route-point">
                      <span className="dot"></span>
                      <span className="place">{busDetails.stops[busDetails.stops.length-1]?.stopName}</span>
                      <span className="time">{busDetails.stops[busDetails.stops.length-1]?.arrivalTime}</span>
                   </div>
                </div>
              </div>
            ) : (
              <p>Loading bus details...</p>
            )}
          </div>

          <div className="summary-card booking-summary">
            <h3>Booking Summary</h3>
            <div className="s-row">
              <span className="s-label">Selected Seats</span>
              <span className="s-value">{state.selectedSeats.join(', ')}</span>
            </div>
            <div className="s-divider"></div>
            <div className="s-row s-total">
              <span className="s-label">Total Price</span>
              <span className="s-value grand-total">₹{state.selectedSeats.length * state.price}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookingConfirmationPage;
