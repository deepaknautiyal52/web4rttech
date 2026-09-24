import React, { useState } from 'react';
import services from '../../../data/services';
import { formatMoney } from '../financeMeta';

// Parses "₹41,500" / "$500" from services.js pricing; "Custom Quote" -> 0.
const parsePrice = (label) => {
  const n = parseFloat(String(label || '').replace(/[^0-9.]/g, ''));
  return Number.isFinite(n) ? n : 0;
};

const packages = services
  .filter((s) => Array.isArray(s.pricing))
  .flatMap((s) =>
    s.pricing.map((tier) => ({
      key: `${s.id}:${tier.name}`,
      label: `${s.title}: ${tier.name}`,
      description: `${s.title}: ${tier.name} package (${tier.features.slice(0, 3).join(', ')})`,
      INR: parsePrice(tier.priceINR),
      USD: parsePrice(tier.priceUSD)
    }))
  );

export const emptyItem = () => ({ description: '', quantity: 1, unit_price: '' });

export const itemsTotals = (items, taxRate) => {
  const subtotal = (items || []).reduce(
    (sum, item) => sum + (parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0),
    0
  );
  const tax = Math.round(subtotal * (parseFloat(taxRate) || 0)) / 100;
  return { subtotal, tax, total: subtotal + tax };
};

// Editable table of {description, quantity, unit_price} rows, with a
// picker that inserts a package straight from the public pricing guide.
const LineItemsEditor = ({ items, onChange, currency = 'INR', taxRate = 0, errors = {} }) => {
  const [pkg, setPkg] = useState('');

  const update = (index, field, value) => {
    onChange(items.map((item, i) => (i === index ? { ...item, [field]: value } : item)));
  };

  const addPackage = () => {
    const p = packages.find((x) => x.key === pkg);
    if (!p) return;
    const row = { description: p.description, quantity: 1, unit_price: p[currency] || '' };
    const blank = items.length === 1 && !items[0].description && !items[0].unit_price;
    onChange(blank ? [row] : [...items, row]);
    setPkg('');
  };

  const { subtotal, tax, total } = itemsTotals(items, taxRate);

  return (
    <div className="line-items">
      <div className="line-items-package">
        <select value={pkg} onChange={(e) => setPkg(e.target.value)}>
          <option value="">Add a package from the pricing guide...</option>
          {packages.map((p) => (
            <option key={p.key} value={p.key}>
              {p.label}
              {p[currency] ? ` (${formatMoney(p[currency], currency)})` : ' (custom quote)'}
            </option>
          ))}
        </select>
        <button type="button" className="admin-secondary-btn" onClick={addPackage} disabled={!pkg}>
          Add
        </button>
      </div>

      <table className="line-items-table">
        <thead>
          <tr>
            <th>Description</th>
            <th style={{ width: 90 }}>Qty</th>
            <th style={{ width: 140 }}>Unit price</th>
            <th style={{ width: 130 }}>Amount</th>
            <th style={{ width: 40 }}></th>
          </tr>
        </thead>
        <tbody>
          {items.map((item, i) => (
            <tr key={i}>
              <td>
                <input
                  type="text"
                  value={item.description}
                  onChange={(e) => update(i, 'description', e.target.value)}
                  placeholder="e.g. Business website (12 pages)"
                />
                {errors[`items.${i}.description`] && (
                  <span className="field-error">{errors[`items.${i}.description`][0]}</span>
                )}
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.quantity}
                  onChange={(e) => update(i, 'quantity', e.target.value)}
                />
              </td>
              <td>
                <input
                  type="number"
                  min="0"
                  step="0.01"
                  value={item.unit_price}
                  onChange={(e) => update(i, 'unit_price', e.target.value)}
                />
                {errors[`items.${i}.unit_price`] && (
                  <span className="field-error">{errors[`items.${i}.unit_price`][0]}</span>
                )}
              </td>
              <td className="line-items-amount">
                {formatMoney((parseFloat(item.quantity) || 0) * (parseFloat(item.unit_price) || 0), currency)}
              </td>
              <td>
                <button
                  type="button"
                  className="line-items-remove"
                  onClick={() => onChange(items.filter((_, idx) => idx !== i))}
                  disabled={items.length === 1}
                  title="Remove line"
                >
                  ×
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <button type="button" className="admin-link-btn" onClick={() => onChange([...items, emptyItem()])}>
        + Add line
      </button>

      <div className="line-items-totals">
        <span>Subtotal</span>
        <strong>{formatMoney(subtotal, currency)}</strong>
        <span>GST / tax ({parseFloat(taxRate) || 0}%)</span>
        <strong>{formatMoney(tax, currency)}</strong>
        <span>Total</span>
        <strong className="line-items-grand">{formatMoney(total, currency)}</strong>
      </div>
    </div>
  );
};

export default LineItemsEditor;
