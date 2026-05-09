import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import Footer from './components/Footer';

import Home from './pages/Home';
import Tutorials from './pages/Tutorials';
import TutorialDetail from './pages/TutorialDetail';
import AdminLogin from './pages/AdminLogin';
import AdminPanel from './pages/AdminPanel';

// Protected route for admin
const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();
  if (loading) return <div className="spinner" />;
  if (!user || !isAdmin) return <Navigate to="/admin/login" replace />;
  return children;
};

function AppInner() {
  return (
    <BrowserRouter>
      <Navbar />
      <main style={{ minHeight: 'calc(100vh - 160px)' }}>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/tutorials" element={<Tutorials />} />
          <Route path="/tutorials/:id" element={<TutorialDetail />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route
            path="/admin"
            element={
              <AdminRoute>
                <AdminPanel />
              </AdminRoute>
            }
          />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>
      <Footer />
      <ToastContainer
        position="bottom-right"
        theme="dark"
        toastStyle={{
          background: '#13152a',
          border: '1px solid rgba(255,255,255,0.07)',
          color: '#f0f0f5',
          fontFamily: "'DM Sans', sans-serif",
        }}
      />
    </BrowserRouter>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppInner />
    </AuthProvider>
  );
}
