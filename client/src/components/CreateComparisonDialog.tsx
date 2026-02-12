import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertComparisonSchema, type InsertComparison } from "@shared/schema";
import { useCreateComparison } from "@/hooks/use-comparisons";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { Plus } from "lucide-react";

export function CreateComparisonDialog() {
  const [open, setOpen] = useState(false);
  const createComparison = useCreateComparison();

  const form = useForm<InsertComparison>({
    resolver: zodResolver(insertComparisonSchema),
    defaultValues: {
      name: "",
    },
  });

  const onSubmit = (data: InsertComparison) => {
    createComparison.mutate(data, {
      onSuccess: () => {
        setOpen(false);
        form.reset();
      },
    });
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button className="gap-2 bg-primary hover:bg-primary/90 rounded-xl px-6 py-6 shadow-lg shadow-primary/20 transition-all hover:-translate-y-0.5">
          <Plus className="w-5 h-5" /> Create Comparison
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md rounded-2xl border-none shadow-2xl">
        <DialogHeader>
          <DialogTitle className="text-2xl font-display font-bold">New Comparison</DialogTitle>
          <DialogDescription>
            Give your comparison a name (e.g., "Olive Oil" or "Laundry Detergent").
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6 pt-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="font-semibold text-slate-700">Name</FormLabel>
                  <FormControl>
                    <Input placeholder="e.g. Greek Yogurt Brands" className="input-field" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-3">
              <Button type="button" variant="ghost" onClick={() => setOpen(false)} className="rounded-xl">
                Cancel
              </Button>
              <Button 
                type="submit" 
                disabled={createComparison.isPending}
                className="bg-primary hover:bg-primary/90 rounded-xl px-6"
              >
                {createComparison.isPending ? "Creating..." : "Start Comparing"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
