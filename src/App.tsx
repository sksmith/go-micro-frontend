import './App.css';
import { useEffect, useState } from 'react';
import ProductDash from './component/ProductDash';

function App() {

  const [isDarkMode, setIsDarkMode] = useState(false);

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  })

  const toggleDarkMode = () => {
    setIsDarkMode(!isDarkMode);
  }

  return (
    <div className="dark:bg-gray-900">
      <label htmlFor="darkmode-toggle" className="flex relative items-center mb-4 cursor-pointer">
        <input type="checkbox" id="darkmode-toggle" className="sr-only" checked={isDarkMode} onChange={toggleDarkMode} />
        <div className="w-11 h-6 bg-gray-200 rounded-full border border-gray-200 toggle-bg dark:bg-gray-700 dark:border-gray-600"></div>
        <span className="ml-3 text-sm font-medium text-gray-900 dark:text-gray-300">Toggle me</span>
      </label>
      <ProductDash />
    </div>
  );
}

export default App;
