"use client";

import { useState, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { toast } from "sonner";

interface Category {
  id: string;
  name: string;
  icon: string;
  color: string;
}

interface ExpenseFormProps {
  categories: Category[];
  onSuccess: () => void;
  editExpense?: {
    id: string;
    amount: number;
    description: string | null;
    categoryId: string;
    date: string;
    receiptUrl: string | null;
  };
  trigger?: React.ReactNode;
}

export function ExpenseForm({ categories, onSuccess, editExpense, trigger }: ExpenseFormProps) {
  const [open, setOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [amount, setAmount] = useState(editExpense?.amount?.toString() || "");
  const [description, setDescription] = useState(editExpense?.description || "");
  const [categoryId, setCategoryId] = useState(editExpense?.categoryId || "");
  const [date, setDate] = useState<Date>(editExpense?.date ? new Date(editExpense.date) : new Date());
  const [receiptUrl, setReceiptUrl] = useState(editExpense?.receiptUrl || "");
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setIsUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    try {
      const res = await fetch("/api/upload", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Upload failed");
      }

      const data = await res.json();
      setReceiptUrl(data.url);
      toast.success("Receipt uploaded!");
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to upload receipt");
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const url = editExpense ? `/api/expenses/${editExpense.id}` : "/api/expenses";
      const method = editExpense ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          amount: parseFloat(amount),
          description: description || null,
          categoryId,
          date: date.toISOString(),
          receiptUrl: receiptUrl || null,
        }),
      });

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || "Failed to save expense");
      }

      toast.success(editExpense ? "Expense updated!" : "Expense added!");
      setOpen(false);
      resetForm();
      onSuccess();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Failed to save expense");
    } finally {
      setIsLoading(false);
    }
  };

  const resetForm = () => {
    if (!editExpense) {
      setAmount("");
      setDescription("");
      setCategoryId("");
      setDate(new Date());
      setReceiptUrl("");
    }
  };

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button data-design-id="add-expense-btn" className="gradient-primary text-white shadow-lg shadow-emerald-500/30 hover:shadow-emerald-500/50 transition-all">
            <span className="mr-2">+</span> Add Expense
          </Button>
        )}
      </DialogTrigger>
      <DialogContent data-design-id="expense-form-dialog" className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle data-design-id="expense-form-title">{editExpense ? "Edit Expense" : "Add New Expense"}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4 mt-4">
          <div data-design-id="expense-amount-field" className="space-y-2">
            <Label htmlFor="amount">Amount</Label>
            <div className="relative">
              <span className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground">$</span>
              <Input
                id="amount"
                type="number"
                step="0.01"
                min="0"
                placeholder="0.00"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                required
                className="pl-8 h-11 text-lg font-medium"
              />
            </div>
          </div>

          <div data-design-id="expense-category-field" className="space-y-2">
            <Label>Category</Label>
            <Select value={categoryId} onValueChange={setCategoryId} required>
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Select category" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat.id} value={cat.id}>
                    <span className="flex items-center gap-2">
                      <span>{cat.icon}</span>
                      <span>{cat.name}</span>
                    </span>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div data-design-id="expense-date-field" className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full h-11 justify-start text-left font-normal"
                >
                  <span className="mr-2">📅</span>
                  {format(date, "PPP")}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="start">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(d) => d && setDate(d)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>

          <div data-design-id="expense-description-field" className="space-y-2">
            <Label htmlFor="description">Description (optional)</Label>
            <Input
              id="description"
              placeholder="What was this for?"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="h-11"
            />
          </div>

          <div data-design-id="expense-receipt-field" className="space-y-2">
            <Label>Receipt Photo</Label>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              onChange={handleFileUpload}
              className="hidden"
            />
            {receiptUrl ? (
              <div className="relative">
                <img
                  src={receiptUrl}
                  alt="Receipt"
                  className="w-full h-32 object-cover rounded-lg border"
                />
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute top-2 right-2"
                  onClick={() => setReceiptUrl("")}
                >
                  Remove
                </Button>
              </div>
            ) : (
              <Button
                type="button"
                variant="outline"
                className="w-full h-20 border-dashed"
                onClick={() => fileInputRef.current?.click()}
                disabled={isUploading}
              >
                {isUploading ? (
                  <span className="flex items-center gap-2">
                    <span className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    Uploading...
                  </span>
                ) : (
                  <span className="flex flex-col items-center gap-1">
                    <span className="text-2xl">📷</span>
                    <span className="text-sm text-muted-foreground">Click to upload receipt</span>
                  </span>
                )}
              </Button>
            )}
          </div>

          <div className="flex gap-3 pt-4">
            <Button
              type="button"
              variant="outline"
              className="flex-1"
              onClick={() => setOpen(false)}
            >
              Cancel
            </Button>
            <Button
              data-design-id="expense-submit-btn"
              type="submit"
              className="flex-1 gradient-primary text-white"
              disabled={isLoading || !amount || !categoryId}
            >
              {isLoading ? "Saving..." : editExpense ? "Update" : "Add Expense"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}