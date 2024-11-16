export const STATUS = {
  ACTIVE: { TEXT: "ACTIVE", COLOR: "cyan" },
  INACTIVE: { TEXT: "INACTIVE", COLOR: "amber" },
  CLOSED: { TEXT: "CLOSED", COLOR: "rose" },
} as const;

export type StatusType = keyof typeof STATUS;
