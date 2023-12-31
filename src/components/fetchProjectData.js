import axios from 'axios';
import { TokenManager } from '../components/getToken.js';

var HOSTINGURL = 'https://dev-api.getklippie.com';

async function fetchProjectsData(setProjectData, setLines, setIsLoadingHistory, setVideoURL) {

    const userToken = TokenManager.getToken()[1]

    if (!userToken) {
        console.error('No token available');
        return;
    }

    setIsLoadingHistory(true);
    try {
        const response = await axios.post(
            `${HOSTINGURL}/v1/project/get-my-all`,
            null,
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
            }
        );

        // console.log('Projects:', response.data);
        const projectData = response.data.data;
        console.log('Projects:', projectData);
        setProjectData(projectData);
        if (projectData.length > 0) {
            setLines(projectData.map(project => project.name));
            setVideoURL(projectData.map(project => project.video_url));
        }
        setIsLoadingHistory(false);

    } catch (error) {
        setIsLoadingHistory(false);
    }
}

export default fetchProjectsData;