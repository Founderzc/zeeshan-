export interface PricingTierData {
  id: string;
  name: string;
  category: 'starter' | 'professional' | 'enterprise';
  tagline: string;
  badge?: string;
  recommended?: boolean;
  highlightLabel?: string;
  pricing: {
    usd: {
      perProject: {
        price: number;
        originalPrice?: number;
        unit: string;
        deliveryTime: string;
        savingsNote?: string;
      };
      monthly: {
        price: number;
        originalPrice?: number;
        unit: string;
        deliveryTime: string;
        savingsNote?: string;
      };
    };
    pkr: {
      perProject: {
        price: number;
        originalPrice?: number;
        unit: string;
        deliveryTime: string;
        savingsNote?: string;
      };
      monthly: {
        price: number;
        originalPrice?: number;
        unit: string;
        deliveryTime: string;
        savingsNote?: string;
      };
    };
  };
  features: {
    included: string[];
    turnaround: string;
    revisions: string;
    deliverables: string;
    support: string;
  };
  idealFor: string;
  ctaText?: string;
  whatsappPreset: string;
}

export const PRICING_TIERS: PricingTierData[] = [
  {
    id: 'starter',
    name: 'Starter',
    category: 'starter',
    tagline: 'Precision hook engineering for single video drops or CTR validation tests.',
    recommended: false,
    pricing: {
      usd: {
        perProject: {
          price: 12,
          unit: '/ thumbnail',
          deliveryTime: '24-Hour Express',
        },
        monthly: {
          price: 99,
          originalPrice: 120,
          unit: '/ month',
          deliveryTime: '24-Hour Turnaround',
          savingsNote: 'Save 18%',
        },
      },
      pkr: {
        perProject: {
          price: 3300,
          unit: '/ thumbnail',
          deliveryTime: '24-Hour Express',
        },
        monthly: {
          price: 27500,
          originalPrice: 33000,
          unit: '/ month',
          deliveryTime: '24-Hour Turnaround',
          savingsNote: 'Save 17%',
        },
      },
    },
    features: {
      included: [
        '1 Custom High-CTR Thumbnail Concept',
        'Psychological Visual Hook Framing',
        'Resolution-Independent 4K Output (3840×2160)',
        'Layered PSD & Master Source Assets',
        'Algorithm Feed Visual Contrast Test',
      ],
      turnaround: '24 Hours',
      revisions: '2 Iterative Revisions',
      deliverables: 'PNG, JPG & Layered PSD',
      support: 'Standard Email & Chat Support',
    },
    idealFor: 'Emerging creators, single video tests, or pilot uploads.',
    ctaText: 'Select Starter',
    whatsappPreset: "Hi Zeeshan! I'm interested in the Starter tier for my upcoming YouTube video.",
  },
  {
    id: 'professional',
    name: 'Professional',
    category: 'professional',
    tagline: 'High-velocity visual psychology suite built for creators uploading weekly.',
    recommended: true,
    badge: 'MOST POPULAR • TOP CTR',
    highlightLabel: 'Recommended by Top Creators',
    pricing: {
      usd: {
        perProject: {
          price: 60,
          originalPrice: 75,
          unit: '/ 5-pack',
          deliveryTime: '12-Hour Priority',
        },
        monthly: {
          price: 399,
          originalPrice: 480,
          unit: '/ month (10 thumbs)',
          deliveryTime: 'Same-Day Fast-Track',
          savingsNote: 'Save 20%',
        },
      },
      pkr: {
        perProject: {
          price: 16500,
          originalPrice: 20000,
          unit: '/ 5-pack',
          deliveryTime: '12-Hour Priority',
        },
        monthly: {
          price: 109000,
          originalPrice: 132000,
          unit: '/ month (10 thumbs)',
          deliveryTime: 'Same-Day Fast-Track',
          savingsNote: 'Save 20%',
        },
      },
    },
    features: {
      included: [
        '5 High-CTR Thumbnails (Batch Pack)',
        'A/B Split Test Hook Variants Included',
        'Deep Competitor & Niche Gap Analysis',
        'Custom Facial Expression Retouching & Lighting',
        'Direct WhatsApp VIP Priority Channel',
        'Unlimited Organic Design Revisions',
      ],
      turnaround: '12-Hour Fast-Track',
      revisions: 'Unlimited Revisions',
      deliverables: 'Ultra 4K + Split Test Variants + PSDs',
      support: 'Dedicated VIP WhatsApp Line',
    },
    idealFor: 'Active YouTubers publishing 1-2 videos weekly wanting maximum CTR.',
    ctaText: 'Select Professional',
    whatsappPreset: "Hi Zeeshan! I'd like to get started with the Professional package for consistent CTR growth.",
  },
  {
    id: 'enterprise',
    name: 'Enterprise',
    category: 'enterprise',
    tagline: 'Full-spectrum art direction & thumbnail architecture for media studios and 500K+ channels.',
    recommended: false,
    badge: 'STUDIO DIRECT',
    pricing: {
      usd: {
        perProject: {
          price: 120,
          originalPrice: 150,
          unit: '/ 10-pack',
          deliveryTime: 'Same-Day Priority',
        },
        monthly: {
          price: 790,
          originalPrice: 990,
          unit: '/ month (Unlimited)',
          deliveryTime: 'VIP Same-Day SLA',
          savingsNote: 'Save 25%',
        },
      },
      pkr: {
        perProject: {
          price: 33000,
          originalPrice: 41000,
          unit: '/ 10-pack',
          deliveryTime: 'Same-Day Priority',
        },
        monthly: {
          price: 219000,
          originalPrice: 275000,
          unit: '/ month (Unlimited)',
          deliveryTime: 'VIP Same-Day SLA',
          savingsNote: 'Save 25%',
        },
      },
    },
    features: {
      included: [
        '10+ Studio-Grade Thumbnails / Full Channel Retainer',
        'Dedicated Creative Art Director & Lead Designer',
        'Complete Channel Visual Audit & CTR Growth Strategy',
        'Multi-Variant A/B/C Test Package per Upload',
        '1-on-1 Monthly Video Strategy & Retention Session',
        'Priority Emergency 6-Hour Turnaround Slot',
      ],
      turnaround: 'VIP Same-Day / 6-Hour Slot',
      revisions: 'Unlimited Priority Revisions',
      deliverables: 'Studio Production Suite & Raw Project Files',
      support: '1-on-1 Dedicated Creative Lead & Slack/WhatsApp',
    },
    idealFor: 'High-volume production companies, podcasts, and top-tier creator brands.',
    ctaText: 'Select Enterprise',
    whatsappPreset: "Hi Zeeshan! We want to discuss the Enterprise tier for our channel's visual strategy and thumbnail retainer.",
  },
];
