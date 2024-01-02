/* eslint-disable no-unused-vars */
import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineDelete, AiOutlinePlus, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
// import { Menu } from "@headlessui/react";
import Logo from "../../assets/images/logo.svg";
import { IconChevronRight } from '@tabler/icons-react';
import "../../assets/css/Sidebar.css";
import Modal from "../Extra/Modal.js";
import AccountModal from "../Setting/MainModal/AccountModal.js";
import axios from "axios";
import qs from "qs";
import fetchProjectsData from './Hooks/Projectdata/fetchProjectData.js';
import { FiEdit2 } from "react-icons/fi";
import { useSidebarContext } from './Hooks/Context/SidebarContext.js';
import { useUserNickname } from "./Hooks/Context/userNicknameContext.js";
import fetchUserProfile from './Hooks/UserProfile/fetchUserProfile.js';
import { useCloudinary } from '../HomeScreen/Hooks/Context/CloudinaryContext.js';
import { useClipsFoundStatus } from '../HomeScreen/Hooks/Context/ClipsFoundContext.js';
import { TokenManager } from '../Config/Token/getToken.js';
import { MantineProvider } from '@mantine/core';
import '@mantine/core/styles.css';
import '@mantine/dates/styles.css';
import '@mantine/dropzone/styles.css';
import { Menu, HoverCard, Button, Text, Group } from '@mantine/core';
import ToggleMenuButton from '../Setting/ToggleMenuButton.js';
// import { Tooltip } from 'react-tooltip';
//eslint-disable-next-line
import VideoPlayer from "../Extra/videoplayer.js";
import CloudinaryVideoPlayer from "../VideoPlayer/cloudinaryVideoPlayer.js";
// import Example from "./testDropdown";
import ConfirmationModal from "../Delete/ClipDelete/DeleteConfirmationModal.js";
import ToastNotification from "../Notification/ToastNotification.js";
import { Toaster } from 'react-hot-toast';
import { useFileSelected } from "../Table/Hooks/Context/SelectionContext.js";
import useBaseUrl from '../Config/Hooks/useBaseUrl.js';

