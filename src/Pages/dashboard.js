import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import Sidebar from "../components/Sidebar";
// import Navbar from "../components/Navbar";
import Modal from "../components/Modal";
import Steps from "../Pages/Steps";
import "../assets/css/Sidebar.css";
import { Analytics } from '@vercel/analytics/react';
import axios from "axios";
import qs from "qs";
import { useNavigate } from 'react-router-dom';



export default function Dashboard() {
  const navigate = useNavigate();
  const { projectId: routeProjectId } = useParams();
  console.log(routeProjectId);
  const [projectId, setProjectId] = useState(null);
  const [newvideoClips, setNewvideoClips] = useState([]);
  const [newmainvideo, setnewMainVideo] = useState([]);
  const [accordionVisible, setAccordionVisible] = useState(true);
  const [errorMessage, setErrorMessage] = useState("");
  const getToken = () => {
    const encodedToken = localStorage.getItem('_sodfhgiuhih');

    if (encodedToken) {
      const decodedToken = atob(encodedToken);
      const userInfo = JSON.parse(decodedToken);
      return userInfo.token.access_token;
    } else {
      return null;
    }
  };

  var HOSTINGURL = 'https://api.getklippie.com';
  useEffect(() => {
    console.log('routeProjectId', routeProjectId);
    const handleProjectClick = async (index) => {
      const token = getToken();
      console.log('Token:', token);
      if (token) {
        //main video 
        let maindata = JSON.stringify({
          "id": routeProjectId
        });

        let mainconfig = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${HOSTINGURL}/v1/project/get-by-id`,
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          data: maindata
        };

        axios.request(mainconfig)
          .then((response) => {
            console.log(response.data, 'response.data');
            const title = response.data.data.title;
            const description = response.data.data.description;
            const src = response.data.data.video_url;
            const id = response.data.data.id;
            const type = response.data.data.type;

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
                { title, description, src, id, time: formattedDuration, type }
              ];
              setnewMainVideo(newMainVideo);
            };
          })
          .catch((error) => {
            console.log(error);
          });

        //video clips
        let data = qs.stringify({
          'project_id': routeProjectId
        });

        let config = {
          method: 'post',
          maxBodyLength: Infinity,
          url: `${HOSTINGURL}/v1/clip/get-by-id`,
          headers: {
            'accept': 'application/json',
            'Content-Type': 'application/x-www-form-urlencoded',
            'Authorization': `Bearer ${token}`
          },
          data: data
        };

        try {
          const response = await axios.request(config);
          console.log(response)
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
                time: formattedTime,
                type: clip.type,
              };
            }));
            setNewvideoClips(newvideoClips);
            setAccordionVisible(true);
            navigate(`/dashboard/${routeProjectId}`);
          } else {
            console.log('Invalid API response:', response.data);
            setAccordionVisible(false);
            setProjectId('');
            // setError('We could not find the clips for this project');
          }
        } catch (error) {
          setAccordionVisible(false);
          setProjectId('');
          // setError('We could not find the clips for this project');
      
        }
      }
    };

    handleProjectClick()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [routeProjectId , setAccordionVisible, setProjectId, setErrorMessage, setNewvideoClips, setnewMainVideo]);

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
        <Sidebar setProjectId={setProjectId} setNewvideoClips={setNewvideoClips} setnewMainVideo={setnewMainVideo} setAccordionVisible={setAccordionVisible} setError={setErrorMessage} />
        <div className="w-full overflow-x-auto px-2">
          {/* <Navbar /> */}
          <Modal className="z-50" />
          {accordionVisible && (projectId || newvideoClips) && <Steps projectId={projectId} newhistoryvideoClips={newvideoClips} newmainvideo={newmainvideo} errorMessage={errorMessage} accordionVisible={accordionVisible} />}
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
