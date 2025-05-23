import React from 'react';
import { PieChart, Wallet, Target, Users } from 'lucide-react';

const Dashboard = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h1>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Wallet className="h-8 w-8 text-blue-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Total Balance</p>
                <p className="text-2xl font-semibold text-gray-900">$24,500</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <PieChart className="h-8 w-8 text-green-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Monthly Savings</p>
                <p className="text-2xl font-semibold text-gray-900">$1,200</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Target className="h-8 w-8 text-purple-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Active Goals</p>
                <p className="text-2xl font-semibold text-gray-900">4</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow p-6">
            <div className="flex items-center">
              <Users className="h-8 w-8 text-orange-500" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-500">Family Members</p>
                <p className="text-2xl font-semibold text-gray-900">3</p>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Recent Activity</h2>
          <div className="space-y-4">
            {[1, 2, 3].map((item) => (
              <div key={item} className="flex items-center justify-between py-3 border-b border-gray-200 last:border-0">
                <div className="flex items-center">
                  <div className="w-10 h-10 rounded-full bg-gray-100 flex items-center justify-center">
                    <Wallet className="h-5 w-5 text-gray-500" />
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-gray-900">Grocery Shopping</p>
                    <p className="text-sm text-gray-500">Today at 2:30 PM</p>
                  </div>
                </div>
                <span className="text-sm font-medium text-red-500">-$85.00</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;