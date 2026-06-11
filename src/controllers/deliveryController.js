const Delivery  = require('../models/Delivery');
const FoodBank  = require('../models/FoodBank');

// ── GET /delivery ─────────────────────────────────────────────
// Loads all food banks and passes them as JSON so the client-side
// postcode search can calculate distances with the Haversine formula.
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

// ── POST /delivery/request ────────────────────────────────────
// Validates required fields, creates the delivery record, and redirects
// to the tracking page with the generated reference number (PRG pattern).
exports.postDeliveryRequest = async (req, res) => {
  const { name, phone, address, postcode, notes, food_bank_id } = req.body;

  // Basic server-side check before hitting the DB
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
    // userId is optional — guests can also request deliveries
    const delivery = await Delivery.create({
      name, phone, address, postcode, notes,
      foodBankId: food_bank_id || null,
      userId:     req.session.userId || null,
    });
    // Redirect to tracking page so the user immediately sees their reference number
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

// ── GET /delivery/track?ref=FB-2026-0001 ─────────────────────
// Looks up a delivery by its reference number and passes it to the template.
// The template uses the food bank's lat/lng to draw a route map via OSRM.
exports.getTrackDelivery = async (req, res) => {
  const { ref } = req.query;
  let delivery = null;

  if (ref) {
    // Silently ignore DB errors — the error message is handled via the null check below
    try { delivery = await Delivery.findByReference(ref); } catch (_) {}
  }

  const foodBanks = await FoodBank.findAll().catch(() => []);
  res.render('delivery', {
    pageTitle:     'Track Delivery – Feed Birmingham',
    pageId:        'delivery',
    foodBanksJson: JSON.stringify(foodBanks),
    delivery,
    activeTab:     'track',
    // Show an error only if a ref was supplied but nothing was found
    error:         delivery === null && ref ? 'No delivery found with that reference number.' : null,
  });
};