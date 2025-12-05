import { createHashRouter, type RouteObject } from "react-router-dom";
import HomePage from "@/pages/HomePage";
import RootLayout from "@/layout/RootLayout";
import InfoPage from "@/pages/InfoPage";
import DocumentPage from "@/pages/DocumentPage";
import PracticePage from "@/pages/PracticePage";

const routes: RouteObject[] = [
  {
    path: "/",
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: <HomePage />,
      },
      {
        path: "info",
        element: <InfoPage />,
      },
      {
        path: "document",
        element: <DocumentPage />,
      },
      {
        path: "practice",
        element: <PracticePage />,
      },
    ],
  },
];

const router = createHashRouter(routes);

export default router;
