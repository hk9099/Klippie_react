/* eslint-disable no-unused-vars */
import React, { useState, useEffect,useRef } from "react";
import { useParams, useLocation } from "react-router-dom";
import Sidebar from "../Sidebar/Sidebar.js";
import Navbar from "../Navbar/Navbar.js";
import Modal from "../Extra/Modal.js";
import Steps from "../HomeScreen/Hooks/Context/ProjectProcess/Steps.js";
import HomeScreen from "../HomeScreen/FirstScreen/HomeScreen.js";
import "../../assets/css/Sidebar.css";
import { updateMainVideo } from "../Table/MainVideoTable/Data/data.js";
import { Analytics } from '@vercel/analytics/react';
import axios from "axios";
import { useNavigate } from 'react-router-dom';
import { useUserNickname } from '../Sidebar/Hooks/Context/userNicknameContext.js';
import { useCloudinary } from '../HomeScreen/Hooks/Context/CloudinaryContext.js';
import { useClipsFoundStatus } from '../HomeScreen/Hooks/Context/ClipsFoundContext.js';
import { TokenManager } from '../Config/Token/getToken.js';
import PopupForm from './SessionOut/sessionPopup.js';
import DragDropModal from "../HomeScreen/MainScreen/Drag&DropModal.js";
import { useFileSelected } from "../Table/Hooks/Context/SelectionContext.js";
import ToastNotification from "../Notification/ToastNotification.js";
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import { Dialog, Group, Button, Loader, Text, Accordion, List } from '@mantine/core';
import { useSidebarContext } from '../Sidebar/Hooks/Context/SidebarContext.js';
import SchoolPride from "../Testing/confetti.js";
import useBaseUrl from '../Config/Hooks/useBaseUrl.js';

