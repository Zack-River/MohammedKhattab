import {formatActivityDate} from "@platform/helpers/format-activity-date";
import type {UserSubscription} from "@platform/types/admin-users";
import type {EnrollmentLabels} from "@platform/types/enrollment";
export default function EnrollmentAccessStatus({course,labels}:{course:UserSubscription;labels:EnrollmentLabels}) {
 return <><p>{!course.active?labels.revoked:course.expired?labels.expired:labels.active}</p>
 {course.active&&<p className="lms-field-hint">{course.expiresAt?`${labels.expires} ${formatActivityDate(course.expiresAt)}`:labels.lifetime}</p>}</>;
}
