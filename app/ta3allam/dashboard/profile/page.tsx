import { backendCopy } from "@platform/data/backend-copy";
import { interfaceCopy } from "@platform/data/interface-copy";
import PageHeading from "@platform/components/ui/page-heading";
import ProfileForm from "@platform/components/account/profile-form";
import { readStudentState } from "@platform/features/learning";
import { copy } from "@platform/data/site";
export const metadata = { title: interfaceCopy.profilePageTitle };
export default async function ProfilePage() {
  const state = await readStudentState();
  return (
    <>
      <PageHeading
        eyebrow={backendCopy.ACCOUNT_LABEL}
        title={copy.profileTitle}
        description={copy.profileDescription}
      />
      <section className="lms-profile-card">
        <div className="lms-profile-card-heading">
          <span className="lms-avatar lms-avatar-large">
            {state.profile.name.slice(0, 1)}
          </span>
          <div>
            <h2>{state.profile.name}</h2>
            <span className="lms-demo-label">{backendCopy.ACCOUNT_LABEL}</span>
          </div>
        </div>
        <ProfileForm
          emailPendingMessage={backendCopy.EMAIL_CHANGE_PENDING}
          interfaceCopy={{ namePlaceholder: interfaceCopy.namePlaceholder }}
          copy={{
            error: copy.error,
            name: copy.name,
            email: copy.email,
            emailPlaceholder: copy.emailPlaceholder,
            saving: copy.saving,
            enterDemo: copy.enterDemo,
            save: copy.save,
            profileSaved: copy.profileSaved,
          }}
          profile={state.profile}
        />
        
      </section>
    </>
  );
}
