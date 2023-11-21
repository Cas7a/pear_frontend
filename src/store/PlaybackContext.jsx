import React, { createContext, useState, useEffect, useRef } from "react";

export const PlaybackContext = createContext();
const audio = new Audio();

export const PlaybackProvider = ({ children }) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentSong, setCurrentSong] = useState(null);
  const [queue, setQueue] = useState(
    JSON.parse(sessionStorage.getItem("queue"))
  );
  const [currentIndex, setCurrentIndex] = useState(
    JSON.parse(sessionStorage.getItem("currentIndex"))
  );

  const [seekValue, setSeekValue] = useState(0);
  const [isUserSeeking, setIsUserSeeking] = useState(false);
  const [songProgress, setSongProgress] = useState(0);
  const [volume, setVolume] = useState(0.5);
  const [queueEnded, setQueueEnded] = useState(false);

  const audioRef = useRef(audio);
  const buttonRef = useRef();

  useEffect(() => {
    let intervalId;

    // Show song current minute
    if (isPlaying && audioRef.current) {
      intervalId = setInterval(() => {
        const newProgress =
          audioRef.current.currentTime / audioRef.current.duration;
        setSongProgress(newProgress);
      }, 500);
    }

    // Clean after changing song
    return () => {
      if (intervalId) {
        clearInterval(intervalId);
      }
    };
  }, [isPlaying]);

  //Volume settings
  useEffect(() => {
    const savedCurrentVolume = JSON.parse(
      localStorage.getItem("currentVolume")
    );

    if (savedCurrentVolume) {
      setVolume(savedCurrentVolume);
    }
  }, []);

  useEffect(() => {
    localStorage.setItem("currentVolume", volume);
    audio.volume = JSON.parse(localStorage.getItem("currentVolume"));
  }, [volume]);
  const x = false;
  // Set current song at current time after refreshing
  useEffect(() => {
    if (!isPlaying && currentSong) {
      sessionStorage.setItem("currentSong", JSON.stringify(currentSong));
      sessionStorage.setItem("currentTime", audioRef.current.currentTime);
    }
  }, [isPlaying, currentSong]);

  window.addEventListener("beforeunload", () => {
    sessionStorage.setItem("currentTime", audioRef.current.currentTime);
  });

  useEffect(() => {
    const savedCurrentSong = JSON.parse(sessionStorage.getItem("currentSong"));
    const savedCurrentTime = sessionStorage.getItem("currentTime");

    if (savedCurrentSong && savedCurrentTime) {
      setCurrentSong(savedCurrentSong);
      audioRef.current.currentTime = savedCurrentTime;
      setIsPlaying(true);
    }
  }, []);

  useEffect(() => {
    sessionStorage.setItem("isPlaying", JSON.stringify(isPlaying));
  }, [isPlaying]);

  useEffect(() => {
    const savedIsPlaying = JSON.parse(sessionStorage.getItem("isPlaying"));

    if (savedIsPlaying !== null) {
      setIsPlaying(savedIsPlaying);
    }
  }, []);

  // Play or pause if it's same song
  useEffect(() => {
    if (currentSong) {
      if (audioRef.current.src !== currentSong.track_url) {
        audioRef.current.src = currentSong.track_url;
      }
      if (isPlaying) {
        audioRef.current.play();
      } else {
        audioRef.current.pause();
      }
    }
  }, [currentSong, isPlaying]);

  // Play next song in queue auto
  useEffect(() => {
    audioRef.current.onended = () => {
      if (currentIndex < queue.length) {
        if (currentIndex + 1 == queue.length) {
          // console.log("STOP");
          setCurrentSong("");
          setIsPlaying(false);
          setQueueEnded(true);
          setQueue(null);
          sessionStorage.removeItem("queue");

          return;
        }

        setCurrentIndex((prev) => prev + 1);
        sessionStorage.setItem("currentIndex", currentIndex + 1);

        const nextSong = queue[currentIndex + 1];
        sessionStorage.setItem("currentSong", JSON.stringify(nextSong));
        setCurrentSong(nextSong);
        setIsPlaying(true);
      }
    };
  }, [currentSong, queue, setIsPlaying, setCurrentSong, currentIndex]);

  const playNext = () => {
    if (currentIndex + 1 < queue.length && queueEnded == false) {
      sessionStorage.setItem(
        "currentSong",
        JSON.stringify(queue[currentIndex + 1])
      );

      setCurrentIndex((prev) => {
        const currentIndex = prev + 1;
        sessionStorage.setItem("currentIndex", prev + 1);

        return currentIndex;
      });
      setCurrentSong(queue[currentIndex + 1]);

      if (!isPlaying && audioRef.current.paused) {
        setIsPlaying(true);
      }
    }
  };

  const playPrevious = () => {
    if (currentIndex - 1 >= 0 && queueEnded == false) {
      sessionStorage.setItem(
        "currentSong",
        JSON.stringify(queue[currentIndex - 1])
      );

      setCurrentIndex((prev) => {
        const currentIndex = prev - 1;
        sessionStorage.setItem("currentIndex", prev - 1);

        return currentIndex;
      });
      setCurrentSong(queue[currentIndex - 1]);

      if (!isPlaying && audioRef.current.paused) {
        setIsPlaying(true);
      }
    }
  };

  const handlePlayPauseClick = (track, index) => {
    sessionStorage.setItem("currentSong", JSON.stringify(track));
    setQueueEnded(false);

    if (document.readyState === "complete") {
      const isSameSong =
        currentSong && currentSong.track_url === track.track_url;

      sessionStorage.setItem("currentIndex", JSON.stringify(index));

      setCurrentIndex(JSON.parse(sessionStorage.getItem("currentIndex")));

      if (isSameSong) {
        setIsPlaying(!isPlaying);
      } else {
        setCurrentSong(track);
        setIsPlaying(true);
      }
    }
  };
  const addToQueue = (selectedTrack, closeMenu) => {
    const currentQueue = JSON.parse(sessionStorage.getItem("queue"));

    currentQueue.push(selectedTrack);

    sessionStorage.setItem("queue", JSON.stringify(currentQueue));
    setQueue(currentQueue);
    alert("Song has been added to queue");
    closeMenu();
  };

  const handleProgressMouseDown = (event) => {
    setIsUserSeeking(true);
    const newProgress = event.target.value;
    setSeekValue(newProgress);
    setSongProgress(newProgress);
  };

  const handleProgressMouseUp = () => {
    if (audioRef.current) {
      const newTime = seekValue * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setIsUserSeeking(false);
    }
  };

  const handleProgressTouchStart = () => {
    setIsUserSeeking(true);
  };

  const handleProgressTouchMove = (event) => {
    const newProgress = event.target.value;
    setSeekValue(newProgress);
    setSongProgress(newProgress);
  };

  const handleProgressTouchEnd = () => {
    if (audioRef.current) {
      const newTime = seekValue * audioRef.current.duration;
      audioRef.current.currentTime = newTime;
      setIsUserSeeking(false);
    }
  };

  const actions = {
    currentSong,
    setCurrentSong,
    setIsPlaying,
    isPlaying,
    setQueue,
    queue,
    audioRef,
    buttonRef,
    setCurrentIndex,
    currentIndex,
    volume,
    setVolume,
    queueEnded,
    setQueueEnded,
    playNext,
    playPrevious,
    handlePlayPauseClick,
    addToQueue,
    songProgress,
    setSongProgress,
    handleProgressMouseDown,
    handleProgressMouseUp,
    isUserSeeking,
    setIsUserSeeking,
    setSeekValue,
    seekValue,
    handleProgressTouchStart,
    handleProgressTouchMove,
    handleProgressTouchEnd,
  };

  return (
    <PlaybackContext.Provider value={actions}>
      {children}
    </PlaybackContext.Provider>
  );
};
