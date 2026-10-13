import ProgressBar from "@platform/components/ui/progress-bar";
import Link from "next/link";
import PageHeading from "@platform/components/ui/page-heading";
import { routes } from "@platform/config/navigation";
import type { AdminUsersLabels } from "@platform/types/admin-users";
import type { UserSubscription } from "@platform/types/admin-users";
export default function UserSubscriptions({ subscriptions, labels }: { subscriptions: UserSubscription[]; labels: AdminUsersLabels }) {
  return <><PageHeading level={2} title={labels.subscriptions} /><div className="lms-resource-grid">
    {subscriptions.map(course => <section className="lms-resource-card" key={course.slug}>
      <h2><Link href={routes.course(course.slug, course.delivery)} className="lms-text-link">{course.title}</Link></h2>
      {course.total > 0 && <ProgressBar percent={course.percent} count={course.count} total={course.total} copy={{ progress: labels.progress, lessons: labels.lessons }} />}
      <time dateTime={course.enrolledAt}>{course.enrolledAt.slice(0, 10)}</time>
    </section>)}{!subscriptions.length && <p>{labels.noSubscriptions}</p>}
  </div></>;
}
