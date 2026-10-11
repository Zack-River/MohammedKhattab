import Link from "next/link";
import AuthForm from "./form";
import type { AuthPageModel } from "@platform/types/auth";
export default function AuthPage({ model }: { model: AuthPageModel }) {
  return <main className="container lms-login-page">
    <div className="lms-login-message" data-reveal>
      <h1>{model.heading}<br /><span className="text-red">{model.highlight}</span></h1>
      <p className="body-large">{model.support}</p>
      <div className="lms-login-steps">{model.steps.map((step) => <span key={step}>{step}</span>)}</div>
    </div>
    <section data-reveal className="lms-login-card lms-auth-card" aria-labelledby={`${model.mode}-title`}>
      <span className="lms-demo-label">{model.demoLabel}</span>
      <h2 id={`${model.mode}-title`}>{model.title}</h2>
      <p>{model.description}</p>
      <AuthForm model={model} />
      {model.recovery && <Link className="lms-text-link" href={model.recovery.href}>{model.recovery.label}</Link>}
      <div className="lms-auth-alternate"><span>{model.alternate.prompt}</span><Link href={model.alternate.href}>{model.alternate.label}</Link></div>
      {model.confirmationLink && <Link className="lms-text-link" href={model.confirmationLink.href}>{model.confirmationLink.label}</Link>}
      <small>{model.demoNote}</small>
    </section>
  </main>;
}
