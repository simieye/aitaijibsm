// @ts-ignore;
import React from 'react';
// @ts-ignore;
import { Calendar, Clock, Download, ExternalLink, AlertTriangle } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Badge, Progress } from '@/components/ui';

export function CurrentSubscription({
  subscription,
  plan,
  onManage,
  onCancel,
  loading
}) {
  if (!subscription || !plan) {
    return <Card className="bg-gray-900 border-gray-700">
      <CardContent className="p-6">
        <h3 className="text-lg font-semibold text-white mb-4">当前订阅</h3>
        <div className="text-center py-8">
          <div className="text-gray-400 mb-4">暂无活跃订阅</div>
          <Button onClick={onManage} className="bg-gradient-to-r from-cyan-500 to-cyan-600">
            选择套餐
          </Button>
        </div>
      </CardContent>
    </Card>;
  }
  const getStatusBadge = status => {
    switch (status) {
      case 'active':
        return <Badge className="bg-green-500/20 text-green-400">活跃</Badge>;
      case 'trialing':
        return <Badge className="bg-blue-500/20 text-blue-400">试用中</Badge>;
      case 'past_due':
        return <Badge className="bg-yellow-500/20 text-yellow-400">付款逾期</Badge>;
      case 'canceled':
        return <Badge className="bg-red-500/20 text-red-400">已取消</Badge>;
      default:
        return <Badge className="bg-gray-500/20 text-gray-400">{status}</Badge>;
    }
  };
  const formatDate = dateString => {
    return new Date(dateString).toLocaleDateString('zh-CN', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  const calculateDaysRemaining = () => {
    const endDate = new Date(subscription.currentPeriodEnd);
    const today = new Date();
    const diffTime = endDate - today;
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return Math.max(0, diffDays);
  };
  const daysRemaining = calculateDaysRemaining();
  const progress = subscription.trialEnd ? Math.max(0, 100 - daysRemaining / 14 * 100) : 0;
  return <Card className="bg-gray-900 border-gray-700">
    <CardContent className="p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-white">当前订阅</h3>
        {getStatusBadge(subscription.status)}
      </div>

      <div className="space-y-4">
        <div>
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">套餐</span>
            <span className="text-white font-semibold">{plan.name}</span>
          </div>
          
          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">价格</span>
            <span className="text-cyan-400 font-semibold">¥{plan.price / 100}/{plan.interval === 'month' ? '月' : '年'}</span>
          </div>

          <div className="flex items-center justify-between mb-2">
            <span className="text-gray-400">周期结束</span>
            <span className="text-gray-300">{formatDate(subscription.currentPeriodEnd)}</span>
          </div>

          {subscription.trialEnd && <div className="flex items-center justify-between mb-2">
              <span className="text-gray-400">试用剩余</span>
              <span className="text-blue-400">{daysRemaining}天</span>
            </div>}
        </div>

        {subscription.trialEnd && <div>
            <div className="flex items-center justify-between mb-2">
              <span className="text-sm text-gray-400">试用进度</span>
              <span className="text-sm text-gray-400">{Math.round(progress)}%</span>
            </div>
            <Progress value={progress} className="h-2" />
          </div>}

        <div className="pt-4 border-t border-gray-700">
          <div className="grid grid-cols-2 gap-2">
            <Button onClick={onManage} variant="outline" className="border-gray-600 hover:border-cyan-400">
              <ExternalLink className="w-4 h-4 mr-2" />
              管理订阅
            </Button>
            
            {subscription.status === 'active' && !subscription.cancelAtPeriodEnd && <Button onClick={onCancel} variant="outline" className="border-red-600 text-red-400 hover:bg-red-600/10">
                <AlertTriangle className="w-4 h-4 mr-2" />
                取消订阅
              </Button>}
            
            {subscription.cancelAtPeriodEnd && <div className="col-span-2 text-center text-sm text-yellow-400">
                订阅将在周期结束时取消
              </div>}
          </div>
        </div>
      </div>
    </CardContent>
  </Card>;
}