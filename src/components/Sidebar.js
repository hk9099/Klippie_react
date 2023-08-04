import React, { useState, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";
import { IoSettingsOutline } from "react-icons/io5";
import { Menu } from "@headlessui/react";
import Logo from "../assets/images/logo.svg";
import HamburgerButton from "./HumbergerButton";
import ".././assets/css/Sidebar.css";
import { AiOutlineDelete } from "react-icons/ai";
import Modal from "./Modal";
import UserModal from "./UserModal";
import axios from "axios";
import DropdownMenu from "./DropdownMenu";
import { HiArrowNarrowLeft } from "react-icons/hi";

const Sidebar = ({ setProjectId, stepsRunning }) => {
  const navigate = useNavigate();
  const [open, setOpen] = useState(true);
  const [mobileMenu, setMobileMenu] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  //eslint-disable-next-line
  const [isLoading, setIsLoading] = useState(false);
  const [userEmailAddress, setUserEmailAddress] = useState("");
  const [userNickname, setUserNickname] = useState("");
  const [userAvatar, setUserAvatar] = useState("");
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [projectId] = useState(null);
  const [dropdownPosition, setDropdownPosition] = useState("down");
  // const [Avatar, setAvatar] = useState('');
  const location = useLocation();
  const [lines, setLines] = useState([
    "Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.",
    "Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.",
    "Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)",
    "Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.",
    "Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.",
    "Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.",
    "Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)",
    "Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.",
    "Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.",
    "Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.",
    "Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)",
    "Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.",
    "Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.",
    "Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.",
    "Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)",
    "Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.",
    "Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.",
    "Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.",
    "Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)",
    "Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.",
    "Where can we find the courage to act in spite of fear? Trying to eliminate that which we react to fearfully is a fool’s errand because it locates the source of our fear outside ourselves, rather than within our own hearts.",
    "Practicing leadership – enabling others to achieve purpose in the face of uncertainty – requires engaging the heart, the head, and the hands: motivation, strategy, and action.",
    "Leadership in organizing is rooted in three questions articulated by the first century Jerusalem sage, Rabbi Hillel: “If I am not for myself, who am I? When I am only for myself, what am I? And if not now, when? – Pirke Avot (Wisdom of the Fathers)",
    "Organizing is a practice of leadership whereby we define leadership as enabling others to achieve shared purpose under conditions of uncertainty.",
  ]);

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

  const deleteLine = (index) => {
    setLines((prevLines) => {
      const updatedLines = [...prevLines];
      updatedLines.splice(index, 1);
      return updatedLines;
    });
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
      <div
        className={`${
          open ? "w-[260px]" : "w-fit"
        } fixed top-0 p-2  z-40 flex h-full  flex-none flex-col space-y-2  text-[14px] transition-all sm:relative sm:top-0 bg-gray-100  dark:border-gray-600 dark:bg-custom-color-dark`}
      >
        <HiArrowNarrowLeft
          className={`${
            !open && "rotate-180"
          } absolute text-3xl bg-white fill-slate-800  rounded-full cursor-pointer top-9 -right-4 dark:fill-gray-400 dark:bg-custom-color-dark`}
          onClick={() => {
            setOpen(!open);
          }}
        />
        <Link to="/dashboard">
          <div
            className={`flex ${
              open && "justify-center"
            } justify-center items-center select-none px-[10px] py-3`}
          >
            <img
              src={Logo}
              alt=""
              className={`w-17 h-[3rem] ${
                !open && "justify-center"
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
            className={`flex items-center w-full gap-x-6 p-[0.10rem] text-base rounded-full cursor-pointer dark:text-white  border-animation ${
              !open && "justify-center"
            } ${stepsRunning ? "cursor-not-allowed opacity-50" : ""}`}
            onClick={handleAddNewVideo}
            disabled={stepsRunning}
          >
            <div
              className={`flex items-center w-full gap-x-6 p-3 text-base rounded-full bg-white dark:bg-gray-800 dark:text-white ${
                !open && "justify-center"
              }`}
            >
              <span
                className={`text-2xl ${
                  stepsRunning ? "text-gray-500 dark:text-gray-300" : "" // Change color when disabled
                }`}
              >
                <AiOutlinePlus className={`${!open && "justify-center"}`} />
              </span>
              <span
                className={`${
                  !open && "hidden"
                } origin-left duration-300 hover:block font-medium text-sm font-Satoshi ${
                  stepsRunning ? "text-gray-500 dark:text-gray-300" : "" // Change color when disabled
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
        <div className=" flex-grow overflow-y-auto backdrop-blur-xl	">
          <div className={`overflow-hidden ${!open && "hidden"} relative`}>
            {lines.map((line, index) => (
              <div
                key={index}
                className="width-content row relative  my-4 "
              >
                <p
                  className="py-2 px-2  text-sm font-medium text-gray-700 dark:text-gray-500 cursor-pointer hover:text-gray-900 dark:hover:text-white hover:border-l-2 hover:border-gray-900 dark:hover:border-white"
                  style={{
                    width: "243px",
                    whiteSpace: "nowrap",
                    overflow: "hidden",
                    textOverflow: "ellipsis",
                    userSelect: "none",
                  }}
                >
                  {line}
                </p>
                <button
                  onClick={() => deleteLine(index)}
                  className="delete-button"
                >
                  <AiOutlineDelete />
                </button>
              </div>
            ))}
          </div>
        </div>
        <div className={` bottom-0 left-0 right-0 `}>
          <div className=" flex flex-col gap-1">
            <Menu as="div" className="relative inline-block text-left">
              <Menu.Button
                onClick={toggleDropdown}
                className={`w-full flex items-center gap-x-6 p-3 text-base font-normal rounded-lg cursor-pointer dark:text-white hover:bg-gray-200 dark:hover:bg-gray-700 mt-2
                                        ${
                                          location.pathname === "/dashboard" &&
                                          ""
                                        } ${!open && "justify-center"}`}
              >
                <span className="text-2xl h-6 w-12 flex items-center justify-center">
                  <IoSettingsOutline />
                </span>
                <span
                  className={`${
                    !open && "hidden"
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
                className={`${
                  !open && "hidden"
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
          className={`${
            mobileMenu ? "flex" : "hidden"
          } absolute z-50 flex-col items-center self-end py-8 mt-16 space-y-6 font-bold sm:w-auto left-6 right-6 dark:text-white  bg-blackk-50 dark:bg-slate-800 drop-shadow md rounded-xl`}
        >
          <Link to="/dashboard" onClick={() => setMobileMenu(false)}>
            <span
              className={` ${
                location.pathname === "/dashboard" &&
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
