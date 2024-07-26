const API = "http://localhost:8080/api";

export const getTask = async () => {
  return (await fetch(`${API}/fetchAllTasks`)).json();
};

export const addTask = async (title: string) => {
  return (
    await fetch(`${API}/add`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ title }),
    })
  ).json();
};
