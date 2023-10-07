import React, { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineDelete, AiOutlineMenu, AiOutlinePlus, AiOutlineCheck, AiOutlineClose } from "react-icons/ai";
import { Menu } from "@headlessui/react";
import Logo from "../assets/images/logo.svg";
import HamburgerButton from "./HumbergerButton";
import ".././assets/css/Sidebar.css";
import Modal from "./Modal";
import AccountModal from "./AccountModal";
import axios from "axios";
import qs from "qs";
import DropdownMenu from "./DropdownMenu";
import { updateMainVideo } from "./data";
import { BsThreeDots } from "react-icons/bs";
import fetchProjectsData from '../components/fetchProjectData';
import { FiEdit2 } from "react-icons/fi";
import { RotatingLines } from "react-loader-spinner";
import { useSidebarContext } from '../components/SidebarContext';
import { useUserNickname } from "./userNicknameContext";
import fetchUserProfile from '../components/fetchUserProfile';
import { useSnackbar } from 'notistack';
// import Example from "./testDropdown";

const Sidebar = ({ setProjectId, setNewvideoClips, setnewMainVideo, setAccordionVisible, setError }) => {
  const { refreshProfile, setRefreshProfile } = useSidebarContext();
  console.log(refreshProfile, 'refreshProfile');
  const { setUserName } = useUserNickname();
  const { enqueueSnackbar } = useSnackbar();
  const navigate = useNavigate();
  const [initialized] = useState(false);
  const [userEmailAddress, setUserEmailAddress] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  // const [showUserModal, setShowUserModal] = useState(false);
  const { isApiCompleted } = useSidebarContext();
  //eslint-disable-next-line
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  //eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState("down");
  const location = useLocation();
  const [lines, setLines] = useState([]);
  const [tempLines, setTempLines] = useState([]);
  const [activeIndex, setActiveIndex] = useState(null);
  const [editIndex, setEditIndex] = useState(-1);
  //eslint-disable-next-line  
  const isMountedRef = useRef(false);
  const [projectData, setProjectData] = useState([]);
  const [hoveredIndex, setHoveredIndex] = useState(-1);
  const isDashboard = window.location.pathname === '/dashboard';


  const closeDropdown = () => {
    setDropdownOpen(false);
  };

  useEffect(() => {
    setUserName(userNickname);
  }, [userNickname, setUserName]);
  
  useEffect(() => {
    if (!initialized) {
      fetchUserProfile(
        initialized,
        navigate,
        setUserNickname,
        setUserEmailAddress,
        setUserAvatar,
        HOSTINGURL
      );
      setRefreshProfile(false);
      console.log('fetchUserProfile');
    }
    // eslint-disable-next-line
  }, [initialized, navigate, setUserNickname, setUserEmailAddress, setUserAvatar, HOSTINGURL, refreshProfile ]);


  var HOSTINGURL = process.env.REACT_APP_DEV_HOSTING_URL;

  useEffect(() => {
    console.log('isApiCompleted', isApiCompleted);
    fetchProjectsData(setProjectData, setLines, setIsLoadingHistory);
    for (let i = 0; i < Math.min(3, projectData.length); i++) {
    }
  }, [isApiCompleted, projectData.length]);

  const handleUpdateProfileSuccess = () => {
    // Call fetchUserProfile to refresh the user's profile
    fetchUserProfile(
      initialized,
      navigate,
      setUserNickname,
      setUserEmailAddress,
      setUserAvatar,
      HOSTINGURL
    );
    console.log('handleUpdateProfileSuccess');
  };
  const getToken = () => {
    const encodedToken = localStorage.getItem('_sodfhgiuhih');

    if (encodedToken) {
      const decodedToken = atob(encodedToken);
      const userInfo = JSON.parse(decodedToken);
      return userInfo.token.access_token;
    } else {
      return null;
    }
  };

  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setDropdownPosition("up");
  };

  useEffect(() => {
    console.log('useEffect');
    localStorage.setItem("color-theme", "dark");
  }, []);

  useEffect(() => {
    console.log('profile start');
    if (!initialized) {
      const encodedEmail = localStorage.getItem("_auth");
      if (encodedEmail) {
        navigate("/dashboard");
      } else {
        navigate("/");
      }

      const token = getToken();

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: `${HOSTINGURL}/v1/auth/profile`,
        headers: {
          'accept': 'application/json',
          'Authorization': `Bearer ${token}`
        }
      };

      // console.log(config);

      axios.request(config)
        .then((response) => {
          console.log('fetch profile');
          // console.log(response.data, 'response.data');
          var userNickname = response.data.name;
          setUserNickname(userNickname);
          const userEmailAddress = response.data.email;
          setUserEmailAddress(userEmailAddress);
          const userAvatar = response.data.profile_image;
          console.log(userAvatar, 'userAvatar');
          setUserAvatar(userAvatar);
          const userAvatarUrl = response.data.avatar;
          console.log(userAvatarUrl, 'userAvatarUrl');
          setUserAvatar(userAvatarUrl);

          console.log('got profile')

          if (userAvatar === null) {
            console.log('userAvatar is null');
            if (userAvatarUrl) {
              console.log('userAvatarUrl is not null');
              setUserAvatar(userAvatarUrl);
            } else {
              console.log('userAvatarUrl is null');
              console.log(userEmailAddress);
              generateAvatar(userEmailAddress)
                .then((avatarUrl) => {
                  setUserAvatar(avatarUrl);
                })
                .catch((error) => {
                  // console.log(error);
                });
            }

          } else {
            setUserAvatar(userAvatar);
          }
        })
        .catch((error) => {
          console.log(error);
        });
      console.log('profile end');
    }
    // eslint-disable-next-line
  }, []);

  // Function to generate the avatar URL
  const generateAvatar = (emailAddress) => {
    console.log('generate avatar start')
    const userAvatar = emailAddress.split('@')[0];
    const avatarUrl = `https://ui-avatars.com/api/?name=${userAvatar}&background=0D8ABC&color=fff&size=128`;

    return axios.get(avatarUrl)
      .then((response) => {
        setUserAvatar(response.config.url);
        var token = getToken();

        let data = JSON.stringify({
          "avatar": response.config.url,
        });
        console.log('account update start')

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${HOSTINGURL}/v1/auth/update-profile`,
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          data: data
        };

        axios
          .request(config)
          .then((response) => {
            console.log(response.data);
            console.log('account update end')
            // setUserAvatar(avatarData);
          })
          .catch((error) => {
            console.log(error);
          });


      })
      .catch((error) => {
        console.log(error);
        throw error;
      });
  };



  // Function to delete a line
  const deleteLine = async (index) => {
    var token = getToken();
    try {
      const clickedProject = projectData[index];
      //console.log('Clicked Project ID:', clickedProject.id);
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
          'Authorization': `Bearer ${token}`
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
        setAccordionVisible(false);
        setError('');
      } catch (error) {
        console.log(error);
        // Handle error states or display an error message to the user
      }
    } catch (error) {
      console.error('Error deleting line:', error);
      // Handle error states or display an error message to the user
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
    const token = getToken();
    const updatedLine = tempLines[index];
    console.log(updatedLine, 'updatedLine')
    // console.log('Token:', token);
    // console.log('Updated Line:', updatedLine);
    // console.log('Project ID:', projectData[index].id);
    const data = qs.stringify({
      id: projectData[index].id,
      name: updatedLine
    });

    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: `${HOSTINGURL}/v1/project/update`,
      headers: {
        accept: 'application/json',
        'Content-Type': 'application/x-www-form-urlencoded',
        Authorization: `Bearer ${token}`
      },
      data: data
    };

    axios.request(config)
      .then((response) => {
        // console.log(JSON.stringify(response.data));
        // Update your lines state if needed
        const newLines = [...lines];
        newLines[index] = updatedLine;
        setLines(newLines);
        setEditIndex(-1);
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleCancelClick = () => {
    setTempLines([...lines]); // Revert temporary lines to original lines
    setEditIndex(-1); // Reset the edit index
  };

  const handleProjectClick = async (index) => {
    const token = getToken();
    console.log('Token:', token);
    const data = JSON.stringify({
      "id": projectData[index].id
    });
    const config = {
      method: 'post',
      maxBodyLength: Infinity,
      url: 'https://api.getklippie.com/v1/project/stats',
      headers: {
        'accept': 'application/json',
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      },
      data: data
    };

    const response = await axios.request(config);
    console.log(response.data, 'response.data');
    const message = response.data.data;

    if (message === "Transcribing video completed") {
      enqueueSnackbar('We are processing your video. Once done, We will send you an email.', {
        variant: 'success',
        autoHideDuration: 3000,
        anchorOrigin: {
          vertical: 'top',
          horizontal: 'right',
        },
      });
    }

    if (message === 'Clips Founded') {
      if (token) {
        const clickedProject = projectData[index];
        //console.log('Clicked Project ID:', clickedProject.id);
        var clickedProjectid = clickedProject.id;
        //main video
        let maindata = JSON.stringify({
          "id": clickedProjectid
        });

        let mainconfig = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${HOSTINGURL}/v1/project/get-by-id`,
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          data: maindata
        };

        axios.request(mainconfig)
          .then((response) => {
            console.log(response.data, 'response.data');
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

              const newMainVideo = [
                { title, description, src, id, time: formattedDuration, type }
              ];
              updateMainVideo(newMainVideo);
              setnewMainVideo(newMainVideo);
            };
          })
          .catch((error) => {
            console.log(error);
          });

        //video clips
        let data = qs.stringify({
          'project_id': clickedProjectid
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${HOSTINGURL}/v1/clip/get-by-id`,
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
          },
          data: data
        };

        try {
          const response = await axios.request(config);
          console.log(response)
          if (response.data.data && Array.isArray(response.data.data)) {
            const newvideoClips = await Promise.all(response.data.data.map(async (clip) => {
              // Split the time string into parts
              const timeParts = clip.duration.split(':');

              // Extract hours, minutes, seconds
              const hours = parseInt(timeParts[0]);
              const minutes = parseInt(timeParts[1]);
              const seconds = parseInt(timeParts[2].split('.')[0]);

              // Format the time in HH:MM:SS
              const formattedTime = `${hours < 10 ? '0' : ''}${hours}:${minutes < 10 ? '0' : ''}${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;

              return {
                id: clip.id,
                src: clip.clip_url,
                title: clip.title,
                description: clip.summary,
                status: clip.status,
                time: formattedTime,
                type: clip.type,
              };
            }));
            setNewvideoClips(newvideoClips);
            setAccordionVisible(true);
            setError('');
            navigate(`/dashboard/${projectData[index].id}`);
          } else {
            console.log('Invalid API response:', response.data);
            setAccordionVisible(false);
            console.log(clickedProjectid, 'clickedProjectid')
            setProjectId('');
            // setError('We could not find the clips for this project');
            enqueueSnackbar('We could not find the clips for this project', {
              variant: 'error',
              autoHideDuration: 1500,
              anchorOrigin: {
                vertical: 'top',
                horizontal: 'right',
              },
            });
          }
        } catch (error) {
          setAccordionVisible(false);
          console.log(clickedProjectid, 'clickedProjectid')
          setProjectId('');
          // setError('We could not find the clips for this project');
          enqueueSnackbar('We could not find the clips for this project', {
            variant: 'error',
            autoHideDuration: 1500,
            anchorOrigin: {
              vertical: 'top',
              horizontal: 'right',
            },
          });
        }
      }
    }

   
  };


  const handleAddNewVideo = () => {
    if (isDashboard) {
      return;
    }
    setShowModal(true); 
    // navigate('/dashboard');
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
      <div
        className={`${open ? "w-[260px]" : "w-fit"
          } fixed top-0 p-2  z-40 flex h-full  flex-none flex-col space-y-2  text-[14px] transition-all sm:relative sm:top-0 bg-gray-100  dark:border-gray-600 dark:bg-custom-color-dark`}
      >
        <AiOutlineMenu
          className={`${!open && "rotate-180"
            } absolute text-3xl bg-white fill-slate-800   cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-custom-color-dark`}
          onClick={() => {
            setOpen(!open);
          }}
        />
        <Link to="/dashboard">
          <div
            className={`flex ${open && "justify-center"
              } justify-center items-center select-none px-[10px] py-3`}
          >
            <img
              src={Logo}
              alt=""
              className={`w-17 h-[3rem] ${!open && "justify-center"
                } bg-white rounded-3xl`}
            />
            {open && (
              <span
                className={`text-3xl ml-4 font-bold font-poppins whitespace-nowrap dark:text-white`}
              >
                Klippie
              </span>
            )}
            {open && (
              <span
                className={`text-sm ml-2 text-white rounded-full px-2 py-0 border border-dashed border-white`}
              >
                Beta
              </span>
            )}
          </div>
        </Link>

        <div className="pt-4 pb-3">
          <button
            className={`flex items-center w-full gap-x-6 p-[0.12rem] text-base rounded-full cursor-pointer dark:text-white  border-animation ${!open && "justify-center"
              }`}
            onClick={handleAddNewVideo}
          >
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
                  } origin-left duration-300 hover:block font-semibold text-md font-ubuntu`}
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
        <div className=" flex-grow overflow-y-auto backdrop-blur-xl history">
          {isLoadingHistory ? (
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
          ) : (
              <div className=" flex-grow overflow-y-auto backdrop-blur-xl history">
                {isLoadingHistory ? (
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

                ) : (
                  <div className={`overflow-hidden ${!open && "hidden"} relative`}>
                    {lines
                      .filter((line) => line && line.trim() !== "")
                      .map((line, index) => (
                        <div
                          key={index}
                          className={`width-full row relative my-4 mx-auto pe-2 ${index === activeIndex ? "active" : ""}`}
                          onMouseEnter={() => setHoveredIndex(index)}
                          onMouseLeave={() => setHoveredIndex(-1)}
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
                                width: hoveredIndex === index ? "188px" : "243px",
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
                              {line}
                            </p>
                          )}
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
                      ))}
                  </div>
                )}
              </div>
          )}
        </div>

        <div className={` bottom-0 left-0 right-0 `}>
          <div className=" flex flex-col gap-1">
            <Menu as="div" className="relative inline-block text-left">
              <DropdownMenu
                isOpen={dropdownOpen}
                onClose={closeDropdown}
                userNickname={userNickname}
                userEmailAddress={userEmailAddress}
                setIsOpen={setDropdownOpen}
                position={dropdownPosition}
                showLogout={open}
                avatar={userAvatar}
              />
            </Menu>

            <div
              className="user group flex items-center gap-x-2 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 justify-between "
              // onClick={handleUserModal}
              onClick={toggleDropdown}
              title={userNickname}
            >
              {userAvatar ? (
                <img src={userAvatar} className="shrink-0 h-9 w-9 rounded-sm" alt="User Avatar" />
              ) : (
                <div>
                  <RotatingLines strokeColor="grey" strokeWidth="5" animationDuration="0.75" width="25" visible={true} />
                </div>
              )}
              <div
                className={`${!open && "hidden"
                  } origin-left duration-300 hover:block text-sm overflow-hidden text-ellipsis whitespace-nowrap`}
              >
                <p className="grow overflow-hidden text-ellipsis whitespace-nowrap text-left text-white font-bold">
                  {userNickname}
                </p>

              </div>

              <BsThreeDots />
            </div>

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
      <div className="pt-3">
        <HamburgerButton
          setMobileMenu={setMobileMenu}
          mobileMenu={mobileMenu}
        />
      </div>
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
    </>
  );
};

export default Sidebar;

