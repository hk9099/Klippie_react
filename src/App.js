import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './Pages/signin.js';
import Signup from './Pages/signup.js';
import Forgotpassword from './Pages/forgotpassword.js';
import Dashboard from './Pages/dashboard.js';
import OtpVarification from './Pages/otpVarification.js';
import Layout from './Pages/Layout.js';
import Loader from './Pages/Loader.js';
import Steps from './Pages/Steps.js';
import { ThemeProvider } from './components/ThemeContext.js';

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
          <Route
            path="/dashboard"
            element={
              <ThemeProvider initialTheme="dark"> 
                <Layout>
                  <Dashboard />
                </Layout>
              </ThemeProvider>
            }
          />
            <Route path="/otpVarification" element={<OtpVarification />} />
            <Route path="/steps" element={<Steps />} />
        </Routes>
      )}
    </Router>
  );
}

export default App;
