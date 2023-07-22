import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './signin.js';
import Signup from './signup.js';
import Forgotpassword from './forgotpassword.js';
import Dashboard from './dashboard.js';
import OtpVarification from './otpVarification.js';
import Layout from './Layout.js';
import Loader from './Loader.js';

function App() {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Simulate loading time
    setTimeout(() => {
      setIsLoading(false);
    }, 2000);
  }, []);

  return (
    <Router>
      {isLoading ? (
        <Loader />
      ) : (
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route exact path="/" element={<Signin />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route path="/dashboard" element={<Layout><Dashboard /></Layout>} />
          <Route path="/otpVarification" element={<OtpVarification />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
