import React, { useState } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import { CSSTransition, TransitionGroup } from 'react-transition-group';
import LoadingScreen from './Components/LoadingScreen/LoadingScreen';
import Main from './Main';
import Landing from './Landing';
import DotCursor from './Components/DotCursor/DotCursor';
import './Main.css';

const AnimatedRoutes = ({ entered, setEntered, loading, setLoading }) => {
  const location = useLocation();

  return (
    <TransitionGroup>
      <CSSTransition key={location.pathname} classNames="fade" timeout={300}>
        <Routes location={location}>
          <Route
            path="/"
            element={
              <Landing
                onEnter={() => {
                  setEntered(true);
                  setLoading(true);
                }}
              />
            }
          />
          <Route
            path="/folio"
            element={
              entered ? (
                loading ? (
                  <LoadingScreen onFinish={() => setLoading(false)} />
                ) : (
                  <Main  entered={entered}
                  loading={loading}
                  setLoading={setLoading}/>
                )
              ) : (
                <Landing
                  onEnter={() => {
                    setEntered(true);
                    setLoading(true);
                  }}
                />
              )
            }
          />

          {/* <Route path='/' element={<Main />} /> */}
        </Routes>
      </CSSTransition>
    </TransitionGroup>
  );
};

const App = () => {
  const [entered, setEntered] = useState(false);
  const [loading, setLoading] = useState(false);

  return (
    <>
      <DotCursor />
      <div className="scanlines" />
      <AnimatedRoutes
        entered={entered}
        setEntered={setEntered}
        loading={loading}
        setLoading={setLoading}
      />
    </>
  );
};

export default App;
