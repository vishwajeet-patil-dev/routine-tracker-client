import moment from "moment";
import { useAddSegment, useSegments } from "../../home/hooks";
import { useEffect, useRef, useState } from "react";
import type { Segment } from "../../home/types";
import { formatDuration, timeToMinutes } from "../utils";

const days = [
  {
    id: 1,
    title: "Monday",
  },
  {
    id: 2,
    title: "Tuesday",
  },
  {
    id: 3,
    title: "Wednsday",
  },
  {
    id: 4,
    title: "Thursday",
  },
  {
    id: 5,
    title: "Friday",
  },
  {
    id: 6,
    title: "Saturday",
  },
  {
    id: 7,
    title: "Sunday",
  },
];

type SegmentForm = Omit<Segment, "start" | "end"> & {
  start: number | null;
  end: number | null;
};

function Segments() {
  const { data = [], isPending } = useSegments();
  const [isAddOpen, setIsAddOpen] = useState(false);

  if (isPending) return null;

  return (
    <div className="h-full flex flex-col">
      {isAddOpen && <AddSegmentModal onClose={() => setIsAddOpen(false)} />}

      <p
        onClick={() => setIsAddOpen(true)}
        className="py-3 border-t-2 border-border flex items-center gap-1 text-blue-800 text-[16px] font-[500]"
      >
        <PlusIcon />
        Add new segment
      </p>

      <ul className="overflow-y-auto max-h-full">
        {data.map(({ title, start, end }) => (
          <li className="py-2 border-t-2 border-border flex">
            <div className="w-full">
              <p className="text-text text-[16px] font-[500]">{title}</p>

              <p className="text-text-secondary text-[12px] font-[400] mt-1">
                {moment.utc(start * 60000).format("HH:mm")}
                {" – "}
                {moment.utc(end * 60000).format("HH:mm")}

                <span className="ml-2 text-blue-800 text-[12px] font-[500]">
                  {` ${formatDuration(end - start)}`}
                </span>
              </p>
            </div>

            {/* <div className="w-[100px] bg-red-600 flex items-center justify-center">
              <p className="text-bg text-[14px] font-[500]">Delete</p>
            </div> */}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Segments;

function AddSegmentModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [segment, setSegment] = useState<SegmentForm>({
    title: "",
    start: null,
    end: null,
    days: [1, 2, 3, 4, 5],
  });

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const addSegmentMutation = useAddSegment();

  return (
    <dialog
      ref={dialogRef}
      onClose={onClose}
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          dialogRef.current?.close();
        }
      }}
      className="m-auto w-[90%] max-w-sm rounded-2xl bg-bg p-0 text-text backdrop:bg-black/40 backdrop:backdrop-blur-sm "
    >
      <div className="p-4 py-6 flex flex-col gap-6">
        <h2 className="text-text text-[18px] font-[500]">New Segment</h2>

        <div className="">
          <label
            htmlFor="title"
            className="block text-sm font-[400] text-text-muted"
          >
            Title
          </label>

          <input
            value={segment.title}
            onChange={(e) =>
              setSegment({
                ...segment,
                title: e.target.value,
              })
            }
            type="text"
            name="title"
            placeholder="eg. Morning Workout"
            className="text-lg font-[500]"
          />

          <hr className="border-border-strong border-[1px] mt-2" />
        </div>

        <div className="flex gap-8">
          <div className="flex-grow">
            <label
              htmlFor="start"
              className="block text-sm font-[400] text-text-muted"
            >
              Starts
            </label>

            <div className="flex items-center pr-2">
              <input
                type="time"
                name="start"
                onChange={(e) =>
                  setSegment({
                    ...segment,
                    start: timeToMinutes(e.target.value),
                  })
                }
                className="text-lg font-[500] w-full"
              />

              <ClockIcon />
            </div>

            <hr className="border-border-strong border-[1px] mt-2" />
          </div>

          <div className="flex-grow">
            <label
              htmlFor="start"
              className="block text-sm font-[400] text-text-muted"
            >
              Ends
            </label>

            <div className="flex items-center pr-2">
              <input
                type="time"
                name="end"
                onChange={(e) =>
                  setSegment({
                    ...segment,
                    end: timeToMinutes(e.target.value),
                  })
                }
                className="text-lg font-[500] w-full"
              />

              <ClockIcon />
            </div>

            <hr className="border-border-strong border-[1px] mt-2" />
          </div>
        </div>

        <p className="text-xs font-medium text-blue-800 mt-[-10px]">
          {segment.start !== null && segment.end !== null
            ? `Duration: ${formatDuration(segment.end - segment.start)}`
            : null}
        </p>

        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-xs text-blue-600 font-[500]">
            <p className="text-text-muted ">Repeats on</p>

            <p
              onClick={() =>
                setSegment({
                  ...segment,
                  days: [1, 2, 3, 4, 5],
                })
              }
            >
              Weekdays
            </p>

            <p
              onClick={() =>
                setSegment({
                  ...segment,
                  days: [6, 7],
                })
              }
            >
              Weekends
            </p>

            <p
              onClick={() =>
                setSegment({
                  ...segment,
                  days: [1, 2, 3, 4, 5, 6, 7],
                })
              }
            >
              Every day
            </p>
          </div>

          <div className="flex justify-between">
            {days.map(({ id, title }) => (
              <div
                key={id}
                className={`border border-border h-[35px] aspect-square rounded-full flex items-center justify-center ${
                  segment.days.find((v) => v === id)
                    ? "bg-blue-900 text-white"
                    : ""
                }`}
              >
                <p className="text-xs font-[500]">{title.charAt(0)}</p>
              </div>
            ))}
          </div>
        </div>

        <div>
          <button
            disabled={addSegmentMutation.isPending}
            onClick={() => {
              if (segment.start === null || segment.end === null) return;

              const payload: Segment = {
                ...segment,
                start: segment.start,
                end: segment.end,
              };

              addSegmentMutation.mutate(payload);
            }}
            className=" w-full py-4 rounded-xl bg-text text-white font-medium text-sm disabled:bg-surface"
          >
            Save Segment
          </button>

          {addSegmentMutation.error ? (
            <p className="text-xs font-light text-red-500 mt-[6px]">
              {addSegmentMutation.error.message}
            </p>
          ) : null}
        </div>
      </div>
    </dialog>
  );
}

function PlusIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="20"
      height="20"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M5 12h14" />
      <path d="M12 5v14" />
    </svg>
  );
}

function ClockIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 6v6l4 2" />
    </svg>
  );
}
