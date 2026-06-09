const FoodBank = require('../models/FoodBank');

exports.getLocations = async (req, res) => {
  const { q } = req.query;  // search query from URL (for server-side fallback)
  try {
    const foodBanks = await FoodBank.findAll();
    res.render('locations', {
      pageTitle: 'Find a Food Bank – Feed Birmingham',
      pageId:    'locations',
      foodBanks,
      // Pass as JSON for the Leaflet map JS
      foodBanksJson: JSON.stringify(foodBanks),
      searchQuery: q || '',
    });
  } catch (err) {
    console.error('getLocations error:', err);
    res.render('locations', {
      pageTitle: 'Find a Food Bank – Feed Birmingham',
      pageId:    'locations',
      foodBanks: [],
      foodBanksJson: '[]',
      searchQuery: '',
    });
  }
};

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
