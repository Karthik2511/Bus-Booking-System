# 2.0 Bus - Modern Bus Booking Platform & Seating Engine

A high-performance, responsive, and beautifully designed web application and reservation engine for searching inter-city buses, selecting seats in real-time, and generating digital tickets. Built using a modern decoupled architecture: **React 19**, **TypeScript**, **Vite**, and **Node.js Express**.

This showcase repository demonstrates the project structure, clean architectural choices, and design aesthetics of the complete passenger-facing search and booking web application, without exposing proprietary configuration details or production environment variables.

---

## 📸 Interface Showcase

Below are actual screenshots of the application's user interface, displaying the dark-themed aesthetic, custom layouts, and interactive workflows:

### 1. Find Your Bus (Home Page)
An intuitive search portal featuring location autocomplete, calendar controls, and a real-time **Haversine Distance Calculator** that displays trip distance and estimated travel times dynamically.
![Find Your Bus Page](screenshots/home_page.png)

### 2. Available Buses & Filters (Search Results)
A rich filtering interface allowing users to filter routes by AC/Non-AC types, specific seat configurations (Sleeper, Semi-Sleeper, Normal), and departure times (Morning, Afternoon, Evening, Night).
![Available Buses Page](screenshots/search_page.png)

### 3. Interactive Seating Grid (Bus Details)
A responsive CSS Grid rendering of the bus layout including steering positions, seat-pairs, aisle gaps, and current availability. Selected seats are dynamically highlighted in real-time.
![Interactive Seating Grid](screenshots/bus_details.png)

### 4. Passenger Details Confirmation
A streamlined checkout page mapping details (Name, Age, Gender) for each selected seat to validate boarding profiles.
![Passenger Details Page](screenshots/booking_confirmation.png)

### 5. Boarding Pass & Digital Receipt
The final ticket confirmation voucher, displaying the receipt, seat numbers, route info, and a unique transaction UUID.
![Ticket Page](screenshots/ticket_page.png)

---

## 🛠️ Technology Stack & System Architecture

The project is structured into two primary decoupled tiers:

1. **Passenger-Facing Client App (React + TypeScript + Vite)**:
   - Powered by **Vite** for sub-second hot module replacement (HMR) and optimized build bundles.
   - Styled using custom CSS with a dark neon theme, premium typography (**Inter**), and responsive layout components.
   - Dynamic date manipulation and query-string parameter state synchronizations.
   - Implements the **Haversine Formula** locally to calculate coordinates-based distances between Indian cities on demand.

2. **Decoupled REST API Backend (Node.js + Express + TypeScript)**:
   - Serves route schedules, pricing metadata, and active bus seat layouts.
   - Utilizes an **in-memory data-store** initialized with rich mock data.
   - Implements a **Transactional Seat Locking Mechanism** (2-minute TTL expiration) to avoid race conditions and double-bookings.

### Seat Locking Flow & System Architecture

```mermaid
graph TD
    A[Passenger Browser] -->|1. Search Routes & Calc Distance| B[React Frontend App]
    B -->|2. Get Available Buses & Layout| C[Express Backend Server]
    C -->|Read/Write Data Store| D[(In-Memory Database & Locks)]
    
    B -->|3. Acquire 2-min Seat Lock| C
    C -->|Verify Availability & Apply TTL Lock| D
    B -->|4. Submit Passenger Details| C
    C -->|Mark Booked & Release Lock| D
    C -->|5. Return Unique Booking Receipt| B
```

---

## 📂 Codebase Directory Outline

```
bus-booking-showcase/
├── backend/
│   ├── src/
│   │   ├── controllers/
│   │   │   ├── bookingController.ts
│   │   │   └── busController.ts
│   │   ├── routes/
│   │   │   └── api.routes.ts
│   │   ├── data.ts
│   │   └── index.ts
│   ├── package.json
│   └── tsconfig.json
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── assets/
│   │   ├── components/
│   │   │   ├── Navbar.tsx
│   │   │   └── Navbar.css
│   │   ├── data/
│   │   │   └── cities.ts
│   │   ├── pages/
│   │   │   ├── HomePage.tsx
│   │   │   ├── BusSearchPage.tsx
│   │   │   ├── BusDetailsPage.tsx
│   │   │   ├── BookingConfirmationPage.tsx
│   │   │   └── TicketPage.tsx
│   │   ├── utils/
│   │   │   └── distance.ts
│   │   ├── App.tsx
│   │   ├── main.tsx
│   │   └── index.css
│   ├── package.json
│   ├── vite.config.ts
│   └── tsconfig.json
├── screenshots/
└── README.md
```

---

## ⚡ Development Setup

### Prerequisites
- Node.js (version 18 or above)
- npm or yarn package manager

### Step 1: Install Dependencies
Navigate into both directories and install the packages:
```bash
# Install backend packages
cd backend
npm install

# Install frontend packages
cd ../frontend
npm install
```

### Step 2: Start the Servers
Launch the local servers in separate terminal instances:

```bash
# Start backend API (runs on port 3000)
cd backend
npm run dev

# Start frontend Client (runs on port 5173)
cd frontend
npm run dev
```

Open `http://localhost:5173/` in your browser to interact with the application.
