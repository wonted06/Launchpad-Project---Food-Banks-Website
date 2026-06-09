const Delivery  = require('../models/Delivery');
const FoodBank  = require('../models/FoodBank');

// GET /delivery
exports.getDelivery = async (req, res) => {
  try {
    const foodBanks = await FoodBank.findAll();
    res.render('delivery', {
      pageTitle:     'Delivery – Feed Birmingham',
      pageId:        'delivery',
      foodBanksJson: JSON.stringify(foodBanks),
      delivery:      null,
      error:         null,
    });
  } catch (err) {
    console.error('getDelivery error:', err);
    res.render('delivery', { pageTitle: 'Delivery – Feed Birmingham', pageId: 'delivery',
      foodBanksJson: '[]', delivery: null, error: null });
  }
};

// POST /delivery/request
exports.postDeliveryRequest = async (req, res) => {
  const { name, phone, address, postcode, notes, food_bank_id } = req.body;

  if (!name || !phone || !address || !postcode) {
    const foodBanks = await FoodBank.findAll().catch(() => []);
    return res.render('delivery', {
      pageTitle:     'Delivery – Feed Birmingham',
      pageId:        'delivery',
      foodBanksJson: JSON.stringify(foodBanks),
      delivery:      null,
      error:         'Please fill in all required fields.',
    });
  }

  try {
    const delivery = await Delivery.create({
      name, phone, address, postcode, notes,
      foodBankId: food_bank_id || null,
      userId:     req.session.userId || null,
    });
    res.redirect(`/delivery/track?ref=${delivery.reference}`);
  } catch (err) {
    console.error('postDeliveryRequest error:', err);
    const foodBanks = await FoodBank.findAll().catch(() => []);
    res.render('delivery', {
      pageTitle:     'Delivery – Feed Birmingham',
      pageId:        'delivery',
      foodBanksJson: JSON.stringify(foodBanks),
      delivery:      null,
      error:         'Something went wrong. Please try again.',
    });
  }
};

// GET /delivery/track?ref=FB-2026-0001
exports.getTrackDelivery = async (req, res) => {
  const { ref } = req.query;
  let delivery = null;

  if (ref) {
    try { delivery = await Delivery.findByReference(ref); } catch (_) {}
  }

  const foodBanks = await FoodBank.findAll().catch(() => []);
  res.render('delivery', {
    pageTitle:     'Track Delivery – Feed Birmingham',
    pageId:        'delivery',
    foodBanksJson: JSON.stringify(foodBanks),
    delivery,
    activeTab:     'track',
    error:         delivery === null && ref ? 'No delivery found with that reference number.' : null,
  });
};