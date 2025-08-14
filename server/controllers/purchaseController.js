const generatePurchaseLink = (req, res) => {
  // Simulate generating a purchase link
  const cart_url = 'https://example.com/cart?items=' + encodeURIComponent(JSON.stringify(req.body.ingredients));
  res.json({ success: true, data: { cart_url } });
};

module.exports = { generatePurchaseLink };