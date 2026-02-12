import { useComparisons, useDeleteComparison } from "@/hooks/use-comparisons";
import { CreateComparisonDialog } from "@/components/CreateComparisonDialog";
import { Link } from "wouter";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Trash2, ChevronRight, ShoppingBag, Scale } from "lucide-react";
import { format } from "date-fns"; // Standard library for date formatting, assuming it's available or we use native

export default function Home() {
  const { data: comparisons, isLoading } = useComparisons();
  const deleteComparison = useDeleteComparison();

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Hero Section */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 md:px-8 py-12 md:py-20">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-50 text-blue-700 text-sm font-semibold border border-blue-100">
                <Scale className="w-4 h-4" /> Smart Shopper
              </div>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-slate-900 leading-tight">
                Compare Prices <br />
                <span className="text-primary bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                  Like a Pro
                </span>
              </h1>
              <p className="text-lg text-slate-600 max-w-lg">
                Stop guessing which size is the better deal. We calculate the unit price so you can save money on every grocery trip.
              </p>
            </div>
            <CreateComparisonDialog />
          </div>
        </div>
      </div>

      {/* Comparisons List */}
      <div className="max-w-5xl mx-auto px-4 md:px-8 py-12">
        <h2 className="text-2xl font-bold font-display text-slate-900 mb-6 flex items-center gap-2">
          <ShoppingBag className="w-6 h-6 text-primary" />
          Your Comparisons
        </h2>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <Skeleton key={i} className="h-48 rounded-3xl" />
            ))}
          </div>
        ) : comparisons?.length === 0 ? (
          <div className="text-center py-20 px-4 rounded-3xl bg-white border-2 border-dashed border-slate-200">
            <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 text-slate-300">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h3 className="text-xl font-bold text-slate-900 mb-2">No comparisons yet</h3>
            <p className="text-slate-500 max-w-sm mx-auto mb-6">
              Create your first comparison to start tracking prices for items like milk, detergent, or cereal.
            </p>
            <CreateComparisonDialog />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {comparisons?.map((comp) => (
              <Card 
                key={comp.id} 
                className="group relative overflow-hidden rounded-3xl border-slate-200 hover:shadow-xl hover:shadow-slate-200/50 hover:border-primary/50 transition-all duration-300"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-transparent to-slate-50 opacity-0 group-hover:opacity-100 transition-opacity" />
                
                <Link href={`/comparison/${comp.id}`} className="absolute inset-0 z-10" />
                
                <CardHeader className="pb-2 relative z-20">
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-xl font-bold font-display text-slate-900 line-clamp-1">
                      {comp.name}
                    </CardTitle>
                  </div>
                </CardHeader>
                
                <CardContent className="relative z-20">
                  <p className="text-slate-500 text-sm font-medium">
                    {comp.items?.length || 0} items compared
                  </p>
                  <p className="text-xs text-slate-400 mt-4">
                    Created {new Date(comp.createdAt!).toLocaleDateString()}
                  </p>
                </CardContent>
                
                <CardFooter className="pt-2 flex justify-between items-center relative z-20">
                  <span className="text-sm font-semibold text-primary group-hover:underline flex items-center gap-1">
                    View Details <ChevronRight className="w-4 h-4" />
                  </span>
                  
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-full z-30 relative"
                    onClick={(e) => {
                      e.stopPropagation(); // Prevent navigation
                      e.preventDefault();
                      if (confirm("Are you sure you want to delete this comparison?")) {
                        deleteComparison.mutate(comp.id);
                      }
                    }}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
