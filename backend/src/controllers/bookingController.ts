import { Request, Response } from 'express';
import { activeLocks, busSeatsData, busesData } from '../data';
import crypto from 'crypto';

export const lockSeats = (req: Request, res: Response) => {
  const { busId, seats } = req.body;
  if (!busId || !seats || !Array.isArray(seats)) {
    return res.status(400).json({ error: 'Missing busId or seats array' });
  }

  const bus = busesData.find(b => b.id === busId);
  if (!bus) {
    return res.status(404).json({ error: 'Bus not found' });
  }

  const now = Date.now();
  
  
  const busSeats = busSeatsData[busId] || [];
  for (const seatNumber of seats) {
    const seatObj = busSeats.find(s => s.seatNumber === seatNumber);
    if (!seatObj) {
      return res.status(400).json({ error: `Seat ${seatNumber} does not exist.` });
    }
    if (!seatObj.isAvailable) {
      return res.status(400).json({ error: `Seat ${seatNumber} is already permanently booked.` });
    }

    const lockKey = `${busId}_${seatNumber}`;
    const activeLock = activeLocks[lockKey];
    if (activeLock && activeLock.lockedAt > now - 2 * 60 * 1000) {
      return res.status(400).json({ error: `Seat ${seatNumber} is currently locked by another user.` });
    }
  }

  
  for (const seatNumber of seats) {
    const lockKey = `${busId}_${seatNumber}`;
    activeLocks[lockKey] = { lockedAt: now };
  }

  res.json({ message: 'Seats locked successfully for 2 minutes' });
};

export const confirmBooking = (req: Request, res: Response) => {
  const { busId, seats, passengerDetails } = req.body;

  if (!busId || !seats || !passengerDetails) {
    return res.status(400).json({ error: 'Missing required parameters' });
  }

  const bus = busesData.find(b => b.id === busId);
  if (!bus) return res.status(404).json({ error: 'Bus not found' });

  const busSeats = busSeatsData[busId] || [];
  
  
  for (const seatNumber of seats) {
    const seatObj = busSeats.find(s => s.seatNumber === seatNumber);
    if (seatObj) {
      seatObj.isAvailable = false;
    }
    
    
    const lockKey = `${busId}_${seatNumber}`;
    delete activeLocks[lockKey];
  }

  const ticketId = crypto.randomUUID ? crypto.randomUUID() : 'TICKET-' + Date.now();

  res.json({
    message: 'Booking successful',
    id: bus.id,
    ticketId,
    seatsBooked: seats,
    totalPrice: seats.length * bus.price
  });
};
