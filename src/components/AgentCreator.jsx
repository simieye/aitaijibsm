// @ts-ignore;
import React, { useState } from 'react';
// @ts-ignore;
import { Plus, User, Briefcase, Brain, Save, X } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Input, Textarea, Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui';

export function AgentCreator({
  onSave,
  onCancel
}) {
  const [agent, setAgent] = useState({
    name: '',
    role: '',
    background: '',
    personality: '',
    expertise: [],
    dataSource: ''
  });
  const roles = ['CEO/创始人', '投资总监', '战略顾问', '产品经理', '市场总监', '技术总监', '财务总监', '法务总监'];
  const personalities = ['激进型', '稳健型', '保守型', '创新型', '分析型', '直觉型'];
  const handleSave = () => {
    onSave(agent);
  };
  return <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-xl font-bold text-white">创建AI智能体</h3>
          <Button variant="ghost" size="sm" onClick={onCancel}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <User className="w-4 h-4 inline mr-2" />
              智能体名称
            </label>
            <Input value={agent.name} onChange={e => setAgent({
            ...agent,
            name: e.target.value
          })} placeholder="例如：张总-新能源CEO" className="bg-gray-800 border-gray-600" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Briefcase className="w-4 h-4 inline mr-2" />
              角色定位
            </label>
            <Select value={agent.role} onValueChange={value => setAgent({
            ...agent,
            role: value
          })}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="选择角色" />
              </SelectTrigger>
              <SelectContent>
                {roles.map(role => <SelectItem key={role} value={role}>{role}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              背景描述
            </label>
            <Textarea value={agent.background} onChange={e => setAgent({
            ...agent,
            background: e.target.value
          })} placeholder="描述该角色的职业背景、经验等..." className="bg-gray-800 border-gray-600 min-h-[100px]" />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              <Brain className="w-4 h-4 inline mr-2" />
              决策风格
            </label>
            <Select value={agent.personality} onValueChange={value => setAgent({
            ...agent,
            personality: value
          })}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="选择决策风格" />
              </SelectTrigger>
              <SelectContent>
                {personalities.map(p => <SelectItem key={p} value={p}>{p}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">
              数据源
            </label>
            <Select value={agent.dataSource} onValueChange={value => setAgent({
            ...agent,
            dataSource: value
          })}>
              <SelectTrigger className="bg-gray-800 border-gray-600">
                <SelectValue placeholder="选择训练数据源" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="linkedin">LinkedIn公开数据</SelectItem>
                <SelectItem value="interview">深度访谈数据</SelectItem>
                <SelectItem value="internal">企业内部数据</SelectItem>
                <SelectItem value="custom">自定义数据</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex justify-end space-x-3 mt-6">
          <Button variant="outline" onClick={onCancel}>
            取消
          </Button>
          <Button onClick={handleSave} className="bg-gradient-to-r from-cyan-500 to-cyan-600">
            <Save className="w-4 h-4 mr-2" />
            保存智能体
          </Button>
        </div>
      </CardContent>
    </Card>;
}