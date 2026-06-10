// TODO: const ItemRequest = require('../models/ItemRequest');

exports.createRequest = async (req, res) => {
  // const { item_name, quantity, urgency, notes } = req.body;

  // TODO: Validate with express-validator
  //   - item_name: not empty, max 255 chars
  //   - quantity: positive integer
  //   - urgency: one of ['Low', 'Medium', 'High']
  //   Return 422 with validation errors if invalid

  // TODO: Insert into item_requests table
  //   await ItemRequest.create({
  //     item_name,
  //     quantity: parseInt(quantity, 10),
  //     urgency,
  //     notes: notes || null,
  //     requested_at: new Date()
  //   });

  // TODO: Redirect with flash success message
  //   req.flash('success', 'Your request has been submitted.');
  //   res.redirect('/inventory?requested=1');

  res.redirect('/inventory');
};
