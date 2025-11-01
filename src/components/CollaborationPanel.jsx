// @ts-ignore;
import React, { useState, useEffect } from 'react';
// @ts-ignore;
import { Users, MessageCircle, Eye, Send, Circle } from 'lucide-react';
// @ts-ignore;
import { Card, CardContent, Input, Button, Avatar, AvatarFallback } from '@/components/ui';

export function CollaborationPanel({
  roomId
}) {
  const [onlineUsers, setOnlineUsers] = useState([]);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  useEffect(() => {
    // 模拟在线用户
    setOnlineUsers([{
      id: 1,
      name: '张总',
      role: '战略总监',
      status: 'active'
    }, {
      id: 2,
      name: '李博士',
      role: '首席经济学家',
      status: 'active'
    }, {
      id: 3,
      name: '王经理',
      role: '产品经理',
      status: 'idle'
    }]);

    // 模拟消息
    setMessages([{
      id: 1,
      user: '张总',
      message: '这个博弈模型很有启发性',
      time: '14:30'
    }, {
      id: 2,
      user: '李博士',
      message: '建议增加政策变量',
      time: '14:32'
    }]);
  }, [roomId]);
  const handleSendMessage = () => {
    if (newMessage.trim()) {
      setMessages([...messages, {
        id: Date.now(),
        user: '我',
        message: newMessage,
        time: new Date().toLocaleTimeString('zh-CN', {
          hour: '2-digit',
          minute: '2-digit'
        })
      }]);
      setNewMessage('');
    }
  };
  return <div className="flex h-96">
      {/* 在线用户 */}
      <div className="w-48 bg-gray-900 border-r border-gray-700 p-4">
        <h3 className="text-sm font-semibold text-white mb-3">在线成员</h3>
        <div className="space-y-2">
          {onlineUsers.map(user => <div key={user.id} className="flex items-center space-x-2">
              <Avatar className="w-8 h-8">
                <AvatarFallback className="text-xs bg-gray-700">
                  {user.name.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1 min-w-0">
                <p className="text-sm text-white truncate">{user.name}</p>
                <p className="text-xs text-gray-400">{user.role}</p>
              </div>
              <Circle className={`w-2 h-2 ${user.status === 'active' ? 'text-green-400' : 'text-gray-400'}`} fill="currentColor" />
            </div>)}
        </div>
      </div>

      {/* 聊天区域 */}
      <div className="flex-1 flex flex-col">
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {messages.map(msg => <div key={msg.id} className="flex items-start space-x-2">
              <Avatar className="w-6 h-6">
                <AvatarFallback className="text-xs bg-gray-700">
                  {msg.user.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <div className="flex-1">
                <div className="flex items-baseline space-x-2">
                  <span className="text-sm font-medium text-white">{msg.user}</span>
                  <span className="text-xs text-gray-400">{msg.time}</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{msg.message}</p>
              </div>
            </div>)}
        </div>

        <div className="border-t border-gray-700 p-4">
          <div className="flex space-x-2">
            <Input value={newMessage} onChange={e => setNewMessage(e.target.value)} onKeyPress={e => e.key === 'Enter' && handleSendMessage()} placeholder="输入消息..." className="bg-gray-800 border-gray-600" />
            <Button size="sm" onClick={handleSendMessage}>
              <Send className="w-4 h-4" />
            </Button>
          </div>
        </div>
      </div>
    </div>;
}