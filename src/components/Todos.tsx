function Todos() {
  return (
    <div className="py-6 border-b-2 border-border h-full">
      <p className="text-text-muted text-sm">Today</p>
      {Array.from({ length: 1 }).map((_, i) => (
        <div
          key={i}
          className={`${i === 0 ? "mt-[12px]" : "border-t-1 border-border"} flex gap-2 items-center py-2`}
        >
          <div className="flex-grow flex items-center gap-4">
            <div className="border-2 border-border h-[20px] aspect-square rounded-full overflow-hidden relative">
              {i === 2 && <Check />}
            </div>
            <p className="text-text text-lg">Wake and get ready</p>
          </div>
          <p className="text-text-secondary text-xs font-medium">7:30–8:20</p>
        </div>
      ))}
    </div>
  );
}

export default Todos;

function Check() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="14"
      viewBox="0 0 22 22"
      fill="none"
      stroke="var(--color-accent)"
      stroke-width="4"
      stroke-linecap="round"
      stroke-linejoin="round"
      className="lucide lucide-check preview-icon absolute top-1/2 left-1/2 transform-[translate(-50%,-50%)]"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
