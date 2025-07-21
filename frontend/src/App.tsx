import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Signin } from './pages/Signin';
import { Signup } from './pages/Signup';
import Dashboard from './pages/Dashboard';
import AddExpense from './pages/AddExpense';
import ManageCategories from './pages/ManageCategories';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signin" element={<Signin />} />
        <Route path="/" element={<Signup />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/add-expense" element={<AddExpense />} />
        <Route path="/manage-categories" element={<ManageCategories />} />
      </Routes>
    </Router>
  );
}

export default App;
