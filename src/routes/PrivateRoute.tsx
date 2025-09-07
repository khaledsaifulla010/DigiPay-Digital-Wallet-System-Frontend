import type { RootState } from "@/redux/store";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { accessToken } = useSelector((s: RootState) => s.auth);
  const location = useLocation();

  if (!accessToken) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return <>{children}</>;
};

export default PrivateRoute;
