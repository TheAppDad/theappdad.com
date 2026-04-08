import {
  boolean,
  integer,
  pgTable,
  text,
  timestamp,
  uniqueIndex,
  uuid,
} from "drizzle-orm/pg-core";

/** One row per community member; keyed by Clerk `userId`. */
export const profiles = pgTable("profiles", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull().unique(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  onboardingCompletedAt: timestamp("onboarding_completed_at", {
    withTimezone: true,
  }),
  inCollective: boolean("in_collective").notNull().default(false),
  /** Short description of what the member is building (onboarding). */
  buildingSummary: text("building_summary"),
  /** `android` | `ios` | `both` */
  platforms: text("platforms"),
  /** Google account email for Play closed testing; synced from Clerk when linked. */
  googlePlayEmail: text("google_play_email"),
  /** Clerk username or first name — shown on directory / community (no email). */
  displayName: text("display_name"),
  /** Earned via onboarding, CSV exports, follow-ups (see queries). */
  testerScore: integer("tester_score").notNull().default(0),
});

/**
 * One row per CSV download: cooldown, Play follow-up (15 days), optional email reminder.
 */
export const exportAudit = pgTable("export_audit", {
  id: uuid("id").defaultRandom().primaryKey(),
  clerkUserId: text("clerk_user_id").notNull(),
  createdAt: timestamp("created_at", { withTimezone: true })
    .defaultNow()
    .notNull(),
  appName: text("app_name"),
  usernameSnapshot: text("username_snapshot"),
  /** For reminder emails (snapshot at export). */
  exporterEmail: text("exporter_email"),
  /** When we ask: was the app ready for distribution? */
  followupDueAt: timestamp("followup_due_at", { withTimezone: true }),
  /** null = not answered yet; true = ready; false = not ready. */
  distributionReady: boolean("distribution_ready"),
  reminderSentAt: timestamp("reminder_sent_at", { withTimezone: true }),
});

/**
 * Self-reported Play / store status for community pulse (one row per member + app name).
 * status: `in_review` | `distributed`
 */
export const appStoreReports = pgTable(
  "app_store_reports",
  {
    id: uuid("id").defaultRandom().primaryKey(),
    clerkUserId: text("clerk_user_id").notNull(),
    appName: text("app_name").notNull(),
    status: text("status").notNull(),
    updatedAt: timestamp("updated_at", { withTimezone: true })
      .defaultNow()
      .notNull(),
  },
  (table) => ({
    userAppIdx: uniqueIndex("app_store_reports_user_app").on(
      table.clerkUserId,
      table.appName
    ),
  })
);
