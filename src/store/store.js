// // src/app/store.js
// import { configureStore } from '@reduxjs/toolkit';
// import getApiReducer from '../features/api/apiSlice';
// import postApiReducer from '../features/api/postApiSlice';

// const store = configureStore({
//   reducer: {
//     getApi: getApiReducer,
//     postApi: postApiReducer,
//     // Add other reducers here
//   },
// });

// export default store;


// src/app/store.js
import { configureStore } from '@reduxjs/toolkit';
import thunk from 'redux-thunk';
import authReducer from '../utils/signInAuth';

const store = configureStore({
  reducer: {
    auth: authReducer,
    // Add other reducers here
  },
});

export default store;
