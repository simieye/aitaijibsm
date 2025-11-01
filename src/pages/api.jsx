// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Copy, Check, Play, Code, Book, Zap, Badge, CreditCard, Settings, Download } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Tabs, TabsList, TabsTrigger, TabsContent, Input, Textarea, useToast } from '@/components/ui';

import { SubscriptionPlans } from '@/components/SubscriptionPlans';
import { CurrentSubscription } from '@/components/CurrentSubscription';
import { InvoiceList } from '@/components/InvoiceList';
export default function ApiPage(props) {
  const {
    $w
  } = props;
  const [copied, setCopied] = useState(false);
  const [testResult, setTestResult] = useState(null);
  const [isTesting, setIsTesting] = useState(false);
  const [subscriptionPlans, setSubscriptionPlans] = useState([]);
  const [currentSubscription, setCurrentSubscription] = useState(null);
  const [currentPlan, setCurrentPlan] = useState(null);
  const [invoices, setInvoices] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadSubscriptionData();
  }, []);
  const loadSubscriptionData = async () => {
    try {
      setLoading(true);

      // 加载订阅计划
      const plansRes = await $w.cloud.callDataSource({
        dataSourceName: 'subscription_plan',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          orderBy: [{
            sortOrder: 'asc'
          }]
        }
      });

      // 加载用户订阅
      const subscriptionRes = await $w.cloud.callDataSource({
        dataSourceName: 'user_subscription',
        methodName: 'wedaGetRecordsV2',
        params: {
          select: {
            $master: true
          },
          orderBy: [{
            createdAt: 'desc'
          }],
          limit: 1
        }
      });

      // 加载发票（模拟数据）
      setSubscriptionPlans(plansRes.records || []);
      if (subscriptionRes.records && subscriptionRes.records.length > 0) {
        const subscription = subscriptionRes.records[0];
        setCurrentSubscription(subscription);

        // 获取对应的计划详情
        const plan = plansRes.records.find(p => p._id === subscription.planId);
        setCurrentPlan(plan);

        // 生成模拟发票数据
        setInvoices([{
          id: 'inv_123',
          number: 'INV-2024-001',
          amount_paid: 9900,
          status: 'paid',
          created: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
        }, {
          id: 'inv_124',
          number: 'INV-2024-002',
          amount_paid: 9900,
          status: 'paid',
          created: new Date().toISOString()
        }]);
      }
    } catch (error) {
      console.error('加载订阅数据失败:', error);
      toast({
        title: "加载失败",
        description: "无法加载订阅信息",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const copyToClipboard = text => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "已复制",
      description: "代码已复制到剪贴板"
    });
  };
  const runTest = () => {
    setIsTesting(true);
    setTimeout(() => {
      setTestResult({
        success: true,
        data: {
          simulationId: "sim_12345",
          status: "completed",
          participants: 6,
          rounds: 150,
          confidence: 94.7,
          reportUrl: "/api/reports/sim_12345"
        },
        executionTime: 847
      });
      setIsTesting(false);
    }, 2000);
  };
  const handleSubscribe = async planId => {
    try {
      toast({
        title: "正在跳转",
        description: "正在跳转到支付页面..."
      });

      // 调用云函数创建 Stripe Checkout 会话
      const result = await $w.cloud.callFunction({
        name: 'createCheckoutSession',
        data: {
          planId,
          successUrl: `${window.location.origin}/pages/api`,
          cancelUrl: `${window.location.origin}/pages/api`
        }
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('创建支付会话失败:', error);
      toast({
        title: "支付失败",
        description: "无法创建支付会话，请稍后重试",
        variant: "destructive"
      });
    }
  };
  const handleManageSubscription = async () => {
    try {
      toast({
        title: "正在跳转",
        description: "正在跳转到订阅管理..."
      });

      // 调用云函数创建 Customer Portal 会话
      const result = await $w.cloud.callFunction({
        name: 'createCustomerPortal',
        data: {
          returnUrl: `${window.location.origin}/pages/api`
        }
      });
      if (result.url) {
        window.location.href = result.url;
      }
    } catch (error) {
      console.error('创建客户门户失败:', error);
      toast({
        title: "跳转失败",
        description: "无法打开订阅管理，请稍后重试",
        variant: "destructive"
      });
    }
  };
  const handleCancelSubscription = async () => {
    try {
      const result = await $w.cloud.callFunction({
        name: 'cancelSubscription',
        data: {}
      });
      if (result.success) {
        toast({
          title: "取消成功",
          description: "订阅将在当前周期结束时取消"
        });
        await loadSubscriptionData();
      }
    } catch (error) {
      console.error('取消订阅失败:', error);
      toast({
        title: "取消失败",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };
  const handleDownloadInvoice = async invoiceId => {
    try {
      const result = await $w.cloud.callFunction({
        name: 'downloadInvoice',
        data: {
          invoiceId
        }
      });
      if (result.url) {
        window.open(result.url, '_blank');
      }
    } catch (error) {
      console.error('下载发票失败:', error);
      toast({
        title: "下载失败",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };
  const apiEndpoints = {
    createSimulation: {
      method: 'POST',
      endpoint: '/api/v1/simulations',
      description: '创建新的商业博弈模拟',
      example: `curl -X POST https://taiji-matrix.com/api/v1/simulations \\
  -H "Authorization: Bearer YOUR_API_KEY" \\
  -H "Content-Type: application/json" \\
  -d '{
    "scenario": "新能源价格战",
    "participants": [
      {
        "name": "比亚迪",
        "type": "automaker",
        "strategy": "aggressive"
      }
    ],
    "duration": 60,
    "iterations": 1000
  }'`
    },
    getResults: {
      method: 'GET',
      endpoint: '/api/v1/simulations/{id}/results',
      description: '获取模拟结果和报告',
      example: `curl -X GET https://taiji-matrix.com/api/v1/simulations/sim_12345/results \\
  -H "Authorization: Bearer YOUR_API_KEY"`
    },
    listAgents: {
      method: 'GET',
      endpoint: '/api/v1/agents',
      description: '获取可用的AI智能体列表',
      example: `curl -X GET https://taiji-matrix.com/api/v1/agents \\
  -H "Authorization: Bearer YOUR_API_KEY"`
    }
  };
  const sdkExample = `// JavaScript SDK 示例
import { TaijiMatrix } from '@taiji-matrix/sdk';

const client = new TaijiMatrix({
  apiKey: 'YOUR_API_KEY',
  baseURL: 'https://taiji-matrix.com/api/v1'
});

// 创建模拟
const simulation = await client.simulations.create({
  scenario: '新能源价格战',
  participants: [
    { name: '比亚迪', type: 'automaker' },
    { name: '特斯拉', type: 'automaker' },
    { name: '蔚来', type: 'automaker' }
  ],
  duration: 60,
  iterations: 1000
});

// 获取结果
const results = await client.simulations.getResults(simulation.id);
console.log('模拟完成:', results);`;
  return <div className="min-h-screen bg-black text-white p-4 md:p-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">API开放平台</h1>
        </div>
      </div>

      <Tabs defaultValue="subscription" className="w-full">
        <TabsList className="bg-gray-800 border-gray-600 mb-6">
          <TabsTrigger value="subscription" className="data-[state=active]:bg-cyan-500">
            <CreditCard className="w-4 h-4 mr-2" />
            订阅管理
          </TabsTrigger>
          <TabsTrigger value="endpoints" className="data-[state=active]:bg-cyan-500">
            <Code className="w-4 h-4 mr-2" />
            API文档
          </TabsTrigger>
          <TabsTrigger value="invoices" className="data-[state=active]:bg-cyan-500">
            <Download className="w-4 h-4 mr-2" />
            发票管理
          </TabsTrigger>
        </TabsList>

        <TabsContent value="subscription" className="mt-6">
          <div className="space-y-6">
            {/* 当前订阅状态 */}
            <CurrentSubscription subscription={currentSubscription} plan={currentPlan} onManage={handleManageSubscription} onCancel={handleCancelSubscription} loading={loading} />
            
            {/* 订阅计划选择 */}
            <SubscriptionPlans plans={subscriptionPlans} currentSubscription={currentSubscription} onSubscribe={handleSubscribe} loading={loading} />
          </div>
        </TabsContent>

        <TabsContent value="endpoints" className="mt-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2">
              <Card className="bg-gray-900 border-gray-700 mb-6">
                <CardContent className="p-6">
                  <h2 className="text-xl font-bold text-white mb-4">API概览</h2>
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-1">3</div>
                      <div className="text-sm text-gray-400">核心接口</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-1">847ms</div>
                      <div className="text-sm text-gray-400">平均响应时间</div>
                    </div>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-cyan-400 mb-1">99.9%</div>
                      <div className="text-sm text-gray-400">服务可用性</div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <div className="space-y-6">
                {Object.entries(apiEndpoints).map(([key, endpoint]) => <Card key={key} className="bg-gray-900 border-gray-700">
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-3">
                        <div>
                          <h3 className="text-lg font-semibold text-white">{endpoint.description}</h3>
                          <div className="flex items-center space-x-2 mt-1">
                            <Badge className="bg-cyan-500/20 text-cyan-400">{endpoint.method}</Badge>
                            <code className="text-sm text-gray-300">{endpoint.endpoint}</code>
                          </div>
                        </div>
                        <Button size="sm" variant="ghost" onClick={() => copyToClipboard(endpoint.example)}>
                          {copied ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
                        </Button>
                      </div>
                      <pre className="bg-gray-800 p-4 rounded-lg overflow-x-auto">
                        <code className="text-sm text-gray-300">{endpoint.example}</code>
                      </pre>
                    </CardContent>
                  </Card>)}
              </div>
            </div>

            <div className="lg:col-span-1">
              <Card className="bg-gray-900 border-gray-700 mb-4">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">快速开始</h3>
                  <div className="space-y-3">
                    <Button variant="outline" className="w-full justify-start">
                      <Book className="w-4 h-4 mr-2" />
                      查看文档
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Code className="w-4 h-4 mr-2" />
                      代码示例
                    </Button>
                    <Button variant="outline" className="w-full justify-start">
                      <Zap className="w-4 h-4 mr-2" />
                      获取API密钥
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="bg-gray-900 border-gray-700">
                <CardContent className="p-6">
                  <h3 className="text-lg font-semibold text-white mb-4">在线测试</h3>
                  <div className="space-y-4 mb-6">
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">场景描述</label>
                      <Input placeholder="例如：新能源车企价格战" className="bg-gray-800 border-gray-600" defaultValue="新能源车企价格战" />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">参与方</label>
                      <Textarea placeholder="每行一个参与方" className="bg-gray-800 border-gray-600" defaultValue="比亚迪&#10;特斯拉&#10;蔚来&#10;小鹏&#10;理想&#10;华为" rows={4} />
                    </div>
                    
                    <div>
                      <label className="block text-sm font-medium text-gray-300 mb-2">模拟轮次</label>
                      <Input type="number" className="bg-gray-800 border-gray-600" defaultValue={1000} />
                    </div>
                  </div>

                  <Button onClick={runTest} disabled={isTesting} className="w-full bg-gradient-to-r from-cyan-500 to-cyan-600">
                    {isTesting ? <>
                        <Zap className="w-4 h-4 mr-2 animate-pulse" />
                        测试中...
                      </> : <>
                        <Play className="w-4 h-4 mr-2" />
                        运行测试
                      </>}
                  </Button>

                  {testResult && <div className="mt-6 p-4 bg-gray-800 rounded-lg">
                      <h4 className="text-white font-semibold mb-2">测试结果</h4>
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-gray-400">状态:</span>
                          <span className="text-green-400 ml-2">成功</span>
                        </div>
                        <div>
                          <span className="text-gray-400">执行时间:</span>
                          <span className="text-cyan-400 ml-2">{testResult.executionTime}ms</span>
                        </div>
                        <div>
                          <span className="text-gray-400">置信度:</span>
                          <span className="text-cyan-400 ml-2">{testResult.data.confidence}%</span>
                        </div>
                        <div>
                          <span className="text-gray-400">模拟轮次:</span>
                          <span className="text-cyan-400 ml-2">{testResult.data.rounds}</span>
                        </div>
                      </div>
                    </div>}
                </CardContent>
              </Card>
            </div>
          </div>
        </TabsContent>

        <TabsContent value="invoices" className="mt-6">
          <InvoiceList invoices={invoices} onDownload={handleDownloadInvoice} loading={loading} />
        </TabsContent>
      </Tabs>
    </div>
  </div>;
}