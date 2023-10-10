import logo from './logo.svg';
import './App.css';
import { RouterProvider, createBrowserRouter } from "react-router-dom";
import Login from './Components/Login/Login';
import Register from './Components/Register/Register';
import { Toaster } from "react-hot-toast";
import PageNotFound from './Components/PageNotFound/PageNotFound';
import Main from './Components/Main/Main';
import ChatedPerson from './Components/ChatedPerson/ChatedPerson';
import PrivateRoute from './Components/PrivateRoute/PrivateRoute/PrivateRoute';
import SpecialRoute from './Components/PrivateRoute/SpecialRoute/SpecialRoute';
import ForbiddenPage from './Components/ForbiddenPage/ForbiddenPage';

function App() {
  const router = createBrowserRouter([
    {
      path: '/',
      element:<PrivateRoute><Main></Main></PrivateRoute>
    },
    {
      path: '/login',
      element: <Login></Login>
    },
    {
      path: '/register',
      element: <Register></Register>
    },
    {
      path: "*",
      element: <PageNotFound></PageNotFound>
    },
    {
      path:"/forbidden",
      element: <ForbiddenPage></ForbiddenPage>
    }
  ])
  return (
    <div>
      <RouterProvider router={router}>

      </RouterProvider>
      <Toaster />
    </div>
  );
}

export default App;
