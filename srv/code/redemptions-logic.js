/**
 * 
 * @On(event = { "CREATE" }, entity = "loyaltyProgramSrv.Redemptions")
 * @param {Object} req - User information, tenant-specific CDS model, headers and query parameters
*/
module.exports = async function(req) {
  const { redeemedAmount, customer_ID } = req.data;

  // Fetch the customer's current total reward points and total redeemed reward points
  const [{ totalRewardPoints, totalRedeemedRewardPoints }] = await SELECT.from('loyaltyProgramSrv.Customers')
    .where({ ID: customer_ID })
    .columns('totalRewardPoints', 'totalRedeemedRewardPoints');

  // Check if the customer has enough reward points to redeem
  if (totalRewardPoints < redeemedAmount) {
    req.reject(400, `Customer does not have enough reward points to redeem.`);
    return;
  }

  // Deduct the redemption amount from the customer's total reward points
  const updatedTotalRewardPoints = totalRewardPoints - redeemedAmount;

  // Add the redemption amount to the customer's total redeemed reward points
  const updatedTotalRedeemedRewardPoints = totalRedeemedRewardPoints + redeemedAmount;

  // Update the customer's total reward points and total redeemed reward points
  await UPDATE('loyaltyProgramSrv.Customers')
    .set({
      totalRewardPoints: updatedTotalRewardPoints,
      totalRedeemedRewardPoints: updatedTotalRedeemedRewardPoints
    })
    .where({ ID: customer_ID });
}