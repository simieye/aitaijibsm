// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ChevronRight, Zap, Brain, Users, TrendingUp, Globe, ArrowRight, Play, Menu, X } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Tabs, TabsContent, TabsList, TabsTrigger, useToast } from '@/components/ui';

// 太极粒子背景组件
const TaijiParticles = () => {
  const [particles, setParticles] = useState([]);
  useEffect(() => {
    const generateParticles = () => {
      const newParticles = Array.from({
        length: 50
      }, (_, i) => ({
        id: i,
        x: Math.random() * 100,
        y: Math.random() * 100,
        size: Math.random() * 3 + 1,
        speed: Math.random() * 0.5 + 0.1,
        opacity: Math.random() * 0.5 + 0.3,
        color: Math.random() > 0.5 ? '#00D1FF' : '#BFA574'
      }));
      setParticles(newParticles);
    };
    generateParticles();
    const interval = setInterval(generateParticles, 5000);
    return () => clearInterval(interval);
  }, []);
  return <div className="absolute inset-0 overflow-hidden">
      {particles.map(particle => <div key={particle.id} className="absolute rounded-full animate-pulse" style={{
      left: `${particle.x}%`,
      top: `${particle.y}%`,
      width: `${particle.size}px`,
      height: `${particle.size}px`,
      backgroundColor: particle.color,
      opacity: particle.opacity,
      animation: `float ${particle.speed}s ease-in-out infinite alternate`
    }} />)}
    </div>;
};

// 3D智能体网络图组件
const AgentNetwork = () => {
  return <div className="relative w-full h-96 bg-gradient-to-br from-gray-900 to-black rounded-2xl overflow-hidden">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-cyan-500/10 via-transparent to-transparent" />
      
      {/* 网络节点 */}
      <div className="absolute top-1/4 left-1/4 w-4 h-4 bg-cyan-400 rounded-full animate-pulse" />
      <div className="absolute top-1/3 right-1/3 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
      <div className="absolute bottom-1/4 left-1/3 w-2 h-2 bg-cyan-400 rounded-full animate-pulse" />
      <div className="absolute bottom-1/3 right-1/4 w-3 h-3 bg-amber-400 rounded-full animate-pulse" />
      
      {/* 连接线 */}
      <svg className="absolute inset-0 w-full h-full">
        <line x1="25%" y1="25%" x2="66%" y2="33%" stroke="#00D1FF" strokeWidth="0.5" opacity="0.3" />
        <line x1="25%" y1="25%" x2="33%" y2="75%" stroke="#BFA574" strokeWidth="0.5" opacity="0.3" />
        <line x1="66%" y1="33%" x2="75%" y2="66%" stroke="#00D1FF" strokeWidth="0.5" opacity="0.3" />
      </svg>
    </div>;
};

