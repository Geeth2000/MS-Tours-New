import { useState, useCallback, createContext, useContext } from "react";

const ConfirmContext = createContext(null);

export const ConfirmProvider = ({ children }) => {
  const [state, setState] = useState({
    isOpen: false,
    title: "",
    message: "",
    confirmText: "Confirm",
    cancelText: "Cancel",
    variant: "danger", // danger, warning, info
    onConfirm: null,
  });

  const confirm = useCallback(
    ({
      title,
      message,
      confirmText = "Confirm",
      cancelText = "Cancel",
      variant = "danger",
    }) => {
      return new Promise((resolve) => {
        setState({
          isOpen: true,
          title,
          message,
          confirmText,
          cancelText,
          variant,
          onConfirm: resolve,
        });
      });
    },
    [],
  );

  const handleConfirm = () => {
    state.onConfirm?.(true);
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const handleCancel = () => {
    state.onConfirm?.(false);
    setState((prev) => ({ ...prev, isOpen: false }));
  };

  const variantStyles = {
    danger: {
      icon: (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-red-100">
          <svg
            className="h-6 w-6 text-red-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m-9.303 3.376c-.866 1.5.217 3.374 1.948 3.374h14.71c1.73 0 2.813-1.874 1.948-3.374L13.949 3.378c-.866-1.5-3.032-1.5-3.898 0L2.697 16.126zM12 15.75h.007v.008H12v-.008z"
            />
          </svg>
        </div>
      ),
      button: "bg-red-600 hover:bg-red-700 focus:ring-red-500",
    },
    warning: {
      icon: (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-amber-100">
          <svg
            className="h-6 w-6 text-amber-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 9v3.75m9-.75a9 9 0 11-18 0 9 9 0 0118 0zm-9 3.75h.008v.008H12v-.008z"
            />
          </svg>
        </div>
      ),
      button: "bg-amber-600 hover:bg-amber-700 focus:ring-amber-500",
    },
    info: {
      icon: (
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-blue-100">
          <svg
            className="h-6 w-6 text-blue-600"
            fill="none"
            viewBox="0 0 24 24"
            strokeWidth="1.5"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 11-18 0 9 9 0 0118 0zm-9 5.25h.008v.008H12v-.008z"
            />
          </svg>
        </div>
      ),
      button: "bg-blue-600 hover:bg-blue-700 focus:ring-blue-500",
    },
  };

  const currentVariant = variantStyles[state.variant] || variantStyles.danger;

  return (
    <ConfirmContext.Provider value={confirm}>
      {children}

      {/* Modal Overlay */}
      {state.isOpen && (
        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            {/* Backdrop */}
            <div
              className="fixed inset-0 bg-slate-900/60 backdrop-blur-sm transition-opacity"
              onClick={handleCancel}
            />

            {/* Modal Panel */}
            <div className="relative transform overflow-hidden rounded-2xl bg-white px-6 pb-6 pt-5 text-left shadow-xl transition-all sm:my-8 sm:w-full sm:max-w-sm sm:p-6">
              {currentVariant.icon}

              <div className="mt-4 text-center">
                <h3 className="text-lg font-semibold leading-6 text-slate-900">
                  {state.title}
                </h3>
                <p className="mt-2 text-sm text-slate-500">{state.message}</p>
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  type="button"
                  className="flex-1 rounded-xl border border-slate-200 bg-white px-4 py-2.5 text-sm font-medium text-slate-700 shadow-sm hover:bg-slate-50 focus:outline-none focus:ring-2 focus:ring-slate-300 focus:ring-offset-2 transition-colors"
                  onClick={handleCancel}
                >
                  {state.cancelText}
                </button>
                <button
                  type="button"
                  className={`flex-1 rounded-xl px-4 py-2.5 text-sm font-medium text-white shadow-sm focus:outline-none focus:ring-2 focus:ring-offset-2 transition-colors ${currentVariant.button}`}
                  onClick={handleConfirm}
                >
                  {state.confirmText}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </ConfirmContext.Provider>
  );
};

export const useConfirm = () => {
  const context = useContext(ConfirmContext);
  if (!context) {
    throw new Error("useConfirm must be used within a ConfirmProvider");
  }
  return context;
};
