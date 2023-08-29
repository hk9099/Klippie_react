import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Steps from "../Pages/Steps";
import "../assets/css/Sidebar.css";

export default function Dashboard() {
  const [projectId, setProjectId] = useState(null);
  const [newhistoryvideoClips, setNewvideoClips] = useState([]);
  return (
    <div className="h-screen dashborardbg">
      <div className="flex h-full ">
        <Sidebar setProjectId={setProjectId} setNewvideoClips={setNewvideoClips} />
        <div className="w-full overflow-x-auto pt-20 px-2">
          {/* <Navbar /> */}
          <Modal className="z-50"/>
          {(projectId || newhistoryvideoClips) && <Steps projectId={projectId} newhistoryvideoClips={newhistoryvideoClips} />}
        </div>
      </div>
    </div>
  );
}

