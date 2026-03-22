const express = require('express');
const store = require('../data/store');
const auth = require('../middleware/auth');

const router = express.Router();

// GET /api/leads — list all leads (with optional status filter)
router.get('/', auth, (req, res) => {
  let leads = store.getLeads(req.user.id);

  if (req.query.status) {
    leads = leads.filter(l => l.status === req.query.status);
  }
  if (req.query.search) {
    const s = req.query.search.toLowerCase();
    leads = leads.filter(l =>
      l.name.toLowerCase().includes(s) ||
      l.email.toLowerCase().includes(s) ||
      (l.company && l.company.toLowerCase().includes(s))
    );
  }

  res.json({ leads });
});

// GET /api/leads/:id
router.get('/:id', auth, (req, res) => {
  const lead = store.getLeadById(req.params.id, req.user.id);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  res.json({ lead });
});

// POST /api/leads
router.post('/', auth, (req, res) => {
  const { name, email, company, status, phone, tags } = req.body;
  if (!name || !email) {
    return res.status(400).json({ error: 'Name and email are required.' });
  }

  const lead = store.createLead({
    name,
    email,
    company: company || '',
    phone: phone || '',
    status: status || 'cold',
    tags: tags || [],
    owner: req.user.id,
  });

  res.status(201).json({ lead });
});

// PUT /api/leads/:id
router.put('/:id', auth, (req, res) => {
  const lead = store.updateLead(req.params.id, req.user.id, req.body);
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  res.json({ lead });
});

// DELETE /api/leads/:id
router.delete('/:id', auth, (req, res) => {
  const deleted = store.deleteLead(req.params.id, req.user.id);
  if (!deleted) return res.status(404).json({ error: 'Lead not found.' });
  res.json({ message: 'Lead deleted.' });
});

// POST /api/leads/:id/interactions
router.post('/:id/interactions', auth, (req, res) => {
  const { type, note } = req.body;
  if (!type) return res.status(400).json({ error: 'Interaction type is required.' });

  const lead = store.addInteraction(req.params.id, req.user.id, { type, note: note || '' });
  if (!lead) return res.status(404).json({ error: 'Lead not found.' });
  res.json({ lead });
});

module.exports = router;