// 实时数据看板
const RealTimeDashboard = () => {
  const [metrics, setMetrics] = useState({
    agents: 0,
    games: 0,
    time: 15
  });
  useEffect(() => {
    // 从数据模型获取实时数据
    const fetchMetrics = async () => {
      try {
        const [agentsRes, roundsRes] = await Promise.all([$w.cloud.callDataSource({
          dataSourceName: 'agent',
          methodName: 'wedaGetRecordsV2',
          params: {
            getCount: true,
            select: {
              $master: true
            }
          }
        }), $w.cloud.callDataSource({
          dataSourceName: 'game_round',
          methodName: 'wedaGetRecordsV2',
          params: {
            getCount: true,
            select: {
              $master: true
            }
          }
        })]);
        setMetrics({
          agents: agentsRes.total || 0,
          games: roundsRes.total || 0,
          time: 15
        });
      } catch (error) {
        console.error('获取实时数据失败:', error);
        // 使用默认值
        setMetrics({
          agents: 1200000,
          games: 3500000,
          time: 15
        });
      }
    };
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">AI智能体</p>
              <p className="text-3xl font-bold text-cyan-400">
                {(metrics.agents / 1000).toFixed(0)}K+
              </p>
            </div>
            <Brain className="w-8 h-8 text-cyan-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">战略博弈</p>
              <p className="text-3xl font-bold text-amber-400">
                {(metrics.games / 1000).toFixed(0)}K+
              </p>
            </div>
            <TrendingUp className="w-8 h-8 text-amber-400" />
          </div>
        </CardContent>
      </Card>
      
      <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-gray-400">演化推演</p>
              <p className="text-3xl font-bold text-cyan-400">
                &lt;{metrics.time}m
              </p>
            </div>
            <Zap className="w-8 h-8 text-cyan-400" />
          </div>
        </CardContent>
      </Card>
    </div>;
};

// 案例卡片组件
const CaseCard = ({
  title,
  description,
  type
}) => {
  const [isFlipped, setIsFlipped] = useState(false);
  return <div className="relative w-full h-64 cursor-pointer" onMouseEnter={() => setIsFlipped(true)} onMouseLeave={() => setIsFlipped(false)}>
      <div className={`absolute inset-0 transition-all duration-500 transform-gpu ${isFlipped ? 'rotate-y-180' : ''}`}>
        <Card className="h-full bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
          <CardContent className="p-6 h-full flex flex-col justify-between">
            <div>
              <h3 className="text-xl font-bold text-cyan-400 mb-2">{title}</h3>
              <p className="text-gray-300 text-sm">{description}</p>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-xs text-amber-400 uppercase">{type}</span>
              <ChevronRight className="w-4 h-4 text-cyan-400" />
            </div>
          </CardContent>
        </Card>
      </div>
    </div>;
};

// 应用场景卡片
const ApplicationCard = ({
  title,
  description,
  icon
}) => <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700 hover:border-cyan-400 transition-all duration-300">
    <CardContent className="p-6">
      <div className="flex items-start space-x-4">
        <div className="p-3 bg-cyan-500/10 rounded-lg">
          {icon}
        </div>
        <div>
          <h3 className="text-lg font-semibold text-white mb-2">{title}</h3>
          <p className="text-gray-300 text-sm">{description}</p>
        </div>
      </div>
    </CardContent>
  </Card>;

// 技术流程步骤
const ProcessStep = ({
  number,
  title,
  description
}) => <div className="relative">
    <div className="flex items-start space-x-4">
      <div className="flex-shrink-0 w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
        <span className="text-white font-bold">{number}</span>
      </div>
      <div>
        <h3 className="text-xl font-semibold text-white mb-2">{title}</h3>
        <p className="text-gray-300">{description}</p>
      </div>
    </div>
  </div>;

// 移动端菜单
const MobileMenu = ({
  isOpen,
  onClose
}) => {
  if (!isOpen) return null;
  return <div className="fixed inset-0 bg-black/90 z-50 md:hidden">
      <div className="flex justify-end p-6">
        <Button variant="ghost" onClick={onClose}>
          <X className="w-6 h-6" />
        </Button>
      </div>
      <nav className="flex flex-col items-center space-y-6 p-6">
        <Button variant="ghost" className="text-xl">产品</Button>
        <Button variant="ghost" className="text-xl">解决方案</Button>
        <Button variant="ghost" className="text-xl">案例</Button>
        <Button variant="ghost" className="text-xl">API</Button>
        <Button className="bg-gradient-to-r from-cyan-500 to-cyan-600">
          开始模拟
        </Button>
      </nav>
    </div>;
};

// 案例数据 - 从研究报告数据模型获取
const useCases = () => {
  const [cases, setCases] = useState([]);
  useEffect(() => {
    const fetchCases = async () => {
      try {
        const res = await $w.cloud.callDataSource({
          dataSourceName: 'research_report',
          methodName: 'wedaGetRecordsV2',
          params: {
            limit: 5,
            select: {
              $master: true
            },
            orderBy: [{
              createdAt: 'desc'
            }]
          }
        });
        setCases(res.records || []);
      } catch (error) {
        console.error('获取案例失败:', error);
        // 使用默认案例
        setCases([{
          title: "新能源车企五年价格战与生态位争夺模拟",
          description: "模拟比亚迪、特斯拉、蔚来、小鹏、理想、华为6方博弈，预测2025-2030价格与技术路线演化",
          type: "strategic"
        }]);
      }
    };
    fetchCases();
  }, []);
  return cases;
};
export default function AITaijiMatrix(props) {
  const {
    $w
  } = props;
  const [language, setLanguage] = useState('zh');
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const cases = useCases();
  const {
    toast
  } = useToast();
  const applications = [{
    title: "战略推演",
    description: "模拟竞争对手、监管方、消费者多方博弈，预测5年市场格局演化",
    icon: <TrendingUp className="w-6 h-6 text-cyan-400" />
  }, {
    title: "投资尽调",
    description: "构建目标公司高管团队AI人设，模拟决策逻辑与风险偏好",
    icon: <Brain className="w-6 h-6 text-cyan-400" />
  }, {
    title: "政策影响评估",
    description: "模拟新政下产业链多主体反应，输出影响路径图",
    icon: <Globe className="w-6 h-6 text-cyan-400" />
  }, {
    title: "组织变革模拟",
    description: "模拟企业内部多部门利益冲突与变革阻力，优化推进路径",
    icon: <Users className="w-6 h-6 text-cyan-400" />
  }, {
    title: "新品上市博弈",
    description: "模拟竞品反制策略、渠道反应、消费者迁移，优化上市节奏",
    icon: <Zap className="w-6 h-6 text-cyan-400" />
  }];
  const handleStartSimulation = () => {
    toast({
      title: "开始模拟",
      description: "正在为您启动AI太极矩阵系统..."
    });
    $w.utils.navigateTo({
      pageId: 'simulation',
      params: {}
    });
  };
  const handleNavigateToAgents = () => {
    $w.utils.navigateTo({
      pageId: 'agents',
      params: {}
    });
  };
  const handleNavigateToReports = () => {
    $w.utils.navigateTo({
      pageId: 'reports',
      params: {}
    });
  };
  return <div className="min-h-screen bg-black text-white">
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0px); }
          100% { transform: translateY(-10px); }
        }
        .rotate-y-180 {
          transform: rotateY(180deg);
        }
      `}</style>
      
      {/* 太极粒子背景 */}
      <TaijiParticles />
      
      {/* 导航栏 */}
      <nav className="relative z-10 flex items-center justify-between p-6 bg-black/50 backdrop-blur-sm">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full" />
          <span className="text-xl font-bold">AI Taiji Matrix</span>
        </div>
        
        <div className="hidden md:flex items-center space-x-6">
          <button onClick={() => setLanguage(language === 'zh' ? 'en' : 'zh')} className="px-3 py-1 text-sm border border-gray-600 rounded-full hover:border-cyan-400 transition-colors">
            {language === 'zh' ? 'EN' : '中'}
          </button>
          <Button variant="ghost" onClick={handleNavigateToAgents}>智能体管理</Button>
          <Button variant="ghost" onClick={handleNavigateToReports}>报告中心</Button>
          <Button onClick={handleStartSimulation} className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700">
            <Zap className="w-4 h-4 mr-2" />
            {language === 'zh' ? '开始模拟' : 'Start Simulation'}
          </Button>
        </div>

        <div className="md:hidden">
          <Button variant="ghost" onClick={() => setMobileMenuOpen(true)}>
            <Menu className="w-6 h-6" />
          </Button>
        </div>
      </nav>

      <MobileMenu isOpen={mobileMenuOpen} onClose={() => setMobileMenuOpen(false)} />

      {/* Hero Section */}
      <section className="relative z-10 px-6 py-20">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-cyan-400 to-cyan-600 bg-clip-text text-transparent">
              AI Taiji Matrix
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8">
              {language === 'zh' ? '为商业决策的"主观世界"建模' : 'Modeling the "Subjective World" of Business Decisions'}
            </p>
            <p className="text-lg text-gray-400 mb-12 max-w-3xl mx-auto">
              {language === 'zh' ? '全球领先的多智能体协同决策模拟系统，通过构建高精度AI人设矩阵，模拟真实人类在复杂商业场景中的集体行为、博弈与决策演化' : 'World-leading multi-agent collaborative decision simulation system, building high-precision AI persona matrices to model real human collective behavior, game theory, and decision evolution in complex business scenarios'}
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" onClick={handleStartSimulation} className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-lg px-8 py-4">
                <Zap className="w-5 h-5 mr-2" />
                {language === 'zh' ? '开始您的模拟' : 'Start Your Simulation'}
              </Button>
              <Button size="lg" variant="outline" onClick={handleNavigateToAgents} className="border-gray-600 hover:border-cyan-400">
                探索智能体
              </Button>
            </div>
          </div>

          {/* 实时数据看板 */}
          <div className="mb-16">
            <h2 className="text-3xl font-bold text-center mb-8">
              {language === 'zh' ? '实时数据看板' : 'Real-time Dashboard'}
            </h2>
            <RealTimeDashboard />
          </div>

          {/* 3D智能体网络 */}
          <div className="mb-16">
            <AgentNetwork />
          </div>
        </div>
      </section>

      {/* 研究应用场景 */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'zh' ? '研究应用场景' : 'Research Application Scenarios'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {applications.map((app, index) => <ApplicationCard key={index} {...app} />)}
          </div>
        </div>
      </section>

      {/* 案例研究 */}
      <section className="px-6 py-20 bg-gray-900/50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-bold text-center mb-12">
            {language === 'zh' ? '我们的工作' : 'Our Work'}
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {cases.map((case_, index) => <CaseCard key={index} {...case_} />)}
          </div>
        </div>
      </section>

      {/* 核心技术 */}
      <section className="px-6 py-20">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold mb-8">
            {language === 'zh' ? '核心技术' : 'Core Technology'}
          </h2>
          <Card className="bg-gradient-to-br from-gray-800 to-gray-900 border-gray-700">
            <CardContent className="p-8">
              <h3 className="text-2xl font-bold text-cyan-400 mb-4">
                {language === 'zh' ? '多智能体协同决策引擎' : 'Multi-Agent Collaborative Decision Engine'}
              </h3>
              <p className="text-gray-300 mb-6">
                {language === 'zh' ? '基于博弈论 + 强化学习 + 社会网络分析构建的商业行为模拟系统，支持上千智能体并行演化' : 'Business behavior simulation system built on game theory + reinforcement learning + social network analysis, supporting parallel evolution of thousands of agents'}
              </p>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-left">
                <div>
                  <p className="text-sm text-gray-400 mb-1">{language === 'zh' ? '决策一致性' : 'Decision Consistency'}</p>
                  <p className="text-xl font-bold text-cyan-400">92%</p>
                </div>
                <div>
                  <p className="text-sm text-gray-400 mb-1">{language === 'zh' ? '行为预测准确率' : 'Behavior Prediction Accuracy'}</p>
                  <p className="text-xl font-bold text-cyan-400">87%</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* 页脚CTA */}
      <footer className="px-6 py-20 bg-gradient-to-t from-gray-900 to-black">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-4xl font-bold mb-4">
            AI Taiji Matrix
          </h2>
          <p className="text-xl text-gray-300 mb-8">
            {language === 'zh' ? '为「商业博弈」建模' : 'Modeling "Business Game Theory"'}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button size="lg" onClick={handleStartSimulation} className="bg-gradient-to-r from-cyan-500 to-cyan-600 hover:from-cyan-600 hover:to-cyan-700 text-lg px-8 py-4">
              <Zap className="w-5 h-5 mr-2" />
              {language === 'zh' ? '开始模拟' : 'Start Simulation'}
            </Button>
            <Button size="lg" variant="outline" onClick={handleNavigateToAgents} className="border-gray-600 hover:border-cyan-400">
              探索智能体
            </Button>
          </div>
          
          <div className="mt-12 pt-8 border-t border-gray-800">
            <p className="text-sm text-gray-500">
              {language === 'zh' ? '一阴一阳之谓道，一智一博之谓商。—— AI Taiji Matrix' : '"The interplay of yin and yang is the Way, the interplay of wisdom and strategy is business." — AI Taiji Matrix'}
            </p>
          </div>
        </div>
      </footer>
    </div>;
}