// frontend/src/components/Navbar.js
import { Link } from 'react-router-dom';

const Navbar = () => {
  return (
    <nav className="bg-gray-800 p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-xl font-bold text-400">
          FinanceApp
        </Link>
        <div className="flex gap-4">
          <Link to="/dashboard" className="text-blue-400 hover:text-blue-300">
            Dashboard
          </Link>
          <Link to="/transactions" className="text-blue-400 hover:text-blue-300">
            Transaction
          </Link>
          <Link to="/login" className="text-blue-400 hover:text-blue-300">
            Login
          </Link>
          <Link to="/register" className="text-blue-400 hover:text-blue-300">
            Register
          </Link>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;