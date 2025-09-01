import { Link } from 'react-router-dom';

const HomePage = () => { 
  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col justify-between">
      {/* Main content in center */}
      <div className="flex flex-col justify-center items-center text-center flex-grow px-6">
        {/* Big App Title */}
        <h1 className="text-6xl sm:text-8xl font-extrabold mb-6">
          Personal Finance Assistant
        </h1>


        {/* Buttons */}
        <div className="flex gap-6">
          <Link 
            to="/login" 
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md transition-transform transform hover:scale-105"
          >
            Sign In
          </Link>
          <Link 
            to="/register" 
            className="bg-green-600 hover:bg-green-700 text-white font-semibold py-3 px-8 rounded-lg text-lg shadow-md transition-transform transform hover:scale-105"
          >
            Create Account
          </Link>
        </div>
      </div>

      {/* Footer */}
      <footer className="text-xs sm:text-sm text-gray-400 mb-4 text-center">
        Made by <span className="text-white font-medium">Animesh Punetha</span> (NIT Durgapur)
      </footer>
    </div>
  );
};

export default HomePage;
