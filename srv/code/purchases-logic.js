/**
 * 
 * @On(event = { "CREATE" }, entity = "loyaltyProgramSrv.Purchases")
 * @param {Object} request - User information, tenant-specific CDS model, headers and query parameters
*/
module.exports = async function(request) {
    // Calculate reward points
    request.data.rewardPoints = Math.floor(request.data.purchaseValue / 10);

    // Update the related customer's total purchase value and total reward points
    const customer = await SELECT.one.from('loyaltyProgramSrv.Customers').where({ ID: request.data.customer_ID });
    if (customer) {
        customer.totalPurchaseValue += request.data.purchaseValue;
        customer.totalRewardPoints += request.data.rewardPoints;
        await UPDATE('loyaltyProgramSrv.Customers').set({
            totalPurchaseValue: customer.totalPurchaseValue,
            totalRewardPoints: customer.totalRewardPoints
        }).where({ ID: customer.ID });
    }
}