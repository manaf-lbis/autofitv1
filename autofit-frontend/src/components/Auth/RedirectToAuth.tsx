import { Navigate, useParams } from "react-router-dom";

type RedirectToAuthProps = {
  type: "login" | "signup";
};

const RedirectToAuth: React.FC<RedirectToAuthProps> = ({ type }) => {
  const { role } = useParams<{ role: string }>();
  const validRole = ["user", "admin", "mechanic"].includes(role || "") ? role : "user";
  return <Navigate to={`/auth/${validRole}/${type}`} replace />;
};

export default RedirectToAuth;