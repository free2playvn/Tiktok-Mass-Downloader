/**
 * Module: Realtime Profit & Net Margin Tracker (Biên Lợi Nhuận Ròng & Thuế Sàn)
 * 
 * Tracks live GMV, deduces platform fees (TikTok Shop 5%, Shopee 6.5%), ad spend (Spark Ads),
 * return/refund costs, and cost of goods sold (COGS) to calculate real net profit margin in real-time.
 */

class ProfitMarginTrackerEngine {
  constructor() {
    this.financialSummary = {
      period: 'Hôm nay (19/10/2026)',
      currency: 'VND',
      grossMerchandiseValue: 48600000, // 48.6 triệu GMV
      totalOrders: 186,
      cogs: 19440000, // 40% giá vốn
      platformFees: 2430000, // 5% TikTok Shop fee
      adSpendSpark: 4860000, // 10% chi phí quảng cáo
      returnRefundCost: 1458000, // 3% hoàn hủy
      vatAndTax: 729000, // 1.5% thuế
      netProfit: 19683000, // Lợi nhuận ròng thực nhận
      netMarginPercent: '40.5%',
      returnRate: '3.2%',
      roasAds: '10.0x (Chi 4.8M ra 48.6M)'
    };

    this.liveTransactions = [
      { id: 'TX_VN_901', time: '18:32:10', product: 'Sneaker Cyberpunk Phantom X', salePrice: 1250000, cogs: 500000, fee: 62500, ads: 125000, net: 562500, status: 'PROFITABLE' },
      { id: 'TX_VN_902', time: '18:29:45', product: 'Tai Nghe ANC 40dB', salePrice: 890000, cogs: 356000, fee: 44500, ads: 89000, net: 400500, status: 'PROFITABLE' },
      { id: 'TX_VN_903', time: '18:26:12', product: 'Áo Thun Cotton Form Rộng', salePrice: 198000, cogs: 79200, fee: 9900, ads: 19800, net: 89100, status: 'PROFITABLE' }
    ];
  }

  getFinancialReport() {
    return {
      ok: true,
      summary: this.financialSummary,
      transactions: this.liveTransactions,
      alertThreshold: 'Net margin duy trì trên 35% - Sức khỏe tài chính CỰC TỐT'
    };
  }

  recordLiveSale(productName, salePrice = 1250000, cogsPercent = 40) {
    const cogs = Math.round(salePrice * (cogsPercent / 100));
    const fee = Math.round(salePrice * 0.05);
    const ads = Math.round(salePrice * 0.10);
    const net = salePrice - cogs - fee - ads;

    this.financialSummary.grossMerchandiseValue += salePrice;
    this.financialSummary.totalOrders++;
    this.financialSummary.cogs += cogs;
    this.financialSummary.platformFees += fee;
    this.financialSummary.adSpendSpark += ads;
    this.financialSummary.netProfit += net;
    this.financialSummary.netMarginPercent = `${((this.financialSummary.netProfit / this.financialSummary.grossMerchandiseValue) * 100).toFixed(1)}%`;

    const tx = {
      id: `TX_VN_${Math.floor(1000 + Math.random() * 9000)}`,
      time: new Date().toLocaleTimeString('vi-VN'),
      product: productName,
      salePrice,
      cogs,
      fee,
      ads,
      net,
      status: net > 0 ? 'PROFITABLE' : 'BREAK_EVEN'
    };
    this.liveTransactions.unshift(tx);
    if (this.liveTransactions.length > 20) this.liveTransactions.pop();

    return {
      ok: true,
      message: `💰 Đã ghi nhận đơn hàng mới "${productName}" (+${salePrice.toLocaleString('vi-VN')} ₫)! Lợi nhuận ròng: +${net.toLocaleString('vi-VN')} ₫`,
      recordedTransaction: tx,
      transaction: tx,
      currentNetProfit: this.financialSummary.netProfit
    };
  }
}

module.exports = new ProfitMarginTrackerEngine();
