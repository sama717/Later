import { createBrowserRouter } from "react-router";
import { lazy, Suspense } from "react";
import Layout from "./components/Layout";
import { Loading } from "./components/Loading";

const Home = lazy(() => import("./pages/Home"));
const Explore = lazy(() => import("./pages/Explore"));
const Library = lazy(() => import("./pages/Library"));
const GameDetail = lazy(() => import("./pages/GameDetails"));
const Login = lazy(() => import("./pages/Login"));
const Register = lazy(() => import("./pages/Register"));
const Profile = lazy(() => import("./pages/Profile"));
const NotFound = lazy(() => import("./pages/NotFound"));

export const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
      { index: true, element: <Suspense fallback={<Loading />}><Home /></Suspense> },
      { path: "explore", element: <Suspense fallback={<Loading />}><Explore /></Suspense> },
      { path: "library", element: <Suspense fallback={<Loading />}><Library /></Suspense> },
      { path: "games/:id", element: <Suspense fallback={<Loading />}><GameDetail /></Suspense> },
      { path: "login", element: <Suspense fallback={<Loading />}><Login /></Suspense> },
      { path: "register", element: <Suspense fallback={<Loading />}><Register /></Suspense> },
      { path: "profile", element: <Suspense fallback={<Loading />}><Profile /></Suspense> },
    ],
  },
  {
    path: "*",
    element: <NotFound />,
  },
]);