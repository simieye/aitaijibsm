// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Users, Plus } from 'lucide-react';
// @ts-ignore;
import { Button } from '@/components/ui';

export function EmptyState({
  onCreate
}) {
  return <div className="text-center py-12">
    <Users className="w-16 h-16 text-gray-600 mx-auto mb-4" />
    <h3 className="text-xl font-semibold text-gray-400 mb-2">暂无智能体</h3>
    <p className="text-gray-500 mb-4">开始创建您的第一个AI智能体</p>
    <Button onClick={onCreate} className="bg-gradient-to-r from-cyan-500 to-cyan-600">
      <Plus className="w-4 h-4 mr-2" />
      创建智能体
    </Button>
  </div>;
}