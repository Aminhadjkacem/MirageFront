import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
//import { UserType } from './types';
import Login from './components/Login';
import SignUp from './components/SignUp';
import Dashboard from './components/Dashboard';
import ClientManagement from './components/ClientManagement';
import { useState } from 'react';
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
              <Route path="*" element={<Navigate to="/login" />} />
            </>
          ) : (
            <>
              <Route path="/dashboard" element={<Dashboard user={user} onLogout={() => setUser(null)} />} />
              <Route path="*" element={<Navigate to="/dashboard" />} />
              <Route path="/clients" element={<ClientManagement />} />
            </>
          )}
        </Routes>
      </div>
    </Router>
  );
}

export default App;
