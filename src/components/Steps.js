import React, { useState, useEffect } from 'react';
import Steps from 'awesome-steps';
import 'awesome-steps/dist/style.css';
import axios from 'axios';
import qs from 'qs';

const StepsComponent = ({ projectId, onStart, onStop, onAllAPIsComplete }) => {
    const encodedToken = localStorage.getItem('_sodfhgiuhih');
    const userGoogle = localStorage.getItem('_auth');

    let userInfo;
    let googleUserInfo;

    if (encodedToken) {
        const decodedToken = atob(encodedToken);
        userInfo = JSON.parse(decodedToken);
        var token = userInfo.token.access_token;
    } else if (userGoogle) {
        const decodedGoogle = atob(userGoogle);
        googleUserInfo = JSON.parse(decodedGoogle);
        console.log(googleUserInfo);
    }

    const apiConfigurations = [
        {
            url: `${process.env.REACT_APP_HOSTING_URL}/v1/project/transcribe`,
            data: qs.stringify({
                project_id: projectId,
            }),
        },
        {
            url: `${process.env.REACT_APP_HOSTING_URL}/v1/project/clipfinder`,
            data: qs.stringify({
                project_id: projectId,
            }),
        },
        {
            url: `${process.env.REACT_APP_HOSTING_URL}/v1/clip/create`,
            data: qs.stringify({
                project_id: projectId,
            }),
        },
    ];

    const apiToken = 'Bearer ' + token;
    const [current, setCurrent] = useState(0);
    const [stepsStatus, setStepsStatus] = useState(Array(apiConfigurations.length).fill('process'));

    useEffect(() => {
        // Call the API or perform any other necessary actions when projectId changes
        makeAPICall(0);
    }, [projectId]);// eslint-disable-line react-hooks/exhaustive-deps

    const handleAPIResponse = (stepNumber, response) => {
        setStepStatus(stepNumber, 'finish');

        // Check if all the API calls are completed
        if (stepNumber + 1 === apiConfigurations.length) {
            onAllAPIsComplete();
        } else {
            handleStepChange(stepNumber + 1);
        }

        console.log('Step', stepNumber + 1, 'Response:', response.data);
    };

    const handleAPIError = (stepNumber, error) => {
        console.error('Step', stepNumber + 1, 'Error:', error);
        setStepStatus(stepNumber, 'error');
    };

    const makeAPICall = async (stepNumber) => {
        if (stepNumber >= apiConfigurations.length) {
            onStop(); 
            return;
        }

        if (stepsStatus[stepNumber] === 'finish' || stepsStatus[stepNumber] === 'error') {
            handleStepChange(stepNumber + 1);
            return;
        }

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: apiConfigurations[stepNumber].url,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                Authorization: apiToken,
            },
            data: apiConfigurations[stepNumber].data,
        };

        try {
            const response = await axios.request(config);
            handleAPIResponse(stepNumber, response);
        } catch (error) {
            handleAPIError(stepNumber, error);

            return;
        }
    };

    const setStepStatus = (stepNumber, status) => {
        const updatedStatus = [...stepsStatus];
        updatedStatus[stepNumber] = status;
        setStepsStatus(updatedStatus);
    };

    const handleStepChange = (stepNumber) => {
        setCurrent(stepNumber);
        makeAPICall(stepNumber);
        onStart(); 
    };
    return (
        <div className="flex flex-col items-center justify-center h-[87vh] w-full">
            <Steps
                current={current}
                labelPlacement="horizontal"
                direction="horizontal"
                onChange={handleStepChange}
                className="w-[70%!important]"
            >
                <Steps.Step
                    upperTitle="upperTitle"
                    title="Transcribe"
                    description="We are transcribing your audio/video file"
                    status={stepsStatus[0]} />
                <Steps.Step
                    title="Clip Finder"
                    description="We are finding the best clips for you"
                    status={stepsStatus[1]} />
                <Steps.Step
                    title="Clip Creator"
                    description="We are creating your clips"
                    status={stepsStatus[2]} />
            </Steps>
        </div>
    );
};

export default StepsComponent;
