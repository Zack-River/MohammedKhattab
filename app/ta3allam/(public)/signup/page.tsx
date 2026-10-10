import AuthPage from "@platform/components/account/auth/page";
import { authPages } from "@platform/data/auth";
export const metadata = { title: authPages.signup.title };
export default function SignupPage() { return <AuthPage model={authPages.signup} />; }
