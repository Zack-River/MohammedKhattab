import Action from "@khatab/design/ui/action";
export default function SaveFeedback({ pending, saved, error, labels }: { pending: boolean; saved: boolean; error: string; labels: { save: string; saving: string; saved: string } }) {
  return <><Action kind="button" type="submit" className="btn-primary" disabled={pending}>{pending ? labels.saving : labels.save}</Action>
    {error && <p className="lms-error" role="alert">{error}</p>}{saved && <p className="lms-success" role="status">{labels.saved}</p>}</>;
}
