export interface Stop {
  stopName: string;
  arrivalTime?: string;
  departureTime?: string;
}

export interface Bus {
  id: string;
  name: string;
  availableSeats: number;
  price: number;
  seatTypes: string[];
  isAC: boolean;
  stops: Stop[];
}

export interface Seat {
  seatNumber: number;
  isAvailable: boolean;
  row: number;
  column: number;
  seatType: string;
  sleeperLevel?: "upper" | "lower";
}

export const busesData: Bus[] = [
  {
    id: "b2587d1c-29f8-4b0f-a01c-1e2f9f5b7a61",
    name: "KSRTC Airavat",
    availableSeats: 30,
    price: 1000,
    seatTypes: ["normal"],
    isAC: true,
    stops: [
      { stopName: "Bangalore", departureTime: "09:00 AM" },
      { stopName: "Hosur", arrivalTime: "10:00 AM", departureTime: "10:15 AM" },
      { stopName: "Vellore", arrivalTime: "01:00 PM", departureTime: "01:15 PM" },
      { stopName: "Chennai", arrivalTime: "03:00 PM" }
    ]
  },
  {
    id: "c12f7da0-99c7-4b19-9eb0-dbe5e5c5bf9d",
    name: "SRS Travels",
    availableSeats: 5,
    price: 600,
    seatTypes: ["semi-sleeper"],
    isAC: false,
    stops: [
      { stopName: "Bangalore", departureTime: "12:00 PM" },
      { stopName: "Krishnagiri", arrivalTime: "01:30 PM", departureTime: "01:45 PM" },
      { stopName: "Vellore", arrivalTime: "04:00 PM", departureTime: "04:15 PM" },
      { stopName: "Chennai", arrivalTime: "06:00 PM" }
    ]
  },
  {
    id: "d9e87d1c-29f8-4b0f-a01c-1e2f9f5b7a11",
    name: "VRL Travels (Sleeper)",
    availableSeats: 12,
    price: 1500,
    seatTypes: ["sleeper"],
    isAC: true,
    stops: [
      { stopName: "Bangalore", departureTime: "09:00 PM" },
      { stopName: "Chennai", arrivalTime: "05:00 AM" }
    ]
  }
];

// Generate seats for buses to map initially
export const busSeatsData: Record<string, Seat[]> = {};

// Helper to init seats
export function initSeatsForBus(bus: Bus) {
  const seats: Seat[] = [];
  const rows = Math.ceil(bus.availableSeats / 4);
  for (let i = 0; i < bus.availableSeats; i++) {
    seats.push({
      seatNumber: i + 1,
      isAvailable: Math.random() > 0.2, // 80% available
      row: Math.floor(i / 4) + 1,
      column: (i % 4) + 1,
      seatType: bus.seatTypes[0]
    });
  }
  busSeatsData[bus.id] = seats;
}

busesData.forEach((bus) => initSeatsForBus(bus));

// A map to keep track of locked seats
// key: "busId_seatNumber", value: { lockedAt: timestamp }
export const activeLocks: Record<string, { lockedAt: number }> = {};
