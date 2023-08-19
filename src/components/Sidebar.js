import React, { useState, useEffect,useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlineMenu, AiOutlinePlus } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { Menu } from "@headlessui/react";
import Logo from "../assets/images/logo.svg";
import HamburgerButton from "./HumbergerButton";
import ".././assets/css/Sidebar.css";
import Modal from "./Modal";
import UserModal from "./UserModal";
import axios from "axios";
import qs from "qs";
import DropdownMenu from "./DropdownMenu";
import { ToastContainer, toast } from "react-toastify";
import HistorySection from "../components/HistorySection";
import { updateMainVideo } from "./data";

const Sidebar = ({ setProjectId, stepsRunning, setNewvideoClips  }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  //eslint-disable-next-line
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  //eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [userEmailAddress, setUserEmailAddress] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState("down");
  const location = useLocation();
  const [lines, setLines] = useState([]);
  //eslint-disable-next-line
  const isMountedRef = useRef(false);
  const [projectData, setProjectData] = useState([]); 



  const getToken = () => {
    const encodedToken = localStorage.getItem('_sodfhgiuhih');
    const userGoogle = localStorage.getItem('_auth');

    if (encodedToken) {
      const decodedToken = atob(encodedToken);
      const userInfo = JSON.parse(decodedToken);
      return userInfo.token.access_token;
    } else if (userGoogle) {
      const decodedGoogle = atob(userGoogle);
      const googleUserInfo = JSON.parse(decodedGoogle);
      return googleUserInfo.token.access_token;
    } else {
      return null;
    }
  };

  useEffect(() => {
    const token = getToken(); 
    if (!token) {
      console.error('No token available');
      return;
    }

      const fetchProjects = async () => {
        try {
          setIsLoadingHistory(true);
          const response = await axios.post(
            'https://api.getklippie.com/v1/project/get-my-all',
            null,
            {
              headers: {
                'accept': 'application/json',
                'Authorization': `Bearer ${token}`,
              },
            }
          );

          console.log('Projects:', response.data);
          const projectData = response.data.data; 
          setProjectData(projectData);

          if (projectData.length > 0) {
            setLines(projectData.map(project => project.name)); 
          }
          setIsLoadingHistory(false);
        } catch (error) {
          console.error('API Error:', error);
          setIsLoadingHistory(false);
        }
      };

      fetchProjects();
  }, []);



  const toggleDropdown = () => {
    setDropdownOpen(!dropdownOpen);
    setDropdownPosition("up");
  };

  useEffect(() => {
    localStorage.setItem("color-theme", "dark");
  }, []);

  useEffect(() => {
    const encodedEmail = localStorage.getItem("_auth");
    if (encodedEmail) {
      navigate("/dashboard");
    } else {
      navigate("/");
    }

    const encodedToken = localStorage.getItem("_sodfhgiuhih");
    const userGoogle = localStorage.getItem("_auth");

    let userInfo;
    let googleUserInfo;
    let userAvatarImage;

    if (encodedToken) {
      const decodedToken = atob(encodedToken);
      userInfo = JSON.parse(decodedToken);
    } else if (userGoogle) {
      const decodedGoogle = atob(userGoogle);
      googleUserInfo = JSON.parse(decodedGoogle);
    }

    let userAvatar;
    let userNickname;
    let userEmailAddress;

    if (userInfo?.user?.name) {
      const userAvatarName = userInfo.user.name;

      let config = {
        method: "get",
        maxBodyLength: Infinity,
        url: `https://ui-avatars.com/api/?name=${userAvatarName}&background=0D8ABC&color=fff&size=128`,
        headers: {},
      };

      axios(config)
        .then((response) => {
          userAvatarImage = response.config.url;

          userAvatar = userAvatarImage;
          userNickname = userInfo.user.name;
          userEmailAddress = userInfo.user.email;

          setUserAvatar(userAvatar);
          setUserNickname(userNickname);
          setUserEmailAddress(userEmailAddress);

          // console.log(userAvatar, "userAvatar");
        })
        .catch((error) => {
          console.log(error);
        });
    } else if (googleUserInfo?.googleImage) {
      userAvatar = googleUserInfo.googleImage;
      userNickname = googleUserInfo.googleName;
      userEmailAddress = googleUserInfo.googleEmail;

      setUserAvatar(userAvatar);
      setUserNickname(userNickname);
      setUserEmailAddress(userEmailAddress);

      // console.log(userAvatar, "userAvatar");
    } else {
      userAvatar = "";
      userNickname = "";
      userEmailAddress = "";
    }
  }, [navigate]);

  const deleteLine = async (index) => {
    var token = getToken();
    try {
      const clickedProject = projectData[index];
      console.log('Clicked Project ID:', clickedProject.id);
      var clickedProjectid = clickedProject.id;

      let data = qs.stringify({
        'project_id': clickedProjectid
      });

      let config = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.getklippie.com/v1/project/delete',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        },
        data: data
      };

      axios.request(config)
        .then((response) => {
          console.log(JSON.stringify(response.data));

          // If the API call is successful, update the state
          setLines((prevLines) => {
            const updatedLines = [...prevLines];
            updatedLines.splice(index, 1); // Remove the item at the index
            return updatedLines;
          });
        })
        .catch((error) => {
          console.log(error);
          // Handle error states or display an error message to the user
        });
    } catch (error) {
      console.error('Error deleting line:', error);
      // Handle error states or display an error message to the user
    }
  };




  const handleProjectClick = async (index) => {
    const token = getToken();
    console.log('Token:', token);
    if (token) {
      const clickedProject = projectData[index];
      console.log('Clicked Project ID:', clickedProject.id);
      var clickedProjectid = clickedProject.id;
      //main video 
      let maindata = JSON.stringify({
        "id": clickedProjectid
      });

      let mainconfig = {
        method: 'post',
        maxBodyLength: Infinity,
        url: 'https://api.getklippie.com/v1/project/get-by-id',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        data: maindata
      };

      axios.request(mainconfig)
        .then((response) => {
          console.log(response.data);
          const title = response.data.data.name;
          const description = response.data.data.description;
          const src = response.data.data.video_url;
          const id = response.data.data.id;

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
              { title, description, src, id, time: formattedDuration }
            ];
            updateMainVideo(newMainVideo);
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
        url: 'https://api.getklippie.com/v1/clip/get-by-id',
        headers: {
          'accept': 'application/json',
          'Content-Type': 'application/x-www-form-urlencoded',
          'Authorization': `Bearer ${token}`
        },
        data: data
      };

      try {
        const response = await axios.request(config);
        console.log(response.data.data);
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
              time: formattedTime
            };
          }));
          setNewvideoClips(newvideoClips);
        } else {
          console.log('Invalid API response:', response.data);
        }
      } catch (error) {
        toast.error('Error while fetching clips', {
          position: toast.POSITION.TOP_RIGHT
        });
      }
    }
  };


  const handleAddNewVideo = () => {
    if (!stepsRunning) {
      setShowModal(true);
    }
  };

  const handleFormSubmit = (projectId) => {
    setProjectId(projectId);
    setShowModal(false);
  };

  const handleUserModal = () => {
    setShowUserModal(true);
  };

  

  return (
    <>
      <ToastContainer />
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
          </div>
        </Link>
        <div className="pt-4 pb-3">
          <button
            className={`flex items-center w-full gap-x-6 p-[0.12rem] text-base rounded-full cursor-pointer dark:text-white  border-animation ${!open && "justify-center"
              } ${stepsRunning ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={handleAddNewVideo}
            disabled={stepsRunning}
          >
            <div
              className={`flex items-center w-full gap-x-6 p-3 text-base rounded-full bg-white dark:bg-gray-800 dark:text-white ${!open && "justify-center"
                }`}
            >
              <span
                className={`text-2xl ${stepsRunning ? "text-gray-500 dark:text-gray-300" : "" // Change color when disabled
                  }`}
              >
                <AiOutlinePlus className={`${!open && "justify-center"}`} />
              </span>
              <span
                className={`${!open && "hidden"
                  } origin-left duration-300 hover:block font-medium text-sm font-Satoshi ${stepsRunning ? "text-gray-500 dark:text-gray-300" : "" // Change color when disabled
                  }`}
              >
                New Audio / Video
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
          <HistorySection lines={lines} isLoading={isLoadingHistory} handleProjectClick={handleProjectClick} deleteLine={deleteLine} />
        </div>

        <div className={` bottom-0 left-0 right-0 `}>
          <div className=" flex flex-col gap-1">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button
                onClick={toggleDropdown}
                className={`w-full flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 mt-2
                                        ${location.pathname === "/dashboard" &&
                  ""
                  } ${!open && "justify-center"}`}
              >
                <span className="text-2xl h-6 w-12 flex items-center justify-center">
                  <IoSettingsOutline />
                </span>
                <span
                  className={`${!open && "hidden"
                    } origin-left duration-300 hover:block text-sm`}
                >
                  Settings
                </span>
              </Menu.Button>

              <DropdownMenu
                isOpen={dropdownOpen}
                setIsOpen={setDropdownOpen}
                position={dropdownPosition}
                showLogout={open}
              />
            </Menu>

            <div
              className="user group flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 "
              onClick={handleUserModal}
              title={userEmailAddress}
            >
              <img
                className="shrink-0 h-12 w-12 rounded-full"
                src={userAvatar}
                alt="Avatar"
              />
              <div
                className={`${!open && "hidden"
                  } origin-left duration-300 hover:block text-sm overflow-hidden text-ellipsis whitespace-nowrap`}
              >
                <p className="text-sm font-black text-gray-900 dark:text-white">
                  {userNickname}
                </p>
                <p className="text-sm font-black text-gray-900 dark:text-white text-ellipsis overflow-hidden">
                  {userEmailAddress}
                </p>
              </div>
            </div>

            <UserModal
              isOpen={showUserModal}
              onClose={() => setShowUserModal(false)}
              userNickname={userNickname}
              userEmailAddress={userEmailAddress}
              avatar={userAvatar}
              isLoading={isLoading}
              onSubmit={(values) => {
                console.log(values);
                setShowUserModal(false);
              }}
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
