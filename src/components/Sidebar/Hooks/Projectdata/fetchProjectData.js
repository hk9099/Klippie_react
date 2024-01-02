import axios from 'axios';
import { TokenManager } from '../../../Config/Token/getToken.js';

async function fetchProjectsData(baseUrl,setProjectData, setLines, setIsLoadingHistory, setVideoURL) {

    const userToken = TokenManager.getToken()[1]

    if (!userToken) {
        console.error('No token available');
        return;
    }

    setIsLoadingHistory(true);
    try {
        const response = await axios.post(
            `${baseUrl}/v1/project/get-my-all`,
            null,
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${userToken}`,
                },
            }
        );

        const projectData = response.data.data;
        if (process.env.NODE_ENV === 'development') {
        console.log('Projects:', projectData);
        }
        setProjectData(projectData);
        if (projectData.length > 0) {
            setLines(projectData.map(project => project.title));
            setVideoURL(projectData.map(project => project.video_url));
        }
        setIsLoadingHistory(false);

    } catch (error) {
        setIsLoadingHistory(false);
    }
}

export default fetchProjectsData;