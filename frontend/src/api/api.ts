import io from "socket.io-client";
const API = "http://localhost:8080";
export const Socket = io(API);

export const getTask = async () => {
  return (await fetch(`${API}/fetchAllTasks`)).json();
};
