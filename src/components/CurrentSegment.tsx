import moment from "moment";
import { useEffect, useState } from "react";
import type { CurrentSegment, Segment } from "../features/home/types";
import { useSegments } from "../features/home/hooks";
import Loading from "../app/Loading";

const getCurrentSegment = (
  currentMinutes: number,
  segments: Segment[],
): CurrentSegment | null => {
  const segment = segments.find(
    ({ start, end }) => currentMinutes >= start && currentMinutes < end,
  );
  if (!segment) return null;
  const totalMins = segment.end - segment.start;
  const completeMins = currentMinutes - segment.start;
  const pendingMins = totalMins - completeMins;
  const percentage = (completeMins / totalMins) * 100;
  return {
    ...segment,
    totalMins,
    completeMins,
    pendingMins,
    percentage,
  };
};

function CurrentSegmentCard() {
  const { data, isPending } = useSegments();
  const [currentMinutes, setCurrentMinutes] = useState(() => {
    const now = new Date();
    return now.getHours() * 60 + now.getMinutes();
  });

  useEffect(() => {
    const interval = setInterval(() => {
      const now = new Date();

      setCurrentMinutes(now.getHours() * 60 + now.getMinutes());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  if (isPending) return <Loading />;
  if (!data) return null;

  const currentSegment = getCurrentSegment(currentMinutes, data);

  if (!currentSegment) return null;
  const { title, start, end, pendingMins, percentage } = currentSegment;

  return (
    <div className="flex flex-col py-6 gap-2 border-b-2 border-border">
      <p className="text-text-muted text-sm">Right Now</p>
      <div className="mt-[-6px] flex items-end justify-between">
        <p className="text-text font-semibold text-xl">{title}</p>
        <p className="text-text-secondary text-sm font-medium">
          {moment.utc(start * 60000).format("HH:mm")}
          {" – "}
          {moment.utc(end * 60000).format("HH:mm")}
        </p>
      </div>
      <div className="bg-border-strong h-[4px] rounded-full overflow-hidden">
        <div
          className="h-full bg-accent"
          style={{ width: `${Math.trunc(percentage)}%` }}
        />
      </div>
      <p className="text-text-secondary text-sm">
        {`${Math.trunc(pendingMins / 60) > 0 ? `${Math.trunc(pendingMins / 60)}h` : ""} ${pendingMins % 60 > 0 ? `${pendingMins % 60}m` : ""} left in this block`}
      </p>
    </div>
  );
}

export default CurrentSegmentCard;
