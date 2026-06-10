import React, { useEffect } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import './TicketPage.css';

const TicketPage: React.FC = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const state = location.state as any;

  useEffect(() => {
    if (!state || !state.ticketId) {
      navigate('/');
    }
  }, [state, navigate]);

  if (!state) return null;

  return (
    <div className="ticket-page-container">
      <div className="ticket-success-header">
        <div className="success-icon">✓</div>
        <h2>Booking Successful!</h2>
        <p>Your seats have been confirmed.</p>
      </div>

      <div className="ticket-card">
        <div className="ticket-header">
           <h3>Boarding Pass</h3>
           <span className="ticket-id">#{state.ticketId}</span>
        </div>
        
        <div className="ticket-body">
           <div className="ticket-section">
             <h4>Passenger Details</h4>
             <div className="passenger-list">
               {state.passengers?.map((p: any, i: number) => (
                  <div key={i} className="passenger-row">
                     <div className="p-info">
                       <strong>{p.name}</strong>
                       <span>{p.age} yrs, {p.gender}</span>
                     </div>
                     <div className="p-seat">
                       Seat <span>{state.seats[i]}</span>
                     </div>
                  </div>
               ))}
             </div>
           </div>
           
           <div className="ticket-divider"></div>
           
           <div className="ticket-section ticket-meta">
             <div className="meta-block">
               <span className="meta-label">Bus Identifier</span>
               <span className="meta-value">{state.busId}</span>
             </div>
             <div className="meta-block">
               <span className="meta-label">Total Amount Paid</span>
               <span className="meta-value price-tag">₹{state.price}</span>
             </div>
           </div>
        </div>
        
        <div className="ticket-footer">
           <div className="qr-code-wrapper">
             <img src={`https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=Ticket-${state.ticketId}&bgcolor=ffffff`} alt="QR Code" className="qr-img"/>
           </div>
           <p className="scan-text">Please show this code at boarding</p>
        </div>
      </div>
      
      <div className="ticket-actions">
        <button className="btn-secondary" onClick={() => window.print()}>Print / Save PDF</button>
        <Link to="/" className="btn-primary">Return to Home</Link>
      </div>
    </div>
  );
};

export default TicketPage;
