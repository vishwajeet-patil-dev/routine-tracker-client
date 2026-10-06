import { createBrowserRouter } from "react-router";
import { PublicOnly } from "../features/auth/components/PublicOnly";
import { RequireAuth } from "../features/auth/components/RequireAuth";
import Signin from "../features/auth/Signin";
import HomePage from "../features/home/HomePage";
import NotFound from "../features/not found/NotFound";
import AppLayout from "./AppLayout";
import Lists from "../features/lists/Lists";

export const router = createBrowserRouter([
  {
    element: <PublicOnly />,
    children: [{ path: "/signin", element: <Signin /> }],
  },
  {
    element: <RequireAuth />,
    children: [
      {
        element: <AppLayout />,
        children: [
          { index: true, element: <HomePage /> },
          { path: "/lists", element: <Lists /> },
        ],
      },
    ],
  },
  { path: "*", element: <NotFound /> },
]);
