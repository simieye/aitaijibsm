// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Play, Edit, Trash2, Clock, CheckCircle, AlertCircle } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Progress, Badge } from '@/components/ui';

export function AgentCard({
  agent,
  onTrain,
  onDelete,
  onUse
}) {
  const getStatusBadge = status => {
    switch (status) {
      case '已训练':
        return <Badge className="bg-green-500/20 text-green-400 border-green-500/30">
          <CheckCircle className="w-3 h-3 mr-1" />
          已训练
        </Badge>;
      case '训练中':
        return <Badge className="bg-yellow-500/20 text-yellow-400 border-yellow-500/30">
          <Clock className="w-3 h-3 mr-1" />
          训练中
        </Badge>;
      case '待训练':
        return <Badge className="bg-gray-500/20 text-gray-400 border-gray-500/30">
          <AlertCircle className="w-3 h-3 mr-1" />
          待训练
        </Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">未知</Badge>;
    }
  };
  return <Card className="bg-gray-900 border-gray-700 hover:border-gray-600 transition-all">
      <CardContent className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div className="flex items-center space-x-3">
            <div className="w-12 h-12 bg-gradient-to-r from-cyan-500 to-cyan-600 rounded-full flex items-center justify-center">
              <span className="text-white font-bold">{agent.name.charAt(0)}</span>
            </div>
            <div>
              <h3 className="text-lg font-semibold text-white">{agent.name}</h3>
              <p className="text-sm text-gray-400">{agent.role}</p>
            </div>
          </div>
          {getStatusBadge(agent.status)}
        </div>

        <div className="space-y-3 mb-4">
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">决策风格</span>
            <span className="text-cyan-400">{agent.personality}</span>
          </div>
          
          <div className="flex justify-between text-sm">
            <span className="text-gray-400">训练数据</span>
            <span className="text-gray-300">{agent.sourceData}</span>
          </div>

          <div className="flex justify-between text-sm">
            <span className="text-gray-400">使用次数</span>
            <span className="text-gray-300">{agent.useCount || 0}次</span>
          </div>

          {agent.status === '已训练' && <div className="flex justify-between text-sm">
              <span className="text-gray-400">准确率</span>
              <span className="text-green-400">{agent.accuracy || 0}%</span>
            </div>}

          {agent.status === '训练中' && agent.progress && <div>
              <div className="flex justify-between text-sm mb-1">
                <span className="text-gray-400">训练进度</span>
                <span className="text-yellow-400">{agent.progress}%</span>
              </div>
              <Progress value={agent.progress} className="h-2" />
            </div>}
        </div>

        <div className="flex space-x-2">
          {agent.status === '待训练' && <Button size="sm" onClick={() => onTrain(agent._id)} className="flex-1 bg-gradient-to-r from-cyan-500 to-cyan-600">
              <Play className="w-4 h-4 mr-1" />
              开始训练
            </Button>}
          
          {agent.status === '已训练' && <Button size="sm" variant="outline" onClick={() => onUse(agent._id)} className="flex-1 border-gray-600 hover:border-cyan-400">
              使用智能体
            </Button>}
          
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-white">
            <Edit className="w-4 h-4" />
          </Button>
          
          <Button size="sm" variant="ghost" className="text-gray-400 hover:text-red-400" onClick={() => onDelete(agent._id)}>
            <Trash2 className="w-4 h-4" />
          </Button>
        </div>
      </CardContent>
    </Card>;
}