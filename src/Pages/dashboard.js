import React, { useState } from "react";
import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import StepsComponent from "../components/Steps";
import Modal from "../components/Modal";
import Mainvideo from "../components/Mainvideo";
import Videoclips from "../components/Videoclips";
import "../assets/css/Sidebar.css";

import {
  Accordion,
  AccordionBody,
  AccordionHeader,
  AccordionItem,
} from "react-headless-accordion";
import { FiChevronDown, FiChevronRight } from "react-icons/fi";

export default function Dashboard() {
  const [projectId, setProjectId] = useState(null);
  const [key, setKey] = useState(0);
  const [stepsRunning, setStepsRunning] = useState(false);
  const [openStates, setOpenStates] = useState([true, true]);
  const [videoCount, setVideoCount] = useState(0);

  const handleSubmit = (newProjectId) => {
    setKey((prevKey) => prevKey + 1);
    setProjectId(newProjectId);
  };

  const startSteps = () => {
    setStepsRunning(true);
  };

  const stopSteps = () => {
    setStepsRunning(false);
  };

  const handleAllAPIsComplete = () => {
    stopSteps();
  };

  const toggleAccordion = (index) => {
    setOpenStates((prev) =>
      prev.map((state, i) => (i === index ? !state : state))
    );
  };

  return (
    <div className="h-screen">
      <div className="flex h-full">
        <Sidebar setProjectId={setProjectId} stepsRunning={stepsRunning} />
        <div className="w-full overflow-x-auto dashborardbg">
          <Navbar />
          {projectId && (
            <StepsComponent
              projectId={projectId}
              key={key}
              onStart={startSteps}
              onStop={stopSteps}
              onAllAPIsComplete={handleAllAPIsComplete}
            />
          )}
          {!projectId && <Modal onSubmit={handleSubmit} />}
          <div className="flex-grow-0 flex-shrink-0 w-[100%] h-[90%] overflow-y-auto overflow-x-scroll">
            <Accordion alwaysOpen={true} className="p-4">
              <AccordionItem isActive={openStates[0]}>
                <AccordionHeader
                  onClick={() => toggleAccordion(0)}
                  className="cursor-pointer flex items-center justify-between mt-2 mb-3"
                >
                  <div className="flex items-center">
                    {openStates[0] ? (
                      <FiChevronDown className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                    ) : (
                      <FiChevronRight className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                    )}
                    <h3 className="dark:text-gray-200 text-gray-800 text-xl font-normal font-Satoshi ">
                      Main Video
                    </h3>
                  </div>
                </AccordionHeader>
                <AccordionBody>
                  <div className="relative w-full h-fit overflow-y-auto rounded-[10px] border border-gray-200 dark:border-gray-700 z-10">
                    <Mainvideo />
                  </div>
                </AccordionBody>
              </AccordionItem>

              <AccordionItem isActive={openStates[1]}>
                <AccordionHeader
                  onClick={() => toggleAccordion(1)}
                  className="cursor-pointer flex items-center justify-between mt-4 mb-4"
                >
                  <div className="flex items-center">
                    {openStates[1] ? (
                      <FiChevronDown className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                    ) : (
                      <FiChevronRight className="mr-2 dark:text-gray-200 text-gray-600 text-lg font-bold" />
                    )}
                    <h3 className="dark:text-gray-200 text-gray-800 text-xl font-normal font-Satoshi">
                      Video Clips{" "}
                      <span className="text-sm font-thin text-gray-400">
                        ({videoCount})
                      </span>
                    </h3>
                  </div>
                </AccordionHeader>


                <AccordionBody>
                  <div className="relative w-full h-fit overflow-y-auto rounded-[10px] border border-gray-200 dark:border-gray-700 z-10">
                    <Videoclips setVideoCount={setVideoCount} />
                  </div>
                </AccordionBody>
              </AccordionItem>

            </Accordion>
          </div>
        </div>
      </div>
    </div>
  );
}
