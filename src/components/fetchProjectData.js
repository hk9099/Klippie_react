import axios from 'axios';

var HOSTINGURL = 'https://api.getklippie.com';

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

async function fetchProjectsData(setProjectData, setLines) {
    const token = getToken();
    if (!token) {
        console.error('No token available');
        return [];
    }

    try {
        const response = await axios.post(
            `${HOSTINGURL}/v1/project/get-my-all`,
            null,
            {
                headers: {
                    'accept': 'application/json',
                    'Authorization': `Bearer ${token}`,
                },
            }
        );

        // console.log('Projects:', response.data);
        const projectData = response.data.data;
        setProjectData(projectData);

        if (projectData.length > 0) {
            const newLines = projectData.map(project => project.name);
            console.log('New Lines:', newLines);
            setLines(newLines);
            return newLines;
        }

        return [];
    } catch (error) {
        console.error('API Error:', error);
        return [];
    }
}

export default fetchProjectsData;

