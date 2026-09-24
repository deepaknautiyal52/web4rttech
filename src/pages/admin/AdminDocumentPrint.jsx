import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useApi } from './api';
import COMPANY from './companyInfo';
import { INVOICE_STATUS, QUOTATION_STATUS, formatDate } from './moduleMeta';
import './AdminDocumentPrint.css';

const money = (amount, currency) =>
  `${currency === 'USD' ? '$' : '₹'}${(Number(amount) || 0).toLocaleString('en-IN', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`;

// Printable invoice / quotation. Opens in its own tab without the admin
// chrome; the browser's "Save as PDF" produces the PDF.
const AdminDocumentPrint = () => {
  const { kind, id } = useParams();
  const request = useApi();
  const [doc, setDoc] = useState(null);
  const [error, setError] = useState('');
  const isInvoice = kind === 'invoice';

  useEffect(() => {
    request(`/${isInvoice ? 'invoices' : 'quotations'}/${id}`)
      .then(setDoc)
      .catch((err) => setError(err.message));
  }, [id, isInvoice, request]);

  useEffect(() => {
    if (doc) document.title = `${doc.number} - ${COMPANY.name}`;
  }, [doc]);

  if (error) return <div className="print-page"><p>{error}</p></div>;
  if (!doc) return <div className="print-page"><p>Loading...</p></div>;

  const party = doc.client || doc.contact;
  const status = isInvoice ? INVOICE_STATUS[doc.display_status] : QUOTATION_STATUS[doc.status];
  const bank = COMPANY.bank;
  const hasBank = Object.values(bank).some(Boolean);

  return (
    <div className="print-page">
      <div className="print-toolbar">
        <button type="button" onClick={() => window.print()}>🖨️ Print / Save as PDF</button>
        <button type="button" onClick={() => window.close()}>Close</button>
      </div>

      <div className="print-doc">
        <header className="print-header">
          <div>
            <div className="print-brand">
              Web<span>4</span>rtTech
            </div>
            <div className="print-muted">{COMPANY.tagline}</div>
            {COMPANY.address && <div className="print-muted print-pre">{COMPANY.address}</div>}
            <div className="print-muted">
              {COMPANY.email} · {COMPANY.phone} · {COMPANY.website}
            </div>
            {COMPANY.gstin && <div className="print-muted">GSTIN: {COMPANY.gstin}</div>}
          </div>
          <div className="print-title">
            <h1>{isInvoice ? (Number(doc.tax_rate) > 0 ? 'TAX INVOICE' : 'INVOICE') : 'QUOTATION'}</h1>
            <div className="print-number">{doc.number}</div>
            {status && (
              <div className="print-status" style={{ color: status.color, borderColor: status.color }}>
                {status.label}
              </div>
            )}
          </div>
        </header>

        <section className="print-meta">
          <div>
            <div className="print-label">{isInvoice ? 'Bill to' : 'Prepared for'}</div>
            {party ? (
              <>
                <strong>{party.company || party.name}</strong>
                {party.company && <div>{party.name}</div>}
                {party.billing_address && <div className="print-pre">{party.billing_address}</div>}
                {party.email && <div>{party.email}</div>}
                {party.phone && <div>{party.phone}</div>}
                {party.gst_number && <div>GSTIN: {party.gst_number}</div>}
              </>
            ) : (
              <div>—</div>
            )}
          </div>
          <div className="print-dates">
            <div><span className="print-label">Date</span> {formatDate(doc.issue_date)}</div>
            {isInvoice && doc.due_date && <div><span className="print-label">Due</span> {formatDate(doc.due_date)}</div>}
            {!isInvoice && doc.valid_until && <div><span className="print-label">Valid until</span> {formatDate(doc.valid_until)}</div>}
            {isInvoice && doc.project && <div><span className="print-label">Project</span> {doc.project.name}</div>}
            {!isInvoice && <div><span className="print-label">Subject</span> {doc.title}</div>}
          </div>
        </section>

        <table className="print-items">
          <thead>
            <tr>
              <th>#</th>
              <th>Description</th>
              <th className="num">Qty</th>
              <th className="num">Rate</th>
              <th className="num">Amount</th>
            </tr>
          </thead>
          <tbody>
            {doc.items.map((item, i) => (
              <tr key={i}>
                <td>{i + 1}</td>
                <td>{item.description}</td>
                <td className="num">{item.quantity}</td>
                <td className="num">{money(item.unit_price, doc.currency)}</td>
                <td className="num">{money(item.quantity * item.unit_price, doc.currency)}</td>
              </tr>
            ))}
          </tbody>
        </table>

        <div className="print-totals">
          <div><span>Subtotal</span><span>{money(doc.subtotal, doc.currency)}</span></div>
          {Number(doc.tax_rate) > 0 && (
            <div><span>GST @ {Number(doc.tax_rate)}%</span><span>{money(doc.tax_amount, doc.currency)}</span></div>
          )}
          <div className="print-grand"><span>Total</span><span>{money(doc.total, doc.currency)}</span></div>
          {isInvoice && Number(doc.amount_paid) > 0 && (
            <>
              <div><span>Paid</span><span>-{money(doc.amount_paid, doc.currency)}</span></div>
              <div className="print-grand"><span>Balance due</span><span>{money(doc.balance, doc.currency)}</span></div>
            </>
          )}
        </div>

        {doc.notes && (
          <section className="print-notes">
            <div className="print-label">{isInvoice ? 'Notes' : 'Terms & notes'}</div>
            <p className="print-pre">{doc.notes}</p>
          </section>
        )}

        {isInvoice && hasBank && (
          <section className="print-notes">
            <div className="print-label">Payment details</div>
            {bank.accountName && <div>Account name: {bank.accountName}</div>}
            {bank.accountNumber && <div>Account no.: {bank.accountNumber}</div>}
            {bank.ifsc && <div>IFSC: {bank.ifsc}</div>}
            {bank.bankName && <div>Bank: {bank.bankName}</div>}
            {bank.upi && <div>UPI: {bank.upi}</div>}
          </section>
        )}

        <footer className="print-footer">Thank you for your business. · {COMPANY.website}</footer>
      </div>
    </div>
  );
};

export default AdminDocumentPrint;
