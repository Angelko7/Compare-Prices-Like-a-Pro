import { useParams, Link } from "wouter";
import { useComparison, useDeleteItem } from "@/hooks/use-comparisons";
import { AddItemForm } from "@/components/AddItemForm";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { ArrowLeft, Trash2, Trophy, Scale, DollarSign } from "lucide-react";
import { normalizePrice, formatUnitPrice, formatBestValue, getUnitType } from "@/lib/unit-conversion";
import { useMemo } from "react";
import clsx from "clsx";
import { motion, AnimatePresence } from "framer-motion";

export default function ComparisonDetail() {
  const { id } = useParams<{ id: string }>();
  const comparisonId = parseInt(id);
  const { data: comparison, isLoading, error } = useComparison(comparisonId);
  const deleteItem = useDeleteItem();

  // Logic to find best value item
  const itemsWithScores = useMemo(() => {
    if (!comparison?.items || comparison.items.length === 0) return [];

    return comparison.items.map(item => {
      const normalizedCost = normalizePrice(item.price, item.quantity, item.unit);
      return {
        ...item,
        normalizedCost,
      };
    }).sort((a, b) => a.normalizedCost - b.normalizedCost); // Lowest cost first
  }, [comparison?.items]);

  const bestItem = itemsWithScores[0];
  const unitType = bestItem ? getUnitType(bestItem.unit) : null;

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-6">
        <Skeleton className="h-8 w-32 rounded-lg" />
        <Skeleton className="h-16 w-full rounded-2xl" />
        <div className="space-y-4">
          <Skeleton className="h-24 w-full rounded-2xl" />
          <Skeleton className="h-24 w-full rounded-2xl" />
        </div>
      </div>
    );
  }

  if (error || !comparison) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-slate-900">Comparison Not Found</h2>
          <Link href="/">
            <Button variant="outline">Go Home</Button>
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-20">
      <div className="bg-white border-b border-slate-200 sticky top-0 z-10 backdrop-blur-md bg-white/80">
        <div className="max-w-4xl mx-auto px-4 md:px-8 py-4 flex items-center gap-4">
          <Link href="/">
            <Button variant="ghost" size="icon" className="rounded-full hover:bg-slate-100 -ml-2">
              <ArrowLeft className="w-5 h-5 text-slate-600" />
            </Button>
          </Link>
          <div>
            <h1 className="text-xl md:text-2xl font-display font-bold text-slate-900 truncate">
              {comparison.name}
            </h1>
            <p className="text-sm text-slate-500 font-medium">
              {itemsWithScores.length} items compared
            </p>
          </div>
        </div>
      </div>

      <div className="max-w-4xl mx-auto p-4 md:p-8 space-y-8">
        
        {/* Add Form */}
        <AddItemForm comparisonId={comparisonId} />

        {/* Results */}
        <div className="space-y-4">
          {itemsWithScores.length === 0 ? (
            <div className="text-center py-12 px-4 rounded-3xl bg-white border border-dashed border-slate-300">
              <Scale className="w-12 h-12 text-slate-300 mx-auto mb-3" />
              <p className="text-slate-500 font-medium">No items yet. Add your first item above!</p>
            </div>
          ) : (
            <div className="grid gap-4">
              <AnimatePresence>
                {itemsWithScores.map((item, index) => {
                  const isBest = index === 0;
                  const percentCheaper = !isBest && bestItem.normalizedCost > 0
                    ? ((item.normalizedCost - bestItem.normalizedCost) / bestItem.normalizedCost) * 100
                    : 0;

                  return (
                    <motion.div
                      key={item.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      layout
                    >
                      <Card className={clsx(
                        "overflow-hidden transition-all duration-300 border-0 shadow-sm hover:shadow-md",
                        isBest ? "ring-2 ring-emerald-500 bg-emerald-50/30" : "bg-white"
                      )}>
                        <div className="p-4 md:p-6 flex items-center justify-between gap-4">
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className="font-bold text-slate-900 text-lg truncate">{item.name}</h3>
                              {isBest && (
                                <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-xs font-bold bg-emerald-100 text-emerald-700 border border-emerald-200">
                                  <Trophy className="w-3 h-3" /> Best Value
                                </span>
                              )}
                            </div>
                            
                            <div className="flex items-baseline gap-3 text-sm">
                              <span className="font-mono font-medium text-slate-600 bg-slate-100 px-2 py-0.5 rounded-md">
                                ${item.price.toFixed(2)}
                              </span>
                              <span className="text-slate-400">•</span>
                              <span className="text-slate-600">
                                {item.quantity} {item.unit}
                              </span>
                            </div>
                          </div>

                          <div className="text-right">
                            <div className="text-lg md:text-xl font-bold font-display text-slate-900">
                              {formatUnitPrice(item.price, item.quantity, item.unit)}
                            </div>
                            
                            <div className="text-xs font-medium mt-1">
                              {isBest ? (
                                <span className="text-emerald-600">Lowest unit price</span>
                              ) : (
                                <span className="text-rose-500">
                                  +{percentCheaper.toFixed(0)}% more expensive
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="pl-2 border-l border-slate-100 ml-2">
                            <Button
                              variant="ghost"
                              size="icon"
                              className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full"
                              onClick={() => deleteItem.mutate({ id: item.id, comparisonId })}
                            >
                              <Trash2 className="w-4 h-4" />
                            </Button>
                          </div>
                        </div>
                        
                        {/* Comparison breakdown footer */}
                        <div className={clsx(
                          "px-4 md:px-6 py-2 text-xs font-medium flex justify-between items-center",
                          isBest ? "bg-emerald-100/50 text-emerald-800" : "bg-slate-50 text-slate-500"
                        )}>
                          <span>Standardized Cost:</span>
                          <span className="font-mono">
                            {formatBestValue(item.price, item.quantity, item.unit)}
                          </span>
                        </div>
                      </Card>
                    </motion.div>
                  );
                })}
              </AnimatePresence>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
