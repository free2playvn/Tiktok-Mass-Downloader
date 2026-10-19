/**
 * Module 4: TikTok Shop & Shopee Affiliate Auto-Linker & Pin Comment Seeding
 * Identifies high-converting products from video transcript and automates pinned affiliate comment seeding.
 */

class AffiliateMonetization {
  constructor() {
    this.productDatabase = [
      {
        keyword: 'tai nghe',
        name: 'Tai Nghe Bluetooth Không Dây Chống Ồn ANC',
        category: 'electronics',
        originalPrice: 450000,
        dealPrice: 229000,
        commissionRate: '22%',
        platform: 'TikTok Shop / Shopee',
        affiliateUrl: 'https://vt.tiktok.com/ZS_EarPhoneDeal/',
        thumb: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?w=300&auto=format&fit=crop&q=60',
        soldCount: '45.2K đã bán'
      },
      {
        keyword: 'điện thoại',
        name: 'Giá Đỡ Điện Thoại Hợp Kim Xoay 360 Độ Cao Cấp',
        category: 'accessories',
        originalPrice: 180000,
        dealPrice: 89000,
        commissionRate: '30%',
        platform: 'TikTok Shop',
        affiliateUrl: 'https://vt.tiktok.com/ZS_PhoneHolderDeal/',
        thumb: 'https://images.unsplash.com/photo-1586105251261-72a756497a11?w=300&auto=format&fit=crop&q=60',
        soldCount: '128.5K đã bán'
      },
      {
        keyword: 'áo',
        name: 'Áo Thun Cotton Unisex Form Rộng Dày Dặn Local Brand',
        category: 'fashion',
        originalPrice: 250000,
        dealPrice: 149000,
        commissionRate: '18%',
        platform: 'TikTok Shop / Shopee',
        affiliateUrl: 'https://vt.tiktok.com/ZS_TshirtStreetwear/',
        thumb: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=300&auto=format&fit=crop&q=60',
        soldCount: '63.9K đã bán'
      },
      {
        keyword: 'đèn',
        name: 'Đèn LED RGB Hoàng Hôn Sunset Decor Phòng Chill',
        category: 'home',
        originalPrice: 210000,
        dealPrice: 99000,
        commissionRate: '25%',
        platform: 'TikTok Shop',
        affiliateUrl: 'https://vt.tiktok.com/ZS_SunsetLampDecor/',
        thumb: 'https://images.unsplash.com/photo-1513506003901-1e6a229e2d15?w=300&auto=format&fit=crop&q=60',
        soldCount: '32.1K đã bán'
      }
    ];
  }

  /**
   * Scan transcript and video meta for product keywords
   */
  detectProducts(text = '') {
    const lower = text.toLowerCase();
    const matched = [];

    for (const p of this.productDatabase) {
      if (lower.includes(p.keyword)) {
        matched.push(p);
      }
    }

    if (matched.length === 0) {
      // Default to best-selling tech accessory
      matched.push(this.productDatabase[0]);
    }

    return matched;
  }

  /**
   * Generate paired seeding comments and auto-pinned comment
   */
  generateSeedingPlan(product, authorName = 'Chủ Kênh') {
    return {
      ok: true,
      product,
      pinnedComment: {
        author: authorName,
        text: `🔥 Cả nhà ơi, em ${product.name} đang sale chỉ ${product.dealPrice.toLocaleString('vi-VN')}đ (Giảm ${(100 - Math.round(product.dealPrice / product.originalPrice * 100))}%). Link đặt chính hãng được trợ giá tại đây nha 👉 ${product.affiliateUrl}`,
        isPinned: true
      },
      cloneSeedingComments: [
        {
          cloneName: 'Nguyễn Văn Đạt (Clone 1)',
          text: `Sản phẩm này dùng êm không shop ơi? Em tính mua về dùng thử.`
        },
        {
          cloneName: 'Thu Trang Review (Clone 2)',
          text: `Em nhận hàng rồi nha shop, dùng ngon xuất sắc trong tầm giá luôn!`
        },
        {
          cloneName: 'Gia Bảo TikTok (Clone 3)',
          text: `Còn được áp mã freeship giảm thêm 30k không ạ?`
        }
      ]
    };
  }
}

module.exports = new AffiliateMonetization();
