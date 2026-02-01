import { useQuery } from "@tanstack/react-query";
import { getTasks } from "./api/tasks";

function App() {
  const { data, isLoading, isError } = useQuery({
    queryKey: ["tasks"],
    queryFn: getTasks,
  });

  if (isLoading) {
    return <div>Загрузка...</div>;
  }

  if (isError) {
    return <div>Ошибка загрузки задач</div>;
  }

  return (
    <ul>
      {data?.map(task => (
        <li key={task.id}>{task.title}</li>
      ))}
    </ul>
  );
}

export default App;
