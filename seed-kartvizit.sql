-- =============================================================================
-- KARTVIZIT VARYASYONLARI SEED — 16 ÇEŞİT
-- =============================================================================
-- Çalıştırma:
--   docker exec -i ard-backend-db-1 psql -U baski_user -d baski_db < seed-kartvizit.sql
-- =============================================================================

-- 1) ÜRÜNLER ──────────────────────────────────────────────────────────
INSERT INTO catalog_products (id, slug, name, short_desc, category_id, featured, active, sort_order, created_at, updated_at) VALUES
  (gen_random_uuid(), 'sivama-kartvizit',           'Sıvama Kartvizit',            'Sıvama tekniğiyle parlak yüzey, premium görünüm.',          (SELECT id FROM catalog_categories WHERE slug='kartvizit'), true,  true, 10, NOW(), NOW()),
  (gen_random_uuid(), '3-katli-sandvic-kartvizit',  '3 Katlı Sandviç Kartvizit',   '3 katmanlı kalın yapı, lüks ve dayanıklı dokunuş.',         (SELECT id FROM catalog_categories WHERE slug='kartvizit'), true,  true, 11, NOW(), NOW()),
  (gen_random_uuid(), 'gofreli-kartvizit',          'Gofreli Kartvizit',           'Kabartma desenli, dokunsal etki yaratan kartvizit.',        (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 12, NOW(), NOW()),
  (gen_random_uuid(), 'altin-yaldizli-kartvizit',   'Altın Yaldızlı Kartvizit',    'Altın yaldız detayları ile premium görünüm.',               (SELECT id FROM catalog_categories WHERE slug='kartvizit'), true,  true, 13, NOW(), NOW()),
  (gen_random_uuid(), 'kabartma-lakli-kartvizit',   'Kabartma Laklı Kartvizit',    'Selektif lak kabartma, modern ve şık tasarım.',             (SELECT id FROM catalog_categories WHERE slug='kartvizit'), true,  true, 14, NOW(), NOW()),
  (gen_random_uuid(), 'softtouch-kartvizit',        'Yumuşak Dokulu Kartvizit',    'SoftTouch teknolojisi, yumuşak ve premium hisli yüzey.',    (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 15, NOW(), NOW()),
  (gen_random_uuid(), 'kare-kartvizit',             'Kare Kartvizit',              '9x9cm kare format, dikkat çekici alternatif tasarım.',      (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 16, NOW(), NOW()),
  (gen_random_uuid(), 'katlamali-kartvizit',        'Katlamalı Kartvizit',         'Katlanabilir tasarım, içinde detay sunma alanı.',           (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 17, NOW(), NOW()),
  (gen_random_uuid(), 'kraft-kartvizit',            'Kraft Kartvizit',             'Kraft kağıt, doğal ve özgün görünüm. Eco friendly.',        (SELECT id FROM catalog_categories WHERE slug='kartvizit'), true,  true, 18, NOW(), NOW()),
  (gen_random_uuid(), 'oval-kesim-kartvizit',       'Oval Kesim Kartvizit',        'Köşeleri oval kesim, modern ve şık silüet.',                (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 19, NOW(), NOW()),
  (gen_random_uuid(), 'iki-kenar-oval-kartvizit',   'İki Kenar Oval Kartvizit',    'Üst ve alt kenarları oval, dikkat çekici form.',            (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 20, NOW(), NOW()),
  (gen_random_uuid(), 'pvc-kapli-kartvizit',        'PVC Kaplı Kartvizit',         'PVC kaplama, su geçirmez ve uzun ömürlü kullanım.',         (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 21, NOW(), NOW()),
  (gen_random_uuid(), 'takvimli-kartvizit',         'Takvimli Kartvizit',          'Arkasında takvim baskı, uzun süreli akılda kalıcılık.',     (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 22, NOW(), NOW()),
  (gen_random_uuid(), 'tuale-fantazi-kartvizit',    'Tuale Fantazi Kartvizit',     'Tuale dokulu özel kağıt, sanatsal ve özgün etki.',          (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 23, NOW(), NOW()),
  (gen_random_uuid(), 'seffaf-kartvizit',           'Şeffaf Kartvizit',            'Şeffaf plastik malzeme, lüks ve dikkat çekici.',            (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 24, NOW(), NOW()),
  (gen_random_uuid(), 'ahsap-kartvizitlik',         'Ahşap Kartvizitlik',          'Ahşap kartvizitlik standı, profesyonel sergileme.',         (SELECT id FROM catalog_categories WHERE slug='kartvizit'), false, true, 25, NOW(), NOW())
ON CONFLICT (slug) DO NOTHING;

-- 2) TIER'LAR ─ Üç fiyat kademesi her ürüne (500/1000/2500 adet)
-- Premium ürünler (laklı, gofreli, kabartma, yaldız, sandviç, ahşap, şeffaf): yüksek fiyat
-- Standart ürünler: orta fiyat

-- Sıvama (premium)
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 22, 1 FROM catalog_products WHERE slug='sivama-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 32, 2 FROM catalog_products WHERE slug='sivama-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 70, 3 FROM catalog_products WHERE slug='sivama-kartvizit';

-- 3 Katlı Sandviç (premium)
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 28, 1 FROM catalog_products WHERE slug='3-katli-sandvic-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 42, 2 FROM catalog_products WHERE slug='3-katli-sandvic-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 90, 3 FROM catalog_products WHERE slug='3-katli-sandvic-kartvizit';

-- Gofreli
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 25, 1 FROM catalog_products WHERE slug='gofreli-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 38, 2 FROM catalog_products WHERE slug='gofreli-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 80, 3 FROM catalog_products WHERE slug='gofreli-kartvizit';

-- Altın Yaldızlı
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 30, 1 FROM catalog_products WHERE slug='altin-yaldizli-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 45, 2 FROM catalog_products WHERE slug='altin-yaldizli-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 95, 3 FROM catalog_products WHERE slug='altin-yaldizli-kartvizit';

-- Kabartma Laklı
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 26, 1 FROM catalog_products WHERE slug='kabartma-lakli-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 40, 2 FROM catalog_products WHERE slug='kabartma-lakli-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 85, 3 FROM catalog_products WHERE slug='kabartma-lakli-kartvizit';

-- SoftTouch
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 24, 1 FROM catalog_products WHERE slug='softtouch-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 36, 2 FROM catalog_products WHERE slug='softtouch-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 78, 3 FROM catalog_products WHERE slug='softtouch-kartvizit';

-- Kare (standart)
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 18, 1 FROM catalog_products WHERE slug='kare-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 28, 2 FROM catalog_products WHERE slug='kare-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 60, 3 FROM catalog_products WHERE slug='kare-kartvizit';

-- Katlamalı (standart)
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 20, 1 FROM catalog_products WHERE slug='katlamali-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 30, 2 FROM catalog_products WHERE slug='katlamali-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 65, 3 FROM catalog_products WHERE slug='katlamali-kartvizit';

-- Kraft (özel malzeme)
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 19, 1 FROM catalog_products WHERE slug='kraft-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 28, 2 FROM catalog_products WHERE slug='kraft-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 62, 3 FROM catalog_products WHERE slug='kraft-kartvizit';

-- Oval Kesim
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 19, 1 FROM catalog_products WHERE slug='oval-kesim-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 28, 2 FROM catalog_products WHERE slug='oval-kesim-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 62, 3 FROM catalog_products WHERE slug='oval-kesim-kartvizit';

-- İki Kenar Oval
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 20, 1 FROM catalog_products WHERE slug='iki-kenar-oval-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 30, 2 FROM catalog_products WHERE slug='iki-kenar-oval-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 65, 3 FROM catalog_products WHERE slug='iki-kenar-oval-kartvizit';

-- PVC Kaplı (özel malzeme)
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 25, 1 FROM catalog_products WHERE slug='pvc-kapli-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 38, 2 FROM catalog_products WHERE slug='pvc-kapli-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 82, 3 FROM catalog_products WHERE slug='pvc-kapli-kartvizit';

-- Takvimli
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 20, 1 FROM catalog_products WHERE slug='takvimli-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 32, 2 FROM catalog_products WHERE slug='takvimli-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 68, 3 FROM catalog_products WHERE slug='takvimli-kartvizit';

-- Tuale Fantazi (özel)
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 22, 1 FROM catalog_products WHERE slug='tuale-fantazi-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 34, 2 FROM catalog_products WHERE slug='tuale-fantazi-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 72, 3 FROM catalog_products WHERE slug='tuale-fantazi-kartvizit';

-- Şeffaf (premium)
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,  500, 30, 1 FROM catalog_products WHERE slug='seffaf-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 1000, 46, 2 FROM catalog_products WHERE slug='seffaf-kartvizit';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id, 2500, 98, 3 FROM catalog_products WHERE slug='seffaf-kartvizit';

-- Ahşap Kartvizitlik (özel)
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,    1, 15, 1 FROM catalog_products WHERE slug='ahsap-kartvizitlik';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,    5, 65, 2 FROM catalog_products WHERE slug='ahsap-kartvizitlik';
INSERT INTO catalog_product_tiers (id, product_id, qty, price_usd, sort_order) SELECT gen_random_uuid(), id,   10, 120, 3 FROM catalog_products WHERE slug='ahsap-kartvizitlik';

-- 3) RESİMLER ──────────────────────────────────────────────────────────
-- Premium/parlak görünüm
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800', 'Sıvama Kartvizit', 0 FROM catalog_products WHERE slug='sivama-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800', '3 Katlı Sandviç', 0 FROM catalog_products WHERE slug='3-katli-sandvic-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1565291876211-a72b15497135?w=800', 'Gofreli Kartvizit', 0 FROM catalog_products WHERE slug='gofreli-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1573164574230-db1d5e960238?w=800', 'Altın Yaldızlı', 0 FROM catalog_products WHERE slug='altin-yaldizli-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800', 'Kabartma Laklı', 0 FROM catalog_products WHERE slug='kabartma-lakli-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800', 'SoftTouch Kartvizit', 0 FROM catalog_products WHERE slug='softtouch-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1565291876211-a72b15497135?w=800', 'Kare Kartvizit', 0 FROM catalog_products WHERE slug='kare-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1573164574230-db1d5e960238?w=800', 'Katlamalı Kartvizit', 0 FROM catalog_products WHERE slug='katlamali-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800', 'Kraft Kartvizit', 0 FROM catalog_products WHERE slug='kraft-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800', 'Oval Kesim', 0 FROM catalog_products WHERE slug='oval-kesim-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1565291876211-a72b15497135?w=800', 'İki Kenar Oval', 0 FROM catalog_products WHERE slug='iki-kenar-oval-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1573164574230-db1d5e960238?w=800', 'PVC Kaplı', 0 FROM catalog_products WHERE slug='pvc-kapli-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800', 'Takvimli', 0 FROM catalog_products WHERE slug='takvimli-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=800', 'Tuale Fantazi', 0 FROM catalog_products WHERE slug='tuale-fantazi-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1565291876211-a72b15497135?w=800', 'Şeffaf Kartvizit', 0 FROM catalog_products WHERE slug='seffaf-kartvizit';
INSERT INTO catalog_product_images (id, product_id, url, alt_text, sort_order) SELECT gen_random_uuid(), id, 'https://images.unsplash.com/photo-1573164574230-db1d5e960238?w=800', 'Ahşap Kartvizitlik', 0 FROM catalog_products WHERE slug='ahsap-kartvizitlik';

-- DOĞRULAMA ─────────────────────────────────────────────────────────
SELECT 'Kartvizit ürün sayısı: ' || COUNT(*)
  FROM catalog_products p
  JOIN catalog_categories c ON c.id = p.category_id
  WHERE c.slug = 'kartvizit';
