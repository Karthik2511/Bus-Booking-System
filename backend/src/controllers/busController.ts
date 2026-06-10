import { Request, Response } from 'express';
import { busesData, busSeatsData, activeLocks, initSeatsForBus, Bus } from '../data';
import crypto from 'crypto';

export const getBuses = (req: Request, res: Response) => {
  try {
    const { departureCity, arrivalCity, date, seatType, isAC, departureSlot, page = '1', pageSize = '10' } = req.query;

    if (!departureCity || !arrivalCity || !date) {
      return res.status(400).json({ error: 'departureCity, arrivalCity, and date are required parameters.' });
    }

    // 1. Date Validation
    const requestedDate = new Date(date as string);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Strip time
    
    if (requestedDate < today) {
      return res.status(400).json({ error: 'No buses available on that day (trip completed).' });
    }

    const depCity = (departureCity as string).toLowerCase();
    const arrCity = (arrivalCity as string).toLowerCase();

    // 2. Default filtering
    let filteredBuses = busesData.filter(bus => {
      const depStopIndex = bus.stops.findIndex(s => s.stopName.toLowerCase() === depCity);
      const arrStopIndex = bus.stops.findIndex(s => s.stopName.toLowerCase() === arrCity);
      if (depStopIndex === -1 || arrStopIndex === -1 || depStopIndex >= arrStopIndex) {
        return false;
      }
      return true;
    });

    // 3. Dynamic Generation
    if (filteredBuses.length === 0) {
      // Generate 2-4 buses dynamically
      const numToGenerate = Math.floor(Math.random() * 3) + 2; 
      const mockNames = ['Express Deluxe', 'Royal Cruiser', 'ZingBus AC Sleeper', 'SRS Connect', 'KSRTC Airavat', 'VRL Volvo Multi-Axle'];
      
      for (let i = 0; i < numToGenerate; i++) {
        const randName = mockNames[Math.floor(Math.random() * mockNames.length)];
        const isAcRand = Math.random() > 0.5;
        const seatTypeRand = isAcRand ? ['sleeper', 'semi-sleeper'] : ['normal'];
        
        let hour = Math.floor(Math.random() * 24);
        let ampm = hour >= 12 ? 'PM' : 'AM';
        let displayHour = hour % 12 === 0 ? 12 : hour % 12;
        let depTimeStr = `${displayHour < 10 ? '0' : ''}${displayHour}:00 ${ampm}`;

        let arrHour = (hour + Math.floor(Math.random() * 8) + 4) % 24;
        let arrAmpm = arrHour >= 12 ? 'PM' : 'AM';
        let arrDisplayHour = arrHour % 12 === 0 ? 12 : arrHour % 12;
        let arrTimeStr = `${arrDisplayHour < 10 ? '0' : ''}${arrDisplayHour}:30 ${arrAmpm}`;

        const newBus: Bus = {
          id: crypto.randomUUID(),
          name: randName,
          availableSeats: 30 + Math.floor(Math.random() * 10),
          price: 500 + Math.floor(Math.random() * 1500),
          seatTypes: seatTypeRand,
          isAC: isAcRand,
          stops: [
            { stopName: String(departureCity), departureTime: depTimeStr },
            { stopName: String(arrivalCity), arrivalTime: arrTimeStr }
          ]
        };

        busesData.push(newBus);
        initSeatsForBus(newBus);
        filteredBuses.push(newBus);
      }
    }

    // 4. Secondary Filters
    if (seatType) {
      filteredBuses = filteredBuses.filter(bus => bus.seatTypes.includes(seatType as string));
    }

    if (isAC !== undefined) {
      const isACBool = isAC === 'true';
      filteredBuses = filteredBuses.filter(bus => bus.isAC === isACBool);
    }

    if (departureSlot) {
      filteredBuses = filteredBuses.filter(bus => {
        const depStopIndex = bus.stops.findIndex(s => s.stopName.toLowerCase() === depCity);
        const depTime = bus.stops[depStopIndex].departureTime || bus.stops[depStopIndex].arrivalTime;
        if (!depTime) return false;
        
        const isMorning = depTime.includes('AM');
        let hour = parseInt(depTime.split(':')[0], 10);
        if (hour === 12 && isMorning) hour = 0;
        if (hour === 12 && !isMorning) hour = 12;
        else if (!isMorning) hour += 12;

        let slotMatch = false;
        if (departureSlot === 'morning' && hour >= 6 && hour < 12) slotMatch = true;
        if (departureSlot === 'afternoon' && hour >= 12 && hour < 16) slotMatch = true;
        if (departureSlot === 'evening' && hour >= 16 && hour < 20) slotMatch = true;
        if (departureSlot === 'night' && (hour >= 20 || hour < 6)) slotMatch = true;
        
        return slotMatch;
      });
    }

    const pageCount = parseInt(page as string, 10);
    const pageSizeCount = parseInt(pageSize as string, 10);
    
    const paginatedBuses = filteredBuses.slice((pageCount - 1) * pageSizeCount, pageCount * pageSizeCount);

    res.json({
      page: pageCount,
      pageSize: pageSizeCount,
      totalPages: Math.ceil(filteredBuses.length / pageSizeCount),
      totalBuses: filteredBuses.length,
      buses: paginatedBuses
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};

export const getBusById = (req: Request, res: Response) => {
  try {
    const { busId } = req.params;
    const bus = busesData.find(b => b.id === busId);
    if (!bus) {
      return res.status(404).json({ error: 'Bus not found' });
    }

    const now = Date.now();
    const seats = busSeatsData[busId as string] || [];

    const mappedSeats = seats.map((s: any) => {
      const lockKey = `${busId}_${s.seatNumber}`;
      const lock = activeLocks[lockKey];
      let isAvailable = s.isAvailable;

      if (lock && lock.lockedAt > now - 2 * 60 * 1000) {
        isAvailable = false;
      }
      return {
        ...s,
        isAvailable
      };
    });

    res.json({
      id: bus.id,
      name: bus.name,
      availableSeats: mappedSeats.filter((s: any) => s.isAvailable).length,
      price: bus.price,
      seatTypes: bus.seatTypes,
      isAC: bus.isAC,
      stops: bus.stops,
      seats: mappedSeats
    });
  } catch (err) {
    res.status(500).json({ error: 'Internal server error' });
  }
};
