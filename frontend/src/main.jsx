import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import { Provider } from 'react-redux';
import {
  Route,
  RouterProvider,
  createBrowserRouter,
  createRoutesFromElements,
} from 'react-router-dom';
import Layout from './components/Layout.jsx';
import Home from './pages/Home.jsx';
import Login from './pages/Login.jsx';
import Signup from './pages/Signup.jsx';
import Error from './pages/Error.jsx';
import { store } from './store';
import Questions from './pages/Questions';
import Question from './pages/Question';
import { Toaster } from 'react-hot-toast';
import AddQuestion from './pages/admin/AddQuestion';
import Users from './pages/admin/Users';
import Result from './pages/admin/Result';
import AdminQuestions from './pages/admin/AdminQuestions';

const router = createBrowserRouter(
  createRoutesFromElements(
    <Route path="/" element={<Layout />}>
      <Route path="" element={<Home />} />
      <Route path="login" element={<Login />} />
      <Route path="signup" element={<Signup />} />
      <Route path="question" element={<Questions />} />
      <Route path="question/:id" element={<Question />} />

      <Route path="admin" element={<AddQuestion />} />
      <Route path="admin/add-question" element={<AddQuestion />} />
      <Route path="admin/questions" element={<AdminQuestions />} />
      <Route path="admin/users" element={<Users />} />
      <Route path="admin/result" element={<Result />} />

      <Route path="*" element={<Error />} />
    </Route>
  )
);

ReactDOM.createRoot(document.getElementById('root')).render(
  <Provider store={store}>
    <RouterProvider router={router} />
    <Toaster
      position="top-center"
      reverseOrder={false}
      toastOptions={{
        duration: 5000,
        success: {
          style: {
            background: '#0bb42a',
            color: '#fff',
          },
        },
        error: {
          style: {
            background: '#d82a0b',
            color: '#fff',
          },
        },
      }}
    />
  </Provider>
);
