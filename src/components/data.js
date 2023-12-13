


export let MainVideo = [];
if (process.env.NODE_ENV === 'development') {
console.log("MainVideo:", MainVideo);
}
export const updateMainVideo = (newMainVideo) => {
    if (process.env.NODE_ENV === 'development') {
    console.log("MainVideo updated:", MainVideo);
    }
    MainVideo = newMainVideo;
};