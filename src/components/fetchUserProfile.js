import axios from 'axios';
import { TokenManager } from '../components/getToken.js';

// Define the async function to fetch user profile
var userToken = TokenManager.getToken();
const fetchUserProfile = async (initialized, navigate, setUserNickname, setUserEmailAddress, setUserAvatar, HOSTINGURL) => {

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
    if (!initialized) {
        // const encodedEmail = localStorage.getItem("_auth");

        // if (encodedEmail) {
        //     navigate("/dashboard");
        // } else {
        //     navigate("/");
        // }

        try {
            const response = await axios.post(
                `https://dev-api.getklippie.com/v1/auth/profile`,
                {},
                {
                    headers: {
                        accept: 'application/json',
                        Authorization: `Bearer ${userToken}`,
                    },
                }
            );

            console.log('fetch profile');
            const userNickname = response.data.name;
            setUserNickname(userNickname);
            const userEmailAddress = response.data.email;
            setUserEmailAddress(userEmailAddress);
            const userAvatar = response.data.profile_image;
            // console.log(userAvatar, 'userAvatarrrrrrrrrrrr');
            setUserAvatar(userAvatar);
            const userAvatarUrl = response.data.avatar;
            // console.log(userAvatarUrl, 'userAvatarUrllllllllllllllllll');
            setUserAvatar(userAvatarUrl);

            console.log('got profile');

            if (userAvatar === null) {
                // console.log('userAvatar is null');
                if (userAvatarUrl) {
                    // console.log('userAvatarUrl is not null');
                    setUserAvatar(userAvatarUrl);
                } else {
                    // console.log('userAvatarUrl is null');
                    // console.log(userEmailAddress);
                    await generateAvatar(userEmailAddress, setUserAvatar, getToken, HOSTINGURL);
                }
            } else {
                setUserAvatar(userAvatar);
            }

            // console.log('profile end');
        } catch (error) {
            // console.log(error);
        }
    }
};

// Define the async function to generate the avatar URL
const generateAvatar = async (emailAddress, setUserAvatar, getToken, HOSTINGURL) => {
    // console.log('generate avatar start');
    const userAvatar = emailAddress.split('@')[0];
    const avatarUrl = `https://ui-avatars.com/api/?name=${userAvatar}&background=0D8ABC&color=fff&size=128`;

    try {
        const response = await axios.get(avatarUrl);
        setUserAvatar(response.config.url);
        let data = JSON.stringify({
            avatar: response.config.url,
        });
        console.log('account update start');

        let config = {
            method: 'post',
            maxBodyLength: Infinity,
            url: `${HOSTINGURL}/v1/auth/update-profile`,
            headers: {
                accept: 'application/json',
                'Content-Type': 'application/json',
                Authorization: `Bearer ${userToken}`,
            },
            data: data,
        };

        //eslint-disable-next-line
        const updateResponse = await axios.request(config);
    } catch (error) {
        console.log(error);
        throw error;
    }
};

export default fetchUserProfile;
