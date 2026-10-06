import { Navigate, Outlet } from "react-router";
import { useProfile } from "../hooks";
import { ApiError } from "../../../lib/http";
import Loading from "../../../app/Loading";

export function RequireAuth() {
  const { isPending, error } = useProfile();

  if (isPending) return <Loading />;

  if (error instanceof ApiError && error.status === 401) {
    return <Navigate to="/signin" replace />;
  }

  if (error) return <p>{error.message}</p>;

  return <Outlet />;
}
