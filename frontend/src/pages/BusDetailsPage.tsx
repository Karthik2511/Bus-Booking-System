import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import './BusDetailsPage.css';

interface Seat {
  seatNumber: number;
  isAvailable: boolean;
  row: number;
  column: number;
  seatType: string;
}

interface BusDetails {
  id: string;
  name: string;
  price: number;
  seats: Seat[];
}

const BusDetailsPage: React.FC = () => {
  const { busId } = useParams();
  const navigate = useNavigate();
  const [bus, setBus] = useState<BusDetails | null>(null);
  const [selectedSeats, setSelectedSeats] = useState<number[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchBusDetails();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [busId]);

  const fetchBusDetails = async () => {
    try {
      setLoading(true);
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/buses/${busId}`);
      if (!res.ok) throw new Error('Failed to load bus details');
      const data = await res.json();
      setBus(data);
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const toggleSeat = (seatNum: number, isAvailable: boolean) => {
    if (!isAvailable) return;
    if (selectedSeats.includes(seatNum)) {
      setSelectedSeats(selectedSeats.filter(s => s !== seatNum));
    } else {
      // Max 4 seats
      if (selectedSeats.length >= 4) {
        alert('You can select a maximum of 4 seats.');
        return;
      }
      setSelectedSeats([...selectedSeats, seatNum]);
    }
  };

  const handleProceed = async () => {
    if (selectedSeats.length === 0) return;
    try {
      const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';
      const res = await fetch(`${API_URL}/api/bookings/lock`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ busId, seats: selectedSeats })
      });
      if (!res.ok) {
        const errorData = await res.json();
        throw new Error(errorData.error || 'Failed to lock seats');
      }
      // Pass state to next page
      navigate('/confirm', { state: { busId, selectedSeats, price: bus?.price } });
    } catch (err: any) {
      alert(err.message);
      fetchBusDetails(); // refresh availability
    }
  };

  if (loading) return <div className="p-wrap">Loading layout...</div>;
  if (error) return <div className="p-wrap error">{error}</div>;
  if (!bus) return null;

  // Group seats by row for grid display
  const maxRow = Math.max(...bus.seats.map(s => s.row));
  const rows = Array.from({ length: maxRow }, (_, i) => i + 1);

  return (
    <div className="bus-details-container">
      <div className="bus-header">
        <h2>{bus.name}</h2>
        <p>Price per seat: ₹{bus.price}</p>
      </div>

      <div className="layout-checkout-grid">
        <div className="seat-layout-card">
          <h3>Select Your Seats</h3>
          <div className="bus-steering">Steering</div>
          <div className="seats-grid">
            {rows.map(row => (
              <div key={row} className="seat-row">
                {/* Columns 1 & 2 */}
                <div className="seat-pair">
                  {[1, 2].map(col => {
                    const seat = bus.seats.find(s => s.row === row && s.column === col);
                    if (!seat) return <div key={col} className="seat empty" />;
                    const isSelected = selectedSeats.includes(seat.seatNumber);
                    return (
                      <button
                        key={seat.seatNumber}
                        className={`seat ${seat.isAvailable ? 'available' : 'booked'} ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSeat(seat.seatNumber, seat.isAvailable)}
                        disabled={!seat.isAvailable}
                        title={`Seat ${seat.seatNumber}`}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
                {/* Aisle */}
                <div className="aisle"></div>
                {/* Columns 3 & 4 */}
                <div className="seat-pair">
                  {[3, 4].map(col => {
                    const seat = bus.seats.find(s => s.row === row && s.column === col);
                    if (!seat) return <div key={col} className="seat empty" />;
                    const isSelected = selectedSeats.includes(seat.seatNumber);
                    return (
                      <button
                        key={seat.seatNumber}
                        className={`seat ${seat.isAvailable ? 'available' : 'booked'} ${isSelected ? 'selected' : ''}`}
                        onClick={() => toggleSeat(seat.seatNumber, seat.isAvailable)}
                        disabled={!seat.isAvailable}
                        title={`Seat ${seat.seatNumber}`}
                      >
                        {seat.seatNumber}
                      </button>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
          <div className="legend">
            <div><span className="seat-sample available"></span> Available</div>
            <div><span className="seat-sample selected"></span> Selected</div>
            <div><span className="seat-sample booked"></span> Booked</div>
          </div>
        </div>

        <div className="checkout-card">
          <h3>Booking Summary</h3>
          <div className="summary-details">
            <p>Selected Seats: {selectedSeats.length > 0 ? selectedSeats.join(', ') : 'None'}</p>
            <p className="total-price">Total Price: ₹{selectedSeats.length * bus.price}</p>
          </div>
          <button 
            className="proceed-btn" 
            disabled={selectedSeats.length === 0}
            onClick={handleProceed}
          >
            Proceed to Payment
          </button>
        </div>
      </div>
    </div>
  );
};

export default BusDetailsPage;
