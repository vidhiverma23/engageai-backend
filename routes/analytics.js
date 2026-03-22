const express = require('express');
const store = require('../data/store');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/analytics/overview
router.get('/overview', auth, (req, res) => {
  const leads = store.getLeads(req.user.id);
  const campaigns = store.getCampaigns(req.user.id);

  const totalLeads = leads.length;
  const hotLeads = leads.filter(l => l.status === 'hot').length;
  const warmLeads = leads.filter(l => l.status === 'warm').length;
  const coldLeads = leads.filter(l => l.status === 'cold').length;

  const totalCampaigns = campaigns.length;
  const sentCampaigns = campaigns.filter(c => c.status === 'sent');

  let totalSent = 0, totalOpened = 0, totalClicked = 0, totalConverted = 0;
  sentCampaigns.forEach(c => {
    totalSent += c.metrics.sent;
    totalOpened += c.metrics.opened;
    totalClicked += c.metrics.clicked;
    totalConverted += c.metrics.converted;
  });

  const openRate = totalSent > 0 ? ((totalOpened / totalSent) * 100).toFixed(1) : 0;
  const clickRate = totalOpened > 0 ? ((totalClicked / totalOpened) * 100).toFixed(1) : 0;
  const conversionRate = totalClicked > 0 ? ((totalConverted / totalClicked) * 100).toFixed(1) : 0;

  res.json({
    overview: {
      totalLeads,
      leadsByStatus: { hot: hotLeads, warm: warmLeads, cold: coldLeads },
      totalCampaigns,
      sentCampaigns: sentCampaigns.length,
      metrics: {
        totalSent,
        totalOpened,
        totalClicked,
        totalConverted,
        openRate: parseFloat(openRate),
        clickRate: parseFloat(clickRate),
        conversionRate: parseFloat(conversionRate),
      },
    },
  });
});

// GET /api/analytics/campaigns — per-campaign metrics
router.get('/campaigns', auth, (req, res) => {
  const campaigns = store.getCampaigns(req.user.id);

  const campaignMetrics = campaigns
    .filter(c => c.status === 'sent')
    .map(c => ({
      id: c.id,
      name: c.name,
      sentAt: c.sentAt,
      metrics: c.metrics,
      openRate: c.metrics.sent > 0 ? ((c.metrics.opened / c.metrics.sent) * 100).toFixed(1) : 0,
      clickRate: c.metrics.opened > 0 ? ((c.metrics.clicked / c.metrics.opened) * 100).toFixed(1) : 0,
      conversionRate: c.metrics.clicked > 0 ? ((c.metrics.converted / c.metrics.clicked) * 100).toFixed(1) : 0,
    }));

  res.json({ campaignMetrics });
});

// GET /api/analytics/timeline — engagement over time (last 7 days simulated)
router.get('/timeline', auth, (req, res) => {
  const days = [];
  for (let i = 6; i >= 0; i--) {
    const date = new Date();
    date.setDate(date.getDate() - i);
    days.push({
      date: date.toISOString().split('T')[0],
      opens: Math.floor(Math.random() * 50) + 20,
      clicks: Math.floor(Math.random() * 30) + 10,
      conversions: Math.floor(Math.random() * 15) + 5,
    });
  }
  res.json({ timeline: days });
});

// GET /api/analytics/lead-funnel
router.get('/lead-funnel', auth, (req, res) => {
  const leads = store.getLeads(req.user.id);
  const total = leads.length;
  const contacted = leads.filter(l => l.interactions.length > 0).length;
  const warm = leads.filter(l => l.status === 'warm' || l.status === 'hot').length;
  const hot = leads.filter(l => l.status === 'hot').length;

  res.json({
    funnel: [
      { stage: 'Total Leads', count: total },
      { stage: 'Contacted', count: contacted },
      { stage: 'Engaged (Warm+Hot)', count: warm },
      { stage: 'Hot Leads', count: hot },
    ],
  });
});

module.exports = router;
