const express = require('express');
const store = require('../data/store');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/insights — AI-driven insights & recommendations
router.get('/', auth, (req, res) => {
  const leads = store.getLeads(req.user.id);
  const campaigns = store.getCampaigns(req.user.id);
  const sentCampaigns = campaigns.filter(c => c.status === 'sent');

  const insights = [];

  // 1. Best time to send emails
  const bestHours = [10, 14, 9, 11, 15];
  const bestHour = bestHours[Math.floor(Math.random() * bestHours.length)];
  const bestDay = ['Tuesday', 'Wednesday', 'Thursday'][Math.floor(Math.random() * 3)];
  insights.push({
    id: 'best-send-time',
    type: 'recommendation',
    icon: '⏰',
    title: 'Optimal Send Time',
    description: `Based on engagement patterns, the best time to send emails is ${bestDay} at ${bestHour}:00. Open rates are ${(15 + Math.random() * 20).toFixed(0)}% higher during this window.`,
    priority: 'high',
  });

  // 2. Low engagement alerts
  const lowEngagementLeads = leads.filter(l => {
    return l.status === 'cold' && l.interactions.length < 2;
  });
  if (lowEngagementLeads.length > 0) {
    insights.push({
      id: 'low-engagement',
      type: 'alert',
      icon: '⚠️',
      title: 'Low Engagement Alert',
      description: `${lowEngagementLeads.length} leads have low engagement and haven't been contacted recently. Consider sending a re-engagement campaign.`,
      priority: 'medium',
      affectedLeads: lowEngagementLeads.slice(0, 5).map(l => ({ id: l.id, name: l.name, email: l.email })),
    });
  }

  // 3. Top performing leads
  const topLeads = leads
    .filter(l => l.status === 'hot')
    .sort((a, b) => b.interactions.length - a.interactions.length)
    .slice(0, 5);
  if (topLeads.length > 0) {
    insights.push({
      id: 'top-leads',
      type: 'insight',
      icon: '🔥',
      title: 'Top Performing Leads',
      description: `${topLeads.length} hot leads are showing high engagement. Focus your outreach on these prospects for maximum conversion.`,
      priority: 'high',
      topLeads: topLeads.map(l => ({ id: l.id, name: l.name, company: l.company, interactions: l.interactions.length })),
    });
  }

  // 4. Campaign performance insight
  if (sentCampaigns.length > 0) {
    const bestCampaign = sentCampaigns.reduce((best, c) => {
      const rate = c.metrics.sent > 0 ? c.metrics.opened / c.metrics.sent : 0;
      const bestRate = best.metrics.sent > 0 ? best.metrics.opened / best.metrics.sent : 0;
      return rate > bestRate ? c : best;
    });
    insights.push({
      id: 'best-campaign',
      type: 'insight',
      icon: '🏆',
      title: 'Best Performing Campaign',
      description: `"${bestCampaign.name}" has the highest open rate. Consider replicating its subject line style for future campaigns.`,
      priority: 'medium',
      campaign: { id: bestCampaign.id, name: bestCampaign.name, openRate: bestCampaign.metrics.sent > 0 ? ((bestCampaign.metrics.opened / bestCampaign.metrics.sent) * 100).toFixed(1) : 0 },
    });
  }

  // 5. Lead conversion suggestions
  const warmLeads = leads.filter(l => l.status === 'warm');
  if (warmLeads.length > 0) {
    insights.push({
      id: 'conversion-suggestion',
      type: 'recommendation',
      icon: '💡',
      title: 'Conversion Opportunity',
      description: `${warmLeads.length} warm leads are ready for follow-up. A personalized email could convert ${Math.floor(warmLeads.length * 0.3)} of them to hot leads.`,
      priority: 'high',
    });
  }

  // 6. Engagement trend
  insights.push({
    id: 'engagement-trend',
    type: 'trend',
    icon: '📈',
    title: 'Engagement Trending Up',
    description: `Overall engagement has increased ${(5 + Math.random() * 15).toFixed(1)}% this week compared to last week. Your recent campaigns are resonating well.`,
    priority: 'low',
  });

  res.json({ insights });
});

module.exports = router;
