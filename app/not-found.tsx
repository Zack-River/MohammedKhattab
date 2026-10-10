import { routes } from "@platform/config/navigation";
import { site } from "@platform/data/site";
import { interfaceCopy } from "@platform/data/interface-copy";
import Link from "next/link";
import Brand from "@platform/components/layout/brand";
export default function NotFound() {
  return (
    <main className="container lms-not-found">
      <Brand site={{ name: site.name, englishName: site.englishName }} />
      <span className="lms-small-label numeral">404</span>
      <h1>
        {interfaceCopy.notFoundTitle}
        <br />
        {interfaceCopy.notFoundSupport}
      </h1>
      <p>{interfaceCopy.notFoundDescription}</p>
      <Link href={routes.courses} className="btn-primary">
        {interfaceCopy.notFoundAction}
      </Link>
    </main>
  );
}
