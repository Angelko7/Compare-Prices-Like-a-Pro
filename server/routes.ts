import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertComparisonSchema, insertItemSchema } from "@shared/schema";

export async function registerRoutes(
  httpServer: Server,
  app: Express
): Promise<Server> {

  app.get('/api/comparisons', async (req, res) => {
    const result = await storage.getComparisons();
    res.json(result);
  });

  app.post('/api/comparisons', async (req, res) => {
    const parsed = insertComparisonSchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input" });
    }
    const result = await storage.createComparison(parsed.data);
    res.status(201).json(result);
  });

  app.get('/api/comparisons/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    const result = await storage.getComparison(id);
    if (!result) return res.status(404).json({ message: "Not found" });
    res.json(result);
  });

  app.delete('/api/comparisons/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteComparison(id);
    res.status(204).send();
  });

  app.post('/api/comparisons/:id/items', async (req, res) => {
    const comparisonId = parseInt(req.params.id);
    if (isNaN(comparisonId)) return res.status(400).json({ message: "Invalid ID" });
    
    const parsed = insertItemSchema.omit({ comparisonId: true }).safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ message: "Invalid input" });
    }
    
    const result = await storage.createItem({ ...parsed.data, comparisonId });
    res.status(201).json(result);
  });

  app.delete('/api/items/:id', async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) return res.status(400).json({ message: "Invalid ID" });
    await storage.deleteItem(id);
    res.status(204).send();
  });

  // Seed data if empty
  const existing = await storage.getComparisons();
  if (existing.length === 0) {
    const c1 = await storage.createComparison({ name: "Milk Options" });
    await storage.createItem({ comparisonId: c1.id, name: "Brand A", price: 3.99, quantity: 1, unit: "gal" });
    await storage.createItem({ comparisonId: c1.id, name: "Brand B", price: 2.49, quantity: 0.5, unit: "gal" });
    
    const c2 = await storage.createComparison({ name: "Cereal" });
    await storage.createItem({ comparisonId: c2.id, name: "Family Size", price: 5.99, quantity: 24, unit: "oz" });
    await storage.createItem({ comparisonId: c2.id, name: "Regular", price: 3.99, quantity: 12, unit: "oz" });
  }

  return httpServer;
}
