// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Check, X, Zap, Users, FileText, Clock, ArrowUp, ArrowDown, Download } from 'lucide-react';
// @ts-ignore;
import { Button, Card, CardContent, Badge, Progress } from '@/components/ui';

export function SubscriptionPlans({
  plans,
  currentSubscription,
  onSubscribe,
  loading
}) {
  const [selectedPlan, setSelectedPlan] = useState(null);
  const getPlanFeatures = plan => {
    const features = {
      free: [{
        name: '基础智能体',
        value: '3个',
        included: true
      }, {
        name: '月度报告',
        value: '5份',
        included: true
      }, {
        name: '基础分析',
        value: '标准',
        included: true
      }, {
        name: '高级AI模型',
        value: '无',
        included: false
      }, {
        name: 'API访问',
        value: '无',
        included: false
      }],
      pro: [{
        name: '智能体数量',
        value: '50个',
        included: true
      }, {
        name: '月度报告',
        value: '50份',
        included: true
      }, {
        name: '高级分析',
        value: '完整',
        included: true
      }, {
        name: '高级AI模型',
        value: 'GPT-4',
        included: true
      }, {
        name: 'API访问',
        value: '1000次/月',
        included: true
      }],
      enterprise: [{
        name: '智能体数量',
        value: '无限',
        included: true
      }, {
        name: '月度报告',
        value: '无限',
        included: true
      }, {
        name: '企业级分析',
        value: '完整',
        included: true
      }, {
        name: '自定义AI模型',
        value: '支持',
        included: true
      }, {
        name: 'API访问',
        value: '无限',
        included: true
      }]
    };
    return features[plan.name.toLowerCase()] || features.free;
  };
  const getPriceDisplay = plan => {
    const price = plan.price / 100;
    return plan.interval === 'month' ? `¥${price}/月` : `¥${price}/年`;
  };
  const isCurrentPlan = plan => {
    return currentSubscription && currentSubscription.planId === plan._id;
  };
  const canUpgrade = plan => {
    if (!currentSubscription) return true;
    const currentPlan = plans.find(p => p._id === currentSubscription.planId);
    if (!currentPlan) return true;
    return plan.sortOrder > currentPlan.sortOrder;
  };
  const canDowngrade = plan => {
    if (!currentSubscription) return false;
    const currentPlan = plans.find(p => p._id === currentSubscription.planId);
    if (!currentPlan) return false;
    return plan.sortOrder < currentPlan.sortOrder;
  };
  if (loading) {
    return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
      {[1, 2, 3].map(i => <Card key={i} className="bg-gray-900 border-gray-700">
        <CardContent className="p-6">
          <div className="animate-pulse">
            <div className="h-6 bg-gray-700 rounded w-1/3 mb-4"></div>
            <div className="h-8 bg-gray-700 rounded w-1/2 mb-4"></div>
            <div className="space-y-2">
              {[1, 2, 3, 4, 5].map(j => <div key={j} className="h-4 bg-gray-800 rounded"></div>)}
            </div>
          </div>
        </CardContent>
      </Card>)}
    </div>;
  }
  return <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
    {plans.map(plan => {
      const features = getPlanFeatures(plan);
      const current = isCurrentPlan(plan);
      const upgrade = canUpgrade(plan);
      const downgrade = canDowngrade(plan);
      return <Card key={plan._id} className={`bg-gray-900 border-gray-700 ${current ? 'border-cyan-500' : ''} ${plan.name === 'Pro' ? 'border-purple-500' : ''}`}>
          <CardContent className="p-6">
            <div className="text-center mb-6">
              <h3 className="text-xl font-bold text-white mb-2">{plan.name}</h3>
              <div className="text-3xl font-bold text-cyan-400 mb-1">{getPriceDisplay(plan)}</div>
              <p className="text-sm text-gray-400">{plan.description}</p>
              {current && <Badge className="mt-2 bg-cyan-500/20 text-cyan-400">当前套餐</Badge>}
            </div>

            <div className="space-y-3 mb-6">
              {features.map((feature, index) => <div key={index} className="flex items-center justify-between">
                  <span className={`text-sm ${feature.included ? 'text-gray-300' : 'text-gray-500'}`}>{feature.name}</span>
                  {feature.included ? <Check className="w-4 h-4 text-green-400" /> : <X className="w-4 h-4 text-gray-500" />}
                </div>)}
            </div>

            <div className="space-y-2">
              {current ? <Button disabled className="w-full bg-gray-700 text-gray-400">
                  当前套餐
                </Button> : <>
                  <Button onClick={() => onSubscribe(plan._id)} disabled={!upgrade && !downgrade} className={`w-full ${upgrade ? 'bg-gradient-to-r from-green-500 to-green-600' : downgrade ? 'bg-gradient-to-r from-orange-500 to-orange-600' : 'bg-gray-700'}`}>
                    {upgrade ? <>
                        <ArrowUp className="w-4 h-4 mr-2" />
                        升级
                      </> : downgrade ? <>
                        <ArrowDown className="w-4 h-4 mr-2" />
                        降级
                      </> : '当前套餐'}
                  </Button>
                </>}
            </div>
          </CardContent>
        </Card>;
    })}
  </div>;
}