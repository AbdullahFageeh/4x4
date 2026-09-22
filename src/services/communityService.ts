import { Community, CommunityMember, CreateCommunityInput, CommunityFilter } from '../types/community';

// Demo data — real Saudi car communities
export const DEMO_COMMUNITIES: Community[] = [
  {
    id: 'comm-001',
    name: 'LC Club KSA',
    description: 'مجتمع ملاك تويوتا لاند كروزر في السعودية. نخطط رحلات برية وسياحية بشكل دوري.',
    car_model: 'Toyota Land Cruiser',
    cover_image_url: 'https://images.unsplash.com/photo-1549317661-bd32c8ce0db2?w=800',
    visibility: 'public',
    invite_code: 'LC-KSA-2026',
    rules: '• الاحترام المتبادل بين الأعضاء\n• الالتزام بالمواعيد في الرحلات\n• عدم نشر محتوى غير لائق\n• الالتزام بقيادة آمنة',
    member_count: 234,
    created_by: 'demo-user',
    created_at: '2026-01-15T10:00:00Z',
    updated_at: '2026-09-20T15:30:00Z',
  },
  {
    id: 'comm-002',
    name: 'باترول السعودي',
    description: 'مجموعة لمحبي نيسان باترول. رحلات برية في جميع مناطق المملكة.',
    car_model: 'Nissan Patrol',
    cover_image_url: 'https://images.unsplash.com/photo-1502877338535-766e1452684a?w=800',
    visibility: 'public',
    invite_code: 'PATROL-SA',
    rules: '• ممنوع السباقات الخطيرة\n• المساعدة بين الأعضاء\n• الإبلاغ عن المخالفات',
    member_count: 189,
    created_by: 'demo-user',
    created_at: '2026-02-20T10:00:00Z',
    updated_at: '2026-09-18T12:00:00Z',
  },
  {
    id: 'comm-003',
    name: 'يوتا أوف رود',
    description: 'مجتمع Jeep Wrangler السعودي. متخصص في الطرق الوعرة والتطعيس.',
    car_model: 'Jeep Wrangler',
    cover_image_url: 'https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?w=800',
    visibility: 'public',
    invite_code: 'JEEP-OFFROAD',
    rules: '• السلامة أولاً\n• عدم المخاطرة الفردية\n• احترام البيئة',
    member_count: 156,
    created_by: 'demo-user',
    created_at: '2026-03-10T10:00:00Z',
    updated_at: '2026-09-15T09:00:00Z',
  },
  {
    id: 'comm-004',
    name: 'هيلكس التمشيطة',
    description: 'رحبات برية بسيارات تويوتا هيلكس. تخييم وتطعيس في شمال المملكة.',
    car_model: 'Toyota Hilux',
    cover_image_url: 'https://images.unsplash.com/photo-1559416523-140ddc3d238c?w=800',
    visibility: 'public',
    invite_code: 'HILUX-TAM',
    rules: '• روح الفريق\n• ترك المكان نظيفاً\n• المساعدة في الشدات',
    member_count: 98,
    created_by: 'demo-user',
    created_at: '2026-04-05T10:00:00Z',
    updated_at: '2026-09-10T14:00:00Z',
  },
  {
    id: 'comm-005',
    name: 'جي كليبس الرياض',
    description: 'لقاءات أسبوعية لملاك Jeep Grand Cherokee في الرياض. تعارف ورحلات قصيرة.',
    car_model: 'Jeep Grand Cherokee',
    cover_image_url: 'https://images.unsplash.com/photo-1544620347-c4fd4a3d5957?w=800',
    visibility: 'private',
    invite_code: 'GCLUB-RYD',
    rules: '• حضور لقاء واحد على الأقل شهرياً\n• المشاركة في الرحلات الاختيارية',
    member_count: 56,
    created_by: 'demo-user',
    created_at: '2026-05-12T10:00:00Z',
    updated_at: '2026-09-08T11:00:00Z',
  },
  {
    id: 'comm-006',
    name: 'سيدان السعودي',
    description: 'مجتمع محبي السيارات السيدان. رحلات سياحية وتناول الطعام معاً.',
    car_model: 'Various Sedans',
    cover_image_url: 'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=800',
    visibility: 'public',
    invite_code: 'SEDAN-SA',
    rules: '• ممنوع السباقات\n• الالتزام بالمواعيد',
    member_count: 312,
    created_by: 'demo-user',
    created_at: '2026-01-01T10:00:00Z',
    updated_at: '2026-09-22T08:00:00Z',
  },
];

