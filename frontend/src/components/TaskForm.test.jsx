import { fireEvent, render, screen } from '@testing-library/react';
import { describe, expect, it, vi } from 'vitest';
import { TaskForm } from './TaskForm';

describe('TaskForm', () => {
  it('renders correctly', () => {
    render(<TaskForm isSubmitting={false} onSubmit={vi.fn()} />);

    expect(screen.getByLabelText(/title/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/description/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /add task/i })).toBeInTheDocument();
  });

  it('shows validation messages for blank fields', async () => {
    render(<TaskForm isSubmitting={false} onSubmit={vi.fn()} />);

    fireEvent.click(screen.getByRole('button', { name: /add task/i }));

    expect(await screen.findByText('A title is required.')).toBeInTheDocument();
    expect(screen.getByText('A description is required.')).toBeInTheDocument();
  });
});

