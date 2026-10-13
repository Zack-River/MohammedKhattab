import {courseAdministration} from "@platform/config/course-administration";
/** Content edits can happen on the same day; retain the exact local time. */
export function formatActivityDate(value:string) {
 return new Intl.DateTimeFormat(courseAdministration.locale,{timeZone:courseAdministration.timezone,year:"numeric",month:"short",day:"numeric",hour:"2-digit",minute:"2-digit",second:"2-digit"}).format(new Date(value));
}
