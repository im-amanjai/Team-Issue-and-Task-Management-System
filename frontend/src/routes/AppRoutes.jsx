import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";

import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import MemberLayout from "../layouts/MemberLayout";

import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ManagerDashboard from "../pages/dashboard/ManagerDashboard";
import MemberDashboard from "../pages/dashboard/MemberDashboard";

import IssueDetail from "../pages/member/IssueDetail";
import ManagerIssues from "../pages/manager/ManagerIssues";
import CreateIssue from "../pages/manager/CreateIssue";
import ManagerIssueDetail from "../pages/manager/ManagerIssueDetail";

import ProtectedRoute from "../components/common/ProtectedRoute";

const AppRoutes = ({ issues }) => {
  return (
    <Routes>
      {/* Public */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Admin */}
      <Route
        path="/admin/*"
        element={
          <ProtectedRoute allowedRoles={["admin"]}>
            <AdminLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<AdminDashboard issues={issues} />} />
      </Route>

      {/* Manager */}
      <Route
        path="/manager/*"
        element={
          <ProtectedRoute allowedRoles={["manager"]}>
            <ManagerLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<ManagerDashboard issues={issues} />} />
        <Route
          path="issues"
          element={<ManagerIssues issues={issues} />}
        />
        <Route path="issues/new" element={<CreateIssue />} />
        <Route
          path="issues/:id"
          element={<ManagerIssueDetail issues={issues} />}
        />
      </Route>

      {/* Member */}
      <Route
        path="/member/*"
        element={
          <ProtectedRoute allowedRoles={["member"]}>
            <MemberLayout />
          </ProtectedRoute>
        }
      >
        <Route index element={<MemberDashboard issues={issues} />} />
        <Route
          path="issues/:id"
          element={<IssueDetail issues={issues} />}
        />
      </Route>

      <Route path="*" element={<Navigate to="/login" />} />
    </Routes>
  );
};

export default AppRoutes;
