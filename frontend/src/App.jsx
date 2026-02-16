import React, { useContext } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Outlet,
  Navigate,
} from "react-router-dom";
import Login from "./pages/Auth/Login";
import SignUp from "./pages/Auth/SignUp";
import Profile from "./pages/Auth/Profile";
import PrivateRoute from "./routes/PrivateRoute";
import Dashboard from "./pages/Admin/Dashboard";
import ManagerTasks from "./pages/Admin/ManageTasks";
import CreateTask from "./pages/Admin/CreateTask";
import ManageUsers from "./pages/Admin/ManageUsers";
import UserDashboard from "./pages/User/UserDashboard";
import MyTasks from "./pages/User/MyTasks";
import ViewTaskDetails from "./pages/User/ViewTaskDetails";
import Landing from "./pages/Landing";
import VerifyEmail from "./pages/Auth/VerifyEmail"
import { UserProvider, UserContext } from "./context/userContext";
import { Toaster } from "react-hot-toast";

export default function App() {
  return (
    <UserProvider>
      <div>
        <Router>
          <Routes>
            <Route path="/landing" element={<Landing />}></Route>
            <Route path="/login" element={<Login />}></Route>
            <Route path="/signup" element={<SignUp />}></Route>
            <Route path="/verify-email" element={<VerifyEmail />}></Route>
            {/* Profile */}
            <Route element={<PrivateRoute allowedRoles={["admin", "user"]} />}>
              <Route path="/profile" element={<Profile />} />
            </Route>

            {/* Admin Routes */}
            <Route element={<PrivateRoute allowedRoles={"admin"} />}>
              <Route path="/admin/dashboard" element={<Dashboard />}></Route>
              <Route path="/admin/tasks" element={<ManagerTasks />}></Route>
              <Route path="/admin/create-task" element={<CreateTask />}></Route>
              <Route path="/admin/users" element={<ManageUsers />}></Route>
            </Route>

            {/* User Routes */}
            <Route element={<PrivateRoute allowedRoles={"user"} />}>
              <Route path="/user/dashboard" element={<UserDashboard />}></Route>
              <Route path="/user/tasks" element={<MyTasks />}></Route>
              <Route
                path="/user/task-details/:id"
                element={<ViewTaskDetails />}
              ></Route>
            </Route>

            {/* Default Route */}
            <Route path="/" element={<Root />} />
          </Routes>
        </Router>
      </div>
      <Toaster
        toastOptins={{
          className: "",
          style: {
            fontSize: "13px",
          },
        }}
      />
    </UserProvider>
  );
}

const Root = () => {
  const { user, loading } = useContext(UserContext);
  if (loading) return <Outlet />;
  if (!user) {
    return <Navigate to="/landing" />;
  }
  return user.role === "admin" ? (
    <Navigate to="/admin/dashboard" />
  ) : (
    <Navigate to="/user/dashboard" />
  );
};
