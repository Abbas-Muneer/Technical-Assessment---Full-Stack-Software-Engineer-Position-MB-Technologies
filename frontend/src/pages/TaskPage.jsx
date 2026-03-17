import { AppLayout } from '../components/AppLayout';
import { ErrorState } from '../components/ErrorState';
import { LoadingState } from '../components/LoadingState';
import { TaskForm } from '../components/TaskForm';
import { TaskList } from '../components/TaskList';
import { Toast } from '../components/Toast';
import { useCompleteTask, useCreateTask, useTasks } from '../hooks/useTasks';
import { useToast } from '../utils/useToast';

export function TaskPage() {
  const tasksQuery = useTasks();
  const createTaskMutation = useCreateTask();
  const completeTaskMutation = useCompleteTask();
  const { toast, hideToast, showToast } = useToast();

  const handleCreateTask = async (values, resetForm, setFieldErrors) => {
    try {
      await createTaskMutation.mutateAsync(values);
      resetForm();
      showToast('Task added to your active queue.');
    } catch (error) {
      if (error.validationErrors && Object.keys(error.validationErrors).length > 0) {
        setFieldErrors(error.validationErrors);
        return;
      }

      showToast(error.message || 'Unable to create task right now.', 'error');
    }
  };

  const handleCompleteTask = async (taskId) => {
    try {
      await completeTaskMutation.mutateAsync(taskId);
      showToast('Task marked as done.');
    } catch (error) {
      showToast(error.message || 'Unable to complete task right now.', 'error');
    }
  };

  return (
    <AppLayout>
      <section className="grid gap-8 lg:grid-cols-[1.05fr_0.95fr]">
        <div className="space-y-6">
          <div className="space-y-4 rounded-[2rem] border border-white/60 bg-white/88 p-6 shadow-[0_32px_80px_rgba(15,23,42,0.12)] backdrop-blur-xl">
            <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-400">
              Today&apos;s focus
            </p>
            <h1 className="max-w-lg text-4xl font-semibold tracking-tight text-slate-950 sm:text-5xl">
              Turn intent into a short, shippable list.
            </h1>
            <p className="max-w-xl text-base leading-7 text-slate-600">
              Capture tasks quickly, keep only the latest five active items in view, and clear work the
              moment it is done.
            </p>
          </div>

          <TaskForm
            isSubmitting={createTaskMutation.isPending}
            onSubmit={handleCreateTask}
          />
        </div>

        <div className="rounded-[2rem] border border-slate-200/80 bg-slate-950 p-6 text-white shadow-[0_32px_90px_rgba(15,23,42,0.28)]">
          <div className="mb-6 flex items-center justify-between">
            <div>
              <p className="text-sm font-medium uppercase tracking-[0.35em] text-slate-400">
                Active queue
              </p>
              <h2 className="mt-3 text-2xl font-semibold tracking-tight">Latest 5 incomplete tasks</h2>
            </div>
            <div className="rounded-full border border-white/10 bg-white/5 px-4 py-2 text-sm text-slate-300">
              {tasksQuery.data?.length ?? 0} visible
            </div>
          </div>

          {tasksQuery.isLoading ? <LoadingState /> : null}
          {tasksQuery.isError ? (
            <ErrorState message={tasksQuery.error.message} onRetry={tasksQuery.refetch} />
          ) : null}
          {!tasksQuery.isLoading && !tasksQuery.isError ? (
            <TaskList
              tasks={tasksQuery.data ?? []}
              isCompleting={completeTaskMutation.isPending}
              onCompleteTask={handleCompleteTask}
            />
          ) : null}
        </div>
      </section>

      <Toast toast={toast} onClose={hideToast} />
    </AppLayout>
  );
}

