// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Eye, Download, Share2, FileText, Calendar, TrendingUp } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Badge, Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui';

export function ReportList({
  reports,
  loading
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 6;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = reports.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(reports.length / itemsPerPage);
  const getTypeBadge = type => {
    const typeMap = {
      strategic: {
        label: '战略分析',
        color: 'bg-blue-500/20 text-blue-400'
      },
      marketing: {
        label: '营销策略',
        color: 'bg-purple-500/20 text-purple-400'
      },
      investment: {
        label: '投资分析',
        color: 'bg-green-500/20 text-green-400'
      },
      expansion: {
        label: '市场扩张',
        color: 'bg-orange-500/20 text-orange-400'
      }
    };
    const config = typeMap[type] || {
      label: '其他',
      color: 'bg-gray-500/20 text-gray-400'
    };
    return <Badge className={config.color}>{config.label}</Badge>;
  };
  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {[1, 2, 3, 4].map(i => <Card key={i} className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-4 bg-gray-700 rounded w-3/4 mb-2"></div>
            <div className="h-3 bg-gray-800 rounded w-1/2 mb-4"></div>
            <div className="h-3 bg-gray-800 rounded w-full mb-2"></div>
            <div className="h-3 bg-gray-800 rounded w-2/3"></div>
          </div>
        </CardContent>
      </Card>)}
    </div>;
  }
  return <div>
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      {currentItems.map(report => <Card key={report._id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all">
          <CardContent className="p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex-1">
                <h4 className="text-white font-semibold mb-1 line-clamp-2">{report.title}</h4>
                <p className="text-sm text-gray-400 line-clamp-2">{report.summary}</p>
              </div>
              <div className="text-right ml-4">
                <div className="text-2xl font-bold text-cyan-400">{report.confidence || 0}%</div>
                <div className="text-xs text-gray-400">置信度</div>
              </div>
            </div>

            <div className="flex items-center justify-between mt-4">
              <div className="flex items-center space-x-3 text-sm">
                {getTypeBadge(report.type)}
                <div className="flex items-center text-gray-400">
                  <Calendar className="w-3 h-3 mr-1" />
                  {new Date(report.createdAt).toLocaleDateString()}
                </div>
                <div className="flex items-center text-gray-400">
                  <TrendingUp className="w-3 h-3 mr-1" />
                  {report.simulations || 0}次
                </div>
              </div>
              
              <div className="flex space-x-1">
                <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                  <Eye className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Download className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                  <Share2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>)}
    </div>

    {totalPages > 1 && <div className="mt-6">
      <Pagination>
        <PaginationContent>
          <PaginationItem>
            <PaginationPrevious onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))} disabled={currentPage === 1} />
          </PaginationItem>
          
          {[...Array(totalPages)].map((_, i) => <PaginationItem key={i}>
              <PaginationLink onClick={() => setCurrentPage(i + 1)} isActive={currentPage === i + 1}>
                {i + 1}
              </PaginationLink>
            </PaginationItem>)}
          
          <PaginationItem>
            <PaginationNext onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))} disabled={currentPage === totalPages} />
          </PaginationItem>
        </PaginationContent>
      </Pagination>
    </div>}

    {currentItems.length === 0 && <div className="text-center py-8">
      <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
      <p className="text-gray-400">暂无研究报告</p>
    </div>}
  </div>;
}