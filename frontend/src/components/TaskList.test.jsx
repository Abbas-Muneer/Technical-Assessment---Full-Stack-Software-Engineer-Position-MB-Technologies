import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { EmptyState } from './EmptyState';
import { LoadingState } from './LoadingState';
import { TaskCard } from './TaskCard';
import { TaskList } from './TaskList';

const tasks = [
  {
    id: 1,
    title: 'Write README',
    description: 'Document architecture choices',
    status: 'PENDING',
    createdAt: '2026-03-17T10:00:00Z'
  }
];

describe('Task list suite', () => {
  it('renders tasks', () => {
    render(<TaskList tasks={tasks} isCompleting={false} onCompleteTask={vi.fn()} />);

    expect(screen.getByText('Write README')).toBeInTheDocument();
  });

  it('triggers completion from task card', () => {
    const onComplete = vi.fn();
    render(<TaskCard task={tasks[0]} isCompleting={false} onComplete={onComplete} />);

    fireEvent.click(screen.getByRole('button', { name: /done/i }));

    expect(onComplete).toHaveBeenCalledTimes(1);
  });

  it('renders empty state when no tasks exist', () => {
    render(<EmptyState />);

    expect(screen.getByText(/no incomplete tasks right now/i)).toBeInTheDocument();
  });

  it('renders loading state', () => {
    render(<LoadingState />);

    expect(screen.getByLabelText(/loading tasks/i)).toBeInTheDocument();
  });
});

