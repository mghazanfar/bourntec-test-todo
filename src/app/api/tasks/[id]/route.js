import { NextResponse } from "next/server";
import path from "path";
import fs from "fs";

const filePath = path.join(process.cwd(), "src", "data", "tasks.json");

export async function DELETE(request, { params }) {
  try {
    const { id } = params;

    const data = fs.readFileSync(filePath, "utf-8");
    let tasks = JSON.parse(data);

    tasks = tasks.filter((task) => task.id !== id);

    fs.writeFileSync(filePath, JSON.stringify(tasks, null, 2));

    return NextResponse.json({ message: "Task deleted" });
  } catch (error) {
    console.error("Error deleting task:", error);
    return NextResponse.json(
      { message: "Internal Server Error" },
      { status: 500 }
    );
  }
}
