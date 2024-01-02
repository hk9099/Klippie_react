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
                var loginCount = decodedToken.user.login_count;
                var accessToken = decodedToken.token.access_token;
                var increment = Cookies.get('increment');
                return [loginCount, accessToken , increment]
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
        Cookies.remove('increment');
        // Cookies.remove('tourStatus');
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
    incrementValue: (key) => {
        const currentValue = Cookies.get(key) || 0; // Get the current value or default to 0
        const newValue = parseInt(currentValue) + 1; // Increment the value
        Cookies.set(key, newValue); // Set the updated value in the cookie
        return newValue; // Return the new value
    },
};
