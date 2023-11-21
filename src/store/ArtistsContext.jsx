import React, { createContext, useState, useEffect, useCallback } from "react";
import { artistNames } from "./Artists";

export const ArtistsContext = createContext();

const CLIENT_ID = import.meta.env.VITE_CLIENT_ID;
const CLIENT_SECRET = import.meta.env.VITE_CLIENT_SECRET;
const URL = import.meta.env.VITE_API;

export const ArtistsProvider = ({ children }) => {
  const TOKEN = sessionStorage.getItem("token");

  const [accessToken, setAccessToken] = useState();
  const [artistInfo, setArtistInfo] = useState([]);
  const [dataFetched, setDataFetched] = useState(false);
  const [status, setStatus] = useState("");
  const [top_5_Tracks, setTop_5_Tracks] = useState();
  const [top_50_Tracks, setTop_50_Tracks] = useState();

  // Get a valid token from Spotify API to do fetch requests
  async function getAccessToken() {
    try {
      const authParameters = {
        method: "POST",
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
        body: `grant_type=client_credentials&client_id=${CLIENT_ID}&client_secret=${CLIENT_SECRET}`,
      };
      const response = await fetch(
        "https://accounts.spotify.com/api/token",
        authParameters
      );
      const data = await response.json();

      setAccessToken(data.access_token);
    } catch (error) {
      console.error(error);
    }
  }

  useEffect(() => {
    getAccessToken();
  }, []);

  useEffect(() => {
    if (accessToken) {
      getArtistInfo();

      showTrendingSongs();
    }
  }, [accessToken]);

  const fetchData = useCallback(async () => {
    if (!accessToken || dataFetched) {
      return;
    }

    if (!artistInfo || artistInfo.length === 0) {
      // Fetch artist info first
      await getArtistInfo();
      return;
    }

    // Fetch albums and top tracks
    await getAlbumsAndTopTracks().then((data) => setArtistInfo(data));

    // Set dataFetched to true to avoid repeated fetching
    setDataFetched(true);
  }, [artistInfo, dataFetched]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  //Define paramaters to fetch Spotify API
  function getArtistParameters() {
    return {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: "Bearer " + accessToken,
      },
    };
  }

  async function showTrendingSongs() {
    const response = await fetch(
      "https://api.spotify.com/v1/playlists/37i9dQZEVXbMDoHDwVN2tF/tracks",
      getArtistParameters()
    );
    const tracks = await response.json();

    const topFiveTracks = tracks.items.slice(0, 5).map((track) => track.track);
    const topFiftyTracks = tracks.items.map((track) => track.track);

    function createNewObj(obj) {
      return {
        artist: obj.artists[0].name,
        img: obj.album.images[0].url,

        name: obj.name,
        duration: obj.duration_ms,
        href: obj.external_urls.spotify,
      };
    }
    setTop_5_Tracks(topFiveTracks.map(createNewObj));
    setTop_50_Tracks(topFiftyTracks.map(createNewObj));
  }

  async function getAlbumsAndTopTracks() {
    if (!artistInfo) return;

    const artistData = await Promise.all(
      artistInfo.map(async (artist) => {
        // Get Artists Latest Albums
        const albumsResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artist.id}/albums?limit=20&include_groups=album`,
          getArtistParameters()
        );

        const albumsData = await albumsResponse.json();

        const filteredAlbums = albumsData.items.map(
          ({
            type,
            id,
            images,
            name,
            release_date,
            total_tracks,
            external_urls: { spotify: url },
          }) => ({
            type,
            id,
            images,
            name,
            release_date,
            total_tracks,
            url,
          })
        );

        // Get Artists Top tracks
        const topTracksResponse = await fetch(
          `https://api.spotify.com/v1/artists/${artist.id}/top-tracks?market=US`,
          getArtistParameters()
        );
        const topTracksData = await topTracksResponse.json();

        const filteredTracks = topTracksData.tracks
          .map(
            ({
              id: songId,
              name,
              duration_ms: duration,
              type,
              album: { images, name: albumName },
              external_urls: { spotify: url },
            }) => ({
              songId,
              name,
              duration,
              type,
              album: { images: images[0].url, albumName },
              url,
            })
          )
          .slice(0, 5);

        return {
          ...artist,
          albums: filteredAlbums,
          topTracks: filteredTracks,
        };
      })
    );

    // Set artists final info with Albums and top tracks

    return artistData;
  }

  async function getArtistInfo() {
    //Verify is there's a valid token to fetch the artist data
    async function verifyAndDisplayContent() {
      try {
        const response = await fetch(`${URL}/protected`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${TOKEN}`,
          },
        });

        if (response.ok) {
          const decoded = await response.json();

          setStatus("Token verified: " + JSON.stringify(decoded));
          //Fetch artist data
          try {
            const artistsPromises = artistNames.map(async (artistName) => {
              try {
                const response = await fetch(
                  `https://api.spotify.com/v1/search?q=${encodeURIComponent(
                    artistName
                  )}&type=artist&limit=1`,
                  getArtistParameters()
                );
                const data = await response.json();
                // console.log("FETCH");
                return data;
              } catch (error) {
                console.error(`Error fetching ${artistName}: `, error);
                return null;
              }
            });

            try {
              const artistsResponses = await Promise.all(artistsPromises);

              const artistData = artistsResponses.map((artistData) => {
                const artistItem = artistData.artists.items[0];

                return {
                  id: artistItem.id,
                  name: artistItem.name,
                  followers: artistItem.followers.total,
                  genres: artistItem.genres,
                  images: artistItem.images[0].url,
                  type: artistItem.type,
                };
              });

              setArtistInfo(artistData);
            } catch (error) {
              console.error(error);
            }
          } catch (error) {
            console.error(error);
          }
        } else {
          setStatus("Error verifying token: " + response.statusText);
        }
      } catch (error) {
        setStatus("Error verifying token:" + error.message);
      }
    }

    verifyAndDisplayContent();
  }

  return (
    <ArtistsContext.Provider
      value={{ artistInfo, top_5_Tracks, top_50_Tracks, accessToken }}
    >
      {children}
    </ArtistsContext.Provider>
  );
};

export default ArtistsContext;
