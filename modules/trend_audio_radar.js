/**
 * Module: Trend Velocity Audio Radar
 * Tracks exponential velocity of trending audio clips across TikTok, Douyin & Instagram Reels.
 */

class TrendAudioRadar {
  constructor() {
    this.trendingTracks = [
      {
        id: 'snd_vietmix_hot_01',
        title: 'Nonstop Tết Đong Đầy 2026 (Remix Bass Boost)',
        author: 'QuanRapper & TMD Crew',
        duration: 45,
        videoCount: '1.2M videos',
        growthRate6h: '+420%',
        velocityRank: 1,
        genre: 'Vinahouse / TikTok EDM',
        audioSrc: '/api/stream?file=%40nhacnghedixe%2F7675792462593428756.mp4',
        status: '🔥 Viral Explosion'
      },
      {
        id: 'snd_douyin_chill_02',
        title: 'Thôi Miên Tâm Hồn (Phối Khí Douyin Cổ Phong)',
        author: 'Douyin Sound Master',
        duration: 38,
        videoCount: '650K videos',
        growthRate6h: '+280%',
        velocityRank: 2,
        genre: 'Acoustic / Sad Lofi',
        audioSrc: '/api/stream?file=%40nhacnghedixe%2F7675792462593428756.mp4',
        status: '📈 Đang Tăng Nhanh'
      },
      {
        id: 'snd_hormozi_boom_03',
        title: 'Hormozi Dramatic Podcast Boom & Synth Pulse',
        author: 'Creator Sound FX',
        duration: 30,
        videoCount: '320K videos',
        growthRate6h: '+195%',
        velocityRank: 3,
        genre: 'Voiceover BGM / Storytelling',
        audioSrc: '/api/stream?file=%40nhacnghedixe%2F7675792462593428756.mp4',
        status: '✨ Hot Creator'
      },
      {
        id: 'snd_speed_up_phonk_04',
        title: 'Kordhell Brazilian Phonk (Speed Up 1.25x)',
        author: 'Global Viral Sound',
        duration: 25,
        videoCount: '890K videos',
        growthRate6h: '+340%',
        velocityRank: 4,
        genre: 'Phonk / Gym Workout / Gaming',
        audioSrc: '/api/stream?file=%40nhacnghedixe%2F7675792462593428756.mp4',
        status: '🔥 Trending Toàn Cầu'
      }
    ];
  }

  getTrendingTracks() {
    return this.trendingTracks;
  }

  getTrackById(id) {
    return this.trendingTracks.find(t => t.id === id) || this.trendingTracks[0];
  }
}

module.exports = new TrendAudioRadar();
