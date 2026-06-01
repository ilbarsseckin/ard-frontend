-- =============================================================================
-- BASKIURUNLERI.COM - HIZLI BAŞLANGIÇ SEED
-- =============================================================================
-- Çalıştırma:
--   docker exec -i ard-backend-db-1 psql -U baski_user -d baski_db < seed-katalog.sql
-- =============================================================================

-- 1) KATEGORİLER ─────────────────────────────────────────────────────
INSERT INTO catalog_categories (id, slug, name, icon, tagline, sort_order, active, created_at, updated_at) VALUES
  (gen_random_uuid(), 'bayrak',    'Bayrak',     '🏁', 'Yelken, masa ve duvar bayrakları',         10, true, NOW(), NOW()),
  (gen_random_uuid(), 'afis',      'Afiş',       '🪧', 'Vinil ve kağıt afiş baskıları',            20, true, NOW(), NOW()),
  (gen_random_uuid(), 'brosur',    'Broşür',     '📄', 'Katlamalı broşür ve el ilanı',             30, true, NOW(), NOW()),
  (gen_random_uuid(), 'katalog',   'Katalog',    '📕', 'Ürün ve hizmet katalogları',               40, true, NOW(), NOW()),
  (gen_random_uuid(), 'davetiye',  'Davetiye',   '💌', 'Özel gün davetiyeleri',                    50, true, NOW(), NOW()),
  (gen_random_uuid(), 'roll-up',   'Roll-Up',    '🎌', 'Roll-up ve display ürünleri',              60, true, NOW(), NOW()),
  (gen_random_uuid(), 'promosyon', 'Promosyon',  '🎁', 'Bardak, kalem, anahtarlık, t-shirt',       70, true, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 2) ÜRÜNLER ─────────────────────────────────────────────────────────
INSERT INTO catalog_products (id, slug, name, short_desc, category_id, featured, active, sort_order, created_at, updated_at) VALUES
  (gen_random_uuid(), 'yelken-bayrak',     'Yelken Bayrak',
   'Dış mekanlar için dayanıklı yelken bayrak. Marka görünürlüğü için ideal.',
   (SELECT id FROM catalog_categories WHERE slug='bayrak'),    true, true, 1, NOW(), NOW()),

  (gen_random_uuid(), 'vinil-afis',        'Vinil Afiş',
   '440gr Avrupa vinil branda. Su geçirmez, dış mekan için ideal.',
   (SELECT id FROM catalog_categories WHERE slug='afis'),      true, true, 1, NOW(), NOW()),

  (gen_random_uuid(), 'katlamali-brosur',  'Katlamalı Broşür',
   '3-katlı broşür baskı. Hizmetlerinizi etkili tanıtın.',
   (SELECT id FROM catalog_categories WHERE slug='brosur'),    true, true, 1, NOW(), NOW()),

  (gen_random_uuid(), 'urun-katalogu',     'Ürün Katalogu',
   'Profesyonel ürün ve hizmet katalogu. Cilt ve baskı seçenekleri.',
   (SELECT id FROM catalog_categories WHERE slug='katalog'),   true, true, 1, NOW(), NOW()),

  (gen_random_uuid(), 'dugun-davetiye',    'Düğün Davetiyesi',
   'Şık ve özel düğün davetiyeleri. Çeşitli kağıt seçenekleri.',
   (SELECT id FROM catalog_categories WHERE slug='davetiye'),  true, true, 1, NOW(), NOW()),

  (gen_random_uuid(), 'standart-roll-up',  'Standart Roll-Up',
   '85x200cm standart roll-up banner. Stand ve fuar için ideal.',
   (SELECT id FROM catalog_categories WHERE slug='roll-up'),   true, true, 1, NOW(), NOW()),

  (gen_random_uuid(), 'baskili-bardak',    'Baskılı Bardak',
   'Promosyon için porselen veya seramik bardaklar. Logo baskı dahil.',
   (SELECT id FROM catalog_categories WHERE slug='promosyon'), true, true, 1, NOW(), NOW()),

  (gen_random_uuid(), 'baskili-tisort',    'Baskılı T-Shirt',
   'Promosyon ve etkinlik için baskılı t-shirt. Pamuklu kumaş.',
   (SELECT id FROM catalog_categories WHERE slug='promosyon'), true, true, 2, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 3) TIER'LAR ────────────────────────────────────────────────────────
