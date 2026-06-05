exports.getInventory = (req, res) => {
    const { q, category } = req.query;
    // TODO: call Inventory.findAll({ query: q, category })
    res.render('inventory', {
        pageTitle: 'Inventory – Feed Birmingham',
        pageId: 'inventory',
        query: q || '',
        category: category || '',
    });
};
