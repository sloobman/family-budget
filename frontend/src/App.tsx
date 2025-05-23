import React from 'react';
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
      </Routes>
    </Router>
  );
}

export default App;