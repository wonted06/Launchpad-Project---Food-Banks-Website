exports.getDelivery = (req, res) => {
    res.render('delivery', { pageTitle: 'Delivery – Feed Birmingham', pageId: 'delivery' });
};

exports.postDeliveryRequest = (req, res) => {
    // TODO: validate body, call Delivery.create(req.body)
    res.redirect('/delivery');
};

exports.getTrackDelivery = (req, res) => {
    const { ref } = req.query;
    // TODO: call Delivery.findByReference(ref)
    res.render('delivery', { pageTitle: 'Track Delivery – Feed Birmingham', pageId: 'delivery', ref });
};
