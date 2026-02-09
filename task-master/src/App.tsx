import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getTasks, deleteTask, toggleTask } from "./api/tasks";
import { create } from "zustand";

type Filter = "all" | "active" | "completed";

type FilterStore = {
  filter: Filter;
  setFilter: (filter: Filter) => void;
};

const useFilterStore = create<FilterStore>((set) =>({
  filter: "all",
  setFilter: (filter: Filter) => set({ filter }),
}));

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");

  const { filter, setFilter } = useFilterStore();

  const createTaskMutation = useMutation({
    mutationFn: createTask,
    onSuccess: async () => {
      setTitle("");
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: deleteTask,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  const toggleTaskMutation = useMutation({
    mutationFn: ({ id, isCompleted }: { id: string; isCompleted: boolean }) => toggleTask(id, isCompleted),
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["tasks"] });
    },
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Ошибка сервера</div>;
  }

  const filteredTasks = (data ?? []).filter((task) => {
    if (filter === "active") return !task.isCompleted;
    if (filter === "completed") return task.isCompleted;
    return true; //all
  });

  return (
    <div>
      <div>
        <input
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          placeholder="Новая задача"
        />
        <button
          onClick={() => createTaskMutation.mutate(title)}
          disabled={title.trim() === "" || createTaskMutation.isPending}
        >
          Добавить
        </button>
      </div>

      {createTaskMutation.isError && <div>Ошибка сервера</div>}
      {deleteTaskMutation.isError && <div>Ошибка сервера</div>}
      {toggleTaskMutation.isError && <div>Ошибка сервера</div>}

      <div>
        <button onClick = {() => setFilter("all")} disabled = {filter === "all"}>Все</button>
        <button onClick = {() => setFilter("active")} disabled = {filter === "active"}>Активные</button>
        <button onClick = {() => setFilter("completed")} disabled = {filter === "completed"}>Выполненные</button>
      </div>

      <ul>
        {filteredTasks.map((task) => (
          <li key={task.id}>
            <input 
              type="checkbox"
              checked={task.isCompleted}
              onChange={() =>
                toggleTaskMutation.mutate({
                  id: task.id,
                  isCompleted: !task.isCompleted,
                })
              }
              disabled={toggleTaskMutation.isPending}
            />

            <span>{task.title}</span>

            <button
              onClick={() => deleteTaskMutation.mutate(task.id)}
              disabled={deleteTaskMutation.isPending}
            >
              Удалить
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
