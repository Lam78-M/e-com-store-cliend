import { toast } from "react-hot-toast";

const toastOptions = {
  duration: 4000,
  style: {
    background: "var(--c-teal)",
    border: "1px solid var(--c-caramel)",
    borderRadius: "14px",
    boxShadow: "0 12px 30px rgba(58, 26, 20, 0.2)",
    color: "var(--c-paper)",
  },
  iconTheme: {
    primary: "var(--c-caramel)",
    secondary: "var(--c-teal)",
  },
};

export function showAuthSuccess(message) {
  toast.success(message, toastOptions);
}

export function showAuthError(message) {
  toast.error(message, toastOptions);
}