export const DEMO_MEMBERS: CommunityMember[] = [
  { community_id: 'comm-001', user_id: 'user-001', role: 'organizer', status: 'approved', joined_at: '2026-01-15T10:00:00Z' },
  { community_id: 'comm-001', user_id: 'user-002', role: 'member', status: 'approved', joined_at: '2026-01-20T10:00:00Z' },
  { community_id: 'comm-001', user_id: 'user-003', role: 'member', status: 'pending', joined_at: '2026-09-20T10:00:00Z' },
  { community_id: 'comm-002', user_id: 'user-001', role: 'member', status: 'approved', joined_at: '2026-02-25T10:00:00Z' },
  { community_id: 'comm-002', user_id: 'user-004', role: 'organizer', status: 'approved', joined_at: '2026-02-20T10:00:00Z' },
];

// Simulated API service
class CommunityService {
  private communities: Community[] = [...DEMO_COMMUNITIES];
  private members: CommunityMember[] = [...DEMO_MEMBERS];

  async getCommunities(filter?: CommunityFilter): Promise<Community[]> {
    await this.delay();
    let result = [...this.communities];

    if (filter?.search) {
      const search = filter.search.toLowerCase();
      result = result.filter(
        (c) =>
          c.name.toLowerCase().includes(search) ||
          c.car_model.toLowerCase().includes(search) ||
          c.description.toLowerCase().includes(search)
      );
    }

    if (filter?.car_model) {
      result = result.filter((c) => c.car_model === filter.car_model);
    }

    return result;
  }

  async getCommunity(id: string): Promise<Community | null> {
    await this.delay();
    return this.communities.find((c) => c.id === id) || null;
  }

  async createCommunity(input: CreateCommunityInput, userId: string): Promise<Community> {
    await this.delay();
    const newCommunity: Community = {
      id: `comm-${Date.now()}`,
      name: input.name,
      description: input.description,
      car_model: input.car_model,
      cover_image_url: input.cover_image_url || null,
      visibility: input.visibility,
      invite_code: this.generateInviteCode(),
      rules: input.rules,
      member_count: 1,
      created_by: userId,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
    };

    this.communities.push(newCommunity);

    // Auto-add creator as organizer
    this.members.push({
      community_id: newCommunity.id,
      user_id: userId,
      role: 'organizer',
      status: 'approved',
      joined_at: new Date().toISOString(),
    });

    return newCommunity;
  }

  async joinCommunity(communityId: string, userId: string): Promise<CommunityMember> {
    await this.delay();
    const community = this.communities.find((c) => c.id === communityId);
    if (!community) throw new Error('Community not found');

    const existing = this.members.find(
      (m) => m.community_id === communityId && m.user_id === userId
    );
    if (existing) throw new Error('Already a member');

    const member: CommunityMember = {
      community_id: communityId,
      user_id: userId,
      role: 'member',
      status: community.visibility === 'public' ? 'approved' : 'pending',
      joined_at: new Date().toISOString(),
    };

    this.members.push(member);

    if (community.visibility === 'public') {
      community.member_count++;
    }

    return member;
  }

  async getMembers(communityId: string): Promise<CommunityMember[]> {
    await this.delay();
    return this.members.filter(
      (m) => m.community_id === communityId && m.status === 'approved'
    );
  }

  async getUserCommunities(userId: string): Promise<Community[]> {
    await this.delay();
    const userMembers = this.members.filter(
      (m) => m.user_id === userId && m.status === 'approved'
    );
    return this.communities.filter((c) =>
      userMembers.some((m) => m.community_id === c.id)
    );
  }

  private generateInviteCode(): string {
    return Math.random().toString(36).substring(2, 8).toUpperCase();
  }

  private delay(): Promise<void> {
    return new Promise((resolve) => setTimeout(resolve, 300 + Math.random() * 200));
  }
}

export const communityService = new CommunityService();
