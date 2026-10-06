import moment from "moment";

function getGreeting(date = new Date()): string {
  const h = date.getHours();
  if (h >= 5 && h < 12) return "Good morning";
  if (h >= 12 && h < 17) return "Good afternoon";
  if (h >= 17 && h < 21) return "Good evening";
  return "Good night";
}

function Header() {
  return (
    <div className="py-6 flex gap-2 items-center">
      <div className="flex-grow">
        {/* <p className="text-text-muted text-sm">Tuesday · 26 sep</p> */}
        <p className="text-text-muted text-sm">
          {moment().format("dddd · DD MMM")}
        </p>
        <p className="mt-[-8px] text-text font-semibold text-lg">
          {getGreeting()}, <span className="text-2xl">Vishwajeet</span>
        </p>
      </div>
      <div className="border border-border-strong h-[40px] aspect-square rounded-full bg-surface flex items-center justify-center">
        <p className="text-text font-semibold text-xl">V</p>
      </div>
    </div>
  );
}

export default Header;
