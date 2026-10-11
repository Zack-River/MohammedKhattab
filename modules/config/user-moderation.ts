export const suspensionPeriods = [
  { id: "day", hours: 24, label: "يوم واحد" },
  { id: "week", hours: 168, label: "أسبوع" },
  { id: "month", hours: 720, label: "شهر (٣٠ يومًا)" },
  { id: "year", hours: 8760, label: "سنة (٣٦٥ يومًا)" },
] as const;
export const userAdministration = { pageSize: 20, permanentBanHours: 876000, refreshMs: 60000 } as const;
