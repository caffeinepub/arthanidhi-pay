import type { Transaction } from '../types';

export function exportTransactionsToCSV(transactions: Transaction[], currency: string = 'INR') {
  const headers = ['ID', 'Date', 'Description', 'Type', 'Amount', 'Currency'];
  
  const rows = transactions.map((txn) => {
    const date = new Date(Number(txn.timestamp) / 1000000).toISOString();
    const amount = Number(txn.amount);
    const type = txn.transactionType === 'credit' ? 'Credit' : 'Debit';
    
    return [
      Number(txn.id),
      date,
      `"${txn.description.replace(/"/g, '""')}"`,
      type,
      amount,
      currency,
    ];
  });

  const csvContent = [
    headers.join(','),
    ...rows.map((row) => row.join(',')),
  ].join('\n');

  const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
  const link = document.createElement('a');
  const url = URL.createObjectURL(blob);
  
  link.setAttribute('href', url);
  link.setAttribute('download', `arthanidhi-transactions-${Date.now()}.csv`);
  link.style.visibility = 'hidden';
  
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  
  URL.revokeObjectURL(url);
}
