import React, { createContext, useState, useEffect, useContext } from "react";
import ArtistsContext from "./ArtistsContext";
import { albumNames } from "./Albums";
export const AlbumsContext = createContext();

export const AlbumsProvider = ({ children }) => {
  const [topAlbums, setTopAlbums] = useState();
  const { accessToken } = useContext(ArtistsContext);

  const getAlbums = async () => {
    if (!accessToken) {
      return;
    }

    try {
      const artistsPromises = albumNames.map(async (albumName) => {
        try {
          const response = await fetch(
            `https://api.spotify.com/v1/search?q=${encodeURIComponent(
              albumName
            )}&type=album&limit=1`,
            {
              method: "GET",
              headers: {
                "Content-Type": "application/json",
                Authorization: "Bearer " + accessToken,
              },
            }
          );
          const data = await response.json();

          return data;
        } catch (error) {
          console.error(`Error fetching ${albumName}: `, error);
          return null;
        }
      });

      const albumsResponses = await Promise.all(artistsPromises);

      const finalAlbums = albumsResponses.map((album) => album.albums.items[0]);
      const hipHopAlbums = finalAlbums.slice(0, 7);
      const popAlbums = finalAlbums.slice(7, 14);
      const indieAlbums = finalAlbums.slice(14, 21);
      const jazzAlbums = finalAlbums.slice(21, 28);

      function createNewObj(obj) {
        return {
          artist: obj.artists[0].name,
          img: obj.images[0].url,
          name: obj.name,
          releaseDate: obj.release_date.slice(0, 4),
          href: obj.external_urls.spotify,
        };
      }

      setTopAlbums({
        hipHop: hipHopAlbums.map(createNewObj),
        pop: popAlbums.map(createNewObj),
        indie: indieAlbums.map(createNewObj),
        jazz: jazzAlbums.map(createNewObj),
      });
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAlbums();
  }, [accessToken]);
  const actions = { topAlbums, setTopAlbums };
  return (
    <AlbumsContext.Provider value={actions}>{children}</AlbumsContext.Provider>
  );
};

export default AlbumsContext;
