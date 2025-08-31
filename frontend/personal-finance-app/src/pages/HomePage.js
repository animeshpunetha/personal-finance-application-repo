import { Link } from 'react-router-dom';

const HomePage = () => { 
  return (
    <div className="h-screen w-screen bg-gray-900 text-white flex flex-col justify-between items-center text-center overflow-hidden">
      {/* Centered App Name */}
      <div className="flex flex-col justify-center items-center flex-grow">
        <h1 className="sm:text-[3.5rem] font-bold mb-8">
          Personal Finance Assistant
        </h1>
        
        {/* Sign In Button */}
        <Link 
          to="/login" 
          className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
        >
          Sign In
        </Link>
      </div>

      {/* Footer with author credit */}
      <p className="text-sm text-gray-400 mb-4">
        Made with ❤️ By Animesh Punetha (NIT Durgapur)
      </p>
    </div>
  );
};

export default HomePage;
