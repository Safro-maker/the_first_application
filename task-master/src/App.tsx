import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getTasks, deleteTask, toggleTask } from "./api/tasks";

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  const queryClient = useQueryClient();

  const [title, setTitle] = useState("");

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

      <ul>
        {data?.map((task) => (
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
