'use client';

import { User } from '@supabase/supabase-js';
import { useTranslations } from '@/utils/i18n/TranslationsContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  MessageSquare,
  Lightbulb,
  FileText,
  Clock,
  ArrowUpRight,
  Activity,
  TrendingUp,
  Sparkles,
  X
} from 'lucide-react';
import { LineChart, PieChart } from '@/components/ui/charts';
import { format } from 'date-fns';
import { motion } from 'framer-motion';
import { useState } from 'react';
import { FloatingIdeaButton } from './FloatingIdeaButton';

interface DashboardOverviewProps {
  user: User;
}

export const BUSINESS_IDEAS = [
  {
    title: 'AI Talent Agent',
    description: 'Autonomous AI agents that scout and negotiate talent contracts using real-time market data'
  },
  {
    title: 'Climate Action AI',
    description: 'AI agents that optimize carbon credit trading and sustainability initiatives across organizations'
  },
  {
    title: 'Neuro-Symbolic AI Broker',
    description: 'Hybrid AI systems that combine neural networks and symbolic reasoning for complex decision-making'
  },
  {
    title: 'AI Governance Platform',
    description: 'Decentralized autonomous organization (DAO) managed by AI agents for protocol upgrades and treasury management'
  },
  {
    title: 'Quantum AI Optimizer',
    description: 'AI agents that leverage quantum computing for solving combinatorial optimization problems'
  },
  {
    title: 'AI Venture Scout',
    description: 'Autonomous system that identifies and evaluates startup investment opportunities using predictive analytics'
  },
  {
    title: 'Ethical AI Auditor',
    description: 'AI agents that continuously monitor and audit other AI systems for ethical compliance'
  },
  {
    title: 'AI-Powered Legal Negotiator',
    description: 'Autonomous contract negotiation agents with real-time regulatory adaptation'
  },
  {
    title: 'AI Urban Planner',
    description: 'Self-optimizing city management systems that balance infrastructure, ecology, and human needs'
  },
  {
    title: 'AI Research Synthesizer',
    description: 'Autonomous agents that conduct literature reviews and generate novel research hypotheses'
  }
];

export function DashboardOverview({ user }: DashboardOverviewProps) {
  const { t } = useTranslations();
  
  // Mock data - replace with actual data from Supabase
  const stats = {
    totalChats: 24,
    analyzedIdeas: 5,
    processedDocs: 12,
    avgResponseTime: '2.4m',
  };

  const weeklyActivity = [
    { day: 'Mon', chats: 5, ideas: 2 },
    { day: 'Tue', chats: 3, ideas: 1 },
    { day: 'Wed', chats: 7, ideas: 3 },
    { day: 'Thu', chats: 4, ideas: 2 },
    { day: 'Fri', chats: 6, ideas: 4 },
    { day: 'Sat', chats: 2, ideas: 1 },
    { day: 'Sun', chats: 1, ideas: 0 },
  ];

  const documentStatus = [
    { name: 'Processed', value: 8, color: '#8AB661' },
    { name: 'Processing', value: 3, color: '#2F855A' },
    { name: 'Error', value: 1, color: '#dc2626' },
  ];

  const [isVisible, setIsVisible] = useState(true);
  const [idea] = useState(() => 
    BUSINESS_IDEAS[Math.floor(Math.random() * BUSINESS_IDEAS.length)]
  );

  return (
    <div className="flex flex-col h-full max-w-5xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="space-y-2">
        <h1 className="text-3xl font-bold">{t('ai_cofounder.dashboard.title')}</h1>
        <p className="text-muted-foreground">
          {t('ai_cofounder.dashboard.subtitle')} {format(new Date(), 'MMM dd, yyyy')}
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard
          icon={<MessageSquare className="w-6 h-6" />}
          title={t('ai_cofounder.dashboard.total_chats')}
          value={stats.totalChats}
          trend={12}
        />
        <StatCard
          icon={<Lightbulb className="w-6 h-6" />}
          title={t('ai_cofounder.dashboard.analyzed_ideas')}
          value={stats.analyzedIdeas}
          trend={8}
        />
        <StatCard
          icon={<FileText className="w-6 h-6" />}
          title={t('ai_cofounder.dashboard.processed_docs')}
          value={stats.processedDocs}
          trend={-3}
        />
        <StatCard
          icon={<Clock className="w-6 h-6" />}
          title={t('ai_cofounder.dashboard.avg_response')}
          value={stats.avgResponseTime}
        />
      </div>

      {/* Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="p-6">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-medium">{t('ai_cofounder.dashboard.activity')}</h3>
            <Button variant="ghost" size="sm">
              {t('ai_cofounder.dashboard.last_7_days')}
            </Button>
          </div>
          <LineChart
            data={weeklyActivity}
            index="day"
            categories={['chats', 'ideas']}
            colors={['#8AB661', '#2F855A']}
            height={300}
          />
        </Card>

        <Card className="p-6">
          <h3 className="font-medium mb-4">{t('ai_cofounder.dashboard.doc_status')}</h3>
          <div className="flex items-center gap-6">
            <div className="flex-1">
              <PieChart
                data={documentStatus}
                height={200}
                width={200}
                innerRadius={60}
                paddingAngle={2}
              />
            </div>
            <div className="space-y-4">
              {documentStatus.map((status) => (
                <div key={status.name} className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: status.color }}
                  />
                  <span className="text-sm">{status.name}</span>
                  <span className="text-sm text-muted-foreground">
                    ({status.value})
                  </span>
                </div>
              ))}
            </div>
          </div>
        </Card>
      </div>

      {/* Recent Activity */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-medium">{t('ai_cofounder.dashboard.recent_activity')}</h3>
          <Button variant="ghost" size="sm">
            {t('ai_cofounder.dashboard.view_all')}
          </Button>
        </div>
        <div className="space-y-4">
          {[1, 2, 3].map((i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="flex items-center justify-between p-3 hover:bg-muted/50 rounded-lg"
            >
              <div className="flex items-center gap-3">
                <div className="p-2 rounded-full bg-primary/10">
                  <Activity className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium">
                    {t(`ai_cofounder.dashboard.activity_title_${i}`)}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {t(`ai_cofounder.dashboard.activity_desc_${i}`)}
                  </p>
                </div>
              </div>
              <span className="text-sm text-muted-foreground">
                2h ago
              </span>
            </motion.div>
          ))}
        </div>
      </Card>

      <FloatingIdeaButton />
    </div>
  );
}

function StatCard({ icon, title, value, trend }: { 
  icon: React.ReactNode;
  title: string;
  value: string | number;
  trend?: number;
}) {
  return (
    <Card className="p-6">
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <div className="flex items-center gap-2 text-muted-foreground">
            {icon}
            <span className="text-sm">{title}</span>
          </div>
          <div className="text-2xl font-bold">{value}</div>
        </div>
        {trend && (
          <div className={`flex items-center gap-1 ${trend > 0 ? 'text-green-600' : 'text-destructive'}`}>
            <ArrowUpRight className={`w-4 h-4 ${trend < 0 && 'rotate-180'}`} />
            <span className="text-sm font-medium">{Math.abs(trend)}%</span>
          </div>
        )}
      </div>
    </Card>
  );
} 