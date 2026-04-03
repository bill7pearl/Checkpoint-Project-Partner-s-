require('dotenv').config({ path: require('path').join(__dirname, '..', '.env') });
// Also try local .env
require('dotenv').config();

const { sequelize, Category, Product } = require('../models');

const categories = [
  { name: 'Floral', slug: 'floral', description: 'Delicate and romantic scents featuring rose, jasmine, lavender, and other flower essences.', image_url: 'https://images.unsplash.com/photo-1490750967868-88aa4f44baee?w=600' },
  { name: 'Woody', slug: 'woody', description: 'Warm and earthy fragrances with notes of sandalwood, cedar, vetiver, and oud.', image_url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=600' },
  { name: 'Oriental', slug: 'oriental', description: 'Rich and exotic blends featuring amber, musk, vanilla, and precious spices.', image_url: 'https://images.unsplash.com/photo-1547887538-047f814bfb64?w=600' },
  { name: 'Fresh', slug: 'fresh', description: 'Clean and invigorating scents with green, aquatic, and herbal notes.', image_url: 'https://images.unsplash.com/photo-1495435798646-a289417deff8?w=600' },
  { name: 'Citrus', slug: 'citrus', description: 'Bright and energizing fragrances bursting with lemon, bergamot, orange, and grapefruit.', image_url: 'https://images.unsplash.com/photo-1611070276506-27db8abd4d52?w=600' },
  { name: 'Aquatic', slug: 'aquatic', description: 'Ocean-inspired scents evoking sea breeze, rain, and marine freshness.', image_url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=600' },
  { name: 'Gourmand', slug: 'gourmand', description: 'Sweet and edible-inspired fragrances featuring vanilla, caramel, chocolate, and coffee.', image_url: 'https://images.unsplash.com/photo-1563805042-7684c019e1cb?w=600' },
  { name: 'Spicy', slug: 'spicy', description: 'Bold and warming scents with cinnamon, pepper, cardamom, and clove.', image_url: 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=600' }
];

const products = [
  // Floral
  { name: 'Rose Éternelle', description: 'A timeless floral masterpiece. Bulgarian rose petals dance with dewy peony and a whisper of white musk, creating an ethereal bouquet that lingers from dawn to dusk.', price: 125.00, stock: 25, brand: 'Maison Lumière', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', categorySlug: 'floral' },
  { name: 'Jasmine Nocturne', description: 'Egyptian jasmine sambac blooms under moonlight, intertwined with soft vanilla orchid and warm amber. An intoxicating evening fragrance.', price: 98.00, stock: 30, brand: 'Nuit Parfums', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1594035910387-fea081db797e?w=500', categorySlug: 'floral' },
  { name: 'Lily of Dreams', description: 'Pristine lily of the valley meets sparkling bergamot and creamy sandalwood. A delicate daytime fragrance that feels like walking through a spring garden.', price: 85.00, stock: 40, brand: 'Flora Essence', volume: '50ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500', categorySlug: 'floral' },
  { name: 'Peony Blush', description: 'Lush pink peonies wrapped in raspberry accord and soft cashmere musk. A modern romantic fragrance for the confident woman.', price: 145.00, stock: 20, brand: 'Maison Lumière', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500', categorySlug: 'floral' },
  { name: 'Iris Royale', description: 'Noble iris pallida from Florence, enriched with violet leaf absolute and powdery heliotrope. An aristocratic floral for special occasions.', price: 195.00, stock: 15, brand: 'Prestige Collection', volume: '100ml', fragrance_type: 'Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500', categorySlug: 'floral' },
  { name: 'Magnolia Mist', description: 'Dewy magnolia petals and sparkling pear, settled on a base of white cedarwood and clean musks. Fresh, feminine, and effortlessly elegant.', price: 72.00, stock: 35, brand: 'Flora Essence', volume: '50ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1595425964272-fc617fa19dca?w=500', categorySlug: 'floral' },

  // Woody
  { name: 'Oud Mystique', description: 'Rare aged oud from Assam, blended with smoky frankincense and velvety rose. A powerful statement fragrance with incredible depth and projection.', price: 280.00, stock: 10, brand: 'Prestige Collection', volume: '75ml', fragrance_type: 'Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500', categorySlug: 'woody' },
  { name: 'Cedarwood Serenade', description: 'Virginia cedarwood layered with creamy sandalwood, dry vetiver, and a hint of smoked leather. Sophisticated and grounding.', price: 110.00, stock: 28, brand: 'Bois Noble', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=500', categorySlug: 'woody' },
  { name: 'Sandalwood Dreams', description: 'Mysore sandalwood at its finest, warmed by tonka bean and enveloped in cashmeran. A meditative scent that calms and captivates.', price: 135.00, stock: 22, brand: 'Bois Noble', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1600612253971-422b1dff7d2a?w=500', categorySlug: 'woody' },
  { name: 'Vetiver Absolute', description: 'Haitian vetiver root meets crisp grapefruit and aromatic geranium. A fresh-woody composition for the modern gentleman.', price: 95.00, stock: 33, brand: 'Homme Select', volume: '75ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500', categorySlug: 'woody' },
  { name: 'Mahogany Nights', description: 'Dark mahogany wood, black pepper, and leather accord create a bold nocturnal fragrance. Finished with amber resin for lasting warmth.', price: 155.00, stock: 18, brand: 'Homme Select', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1594035910387-fea081db797e?w=500', categorySlug: 'woody' },
  { name: 'Birchwood & Moss', description: 'Silver birch bark, oakmoss, and wild herbs from the forest floor. A nature-inspired woody fragrance with green undertones.', price: 88.00, stock: 30, brand: 'Terra Scents', volume: '50ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1547887538-047f814bfb64?w=500', categorySlug: 'woody' },

  // Oriental
  { name: 'Amber Elixir', description: 'Liquid amber, golden benzoin, and precious labdanum resin. A warm, resinous oriental that wraps you like cashmere on a cold evening.', price: 165.00, stock: 20, brand: 'Maison Lumière', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500', categorySlug: 'oriental' },
  { name: 'Vanilla Opulence', description: 'Madagascar bourbon vanilla, whipped with praline and draped in saffron threads. An indulgently sweet oriental with surprising sophistication.', price: 140.00, stock: 25, brand: 'Nuit Parfums', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500', categorySlug: 'oriental' },
  { name: 'Saffron & Silk', description: 'Precious saffron threads woven with Turkish rose and oud. A luxurious oriental tapestry that unfolds in waves of golden warmth.', price: 225.00, stock: 12, brand: 'Prestige Collection', volume: '75ml', fragrance_type: 'Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500', categorySlug: 'oriental' },
  { name: 'Incense Prayer', description: 'Sacred frankincense and myrrh, softened by dried fruits and warm cinnamon. A contemplative fragrance inspired by ancient temples.', price: 115.00, stock: 22, brand: 'Terra Scents', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=500', categorySlug: 'oriental' },
  { name: 'Midnight Musk', description: 'Egyptian white musk, dark plum, and patchouli create a seductive evening fragrance. The dry-down reveals warm suede and tonka.', price: 105.00, stock: 28, brand: 'Nuit Parfums', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', categorySlug: 'oriental' },
  { name: 'Bakhoor Royale', description: 'Traditional Arabian bakhoor blended with rose water, agarwood, and sandalwood chips. A regal composition honoring Middle Eastern perfumery.', price: 260.00, stock: 8, brand: 'Prestige Collection', volume: '50ml', fragrance_type: 'Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500', categorySlug: 'oriental' },

  // Fresh
  { name: 'Ocean Breeze', description: 'Sea salt, white tea, and driftwood capture the essence of a Mediterranean morning. Clean, fresh, and endlessly wearable.', price: 78.00, stock: 45, brand: 'Aqua Vita', volume: '100ml', fragrance_type: 'Eau de Toilette', featured: true, image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500', categorySlug: 'fresh' },
  { name: 'Green Tea Garden', description: 'Japanese matcha green tea, bamboo leaves, and lotus flower. A zen-inspired fragrance that refreshes and centers the mind.', price: 65.00, stock: 50, brand: 'Flora Essence', volume: '50ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1595425964272-fc617fa19dca?w=500', categorySlug: 'fresh' },
  { name: 'Alpine Frost', description: 'Crisp mountain air, frozen juniper berries, and silver fir needles. An invigorating fresh fragrance inspired by Swiss Alps mornings.', price: 92.00, stock: 35, brand: 'Terra Scents', volume: '75ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1600612253971-422b1dff7d2a?w=500', categorySlug: 'fresh' },
  { name: 'Cucumber & Mint', description: 'Cool cucumber water, crushed spearmint, and green apple. The ultimate summer refresher with lasting clean vibes.', price: 55.00, stock: 60, brand: 'Aqua Vita', volume: '50ml', fragrance_type: 'Eau Fraiche', featured: false, image_url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=500', categorySlug: 'fresh' },
  { name: 'Linen & Rain', description: 'Fresh cotton, petrichor, and white iris recreate the scent of sun-dried linen after a summer rain. Pure comfort in a bottle.', price: 82.00, stock: 38, brand: 'Maison Lumière', volume: '75ml', fragrance_type: 'Eau de Toilette', featured: true, image_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500', categorySlug: 'fresh' },
  { name: 'Eucalyptus Spa', description: 'Australian eucalyptus, rosemary, and thermal spring water accord. A spa-inspired fragrance that soothes and energizes simultaneously.', price: 68.00, stock: 42, brand: 'Aqua Vita', volume: '50ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500', categorySlug: 'fresh' },

  // Citrus
  { name: 'Bergamot Soleil', description: 'Calabrian bergamot, Sicilian lemon, and neroli blossom. A sun-drenched citrus that captures the Italian Riviera in every spray.', price: 88.00, stock: 40, brand: 'Aqua Vita', volume: '100ml', fragrance_type: 'Eau de Toilette', featured: true, image_url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500', categorySlug: 'citrus' },
  { name: 'Blood Orange Fizz', description: 'Sparkling blood orange, pink grapefruit, and champagne accord. An effervescent citrus cocktail that lifts the spirits instantly.', price: 72.00, stock: 45, brand: 'Flora Essence', volume: '75ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=500', categorySlug: 'citrus' },
  { name: 'Yuzu Imperiale', description: 'Japanese yuzu, Thai lime, and shiso leaf. An East-meets-West citrus composition with unexpected herbal depth.', price: 110.00, stock: 25, brand: 'Prestige Collection', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500', categorySlug: 'citrus' },
  { name: 'Lemon Verbena', description: 'Hand-crushed lemon verbena leaves, green mandarin, and white cedar. A crisp unisex fragrance perfect for every day.', price: 62.00, stock: 55, brand: 'Terra Scents', volume: '50ml', fragrance_type: 'Eau Fraiche', featured: false, image_url: 'https://images.unsplash.com/photo-1594035910387-fea081db797e?w=500', categorySlug: 'citrus' },
  { name: 'Neroli Dawn', description: 'Tunisian neroli, petitgrain, and orange blossom absolute on a bed of white musks. A radiant citrus-floral for bright mornings.', price: 130.00, stock: 20, brand: 'Maison Lumière', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500', categorySlug: 'citrus' },
  { name: 'Mandarin Noir', description: 'Green mandarin peel twisted with black tea and dark honey. A citrus with surprising depth and evening versatility.', price: 95.00, stock: 30, brand: 'Nuit Parfums', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500', categorySlug: 'citrus' },

  // Gourmand
  { name: 'Caramel Crème', description: 'Burnt caramel, Madagascar vanilla, and toasted almond draped in cashmere wood. A dessert-inspired fragrance that is irresistibly warm.', price: 98.00, stock: 30, brand: 'Nuit Parfums', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', categorySlug: 'gourmand' },
  { name: 'Espresso Noir', description: 'Dark roasted espresso beans, bitter chocolate, and smoky oud. A bold gourmand for coffee lovers who dare to be different.', price: 120.00, stock: 22, brand: 'Bois Noble', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=500', categorySlug: 'gourmand' },
  { name: 'Honey Elixir', description: 'Wild lavender honey, saffron, and beeswax absolute. A golden gourmand with Mediterranean soul and artisanal character.', price: 108.00, stock: 25, brand: 'Terra Scents', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1600612253971-422b1dff7d2a?w=500', categorySlug: 'gourmand' },
  { name: 'Pistachio Dream', description: 'Sicilian pistachio cream, marzipan, and rose water. A unique gourmand that blends Middle Eastern sweetness with Italian craftsmanship.', price: 135.00, stock: 18, brand: 'Prestige Collection', volume: '50ml', fragrance_type: 'Eau de Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1587017539504-67cfbddac569?w=500', categorySlug: 'gourmand' },
  { name: 'Tonka Velvet', description: 'Tonka bean, benzoin resin, and praline wrapped in suede accord. A velvety soft gourmand that whispers luxury on the skin.', price: 115.00, stock: 20, brand: 'Maison Lumière', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1595425964272-fc617fa19dca?w=500', categorySlug: 'gourmand' },
  { name: 'Coconut Riviera', description: 'Creamy coconut milk, tiare flower, and sun-warmed sand accord. A tropical gourmand escape that transports you to paradise.', price: 75.00, stock: 40, brand: 'Aqua Vita', volume: '50ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1588405748880-12d1d2a59f75?w=500', categorySlug: 'gourmand' },

  // Spicy
  { name: 'Cardamom & Leather', description: 'Guatemalan cardamom, Italian leather, and smoky papyrus. A refined spicy fragrance that commands attention without shouting.', price: 150.00, stock: 18, brand: 'Homme Select', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1590736969955-71cc94801759?w=500', categorySlug: 'spicy' },
  { name: 'Black Pepper Route', description: 'Malabar black pepper, Sichuan pepper, and pink pepper layered over dry cedar and leather. A spice trail in a bottle.', price: 105.00, stock: 28, brand: 'Bois Noble', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=500', categorySlug: 'spicy' },
  { name: 'Cinnamon Royale', description: 'Ceylon cinnamon bark, nutmeg, and dried fruit accord warmed by amber and vanilla. A festive spicy fragrance with cozy warmth.', price: 88.00, stock: 32, brand: 'Nuit Parfums', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1547887538-047f814bfb64?w=500', categorySlug: 'spicy' },
  { name: 'Ginger Zen', description: 'Fresh ginger root, lemongrass, and white tea leaves on a base of warm musk. An energizing spicy-fresh fusion.', price: 78.00, stock: 35, brand: 'Flora Essence', volume: '50ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1615634260167-c8cdede054de?w=500', categorySlug: 'spicy' },
  { name: 'Clove & Tobacco', description: 'Indonesian clove buds, rich pipe tobacco, and aged rum accord. A vintage-inspired spicy fragrance for contemplative evenings.', price: 142.00, stock: 15, brand: 'Bois Noble', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=500', categorySlug: 'spicy' },
  { name: 'Saffron Flame', description: 'Iranian saffron, red chili pepper, and oud wood ignite a blazing oriental-spicy composition. Daring, luxurious, unforgettable.', price: 210.00, stock: 10, brand: 'Prestige Collection', volume: '75ml', fragrance_type: 'Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1592945403244-b3fbafd7f539?w=500', categorySlug: 'spicy' },

  // Aquatic
  { name: 'Deep Blue', description: 'Deep ocean water, ambergris, and sea kelp. A mysterious aquatic that explores the darker, deeper side of the sea.', price: 95.00, stock: 30, brand: 'Aqua Vita', volume: '100ml', fragrance_type: 'Eau de Toilette', featured: true, image_url: 'https://images.unsplash.com/photo-1523293182086-7651a899d37f?w=500', categorySlug: 'aquatic' },
  { name: 'Coral Reef', description: 'Pink coral, sea lily, and coconut water over a bed of white driftwood. A tropical aquatic with feminine energy.', price: 82.00, stock: 35, brand: 'Flora Essence', volume: '75ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1595425964272-fc617fa19dca?w=500', categorySlug: 'aquatic' },
  { name: 'Monsoon', description: 'Petrichor, wet earth, and ozonic rain accord. Captures the exact moment the first raindrop touches warm summer pavement.', price: 88.00, stock: 28, brand: 'Terra Scents', volume: '75ml', fragrance_type: 'Eau de Parfum', featured: false, image_url: 'https://images.unsplash.com/photo-1600612253971-422b1dff7d2a?w=500', categorySlug: 'aquatic' },
  { name: 'Pacific Mist', description: 'California sea fog, sage brush, and weathered cypress. A coastal aquatic capturing the magic of Big Sur at dawn.', price: 105.00, stock: 22, brand: 'Terra Scents', volume: '100ml', fragrance_type: 'Eau de Parfum', featured: true, image_url: 'https://images.unsplash.com/photo-1541643600914-78b084683601?w=500', categorySlug: 'aquatic' },
  { name: 'Arctic Waters', description: 'Glacial water, white mint, and frozen violet leaves. An ultra-fresh aquatic that captures the purity of polar landscapes.', price: 72.00, stock: 40, brand: 'Aqua Vita', volume: '50ml', fragrance_type: 'Eau Fraiche', featured: false, image_url: 'https://images.unsplash.com/photo-1557170334-a9632e77c6e4?w=500', categorySlug: 'aquatic' },
  { name: 'Tidal Wave', description: 'Crashing waves, mineral salt, and aquatic florals. An energizing unisex aquatic that captures raw oceanic power.', price: 68.00, stock: 45, brand: 'Aqua Vita', volume: '50ml', fragrance_type: 'Eau de Toilette', featured: false, image_url: 'https://images.unsplash.com/photo-1563170351-be82bc888aa4?w=500', categorySlug: 'aquatic' },
];

const seedDatabase = async () => {
  try {
    console.log('🌱 Starting database seeding...');

    // Connect to database
    await sequelize.authenticate();
    console.log('✅ Database connected');

    // Sync models
    await sequelize.sync({ force: true });
    console.log('✅ Tables created (force sync)');

    // Create categories
    const createdCategories = await Category.bulkCreate(categories);
    console.log(`✅ ${createdCategories.length} categories seeded`);

    // Create a category map for quick lookup
    const categoryMap = {};
    createdCategories.forEach(cat => {
      categoryMap[cat.slug] = cat.id;
    });

    // Create products with category IDs
    const productsWithCategoryIds = products.map(({ categorySlug, ...product }) => ({
      ...product,
      category_id: categoryMap[categorySlug]
    }));

    const createdProducts = await Product.bulkCreate(productsWithCategoryIds);
    console.log(`✅ ${createdProducts.length} products seeded`);

    // Create admin user
    const { User } = require('../models');
    const bcrypt = require('bcryptjs');
    const adminPassword = await bcrypt.hash('admin123', 10);

    await User.create({
      email: 'admin@perfumehub.com',
      name: 'Admin',
      password: adminPassword,
      is_admin: true,
      oauth_provider: null,
      oauth_id: null
    });
    console.log('✅ Admin user created (admin@perfumehub.com / admin123)');

    console.log('\n🎉 Database seeded successfully!');
    console.log(`   📦 ${createdCategories.length} categories`);
    console.log(`   🧴 ${createdProducts.length} products`);
    console.log(`   👤 1 admin user`);

    process.exit(0);
  } catch (error) {
    console.error('❌ Seeding failed:', error.message);
    console.error(error);
    process.exit(1);
  }
};

seedDatabase();
