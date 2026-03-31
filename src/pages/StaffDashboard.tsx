import React from 'react';
import { motion } from 'motion/react';
import { LogOut, Calendar, Clock, MessageSquare, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { auth, logout } from '../firebase';

export const StaffDashboard: React.FC = () => {
  const navigate = useNavigate();
  const user = auth.currentUser;

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  return (
    <div className="min-h-screen bg-stone-50 pt-24 pb-12 px-4">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <div>
            <h1 className="text-3xl font-bold text-stone-900">Staff Portal</h1>
            <p className="text-stone-500">Welcome back, {user?.displayName || 'Staff Member'}</p>
          </div>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-xl transition-colors font-medium"
          >
            <LogOut size={18} />
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="w-12 h-12 bg-brand-green/10 rounded-xl flex items-center justify-center text-brand-green mb-4">
              <Calendar size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Schedule</h3>
            <p className="text-stone-500 text-sm">View your daily classes and activities.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="w-12 h-12 bg-brand-orange/10 rounded-xl flex items-center justify-center text-brand-orange mb-4">
              <Clock size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Attendance</h3>
            <p className="text-stone-500 text-sm">Mark and track student attendance.</p>
          </div>
          <div className="bg-white p-6 rounded-2xl shadow-sm border border-stone-200">
            <div className="w-12 h-12 bg-brand-teal/10 rounded-xl flex items-center justify-center text-brand-teal mb-4">
              <MessageSquare size={24} />
            </div>
            <h3 className="text-lg font-bold text-stone-900 mb-2">Messages</h3>
            <p className="text-stone-500 text-sm">Communicate with parents and admin.</p>
          </div>
        </div>
      </div>
    </div>
  );
};
