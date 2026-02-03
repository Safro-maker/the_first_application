import { useState } from "react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { createTask, getTasks } from "./api/tasks";

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

      <ul>
        {data?.map((task) => (
          <li key={task.id}>
            <input 
              type="checkbox"
              checked={task.isCompleted}
              readOnly
            />

            <span>{task.title}</span>

            <button>Удалить</button>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default App;
