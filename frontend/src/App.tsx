import { AuthProvider } from "./hooks/useAuth.tsx";
import MainPage from "./components/main-page/MainPage.tsx";
import RegisterPage from "./components/register-page/RegisterPage.tsx";
import LogInPage from "./components/login-page/LogInPage.tsx";
import UploadPage from "./components/main-page/sub-pages/UploadPage.tsx";
import BookPage from "./components/main-page/sub-pages/BookPage.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LibraryPage from "./components/main-page/sub-pages/LibraryPage.tsx";

const App = () => {
  const router = createBrowserRouter([
    {
      element: <AuthProvider />,
      children: [
        {
          path: "/",
          element: <MainPage />,
          children: [
            {
              path: "library",
              element: <LibraryPage />,
            },
            {
              path: "upload",
              element: <UploadPage />,
            },
            {
              path: "book",
              element: <BookPage />,
            },
          ],
        },
        {
          path: "/login",
          element: <LogInPage />,
        },
        {
          path: "/register",
          element: <RegisterPage />,
        },
      ],
    },
  ]);

  return <RouterProvider router={router} />;
};

export default App;
