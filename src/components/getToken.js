// TokenManager.js

import Cookies from 'js-cookie';

export const TokenManager = {
    setToken: (token, expirationMinutes = 2160, encodedUser ) => {
        // Calculate the expiration time
        const expirationTime = new Date();
        expirationTime.setTime(expirationTime.getTime() + expirationMinutes * 60 * 1000);

        // Set the token and its expiration time as cookies
        Cookies.set('userToken', token, { expires: expirationTime });
        Cookies.set('userToken_expires', expirationTime );
        Cookies.set('encodedUser', encodedUser );
    },
    getToken: () => {
        var token = Cookies.get('encodedUser');
        if (token) {
            try {
                var decoded = atob(token);
                var decodedToken = JSON.parse(decoded);
                var accessToken = decodedToken.token.access_token;
                return accessToken;
            } catch (error) {
                console.error('Error decoding the encodedUser cookie:', error);
            }
        }
        return null;
    },
    removeToken: () => {
        Cookies.remove('userToken');
        Cookies.remove('userToken_expires');
        Cookies.remove('encodedUser');
    },
    isTokenExpired: () => {
        const expirationTime = new Date(Cookies.get('userToken_expires'));
        const currentTime = new Date();

        // console.log('Current Time:', currentTime);
        // console.log('Expiration Time:', expirationTime);

        const isExpired = currentTime >= expirationTime;
        // console.log('Token is Expired:', isExpired);

        return isExpired;
    },
};
