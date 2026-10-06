import { useState } from "react";
import Segments from "./components/Segments";
import Todos from "./components/Todos";
import Goals from "./components/Goals";

const lists = [
  {
    key: "segments",
    title: "Segments",
  },
  {
    key: "todos",
    title: "Todos",
  },
  {
    key: "goals",
    title: "Goals",
  },
];
function Lists() {
  const [activeList, setActiveList] = useState("todos");
  return (
    <div className="h-full p-2 flex flex-col gap-2">
      <ul className="w-fit flex m-auto gap-4 p-1 rounded-full bg-border shrink-0">
        {lists.map(({ title, key }) => (
          <li
            className={`${key === activeList ? "bg-text text-white" : null} text-xs p-1 px-2 rounded-full`}
            onClick={() => setActiveList(key)}
          >
            {title}
          </li>
        ))}
      </ul>
      <div className="flex-1 min-h-0">
        {(() => {
          switch (activeList) {
            case "segments":
              return <Segments />;
            case "todos":
              return <Todos />;
            case "goals":
              return <Goals />;
          }
        })()}
      </div>
    </div>
  );
}

export default Lists;
