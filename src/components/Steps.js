import React, { Component } from 'react';
import Steps from 'awesome-steps';
import 'awesome-steps/dist/style.css';
import axios from 'axios';
import qs from 'qs';

const encodedToken = localStorage.getItem('_sodfhgiuhih');
const userGoogle = localStorage.getItem('_auth');

let userInfo;
let googleUserInfo;

if (encodedToken) {
    const decodedToken = atob(encodedToken);
    userInfo = JSON.parse(decodedToken);
    var token = userInfo.token.access_token
} else if (userGoogle) {
    const decodedGoogle = atob(userGoogle);
    googleUserInfo = JSON.parse(decodedGoogle);
    console.log(googleUserInfo)
}

const apiConfigurations = [
    {
        url: 'https://api.getklippie.com/v1/project/transcribe',
        data: qs.stringify({
            'project_id': '883322e1-2a4e-4e94-bd20-9827f7572858',
        }),
    },
    {
        url: 'https://api.getklippie.com/v1/project/clipfinder',
        data: qs.stringify({
            'project_id': '883322e1-2a4e-4e94-bd20-9827f7572858',
        }),
    },
    {
        url: 'https://api.getklippie.com/v1/clip/create',
        data: qs.stringify({
            'project_id': '883322e1-2a4e-4e94-bd20-9827f7572858'
        }),
    },
];

const apiToken = 'Bearer ' + token;

export default class App extends Component {
    constructor(props) {
        super(props);
        this.state = {
            current: 0,
            stepsStatus: Array(apiConfigurations.length).fill('process'),
        };
        this.currentStep = 0; // Variable to keep track of the current step number
    }

    componentDidMount() {
        this.handleStepChange(0);
    }

    handleAPIResponse = (stepNumber, response) => {
        const resposesting = JSON.stringify(response.data);
        var responsep = JSON.parse(resposesting);
        console.log(responsep, stepNumber, "response");

        this.setStepStatus(stepNumber, 'finish');
        this.currentStep++; // Increment the currentStep after successful API call
        this.handleStepChange(this.currentStep); // Make the next API call
    };

    handleAPIError = (stepNumber, error) => {
        console.log(error);
        this.setStepStatus(stepNumber, 'error');
    };

    makeAPICall = async (stepNumber) => {
        if (stepNumber >= apiConfigurations.length) {
            return;
        }

        const config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: apiConfigurations[stepNumber].url,
            headers: {
                'accept': 'application/json',
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': apiToken,
            },
            data: apiConfigurations[stepNumber].data,
        };

        try {
            const response = await axios.request(config);
            this.handleAPIResponse(stepNumber, response);
        } catch (error) {
            this.handleAPIError(stepNumber, error);
        }
    };

    setStepStatus = (stepNumber, status) => {
        const { stepsStatus } = this.state;
        stepsStatus[stepNumber] = status;
        this.setState({ stepsStatus });
    };

    handleStepChange = async (stepNumber) => {
        this.setState({ current: stepNumber });
        this.currentStep = stepNumber; // Set the currentStep to the provided stepNumber
        await this.makeAPICall(stepNumber); // Wait for the API call to complete
    };

    render() {
        return (
            <Steps
                current={this.state.current}
                labelPlacement="horizontal"
                direction="horizontal"
                onChange={this.handleStepChange}
            >
                <Steps.Step
                    upperTitle="upperTitle"
                    title="first"
                    description="description"
                    status={this.state.stepsStatus[0]}
                />
                <Steps.Step
                    title="second"
                    status={this.state.stepsStatus[1]}
                />
                <Steps.Step
                    title="third"
                    status={this.state.stepsStatus[2]}
                />
            </Steps>
        );
    }
}