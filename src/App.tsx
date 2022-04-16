import './App.css';
import { useEffect, useState } from 'react';
import ProductDash from './component/ProductDash';

function App() {

  const [isDarkMode, setIsDarkMode] = useState(localStorage.getItem("theme") === "dark");

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })

  const toggleDarkMode = () => {
    if (isDarkMode) {
      localStorage.setItem("theme", "light")
      setIsDarkMode(false);
    } else {
      localStorage.setItem("theme", "dark")
      setIsDarkMode(true);
    }
  }

  return (
    <div className="dark:bg-gray-900">
      <div className="inline-block py-2 min-w-full sm:px-6 lg:px-8">
        <div className="overflow-hidden shadow-md sm:rounded-lg"></div>
        <label htmlFor="darkmode-toggle" className="flex relative items-center mb-4 cursor-pointer">
          <input type="checkbox" id="darkmode-toggle" className="sr-only" checked={isDarkMode} onChange={toggleDarkMode} />
          <div className="w-11 h-6 bg-gray-200 rounded-full border border-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600"></div>
          <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Dark Mode</span>
        </label>
      </div>
      <ProductDash />
    </div>
  );
}

export default App;
