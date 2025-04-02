import { BrowserRouter as Router, Routes, Route, Navigate, useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import ClientManagement from './components/client/ClientManagement';
import ProductManagement from './components/products/ProductManagement';
import Comptability from './components/VenteAchat/index';
import Settings from './components/Infos/Settings';
import { UserType } from './types/user';

function App() {
  const navigate = useNavigate();
  const [user, setUser] = useState<UserType | null>(null);
  const [isLoading, setIsLoading] = useState(true); // Prevents premature rendering

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
      navigate("/dashboard", { replace: true }); // Prevents navigation history stacking
    }
    setIsLoading(false); // Mark the check as complete
  }, []); // Runs only once on initial load

  if (isLoading) return null; // Prevents rendering until check is complete

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
      <Routes>
        {!user ? (
          <>
            <Route path="/login" element={<Login onLogin={setUser} onSwitchToSignUp={() => navigate("/signup")} />} />
            <Route path="/signup" element={<SignUp onSignUp={setUser} onSwitchToLogin={() => navigate("/login")} />} />
            <Route path="*" element={<Navigate to="/login" replace />} />
          </>
        ) : (
          <>
            <Route path="/dashboard" element={<Dashboard user={user} onLogout={() => { setUser(null); localStorage.removeItem("user"); navigate("/login"); }} />} />
            <Route path="/clients" element={<ClientManagement />} />
            <Route path="/products" element={<ProductManagement />} />
            <Route path="/AchatVente/*" element={<Comptability />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="*" element={<Navigate to="/dashboard" replace />} />
          </>
        )}
      </Routes>
      <ToastContainer
        position="top-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
      />
    </div>
  );
}

export default function AppWrapper() {
  return (
    <Router>
      <App />
    </Router>
  );
}
