import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useGetCurrentUserQuery } from "@/features/auth/api/authApi";
import { setUser, clearUser } from "@/features/auth/slices/authSlice";
import { RootState } from "../../store/store";
import PageLoading from "../Animations/PageLoading";

type AuthHandlerProps = {
  children: React.ReactNode;
};

const AuthHandler: React.FC<AuthHandlerProps> = ({ children }) => {
  const dispatch = useDispatch();
  const { isAuthenticated } = useSelector((state: RootState) => state.auth);

  useEffect(() => {
    const storedRole = localStorage.getItem("userRole");
    const storedAuth = localStorage.getItem("isAuthenticated");
    if (storedRole && storedAuth === "true" && !isAuthenticated) {
      dispatch(
        setUser({
          name: "",
          role: storedRole as "user" | "admin" | "mechanic",
          email: "",
          mobile :""
        })
      );
    }
  }, [dispatch, isAuthenticated]);

  const { data, isLoading, isError } = useGetCurrentUserQuery(undefined, {
    skip: !isAuthenticated && !localStorage.getItem("isAuthenticated"),
  });

  // Update auth state based on API response
  useEffect(() => {
    if (data && data.status === "success") {
      dispatch(
        setUser({
          name: data.data.name,
          role: data.data.role,
          email: data.data.email,
          mobile : data.data.mobile
        })
      );
      localStorage.setItem("userRole", data.data.role);
      localStorage.setItem("isAuthenticated", "true");
    } else if (isError) {
      dispatch(clearUser());
      localStorage.removeItem("userRole");
      localStorage.removeItem("isAuthenticated");
    }
  }, [data, isError, dispatch]);

  if (isLoading) {
    return <PageLoading />;
  }

  return <>{children}</>;
};

export default AuthHandler;

