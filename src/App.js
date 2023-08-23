import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './Pages/signin.js';
import Signup from './Pages/signup.js';
import Forgotpassword from './Pages/forgotpassword.js';
import Dashboard from './Pages/dashboard.js';
import OtpVarification from './Pages/otpVarification.js';
import Layout from './Pages/Layout.js';
import Steps from './Pages/Steps.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route
          path="/dashboard" element={<Layout><Dashboard /></Layout>}
        />
        <Route path="/otpVarification" element={<OtpVarification />} />
        <Route path="/steps" element={<Steps />} />
        {/* Route for Signin with light theme */}
        <Route path="/" element={<Signin />} />
      </Routes>
    </Router>
  );
}




export default App;