export default function Dashboard() {
  const baseUrl = useBaseUrl();
  const { fileDelete, pageLoaded, setPageLoaded } = useFileSelected();
  const location = useLocation();
  const [showPopup, setShowPopup] = useState(false);
  const [mediaEditorClosed, setMediaEditorClosed] = useState(false);
  const navigate = useNavigate();
  const user = TokenManager.getToken()
  const [userToken, setUserToken] = useState(null);
  const [loginCount, setLoginCount] = useState(0);
  const { setClipsFoundStatus, startAgain, projectCreated } = useClipsFoundStatus();
  const { setIsApiCompleted } = useSidebarContext();
  const { projectId: routeProjectId } = useParams();
  const { cloudinaryResponse } = useCloudinary();
  const [projectId, setProjectId] = useState(null);
  const [newvideoClips, setNewvideoClips] = useState([]);
  const [newmainvideo, setnewMainVideo] = useState([]);
  const [accordionVisible, setAccordionVisible] = useState(true);
  // if (process.env.NODE_ENV === 'development') {
  //   console.log(accordionVisible, 'accordionVisible');
  // }
  const [errorMessage, setErrorMessage] = useState("");
  const [newProjectCount, setNewProjectCount] = useState('');
  // if (process.env.NODE_ENV === 'development') {
  //   console.log(newProjectCount, 'newProjectCount');
  // }
  const { userName } = useUserNickname();
  const { creaditBalance } = useUserNickname();
  
  const [startAnimation, setStartAnimation] = useState(false);

  useEffect(() => {
    // Start the animation after 5 seconds
    const timeoutId = setTimeout(() => {
      setStartAnimation(true);
    }, 5000);

    // Cleanup the timeout to avoid memory leaks
    return () => clearTimeout(timeoutId);
  }, []);
  
  const setError = (message) => {
    setErrorMessage(message);
  };

  useEffect(() => {
    if (user === undefined || user === null) {
      navigate('/');
      window.location.reload();
      return;
    } else {
      const userToken = TokenManager.getToken()[1]
      setUserToken(userToken);
      const loginCount = TokenManager.getToken()[0]
      setLoginCount(loginCount);
    }
  }, [navigate, user]);

  const [makeNextAPICall, setMakeNextAPICall] = useState(false);
  const [runningData, setRunningData] = useState(null);
  const [runningID, setRunningID] = useState(null);

  const baseUrlRef = useRef(baseUrl); 

  useEffect(() => {
    if (!baseUrl) {
      return;
    }
    const fetchData = () => {
      const config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${baseUrl}/v1/project/current-running-project`,
        headers: {
          'accept': 'application/json',
          'Authorization': 'Bearer ' + userToken
        }
      };

      axios.request(config)
        .then((response) => {
          if (response.data.data && response.data.data.length !== 0) {
            setMakeNextAPICall(true);
            setRunningData(response.data.data);
            setRunningID(response.data.data[0].id);
          } else {
            setMakeNextAPICall(false);
            if (runningID !== null){
            navigate(`/dashboard/${runningID}`);
            setRunningID(null);
            }
          }
        })
        .catch((error) => {
        });
    };

    const userToken = TokenManager.getToken()[1];
    setUserToken(userToken);

    if (makeNextAPICall !== false) {

      // Set up an interval to continuously make API calls
      const intervalId = setInterval(() => {
        fetchData();
      }, 5000);

      // Clean up the interval when the component unmounts or when makeNextAPICall becomes false
      return () => clearInterval(intervalId);
    } else {
      fetchData();
    }
    // eslint-disable-next-line
  }, [userToken, makeNextAPICall, projectCreated]);

  const stopProcessing = async () => {
    let config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/v1/project/stop-process`,
      headers: {
        'accept': 'application/json',
        'Authorization': 'Bearer ' + userToken
      }
    };

    axios.request(config)
      .then((response) => {
        setIsApiCompleted(true);
        setMakeNextAPICall(false);
        setRunningID(null);
      })
      .catch((error) => {
      });
  }

  useEffect(() => {
    const handleMediaEditorClosed = () => {
      // Handle the event when the media editor tab is closed
      setMediaEditorClosed(true);
    };

    // Attach the event listener when the component mounts
    window.addEventListener('mediaEditorClosed', handleMediaEditorClosed);

    // Detach the event listener when the component unmounts
    return () => {
      window.removeEventListener('mediaEditorClosed', handleMediaEditorClosed);
    };
  }, [setPageLoaded]);

  useEffect(() => {
    if (mediaEditorClosed) {
      setMediaEditorClosed(false);
    }
  }, [mediaEditorClosed]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (TokenManager.isTokenExpired()) {
        TokenManager.removeToken();
        setShowPopup(true);
      }
    }, 60 * 1000);

    return () => {
      clearInterval(interval);
    };
  }, []);

  // useEffect(() => {
  //   setTimeout(() => {
  //   const increments = TokenManager.getToken()[2]
  //     console.log(increments, 'increments');
  //   }, 1000);
  // }, [loginCount]);

  useEffect(() => {
    if (user === undefined || user === null) {
      navigate('/');
      window.location.reload();
      return;
    } else {
      if (location.pathname === '/dashboard') {
        setClipsFoundStatus(false)
        const increments = TokenManager.getToken()[2]
        setNewProjectCount(increments);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [location.pathname]);

  // useEffect(() => {
  //   if (user) {
  //     navigate('/dashboard');
  //   } else {
  //     setShowPopup(true);
  //   }
  // }, [ navigate]);

  const handleSubmit = async (values) => {
    if (process.env.NODE_ENV === 'development') {
      console.log('Form data:', values);
    }
    try {
      const response = await axios.post(
        `${baseUrl}/v1/auth/login`,
        {
          email: values.email,
          password: values.password,
          is_social: false,
          firebase_id: 'string',
          id_token: 'string',
          device_id: 'string'
        }
      );

      if (response && response.data) {
        ToastNotification({ type: 'success', message: 'Login Successful' });
        const encodedUser = btoa(JSON.stringify(response.data));
        // localStorage.setItem('_sodfhgiuhih', encodedUser);
        // const encodedEmail = btoa(values.email);
        // localStorage.setItem('_auth', encodedEmail);
        TokenManager.setToken('userToken', 2160, encodedUser);
        window.location.reload();
        // const userToken = Cookies.get('userToken');
        // if (userToken) {
        //     //decode token to get user data
        //     const decodedToken = atob(userToken);
        //     const userInfo = JSON.parse(decodedToken);
        //     console.log(userInfo, 'userInfo');
        // } else {
        //     console.log('Cookie not found or expired.');
        // }

        navigate('/');
        setClipsFoundStatus(true);
      } else {
        ToastNotification({ type: 'error', message: 'Invalid response from the server.' });
      }
    } catch (error) {
      if (error.response.data.detail) {
        ToastNotification({ type: 'error', message: error.response.data.detail });
      } else {
        navigate("/otpVarification");
        ToastNotification({ type: 'error', message: error.response.data.message });
      }
    }
  };

  const handleCancel = () => {
    navigate('/');
    setShowPopup(false);
  };
  var HOSTINGURL = baseUrl;


  useEffect(() => {
    if (process.env.NODE_ENV === 'development') {
    }
    if (!routeProjectId) {
      setAccordionVisible(false);
      setProjectId('');
      return;
    } else {
      setClipsFoundStatus(true);
      navigate(`/dashboard/${routeProjectId}`);
    }

    if (!userToken) {
      setAccordionVisible(false);
      setProjectId('');
      return;
    } else {
      setClipsFoundStatus(true);
      navigate(`/dashboard/${routeProjectId}`);
    }

    const handleProjectClick = async (index) => {
      // const userToken = TokenManager.getToken()[1]
      try {
        let maindata = JSON.stringify({
          "id": routeProjectId
        });

        let mainconfig = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${HOSTINGURL}/v1/project/get-by-id`,
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          },
          data: maindata
        };

        const response = await axios.request(mainconfig);
        if (process.env.NODE_ENV === 'development') {
          console.log(response.data, 'responseeeeeeeeeeee.data');
        }
        const title = response.data.data.title;
        const description = response.data.data.description;
        const src = response.data.data.video_url;
        const id = response.data.data.id;
        const type = response.data.data.type;

        // Calculate the duration of the video (assuming src is the video URL)
        const videoElement = document.createElement('video');
        videoElement.src = src;
        videoElement.onloadedmetadata = () => {
          const durationInSeconds = Math.floor(videoElement.duration);

          // Convert duration to HH:MM:SS format
          const hours = Math.floor(durationInSeconds / 3600);
          const minutes = Math.floor((durationInSeconds % 3600) / 60);
          const seconds = durationInSeconds % 60;
          const formattedDuration = `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

          var newMainVideo = [
            { title, description, src, id, time: formattedDuration, type }
          ];
          updateMainVideo(newMainVideo);
          setnewMainVideo(newMainVideo);
        };
        if (response.data.data.clips && Array.isArray(response.data.data.clips)) {
          const newvideoClips = await Promise.all(response.data.data.clips.map(async (clip) => {
            // Split the time string into parts
            const timeParts = clip.duration.split(':');

            // Extract hours, minutes, seconds
            const hours = parseInt(timeParts[0]);
            const minutes = parseInt(timeParts[1]);
            const seconds = parseInt(timeParts[2].split('.')[0]);

            // Format the time in HH:MM:SS
            const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

            const publicId = clip?.clip_url?.split('/').pop().split('.')[0];
            if (process.env.NODE_ENV === 'development') {
              console.log(publicId, 'publicId');
            }
            return {
              id: clip.id,
              src: clip.clip_url,
              title: clip.title,
              description: clip.summary,
              status: clip.status,
              time: formattedTime,
              type: clip.type,
              start_time: clip.start_time,
              end_time: clip.end_time,
              publicId: publicId
            };
          }));
          setNewvideoClips(newvideoClips);
          setAccordionVisible(true);
          setPageLoaded(false);
        }
        if (response.status === 200) {
          setErrorMessage('')
        }
      }
      catch (error) {
        if (error.response.data.message) {
          setAccordionVisible(false);
          setErrorMessage(error.response.data.message);
        } else {
          setErrorMessage('');
        }
      }
    };


    handleProjectClick()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeProjectId, setAccordionVisible, setProjectId, setErrorMessage, setNewvideoClips, setnewMainVideo, fileDelete, projectId, pageLoaded, userToken]);

  useEffect(() => {
    if (projectId) {
      setErrorMessage("");
      setAccordionVisible(true);
    } else {
      setAccordionVisible(false);
    }
    setProjectId(projectId);
  }, [projectId, pageLoaded]);

  // const showToast = () => {
  //   ToastNotification({ type: 'success', message:' error.response.data.detail' })
  // }

  return (
    <div className="h-screen" style={{
      zIndex: '1',
      position: 'relative',
    }}>
       <div style={{
        zIndex: '999999999999999999999999999',
        position: 'absolute',
        top: '0',
        left: '0',
        width: '100%',
        height: '100%',
        display: 'none',
       }}>
      {/* Render the SchoolPride component and pass startAnimation as a prop */}
      {/* <SchoolPride shouldStartAnimation={startAnimation} /> */}
    </div>
      <MantineProvider>
        {/* <Toaster position="top-center" /> */}
        <div className="flex h-full">
          {showPopup ? null : (
            <Sidebar
              setProjectId={setProjectId}
              setNewvideoClips={setNewvideoClips}
              setnewMainVideo={setnewMainVideo}
              setAccordionVisible={setAccordionVisible}
              setError={setError}
            />
          )}
          <section className="w-full px-3 " style={{ overflow: 'auto' }}>
            {/* <button type="button" className="" onClick={showToast}>Toast</button> */}
            <Modal className="z-50" />
            {loginCount === 1 && (newProjectCount === undefined || '') ? (
              <Navbar creaditBalance={creaditBalance} />
            ) : loginCount > 1 ? (
              <Navbar creaditBalance={creaditBalance} />
            ) : (
              <Navbar creaditBalance={creaditBalance} />
            )}
            {showPopup ? (
              <PopupForm onSubmit={handleSubmit} onCancel={handleCancel} />
            ) : (
              <>
                {(accordionVisible || cloudinaryResponse || startAgain) ? (
                  <Steps
                    projectId={projectId}
                    newhistoryvideoClips={newvideoClips}
                    newmainvideo={newmainvideo}
                    errorMessage={errorMessage}
                    accordionVisible={accordionVisible}
                    cloudinaryResponse={cloudinaryResponse}
                    userName={userName}
                    creaditBalance={creaditBalance}
                    startAgain={startAgain}
                  />
                ) : loginCount === 1 && (newProjectCount === undefined || '') ? (
                  <HomeScreen userName={userName} creaditBalance={creaditBalance} />
                ) : loginCount === 1 && newProjectCount >= 1 ? (
                  <DragDropModal className="z-50" />
                ) : loginCount > 1 && (newProjectCount === undefined || '') ? (
                  <DragDropModal className="z-50" />
                ) : loginCount > 1 && newProjectCount >= 1 ? (
                  <DragDropModal className="z-50" />
                ) : (
                  null
                )}
              </>
            )}
            {errorMessage && (
              <div className="flex flex-col items-center h-[87vh] justify-center text-center">
                <div className="text-7xl font-extrabold mb-4 animate-bounce text-red-600">😟 Oops!</div>
                <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg border border-pink-600 text-white px-8 py-6 rounded-xl shadow-2xl transform scale-105 transition-transform duration-500">
                  <p className="font-semibold text-lg">{errorMessage}</p>
                  <p className="text-gray-300 mt-2">Oh no! It seems like we couldn't find the project you're looking for.</p>
                </div>
              </div>
            )}
            {makeNextAPICall && (
              <Dialog opened={true} radius="lg"
                classNames={{
                  root: 'runningProjects',
                }}
                styles={{
                  root: {
                    border: '1px solid #e3e3e3',
                  }
                }}
              >
                <Group styles={{
                  root: {
                    zIndex: '9999!important',
                    width: 'auto!important',
                  }
                }}>
                  <Loader size="md" />
                  <Text style={{ width: '250px', maxWidth: '250px', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap', color: '#fff' }}>
                    {(runningData && runningData[0] && runningData[0].title) || 'New Project'}
                  </Text>
                  <Button onClick={stopProcessing} color="red" variant="filled">
                    Stop Process
                  </Button>
                </Group>
                <Accordion
                  styles={{
                    root: {
                      border: '1px solid #e3e3e3',
                      marginTop: '10px',
                      borderRadius: '10px',
                    },
                    control: {
                      "&:hover": {
                        backgroundColor: "#000",
                      },
                      color: "#fff",
                      borderBottom: "1px solid #e3e3e3",
                      borderRadius: "10px",
                    },
                    content: {
                      padding: "10px",
                    },
                  }}
                  defaultValue="Apples"
                >
                  <Accordion.Item value="Apples" classNames={{ item: 'panelcolor', }} >
                    <Accordion.Control >
                      Status
                    </Accordion.Control>
                    <Accordion.Panel>
                      <List spacing="md" size="md" center
                        styles={{
                          item: {
                            color: "#fff",
                          },
                        }}
                      // icon={ <ThemeIcon color="teal" size={24} radius="xl"> <IconCircleCheck style={{ width: rem(16), height: rem(16) }} /> </ThemeIcon> }
                      >
                        <List.Item>🕵️‍♂️ Klippie is finding your clips</List.Item>
                        <List.Item>⏳ This may take up to 15 minutes</List.Item>
                        <List.Item>📧 We’ll email you when they’re ready!</List.Item>
                      </List>
                    </Accordion.Panel>
                  </Accordion.Item>
                </Accordion>
              </Dialog>
            )}
          </section>
        </div>
        <Analytics />
      </MantineProvider>
    </div>

  );
}