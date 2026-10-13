import {recordPolicy} from "./records";
export const materialPolicy = {pageSize:recordPolicy.pageSize,titleMax:160,descriptionMax:500,typeMax:40,contentMax:2000,assignmentsMax:50,kinds:["text","link"]} as const;
export const notePolicy = {textMax:4000} as const;
export const activityEntities = ["courses","lessons","resources","lesson_resources","live_sessions","workshop_templates","commerce_bundles","commerce_discounts","admin_users"] as const;
