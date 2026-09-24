<?php

namespace App\Models\Concerns;

/**
 * Shared by quotations and invoices: `items` is a JSON list of
 * {description, quantity, unit_price}, and the money columns are always
 * recomputed from it on save so the stored totals can't drift.
 */
trait HasLineItems
{
    public static function bootHasLineItems()
    {
        static::saving(function ($model) {
            $items = collect($model->items ?? [])->map(fn ($item) => [
                'description' => (string) ($item['description'] ?? ''),
                'quantity' => (float) ($item['quantity'] ?? 1),
                'unit_price' => (float) ($item['unit_price'] ?? 0),
            ])->values();

            $subtotal = $items->sum(fn ($item) => $item['quantity'] * $item['unit_price']);
            $tax = round($subtotal * ((float) $model->tax_rate) / 100, 2);

            $model->items = $items->all();
            $model->subtotal = round($subtotal, 2);
            $model->tax_amount = $tax;
            $model->total = round($subtotal + $tax, 2);
        });
    }

    /**
     * Next sequential document number for the current year, e.g. INV-2026-0007.
     */
    public static function nextNumber(string $prefix): string
    {
        $base = $prefix.'-'.now()->year.'-';
        $last = static::where('number', 'like', $base.'%')->orderByDesc('number')->value('number');
        $seq = $last ? ((int) substr($last, strlen($base))) + 1 : 1;

        return $base.str_pad((string) $seq, 4, '0', STR_PAD_LEFT);
    }
}
