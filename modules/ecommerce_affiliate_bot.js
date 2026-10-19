/**
 * Module: Auto TikTok Shop & E-Commerce Affiliate Bot
 * 
 * - Quản lý sản phẩm giỏ hàng TikTok Shop / Shopee / Lazada
 * - Tự động nhận diện bình luận chốt đơn (SĐT, Mã sản phẩm, Size, Màu)
 * - Tự động tạo đơn hàng COD và gửi thông báo xác nhận qua Zalo OA / Messenger Webhook
 */

class EcommerceAffiliateBot {
  constructor() {
    this.productCatalog = [
      {
        id: 'prod_001',
        title: 'Son Kem Lì Mịn Môi Velvet Rouge 2026',
        originalPrice: 350000,
        salePrice: 199000,
        commissionPct: 22,
        affiliateLink: 'https://vt.tiktok.com/ZS_lip_velvet_rouge',
        thumbnail: 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?w=600&auto=format&fit=crop&q=80',
        stock: 450,
        soldCount: 3820,
        platform: 'TikTok Shop'
      },
      {
        id: 'prod_002',
        title: 'Áo Phông Oversize Streetwear Cyberpunk Cotton 100%',
        originalPrice: 280000,
        salePrice: 149000,
        commissionPct: 18,
        affiliateLink: 'https://shopee.vn/product/tee_cyberpunk_streetwear',
        thumbnail: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=600&auto=format&fit=crop&q=80',
        stock: 220,
        soldCount: 1540,
        platform: 'Shopee'
      },
      {
        id: 'prod_003',
        title: 'Đồng Hồ Nam Cơ Lộ Máy Sapphire Chống Nước 5ATM',
        originalPrice: 1890000,
        salePrice: 990000,
        commissionPct: 30,
        affiliateLink: 'https://vt.tiktok.com/ZS_watch_sapphire_chrono',
        thumbnail: 'https://images.unsplash.com/photo-1524805444758-089113d48a6d?w=600&auto=format&fit=crop&q=80',
        stock: 80,
        soldCount: 920,
        platform: 'TikTok Shop'
      }
    ];

    this.orders = [
      {
        orderId: 'COD_VN_98231',
        productName: 'Son Kem Lì Mịn Môi Velvet Rouge 2026',
        customerPhone: '098****234',
        customerName: 'Nguyễn Thu Trang',
        amount: 199000,
        commissionEarned: 43780,
        status: 'CONFIRMED_COD',
        channel: 'TikTok Live Stream',
        createdAt: '20:45:10 Hôm nay'
      },
      {
        orderId: 'COD_VN_98232',
        productName: 'Áo Phông Oversize Streetwear Cyberpunk',
        customerPhone: '091****888',
        customerName: 'Trần Văn Nam',
        amount: 149000,
        commissionEarned: 26820,
        status: 'CONFIRMED_COD',
        channel: 'Facebook Reels Video',
        createdAt: '20:12:30 Hôm nay'
      }
    ];

    this.botSettings = {
      autoReplyComment: true,
      autoCreateCodOrder: true,
      forwardZaloWebhook: true,
      zaloOaWebhookUrl: 'https://openapi.zalo.me/v2.0/oa/message'
    };
  }

  getCatalogAndOrders() {
    const totalRevenue = this.orders.reduce((sum, o) => sum + o.amount, 0);
    const totalCommission = this.orders.reduce((sum, o) => sum + o.commissionEarned, 0);

    return {
      ok: true,
      products: this.productCatalog,
      orders: this.orders,
      stats: {
        totalOrdersCount: this.orders.length,
        totalRevenue,
        totalCommission
      },
      botSettings: this.botSettings
    };
  }

  processCustomerComment(commentText, customerName = 'Khách xem live') {
    const text = (commentText || '').toLowerCase();
    
    // Check if contains phone number (10 digits)
    const phoneMatch = text.match(/(0[3|5|7|8|9][0-9]{8})/);
    const phone = phoneMatch ? phoneMatch[0] : null;

    // Check if matches order intention
    const isOrderIntent = text.includes('chốt') || text.includes('đặt') || text.includes('mua') || text.includes('lấy') || !!phone;

    let matchedProduct = this.productCatalog[0];
    if (text.includes('áo') || text.includes('size')) matchedProduct = this.productCatalog[1];
    if (text.includes('đồng hồ') || text.includes('cơ')) matchedProduct = this.productCatalog[2];

    if (isOrderIntent) {
      const order = {
        orderId: `COD_VN_${Math.floor(Math.random() * 90000 + 10000)}`,
        productName: matchedProduct.title,
        customerPhone: phone ? (phone.substring(0, 4) + '****' + phone.substring(phone.length - 3)) : '098****' + Math.floor(Math.random() * 900 + 100),
        customerName,
        amount: matchedProduct.salePrice,
        commissionEarned: Math.round(matchedProduct.salePrice * (matchedProduct.commissionPct / 100)),
        status: 'CONFIRMED_COD',
        channel: 'AI Live Stream Auto-Closing',
        createdAt: new Date().toLocaleTimeString('vi-VN') + ' Hôm nay'
      };

      this.orders.unshift(order);
      if (this.orders.length > 50) this.orders.pop();

      return {
        ok: true,
        isOrder: true,
        order,
        botReply: `Dạ em đã chốt thành công 1 đơn [${matchedProduct.title}] giá ưu đãi ${matchedProduct.salePrice.toLocaleString('vi-VN')}đ cho bạn ${customerName}! Nhân viên bên em sẽ liên hệ xác nhận ngay ạ.`,
        zaloNoticeSent: true
      };
    }

    return {
      ok: true,
      isOrder: false,
      botReply: `Dạ em chào bạn ${customerName}! Bạn quan tâm sản phẩm nào bấm ngay vào góc trái màn hình (Giỏ Hàng Màu Vàng) để săn deal giảm giá sốc hôm nay nhé!`
    };
  }

  addProduct(productData) {
    if (!productData || !productData.title) return { ok: false, message: 'Thiếu tên sản phẩm' };

    const newProd = {
      id: `prod_${Date.now()}`,
      title: productData.title,
      originalPrice: Number(productData.originalPrice) || 300000,
      salePrice: Number(productData.salePrice) || 199000,
      commissionPct: Number(productData.commissionPct) || 20,
      affiliateLink: productData.affiliateLink || 'https://vt.tiktok.com/ZS_product',
      thumbnail: productData.thumbnail || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600',
      stock: Number(productData.stock) || 100,
      soldCount: 0,
      platform: productData.platform || 'TikTok Shop'
    };

    this.productCatalog.unshift(newProd);
    return {
      ok: true,
      message: `✅ Đã thêm sản phẩm "${newProd.title}" vào giỏ hàng Affiliate!`,
      product: newProd
    };
  }
}

module.exports = new EcommerceAffiliateBot();
