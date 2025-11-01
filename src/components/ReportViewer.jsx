// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Download, Share2, Eye, FileText, BarChart3, Network } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui';

export function ReportViewer({
  report
}) {
  const [activeTab, setActiveTab] = useState('summary');
  if (!report) return null;
  return <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">{report.title}</h3>
          <div className="flex space-x-2">
            <Button variant="ghost" size="sm">
              <Download className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="sm">
              <Share2 className="w-4 h-4" />
            </Button>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="bg-gray-800 border-gray-600">
            <TabsTrigger value="summary" className="data-[state=active]:bg-cyan-500">
              <FileText className="w-4 h-4 mr-2" />
              摘要
            </TabsTrigger>
            <TabsTrigger value="analysis" className="data-[state=active]:bg-cyan-500">
              <BarChart3 className="w-4 h-4 mr-2" />
              分析
            </TabsTrigger>
            <TabsTrigger value="network" className="data-[state=active]:bg-cyan-500">
              <Network className="w-4 h-4 mr-2" />
              网络图
            </TabsTrigger>
          </TabsList>

          <TabsContent value="summary" className="mt-6">
            <div className="prose prose-invert max-w-none">
              <h4 className="text-lg font-semibold text-white mb-3">执行摘要</h4>
              <p className="text-gray-300 mb-4">{report.summary}</p>
              
              <h5 className="text-md font-semibold text-white mb-2">关键发现</h5>
              <ul className="text-gray-300 space-y-1">
                {report.keyFindings.map((finding, index) => <li key={index} className="flex items-start">
                    <span className="text-cyan-400 mr-2">•</span>
                    {finding}
                  </li>)}
              </ul>
            </div>
          </TabsContent>

          <TabsContent value="analysis" className="mt-6">
            <div className="space-y-4">
              <div className="bg-gray-800 rounded-lg p-4">
                <h5 className="text-white font-semibold mb-2">博弈分析</h5>
                <div className="text-sm text-gray-300">
                  <p>纳什均衡点: {report.analysis.nashEquilibrium}</p>
                  <p>帕累托最优: {report.analysis.paretoOptimal}</p>
                  <p>风险系数: {report.analysis.riskFactor}</p>
                </div>
              </div>
              
              <div className="bg-gray-800 rounded-lg p-4">
                <h5 className="text-white font-semibold mb-2">决策路径</h5>
                <div className="text-sm text-gray-300">
                  {report.analysis.decisionPath.map((step, index) => <div key={index} className="mb-2">
                      <span className="text-cyan-400">步骤 {index + 1}:</span> {step}
                    </div>)}
                </div>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="network" className="mt-6">
            <div className="bg-gray-800 rounded-lg p-4">
              <h5 className="text-white font-semibold mb-4">智能体关系网络</h5>
              <div className="h-64 bg-gray-900 rounded-lg flex items-center justify-center">
                <div className="text-center">
                  <Network className="w-12 h-12 text-cyan-400 mx-auto mb-2" />
                  <p className="text-gray-400">交互式网络图</p>
                  <p className="text-sm text-gray-500">显示各智能体间的博弈关系</p>
                </div>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>;
}