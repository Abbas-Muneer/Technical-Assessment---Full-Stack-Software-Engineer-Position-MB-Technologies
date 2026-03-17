import { useState } from 'react';

export function useToast() {
  const [toast, setToast] = useState(null);

  const showToast = (message, variant = 'success') => {
    setToast({ message, variant });
  };

  const hideToast = () => setToast(null);

  return {
    toast,
    showToast,
    hideToast
  };
}

