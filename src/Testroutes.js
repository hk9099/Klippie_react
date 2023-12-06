import React from "react";
import { useParams } from "react-router-dom"; // Import useParams from react-router-dom

function Testroutes() {
  // Use useParams to get the ID from the URL
  const { projectId } = useParams();

  return (
    <div>
      <p>ID from URL: {projectId}</p>
      <div>Testroutes</div>
    </div>
  );
}

export default Testroutes;
