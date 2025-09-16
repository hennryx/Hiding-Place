exports.getStocksInfo = async (allProducts) => {
    const minimumStock = allProducts.filter(p => p.totalStock <= 10 && p.totalStock > 0).length;
    const outStock = allProducts.filter(p => p.totalStock === 0).length;
    const totalNumberItems = allProducts.length;

    return {
        minimumStock,
        outStock,
        totalNumberItems
    }
}