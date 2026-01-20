import React, { useState } from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import Preloader from './components/Preloader.jsx';
import './index.css';

const Main = () => {
  const [isLoading, setIsLoading] = useState(true);

  const handlePreloaderFinished = () => {
    setIsLoading(false);
  };

  return (
    <>
      {isLoading ? (
        <Preloader onFinished={handlePreloaderFinished} />
      ) : (
        <App />
      )}
    </>
  );
};

// Render komponen Main ke dalam DOM
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <Main />
  </React.StrictMode>,
);
