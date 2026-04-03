import { Navigate, Route, Routes } from "react-router-dom";
import ProtectedRoute from "../components/common/ProtectedRoute";
import AdminLayout from "../layouts/AdminLayout";
import ManagerLayout from "../layouts/ManagerLayout";
import MemberLayout from "../layouts/MemberLayout";
import Login from "../pages/auth/Login";
import Register from "../pages/auth/Register";
import Unauthorized from "../pages/Unauthorized";
import NotFound from "../pages/NotFound";
import AdminDashboard from "../pages/dashboard/AdminDashboard";
import ManagerDashboard from "../pages/dashboard/ManagerDashboard";
import MemberDashboard from "../pages/dashboard/MemberDashboard";
import ManageUsers from "../pages/admin/ManageUsers";
import ManagerIssues from "../pages/manager/ManagerIssues";
import CreateIssue from "../pages/manager/CreateIssue";
import ManagerIssueDetail from "../pages/manager/ManagerIssueDetail";
import IssueDetail from "../pages/member/IssueDetail";

const AppRoutes = () => {
  return (
    <Routes>
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />
      <Route path="/unauthorized" element={<Unauthorized />} />

      <Route element={<ProtectedRoute allowedRoles={["admin"]} />}>
        <Route path="/admin" element={<AdminLayout />}>
          <Route index element={<AdminDashboard />} />
          <Route path="issues" element={<ManagerIssues />} />
          <Route path="issues/:id" element={<ManagerIssueDetail />} />
          <Route path="users" element={<ManageUsers />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["manager"]} />}>
        <Route path="/manager" element={<ManagerLayout />}>
          <Route index element={<ManagerDashboard />} />
          <Route path="issues" element={<ManagerIssues />} />
          <Route path="issues/new" element={<CreateIssue />} />
          <Route path="issues/:id" element={<ManagerIssueDetail />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute allowedRoles={["member"]} />}>
        <Route path="/member" element={<MemberLayout />}>
          <Route index element={<MemberDashboard />} />
          <Route path="issues" element={<ManagerIssues />} />
          <Route path="issues/:id" element={<IssueDetail />} />
        </Route>
      </Route>

      <Route path="/" element={<Navigate to="/login" replace />} />
      <Route path="*" element={<NotFound />} />
    </Routes>
  );
};

export default AppRoutes;
