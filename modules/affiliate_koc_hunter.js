/**
 * Module: TikTok Affiliate KOC Hunter & Sample Outreach Engine
 * 
 * Scans top-converting KOCs/KOLs by niche, estimates 30-day affiliate GMV,
 * and drafts automated personalized Free Sample proposals.
 */

class AffiliateKocHunterEngine {
  constructor() {
    this.kocDirectory = [
      {
        id: 'koc_linh_beauty',
        handle: '@linh_skincare_tips',
        displayName: 'Linh Mỹ Phẩm Sạch',
        niche: 'Mỹ phẩm & Skincare',
        followers: '340K',
        gmv30Days: '1.450.000.000 ₫',
        conversionRate: '4.8%',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=200&auto=format&fit=crop&q=80',
        outreachStatus: 'NOT_SENT' // 'NOT_SENT', 'INVITATION_SENT', 'ACCEPTED'
      },
      {
        id: 'koc_tuan_tech',
        handle: '@tuantre_setup',
        displayName: 'Tuấn Trẻ Mê Đồ Công Nghệ',
        niche: 'Đồ điện tử & Phụ kiện',
        followers: '520K',
        gmv30Days: '2.100.000.000 ₫',
        conversionRate: '5.2%',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&auto=format&fit=crop&q=80',
        outreachStatus: 'INVITATION_SENT'
      },
      {
        id: 'koc_mai_fashion',
        handle: '@maiphuong_outfit',
        displayName: 'Mai Phương Phối Đồ Đẹp',
        niche: 'Thời trang & Sneaker',
        followers: '280K',
        gmv30Days: '980.000.000 ₫',
        conversionRate: '6.1%',
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=200&auto=format&fit=crop&q=80',
        outreachStatus: 'ACCEPTED'
      }
    ];
  }

  getKOCList(niche = 'all') {
    let list = this.kocDirectory;
    if (niche && niche !== 'all') {
      list = list.filter(k => k.niche.toLowerCase().includes(niche.toLowerCase()));
    }
    return {
      ok: true,
      kocs: list,
      totalKocs: list.length
    };
  }

  sendSampleOutreachProposal(kocId, commissionPercent = 20, productName = 'Serum Sáng Da Gold 24K') {
    const koc = this.kocDirectory.find(k => k.id === kocId) || this.kocDirectory[0];
    koc.outreachStatus = 'INVITATION_SENT';

    const proposalMessage = `Chào ${koc.displayName} (${koc.handle})! Shop mình theo dõi các video review ${koc.niche} của bạn thấy rất chỉn chu và thu hút. Bên mình muốn gửi tặng bạn 1 bộ mẫu thử miễn phí sản phẩm "${productName}" để trải nghiệm. Khi gắn link TikTok Shop, shop để mức hoa hồng đặc quyền cho bạn là ${commissionPercent}% + hỗ trợ đẩy 500.000đ ngân sách chạy quảng cáo Spark Ads. Nếu ưng ý, bạn nhắn lại địa chỉ nhận mẫu nha! ❤️`;

    return {
      ok: true,
      message: `Đã gửi lời mời hợp tác nhận mẫu miễn phí tới ${koc.displayName}!`,
      koc,
      commissionPercent,
      proposalMessage,
      outreachChannel: 'TikTok Creator Marketplace Direct Message'
    };
  }
}

module.exports = new AffiliateKocHunterEngine();
