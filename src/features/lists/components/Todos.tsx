import moment from "moment";
import { useEffect, useRef, useState } from "react";
import { useAddTodo, useSegments, useTodos } from "../../home/hooks";
import type { Todo } from "../../home/types";
import CalendarPicker from "./CalenderPicker";

type TodoForm = Omit<Todo, "scheduledOn" | "segmentId"> & {
  scheduledOn: Date | null;
  segmentId: string | null;
};

function Todos() {
  const [isAddOpen, setIsAddOpen] = useState(false);

  const { data = [], isPending, error } = useTodos();

  if (isPending) return <p>Loading Todos</p>;

  if (error) return <p>{error.message}</p>;

  return (
    <div className="h-full flex flex-col">
      {isAddOpen && <AddTodoModal onClose={() => setIsAddOpen(false)} />}

      <p
        onClick={() => setIsAddOpen(true)}
        className="py-3 border-t-2 border-border flex items-center gap-1 text-blue-800 text-[16px] font-[500]"
      >
        <PlusIcon />
        Add new Todo
      </p>

      <ul className="overflow-y-auto max-h-full">
        {data.map(({ title, isCompleted, scheduledOn }) => (
          <li className="py-2 border-t-2 border-border flex items-center gap-4">
            <div className="border border-border-strong h-[16px] aspect-square rounded-full flex items-center justify-center">
              {isCompleted ? <TickIcon /> : null}
            </div>

            <div className="w-full">
              <p
                className={` text-[16px] font-[400] ${
                  isCompleted ? "line-through text-text-secondary" : "text-text"
                }`}
              >
                {title}
              </p>

              <p className="text-text-secondary text-[12px] font-[200]">
                No Segment
              </p>
            </div>

            <div className="text-[12px] font-[500] text-text">
              {scheduledOn ? moment(scheduledOn).calendar({}) : ""}
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Todos;

function AddTodoModal({ onClose }: { onClose: () => void }) {
  const dialogRef = useRef<HTMLDialogElement>(null);

  const [todo, setTodo] = useState<TodoForm>({
    title: "",
    isCompleted: false,
    scheduledOn: null,
    segmentId: null,
  });

  useEffect(() => {
    const dialog = dialogRef.current;

    if (dialog && !dialog.open) {
      dialog.showModal();
    }
  }, []);

  const addTodoMutation = useAddTodo();
  const { data = [], isPending } = useSegments();

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
        <h2 className="text-text text-[18px] font-[500]">New Todo</h2>

        <div className="">
          <label
            htmlFor="title"
            className="block text-sm font-[400] text-text-muted"
          >
            Title
          </label>

          <input
            value={todo.title}
            onChange={(e) =>
              setTodo({
                ...todo,
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

        {!isPending ? (
          <div className="">
            <label
              htmlFor="segment"
              className="block text-sm font-[400] text-text-muted"
            >
              Segment
            </label>

            <select
              name="segment"
              id=""
              className="focus:outline-none text-lg font-[500]"
              onChange={(e) =>
                setTodo({
                  ...todo,
                  segmentId: e.target.value,
                })
              }
            >
              {data.map(({ title, _id }) => (
                <option key={_id} value={_id}>
                  {title}
                </option>
              ))}
            </select>

            <hr className="border-border-strong border-[1px] mt-2" />
          </div>
        ) : (
          <p>Loading</p>
        )}

        <div className="flex flex-col gap-3">
          <div className="flex justify-between text-xs items-center">
            <p className="text-sm font-[400] text-text-muted">When</p>

            <div className="flex gap-2 border border-border-strong p-1 rounded-full text-xs font-[500] bg-surface">
              <p
                onClick={() =>
                  setTodo({
                    ...todo,
                    scheduledOn: new Date(),
                  })
                }
                className={`p-1 px-2 rounded-full ${
                  todo.scheduledOn ? "bg-text text-bg" : ""
                }`}
              >
                One time{" "}
              </p>

              <p
                onClick={() =>
                  setTodo({
                    ...todo,
                    scheduledOn: null,
                  })
                }
                className={`p-1 px-2 rounded-full ${
                  !todo.scheduledOn ? "bg-text text-bg" : ""
                }`}
              >
                Recurring
              </p>
            </div>
          </div>

          {todo.scheduledOn ? (
            <CalendarPicker
              allowedWeekdays={[1, 2, 3, 4, 5, 6, 7]}
              value={todo.scheduledOn}
              onChange={(date) =>
                setTodo({
                  ...todo,
                  scheduledOn: date,
                })
              }
            />
          ) : null}
        </div>

        <div>
          <button
            disabled={addTodoMutation.isPending}
            onClick={() => {
              const payload: Todo = {
                ...todo,
                scheduledOn: todo.scheduledOn ?? undefined,
                segmentId: todo.segmentId ?? undefined,
              };

              addTodoMutation.mutate(payload);
            }}
            className=" w-full py-4 rounded-xl bg-text text-white font-medium text-sm disabled:bg-surface"
          >
            Save Segment
          </button>

          {addTodoMutation.error ? (
            <p className="text-xs font-light text-red-500 mt-[6px]">
              {addTodoMutation.error.message}
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

function TickIcon() {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="12"
      height="12"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M20 6 9 17l-5-5" />
    </svg>
  );
}
