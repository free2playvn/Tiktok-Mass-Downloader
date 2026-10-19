/**
 * Module: AI Flash Sale Scarcity & FOMO Sound Alert Engine
 * 
 * Drives 60s countdown urgency, realtime purchase notification popups,
 * and scarce stock alerts to dramatically boost conversion rates.
 */

class FlashSaleFomoEngine {
  constructor() {
    this.state = {
      isActive: false,
      productTitle: 'Áo Thun Cotton 100% Phố Đêm Flash Sale',
      dealPrice: '99.000 ₫',
      originalPrice: '250.000 ₫',
      discountPercent: '-60%',
      remainingStock: 5,
      countdownSeconds: 60,
      fomoAlertSound: 'bell_ting_rush', // 'bell_ting_rush', 'ticking_clock_urgent', 'cash_register'
      recentOrders: [
        { customer: 'Trần Văn Hùng (Hà Nội)', product: 'Áo Thun Đen Size L', time: 'Vừa xong' },
        { customer: 'Nguyễn Thị Mai (TP.HCM)', product: 'Áo Thun Trắng Size M', time: '12 giây trước' },
        { customer: 'Lê Hoàng Long (Đà Nẵng)', product: 'Áo Thun Đen Size XL', time: '28 giây trước' }
      ]
    };
  }

  getFlashSaleState() {
    return {
      ok: true,
      state: this.state
    };
  }

  triggerFlashSale(productTitle, dealPrice, stockCount = 5) {
    this.state.isActive = true;
    this.state.productTitle = productTitle || this.state.productTitle;
    this.state.dealPrice = dealPrice || this.state.dealPrice;
    this.state.remainingStock = stockCount;
    this.state.countdownSeconds = 60;

    return {
      ok: true,
      message: `⚡ ĐÃ BẮT ĐẦU FLASH SALE 60 GIÂY: ${this.state.productTitle}!`,
      state: this.state,
      announcementSpeech: `Cả nhà ơi chú ý! Đúng 60 giây chớp nhoáng duy nhất trong phiên live hôm nay, mẫu ${this.state.productTitle.substring(0, 30)} chỉ còn đúng ${this.state.dealPrice}! Chỉ còn đúng ${this.state.remainingStock} suất cuối cùng trong kho, bấm ngay giỏ hàng số 1 kẻo hết nhé!`
    };
  }

  simulateNewCustomerPurchase(customerName = '', itemName = '') {
    const defaultNames = ['Bùi Phương Anh (Hải Phòng)', 'Đặng Tuấn Kiệt (Cần Thơ)', 'Phạm Thùy Dương (Bình Dương)', 'Hoàng Quốc Bảo (Quảng Ninh)'];
    const chosenName = customerName || defaultNames[Math.floor(Math.random() * defaultNames.length)];
    const chosenItem = itemName || this.state.productTitle;

    if (this.state.remainingStock > 1) {
      this.state.remainingStock--;
    }

    const order = {
      customer: chosenName,
      product: chosenItem,
      time: 'Vừa xong'
    };

    this.state.recentOrders.unshift(order);
    if (this.state.recentOrders.length > 8) this.state.recentOrders.pop();

    return {
      ok: true,
      order,
      remainingStock: this.state.remainingStock,
      fomoNotificationText: `🔥 ${chosenName} vừa chốt 1 đơn! Kho chỉ còn ${this.state.remainingStock} suất!`,
      soundTrigger: 'cash_register_ting'
    };
  }
}

module.exports = new FlashSaleFomoEngine();
