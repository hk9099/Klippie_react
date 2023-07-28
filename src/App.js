import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './Pages/signin.js';
import Signup from './Pages/signup.js';
import Forgotpassword from './Pages/forgotpassword.js';
import Dashboard from './Pages/dashboard.js';
import OtpVarification from './Pages/otpVarification.js';
import Layout from './Pages/Layout.js';
import Loader from './Pages/Loader.js';
import Video from './Pages/videoplayer.js';
import Gridview from './Pages/Gridview.js';



function App() {
  const [isLoading, setIsLoading] = useState(true);
  console.error = () => { };

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
          <Route path="/video" element={<Video />} />
          <Route path="/gridview" element={<Gridview />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
