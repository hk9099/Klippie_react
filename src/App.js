import 'devextreme/dist/css/dx.light.css';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { RotatingLines } from "react-loader-spinner";
import { UserNicknameProvider } from './components/userNicknameContext.js';
import { SidebarProvider } from './components/SidebarContext.js';
import { SnackbarProvider } from 'notistack';
import { useParams } from 'react-router-dom';
const Signin = lazy(() => import('./Pages/signin.js'));
const Signup = lazy(() => import('./Pages/signup.js'));
const Forgotpassword = lazy(() => import('./Pages/forgotpassword.js'));
const Dashboard = lazy(() => import('./Pages/dashboard.js'));
const OtpVarification = lazy(() => import('./Pages/otpVarification.js'));
const Layout = lazy(() => import('./Pages/Layout.js'));
const Steps = lazy(() => import('./Pages/Steps.js'));
const VideoInfo = lazy(() => import('./components/youtubevideo.js'));
const HomeScreen = lazy(() => import('./Pages/HomeScreen.js'));

// function App() {
//   const { projectId } = useParams();
//   return (
//     <Router>
//       <Suspense fallback={
//         <div className="flex justify-center items-center h-screen">
//           <RotatingLines
//             strokeColor="grey"
//             strokeWidth="2"
//             animationDuration="0.75"
//             width="96"
//             visible={true}
//           />
//         </div>
//       }>
//         <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} autoHideDuration={1500}>
//           <SidebarProvider>
//             <Routes>
//               <Route path="/signup" element={<Signup />} />
//               <Route path="/forgotpassword" element={<Forgotpassword />} />
//               <Route path="*" element={<h1>Not Found</h1>} />
//               <Route
//                 path="/dashboard"
//                 element={<Layout><Dashboard /></Layout>}
//               />
//               <Route
//                 path="/dashboard/:projectId" 
//                 element={<Layout><Dashboard /></Layout>}
//               />
//               <Route path="/otpVarification" element={<OtpVarification />} />
//               <Route path="/steps" element={<Steps />} />
//               <Route path="/" element={<Signin />} />
//             </Routes>
//           </SidebarProvider>
//         </SnackbarProvider>
//       </Suspense>
//     </Router>
//   );
// }

// export default App;

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
       
        <SnackbarProvider maxSnack={3} anchorOrigin={{ vertical: 'bottom', horizontal: 'center' }} autoHideDuration={1500}>
          <SidebarProvider>
          <UserNicknameProvider> 
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
                <Route path="/youtubevideo" element={<VideoInfo />} />
                <Route path="/homescreen" element={<HomeScreen />} />
            </Routes>
          </UserNicknameProvider>
            </SidebarProvider>
        </SnackbarProvider>
      </Suspense>
    </Router>
  );
}

export default App;

