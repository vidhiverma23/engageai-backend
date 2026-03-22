const express = require('express');
const store = require('../data/store');
const auth = require('../middleware/auth');
const { sendCampaignEmail } = require('../services/email');

const router = express.Router();

// GET /api/campaigns
router.get('/', auth, (req, res) => {
  const campaigns = store.getCampaigns(req.user.id);
  res.json({ campaigns });
});

// GET /api/campaigns/:id
router.get('/:id', auth, (req, res) => {
  const campaign = store.getCampaignById(req.params.id, req.user.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found.' });
  res.json({ campaign });
});

// POST /api/campaigns
router.post('/', auth, (req, res) => {
  const { name, subject, body, recipients, scheduledAt } = req.body;
  if (!name || !subject || !body) {
    return res.status(400).json({ error: 'Name, subject, and body are required.' });
  }

  const campaign = store.createCampaign({
    name,
    subject,
    body,
    recipients: recipients || [],
    scheduledAt: scheduledAt || null,
    status: scheduledAt ? 'scheduled' : 'draft',
    owner: req.user.id,
  });

  res.status(201).json({ campaign });
});

// PUT /api/campaigns/:id
router.put('/:id', auth, (req, res) => {
  const campaign = store.updateCampaign(req.params.id, req.user.id, req.body);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found.' });
  res.json({ campaign });
});

// DELETE /api/campaigns/:id
router.delete('/:id', auth, (req, res) => {
  const deleted = store.deleteCampaign(req.params.id, req.user.id);
  if (!deleted) return res.status(404).json({ error: 'Campaign not found.' });
  res.json({ message: 'Campaign deleted.' });
});

// POST /api/campaigns/:id/send — send campaign emails
router.post('/:id/send', auth, async (req, res) => {
  const campaign = store.getCampaignById(req.params.id, req.user.id);
  if (!campaign) return res.status(404).json({ error: 'Campaign not found.' });

  // Get lead emails as recipients
  const leads = store.getLeads(req.user.id);
  const recipientEmails = campaign.recipients.length > 0
    ? campaign.recipients
    : leads.map(l => l.email);

  let sentCount = 0;
  for (const email of recipientEmails.slice(0, 5)) {
    const result = await sendCampaignEmail(email, campaign.subject, campaign.body);
    if (result.success) sentCount++;
  }

  // Update campaign metrics with simulated engagement
  const opened = Math.floor(sentCount * (0.4 + Math.random() * 0.3));
  const clicked = Math.floor(opened * (0.3 + Math.random() * 0.3));
  const converted = Math.floor(clicked * (0.2 + Math.random() * 0.3));

  store.updateCampaign(req.params.id, req.user.id, {
    status: 'sent',
    sentAt: new Date().toISOString(),
    metrics: { sent: sentCount, opened, clicked, converted },
  });

  res.json({
    message: `Campaign sent to ${sentCount} recipients.`,
    campaign: store.getCampaignById(req.params.id, req.user.id),
  });
});

module.exports = router;
