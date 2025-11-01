// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Search, Filter, Download, Eye, Calendar, Clock, Users, FileText, TrendingUp } from 'lucide-react';
// @ts-ignore;
import { Button, Input, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';

import { DashboardStats } from '@/components/DashboardStats';
import { SimulationHistory } from '@/components/SimulationHistory';
import { ReportList } from '@/components/ReportList';
export default function DashboardPage(props) {
  const {
    $w
  } = props;
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [simulations, setSimulations] = useState([]);
  const [reports, setReports] = useState([]);
  const [stats, setStats] = useState({
    totalAgents: 0,
    totalReports: 0,
    totalSimulations: 0,
    avgConfidence: 0
  });
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadDashboardData();
  }, []);
  const loadDashboardData = async () => {
    try {
      setLoading(true);

      // 加载用户相关的模拟历史
      const simulationsRes = await $w.cloud.callDataSource({
        dataSourceName: 'game_round',
        methodName: 'wedaGetRecordsV2',
        params: {
          limit: 100,
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }]
        }
      });

      // 加载用户相关的研究报告
      const reportsRes = await $w.cloud.callDataSource({
        dataSourceName: 'research_report',
        methodName: 'wedaGetRecordsV2',
        params: {
          limit: 100,
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }]
        }
      });

      // 加载智能体统计
      const agentsRes = await $w.cloud.callDataSource({
        dataSourceName: 'agent',
        methodName: 'wedaGetRecordsV2',
        params: {
          getCount: true,
          select: {
            $master: true
          }
        }
      });
      setSimulations(simulationsRes.records || []);
      setReports(reportsRes.records || []);

      // 计算统计数据
      const totalReports = reportsRes.records?.length || 0;
      const totalSimulations = simulationsRes.records?.length || 0;
      const avgConfidence = totalReports > 0 ? Math.round(reportsRes.records.reduce((sum, r) => sum + (r.confidence || 0), 0) / totalReports) : 0;
      setStats({
        totalAgents: agentsRes.total || 0,
        totalReports,
        totalSimulations,
        avgConfidence
      });
    } catch (error) {
      console.error('加载仪表板数据失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载仪表板数据",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const handleDownloadReport = async reportId => {
    try {
      toast({
        title: "准备下载",
        description: "正在生成PDF报告..."
      });

      // 这里应该实现实际的PDF生成逻辑
      setTimeout(() => {
        toast({
          title: "下载完成",
          description: "PDF报告已准备就绪"
        });
      }, 2000);
    } catch (error) {
      toast({
        title: "下载失败",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };
  const handleViewSimulation = simulationId => {
    toast({
      title: "查看模拟",
      description: "正在加载模拟详情..."
    });
  };

  // 筛选和搜索逻辑
  const filteredSimulations = simulations.filter(sim => {
    const matchesSearch = searchTerm === '' || sim.title?.toLowerCase().includes(searchTerm.toLowerCase()) || sim.scenario?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || sim.status === filterType;
    return matchesSearch && matchesFilter;
  });
  const filteredReports = reports.filter(report => {
    const matchesSearch = searchTerm === '' || report.title?.toLowerCase().includes(searchTerm.toLowerCase()) || report.summary?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filterType === 'all' || report.type === filterType;
    return matchesSearch && matchesFilter;
  });
  return <div className="min-h-screen bg-black text-white">
    <div className="max-w-7xl mx-auto p-4 md:p-6">
      {/* 头部 */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">用户后台</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
            <Input placeholder="搜索..." value={searchTerm} onChange={e => setSearchTerm(e.target.value)} className="pl-10 bg-gray-800 border-gray-600 text-white placeholder-gray-400 w-64" />
          </div>
          
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部</SelectItem>
              <SelectItem value="completed">已完成</SelectItem>
              <SelectItem value="running">进行中</SelectItem>
              <SelectItem value="strategic">战略分析</SelectItem>
              <SelectItem value="marketing">营销策略</SelectItem>
            </SelectContent>
          </Select>

          <Select value={sortBy} onValueChange={setSortBy}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date">按时间</SelectItem>
              <SelectItem value="confidence">按置信度</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* 数据概览 */}
      <DashboardStats stats={stats} />

      {/* 主要内容区域 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        {/* 左侧：模拟历史 */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">模拟历史</h2>
          <SimulationHistory simulations={filteredSimulations} loading={loading} />
        </div>

        {/* 右侧：研究报告 */}
        <div>
          <h2 className="text-xl font-semibold text-white mb-4">研究报告</h2>
          <ReportList reports={filteredReports} loading={loading} />
        </div>
      </div>

      {/* 空状态 */}
      {filteredSimulations.length === 0 && filteredReports.length === 0 && !loading && <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">暂无数据</h3>
          <p className="text-gray-500 mb-4">开始创建您的第一个模拟或报告</p>
          <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600">
            开始模拟
          </Button>
        </div>}
    </div>
  </div>;
}