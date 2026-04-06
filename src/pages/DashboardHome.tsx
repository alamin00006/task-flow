import { useAuth } from "@/contexts/AuthContext";
import { useTasks } from "@/contexts/TaskContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { TaskStatus } from "@/types";

const STATUSES: TaskStatus[] = ["To Do", "In Progress", "In Review", "Done"];

const statusColors: Record<TaskStatus, string> = {
  "To Do": "bg-muted text-muted-foreground",
  "In Progress": "bg-primary/10 text-primary",
  "In Review": "bg-accent text-accent-foreground",
  "Done": "bg-secondary text-secondary-foreground",
};

export default function DashboardHome() {
  const { user } = useAuth();
  const { tasks } = useTasks();

  const relevantTasks = user?.role === "admin" ? tasks : tasks.filter((t) => t.assigneeId === user?.id);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-foreground">Welcome, {user?.name}</h2>
        <p className="text-muted-foreground">
          {user?.role === "admin" ? "Here's an overview of all tasks." : "Here's an overview of your assigned tasks."}
        </p>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {STATUSES.map((status) => {
          const count = relevantTasks.filter((t) => t.status === status).length;
          return (
            <Card key={status}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">{status}</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{count}</div>
              </CardContent>
            </Card>
          );
        })}
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-lg">Total Tasks</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-4xl font-bold text-foreground">{relevantTasks.length}</div>
        </CardContent>
      </Card>
    </div>
  );
}
