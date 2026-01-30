const BASE_URL = "https://69760a7fc0c36a2a99501380.mockapi.io";

export type Task = {
    id: string;
    title: string;
    isCompleted: boolean;
    createdAt: string; 
};
export async function getTasks(): Promise<Task[]> {
    const response = await fetch(`${BASE_URL}/tasks`);

    if (!response.ok) {
        throw new Error("Ошибка загрузки задач");
    }

    const data = await response.json();
    return data;
};
