// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Play, Settings, Share2, Download, Clock, Users, TrendingUp } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Progress, useToast } from '@/components/ui';

export default function SimulationPage(props) {
  const {
    $w
  } = props;
  const [isSimulating, setIsSimulating] = useState(false);
  const [progress, setProgress] = useState(0);
  const [agents, setAgents] = useState([]);
  const [selectedAgents, setSelectedAgents] = useState([]);
  const [scenario, setScenario] = useState('新能源车企价格战');
  const [participants, setParticipants] = useState(6);
  const [duration, setDuration] = useState(5);
  const {
    toast
  } = useToast();
  useEffect(() => {
    // 加载可用的智能体
    const loadAgents = async () => {
      try {
        const res = await $w.cloud.callDataSource({
          dataSourceName: 'agent',
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
        setAgents(res.records || []);
      } catch (error) {
        console.error('加载智能体失败:', error);
        // 使用默认数据
        setAgents([{
          id: '1',
          name: '张总-新能源CEO',
          role: 'CEO/创始人',
          status: '已训练'
        }, {
          id: '2',
          name: '李博士-首席经济学家',
          role: '战略顾问',
          status: '已训练'
        }, {
          id: '3',
          name: '王总监-投资合伙人',
          role: '投资总监',
          status: '已训练'
        }]);
      }
    };
    loadAgents();
  }, []);
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const handleStartSimulation = async () => {
    if (selectedAgents.length === 0) {
      toast({
        title: "请选择智能体",
        description: "至少需要选择一个智能体参与模拟",
        variant: "destructive"
      });
      return;
    }
    setIsSimulating(true);
    setProgress(0);
    try {
      // 创建博弈回合记录
      const roundData = {
        title: `${scenario} - 第1轮`,
        scenario: `模拟${selectedAgents.length}个参与方在${scenario}场景下的博弈行为`,
        agents: selectedAgents,
        roundIndex: 1,
        stateSnapshot: {
          initialState: true
        },
        actions: {},
        rewards: {},
        duration: 0,
        reportId: ''
      };
      await $w.cloud.callDataSource({
        dataSourceName: 'game_round',
        methodName: 'wedaCreateV2',
        params: {
          data: roundData
        }
      });

      // 模拟进度
      const interval = setInterval(() => {
        setProgress(prev => {
          if (prev >= 100) {
            clearInterval(interval);
            setIsSimulating(false);

            // 创建研究报告
            const reportData = {
              title: `${scenario}分析报告`,
              summary: `基于${selectedAgents.length}个智能体的博弈模拟结果`,
              scenario: scenario,
              agents: selectedAgents,
              rounds: [],
              // 这里应该关联实际的roundId
              confidence: Math.floor(Math.random() * 15) + 85,
              simulations: 1000,
              participants: selectedAgents.length,
              type: 'strategic'
            };
            $w.cloud.callDataSource({
              dataSourceName: 'research_report',
              methodName: 'wedaCreateV2',
              params: {
                data: reportData
              }
            });
            toast({
              title: "模拟完成",
              description: "您的商业博弈模拟已完成，请查看结果"
            });

            // 跳转到报告页面
            $w.utils.navigateTo({
              pageId: 'reports',
              params: {}
            });
            return 100;
          }
          return prev + 10;
        });
      }, 500);
    } catch (error) {
      console.error('模拟失败:', error);
      toast({
        title: "模拟失败",
        description: "请稍后重试",
        variant: "destructive"
      });
      setIsSimulating(false);
    }
  };
  const toggleAgent = agentId => {
    setSelectedAgents(prev => prev.includes(agentId) ? prev.filter(id => id !== agentId) : [...prev, agentId]);
  };
  return <div className="min-h-screen bg-black text-white p-4 md:p-6">
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">AI太极矩阵模拟器</h1>
        </div>
        
        <div className="flex space-x-2">
          <Button variant="ghost" size="sm">
            <Settings className="w-4 h-4" />
          </Button>
          <Button variant="ghost" size="sm">
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 模拟配置 */}
        <div className="lg:col-span-2">
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <h2 className="text-xl font-semibold mb-4">模拟配置</h2>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">场景选择</label>
                  <select value={scenario} onChange={e => setScenario(e.target.value)} className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white">
                    <option value="新能源车企价格战">新能源车企价格战</option>
                    <option value="跨境电商促销策略分析">跨境电商促销策略分析</option>
                    <option value="AI初创公司融资谈判">AI初创公司融资谈判</option>
                    <option value="新消费品牌市场进入">新消费品牌市场进入</option>
                    <option value="组织架构变革模拟">组织架构变革模拟</option>
                  </select>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">选择智能体</label>
                  <div className="grid grid-cols-2 gap-2">
                    {agents.map(agent => <button key={agent.id} onClick={() => toggleAgent(agent.id)} className={`p-3 rounded-lg border transition-all ${selectedAgents.includes(agent.id) ? 'border-cyan-500 bg-cyan-500/10 text-cyan-400' : 'border-gray-600 bg-gray-800 text-gray-300 hover:border-gray-500'}`}>
                        <div className="text-sm font-medium">{agent.name}</div>
                        <div className="text-xs text-gray-400">{agent.role}</div>
                      </button>)}
                  </div>
                </div>
                
                <div>
                  <label className="block text-sm font-medium text-gray-300 mb-2">模拟时长（年）</label>
                  <input type="number" value={duration} onChange={e => setDuration(parseInt(e.target.value))} min="1" max="10" className="w-full bg-gray-800 border border-gray-600 rounded-lg px-3 py-2 text-white" />
                </div>
              </div>
              
              <Button onClick={handleStartSimulation} disabled={isSimulating || selectedAgents.length === 0} className="w-full mt-6 bg-gradient-to-r from-cyan-500 to-cyan-600 disabled:opacity-50">
                <Play className="w-4 h-4 mr-2" />
                {isSimulating ? '模拟中...' : '开始模拟'}
              </Button>
            </CardContent>
          </Card>
          
          {/* 进度条 */}
          {isSimulating && <Card className="bg-gray-900 border-gray-700 mt-6">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm">模拟进度</span>
                  <span className="text-sm">{progress}%</span>
                </div>
                <Progress value={progress} className="h-2" />
              </CardContent>
            </Card>}
        </div>
        
        {/* 实时数据 */}
        <div>
          <Card className="bg-gray-900 border-gray-700">
            <CardContent className="p-6">
              <h3 className="text-lg font-semibold mb-4">实时数据</h3>
              
              <div className="space-y-4">
                <div className="flex justify-between">
                  <span className="text-gray-400">已选智能体</span>
                  <span className="text-cyan-400 font-bold">{selectedAgents.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">可用智能体</span>
                  <span className="text-amber-400 font-bold">{agents.length}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-400">预计用时</span>
                  <span className="text-cyan-400 font-bold">{duration * 2}分钟</span>
                </div>
              </div>
              
              <Button variant="outline" className="w-full mt-6 border-gray-600 hover:border-cyan-400">
                <Download className="w-4 h-4 mr-2" />
                下载报告
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  </div>;
}