import { useSelector } from "react-redux";
import { Navigate, Routes, Route } from "react-router-dom";

import UserOverview from "./user/UserOverview";
import SendMoney from "./user/SendMoney";
import Withdraw from "./user/Withdraw";
import Transactions from "./user/Transactions";
import Profile from "./user/Profile";
import type { RootState } from "@/redux/store";
import DashboardLayout from "./Layout";

import AgentOverview from "./agent/AgentOverview";
import CashInToUser from "./agent/CashInToUser";
import AgentTransactions from "./agent/AgentTransactions";
import AgentProfile from "./agent/AgentProfile";

import AdminOverview from "./admin/AdminOverview";
import ManageAgents from "./admin/ManageAgents";
import ManageUsers from "./admin/ManageUsers";
import AllTransactions from "./admin/AllTransactions";
import AdminProfile from "./admin/AdminProfile";

const Dashboard = () => {
  const { user } = useSelector((s: RootState) => s.auth);
  if (!user) return <Navigate to="/login" replace />;

  const role = user.role;

  return (
    <DashboardLayout role={role}>
      <Routes>
        {role === "USER" && (
          <>
            <Route index element={<UserOverview />} />
            <Route path="send" element={<SendMoney />} />
            <Route path="withdraw" element={<Withdraw />} />
            <Route path="transactions" element={<Transactions />} />
            <Route path="profile" element={<Profile />} />
          </>
        )}

        {role === "AGENT" && (
          <>
            <Route index element={<AgentOverview />} />
            <Route path="cash-in" element={<CashInToUser />} />
            <Route path="transactions" element={<AgentTransactions />} />
            <Route path="profile" element={<AgentProfile />} />
          </>
        )}

        {role === "ADMIN" && (
          <>
            <Route index element={<AdminOverview />} />
            <Route path="agents" element={<ManageAgents />} />
            <Route path="users" element={<ManageUsers />} />
            <Route path="transactions" element={<AllTransactions />} />
            <Route path="profile" element={<AdminProfile />} />
          </>
        )}
      </Routes>
    </DashboardLayout>
  );
};

export default Dashboard;