-- Yelken Bayrak: 1, 5, 10 adet
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id,  1, 14, 1 FROM catalog_products WHERE slug='yelken-bayrak';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id,  5, 60, 2 FROM catalog_products WHERE slug='yelken-bayrak';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 10, 110, 3 FROM catalog_products WHERE slug='yelken-bayrak';

-- Vinil Afiş: 5, 10, 25 adet
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id,  5, 7, 1 FROM catalog_products WHERE slug='vinil-afis';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 10, 13, 2 FROM catalog_products WHERE slug='vinil-afis';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 25, 30, 3 FROM catalog_products WHERE slug='vinil-afis';

-- Katlamalı Broşür: 500, 1000, 2500
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id,  500, 35, 1 FROM catalog_products WHERE slug='katlamali-brosur';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 1000, 60, 2 FROM catalog_products WHERE slug='katlamali-brosur';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 2500, 130, 3 FROM catalog_products WHERE slug='katlamali-brosur';

-- Ürün Katalogu: 100, 250, 500
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 100, 80, 1 FROM catalog_products WHERE slug='urun-katalogu';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 250, 180, 2 FROM catalog_products WHERE slug='urun-katalogu';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 500, 320, 3 FROM catalog_products WHERE slug='urun-katalogu';

-- Düğün Davetiyesi: 50, 100, 250
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id,  50, 25, 1 FROM catalog_products WHERE slug='dugun-davetiye';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 100, 45, 2 FROM catalog_products WHERE slug='dugun-davetiye';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 250, 100, 3 FROM catalog_products WHERE slug='dugun-davetiye';

-- Standart Roll-Up: 1, 3, 5
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 1, 18, 1 FROM catalog_products WHERE slug='standart-roll-up';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 3, 50, 2 FROM catalog_products WHERE slug='standart-roll-up';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 5, 80, 3 FROM catalog_products WHERE slug='standart-roll-up';

-- Baskılı Bardak: 50, 100, 250
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id,  50, 80, 1 FROM catalog_products WHERE slug='baskili-bardak';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 100, 140, 2 FROM catalog_products WHERE slug='baskili-bardak';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 250, 320, 3 FROM catalog_products WHERE slug='baskili-bardak';

-- Baskılı T-Shirt: 25, 50, 100
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id,  25, 75, 1 FROM catalog_products WHERE slug='baskili-tisort';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id,  50, 140, 2 FROM catalog_products WHERE slug='baskili-tisort';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) 
  SELECT gen_random_uuid(), id, 100, 260, 3 FROM catalog_products WHERE slug='baskili-tisort';

-- 4) RESİMLER ────────────────────────────────────────────────────────
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) 
  SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800', 'Yelken Bayrak', 0 FROM catalog_products WHERE slug='yelken-bayrak';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) 
  SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1565025048929-50dc9e63b8a3?w=800', 'Vinil Afiş', 0 FROM catalog_products WHERE slug='vinil-afis';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) 
  SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1586281380349-632531db7ed4?w=800', 'Broşür', 0 FROM catalog_products WHERE slug='katlamali-brosur';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) 
  SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=800', 'Katalog', 0 FROM catalog_products WHERE slug='urun-katalogu';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) 
  SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800', 'Davetiye', 0 FROM catalog_products WHERE slug='dugun-davetiye';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) 
  SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1559223607-a43c990c692c?w=800', 'Roll-Up', 0 FROM catalog_products WHERE slug='standart-roll-up';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) 
  SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1577937927133-66ef06acdf18?w=800', 'Baskılı Bardak', 0 FROM catalog_products WHERE slug='baskili-bardak';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) 
  SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=800', 'Baskılı T-Shirt', 0 FROM catalog_products WHERE slug='baskili-tisort';

-- DOĞRULAMA ─────────────────────────────────────────────────────────
SELECT 'Kategori sayısı: ' || COUNT(*) FROM catalog_categories;
SELECT 'Ürün sayısı: ' || COUNT(*) FROM catalog_products;
SELECT 'Tier sayısı: ' || COUNT(*) FROM catalog_product_tiers;
SELECT 'Resim sayısı: ' || COUNT(*) FROM catalog_product_images;
