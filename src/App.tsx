import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useState } from 'react';
import { ToastContainer } from 'react-toastify'; // Import ToastContainer
import 'react-toastify/dist/ReactToastify.css'; // Import toast styles
import Login from './components/Auth/Login';
import SignUp from './components/Auth/SignUp';
import Dashboard from './components/dashboard/Dashboard';
import ClientManagement from './components/client/ClientManagement';
import ProductManagement from './components/products/ProductManagement';
import Comptability from './components/comptability/index'; // Fixed path (assuming correct)

export type UserType = {
  firstName: string;
  lastName: string;
  email: string;
};

function App() {
  const [user, setUser] = useState<UserType | null>(null);

  return (
    <Router>
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-blue-100">
        <Routes>
          {!user ? (
            <>
              <Route
                path="/login"
                element={<Login onLogin={setUser} onSwitchToSignUp={() => window.location.href = "/signup"} />}
              />
              <Route
                path="/signup"
                element={<SignUp onSignUp={setUser} onSwitchToLogin={() => window.location.href = "/login"} />}
              />
              <Route path="*" element={<Navigate to="/login" replace />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard user={user} onLogout={() => setUser(null)} />} />
              <Route path="/clients" element={<ClientManagement />} />
              <Route path="/products" element={<ProductManagement />} />
              <Route path="/comptability/*" element={<Comptability />} />
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
    </Router>
  );
}

export default App;