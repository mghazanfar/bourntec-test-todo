import path from "path";
import fs from "fs";
import { NextResponse } from "next/server";

const filePath = path.join(process.cwd(), "src", "data", "tasks.json");

export async function POST(request) {
  const { title, description } = await request.json();

  const data = fs.readFileSync(filePath, "utf-8");
  const tasks = JSON.parse(data);

  const newTask = {
    id: Date.now().toString(),
    title,
    description,
    createdAt: new Date().toISOString(),
  };
  tasks.push(newTask);

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

  const data = fs.readFileSync(filePath, "utf-8");
  let tasks = JSON.parse(data);

  tasks = tasks.filter((task) => task.id !== id);

  fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

  return NextResponse.json({ message: "Task deleted" });
}
