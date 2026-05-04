/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useRef, useState } from 'react';
import * as XLSX from 'xlsx';
import { 
  Download, 
  FileUp, 
  CheckCircle2, 
  AlertCircle,
  FileJson,
  FileSpreadsheet
} from 'lucide-react';
import { useStore } from '../store/StoreContext';
import { formatCurrency, cn } from '../lib/utils';
import { format as formatDate } from 'date-fns';

export const ImportExport: React.FC = () => {
  const { transactions, categories, accounts, importData, addTransaction } = useStore();
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<{ type: 'idle' | 'success' | 'error' | 'loading', message: string }>({ type: 'idle', message: '' });

  const exportData = (exportFormat: 'xlsx' | 'csv') => {
    const data = transactions.map(tx => ({
      Date: formatDate(new Date(tx.date), 'yyyy-MM-dd'),
      Description: tx.description,
      Amount: tx.amount,
      Type: tx.type,
      Category: categories.find(c => c.id === tx.categoryId)?.name || 'Unknown',
      Account: accounts.find(a => a.id === tx.accountId)?.name || 'Unknown',
    }));

    if (exportFormat === 'xlsx') {
      const ws = XLSX.utils.json_to_sheet(data);
      const wb = XLSX.utils.book_new();
      XLSX.utils.book_append_sheet(wb, ws, "Transactions");
      XLSX.writeFile(wb, `ledger_export_${formatDate(new Date(), 'yyyy-MM-dd')}.xlsx`);
    } else {
      const ws = XLSX.utils.json_to_sheet(data);
      const csv = XLSX.utils.sheet_to_csv(ws);
      const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
      const link = document.createElement("a");
      const url = URL.createObjectURL(blob);
      link.setAttribute("href", url);
      link.setAttribute("download", `ledger_export_${formatDate(new Date(), 'yyyy-MM-dd')}.csv`);
      link.style.visibility = 'hidden';
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
    }
  };

  const validateAndImportRows = (rows: any[]) => {
    try {
      let successCount = 0;
      let errorCount = 0;

      rows.forEach(row => {
        // Basic column mapping / validation
        const amount = parseFloat(row.Amount || row.amount);
        const description = row.Description || row.description || row.memo;
        const type = (row.Type || row.type || 'expense').toLowerCase() === 'income' ? 'income' : 'expense';
        const date = row.Date || row.date || new Date().toISOString();

        if (!isNaN(amount) && description) {
          addTransaction({
            amount,
            description,
            type,
            date: new Date(date).toISOString(),
            accountId: accounts[0]?.id || 'default',
            categoryId: categories.find(c => c.type === type)?.id || categories[0]?.id || 'default',
          });
          successCount++;
        } else {
          errorCount++;
        }
      });

      if (successCount > 0) {
        setImportStatus({ 
          type: 'success', 
          message: `Successfully imported ${successCount} transactions. ${errorCount > 0 ? `${errorCount} rows skipped due to errors.` : ''}` 
        });
      } else {
        setImportStatus({ type: 'error', message: 'No valid transaction data found in file.' });
      }
    } catch (err) {
      setImportStatus({ type: 'error', message: 'Critical error during data mapping. Check file format.' });
    }
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    setImportStatus({ type: 'loading', message: 'Scanning file structure...' });

    const reader = new FileReader();
    reader.onload = (event) => {
      try {
        const bstr = event.target?.result;
        const wb = XLSX.read(bstr, { type: 'binary' });
        const wsname = wb.SheetNames[0];
        const ws = wb.Sheets[wsname];
        const data = XLSX.utils.sheet_to_json(ws);
        
        if (!Array.isArray(data) || data.length === 0) {
          throw new Error('File is empty or invalid format');
        }

        validateAndImportRows(data);
      } catch (err) {
        setImportStatus({ type: 'error', message: err instanceof Error ? err.message : 'Failed to parse file.' });
      }
    };
    
    reader.onerror = () => setImportStatus({ type: 'error', message: 'File reading interrupted.' });
    reader.readAsBinaryString(file);
    
    // Reset input for same-file re-uploads
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-10 animate-in fade-in duration-500">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-6">
        <div>
          <span className="text-[10px] text-zinc-500 uppercase font-black tracking-[0.3em] ml-1">Data Portability</span>
          <h1 className="text-4xl font-black text-white tracking-tighter mt-2">Ledger Sync</h1>
        </div>
      </div>

      {importStatus.type !== 'idle' && (
        <div className={cn(
          "p-6 rounded-2xl flex items-center gap-4 animate-in slide-in-from-top-4 duration-300",
          importStatus.type === 'success' ? "bg-green-500/10 border border-green-500/20 text-green-500" :
          importStatus.type === 'error' ? "bg-red-500/10 border border-red-500/20 text-red-500" :
          "bg-blue-500/10 border border-blue-500/20 text-blue-500"
        )}>
          {importStatus.type === 'loading' ? (
            <div className="w-5 h-5 border-2 border-current border-t-transparent rounded-full animate-spin" />
          ) : importStatus.type === 'success' ? (
            <CheckCircle2 className="w-6 h-6" />
          ) : (
            <AlertCircle className="w-6 h-6" />
          )}
          <div className="flex-1">
            <p className="text-sm font-bold uppercase tracking-tight">{importStatus.type} Record</p>
            <p className="text-xs opacity-80 mt-0.5">{importStatus.message}</p>
          </div>
          <button onClick={() => setImportStatus({ type: 'idle', message: '' })} className="text-xs font-black uppercase tracking-widest opacity-50 hover:opacity-100 italic transition-opacity">Dismiss</button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-[#141414] p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center space-y-8 group hover:border-blue-500/20 transition-all duration-500">
          <div className="w-20 h-20 bg-blue-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl">
            <Download className="w-10 h-10 text-blue-500" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Export History</h3>
            <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
              Generate a local snapshot of your entire financial history.
            </p>
          </div>
          <div className="w-full grid grid-cols-2 gap-3">
            <button 
              onClick={() => exportData('xlsx')}
              className="bg-blue-600 hover:bg-blue-500 text-white py-4 rounded-2xl font-bold transition-all shadow-xl shadow-blue-600/10 flex items-center justify-center gap-2 group/btn"
            >
              <FileSpreadsheet className="w-4 h-4 group-hover/btn:scale-110" />
              Excel
            </button>
            <button 
              onClick={() => exportData('csv')}
              className="bg-[#1a1a1a] hover:bg-[#252525] text-white py-4 rounded-2xl font-bold border border-white/5 transition-all flex items-center justify-center gap-2"
            >
              <FileJson className="w-4 h-4" />
              CSV
            </button>
          </div>
        </div>

        <div className="bg-[#141414] p-10 rounded-[2.5rem] border border-white/5 flex flex-col items-center text-center space-y-8 group hover:border-green-500/20 transition-all duration-500">
          <div className="w-20 h-20 bg-green-500/10 rounded-3xl flex items-center justify-center group-hover:scale-110 transition-transform duration-500 shadow-2xl uppercase font-black text-green-500">
            <FileUp className="w-10 h-10" />
          </div>
          <div className="space-y-2">
            <h3 className="text-xl font-bold text-white uppercase tracking-tight">Import Source</h3>
            <p className="text-sm text-zinc-500 max-w-xs mx-auto leading-relaxed">
              Upload bank statements or reports to merge with your current ledger.
            </p>
            <button 
              onClick={() => {
                const sampleData = [
                  { Date: '2024-05-01', Amount: 25000, Description: 'Monthly Salary', Type: 'Income' },
                  { Date: '2024-05-02', Amount: 1200, Description: 'Grocery Shopping', Type: 'Expense' },
                  { Date: '2024-05-03', Amount: 500, Description: 'Netflix Subscription', Type: 'Expense' }
                ];
                const ws = XLSX.utils.json_to_sheet(sampleData);
                const wb = XLSX.utils.book_new();
                XLSX.utils.book_append_sheet(wb, ws, "Template");
                XLSX.writeFile(wb, "ledger_import_template.xlsx");
              }}
              className="text-[10px] text-blue-500 font-black uppercase tracking-widest hover:text-blue-400 transition-colors mt-2 flex items-center justify-center gap-1.5 mx-auto"
            >
              <FileSpreadsheet className="w-3 h-3" />
              Download Excel Template
            </button>
          </div>
          <input 
            type="file" 
            ref={fileInputRef} 
            className="hidden" 
            accept=".xlsx, .xls, .csv" 
            onChange={handleFileUpload}
          />
          <button 
            onClick={() => fileInputRef.current?.click()}
            className="w-full bg-white text-black py-4 rounded-2xl font-bold transition-all hover:bg-zinc-200 active:scale-95 shadow-xl shadow-white/5 flex items-center justify-center gap-2"
          >
            <CheckCircle2 className="w-5 h-5" />
            Validate & Merge
          </button>
        </div>
      </div>

      <div className="bg-[#141414] p-8 rounded-[2rem] border border-white/5">
        <div className="flex items-start gap-5">
          <div className="p-3 bg-zinc-900 rounded-2xl text-zinc-500 border border-white/5">
            <AlertCircle className="w-6 h-6" />
          </div>
          <div className="space-y-4">
            <div>
              <h4 className="text-lg font-bold text-white tracking-tight uppercase">Import Protocol</h4>
              <p className="text-xs text-zinc-600 leading-relaxed mt-1 font-medium">
                Ensure your document header contains the following case-insensitive labels: 
                <span className="text-zinc-400 mx-1">Date, Amount, Description, Type</span>. 
                Invalid rows will be isolated and discarded to protect ledger integrity.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
