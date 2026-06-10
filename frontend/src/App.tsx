import { BrowserRouter, Routes, Route } from 'react-router-dom';
import HomePage from './pages/HomePage';
import BusSearchPage from './pages/BusSearchPage';
import BusDetailsPage from './pages/BusDetailsPage';
import BookingConfirmationPage from './pages/BookingConfirmationPage';
import ContactPage from './pages/ContactPage';
import TicketPage from './pages/TicketPage';
import Navbar from './components/Navbar';

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <main className="main-content">
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route path="/search" element={<BusSearchPage />} />
          <Route path="/bus/:busId" element={<BusDetailsPage />} />
          <Route path="/confirm" element={<BookingConfirmationPage />} />
          <Route path="/ticket" element={<TicketPage />} />
          <Route path="/contact" element={<ContactPage />} />
        </Routes>
      </main>
    </BrowserRouter>
  );
}

export default App;
