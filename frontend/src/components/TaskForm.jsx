import { useState } from 'react';

const initialValues = {
  title: '',
  description: ''
};

export function TaskForm({ isSubmitting, onSubmit }) {
  const [values, setValues] = useState(initialValues);
  const [errors, setErrors] = useState({});

  const setFieldValue = (field, value) => {
    setValues((current) => ({ ...current, [field]: value }));
    setErrors((current) => ({ ...current, [field]: undefined }));
  };

  const validate = () => {
    const nextErrors = {};

    if (!values.title.trim()) {
      nextErrors.title = 'A title is required.';
    } else if (values.title.trim().length > 150) {
      nextErrors.title = 'Title must be 150 characters or fewer.';
    }

    if (!values.description.trim()) {
      nextErrors.description = 'A description is required.';
    }

    setErrors(nextErrors);
    return Object.keys(nextErrors).length === 0;
  };

  const resetForm = () => {
    setValues(initialValues);
    setErrors({});
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!validate()) {
      return;
    }

    await onSubmit(
      {
        title: values.title.trim(),
        description: values.description.trim()
      },
      resetForm,
      setErrors
    );
  };

  return (
    <form
      className="rounded-[2rem] border border-white/70 bg-white/92 p-6 shadow-[0_28px_80px_rgba(15,23,42,0.08)] backdrop-blur-xl"
      onSubmit={handleSubmit}
      noValidate
    >
      <div className="flex flex-col gap-5">
        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="title">
            Title
          </label>
          <input
            id="title"
            name="title"
            type="text"
            maxLength={150}
            value={values.title}
            onChange={(event) => setFieldValue('title', event.target.value)}
            placeholder="Prepare candidate walkthrough"
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
          />
          {errors.title ? <p className="mt-2 text-sm text-rose-600">{errors.title}</p> : null}
        </div>

        <div>
          <label className="mb-2 block text-sm font-medium text-slate-700" htmlFor="description">
            Description
          </label>
          <textarea
            id="description"
            name="description"
            rows="5"
            value={values.description}
            onChange={(event) => setFieldValue('description', event.target.value)}
            placeholder="Capture the real work, not just the label."
            className="w-full rounded-2xl border border-slate-200 bg-slate-50 px-4 py-3 text-base text-slate-900 outline-none transition focus:border-slate-900 focus:bg-white"
          />
          {errors.description ? <p className="mt-2 text-sm text-rose-600">{errors.description}</p> : null}
        </div>

        <div className="flex items-center justify-between gap-4">
          <p className="text-sm leading-6 text-slate-500">
            New tasks appear instantly and the queue stays capped at the latest five incomplete items.
          </p>
          <button
            type="submit"
            disabled={isSubmitting}
            className="inline-flex min-w-36 items-center justify-center rounded-full bg-slate-950 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-400"
          >
            {isSubmitting ? 'Saving...' : 'Add task'}
          </button>
        </div>
      </div>
    </form>
  );
}

