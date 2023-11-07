import 'devextreme/dist/css/dx.light.css';
// import '@mantine/core/styles.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RotatingLines } from "react-loader-spinner";
import { UserNicknameProvider } from './context/userNicknameContext.js';
import { CloudinaryProvider } from './context/CloudinaryContext.js';
import {SubscriptionProvider} from './context/SubscriptionContext.js';
import { SidebarProvider } from './context/SidebarContext.js';
import { SnackbarProvider } from 'notistack';
import { useParams } from 'react-router-dom';
import Test from './components/ContectUs.js';
import { ClipsFoundProvider } from './context/ClipsFoundContext.js';
const Signin = lazy(() => import('./Pages/signin.js'));
const Signup = lazy(() => import('./Pages/signup.js'));
const Forgotpassword = lazy(() => import('./Pages/forgotpassword.js'));
const Dashboard = lazy(() => import('./Pages/dashboard.js'));
const OtpVarification = lazy(() => import('./Pages/otpVarification.js'));
const Layout = lazy(() => import('./Pages/Layout.js'));
const Steps = lazy(() => import('./Pages/Steps.js'));
const HomeScreen = lazy(() => import('./Pages/HomeScreen.js'));
const PricingCardsContainer = lazy(() => import('./Pages/PricingCardsContainer.js'));
const YouTube = lazy(() => import('./components/YouTube.js'));
const Editor = lazy(() => import('./components/Editor.js'));
const CloudinaryMediaEditor = lazy(() => import('./components/mediaEditor.js'));

function App() {
  const { projectId } = useParams();
  console.log(projectId);
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
   
        <UserNicknameProvider>
          <SubscriptionProvider>
          <ClipsFoundProvider>
          <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} autoHideDuration={1500}>
            <SidebarProvider>
              <CloudinaryProvider>
                <Routes>
                  <Route path="/signup" element={<Signup />} />
                  <Route path="/forgotpassword" element={<Forgotpassword />} />
                  <Route path="*" element={<h1>Not Found</h1>} />
                  <Route
                    path="/dashboard"
                    element={<Layout><Dashboard /></Layout>}
                  />
                  <Route
                    path="/dashboard/:projectId" // Define a dynamic parameter
                    element={<Layout><Dashboard /></Layout>}
                  />
                  <Route path="/otpVarification" element={<OtpVarification />} />
                  <Route path="/steps" element={<Steps />} />
                  <Route path="/" element={<Signin />} />
                  <Route path="/homescreen" element={<Layout><HomeScreen /></Layout>} />
                    <Route path="/Test" element={<Test />} />
                  <Route path="/pricing" element={<PricingCardsContainer />} />
                  <Route path="/editor/:clipId" element={<Editor />} />
                  <Route path="/youtube" element={<CloudinaryMediaEditor />} />
                </Routes>
              </CloudinaryProvider>
            </SidebarProvider>
            </SnackbarProvider>
          </ClipsFoundProvider>
          </SubscriptionProvider>
        </UserNicknameProvider>
      </Suspense>
    </Router>
  );
}

export default App;

