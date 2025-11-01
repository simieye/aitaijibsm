// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Download, Calendar, DollarSign, FileText } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Badge } from '@/components/ui';

export function InvoiceList({
  invoices,
  onDownload,
  loading
}) {
  const [downloadingId, setDownloadingId] = useState(null);
  const getStatusBadge = status => {
    switch (status) {
      case 'paid':
        return <Badge className="bg-green-500/20 text-green-400">已支付</Badge>;
      case 'open':
        return <Badge className="bg-yellow-500/20 text-yellow-400">待支付</Badge>;
      case 'void':
        return <Badge className="bg-gray-500/20 text-gray-400">已作废</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">{status}</Badge>;
    }
  };
  const formatAmount = amount => {
    return `¥${(amount / 100).toFixed(2)}`;
  };
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const handleDownload = async invoiceId => {
    setDownloadingId(invoiceId);
    try {
      await onDownload(invoiceId);
    } finally {
      setDownloadingId(null);
    }
  };
  if (loading) {
    return <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="animate-pulse">
          <div className="h-4 bg-gray-700 rounded w-1/4 mb-4"></div>
          <div className="space-y-3">
            {[1, 2, 3].map(i => <div key={i} className="h-12 bg-gray-800 rounded"></div>)}
          </div>
        </div>
      </CardContent>
    </Card>;
  }
  return <Card className="bg-gray-900 border-gray-700">
    <CardContent className="p-6">
      <h3 className="text-lg font-semibold text-white mb-4">发票记录</h3>
      
      <div className="space-y-3">
        {invoices.map(invoice => <div key={invoice.id} className="flex items-center justify-between p-3 bg-gray-800 rounded-lg">
            <div className="flex items-center space-x-3">
              <FileText className="w-5 h-5 text-gray-400" />
              <div>
                <div className="text-sm font-medium text-white">#{invoice.number}</div>
                <div className="text-xs text-gray-400">{formatDate(invoice.created)}</div>
              </div>
            </div>
            
            <div className="flex items-center space-x-3">
              <div className="text-right">
                <div className="text-sm font-semibold text-white">{formatAmount(invoice.amount_paid)}</div>
                {getStatusBadge(invoice.status)}
              </div>
              
              <Button size="sm" variant="ghost" onClick={() => handleDownload(invoice.id)} disabled={downloadingId === invoice.id} className="text-cyan-400 hover:text-cyan-300">
                <Download className="w-4 h-4" />
              </Button>
            </div>
          </div>)}
      </div>

      {invoices.length === 0 && <div className="text-center py-8">
        <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
        <p className="text-gray-400">暂无发票记录</p>
      </div>}
    </CardContent>
  </Card>;
}