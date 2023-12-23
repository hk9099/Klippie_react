import axios from 'axios';
import { TokenManager } from '../components/getToken.js';
import { createAvatar } from '@dicebear/core';
import { initials } from '@dicebear/collection';
// Define the async function to fetch user profile
const user = TokenManager.getToken()
// var userToken = TokenManager.getToken()[1]
const fetchUserProfile = async (initialized, navigate, setUserNickname, setUserEmailAddress, setUserAvatar,setCreadit, HOSTINGURL) => {
    if (user=== null || user === undefined) {
        navigate("/");
    } else {
        var userToken = TokenManager.getToken()[1]
    }

    // const getToken = () => {
    //     const encodedToken = localStorage.getItem('_sodfhgiuhih');

    //     if (encodedToken) {
    //         const decodedToken = atob(encodedToken);
    //         const userInfo = JSON.parse(decodedToken);
    //         return userInfo.token.access_token;
    //     } else {
    //         return null;
    //     }
    // };
   
    
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
            if (process.env.NODE_ENV === 'development') {
            console.log(response.data, 'response.data');
            }
            const userNickname = response.data.name;
            setUserNickname(userNickname);
            const userEmailAddress = response.data.email;
            setUserEmailAddress(userEmailAddress);
            const userAvatar = response.data.profile_image;
            setUserAvatar(userAvatar);
            const userAvatarUrl = response.data.avatar;
            setUserAvatar(userAvatarUrl);
            setCreadit(response.data.balance);
            if (process.env.NODE_ENV === 'development') {
            console.log('got profile');
            }
            if (userAvatar === null) {
                if (userAvatarUrl) {
                    setUserAvatar(userAvatarUrl);
                } else {
                    await generateAvatar(userEmailAddress, setUserAvatar, userToken, HOSTINGURL);
                }
            } else {
                setUserAvatar(userAvatar);
            }

        } catch (error) {
            if (process.env.NODE_ENV === 'development') {
            console.log(error);
            }
        }
    }
};

// Define the async function to generate the avatar URL
const generateAvatar = async (emailAddress, setUserAvatar, userToken, HOSTINGURL) => {
    const userAvatar = emailAddress.split('@')[0];
    // const avatarUrl = `https://ui-avatars.com/api/?name=${userAvatar}&background=0D8ABC&color=fff&size=128`;
    const avatarUrl = `https://api.dicebear.com/7.x/initials/svg?seed=${userAvatar}`;


    try {
        const response = await axios.get(avatarUrl);
        setUserAvatar(response.config.url);
        let data = JSON.stringify({
            avatar: response.config.url,
        });

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
        if (process.env.NODE_ENV === 'development') {
        console.log(error);
        }
        throw error;
    }
};

export default fetchUserProfile;
