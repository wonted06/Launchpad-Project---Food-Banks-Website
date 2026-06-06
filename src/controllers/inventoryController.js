const Inventory = require('../models/Inventory');

exports.getInventory = async (req, res) => {
  const { q, category } = req.query;

  try {
    const [inventory, categories] = await Promise.all([
      Inventory.getAll({ category, query: q }),
      Inventory.getCategories()
    ]);

    res.render('inventory', {
      pageTitle: 'Inventory – Feed Birmingham',
      pageId: 'inventory',
      query: q || '',
      category: category || '',
      inventory,
      categories
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
      error: 'Could not load inventory data.'
    });
  }
};
