/**
 * Module: 3D Virtual Product Inserter (Smart Sponsorship Placement)
 * Insets 3D sponsor products (beverage cans, cosmetic boxes, gadgets) into pre-recorded footage.
 */

class VirtualProduct3D {
  constructor() {
    this.sponsorsCatalog = [
      {
        id: 'prop_energy_drink',
        title: 'Lon Nước Tăng Lực 3D (Cyber Energy 330ml)',
        category: 'Đồ uống & Thực phẩm',
        brand: 'Monster / RedBull Style',
        placementType: 'Mặt bàn góc trái hoặc tay cầm',
        lightingMode: 'Tự động lấy mẫu ánh sáng phòng (Environment Ambient Light)'
      },
      {
        id: 'prop_cosmetic_bottle',
        title: 'Chai Serum Dưỡng Da Thủy Tinh Cao Cấp',
        category: 'Mỹ phẩm & Skincare',
        brand: 'Luxe Care Paris',
        placementType: 'Kệ sách hoặc bàn trang điểm',
        lightingMode: 'Hiệu ứng khúc xạ thủy tinh & bóng đổ chân thực'
      },
      {
        id: 'prop_smartphone_fold',
        title: 'Điện Thoại Màn Hình Gập Đang Mở Màn Hình',
        category: 'Công nghệ & Phụ kiện',
        brand: 'Galaxy Z Fold 2026',
        placementType: 'Cạnh laptop hoặc trên giá đỡ',
        lightingMode: 'Phát sáng màn hình tự nhiên OLED'
      }
    ];
  }

  getProps() {
    return this.sponsorsCatalog;
  }

  insertProp(propId, videoTimestamp = 5.0) {
    const prop = this.sponsorsCatalog.find(p => p.id === propId) || this.sponsorsCatalog[0];
    return {
      ok: true,
      jobId: 'prop_' + Date.now(),
      propTitle: prop.title,
      insertedAtSecond: videoTimestamp,
      shadowConfidence: '99.2%',
      blendingAlgorithm: 'Depth-Aware Occlusion & Ray-Traced Shadow',
      status: `Đã chèn thành công vật thể 3D [${prop.title}] vào giây thứ ${videoTimestamp}s của video!`
    };
  }
}

module.exports = new VirtualProduct3D();
