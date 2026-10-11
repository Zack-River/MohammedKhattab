export default function FormFeedback({ error, message }: { error?: string; message?: string }) {
  return <>{error && <p className="lms-error" role="alert">{error}</p>}{message && <p className="lms-success" role="status">{message}</p>}</>;
}
