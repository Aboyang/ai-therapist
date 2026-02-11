import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import Onboarding from './onboarding/Onboarding';
import Home from './Home/Home';
import ConvoAI from './convoai/ConvoAI';
import Dashboard from './dashboard/Dashboard';
import BookAppointment from './booking/BookAppointment';

function App() {
  return (
  <div className="container">
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/onboarding" element={<Onboarding />} />
        <Route path="/convo" element={<ConvoAI />} />
        <Route path="/book-appointment" element={<BookAppointment />} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </BrowserRouter>
  </div>
  );
}

export default App;
