exports.getLocations = (req, res) => {
    const { postcode } = req.query;
    // TODO: call FoodBank.findNearPostcode(postcode) when DB is wired up
    res.render('locations', {
        pageTitle: 'Find a Food Bank – Feed Birmingham',
        pageId: 'locations',
        postcode: postcode || '',
        foodBanks: [],
    });
};

exports.getFoodBankDetail = (req, res) => {
    const { id } = req.params;
    // TODO: call FoodBank.findById(id)
    res.render('foodbank-detail', {
        pageTitle: 'Food Bank Details – Feed Birmingham',
        pageId: 'locations',
        bank: { id },
    });
};
