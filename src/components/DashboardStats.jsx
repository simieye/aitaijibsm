// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Users, FileText, Clock, TrendingUp } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent } from '@/components/ui';

export function DashboardStats({
  stats
}) {
  return <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">总智能体</p>
            <p className="text-2xl font-bold text-cyan-400">{stats.totalAgents}</p>
          </div>
          <Users className="w-8 h-8 text-cyan-400" />
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">研究报告</p>
            <p className="text-2xl font-bold text-amber-400">{stats.totalReports}</p>
          </div>
          <FileText className="w-8 h-8 text-amber-400" />
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">模拟次数</p>
            <p className="text-2xl font-bold text-green-400">{stats.totalSimulations}</p>
          </div>
          <Clock className="w-8 h-8 text-green-400" />
        </div>
      </CardContent>
    </Card>

    <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-sm text-gray-400">平均置信度</p>
            <p className="text-2xl font-bold text-purple-400">{stats.avgConfidence}%</p>
          </div>
          <TrendingUp className="w-8 h-8 text-purple-400" />
        </div>
      </CardContent>
    </Card>
  </div>;
}