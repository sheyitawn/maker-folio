import React, { useState, useEffect } from 'react';
import LoadingScreen from './Components/LoadingScreen/LoadingScreen';
import Main from './Main'; // your actual app
import "./Main.css";
import DotCursor from "./Components/DotCursor/DotCursor";

const App = () => {
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate loading
    const timer = setTimeout(() => {
      setLoading(false);
    }, 4000); // 2.5 seconds

    return () => clearTimeout(timer);
  }, []);

      
  return (
    <>
      <DotCursor />
      <div className="scanlines" />
      {loading ? <LoadingScreen onFinish={() => setLoading(false)} /> : <Main />}
    </>
  );
  
};

export default App;
