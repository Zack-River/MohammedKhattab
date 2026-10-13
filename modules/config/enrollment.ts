export const enrollmentPolicy = { reasonMax: 500, actions: ["grant", "revoke", "restore"], historyLimit: 5, maxDays:3650 } as const;
export const accessDurations=[{value:"lifetime",label:"مدى الحياة"},{value:"1",label:"يوم واحد"},{value:"7",label:"أسبوع"},{value:"30",label:"٣٠ يومًا"},{value:"365",label:"سنة"},{value:"custom",label:"مدة مخصصة بالأيام"}] as const;
