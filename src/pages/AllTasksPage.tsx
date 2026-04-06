import { useTasks } from "@/contexts/TaskContext";
import { useAuth } from "@/contexts/AuthContext";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import type { TaskStatus, TaskPriority } from "@/types";
import { useEffect } from "react";

const priorityVariant: Record<TaskPriority, "default" | "secondary" | "destructive"> = {
  Low: "secondary",
  Medium: "default",
  High: "destructive",
};

const statusStyle: Record<TaskStatus, string> = {
  "To Do": "bg-muted text-muted-foreground",
  "In Progress": "bg-primary/15 text-primary border-primary/20",
  "In Review": "bg-accent text-accent-foreground",
  "Done": "bg-secondary text-secondary-foreground",
};

export default function AllTasksPage() {
  const { users } = useAuth();
  const { tasks, fetchTasks, assignTask } = useTasks();

  useEffect(() => { fetchTasks(); }, [fetchTasks]);

  const getUserName = (id: string) => users.find((u) => u.id === id)?.name ?? "Unknown";

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">All Tasks</h2>
      <div className="rounded-lg border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Title</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Priority</TableHead>
              <TableHead>Assignee</TableHead>
              <TableHead>Due Date</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <TableRow key={task.id}>
                <TableCell className="font-medium">{task.title}</TableCell>
                <TableCell>
                  <Badge variant="outline" className={statusStyle[task.status]}>{task.status}</Badge>
                </TableCell>
                <TableCell>
                  <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
                </TableCell>
                <TableCell>
                  <Select
                    value={task.assigneeId}
                    onValueChange={(val) => assignTask(task.id, val)}
                  >
                    <SelectTrigger className="w-36 h-8 text-xs">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {users.filter((u) => u.role === "user").map((u) => (
                        <SelectItem key={u.id} value={u.id}>{u.name}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </TableCell>
                <TableCell className="text-muted-foreground">{task.dueDate}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  );
}
