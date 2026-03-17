import { EmptyState } from './EmptyState';
import { TaskCard } from './TaskCard';

export function TaskList({ tasks, isCompleting, onCompleteTask }) {
  if (!tasks.length) {
    return <EmptyState />;
  }

  return (
    <div className="space-y-4">
      {tasks.map((task) => (
        <TaskCard
          key={task.id}
          task={task}
          isCompleting={isCompleting}
          onComplete={() => onCompleteTask(task.id)}
        />
      ))}
    </div>
  );
}

