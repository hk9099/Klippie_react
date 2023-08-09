import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Steps from "../Pages/Steps";
import "../assets/css/Sidebar.css";

export default function Dashboard() {
  const [projectId, setProjectId] = useState(null);

 console.log("projectIddddddddddd",projectId)

  return (
    <div className="h-screen">
      <div className="flex h-full">
        <Sidebar setProjectId={setProjectId} />
        <div className="w-full overflow-x-auto dashborardbg">
          <Navbar />
          <Modal />
          {projectId && <Steps projectId={projectId} />}
        </div>
      </div>
    </div>
  );
}
