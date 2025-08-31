// frontend/src/pages/HomePage.js
import { Link } from 'react-router-dom';

const HomePage = () => { 
  return (
    <div className="min-h-screen bg-gray-900 text-white">
      <div className="container mx-auto px-8 py-16">
        <div className="text-center">
          <h1 className="text-5xl font-bold mb-6">Personal Finance Manager</h1>
          <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
            Take control of your financial future with our comprehensive personal finance management tool. 
            Track expenses, monitor income, and visualize your financial data with beautiful charts and insights.
          </p>
          
          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
            <Link 
              to="/register" 
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Get Started
            </Link>
            <Link 
              to="/login" 
              className="bg-gray-700 hover:bg-gray-600 text-white font-bold py-3 px-8 rounded-lg text-lg transition-colors"
            >
              Sign In
            </Link>
          </div>

          <div className="grid md:grid-cols-3 gap-8 mt-16">
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-blue-400 text-4xl mb-4">📊</div>
              <h3 className="text-xl font-semibold mb-2">Track Expenses</h3>
              <p className="text-gray-300">Monitor your spending habits and categorize expenses for better financial insights.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-green-400 text-4xl mb-4">💰</div>
              <h3 className="text-xl font-semibold mb-2">Visualize Data</h3>
              <p className="text-gray-300">Beautiful charts and graphs to help you understand your financial patterns.</p>
            </div>
            
            <div className="bg-gray-800 p-6 rounded-lg">
              <div className="text-purple-400 text-4xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold mb-2">Set Goals</h3>
              <p className="text-gray-300">Set financial goals and track your progress towards achieving them.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HomePage;