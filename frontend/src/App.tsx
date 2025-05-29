import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import LandingPage from './pages/LandingPage';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import PersonalAccounts from './pages/PersonalAccounts';
import FamilyAccounts from './pages/FamilyAccounts';
import Goals from './pages/Goals';
import Savings from './pages/Savings';
import Expenses from './pages/Expenses';
import FamilyMembers from './pages/FamilyMembers';
import AddAccountForm from './pages/AddAccountForm';
import AddFamilyMember from './pages/AddFamilyMember';
import AddGoalPage from './pages/AddGoalPage';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/accounts" element={<PersonalAccounts />} />
        <Route path="/family-accounts" element={<FamilyAccounts />} />
        <Route path="/goals" element={<Goals />} />
        <Route path="/savings" element={<Savings />} />
        <Route path="/expenses" element={<Expenses />} />
        <Route path="/family" element={<FamilyMembers />} />
        <Route path="/add-account" element={<AddAccountForm />} />
        <Route path="/add-family-member" element={<AddFamilyMember />} />
        <Route path="/add-goal" element={<AddGoalPage />} />
      </Routes>
    </Router>
  );
}

export default App;