const Sidebar = ({ setProjectId, setNewvideoClips, setnewMainVideo, setAccordionVisible, setError }) => {
  const { setCloudinaryResponse } = useCloudinary();
  const baseUrl = useBaseUrl();
  //eslint-disable-next-line
  const { setStartAgain, projectCreated } = useClipsFoundStatus();
  const { refreshProfile, setRefreshProfile } = useSidebarContext();
  const { fileDelete, pageLoaded, setPageLoaded } = useFileSelected();
  const { setUserName } = useUserNickname();
  const { setUserEmail } = useUserNickname();
  const { setCreaditBalance } = useUserNickname();
  const navigate = useNavigate();
  const user = TokenManager.getToken()
  const [userToken, setUserToken] = useState(null);
  useEffect(() => {
    if (user === undefined || user === null) {
      navigate('/');
      window.location.reload();
      return;
    } else {
      const userToken = TokenManager.getToken()[1]
      setUserToken(userToken);
    }
  }, [navigate, user]);
  const [initialized, setInitialized] = useState(false);
  const [userEmailAddress, setUserEmailAddress] = useState("");
  const [creadit, setCreadit] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [showUserModal, setShowUserModal] = useState(false);
  const { isApiCompleted, setIsApiCompleted } = useSidebarContext();
  //eslint-disable-next-line
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  //eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectId] = useState(null);
  const [dropdownPosition] = useState("down");
  const location = useLocation();
  const [lines, setLines] = useState([]);
  const [tempLines, setTempLines] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  //eslint-disable-next-line  
  const isMountedRef = useRef(false);
  const [projectData, setProjectData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const [showDeleteConfirmation, setShowDeleteConfirmation] = useState(false);
  const [deleteIndex, setDeleteIndex] = useState(null);
  const [deleteProject, setDeleteProject] = useState(null);
  //eslint-disable-next-line
  const [videoURL, setVideoURL] = useState([]);
  //eslint-disable-next-line
  const [previewVideoURL, setPreviewVideoURL] = useState(null);
  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    setUserName(userNickname);
    setUserEmail(userEmailAddress);
    setCreaditBalance(creadit);
  }, [userNickname, setUserName, userEmailAddress, setUserEmail, creadit, setCreaditBalance]);
  var HOSTINGURL = baseUrl;

  const initializedRef = useRef(false);

  useEffect(() => {
    if (!initializedRef.current) {
      if (!baseUrl) {
        return;
      }
      if (user === undefined || user === null) {
        navigate('/');
        window.location.reload();
        return;
      } else {
        fetchUserProfile(
          initializedRef.current,
          navigate,
          setUserNickname,
          setUserEmailAddress,
          setUserAvatar,
          setCreadit,
          baseUrl
        );
        initializedRef.current = false;
        setRefreshProfile(false);
      }
    }
    // eslint-disable-next-line
  }, [refreshProfile, projectCreated, baseUrl]);

  const logVideoURL = (index) => {
    if (projectData[index] && projectData[index].video_url) {
      setPreviewVideoURL(projectData[index].video_url);
    }
  }

  const videoDiv = previewVideoURL ? (
    <div>
      <CloudinaryVideoPlayer src={previewVideoURL} sidebar={true} />
    </div>
  ) : null;

  useEffect(() => {
    const fetchData = async () => {
      if (user === undefined || user === null) {
        navigate('/');
        window.location.reload();
        return;
      }
  
      // Wait until baseUrl is available
      while (!baseUrl) {
        await new Promise(resolve => setTimeout(resolve, 100)); // Adjust the timeout as needed
      }
  
      // Now that baseUrl is available, proceed with fetching data
      fetchProjectsData(baseUrl, setProjectData, setLines, setIsLoadingHistory, setVideoURL);
      setIsApiCompleted(false);
    };
  
    fetchData();
    // eslint-disable-next-line
  }, [isApiCompleted, projectCreated,baseUrl]);
  

  const handleUpdateProfileSuccess = () => {
    // Call fetchUserProfile to refresh the user's profile
    fetchUserProfile(
      initialized,
      navigate,
      setUserNickname,
      setUserEmailAddress,
      setUserAvatar,
      baseUrl
    );
  };

  // const toggleDropdown = () => {
  //   setDropdownOpen(!dropdownOpen);
  //   setDropdownPosition("up");
  // };

  useEffect(() => {
    localStorage.setItem("color-theme", "dark");
  }, []);

  useEffect(() => {
    if (!initialized && userAvatar === null) {

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${baseUrl}/v1/auth/profile`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${userToken}`
        }
      };

      axios.request(config)
        .then((response) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(response.data, 'response.data');
          }
          var userNickname = response.data.name;
          setUserNickname(userNickname);
          const userEmailAddress = response.data.email;
          setUserEmailAddress(userEmailAddress);
          const userAvatar = response.data.profile_image;
          setUserAvatar(userAvatar);
          const userAvatarUrl = response.data.avatar;
          setUserAvatar(userAvatarUrl);


          if (userAvatar === null) {
            if (userAvatarUrl) {
              setUserAvatar(userAvatarUrl);
            } else {
              generateAvatar(userEmailAddress)
                .then((avatarUrl) => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log(avatarUrl, 'avatarUrl');
                  }
                  setUserAvatar(avatarUrl);
                })
                .catch((error) => {
                  if (process.env.NODE_ENV === 'development') {
                    console.log(error);
                  }
                });
            }

          } else {
            setUserAvatar(userAvatar);
          }
        })
        .catch((error) => {
          if (process.env.NODE_ENV === 'development') {
            console.log(error);
          }
        });
    }
    // eslint-disable-next-line
  }, []);

  const generateAvatar = (emailAddress) => {
    const userAvatar = emailAddress.split('@')[0];
    const avatarUrl = `https://ui-avatars.com/api/?name=${userAvatar}&background=0D8ABC&color=fff&size=128`;

    return axios.get(avatarUrl)
      .then((response) => {
        setUserAvatar(response.config.url);

        let data = JSON.stringify({
          "avatar": response.config.url,
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${HOSTINGURL}/v1/auth/update-profile`,
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${userToken}`
          },
          data: data
        };

        axios
          .request(config)
          .then((response) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(response.data, 'response.data');
            }
            // setUserAvatar(avatarData);
            setInitialized(true);
          })
          .catch((error) => {
            if (process.env.NODE_ENV === 'development') {
              console.log(error);
            }
          });


      })
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(error);
        }
        throw error;
      });
  };

  const deleteLine = (index) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(projectData[index].name, 'index')
    }
    setDeleteProject(projectData[index].name);
    setDeleteIndex(index);
    setShowDeleteConfirmation(true);
  };

  const confirmDelete = async () => {
    // Handle the delete action here
    if (deleteIndex !== null) {
      // Perform the deletion action
      const index = deleteIndex;
      // Function to delete a line

      try {
        const clickedProject = projectData[index];
        var clickedProjectid = clickedProject.id;

        let data = qs.stringify({
          'project_id': clickedProjectid
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${HOSTINGURL}/v1/project/delete`,
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${userToken}`
          },
          data: data
        };

        try {
          await axios.request(config);
          // If the API call is successful, update the state
          const updatedProjectData = projectData.filter((_, i) => i !== index);
          setProjectData(updatedProjectData);

          // Similarly, update lines state if needed
          setLines((prevLines) => {
            const updatedLines = prevLines.filter((_, i) => i !== index);
            return updatedLines;
          });
          navigate('/dashboard');
          setAccordionVisible(false);
          setError('');
        } catch (error) {
          if (process.env.NODE_ENV === 'development') {
            console.log(error);
          }
        }
        setShowDeleteConfirmation(false);
        setDeleteIndex(null);
      } catch (error) {
        if (process.env.NODE_ENV === 'development') {
          console.log(error);
        }
      }
    }
  };

  const handleEditClick = (index) => {
    setTempLines([...lines]); // Store the current lines before editing
    setEditIndex(index);
  };

  const handleEditChange = (event, index) => {
    // Update the temporary lines state while editing
    const newTempLines = [...tempLines];
    newTempLines[index] = event.target.value;
    setTempLines(newTempLines);
  };

  const handleSaveClick = (index) => {
    const updatedLine = tempLines[index];

    if (updatedLine === null || updatedLine.trim() === '') {
      ToastNotification({ message: 'Project Title Cannot Be Empty', type: 'error' });
      return;
    }

    if (process.env.NODE_ENV === 'development') {
      console.log(updatedLine, 'updatedLine')
    }
    const data = qs.stringify({
      id: projectData[index].id,
      name: updatedLine,
      title: updatedLine
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${HOSTINGURL}/v1/project/update`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${userToken}`
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(response.data, 'updatedLine');
        }
        const newLines = [...lines];
        newLines[index] = updatedLine;
        setLines(newLines);
        setEditIndex(-1);
        setPageLoaded(true)
      })
      .catch((error) => {
        if (process.env.NODE_ENV === 'development') {
          console.log(error);
        }
      });
  };

  const handleCancelClick = () => {
    setTempLines([...lines]); // Revert temporary lines to original lines
    setEditIndex(-1); // Reset the edit index
  };

  const handleProjectClick = async (index) => {
    if (process.env.NODE_ENV === 'development') {
      console.log(projectData[index].id);
    }
    const data = JSON.stringify({
      "id": projectData[index].id
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${baseUrl}/v1/project/stats`,
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${userToken}`
      },
      data: data
    };

    const response = await axios.request(config);
    if (process.env.NODE_ENV === 'development') {
      console.log(response.data, 'response.data');
    }
    const message = response.data.data;

    if (message === "Project Created") {
      setStartAgain(projectData[index].id)
      ToastNotification({ message: response.data.message, type: 'info' });
      navigate(`/dashboard`);
      navigate()
    }
    if (message === "Transcribing video completed") {
      if (process.env.NODE_ENV === 'development') {
        console.log(response.data.message, 'response.data.data.status')
      }
      setStartAgain('')
      ToastNotification({ message: response.data.message, type: 'info' });
      navigate(`/dashboard`);
      navigate()
    }
    if (message === 'Clips generated') {
      setStartAgain('')
      navigate(`/dashboard/${projectData[index].id}`);
    }
  };

  const handleAddNewVideo = () => {
    setAccordionVisible(false);
    setProjectId('');
    setError('');
    setCloudinaryResponse(null);
    //eslint-disable-next-line
    const newValue = TokenManager.incrementValue('increment');
    navigate()
    navigate('/dashboard');
    // setShowModal(true); 
  };

  const handleFormSubmit = (projectId) => {
    setProjectId(projectId);
    setShowModal(false);
  };

  // const handleUserModal = () => {
  //   setShowUserModal(true);
  // };

  return (
    <>
      <MantineProvider>
        <Toaster position="top-center" />
        <div
          className={`${open
            ? "relative transition-all duration-300 ease-in-out"
            : "absolute transition-all left-[-210px] duration-300 ease-in-out"
            } top-0 p-2 z-10 flex h-full flex-none flex-col space-y-2 text-[14px] sm:top-0 bg-gray-100 dark:border-gray-600 dark:bg-custom-color-dark`}
        >

          <div
            className={`flex justify-start items-center select-none px-[10px] py-3 pr-0`}
          >

            <img
              src={Logo}
              alt=""
              className={`w-10  ${!open && "justify-center"
                } bg-white rounded-full`}
              onClick={() => {
                navigate('/dashboard');
                setAccordionVisible(false);
              }}
            />
            <div className="flex items-start" onClick={() => {
              navigate('/dashboard');
              setAccordionVisible(false);
            }}>
              {open && (
                <span
                  className={`text-2xl ml-4 font-bold font-poppins whitespace-nowrap dark:text-white`}
                >
                  Klippie
                </span>
              )}
              {open && (
                <span
                  className={`text-xs ml-2 text-white rounded-full px-2 py-0 border border-dashed border-white`}
                >
                  Beta
                </span>
              )}
            </div>
            <div   className={`${!open && "rotate-0 absolute border w-[40px] rounded-lg h-[40px] p-2"
                } ml-6 rotate-180 text-[100px] cursor-pointer top-5 -right-[130px]  border w-[40px] rounded-lg h-[40px] p-2 text-gray-200`}
                onClick={() => {
                  setOpen(!open);
                }}>
            <IconChevronRight />
            </div>
          </div>

          <div className="pt-4 pb-3">
            {/* <Tooltip id="disabled" content="To start, drag and drop a video or click Choose File."
            place="right"
            className="dark:custom-modal-bg-color dark:text-gray-300 font-semibold text-[2xl!important] font-ubuntu "
            opacity={1}
            style={{ backgroundColor: '#B3B5E2', color: '#020913' }}
          /> */}
            <button
              // disabled={!clipsFound}
              // data-tooltip-id={!clipsFound ? "disabled" : undefined}
              className={`newProject flex items-center w-full gap-x-6 p-[0.12rem] text-base rounded-full  dark:text-white  border-animation ${!open && "justify-center"}`} onClick={handleAddNewVideo}>
              <div
                className={`flex items-center w-full gap-x-6 p-3 text-base rounded-full bg-white dark:bg-gray-800 dark:text-white ${!open && "justify-center"
                  }`}
              >
                <span
                  className={`text-2xl `}
                >
                  <AiOutlinePlus className={`${!open && "justify-center"}`} />
                </span>
                <span
                  className={`${!open && "hidden"
                    } origin-left duration-300 hover:block font-semibold text-md font-ubuntu select-none`}
                >
                  New Project
                </span>
              </div>
            </button>
          </div>
          {projectId ? null : (
            <Modal
              onSubmit={handleFormSubmit}
              isOpen={showModal}
              onClose={() => setShowModal(false)}
              setProjectId={setProjectId}
            />
          )}
          <div className={` flex-grow overflow-auto backdrop-blur-xl history ${lines.length === 0 ? "flex items-center justify-center " : ""}  `}>
            {/* {isLoadingHistory ? (
              <div className="flex items-center justify-center mb-4 text-blue-500 h-[87%]">
                <span className="" style={{ userSelect: "none" }}>
                  <RotatingLines
                    strokeColor="grey"
                    strokeWidth="5"
                    animationDuration="0.75"
                    width="25"
                    visible={true}
                  />
                </span>
              </div>
            ) : ( */}
            <div className={` ${!open && "hidden"} relative`}>

              {lines.length === 0 ? (
                <div className="text-center text-gray-500 font-semibold dark:text-gray-300 select-none cursor-not-allowed">
                  {/* The History is Currently Empty. */}
                </div>
              ) : (
                lines
                  .map((line, index) => (
                    <HoverCard shadow="md" openDelay={3000}
                      position="right"
                      styles={{
                        dropdown: {
                          backgroundColor: '#B3B5E2',
                          color: '#020913',
                          padding: '0px',
                          overflow: 'hidden',
                          borderRadius: '10px',
                          border: '0px',
                        },
                        root: {
                          width: '400px',
                        },
                      }}
                    >
                      <HoverCard.Target>
                        <div
                          key={index}
                          className={`width-full row relative my-4 mx-auto pe-2 ${index === activeIndex ? "active" : ""
                            }`}
                          onMouseEnter={() => {
                            setHoveredIndex(index);
                            logVideoURL(index);
                          }}
                          onMouseLeave={() => setHoveredIndex(-1)}
                          data-tooltip-id={`tooltip-${index}`}
                        >
                          {editIndex === index ? (
                            <div className="width-full row relative">
                              <input
                                className="py-2 px-2 text-sm font-medium dark:text-gray-300 hover:text-gray-900 border-0 outline-none bg-[#F3F4F6] dark:bg-[#1F2937] w-[100%] pe-[55px]"
                                type="text"
                                value={tempLines[index]}
                                onChange={(event) => handleEditChange(event, index)}
                              />
                              <button onClick={() => handleSaveClick(index)} className="save-button">
                                <AiOutlineCheck />
                              </button>
                              <button onClick={() => handleCancelClick()} className="cancel-button">
                                <AiOutlineClose />
                              </button>
                            </div>
                          ) : (


                            <p
                              className="py-2 px-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white hover:border-l-2 hover:border-gray-900 dark:hover:border-white"
                              style={{
                                width: hoveredIndex === index ? "188px" : "236px",
                                // width: "100%",
                                whiteSpace: "nowrap",
                                overflow: "hidden",
                                textOverflow: "ellipsis",
                                userSelect: "none",
                                cursor: "pointer",
                              }}
                              onClick={() => {
                                setActiveIndex(index);
                                handleProjectClick(index);
                              }}
                            >
                              {line === undefined || line === null ? "New Project" : line}
                            </p>

                          )}
                          {/* <Tooltip id={`tooltip-${index}`} content={videoDiv}
                        place="right"
                        className="dark:custom-modal-bg-color dark:text-gray-300 font-semibold text-[2xl!important] font-ubuntu border-0 rounded-[50%!important]"
                        opacity={1}
                        style={{ backgroundColor: '#B3B5E2', color: '#020913', padding: '0px' }}
                        clickable={true}
                        delayShow={3000}
                      /> */}
                          {/* <HoverCard shadow="md" openDelay={1000}>
        <HoverCard.Target>
          <Button>1000ms open delay</Button>
        </HoverCard.Target>
        <HoverCard.Dropdown>
          <Text size="sm">Opened with 1000ms delay</Text>
        </HoverCard.Dropdown>
      </HoverCard> */}
                          <div className="hover-actions" >
                            {editIndex !== index && (
                              <>
                                <button onClick={() => deleteLine(index)} className="delete-button">
                                  <AiOutlineDelete />
                                </button>
                                <button onClick={() => handleEditClick(index)} className="edit-button">
                                  <FiEdit2 />
                                </button>
                              </>
                            )}
                          </div>
                        </div>
                      </HoverCard.Target>
                      <HoverCard.Dropdown>
                        <div className="w-[400px]">
                          {videoDiv}
                        </div>
                      </HoverCard.Dropdown>
                    </HoverCard>
                  ))
              )}

            </div>
            {/* )} */}

            {/* <div className="flex-grow w-1/4 p-4 bg-gray-200">
  <h2 className="text-2xl font-semibold">Video Preview</h2>
  {previewVideoURL && (
    <video src={previewVideoURL} controls width="100%" />
  )}
</div> */}
          </div>
          <div className={` bottom-0 left-0 right-0 `}>
            <div className=" flex flex-col gap-1">
              <Menu shadow="md" width={200}>
                <ToggleMenuButton
                  isOpen={dropdownOpen}
                  onClose={closeDropdown}
                  userNickname={userNickname}
                  userEmailAddress={userEmailAddress}
                  setIsOpen={setDropdownOpen}
                  position={dropdownPosition}
                  showLogout={open}
                  avatar={userAvatar} />
              </Menu>
            

              <AccountModal
                avatar={userAvatar}
                isLoading={isLoading}
                userNickname={userNickname}
                userEmailAddress={userEmailAddress}
                setUserNickname={setUserNickname}
                setUserEmailAddress={setUserEmailAddress}
                setUserAvatar={setUserAvatar}
                onUpdateProfileSuccess={handleUpdateProfileSuccess}
              />
            </div>
          </div>
        </div>
        {/* Mobile Menu */}
        <div className="sm:hidden">
          <div
            className={`${mobileMenu ? "flex" : "hidden"
              } absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold sm:w-auto left-6 right-6 dark:text-white  bg-blackk-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
          >
            <Link to="/dashboard" onClick={() => setMobileMenu(false)}>
              <span
                className={` ${location.pathname === "/dashboard" &&
                  "bg-gray-200 dark:bg-gray-700"
                  } p-2 rounded-xl hover:bg-gray-200 dark:hover:bg-gray-700`}
              >
                Dashboard
              </span>
            </Link>
          </div>
        </div>
        <ConfirmationModal
          show={showDeleteConfirmation}
          onConfirm={confirmDelete}
          onCancel={() => setShowDeleteConfirmation(false)}
          projectName={deleteProject}
        />
      </MantineProvider>
    </>
  );
};

export default Sidebar;
