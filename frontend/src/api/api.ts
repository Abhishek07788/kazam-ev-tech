import io from "socket.io-client";
const API = "http://localhost:8080";
export const Socket = io(API);

export const getTask = async () => {
  return (await fetch(`${API}/api/fetchAllTasks`)).json();
};

export const addTask = async (title: string) => {
  return (
    await fetch(`${API}/api/add`, {
      method: "POST",
      headers: {
        "content-type": "application/json",
      },
      body: JSON.stringify({ title }),
    })
  ).json();
};
