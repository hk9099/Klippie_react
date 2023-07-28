import React, { useState } from 'react';
import Sidebar from '../components/Sidebar';
import Navbar from '../components/Navbar';
import StepsComponent from '../components/Steps';
import Modal from '../components/Modal';

export default function Dashboard() {
  const [projectId, setProjectId] = useState(null);
  const [key, setKey] = useState(0); // Key to reset StepsComponent
  const [stepsRunning, setStepsRunning] = useState(false); // State to track if Steps are running
  //eslint-disable-next-line
  const [newVideoButtonEnabled, setNewVideoButtonEnabled] = useState(false);

  const handleSubmit = (newProjectId) => {
    setKey((prevKey) => prevKey + 1); // Increment key to reset StepsComponent
    setProjectId(newProjectId); // Set the new project ID
  };

  // Function to start Steps and set stepsRunning to true
  const startSteps = () => {
    setStepsRunning(true);
  };

  // Function to stop Steps and set stepsRunning back to false
  const stopSteps = () => {
    setStepsRunning(false);
  };

  // Function to enable the "New Video" button when all APIs are completed
  const handleAllAPIsComplete = () => {
    setNewVideoButtonEnabled(true);
    stopSteps();
  };

  // Function to handle the click on the "New Video" button
//eslint-disable-next-line
  const handleNewVideoButtonClick = () => {
    // Perform the desired action when the button is clicked
    console.log('New Video Button Clicked!');
    // You can also reset the state or perform any other action as needed.
  };

  return (
    <div className="flex flex-auto h-screen">
      <Sidebar setProjectId={setProjectId} stepsRunning={stepsRunning} />
      <div className="grow">
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
        {/* {newVideoButtonEnabled && (
          <button
            className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded"
            onClick={handleNewVideoButtonClick}
          >
            New Video
          </button>
        )} */}
      </div>
    </div>
  );
}
