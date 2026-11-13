import "./App.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import Layout from "./Layout/Layout";
import Notfound from "./Pages/Notfound/Notfound";
import Profile from "./Pages/Profile/Profile";
import Settings from "./Pages/Settings/Settings";
import Notifications from "./Pages/Notifications/Notifications";
import Register from "./Pages/Register/Register";
import Login from "./Pages/Login/Login";
import Home from "./Pages/Home/Home";
import CounterContextProvider from "./Context/counterContext";
import AuthContextProvider from "./Context/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute/ProtectedRoute";
import AuthProtectedRoute from "./Components/ProtectedRoute/AuthProtectedRoute";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import PostDetails from "./Pages/PostDetailsPage/PostDetailsPage";
import Suggestions from "./Pages/Suggestions/Suggestions";
import { Toaster } from "react-hot-toast";
import { useNetworkState } from "react-use";
import Offline from "./Components/Offline/Offline";
import { Helmet } from "react-helmet";
import UserProfile from "./Pages/UserProfile/UserProfile";

const query = new QueryClient();

const router = createBrowserRouter([
  {
    path: "",
    element: <Layout />,
    children: [
      {
        index: true,
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/user/:id",
        element: (
          <ProtectedRoute>
            <UserProfile />
          </ProtectedRoute>
        ),
      },

      {
        path: "/home",
        element: (
          <ProtectedRoute>
            <Home />
          </ProtectedRoute>
        ),
      },
      {
        path: "/profile",
        element: (
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        ),
      },
      {
        path: "/settings",
        element: (
          <ProtectedRoute>
            <Settings />
          </ProtectedRoute>
        ),
      },
      {
        path: "/notifications",
        element: (
          <ProtectedRoute>
            <Notifications />
          </ProtectedRoute>
        ),
      },
      {
        path: "/postdetails/:id",
        element: (
          <ProtectedRoute>
            <PostDetails />
          </ProtectedRoute>
        ),
      },
      {
        path: "/suggestions",
        element: (
          <ProtectedRoute>
            <Suggestions />
          </ProtectedRoute>
        ),
      },
      {
        path: "/login",
        element: (
          <AuthProtectedRoute>
            <Login />
          </AuthProtectedRoute>
        ),
      },
      {
        path: "/register",
        element: (
          <AuthProtectedRoute>
            <Register />
          </AuthProtectedRoute>
        ),
      },
      { path: "*", element: <Notfound /> },
    ],
  },
]);

function App() {
  const { online } = useNetworkState();
  return (
    <>
      <Helmet>
        <title>Pulse — Connect & Share</title>
        <meta
          name="description"
          content="A modern social media platform built with React and Tailwind CSS."
        />
      </Helmet>
      {!online && <Offline onRetry={() => window.location.reload()} />}
      <QueryClientProvider client={query}>
        <AuthContextProvider>
          <CounterContextProvider>
            <Toaster position="top-right" />
            <RouterProvider router={router} />
          </CounterContextProvider>
        </AuthContextProvider>
      </QueryClientProvider>
    </>
  );
}

export default App;
