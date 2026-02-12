import {
  comparisons, items,
  type Comparison, type InsertComparison,
  type Item, type InsertItem,
  type ComparisonWithItems
} from "@shared/schema";
import { db } from "./db";
import { eq, desc } from "drizzle-orm";

export interface IStorage {
  getComparisons(): Promise<ComparisonWithItems[]>;
  getComparison(id: number): Promise<ComparisonWithItems | undefined>;
  createComparison(comparison: InsertComparison): Promise<Comparison>;
  deleteComparison(id: number): Promise<void>;
  createItem(item: InsertItem): Promise<Item>;
  deleteItem(id: number): Promise<void>;
}

export class DatabaseStorage implements IStorage {
  async getComparisons(): Promise<ComparisonWithItems[]> {
    const rows = await db.query.comparisons.findMany({
      with: { items: true },
      orderBy: [desc(comparisons.createdAt)],
    });
    return rows;
  }

  async getComparison(id: number): Promise<ComparisonWithItems | undefined> {
    return await db.query.comparisons.findFirst({
      where: eq(comparisons.id, id),
      with: { items: true },
    });
  }

  async createComparison(insertComparison: InsertComparison): Promise<Comparison> {
    const [newComparison] = await db.insert(comparisons).values(insertComparison).returning();
    return newComparison;
  }

  async deleteComparison(id: number): Promise<void> {
    await db.delete(items).where(eq(items.comparisonId, id));
    await db.delete(comparisons).where(eq(comparisons.id, id));
  }

  async createItem(insertItem: InsertItem): Promise<Item> {
    const [newItem] = await db.insert(items).values(insertItem).returning();
    return newItem;
  }

  async deleteItem(id: number): Promise<void> {
    await db.delete(items).where(eq(items.id, id));
  }
}

export const storage = new DatabaseStorage();
