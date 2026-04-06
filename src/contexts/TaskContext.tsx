import React, { createContext, useContext, useState, useCallback } from "react";
import type { Task, AuditLogEntry, TaskStatus, TaskPriority } from "@/types";

const INITIAL_TASKS: Task[] = [
  { id: "t1", title: "Design landing page", description: "Create wireframes and mockups for the new landing page.", status: "To Do", priority: "High", assigneeId: "u2", dueDate: "2026-04-15", createdAt: "2026-04-01T09:00:00Z", createdBy: "u1" },
  { id: "t2", title: "Fix login bug", description: "Users cannot login with special characters in password.", status: "In Progress", priority: "High", assigneeId: "u2", dueDate: "2026-04-10", createdAt: "2026-04-02T10:00:00Z", createdBy: "u1" },
  { id: "t3", title: "Write API docs", description: "Document all REST API endpoints.", status: "In Review", priority: "Medium", assigneeId: "u3", dueDate: "2026-04-12", createdAt: "2026-04-01T11:00:00Z", createdBy: "u1" },
  { id: "t4", title: "Set up CI/CD pipeline", description: "Configure GitHub Actions for automated testing and deployment.", status: "Done", priority: "Medium", assigneeId: "u3", dueDate: "2026-04-08", createdAt: "2026-03-28T08:00:00Z", createdBy: "u1" },
  { id: "t5", title: "Update dependencies", description: "Upgrade all npm packages to latest stable versions.", status: "To Do", priority: "Low", assigneeId: "u2", dueDate: "2026-04-20", createdAt: "2026-04-03T14:00:00Z", createdBy: "u1" },
  { id: "t6", title: "Add unit tests", description: "Increase test coverage for auth module.", status: "To Do", priority: "Medium", assigneeId: "u3", dueDate: "2026-04-18", createdAt: "2026-04-04T09:00:00Z", createdBy: "u1" },
];

const INITIAL_LOGS: AuditLogEntry[] = [
  { id: "l1", timestamp: "2026-04-01T09:00:00Z", userId: "u1", userName: "Alice Admin", action: "Created Task", details: "Created 'Design landing page'" },
  { id: "l2", timestamp: "2026-04-02T10:00:00Z", userId: "u1", userName: "Alice Admin", action: "Created Task", details: "Created 'Fix login bug'" },
  { id: "l3", timestamp: "2026-04-02T11:00:00Z", userId: "u2", userName: "Bob User", action: "Status Changed", details: "'Fix login bug' → In Progress" },
];

interface TaskContextType {
  tasks: Task[];
  auditLog: AuditLogEntry[];
  createTask: (task: Omit<Task, "id" | "createdAt">, userName: string) => void;
  updateTaskStatus: (taskId: string, status: TaskStatus, userId: string, userName: string) => void;
  assignTask: (taskId: string, assigneeId: string, userId: string, userName: string, assigneeName: string) => void;
}

const TaskContext = createContext<TaskContextType | null>(null);

let nextId = 7;

export function TaskProvider({ children }: { children: React.ReactNode }) {
  const [tasks, setTasks] = useState<Task[]>(INITIAL_TASKS);
  const [auditLog, setAuditLog] = useState<AuditLogEntry[]>(INITIAL_LOGS);

  const addLog = useCallback((userId: string, userName: string, action: string, details: string) => {
    setAuditLog((prev) => [
      { id: `l${Date.now()}`, timestamp: new Date().toISOString(), userId, userName, action, details },
      ...prev,
    ]);
  }, []);

  const createTask = useCallback((task: Omit<Task, "id" | "createdAt">, userName: string) => {
    const newTask: Task = { ...task, id: `t${nextId++}`, createdAt: new Date().toISOString() };
    setTasks((prev) => [...prev, newTask]);
    addLog(task.createdBy, userName, "Created Task", `Created '${task.title}'`);
  }, [addLog]);

  const updateTaskStatus = useCallback((taskId: string, status: TaskStatus, userId: string, userName: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, status } : t))
    );
    const task = tasks.find((t) => t.id === taskId);
    addLog(userId, userName, "Status Changed", `'${task?.title}' → ${status}`);
  }, [addLog, tasks]);

  const assignTask = useCallback((taskId: string, assigneeId: string, userId: string, userName: string, assigneeName: string) => {
    setTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, assigneeId } : t))
    );
    const task = tasks.find((t) => t.id === taskId);
    addLog(userId, userName, "Reassigned", `'${task?.title}' assigned to ${assigneeName}`);
  }, [addLog, tasks]);

  return (
    <TaskContext.Provider value={{ tasks, auditLog, createTask, updateTaskStatus, assignTask }}>
      {children}
    </TaskContext.Provider>
  );
}

export function useTasks() {
  const ctx = useContext(TaskContext);
  if (!ctx) throw new Error("useTasks must be used within TaskProvider");
  return ctx;
}
