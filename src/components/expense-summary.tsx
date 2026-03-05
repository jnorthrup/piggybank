"use client";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";

interface CategorySummary {
  categoryId: number;
  categoryName: string;
  icon: string;
  color: string;
  total: number;
  count: number;
}

interface ExpenseSummaryProps {
  total: number;
  byCategory: CategorySummary[];
  month: number;
  year: number;
  currency?: string;
}

const CURRENCY_SYMBOLS: Record<string, string> = {
  USD: "$",
  IDR: "Rp",
  SGD: "S$",
  EUR: "€",
  AUD: "A$",
};

export function ExpenseSummary({
  total,
  byCategory,
  month,
  year,
  currency = "USD",
}: ExpenseSummaryProps) {
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  const currencySymbol = CURRENCY_SYMBOLS[currency] || currency;
  const maxCategoryTotal = Math.max(...byCategory.map((c) => c.total), 1);

  const formatAmount = (amount: number) => {
    if (currency === "IDR") {
      return `${currencySymbol}${amount.toLocaleString("id-ID", { minimumFractionDigits: 0 })}`;
    }
    return `${currencySymbol}${amount.toFixed(2)}`;
  };

  return (
    <div data-design-id="expense-summary" className="space-y-4">
      <Card
        data-design-id="summary-total-card"
        className="gradient-primary text-white overflow-hidden relative"
      >
        <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHZpZXdCb3g9IjAgMCA2MCA2MCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZyBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPjxnIGZpbGw9IiNmZmYiIGZpbGwtb3BhY2l0eT0iMC4xIj48Y2lyY2xlIGN4PSIzMCIgY3k9IjMwIiByPSI0Ii8+PC9nPjwvZz48L3N2Zz4=')] opacity-30" />
        <CardHeader
          data-design-id="summary-total-header"
          className="pb-2 relative"
        >
          <CardTitle
            data-design-id="summary-total-title"
            className="text-white/80 text-sm font-normal"
          >
            Total Spending in {monthNames[month - 1]} {year}
          </CardTitle>
        </CardHeader>
        <CardContent
          data-design-id="summary-total-content"
          className="relative"
        >
          <div
            data-design-id="summary-total-amount"
            className="text-4xl font-bold tracking-tight"
          >
            {formatAmount(total)}
          </div>
          <div
            data-design-id="summary-total-count"
            className="text-white/70 text-sm mt-1"
          >
            {byCategory.reduce((sum, c) => sum + c.count, 0)} transactions
          </div>
        </CardContent>
      </Card>

      <Card data-design-id="summary-categories-card">
        <CardHeader data-design-id="summary-categories-header" className="pb-3">
          <CardTitle
            data-design-id="summary-categories-title"
            className="text-base font-medium"
          >
            Spending by Category
          </CardTitle>
        </CardHeader>
        <CardContent
          data-design-id="summary-categories-content"
          className="space-y-4"
        >
          {byCategory.length === 0 ? (
            <p
              data-design-id="summary-no-data"
              className="text-sm text-muted-foreground text-center py-4"
            >
              No expenses this month
            </p>
          ) : (
            byCategory.map((cat, index) => (
              <div
                key={cat.categoryId}
                data-design-id={`summary-category-${index}`}
                className="space-y-2"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-lg">{cat.icon}</span>
                    <span className="text-sm font-medium">
                      {cat.categoryName}
                    </span>
                  </div>
                  <div className="text-right">
                    <span className="font-semibold font-mono">
                      {formatAmount(cat.total)}
                    </span>
                    <span className="text-xs text-muted-foreground ml-2">
                      ({((cat.total / total) * 100).toFixed(0)}%)
                    </span>
                  </div>
                </div>
                <Progress
                  value={(cat.total / maxCategoryTotal) * 100}
                  className="h-2"
                  style={{
                    // @ts-expect-error Custom CSS property
                    "--progress-background": cat.color,
                  }}
                />
              </div>
            ))
          )}
        </CardContent>
      </Card>
    </div>
  );
}
