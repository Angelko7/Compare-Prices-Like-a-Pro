import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { api, buildUrl } from "@shared/routes";
import { type InsertComparison, type InsertItem, type ComparisonWithItems } from "@shared/schema";
import { useToast } from "@/hooks/use-toast";

export function useComparisons() {
  return useQuery({
    queryKey: [api.comparisons.list.path],
    queryFn: async () => {
      const res = await fetch(api.comparisons.list.path);
      if (!res.ok) throw new Error("Failed to fetch comparisons");
      return api.comparisons.list.responses[200].parse(await res.json());
    },
  });
}

export function useComparison(id: number) {
  return useQuery({
    queryKey: [api.comparisons.get.path, id],
    queryFn: async () => {
      const url = buildUrl(api.comparisons.get.path, { id });
      const res = await fetch(url);
      if (res.status === 404) return null;
      if (!res.ok) throw new Error("Failed to fetch comparison");
      return api.comparisons.get.responses[200].parse(await res.json());
    },
    enabled: !isNaN(id),
  });
}

export function useCreateComparison() {
  const queryClient = useQueryClient();
  const { toast } = useToast();
  
  return useMutation({
    mutationFn: async (data: InsertComparison) => {
      const res = await fetch(api.comparisons.create.path, {
        method: api.comparisons.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to create comparison");
      return api.comparisons.create.responses[201].parse(await res.json());
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.comparisons.list.path] });
      toast({ title: "Comparison Created", description: "Start adding items to compare!" });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not create comparison", variant: "destructive" });
    }
  });
}

export function useDeleteComparison() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async (id: number) => {
      const url = buildUrl(api.comparisons.delete.path, { id });
      const res = await fetch(url, { method: api.comparisons.delete.method });
      if (!res.ok) throw new Error("Failed to delete comparison");
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [api.comparisons.list.path] });
      toast({ title: "Deleted", description: "Comparison removed." });
    },
  });
}

export function useCreateItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ comparisonId, ...data }: InsertItem & { comparisonId: number }) => {
      const url = buildUrl(api.items.create.path, { id: comparisonId });
      const res = await fetch(url, {
        method: api.items.create.method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });
      if (!res.ok) throw new Error("Failed to add item");
      return api.items.create.responses[201].parse(await res.json());
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.comparisons.get.path, variables.comparisonId] });
      toast({ title: "Item Added", description: "Comparison updated." });
    },
    onError: () => {
      toast({ title: "Error", description: "Could not add item", variant: "destructive" });
    }
  });
}

export function useDeleteItem() {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: async ({ id, comparisonId }: { id: number, comparisonId: number }) => {
      const url = buildUrl(api.items.delete.path, { id });
      const res = await fetch(url, { method: api.items.delete.method });
      if (!res.ok) throw new Error("Failed to delete item");
    },
    onSuccess: (_, variables) => {
      queryClient.invalidateQueries({ queryKey: [api.comparisons.get.path, variables.comparisonId] });
      toast({ title: "Item Removed", description: "Comparison updated." });
    },
  });
}
