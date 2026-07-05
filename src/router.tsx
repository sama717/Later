import { createBrowserRouter } from "react-router";
import Layout from "./components/Layout";
import Home from "./pages/Home";
// import About from "./pages/About";
import Explore from "./pages/Explore";
// import Library from "./pages/Library";
import GameDetail from "./pages/GameDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import NotFound from "./pages/NotFound";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Layout />,
    children: [
        { index: true, element: <Home /> },
      //   { path: "about", element: <About /> },
        { path: "explore", element: <Explore /> },
      //   { path: "library", element: <Library /> },
        { path: "game/:id", element: <GameDetail /> },
        { path: "login", element: <Login /> },
        { path: "register", element: <Register /> },
    ],
  },
  {
    path: "*",
    element: <NotFound />, 
  },
]);

export default router;
