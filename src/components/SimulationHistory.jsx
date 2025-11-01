// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Eye, Download, Calendar, Users, Clock } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Badge, Pagination, PaginationContent, PaginationItem, PaginationPrevious, PaginationLink, PaginationNext } from '@/components/ui';

export function SimulationHistory({
  simulations,
  loading
}) {
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 5;
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentItems = simulations.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(simulations.length / itemsPerPage);
  const getStatusBadge = status => {
    switch (status) {
      case 'completed':
        return <Badge className="bg-green-500/20 text-green-400">已完成</Badge>;
      case 'running':
        return <Badge className="bg-yellow-500/20 text-yellow-400">进行中</Badge>;
      case 'failed':
        return <Badge className="bg-red-500/20 text-red-400">失败</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">未知</Badge>;
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
      <h3 className="text-lg font-semibold text-white mb-4">模拟历史</h3>
      
      <div className="overflow-x-auto">
        <table className="w-full">
          <thead>
            <tr className="border-b border-gray-700">
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">场景</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">参与方</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">状态</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">时间</th>
              <th className="text-left py-3 px-4 text-sm font-medium text-gray-400">操作</th>
            </tr>
          </thead>
          <tbody>
            {currentItems.map(sim => <tr key={sim._id} className="border-b border-gray-800 hover:bg-gray-800/50">
                <td className="py-3 px-4">
                  <div>
                    <p className="text-white font-medium">{sim.title}</p>
                    <p className="text-sm text-gray-400">{sim.scenario}</p>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <Users className="w-4 h-4 text-gray-400" />
                    <span className="text-gray-300">{sim.agents?.length || 0}</span>
                  </div>
                </td>
                <td className="py-3 px-4">{getStatusBadge(sim.status)}</td>
                <td className="py-3 px-4">
                  <div className="flex items-center space-x-1">
                    <Calendar className="w-4 h-4 text-gray-400" />
                    <span className="text-sm text-gray-300">
                      {new Date(sim.createdAt || sim.timestamp).toLocaleDateString()}
                    </span>
                  </div>
                </td>
                <td className="py-3 px-4">
                  <div className="flex space-x-2">
                    <Button variant="ghost" size="sm" className="text-cyan-400 hover:text-cyan-300">
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                      <Download className="w-4 h-4" />
                    </Button>
                  </div>
                </td>
              </tr>)}
          </tbody>
        </table>
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
        <p className="text-gray-400">暂无模拟记录</p>
      </div>}
    </CardContent>
  </Card>;
}