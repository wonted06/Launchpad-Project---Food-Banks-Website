const Inventory = require('../models/Inventory');
const FoodBank = require('../models/FoodBank');

exports.getInventory = async (req, res) => {
  const { q, category } = req.query;

  try {
    const [inventory, categories] = await Promise.all([
      Inventory.getAll({ category, query: q }),
      Inventory.getCategories()
    ]);

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
