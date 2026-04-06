import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import type { TaskStatus, TaskPriority } from "@/types";
import { useEffect } from "react";

const STATUSES: TaskStatus[] = ["To Do", "In Progress", "In Review", "Done"];

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

export default function MyTasksPage() {
  const { user } = useAuth();
  const { tasks, fetchMyTasks, updateTaskStatus } = useTasks();

  useEffect(() => { fetchMyTasks(); }, [fetchMyTasks]);

  return (
    <div className="space-y-4">
      <h2 className="text-2xl font-bold text-foreground">My Tasks</h2>
      {tasks.length === 0 && (
        <p className="text-muted-foreground">No tasks assigned to you.</p>
      )}
      <div className="grid gap-4 sm:grid-cols-2">
        {tasks.map((task) => (
          <Card key={task.id}>
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between gap-2">
                <CardTitle className="text-base">{task.title}</CardTitle>
                <Badge variant={priorityVariant[task.priority]}>{task.priority}</Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              <p className="text-sm text-muted-foreground">{task.description}</p>
              <div className="flex items-center justify-between">
                <span className="text-xs text-muted-foreground">Due: {task.dueDate}</span>
                <Badge variant="outline" className={statusStyle[task.status]}>{task.status}</Badge>
              </div>
              <div className="space-y-1">
                <label className="text-xs font-medium text-muted-foreground">Update Status</label>
                <Select
                  value={task.status}
                  onValueChange={(val) => updateTaskStatus(task.id, val as TaskStatus)}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {STATUSES.map((s) => (
                      <SelectItem key={s} value={s}>{s}</SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
