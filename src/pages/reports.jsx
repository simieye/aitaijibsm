// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Download, Share2, Eye, Filter, Calendar, TrendingUp, FileText } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Tabs, TabsList, TabsTrigger, Badge, Select, SelectContent, SelectItem, SelectTrigger, SelectValue, useToast } from '@/components/ui';

import { ReportViewer } from '@/components/ReportViewer';
export default function ReportsPage(props) {
  const {
    $w
  } = props;
  const [selectedReport, setSelectedReport] = useState(null);
  const [filterType, setFilterType] = useState('all');
  const [sortBy, setSortBy] = useState('date');
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadReports();
  }, []);
  const loadReports = async () => {
    try {
      setLoading(true);
      const res = await $w.cloud.callDataSource({
        dataSourceName: 'research_report',
        methodName: 'wedaGetRecordsV2',
        params: {
          limit: 50,
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }]
        }
      });
      setReports(res.records || []);
    } catch (error) {
      console.error('加载报告失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载报告数据",
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
      // 这里应该实现实际的PDF下载逻辑
      toast({
        title: "下载开始",
        description: "正在生成PDF报告..."
      });
    } catch (error) {
      toast({
        title: "下载失败",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };
  const handleShareReport = async reportId => {
    try {
      // 这里应该实现实际的分享逻辑
      toast({
        title: "分享成功",
        description: "报告链接已复制到剪贴板"
      });
    } catch (error) {
      toast({
        title: "分享失败",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };
  const filteredReports = reports.filter(report => filterType === 'all' || report.type === filterType).sort((a, b) => {
    if (sortBy === 'date') return new Date(b.createdAt || b.date) - new Date(a.createdAt || a.date);
    if (sortBy === 'confidence') return (b.confidence || 0) - (a.confidence || 0);
    return 0;
  });
  const getTypeColor = type => {
    switch (type) {
      case 'strategic':
        return 'bg-blue-500/20 text-blue-400';
      case 'marketing':
        return 'bg-purple-500/20 text-purple-400';
      case 'investment':
        return 'bg-green-500/20 text-green-400';
      case 'expansion':
        return 'bg-orange-500/20 text-orange-400';
      default:
        return 'bg-gray-500/20 text-gray-400';
    }
  };
  const getTypeLabel = type => {
    switch (type) {
      case 'strategic':
        return '战略分析';
      case 'marketing':
        return '营销策略';
      case 'investment':
        return '投资分析';
      case 'expansion':
        return '市场扩张';
      default:
        return '其他';
    }
  };
  if (loading) {
    return <div className="min-h-screen bg-black text-white p-4 md:p-6 flex items-center justify-center">
      <div className="text-center">
        <FileText className="w-12 h-12 text-cyan-400 mx-auto mb-4 animate-pulse" />
        <p className="text-gray-400">加载报告中...</p>
      </div>
    </div>;
  }
  return <div className="min-h-screen bg-black text-white p-4 md:p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">战略报告中心</h1>
        </div>
        
        <div className="flex items-center space-x-4">
          <Select value={filterType} onValueChange={setFilterType}>
            <SelectTrigger className="w-32 bg-gray-800 border-gray-600">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">全部类型</SelectItem>
              <SelectItem value="strategic">战略分析</SelectItem>
              <SelectItem value="marketing">营销策略</SelectItem>
              <SelectItem value="investment">投资分析</SelectItem>
              <SelectItem value="expansion">市场扩张</SelectItem>
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

          <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600">
            <FileText className="w-4 h-4 mr-2" />
            生成新报告
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 报告列表 */}
        <div className="lg:col-span-2">
          <div className="space-y-4">
            {filteredReports.map(report => <Card key={report._id} className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all cursor-pointer" onClick={() => setSelectedReport(report)}>
                <CardContent className="p-6">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-white mb-1">{report.title}</h3>
                      <div className="flex items-center space-x-3 text-sm">
                        <Badge className={getTypeColor(report.type)}>
                          {getTypeLabel(report.type)}
                        </Badge>
                        <span className="text-gray-400">{new Date(report.createdAt || report.date).toLocaleDateString()}</span>
                        <span className="text-gray-400">•</span>
                        <span className="text-gray-400">{report.participants || 0}个参与方</span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-cyan-400">{report.confidence || 0}%</div>
                      <div className="text-xs text-gray-400">置信度</div>
                    </div>
                  </div>

                  <p className="text-gray-300 text-sm mb-4 line-clamp-2">{report.summary}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-4 text-sm text-gray-400">
                      <span className="flex items-center">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {report.simulations || 0}次模拟
                      </span>
                    </div>
                    
                    <div className="flex space-x-2">
                      <Button variant="ghost" size="sm" onClick={e => {
                      e.stopPropagation();
                      handleDownloadReport(report._id);
                    }}>
                        <Download className="w-4 h-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={e => {
                      e.stopPropagation();
                      handleShareReport(report._id);
                    }}>
                        <Share2 className="w-4 h-4" />
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>)}
          </div>
        </div>

        {/* 报告详情 */}
        <div className="lg:col-span-1">
          {selectedReport ? <ReportViewer report={{
            ...selectedReport,
            date: selectedReport.createdAt || selectedReport.date,
            keyFindings: selectedReport.insights?.findings || [],
            analysis: selectedReport.insights?.analysis || {}
          }} /> : <Card className="bg-gray-900 border-gray-700">
              <CardContent className="p-6 text-center">
                <FileText className="w-12 h-12 text-gray-600 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-400 mb-2">选择报告查看详情</h3>
                <p className="text-sm text-gray-500">点击左侧报告卡片查看详细分析</p>
              </CardContent>
            </Card>}
        </div>
      </div>

      {filteredReports.length === 0 && <div className="text-center py-12">
          <FileText className="w-16 h-16 text-gray-600 mx-auto mb-4" />
          <h3 className="text-xl font-semibold text-gray-400 mb-2">暂无报告</h3>
          <p className="text-gray-500 mb-4">开始生成您的第一份战略报告</p>
          <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600">
            <FileText className="w-4 h-4 mr-2" />
            生成报告
          </Button>
        </div>}
    </div>
  </div>;
}