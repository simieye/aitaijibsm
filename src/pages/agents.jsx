// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { ArrowLeft, Plus } from 'lucide-react';
// @ts-ignore;
import { Button, useToast } from '@/components/ui';

import { AgentCreator } from '@/components/AgentCreator';
import { AgentCard } from '@/components/AgentCard';
import { LoadingState } from '@/components/LoadingState';
import { EmptyState } from '@/components/EmptyState';
export default function AgentsPage(props) {
  const {
    $w
  } = props;
  const [showCreator, setShowCreator] = useState(false);
  const [agents, setAgents] = useState([]);
  const [loading, setLoading] = useState(true);
  const {
    toast
  } = useToast();
  useEffect(() => {
    loadAgents();
  }, []);
  const loadAgents = async () => {
    try {
      setLoading(true);
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
      toast({
        title: "加载失败",
        description: "无法加载智能体数据",
        variant: "destructive"
      });
    } finally {
      setLoading(false);
    }
  };
  const handleBack = () => {
    $w.utils.navigateBack();
  };
  const handleCreateAgent = async agentData => {
    try {
      const newAgent = {
        name: agentData.name,
        role: agentData.role,
        personality: agentData.personality,
        description: agentData.background || '',
        sourceData: agentData.dataSource || 'custom',
        status: '待训练',
        accuracy: 0,
        useCount: 0,
        isPublic: false,
        tags: [agentData.role, agentData.personality],
        behaviorProfile: {},
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      };
      await $w.cloud.callDataSource({
        dataSourceName: 'agent',
        methodName: 'wedaCreateV2',
        params: {
          data: newAgent
        }
      });
      await loadAgents();
      setShowCreator(false);
      toast({
        title: "智能体创建成功",
        description: `${agentData.name} 已添加到您的智能体库`
      });
    } catch (error) {
      console.error('创建智能体失败:', error);
      toast({
        title: "创建失败",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };
  const handleDeleteAgent = async id => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'agent',
        methodName: 'wedaDeleteV2',
        params: {
          filter: {
            where: {
              _id: {
                $eq: id
              }
            }
          }
        }
      });
      await loadAgents();
      toast({
        title: "智能体已删除",
        description: "该智能体已从您的库中移除"
      });
    } catch (error) {
      console.error('删除智能体失败:', error);
      toast({
        title: "删除失败",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };
  const handleTrainAgent = async id => {
    try {
      await $w.cloud.callDataSource({
        dataSourceName: 'agent',
        methodName: 'wedaUpdateV2',
        params: {
          data: {
            status: '训练中',
            progress: 0
          },
          filter: {
            where: {
              _id: {
                $eq: id
              }
            }
          }
        }
      });
      await loadAgents();

      // 模拟训练进度
      let progress = 0;
      const interval = setInterval(async () => {
        progress += 10;
        if (progress >= 100) {
          clearInterval(interval);
          await $w.cloud.callDataSource({
            dataSourceName: 'agent',
            methodName: 'wedaUpdateV2',
            params: {
              data: {
                status: '已训练',
                progress: 100,
                accuracy: Math.floor(Math.random() * 15) + 85,
                updatedAt: new Date().toISOString()
              },
              filter: {
                where: {
                  _id: {
                    $eq: id
                  }
                }
              }
            }
          });
          await loadAgents();
          toast({
            title: "训练完成",
            description: "智能体已成功训练并可用于模拟"
          });
        } else {
          // 更新进度
          await $w.cloud.callDataSource({
            dataSourceName: 'agent',
            methodName: 'wedaUpdateV2',
            params: {
              data: {
                progress
              },
              filter: {
                where: {
                  _id: {
                    $eq: id
                  }
                }
              }
            }
          });
          await loadAgents();
        }
      }, 800);
    } catch (error) {
      console.error('训练智能体失败:', error);
      toast({
        title: "训练失败",
        description: "请稍后重试",
        variant: "destructive"
      });
    }
  };
  const handleUseAgent = id => {
    toast({
      title: "使用智能体",
      description: "正在跳转到模拟器..."
    });
    $w.utils.navigateTo({
      pageId: 'simulation',
      params: {
        agentId: id
      }
    });
  };
  if (loading) {
    return <LoadingState />;
  }
  return <div className="min-h-screen bg-black text-white p-4 md:p-6">
    <div className="max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" onClick={handleBack} className="text-gray-400 hover:text-white">
            <ArrowLeft className="w-4 h-4 mr-2" />
            返回
          </Button>
          <h1 className="text-2xl md:text-3xl font-bold">AI智能体管理</h1>
        </div>
        
        <Button onClick={() => setShowCreator(true)} className="bg-gradient-to-r from-cyan-500 to-cyan-600">
          <Plus className="w-4 h-4 mr-2" />
          创建智能体
        </Button>
      </div>

      {showCreator && <div className="mb-8">
          <AgentCreator onSave={handleCreateAgent} onCancel={() => setShowCreator(false)} />
        </div>}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {agents.map(agent => <AgentCard key={agent._id} agent={agent} onTrain={handleTrainAgent} onDelete={handleDeleteAgent} onUse={handleUseAgent} />)}
      </div>

      {agents.length === 0 && <EmptyState onCreate={() => setShowCreator(true)} />}
    </div>
  </div>;
}