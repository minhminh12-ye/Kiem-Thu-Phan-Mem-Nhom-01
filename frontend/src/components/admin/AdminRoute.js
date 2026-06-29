import { useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { AuthContext } from "../../AuthContext";

const AdminRoute = () => {
  const { user, loading } = useContext(AuthContext);

  console.log("🔍 AdminRoute Check:", {
    user,
    isAdmin: user?.isAdmin,
    typeOfIsAdmin: typeof user?.isAdmin, // Kiểm tra kiểu dữ liệu
  });

  // Nếu còn loading → show loading
  if (loading) {
    return (
      <div style={{ textAlign: "center", marginTop: 100 }}>
        <h2>Đang kiểm tra quyền...</h2>
      </div>
    );
  }

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  const isAdmin = Boolean(
    user.isAdmin ||
    user.roleId === 1 ||
    ['admin', 'administrator'].includes(String(user.role || '').toLowerCase())
  );

  if (!isAdmin) {
    return <Navigate to="/access-denied" replace />;
  }

  return <Outlet />;
};

export default AdminRoute;