import { useNavigate } from "react-router";

function NotFound() {
  const navigate = useNavigate();

  return (
    <div className="h-dvh relative">
      <div className="absolute text-center flex flex-col gap-4 top-1/2 left-1/2 w-[70%] translate-x-[-50%] translate-y-[-50%]">
        <p className="text-2xl font-semibold text-text">Page Not Found</p>
        <p className="w-[80%] text-sm m-auto text-text-secondary leading-[1.4]">
          The screen you're looking for doesn't exist or has moved.
        </p>
        <button
          onClick={() => navigate("/")}
          className="w-full py-4 rounded-xl bg-text text-white font-medium text-sm disabled:bg-surface"
        >
          Back to home
        </button>
        <p
          onClick={() => navigate(-1)}
          className="text-text-secondary text-sm font-semibold"
        >
          Go back
        </p>
      </div>
    </div>
  );
}

export default NotFound;
