import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "src", "data", "tasks.json");

export async function POST(request) {
  const { title, description } = await request.json();

  // Read existing tasks
  const data = fs.readFileSync(filePath, "utf-8");
  const tasks = JSON.parse(data);

  // Add new task
  const newTask = {
    id: Date.now().toString(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);

  // Write updated tasks to file
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

  return NextResponse.json(newTask, { status: 201 });
}

export async function GET() {
  const data = fs.readFileSync(filePath, "utf-8");
  const tasks = JSON.parse(data);
  return NextResponse.json(tasks);
}

export async function DELETE(request, { params }) {
  const { id } = params;

  // Read existing tasks
  const data = fs.readFileSync(filePath, "utf-8");
  let tasks = JSON.parse(data);

  // Filter out the task to delete
  tasks = tasks.filter((task) => task.id !== id);

  // Write updated tasks to file
  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

  return NextResponse.json({ message: "Task deleted" });
}
