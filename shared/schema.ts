import { pgTable, text, serial, integer, boolean, timestamp, real } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";
import { relations } from "drizzle-orm";

export const comparisons = pgTable("comparisons", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

export const items = pgTable("items", {
  id: serial("id").primaryKey(),
  comparisonId: integer("comparison_id").notNull(),
  name: text("name").notNull(),
  price: real("price").notNull(), // USD
  quantity: real("quantity").notNull(),
  unit: text("unit").notNull(), // g, kg, oz, lb, ml, l, fl_oz, gal
});

export const comparisonsRelations = relations(comparisons, ({ many }) => ({
  items: many(items),
}));

export const itemsRelations = relations(items, ({ one }) => ({
  comparison: one(comparisons, {
    fields: [items.comparisonId],
    references: [comparisons.id],
  }),
}));

export const insertComparisonSchema = createInsertSchema(comparisons).omit({ id: true, createdAt: true });
export const insertItemSchema = createInsertSchema(items).omit({ id: true });

export type Comparison = typeof comparisons.$inferSelect;
export type InsertComparison = z.infer<typeof insertComparisonSchema>;
export type Item = typeof items.$inferSelect;
export type InsertItem = z.infer<typeof insertItemSchema>;

export type ComparisonWithItems = Comparison & { items: Item[] };
