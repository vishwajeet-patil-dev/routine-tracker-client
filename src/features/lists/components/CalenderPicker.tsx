import { useState } from "react";

const DAY_LABELS = ["S", "M", "T", "W", "T", "F", "S"];

type CalendarPickerProps = {
  allowedWeekdays?: number[] | null;
  value?: Date | null;
  onChange: (date: Date) => void;
};

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function isSameDay(a: Date | null | undefined, b: Date) {
  if (!a || !b) return false;

  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export default function CalendarPicker({
  allowedWeekdays = null,
  value = null,
  onChange,
}: CalendarPickerProps) {
  const [viewDate, setViewDate] = useState(() => value || new Date());

  const year = viewDate.getFullYear();
  const month = viewDate.getMonth();
  const daysInMonth = getDaysInMonth(year, month);
  const firstWeekday = new Date(year, month, 1).getDay();

  // Leading blanks so day 1 lands in the right weekday column, then the real days.
  const cells: (number | null)[] = [];

  for (let i = 0; i < firstWeekday; i++) cells.push(null);
  for (let day = 1; day <= daysInMonth; day++) cells.push(day);

  function isAllowed(day: number) {
    if (!allowedWeekdays) return true;

    const weekday = new Date(year, month, day).getDay();

    return allowedWeekdays.includes(weekday);
  }

  function handleSelect(day: number) {
    if (!isAllowed(day)) return;

    onChange(new Date(year, month, day));
  }

  function changeMonth(delta: number) {
    setViewDate(new Date(year, month + delta, 1));
  }

  const monthLabel = viewDate.toLocaleDateString("en-US", {
    month: "long",
    year: "numeric",
  });

  return (
    <div className="w-full ">
      <div className=" flex items-center justify-between text-sm font-medium mb-2">
        <button
          type="button"
          onClick={() => changeMonth(-1)}
          aria-label="Previous month"
          className="px-2 py-1 text-neutral-400 hover:text-neutral-700"
        >
          ‹
        </button>

        <span>{monthLabel}</span>

        <button
          type="button"
          onClick={() => changeMonth(1)}
          aria-label="Next month"
          className="px-2 py-1 text-neutral-400 hover:text-neutral-700"
        >
          ›
        </button>
      </div>

      <div className=" grid grid-cols-7 mb-1.5">
        {DAY_LABELS.map((label, i) => (
          <span key={i} className="text-center text-[12px] text-neutral-400">
            {label}
          </span>
        ))}
      </div>

      <div className=" grid grid-cols-7 gap-1">
        {cells.map((day, i) => {
          if (day === null) {
            return <span key={i} className="aspect-square" />;
          }

          const allowed = isAllowed(day);

          const selected = isSameDay(value, new Date(year, month, day));

          return (
            <button
              type="button"
              key={i}
              disabled={!allowed}
              onClick={() => handleSelect(day)}
              className={[
                "aspect-square rounded-full text-xs",
                selected
                  ? "bg-neutral-900 text-white"
                  : allowed
                    ? "text-neutral-900 hover:bg-neutral-100"
                    : "text-neutral-300 cursor-not-allowed",
              ].join(" ")}
            >
              {day}
            </button>
          );
        })}
      </div>
    </div>
  );
}

/*
Usage, once a segment is picked in the todo form:

  const segment = segments.find(s => s.id === selectedSegmentId);
  const allowedWeekdays = segment ? segment.repeatsOn : null; // e.g. [0] for Sunday-only

  <CalendarPicker
    allowedWeekdays={allowedWeekdays}
    value={selectedDate}
    onChange={setSelectedDate}
  />
*/
