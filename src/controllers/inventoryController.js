const Inventory = require('../models/Inventory');
const FoodBank = require('../models/FoodBank');

// ── GET /inventory ────────────────────────────────────────────
// Fetches inventory and category data in parallel for efficiency.
// Accepts optional ?q (name search) and ?category filter from the URL.
exports.getInventory = async (req, res) => {
  const { q, category } = req.query;

  try {
    // Run both queries simultaneously rather than sequentially
    const [inventory, categories] = await Promise.all([
      Inventory.getAll({ category, query: q }),
      Inventory.getCategories()
    ]);

    // Food bank list is loaded separately so a failure here doesn't break the whole page
    let foodBanks = [];
    try {
      foodBanks = await FoodBank.findAll();
      console.log('[inventory] foodBanks loaded:', foodBanks.length);
    } catch (fbErr) {
      console.error('[inventory] FoodBank.findAll() failed:', fbErr.message);
    }

    res.render('inventory', {
      pageTitle: 'Inventory – Feed Birmingham',
      pageId: 'inventory',
      query: q || '',
      category: category || '',
      inventory,
      categories,
      foodBanks
    });
  } catch (err) {
    console.error('Inventory fetch error:', err);
    // Return a 500 but still render the page shell so the user sees a helpful message
    res.status(500).render('inventory', {
      pageTitle: 'Inventory – Feed Birmingham',
      pageId: 'inventory',
      query: q || '',
      category: category || '',
      inventory: [],
      categories: [],
      foodBanks:[],
      error: 'Could not load inventory data.'
    });
  }
};
