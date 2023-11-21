export const calculateAudioDuration = (file) => {
  const audio = new Audio();
  audio.src = URL.createObjectURL(file);

  return new Promise((resolve, reject) => {
    audio.onloadedmetadata = () => {
      resolve(audio.duration);
    };
    audio.onerror = (error) => {
      reject(error);
    };
  });
};

export function convertDuration(seconds) {
  const minutes = Math.floor(seconds / 60);
  const remainingSeconds = Math.floor(seconds % 60);
  return `${minutes}:${remainingSeconds.toString().padStart(2, "0")}`;
}
