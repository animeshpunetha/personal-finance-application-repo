// frontend/src/App.js
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import HomePage from './pages/HomePage';
import RegisterPage from './pages/RegisterPage';
import LoginPage from './pages/LoginPage';
import DashboardPage from './pages/DashboardPage';
import TransactionsPage from './pages/TransactionsPage'
import ErrorBoundary from './components/ErrorBoundary';


function App() {
  return (
    <div className="bg-gray-900 text-white min-h-screen">
      <Router>
        <Navbar />
        <main className="container mx-auto p-8">
          <ErrorBoundary>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/register" element={<RegisterPage />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/dashboard" element={<DashboardPage />} />
              <Route path="/transactions" element={<TransactionsPage />} />
            </Routes>
          </ErrorBoundary>
        </main>
      </Router>
    </div>
  );
}

export default App;