import 'devextreme/dist/css/dx.light.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RotatingLines } from "react-loader-spinner";
import { SidebarProvider } from './components/SidebarContext.js';
const Signin = lazy(() => import('./Pages/signin.js'));
const Signup = lazy(() => import('./Pages/signup.js'));
const Forgotpassword = lazy(() => import('./Pages/forgotpassword.js'));
const Dashboard = lazy(() => import('./Pages/dashboard.js'));
const OtpVarification = lazy(() => import('./Pages/otpVarification.js'));
const Layout = lazy(() => import('./Pages/Layout.js'));
const Steps = lazy(() => import('./Pages/Steps.js'));


function App() {
  return (
    <Router>
      <Suspense fallback={
        <div className="flex justify-center items-center h-screen">
          <RotatingLines
            strokeColor="grey"
            strokeWidth="2"
            animationDuration="0.75"
            width="96"
            visible={true}
          />
        </div>
      }>
        <SidebarProvider>
        <Routes>
          <Route path="/signup" element={<Signup />} />
          <Route path="/forgotpassword" element={<Forgotpassword />} />
          <Route path="*" element={<h1>Not Found</h1>} />
          <Route
            path="/dashboard"
            element={<Layout><Dashboard /></Layout>}
          />
          <Route path="/otpVarification" element={<OtpVarification />} />
          <Route path="/steps" element={<Steps />} />
          {/* Route for Signin with light theme */}
          <Route path="/" element={<Signin />} />
          </Routes>
          </SidebarProvider>
      </Suspense>
    </Router>
  );
}

export default App;
