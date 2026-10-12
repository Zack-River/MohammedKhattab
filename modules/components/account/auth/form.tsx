"use client";
import { useHydrated } from "@khatab/design/hooks/use-hydrated";
import Action from "@khatab/design/ui/action";
import { authFields } from "@platform/config/auth";
import { useAuthForm } from "@platform/hooks/use-auth-form";
import type { AuthPageModel } from "@platform/types/auth";
import AuthFieldInput from "./field";
export default function AuthForm({ model }: { model: AuthPageModel }) {
  const hydrated = useHydrated();
  const { submit, change, blur, pending, errors, error, confirmation } = useAuthForm(model);
  return <form className="lms-profile-form lms-auth-form" method="post" action={model.endpoint} noValidate onSubmit={submit} onChange={change} onBlur={blur} aria-busy={pending}>
    {authFields[model.mode].map((field) => <AuthFieldInput key={field} field={field} mode={model.mode}
      copy={model.copy} error={errors[field] && model.copy.errors[errors[field]]} disabled={pending} />)}
    <Action kind="button" className="btn-primary" type="submit" disabled={pending || !hydrated}>
      {pending ? model.pending : model.submit}
    </Action>
    {confirmation && <p className="lms-success" role="status">{model.confirmationMessage}</p>}
    {error && <p className="lms-error" role="alert">{error}</p>}
    {pending && <span className="lms-auth-status" role="status">{model.pending}</span>}
  </form>;
}
