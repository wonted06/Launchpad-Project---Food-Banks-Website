const FoodBank = require('../models/FoodBank');

// ── GET /locations ────────────────────────────────────────────
// Loads all food banks from the DB and passes them to the template twice:
// - as an array for the Pug card list
// - as a JSON string for the client-side Leaflet map JS
exports.getLocations = async (req, res) => {
  const { q } = req.query;  // optional search query (pre-fills the search input)
  try {
    const foodBanks = await FoodBank.findAll();
    res.render('locations', {
      pageTitle: 'Find a Food Bank – Feed Birmingham',
      pageId:    'locations',
      foodBanks,
      // Injected into the page as a JS variable so Leaflet can place pins without extra API calls
      foodBanksJson: JSON.stringify(foodBanks),
      searchQuery: q || '',
    });
  } catch (err) {
    console.error('getLocations error:', err);
    // Render an empty page rather than crashing — user sees no cards/pins
    res.render('locations', {
      pageTitle: 'Find a Food Bank – Feed Birmingham',
      pageId:    'locations',
      foodBanks: [],
      foodBanksJson: '[]',
      searchQuery: '',
    });
  }
};

// ── GET /locations/:id ────────────────────────────────────────
// Loads a single food bank by ID for the detail page.
// Redirects back to /locations if the ID doesn't exist.
exports.getFoodBankDetail = async (req, res) => {
  const { id } = req.params;
  try {
    const bank = await FoodBank.findById(id);
    if (!bank) return res.redirect('/locations');
    res.render('foodbank-detail', {
      pageTitle: `${bank.name} – Feed Birmingham`,
      pageId:    'locations',
      bank,
    });
  } catch (err) {
    console.error('getFoodBankDetail error:', err);
    res.redirect('/locations');
  }
};
