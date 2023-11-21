import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App.jsx";
import { ArtistsProvider } from "./store/ArtistsContext.jsx";
import { AuthProvider } from "./store/AuthContext";
import { PlaylistProvider } from "./store/PlaylistContext.jsx";
import { ReleasesProvider } from "./store/ReleasesContext.jsx";
import { GlobalReleasesProvider } from "./store/GlobalReleasesContext.jsx";
import { PlaybackProvider } from "./store/PlaybackContext.jsx";
import { ReleaseAndPlaylistProvider } from "./store/ReleaseAndPlaylistContext.jsx";
import { AlbumsProvider } from "./store/AlbumsContext.jsx";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <PlaylistProvider>
      <GlobalReleasesProvider>
        <ReleasesProvider>
          <ReleaseAndPlaylistProvider>
            <PlaybackProvider>
              <ArtistsProvider>
                <AlbumsProvider>
                  <App />
                </AlbumsProvider>
              </ArtistsProvider>
            </PlaybackProvider>
          </ReleaseAndPlaylistProvider>
        </ReleasesProvider>
      </GlobalReleasesProvider>
    </PlaylistProvider>
  </AuthProvider>
);
