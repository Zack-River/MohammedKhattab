import AuthPage from "@platform/components/account/auth/page";
import { authPages } from "@platform/data/auth";
export const metadata = { title: authPages.login.title };
export default function LoginPage() { return <AuthPage model={authPages.login} />; }
