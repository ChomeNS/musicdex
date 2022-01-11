import React from "react";
import { RouteObject, useRoutes } from "react-router";
const Channel = React.lazy(() => import("./pages/Channel"));
const History = React.lazy(() => import("./pages/History"));
const Home = React.lazy(() => import("./pages/Home"));
const LikedSongs = React.lazy(() => import("./pages/LikedSongs"));
const Login = React.lazy(() => import("./pages/Login"));
const Playlist = React.lazy(() => import("./pages/Playlist"));
const Settings = React.lazy(() => import("./pages/Settings"));
const Song = React.lazy(() => import("./pages/Song"));
const Video = React.lazy(() => import("./pages/Video"));
const Search = React.lazy(() => import("./pages/Search"));

const routes: RouteObject[] = [
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/playlists/:playlistId",
    element: <Playlist />,
  },
  {
    path: "/song/:songId",
    element: <Song />,
  },
  {
    path: "/liked",
    element: <LikedSongs />,
  },
  {
    path: "/history",
    element: <History />,
  },
  {
    path: "/search",
    element: <Search />,
  },
  {
    path: "/video/:id",
    element: <Video />,
  },
  {
    path: "/channel/:id",
    element: <Channel />,
  },
  {
    path: "/settings",
    element: <Settings />,
  },
  {
    path: "/login",
    element: <Login />,
  },
];
export default function Routes() {
  const elements = useRoutes(routes);
  return elements;
}