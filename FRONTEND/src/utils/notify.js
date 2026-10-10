import { toast } from "react-toastify";

// Single place that turns any error into a user-facing message.
export function getErrorMessage(error, fallback = "Something went wrong. Please try again.") {
  if (!error) return fallback;
  if (typeof error === "string") return error;
  if (error.response) return error.response.data?.message || fallback; // server answered
  if (error.request) return "Can't reach the server. Check your connection and try again."; // no answer
  return error.message || fallback;
}

// The only way the app should show an error. Identical messages are de-duplicated
// (toastId = message), so two parallel failing requests don't stack two toasts.
export function notifyError(error, fallback) {
  const message = getErrorMessage(error, fallback);
  toast.error(message, { toastId: message });
  return message;
}

export function notifySuccess(message) {
  toast.success(message, { toastId: message });
}