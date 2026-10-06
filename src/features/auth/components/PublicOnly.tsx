import { Navigate, Outlet } from "react-router";
import { useProfile } from "../hooks";
import Loading from "../../../app/Loading";

export function PublicOnly() {
  const { isPending, data } = useProfile();

  if (isPending) return <Loading />;

  if (data) return <Navigate to={"/"} replace />;

  // if (error) return <p>{error.message}</p>;

  return <Outlet />;
}
