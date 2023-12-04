import React, { useState, useEffect } from "react";
import { Analytics } from "@vercel/analytics/react";
import Joyride, { EVENTS, STATUS } from "react-joyride";
import Cookies from "js-cookie";

const Layout = ({ children }) => {
  const [run, setRun] = useState(true);
  const [steps, setSteps] = useState([
    {
      target: ".newProject",
      content: "Click here to create a new project",
    },
    {
      target: ".draganddrop",
      content: "Drag and drop your video files here",
    },
    {
      target: ".upgradetopro",
      content: "Upgrade to Pro to upload unlimited videos",
    }
  ]);

  useEffect(() => {
    // Check if the user has already finished the tour
    const tourStatus = Cookies.get("tourStatus");
    if (tourStatus === "finished") {
      setRun(false);
      setSteps([]); // Reset steps if the tour is finished
    }
  }, []);

  const handleJoyrideCallback = (data) => {
    const { status, type } = data;
    if ([EVENTS.STEP_AFTER, EVENTS.TARGET_NOT_FOUND].includes(type)) {
      console.log(data);
    } else if ([STATUS.FINISHED, STATUS.SKIPPED].includes(status)) {
      // Set cookie to mark the tour as finished
      Cookies.set("tourStatus", "finished");
      setRun(false);
      setSteps([]);
    }
  };

  return (
    <>
      {children}
      <Joyride
        steps={steps}
        run={run}
        continuous={true}
        showProgress={true}
        showSkipButton={true}
        showStepsProgress={true}
        disableScrolling={true}
        disableOverlayClicks={true}
        scrollToSteps={true}
        styles={{
          spotlight: {
            backgroundColor: "gray",
            border: "1px solid rgb(183 183 183)",
          },
        }}
        callback={handleJoyrideCallback}
      />
      <Analytics />
    </>
  );
};

export default Layout;
