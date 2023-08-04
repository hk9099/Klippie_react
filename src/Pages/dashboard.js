import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Steps from "../Pages/Steps";
import AccordionSection from "../components/AccordionSection.js";
import "../assets/css/Sidebar.css";

export default function Dashboard() {
  const [projectId, setProjectId] = useState(null);

  const handleSubmit = (newProjectId) => {
    setProjectId(newProjectId);
    console.log("newProjectId", newProjectId);
  };

  return (
    <div className="h-screen">
      <div className="flex h-full"> 
        <Sidebar setProjectId={setProjectId} />
        <div className="w-full overflow-x-auto dashborardbg">
          <Navbar />

          {!projectId && <Modal onSubmit={handleSubmit} />}
          {projectId && <Steps projectId={projectId} />}

          <AccordionSection />
        </div>
      </div>
    </div>
  );
}
