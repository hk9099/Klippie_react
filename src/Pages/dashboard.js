import React, { useState, useEffect } from "react";
import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Steps from "../Pages/Steps";
import "../assets/css/Sidebar.css";
import { Analytics } from '@vercel/analytics/react';

export default function Dashboard() {
  const [projectId, setProjectId] = useState(null);
  const [newhistoryvideoClips, setNewvideoClips] = useState([]);
  const [newmainvideo, setnewMainVideo] = useState([]);
  const [accordionVisible, setAccordionVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const setError = (message) => {
    setErrorMessage(message);
  };

  useEffect(() => {
    if (projectId) {
      setErrorMessage("");
      setAccordionVisible(true);
    } else {
      setAccordionVisible(false);
    }
    setProjectId(projectId);
  }, [projectId]);

  return (
    <div className="h-screen dashborardbg">
      <div className="flex h-full ">
        <Sidebar setProjectId={setProjectId} setNewvideoClips={setNewvideoClips} setnewMainVideo={setnewMainVideo} setAccordionVisible={setAccordionVisible} setError={setError} />
        <div className="w-full overflow-x-auto px-2">
          <p className="text-3xl text-center font-bold text-white pt-20"></p>
          {/* <Navbar /> */}
          <Modal className="z-50" />
          {accordionVisible && (projectId || newhistoryvideoClips) && <Steps projectId={projectId} newhistoryvideoClips={newhistoryvideoClips} newmainvideo={newmainvideo} errorMessage={errorMessage} accordionVisible={accordionVisible} />}
          {!accordionVisible && errorMessage && (
            <div className="flex justify-center h-screen items-center ">
              <div className="text-red-500 text-center  inline-block p-2 font-bold text-lg">
                {errorMessage}
              </div>
            </div>
          )}
        </div>
      </div>
      <Analytics />
    </div>
  );
}

