function Loading() {
  return (
    <div className="h-dvh relative">
      <div className="absolute text-center flex flex-col gap-4 top-1/2 left-1/2 w-[70%] translate-x-[-50%] translate-y-[-50%]">
        <p className="text-text-secondary font-medium text-md">
          Loading Your Day...
        </p>
        <div className="h-[5px] rounded-full bg-border overflow-hidden">
          <div className="h-full bg-accent rounded-full w-[25%] animate-progress"></div>
        </div>
      </div>
    </div>
  );
}

export default Loading;
