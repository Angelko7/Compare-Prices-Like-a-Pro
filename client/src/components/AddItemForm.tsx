import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { insertItemSchema, type InsertItem } from "@shared/schema";
import { useCreateItem } from "@/hooks/use-comparisons";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { UNITS } from "@/lib/unit-conversion";
import { Loader2, Plus } from "lucide-react";
import { z } from "zod";

interface AddItemFormProps {
  comparisonId: number;
}

// Extend schema to handle string inputs from form that need coercion
const formSchema = insertItemSchema.omit({ comparisonId: true }).extend({
  price: z.coerce.number().min(0.01, "Price must be greater than 0"),
  quantity: z.coerce.number().min(0.01, "Quantity must be greater than 0"),
});

type FormData = z.infer<typeof formSchema>;

export function AddItemForm({ comparisonId }: AddItemFormProps) {
  const createItem = useCreateItem();

  const form = useForm<FormData>({
    resolver: zodResolver(formSchema),
    defaultValues: {
      name: "",
      price: undefined, // Let it be empty initially
      quantity: undefined,
      unit: "oz",
    },
  });

  const onSubmit = (data: FormData) => {
    createItem.mutate({ comparisonId, ...data }, {
      onSuccess: () => {
        form.reset({
          name: "",
          price: undefined,
          quantity: undefined,
          unit: data.unit, // Keep the same unit for convenience
        });
        // Optional: Focus the name input for rapid entry
        const nameInput = document.getElementById("item-name-input");
        nameInput?.focus();
      },
    });
  };

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-100">
      <h3 className="text-lg font-display font-bold text-slate-800 mb-4 flex items-center gap-2">
        <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary">
          <Plus className="w-5 h-5" />
        </div>
        Add New Item
      </h3>
      
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
          
          <div className="md:col-span-4">
            <FormField
              control={form.control}
              name="name"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Product Name</FormLabel>
                  <FormControl>
                    <Input id="item-name-input" placeholder="Brand A Large" className="input-field" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-3">
            <FormField
              control={form.control}
              name="price"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Price ($)</FormLabel>
                  <FormControl>
                    <div className="relative">
                      <span className="absolute left-3 top-3 text-slate-400">$</span>
                      <Input 
                        type="number" 
                        step="0.01" 
                        placeholder="0.00" 
                        className="input-field pl-7" 
                        {...field}
                        value={field.value || ''} // Handle undefined
                      />
                    </div>
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-3 grid grid-cols-2 gap-2">
            <FormField
              control={form.control}
              name="quantity"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Qty</FormLabel>
                  <FormControl>
                    <Input 
                      type="number" 
                      step="0.01" 
                      placeholder="1" 
                      className="input-field" 
                      {...field} 
                      value={field.value || ''}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={form.control}
              name="unit"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Unit</FormLabel>
                  <Select onValueChange={field.onChange} defaultValue={field.value} value={field.value}>
                    <FormControl>
                      <SelectTrigger className="w-full h-[46px] rounded-xl border-slate-200">
                        <SelectValue placeholder="Unit" />
                      </SelectTrigger>
                    </FormControl>
                    <SelectContent>
                      {UNITS.map(u => (
                        <SelectItem key={u.value} value={u.value}>{u.value}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>

          <div className="md:col-span-2 pt-8">
            <Button 
              type="submit" 
              disabled={createItem.isPending} 
              className="w-full h-[46px] rounded-xl bg-slate-900 hover:bg-slate-800 transition-all"
            >
              {createItem.isPending ? <Loader2 className="w-4 h-4 animate-spin" /> : "Add"}
            </Button>
          </div>

        </form>
      </Form>
    </div>
  );
}
