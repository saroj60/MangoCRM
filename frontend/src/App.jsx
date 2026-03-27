import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import Gardens from './pages/Gardens';
import Expenses from './pages/Expenses';
import Suppliers from './pages/Suppliers';
import Harvests from './pages/Harvests';
import Sales from './pages/Sales';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="gardens" element={<Gardens />} />
          <Route path="expenses" element={<Expenses />} />
          <Route path="suppliers" element={<Suppliers />} />
          <Route path="harvests" element={<Harvests />} />
          <Route path="sales" element={<Sales />} />
          <Route path="*" element={<div className="p-8 text-center text-gray-500">Page under construction...</div>} />
        </Route>
      </Routes>
    </Router>
  );
}

export default App;
