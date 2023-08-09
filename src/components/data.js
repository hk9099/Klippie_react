export let VideoClips = [];

export const updateVideoClips = (newVideoClip) => {
    VideoClips.push(newVideoClip);
    console.log("VideoClip added:", newVideoClip);
    console.log("Updated VideoClips:", VideoClips);
};


export let MainVideo = [];
export const updateMainVideo = (newMainVideo) => {
    MainVideo = newMainVideo;
    console.log("MainVideo updated:", MainVideo);
};