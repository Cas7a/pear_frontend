import "./../styles.css";
import "./../reset.css";
import { Route, createRoutesFromElements, RouterProvider } from "react-router";
import { createBrowserRouter } from "react-router-dom";

import Welcome from "./components/Home/Welcome";
import Artists from "./Pages/Artists/ArtistsPage";
import RootPage from "./Pages/RootPage";
import Website from "./website/Website";
import Register from "./website/components/Register";
import TokenRefreshTimer from "./store/TokenRefresh";
import TokenVerify from "./store/TokenVerify";
import Playlists from "./Pages/Playlists/PlaylistsPage";
import Playlist from "./Pages/Playlists/Playlist";
import User from "./Pages/User/User";
import Release from "./Pages/User/Release";
import GlobalReleaseTemplate from "./components/Layout/GlobalReleaseTemplate";
import Queue from "./components/Layout/Queue";
import PopularSongs from "./Pages/Songs/PopularSongs";
import ProtectedRoute from "./ProtectedRoute";
import TopAlbums from "./Pages/Albums/TopAlbums";

export const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Website />} errorElement="" />
      <Route path="register" element={<Register />} />
      <Route
        path="player"
        element={
          <ProtectedRoute>
            <RootPage />
          </ProtectedRoute>
        }
        errorElement=""
        children={
          <>
            <Route index={true} element={<Welcome />}></Route>
            <Route path="artist/:artistId" element={<Artists />} />
            <Route path="playlists" element={<Playlists />} />
            <Route path="playlist/:playlistId" element={<Playlist />} />
            <Route path="user/:userId" element={<User />} />
            <Route path="queue" element={<Queue />} />
            <Route path="songs" element={<PopularSongs />} />
            <Route path="albums" element={<TopAlbums />} />

            <Route
              path="user/:userId/release/:releaseId"
              element={<Release />}
            />
            <Route
              path=":releaseType/:releaseId"
              element={<GlobalReleaseTemplate />}
            />
          </>
        }
      ></Route>
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
      <TokenRefreshTimer />
      <TokenVerify />
    </>
  );
}

export default App;
