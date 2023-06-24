import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import Signin from './signin.js';
import Signup from './signup.js';
import Forgotpassword from './forgotpassword.js';
import Dashboard from './dashboard.js';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/signup" element={<Signup />} />
        <Route exact path="/" element={<Signin />} />
        <Route path="/forgotpassword" element={<Forgotpassword />} />
        <Route path="*" element={<h1>Not Found</h1>} />
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
