import type { BlogPost, BlogSettings } from '@/lib/blog'

export const seedBlogSettings: BlogSettings = {
  enabled: true,
  title: 'Journal',
  description: 'Stories, styling notes and care guides from the LOOM studio.',
  showInNav: true,
  showOnHome: true,
  homeHeading: 'From the journal',
  postsPerPage: 9,
}

export const seedPosts: BlogPost[] = [
  {
    slug: 'how-to-care-for-linen',
    title: 'How to Care for Linen So It Lasts for Years',
    excerpt:
      'Linen gets softer with every wash — if you treat it right. Our studio guide to washing, drying and storing your favourite pieces.',
    content: `Linen is one of the oldest fabrics in the world, and one of the most forgiving. With a little care, a good linen shirt will outlast almost anything else in your wardrobe.

## Washing

Wash linen on a **cool or lukewarm cycle** (30–40°C) with a gentle, bleach-free detergent. Avoid overloading the machine — linen needs room to move.

- Turn garments inside out to protect the surface
- Wash darks and lights separately
- Skip fabric softener; linen softens naturally over time

## Drying

Line drying is best. Shake each piece out and hang it while still slightly damp to reduce creasing. If you must tumble dry, use a low setting and remove items before they're fully dry.

> Wrinkles are part of linen's charm. Embrace a little texture.

## Storing

Fold linen loosely and store it somewhere cool and dry. Avoid plastic bags, which trap moisture — a cotton garment bag is ideal.

Looking for a new favourite? Explore our [linen and cotton essentials](/shop).`,
    coverImage: '/images/blog-linen-care.png',
    coverAlt: 'Folded linen shirts in cream, oat and sage on a wooden table',
    author: 'The LOOM Studio',
    category: 'Care Guides',
    tags: ['linen', 'care', 'sustainability'],
    publishedAt: '2026-10-20',
    updatedAt: '2026-10-20',
    status: 'published',
    featured: true,
  },
  {
    slug: 'building-a-capsule-wardrobe',
    title: 'Building a Capsule Wardrobe in Ten Pieces',
    excerpt:
      'Fewer, better things. A practical framework for a wardrobe that works across seasons, occasions and moods.',
    content: `A capsule wardrobe isn't about owning less for the sake of it — it's about owning pieces that all work together.

## Start with the foundations

Begin with neutral, versatile basics you reach for every week:

1. A tailored overcoat in camel or charcoal
2. Two crisp oxford shirts
3. A fine-gauge knit
4. Well-fitting chinos or trousers
5. Clean leather sneakers

## Add character

Once the foundations are set, introduce one or two pieces with texture or colour — a slubby linen blazer, a printed dress, a soft cardigan.

## Choose quality materials

Natural fibres like **wool, cotton and linen** age beautifully and are easier to repair. Investing in them means you'll replace things far less often.

## Edit regularly

Twice a year, take everything out and ask: *did I wear this?* Donate, repair or rehome what no longer earns its place.`,
    coverImage: '/images/blog-capsule-wardrobe.png',
    coverAlt: 'A minimal wardrobe of coats, knits and shirts on a wooden rail',
    author: 'Maya Chen',
    category: 'Style Notes',
    tags: ['style', 'capsule wardrobe', 'essentials'],
    publishedAt: '2026-10-12',
    updatedAt: '2026-10-12',
    status: 'published',
    featured: false,
  },
  {
    slug: 'dressing-kids-for-play',
    title: 'Dressing Kids for Play: Comfort First',
    excerpt:
      'Soft fabrics, roomy fits and pieces that survive the park. What we look for when designing our kids collection.',
    content: `Kids don't sit still, so their clothes shouldn't hold them back.

## Softness matters

We use **organic cotton** for almost everything in our kids range — it's breathable, gentle on sensitive skin and gets softer with every wash.

## Built to move

Look for elasticated waists, gusseted knees and relaxed cuts that leave room to climb, run and tumble.

## Made to be handed down

Reinforced seams and durable hardware mean our pieces can be passed between siblings and friends — the most sustainable garment is one that's already been made.

Browse the [kids collection](/shop/kids) to see the latest arrivals.`,
    coverImage: '/images/blog-kids-play.png',
    coverAlt: 'Children’s cotton clothes and canvas sneakers laid on a wool rug',
    author: 'The LOOM Studio',
    category: 'Behind the Seams',
    tags: ['kids', 'organic cotton'],
    publishedAt: '2026-10-02',
    updatedAt: '2026-10-02',
    status: 'published',
    featured: false,
  },
]
