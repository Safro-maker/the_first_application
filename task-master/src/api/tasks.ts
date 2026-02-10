const BASE_URL = "https://69760a7fc0c36a2a99501380.mockapi.io";

export type Task = {
    id: string;
    title: string;
    isCompleted: boolean;
    createdAt: number; 
};
export async function getTasks(): Promise<Task[]> {
    const response = await fetch(`${BASE_URL}/tasks`);

    if (!response.ok) {
        throw new Error("Ошибка загрузки задач");
    }

    const data = await response.json();
    return data;
};

export async function createTask(title: string): Promise<Task> {
    const response = await fetch(`${BASE_URL}/tasks`, {
        method: "POST",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({
            title: title,
            isCompleted: false,
            createdAt: Date.now()
        }),
    });
    
    if(!response.ok) {
        throw new Error("Ошибка создания задачи");
    }

    const data = await response.json();
    return data;
};

export async function deleteTask(id: string): Promise<void> {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "DELETE",
    });

    if (!response.ok) {
        throw new Error("Ошибка удаления задачи")
    }
};

export async function toggleTask(id: string, isCompleted: boolean): Promise<void> {
    const response = await fetch(`${BASE_URL}/tasks/${id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json"},
        body: JSON.stringify({ isCompleted }),
    });

    if (!response.ok) {
        throw new Error("Ошибка обновления задачи");
    }
};