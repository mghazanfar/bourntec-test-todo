"use client";

import { useEffect, useState } from "react";
import axios from "axios";

export default function Home() {
  const [tasks, setTasks] = useState([]);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [addingData, setAddingData] = useState(false);
  const [deletingData, setDeletingData] = useState(false);
  const [loadingData, setLoadingData] = useState(false);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = () => {
    setLoadingData(true);
    axios
      .get("/api/tasks")
      .then((res) => setTasks(res?.data))
      .finally(() => setLoadingData(false));
  };

  const addTask = async (e) => {
    e.preventDefault();
    if (!title || !description) {
      alert("Please fill in both title and description.");
      return;
    }
    setAddingData(true);
    axios
      .post("/api/tasks", { title, description })
      .then((res) => {
        setTasks([...tasks, res.data]);
        setTitle("");
        setDescription("");
      })
      .finally(() => setAddingData(false));
  };

  const deleteTask = (id) => {
    setDeletingData(id);
    axios
      .delete(`/api/tasks/${id}`)
      .then(() => setTasks(tasks.filter((task) => task.id !== id)))
      .finally(() => setDeletingData(false));
  };

  return (
    <div className="min-h-screen bg-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-3xl font-bold text-center text-gray-900 mb-8">
          Todo App
        </h1>

        <form
          className="bg-white shadow-md rounded-lg p-6 mb-8"
          onSubmit={addTask}
        >
          <h2 className="text-xl font-semibold text-gray-800 mb-4">
            Add a New Task
          </h2>
          <div className="space-y-4">
            <input
              type="text"
              placeholder="Title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <input
              type="text"
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
            <button
              disabled={addingData}
              type="submit"
              className="w-full bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600 transition duration-200"
            >
              {addingData ? "Adding" : "Add"} Task
            </button>
          </div>
        </form>

        {addingData && <h1>Adding Data...</h1>}

        <div className="space-y-4">
          {loadingData && <h1>Loading Data...</h1>}
          {tasks.map((task) => (
            <div
              key={task.id}
              className="bg-white shadow-md rounded-lg p-6 flex justify-between items-center"
            >
              <div>
                <h3 className="text-lg font-semibold text-gray-900">
                  {task.title}
                </h3>
                <p className="text-gray-600">{task.description}</p>
                <p className="text-sm text-gray-400 mt-2">
                  Created: {new Date(task.createdAt).toLocaleString()}
                </p>
              </div>
              <button
                disabled={task.id === deletingData}
                onClick={() => deleteTask(task.id)}
                className="bg-red-500 text-white py-1 px-3 rounded-md hover:bg-red-600 transition duration-200"
              >
                {task.id === deletingData ? "Deleting..." : "Delete"}
              </button>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
