--
-- PostgreSQL database dump
--

\restrict Y4SgVYOMfVWcuoyd5wyfCvYQbirsef32DpY9cr5sfybWqivhlFPGvZbHdS4Xa2B

-- Dumped from database version 16.13
-- Dumped by pg_dump version 16.13

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: addresses; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.addresses (
    id uuid NOT NULL,
    address_line text NOT NULL,
    city character varying(255) NOT NULL,
    country character varying(255) NOT NULL,
    district character varying(255) NOT NULL,
    full_name character varying(255) NOT NULL,
    is_default boolean,
    phone character varying(255) NOT NULL,
    title character varying(255) NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: app_role_permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL
);


--
-- Name: app_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.app_roles (
    id uuid NOT NULL,
    description character varying(255),
    is_active boolean,
    name character varying(255) NOT NULL
);


--
-- Name: brand_references; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.brand_references (
    id uuid NOT NULL,
    abbr character varying(255),
    active boolean,
    category character varying(255) NOT NULL,
    color character varying(255),
    description text,
    display_order integer,
    featured boolean,
    logo_url character varying(255),
    name character varying(255) NOT NULL,
    sector character varying(255) NOT NULL,
    show_text boolean
);


--
-- Name: campaigns; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.campaigns (
    id uuid NOT NULL,
    active boolean NOT NULL,
    background_color character varying(30),
    badge_color character varying(30),
    badge_text character varying(40),
    created_at timestamp(6) with time zone,
    cta_link character varying(500),
    cta_text character varying(60),
    description text,
    ends_at timestamp(6) with time zone,
    image_url character varying(500) NOT NULL,
    label character varying(200),
    mobile_image_url character varying(500),
    sort_order integer NOT NULL,
    starts_at timestamp(6) with time zone,
    title character varying(200) NOT NULL,
    updated_at timestamp(6) with time zone
);


--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.cart_items (
    id uuid NOT NULL,
    declared_prints integer,
    file_original_name character varying(255),
    file_pages_count integer,
    files3key character varying(255),
    height_cm integer,
    options_json text,
    price_breakdown character varying(255),
    quantity integer NOT NULL,
    total_price numeric(10,2) NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    width_cm integer,
    cart_id uuid NOT NULL,
    product_type_id uuid NOT NULL,
    created_at timestamp(6) without time zone NOT NULL
);


--
-- Name: carts; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.carts (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    expires_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    user_id uuid NOT NULL
);


--
-- Name: catalog_attribute_options; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_attribute_options (
    id uuid NOT NULL,
    color_hex character varying(10),
    sort_order integer,
    value character varying(255) NOT NULL,
    attribute_id uuid NOT NULL,
    price_modifier numeric(5,3) DEFAULT 1.000 NOT NULL
);


--
-- Name: catalog_attributes; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_attributes (
    id uuid NOT NULL,
    attr_key character varying(80) NOT NULL,
    input_type character varying(20) NOT NULL,
    label character varying(255) NOT NULL,
    required boolean,
    sort_order integer,
    category_id uuid NOT NULL
);


--
-- Name: catalog_brands; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_brands (
    id uuid NOT NULL,
    active boolean,
    created_at timestamp(6) with time zone,
    description text,
    logo_url character varying(500),
    name character varying(255) NOT NULL,
    slug character varying(100) NOT NULL
);


--
-- Name: catalog_categories; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_categories (
    id uuid NOT NULL,
    active boolean,
    created_at timestamp(6) with time zone,
    icon character varying(255),
    name character varying(255) NOT NULL,
    slug character varying(100) NOT NULL,
    sort_order integer,
    tagline character varying(255),
    updated_at timestamp(6) with time zone,
    parent_id uuid
);


--
-- Name: catalog_order_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_order_files (
    id uuid NOT NULL,
    created_at timestamp(6) with time zone,
    file_size bigint NOT NULL,
    mime_type character varying(100),
    original_name character varying(255) NOT NULL,
    page_count integer,
    page_warning boolean,
    storage_path character varying(500) NOT NULL,
    stored_filename character varying(255) NOT NULL,
    order_id uuid NOT NULL
);


--
-- Name: catalog_order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_order_items (
    id uuid NOT NULL,
    attributes_snapshot text,
    category_id uuid,
    category_name character varying(200),
    category_slug character varying(200),
    main_image_url character varying(500),
    price_tl numeric(12,2),
    price_usd numeric(12,2) NOT NULL,
    product_id uuid,
    product_name character varying(200) NOT NULL,
    product_slug character varying(200) NOT NULL,
    tier_id uuid,
    tier_qty integer NOT NULL,
    order_id uuid NOT NULL
);


--
-- Name: catalog_orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_orders (
    id uuid NOT NULL,
    city character varying(60),
    created_at timestamp(6) with time zone,
    customer_address text NOT NULL,
    customer_email character varying(100),
    customer_name character varying(100) NOT NULL,
    customer_phone character varying(30) NOT NULL,
    district character varying(60),
    notes text,
    order_number character varying(32) NOT NULL,
    status character varying(20) NOT NULL,
    subtotal_usd numeric(12,2),
    total_tl numeric(12,2),
    updated_at timestamp(6) with time zone,
    usd_kur_at_order numeric(10,4),
    user_id uuid,
    iyzico_conversation_data text,
    iyzico_payment_id character varying(64),
    payment_status character varying(20),
    coupon_code character varying(50),
    discount_amount_tl numeric(12,2),
    subtotal_tl numeric(12,2),
    CONSTRAINT catalog_orders_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['PENDING'::character varying, 'PROCESSING'::character varying, 'PAID'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[]))),
    CONSTRAINT catalog_orders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'IN_PRODUCTION'::character varying, 'READY'::character varying, 'SHIPPED'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[])))
);


--
-- Name: catalog_product_attribute_values; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_product_attribute_values (
    id uuid NOT NULL,
    attribute_id uuid NOT NULL,
    option_id uuid NOT NULL,
    product_id uuid NOT NULL
);


--
-- Name: catalog_product_images; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_product_images (
    id uuid NOT NULL,
    alt_text character varying(200),
    sort_order integer,
    url character varying(500) NOT NULL,
    product_id uuid NOT NULL
);


--
-- Name: catalog_product_reviews; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_product_reviews (
    id uuid NOT NULL,
    anonymous boolean NOT NULL,
    approved boolean NOT NULL,
    comment text,
    created_at timestamp(6) with time zone NOT NULL,
    order_id uuid,
    rating integer NOT NULL,
    updated_at timestamp(6) with time zone,
    user_email character varying(255),
    user_id uuid NOT NULL,
    user_name character varying(255),
    product_id uuid NOT NULL
);


--
-- Name: catalog_product_tiers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_product_tiers (
    id uuid NOT NULL,
    price_usd numeric(12,2) NOT NULL,
    qty integer NOT NULL,
    sort_order integer,
    product_id uuid NOT NULL
);


--
-- Name: catalog_products; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.catalog_products (
    id uuid NOT NULL,
    active boolean,
    badge character varying(50),
    created_at timestamp(6) with time zone,
    featured boolean,
    long_desc text,
    name character varying(255) NOT NULL,
    original_price numeric(12,2),
    short_desc character varying(500),
    slug character varying(120) NOT NULL,
    sort_order integer,
    updated_at timestamp(6) with time zone,
    brand_id uuid,
    category_id uuid NOT NULL
);


--
-- Name: coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.coupons (
    id uuid NOT NULL,
    active boolean,
    auto_issue_on_first_visit boolean,
    auto_issue_on_order_amount numeric(10,2),
    code character varying(50) NOT NULL,
    created_at timestamp(6) without time zone,
    current_usage integer,
    description text,
    discount_amount numeric(10,2),
    discount_percent numeric(5,2),
    end_date timestamp(6) without time zone,
    gift_amount numeric(10,2),
    max_usage integer,
    min_order_amount numeric(10,2),
    name character varying(255) NOT NULL,
    per_user_limit integer,
    start_date timestamp(6) without time zone,
    type character varying(20) NOT NULL,
    updated_at timestamp(6) without time zone,
    CONSTRAINT coupons_type_check CHECK (((type)::text = ANY ((ARRAY['PERCENT'::character varying, 'AMOUNT'::character varying, 'GIFT'::character varying])::text[])))
);


--
-- Name: dealers; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.dealers (
    id uuid NOT NULL,
    address character varying(255) NOT NULL,
    city character varying(255),
    company_name character varying(255) NOT NULL,
    created_at timestamp(6) without time zone,
    credit_limit numeric(15,2),
    discount_rate numeric(5,2),
    district character varying(255),
    notes character varying(255),
    phone character varying(255) NOT NULL,
    rejection_reason character varying(255),
    status character varying(255),
    tax_number character varying(255) NOT NULL,
    tax_office character varying(255),
    updated_at timestamp(6) without time zone,
    user_id uuid,
    business_type character varying(255),
    estimated_monthly_revenue character varying(255),
    note character varying(255),
    website character varying(255),
    CONSTRAINT dealers_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'APPROVED'::character varying, 'REJECTED'::character varying])::text[])))
);


--
-- Name: files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.files (
    id uuid NOT NULL,
    original_name character varying(255) NOT NULL,
    page_count integer,
    s3key character varying(255) NOT NULL,
    status character varying(255),
    uploaded_at timestamp(6) without time zone,
    order_item_id uuid NOT NULL,
    CONSTRAINT files_status_check CHECK (((status)::text = ANY ((ARRAY['LOCKED'::character varying, 'UNLOCKED'::character varying, 'REJECTED'::character varying])::text[])))
);


--
-- Name: hero_slides; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.hero_slides (
    id uuid NOT NULL,
    active boolean NOT NULL,
    background_color character varying(30),
    created_at timestamp(6) with time zone,
    cta_link character varying(500),
    cta_text character varying(60),
    description text,
    ends_at timestamp(6) with time zone,
    image_url character varying(500) NOT NULL,
    label character varying(200),
    layout character varying(20),
    mobile_image_url character varying(500),
    sort_order integer NOT NULL,
    starts_at timestamp(6) with time zone,
    title character varying(200) NOT NULL,
    updated_at timestamp(6) with time zone,
    CONSTRAINT hero_slides_layout_check CHECK (((layout)::text = ANY ((ARRAY['SPLIT_LEFT'::character varying, 'SPLIT_RIGHT'::character varying, 'OVERLAY'::character varying, 'IMAGE_ONLY'::character varying])::text[])))
);


--
-- Name: notifications; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    channel character varying(255) NOT NULL,
    recipient character varying(255) NOT NULL,
    sent_at timestamp(6) without time zone,
    status character varying(255),
    order_id uuid NOT NULL
);


--
-- Name: order_items; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_items (
    id uuid NOT NULL,
    height_cm integer,
    product_type character varying(255) NOT NULL,
    quantity integer NOT NULL,
    unit_price numeric(10,2) NOT NULL,
    width_cm integer,
    order_id uuid NOT NULL
);


--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.order_status_history (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    note character varying(255),
    status character varying(255) NOT NULL,
    order_id uuid NOT NULL,
    CONSTRAINT order_status_history_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'PAID'::character varying, 'REVIEWING'::character varying, 'PRINTING'::character varying, 'SHIPPED'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])))
);


--
-- Name: orders; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.orders (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    declared_prints integer,
    pdf_page_count integer,
    shipping_address text NOT NULL,
    status character varying(255),
    total_price numeric(10,2) NOT NULL,
    user_id uuid NOT NULL,
    CONSTRAINT orders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'PAID'::character varying, 'REVIEWING'::character varying, 'PRINTING'::character varying, 'SHIPPED'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])))
);


--
-- Name: payments; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.payments (
    id uuid NOT NULL,
    amount numeric(10,2) NOT NULL,
    paid_at timestamp(6) without time zone,
    provider character varying(255),
    provider_ref character varying(255),
    status character varying(255),
    order_id uuid NOT NULL,
    CONSTRAINT payments_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'SUCCESS'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[])))
);


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    category character varying(255),
    code character varying(255) NOT NULL,
    label character varying(255) NOT NULL
);


--
-- Name: pre_order_files; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.pre_order_files (
    id uuid NOT NULL,
    claimed_at timestamp(6) with time zone,
    claimed_by_order_id uuid,
    created_at timestamp(6) with time zone NOT NULL,
    file_size bigint NOT NULL,
    mime_type character varying(100),
    original_name character varying(500) NOT NULL,
    stored_path character varying(500) NOT NULL
);


--
-- Name: price_rules; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.price_rules (
    id uuid NOT NULL,
    base_price numeric(38,2),
    max_qty integer,
    min_qty integer,
    multiplier numeric(38,2),
    option_key character varying(255),
    option_value character varying(255),
    price_delta numeric(38,2),
    rule_type character varying(255) NOT NULL,
    unit_price numeric(38,2),
    product_type_id uuid NOT NULL
);


--
-- Name: product_configs; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_configs (
    id uuid NOT NULL,
    affects_price boolean,
    display_order integer,
    field_key character varying(255) NOT NULL,
    field_type character varying(255) NOT NULL,
    options text,
    required boolean,
    product_type_id uuid NOT NULL
);


--
-- Name: product_types; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.product_types (
    id uuid NOT NULL,
    description character varying(255),
    has_file boolean,
    is_active boolean,
    min_order integer,
    name character varying(255) NOT NULL,
    pricing_model character varying(255) NOT NULL,
    slug character varying(255) NOT NULL,
    unit character varying(255) NOT NULL,
    image_url character varying(255),
    badge character varying(255),
    featured boolean,
    original_price numeric(38,2)
);


--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.system_settings (
    key character varying(255) NOT NULL,
    description character varying(255),
    value text NOT NULL
);


--
-- Name: user_app_roles; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_app_roles (
    id uuid NOT NULL,
    assigned_at timestamp(6) without time zone,
    assigned_by character varying(255),
    app_role_id uuid NOT NULL,
    user_id uuid NOT NULL
);


--
-- Name: user_coupons; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.user_coupons (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    expires_at timestamp(6) without time zone,
    issued_at timestamp(6) without time zone,
    order_id uuid,
    source character varying(20) NOT NULL,
    used boolean,
    used_at timestamp(6) without time zone,
    user_id uuid NOT NULL,
    coupon_id uuid NOT NULL,
    CONSTRAINT user_coupons_source_check CHECK (((source)::text = ANY ((ARRAY['WELCOME'::character varying, 'GIFT'::character varying, 'PROMO'::character varying, 'MANUAL'::character varying])::text[])))
);


--
-- Name: users; Type: TABLE; Schema: public; Owner: -
--

CREATE TABLE public.users (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    email character varying(255) NOT NULL,
    name character varying(255) NOT NULL,
    password character varying(255) NOT NULL,
    phone character varying(255),
    role character varying(255) NOT NULL,
    email_verified boolean,
    google_id character varying(255),
    CONSTRAINT users_role_check CHECK (((role)::text = ANY ((ARRAY['CUSTOMER'::character varying, 'OPERATOR'::character varying, 'ADMIN'::character varying])::text[])))
);


--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.addresses (id, address_line, city, country, district, full_name, is_default, phone, title, user_id) FROM stdin;
f59e7694-aed1-42ca-b028-59ee4140cddf	Ataturk Cad. No:1	Istanbul	Türkiye	Kadikoy	Admin Test	t	05001234567	Ofis	c2a9af4c-0956-4e71-bde1-f8a8f9258586
d7f61615-398f-4aab-b457-2740814ac8d4	Uğur Mumcu\nŞeyh Şamil Cd. No:15	İstanbul	Türkiye	Kartal	test	t	05530214777	ev	b9b78f85-d48a-45ee-9db8-9b39781bde32
\.


--
-- Data for Name: app_role_permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.app_role_permissions (role_id, permission_id) FROM stdin;
ab86f054-f176-43a3-a233-69d2897928cd	41708101-425f-4b6e-9260-7a6e484a0f56
ab86f054-f176-43a3-a233-69d2897928cd	b106de7b-69e4-458e-b173-706b7f200133
ab86f054-f176-43a3-a233-69d2897928cd	acb4b4d6-96ce-418a-8cee-cd53fd897797
ab86f054-f176-43a3-a233-69d2897928cd	6ed43423-604c-488c-ba97-db5fba5f1a9c
ab86f054-f176-43a3-a233-69d2897928cd	ef8f9d9e-ce11-464a-9215-f72417afc910
ab86f054-f176-43a3-a233-69d2897928cd	180988c6-db2a-4f97-b599-85125bdac6d0
ab86f054-f176-43a3-a233-69d2897928cd	5c4a50c4-f610-498c-a367-5258d41af6a6
ab86f054-f176-43a3-a233-69d2897928cd	ae87eeeb-9b2b-4679-bd2a-4d728d81344f
ab86f054-f176-43a3-a233-69d2897928cd	36392c6c-4235-406a-ba8d-48c638898cc9
ab86f054-f176-43a3-a233-69d2897928cd	6305a29f-1ae4-4ee4-b796-98cad99b6561
ab86f054-f176-43a3-a233-69d2897928cd	27173064-4934-4ca3-8f37-4a6d383f93c0
ab86f054-f176-43a3-a233-69d2897928cd	28d04e70-735b-4efa-a446-bcfed87f4d02
ab86f054-f176-43a3-a233-69d2897928cd	efb04aea-4485-41c4-8c77-00ca852d0003
ab86f054-f176-43a3-a233-69d2897928cd	040bef77-2083-441c-ad91-fb64b77e4e7d
ab86f054-f176-43a3-a233-69d2897928cd	abdbb250-1083-4eea-80a4-a7e351e83694
ab86f054-f176-43a3-a233-69d2897928cd	e1c7a7a3-f0e3-4047-a320-6f1b1a9576e9
ab86f054-f176-43a3-a233-69d2897928cd	f98acd04-729a-41b8-82b3-10ce8afc41a5
ab86f054-f176-43a3-a233-69d2897928cd	b94af777-a8c1-4b62-8f6a-b49dd8cf18c7
ab86f054-f176-43a3-a233-69d2897928cd	4dcca2db-d2dd-4577-895c-2e7ba95a5fd5
ab86f054-f176-43a3-a233-69d2897928cd	23142978-26c4-436a-ad95-ea09d5309e44
ab86f054-f176-43a3-a233-69d2897928cd	a8cde1c3-2788-4ef4-aab5-c43bf0be2ddb
a0bdaf1e-4386-485d-859c-1407813591a7	b106de7b-69e4-458e-b173-706b7f200133
\.


--
-- Data for Name: app_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.app_roles (id, description, is_active, name) FROM stdin;
e5a63db2-3c9d-4e08-afc9-2ab7fb67e3e0	Sipariş yönetimi ve üretim takibi	t	Operatör
a0bdaf1e-4386-485d-859c-1407813591a7	Ödeme ve ciro raporları	t	Muhasebe
fa0e64d1-cbc8-4abf-a283-c824a1f5b5ef	Sadece üretim aşamasındaki siparişler	t	Üretim
ab86f054-f176-43a3-a233-69d2897928cd	Tüm yetkilere sahip	t	Admin
\.


--
-- Data for Name: brand_references; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.brand_references (id, abbr, active, category, color, description, display_order, featured, logo_url, name, sector, show_text) FROM stdin;
4468c276-c66b-4ed7-9b87-e138182ded81	\N	f	Zincir Market	#F4821F	\N	0	f	\N	cxcxccxcx	cvvcvc	\N
66dd8b05-89f3-4e92-bf95-908660adda2f	\N	f	Zincir Market	#F4821F	\N	0	f	\N	ggf	fggfgf	\N
6615e29d-e1ba-49dc-be2b-f6845f5c3904	HJ	f	Zincir Market	#F4821F	\N	0	f	\N	hjjh	Zincir Market	\N
6b69efaf-927c-47b5-a5b7-ef36fbc09d2c	\N	f	Zincir Market	#F4821F	\N	5	t	\N	dd	dffd	\N
c053c00b-abd5-4b72-b1c5-1fd25808c95a	H	f	Zincir Market	#F4821F	\N	3	f	\N	ghgh	hjjh	\N
e6c44dac-37d0-473a-98b2-81f046cf83ed	\N	t	Zincir Market	#F4821F	\N	0	f	https://markantalya.com/wp-content/uploads/2023/02/teknosa.jpg	Teknosa	Elektronik	t
\.


--
-- Data for Name: campaigns; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.campaigns (id, active, background_color, badge_color, badge_text, created_at, cta_link, cta_text, description, ends_at, image_url, label, mobile_image_url, sort_order, starts_at, title, updated_at) FROM stdin;
3767c06e-1721-448f-9d38-121dae9a01ff	t	#9333ea	#F4821F	\N	2026-06-01 09:49:35.597348+00	\N	\N	werweerwr	\N	http://localhost:8080/uploads/banner/a5e2d008-f917-492d-bd7a-f4e98a5e9e5e.webp	KAPMANYA	\N	0	\N	3 ADET YELKEN BAYRAK AL KART VİZİT 1 TL	2026-06-01 09:49:35.597348+00
\.


--
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.cart_items (id, declared_prints, file_original_name, file_pages_count, files3key, height_cm, options_json, price_breakdown, quantity, total_price, unit_price, width_cm, cart_id, product_type_id, created_at) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.carts (id, created_at, expires_at, updated_at, user_id) FROM stdin;
9c070173-c049-4037-88f2-07ba841202d5	\N	2026-05-23 15:51:24.804787	2026-05-22 15:51:24.8332	c2a9af4c-0956-4e71-bde1-f8a8f9258586
67bce9d9-627d-4993-a092-814d5cbf8545	2026-05-29 22:00:36.676757	2026-05-30 22:00:36.660183	2026-05-29 22:00:36.676757	b9b78f85-d48a-45ee-9db8-9b39781bde32
\.


--
-- Data for Name: catalog_attribute_options; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_attribute_options (id, color_hex, sort_order, value, attribute_id, price_modifier) FROM stdin;
8cc47117-ed20-4dd8-b7e8-1e92a9e53039	\N	3	500	8811e952-4385-400e-a157-6e3b239a6f49	1.000
37e5f7ac-99c0-411a-8006-2c070b64b751	\N	1	5.5 x 8.5 cm (Standart)	00b63aa0-71fc-4e48-80e1-c69461ddd504	1.000
f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	\N	2	8.5 x 5.5 cm (Yatay)	00b63aa0-71fc-4e48-80e1-c69461ddd504	1.000
19093394-533f-4890-8856-eaba05ff6b21	\N	3	9 x 5 cm	00b63aa0-71fc-4e48-80e1-c69461ddd504	1.000
67480ace-94bf-4d99-b0bb-73460821fbc0	\N	4	8 x 5 cm	00b63aa0-71fc-4e48-80e1-c69461ddd504	1.000
35083070-9d84-499f-83ea-19db80862f39	\N	1	Tek Yön Baskı	a6f8a4df-8851-4680-829f-87986f7803de	1.000
bfd9bb29-f672-458f-b9b5-65e6359d253d	\N	2	Çift Yön Baskı	a6f8a4df-8851-4680-829f-87986f7803de	1.400
ec7c68f7-fa71-48fb-9b6b-8ae860df1492	\N	1	350g Mat Kuse	8811e952-4385-400e-a157-6e3b239a6f49	1.000
f05cceae-93c1-4205-8c9b-ddcd55ca4e83	\N	2	400g Mat Kuse	8811e952-4385-400e-a157-6e3b239a6f49	1.100
5dc33309-c210-428e-a2a3-0d909862125a	\N	3	350g Parlak Kuşe	8811e952-4385-400e-a157-6e3b239a6f49	1.050
7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	\N	4	400g Parlak Kuşe	8811e952-4385-400e-a157-6e3b239a6f49	1.150
1cc895fb-8487-466c-80cb-0b094c1bb1c0	\N	5	300g Bristol	8811e952-4385-400e-a157-6e3b239a6f49	1.250
85943178-63d2-4623-b71b-19e856a1a45f	\N	6	Kraft Kağıt	8811e952-4385-400e-a157-6e3b239a6f49	1.300
b5de8cf9-b7d4-4e59-be5f-1542ce035441	\N	1	Selefon Yok	f35c006f-3f41-4609-947b-331decc0123c	1.000
b7ca33eb-18ec-4407-99d9-778f4fca2d22	\N	2	Mat Selefon	f35c006f-3f41-4609-947b-331decc0123c	1.150
a60e91d0-59fd-42fa-93fe-2c88b3670a55	\N	3	Parlak Selefon	f35c006f-3f41-4609-947b-331decc0123c	1.150
22e0e47e-6b57-4cd4-8069-3718ccec56fb	\N	4	Soft Touch	f35c006f-3f41-4609-947b-331decc0123c	1.350
422670a0-7918-4f04-b554-43e89f2a4615	\N	1	Tek Yön Baskı	72528f26-c08d-4465-9eb7-6053695b93de	1.000
1a8bd646-5d18-4514-80a7-8c48cf85946f	\N	1	Tek Yön Baskı	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	1.000
d306e709-4634-49e6-9b33-d523d414b888	\N	2	Çift Yön Baskı	72528f26-c08d-4465-9eb7-6053695b93de	1.400
9423cb73-cc17-4808-99f9-61e504173f90	\N	2	Çift Yön Baskı	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	1.400
43ef505d-c60c-4749-8f9a-3a093f99dbb9	\N	1	Dikey	c1aa0331-352c-4219-af6d-a9161bfa0143	1.000
0f70ed44-5c38-42c8-a02e-6e088edf8f20	\N	2	Yatay	c1aa0331-352c-4219-af6d-a9161bfa0143	1.000
c82e4c46-6b83-4423-93d3-b8f7c13bb015	\N	1	8.5x5 cm	6cb3206f-8787-4761-a448-690f4c37cd09	1.000
ed6f2f53-68d6-4dd8-9c17-a29edd89b92c	\N	1	500 Mikron Buzlu PVC	50118dd8-633d-43ec-828a-97fd3fe0b7b8	1.000
0fc2909d-3db3-470a-8c84-48aaea57e4f0	\N	1	Tek Yön Baskı	9abea6d1-09f0-4ed7-927e-faef0e88a824	1.000
ea18e90d-1a8c-498e-8df4-dd3bbb335615	\N	1	4+0 CMYK	ab1c1763-7a7a-4b82-8e06-088bede34bc8	1.000
2467fa53-d031-46fe-b83d-f9a37ca4d723	\N	1	Lak Yok	cac9aa53-11d7-43ad-ac07-c63db02bc267	1.000
2a824ab6-6d7d-44cc-9148-3af158dbda70	\N	2	Tek Yön Kabartma Lak	cac9aa53-11d7-43ad-ac07-c63db02bc267	1.000
d96cccf3-eadb-4df7-b0b4-4750bb4879c8	\N	1	Oval	c6f53ceb-37ee-456b-90f2-35e5e57127b2	1.000
870e5740-3f96-4bd3-8ae4-5d287b075946	\N	1	50x75	faa2937d-4b2a-47b0-893e-97b52c3f3a80	1.000
1b159d72-3460-4d15-af7b-5eb223e6f967	\N	2	70x105	faa2937d-4b2a-47b0-893e-97b52c3f3a80	1.000
027d96e2-50b0-4b62-9e83-76a2cd88d4ab	\N	3	80x120	faa2937d-4b2a-47b0-893e-97b52c3f3a80	1.000
aa8bd074-8604-491d-93ed-0031888f00c6	\N	1	5+0 Cmk	8426e329-cd26-49a3-abb5-863940808283	1.000
d746761b-43b9-4053-a72b-7a2808da68bb	\N	2	5+5 Cmk	8426e329-cd26-49a3-abb5-863940808283	1.000
1c4ec33b-4854-47b3-ad54-daf42a013cc4	\N	1	350g Mat Kuşe	8811e952-4385-400e-a157-6e3b239a6f49	1.000
a450c311-a3b4-4cbc-affa-1fbca79f9692	\N	1	7.5x21 cm	d3edb2af-d3c4-4a15-9b43-8a11167a601c	1.000
d0cebcd1-9aba-46de-91f0-2239876a9dc0	\N	2	10x21cm	d3edb2af-d3c4-4a15-9b43-8a11167a601c	1.000
d2e8b816-8642-4ef6-a9fd-3a8414c85a4d	\N	2	130 gr Kuşe	17dd50b4-00d2-4ed8-8078-7f0bab6e0414	1.000
1494663b-6e8f-4296-8225-4ec3d3fda578	\N	1	115 gr. Kuşe	17dd50b4-00d2-4ed8-8078-7f0bab6e0414	1.000
cb0a2093-7470-498b-8336-7f32e2d23d83	\N	3	14x20 cm (A5)	d3edb2af-d3c4-4a15-9b43-8a11167a601c	1.000
4fe83a00-8aad-48e9-855e-d371a97813bf	\N	4	20x28 cm (A4)	d3edb2af-d3c4-4a15-9b43-8a11167a601c	1.000
662d4a79-5208-4010-a141-20d05ab287d6	\N	5	28x40 cm (A3)	d3edb2af-d3c4-4a15-9b43-8a11167a601c	1.000
89a325af-bfb1-42bb-8aa6-b426d7a243f5	\N	1	Tek Yön	ff16b04e-f596-469a-af9d-ec6ac076c89e	1.000
de9e1bd8-4d63-4b4b-8c18-d78bbfdaf318	\N	2	Çift Yön	ff16b04e-f596-469a-af9d-ec6ac076c89e	1.000
af06b99b-57f9-4e5f-8038-bcd39a83dae1	\N	1	20x28 A4	83365ad7-83a3-4603-9eaa-3280427d42c1	1.000
86483265-1bb5-481d-86b2-33cf9280ae2a	\N	2	28x40 A3	83365ad7-83a3-4603-9eaa-3280427d42c1	1.000
02cd1c86-d887-43df-8b54-185bccafdd00	\N	1	Tek	c5820856-c4ad-4c76-9c80-82f8d2646fde	1.000
7f91c265-2b93-4b86-928e-550da8c37c15	\N	2	Çift	c5820856-c4ad-4c76-9c80-82f8d2646fde	1.000
0ddd892c-6957-4b32-bcea-0d1f8c305b62	\N	1	115 gr	9d90ae96-67ae-4eb0-aaad-b08e661699b7	1.000
62f7ffcc-f4f7-4301-a8b6-1e03a6508ce1	\N	2	130 gr	9d90ae96-67ae-4eb0-aaad-b08e661699b7	1.000
9e81b900-b8a2-46d1-ba3f-d22477d21766	\N	1	A5	3b3f45af-f1a7-4e81-9968-2597dbed288e	1.000
287a7eed-bddf-4e0d-82ad-462ffcfb4ed4	\N	1	350 gr	e75f178f-e149-4d29-b48f-2c65f9e30424	1.000
abb818f5-7588-4e3c-b4c5-8d88c2223141	\N	1	Çift	464b74d3-e18d-4158-bd77-4d5c0d5eab4b	1.000
125ca603-83f0-4320-866e-a6439fc1a11a	\N	3	200 gr. Kuşe	17dd50b4-00d2-4ed8-8078-7f0bab6e0414	1.040
4297de50-c0f2-4659-9b4d-369cec79dd08	\N	1	225 cm	2f7fca54-625f-4091-b630-c8ea907e9287	1.000
28982ee8-a847-4729-b776-9747f1430da6	\N	2	245 cm	2f7fca54-625f-4091-b630-c8ea907e9287	1.000
a5650e04-3466-4cdd-9d59-e6ef90723e2e	\N	1	Gümüş	37bfb96c-91e4-47e5-824a-4efb191b0431	1.000
37872493-a43b-47dd-9106-23824b389f56	\N	2	Altın	37bfb96c-91e4-47e5-824a-4efb191b0431	1.000
88da2341-164d-4d1c-b933-ef788345338b	\N	4	100x150	faa2937d-4b2a-47b0-893e-97b52c3f3a80	1.000
aff3710e-0df2-4a6f-84e3-f975c4b26456	\N	5	150x225	faa2937d-4b2a-47b0-893e-97b52c3f3a80	1.000
95afca9f-0e6a-400c-8136-10f148dcfea7	\N	6	200x300	faa2937d-4b2a-47b0-893e-97b52c3f3a80	1.000
cf328e80-9442-4c30-97ce-7ab10ffe2b50	\N	7	300x450	faa2937d-4b2a-47b0-893e-97b52c3f3a80	1.000
648afdc4-82d8-469a-bbde-60581cdcc418	\N	8	400x600	faa2937d-4b2a-47b0-893e-97b52c3f3a80	1.000
a2b30cc9-0902-454f-8e9f-1f6708501385	\N	1	Düz	bc151ac5-d6c1-4e3a-97e3-cf707efc0abd	1.000
4f752bb8-ce24-466a-b3ea-ebbcedb8c0f1	\N	2	Kırlangıç	bc151ac5-d6c1-4e3a-97e3-cf707efc0abd	1.000
44218825-7788-4290-9287-852814eac52e	\N	3	Dışa Doğruı Üçgen	bc151ac5-d6c1-4e3a-97e3-cf707efc0abd	1.000
0a0293b1-9806-433f-af53-4b2ed0adeb52	\N	1	50x100	17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	1.000
2a7c106f-14f4-4c9e-a4d3-6e9ac00bd269	\N	2	50x120	17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	1.000
86e5066d-4c73-4fb1-b1b2-7d846c86dd9a	\N	3	50x150	17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	1.000
5336324f-bbd8-4700-92cc-bb860dcac827	\N	4	75x140	17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	1.000
942e06b9-dc5e-4e89-bfe9-d292874b90c9	\N	5	50x200	17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	1.000
9020378a-685d-41de-978a-0457b674229d	\N	1	8x32 cm	7495bf0b-9681-4b1b-9a05-157ee6b457ca	1.000
ea7107ff-4c6e-4eba-91e3-34a0b36726b2	\N	1	Düz	67db1c75-8896-4153-947f-4d758f168c61	1.000
2cf68485-b080-4299-9105-6aa8ada21913	\N	2	Kırlangıç	67db1c75-8896-4153-947f-4d758f168c61	1.000
ccabcc2a-de93-4bc1-989b-c18b7a929165	\N	3	Üçgen	67db1c75-8896-4153-947f-4d758f168c61	1.000
e58dacc7-27ea-48c0-a6a9-d53b571335f4	\N	1	1 li	f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	1.000
cf1a02f4-21bf-49ae-9851-827051943d16	\N	2	2 li	f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	1.000
233d71ca-190a-447b-8e4c-d3472b2e3055	\N	3	3 lü	f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	1.000
bb59e052-2fac-4402-9abd-943bee5f4f22	\N	4	4 lü	f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	1.000
584da31f-0079-4dd4-87d3-bb51506d0e72	\N	5	5 li	f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	1.000
1e8928fc-47aa-4da7-8393-5258e78b97f3	\N	1	Sadece Bayrak	dc49eaaa-3a28-4195-a72f-e1e35e56c983	1.000
d9d7cd8a-53e4-4479-8fbb-7eeea476bce6	\N	2	Sadece Sopa	dc49eaaa-3a28-4195-a72f-e1e35e56c983	1.000
e79ac359-7ce5-4deb-adfa-6374f4943a79	\N	3	Sopa + Duba	dc49eaaa-3a28-4195-a72f-e1e35e56c983	1.000
dc7fc555-54a8-4be1-9d11-b11467d6e2fe	\N	4	Bayrak + Sopa + Duba	dc49eaaa-3a28-4195-a72f-e1e35e56c983	1.000
093b5ff4-2c73-470f-ac83-6ef94c1af37e	\N	1	Ekonomik	4f597342-0069-47d1-ac04-19d8f9f069f4	1.000
7b0726f8-8699-4680-b01d-f21fa90934c8	\N	2	Standart	4f597342-0069-47d1-ac04-19d8f9f069f4	1.000
d4552911-b64b-4ef4-ba60-a3b671f6d9e0	\N	1	Yelken	50c66935-efbe-4e2a-9fca-effd21ea3a63	1.000
11ea5ee7-b93a-4263-803f-6a7122c87a96	\N	2	L tipi	50c66935-efbe-4e2a-9fca-effd21ea3a63	1.000
7f45144b-1974-4388-9235-4d67ca66b7c1	\N	3	Damla	50c66935-efbe-4e2a-9fca-effd21ea3a63	1.000
0c39b136-40f8-43d0-920a-208332cd54f3	\N	1	A4	9dcacff6-0b5f-42a4-b70e-543f6ae821f4	1.000
bc01e1a9-c980-4e66-9885-c7bfb7c3929d	\N	2	A5	9dcacff6-0b5f-42a4-b70e-543f6ae821f4	1.000
6880be3a-9ab2-488e-8277-0aea24b41333	\N	1	350 gr. mat kuşe	134ec1aa-7a9b-473b-9283-21ab3c75c537	1.000
0578d68a-ce3d-4d9f-9380-441dcf0d96b3	\N	2	450 gr. mat kuşe	134ec1aa-7a9b-473b-9283-21ab3c75c537	1.000
ca90547c-aa4b-4e58-a45a-9bf0fb4777c4	\N	1	Yatağ	4b8c3e11-c5b4-4783-a320-2b6283fbefba	1.000
3e26eee9-11e7-4d26-8245-f6afa019f5a3	\N	2	Dikey	4b8c3e11-c5b4-4783-a320-2b6283fbefba	1.000
0eb2b013-fd9f-4629-a06b-8218f3fec550	\N	1	10x15	4eaa6d8d-ae08-4516-acaa-49300ca126cd	1.000
5b813f3d-b0a3-4f53-9643-076317071e6c	\N	1	A4	fb433077-1084-4e27-a944-529f544d51f2	1.000
c2eae418-eda3-4adc-aeff-37d41724bc76	\N	2	A5	fb433077-1084-4e27-a944-529f544d51f2	1.000
\.


--
-- Data for Name: catalog_attributes; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_attributes (id, attr_key, input_type, label, required, sort_order, category_id) FROM stdin;
00b63aa0-71fc-4e48-80e1-c69461ddd504	ebat	select	Ebat	t	1	ac16bace-2752-493d-aeb6-3c6f9977a059
a6f8a4df-8851-4680-829f-87986f7803de	baski_yonu	select	Baskı Yönü	t	2	ac16bace-2752-493d-aeb6-3c6f9977a059
f35c006f-3f41-4609-947b-331decc0123c	selefon	select	Selefon	f	4	ac16bace-2752-493d-aeb6-3c6f9977a059
8811e952-4385-400e-a157-6e3b239a6f49	kagit	select	Kagit	t	3	ac16bace-2752-493d-aeb6-3c6f9977a059
72528f26-c08d-4465-9eb7-6053695b93de	baski_yonu	select	Baskı Yönü	t	2	ad720c31-b92b-4bba-8521-7a03c93324ca
9dcacff6-0b5f-42a4-b70e-543f6ae821f4	kagit	select	Kağıt	t	3	ad720c31-b92b-4bba-8521-7a03c93324ca
3e6d1fc9-9e95-4f72-bb07-c5f35e5ecf20	olcu	select	Ölçü	t	1	0d53bffa-cf96-4aa0-8e21-2278418ad97a
176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	baski_yonu	select	Baskı Yönü	t	2	0d53bffa-cf96-4aa0-8e21-2278418ad97a
cdffbfca-c554-404f-b37a-186d2c2d7b20	kagit	select	Kağıt	t	3	0d53bffa-cf96-4aa0-8e21-2278418ad97a
c1aa0331-352c-4219-af6d-a9161bfa0143	tasarim_yonu	select	Tasarım Yönü	t	1	961f50a7-1d5c-4c8a-854a-ba6620ab9074
6cb3206f-8787-4761-a448-690f4c37cd09	ebat	select	Ebat	t	2	961f50a7-1d5c-4c8a-854a-ba6620ab9074
50118dd8-633d-43ec-828a-97fd3fe0b7b8	malzeme	select	Malzeme	t	3	961f50a7-1d5c-4c8a-854a-ba6620ab9074
9abea6d1-09f0-4ed7-927e-faef0e88a824	baski_yonu	select	Baskı Yönü	t	4	961f50a7-1d5c-4c8a-854a-ba6620ab9074
ab1c1763-7a7a-4b82-8e06-088bede34bc8	baski_rengi	select	Baskı Rengi	t	5	961f50a7-1d5c-4c8a-854a-ba6620ab9074
cac9aa53-11d7-43ad-ac07-c63db02bc267	lak	select	Lak	f	6	961f50a7-1d5c-4c8a-854a-ba6620ab9074
c6f53ceb-37ee-456b-90f2-35e5e57127b2	kesim	select	Kesim	t	7	961f50a7-1d5c-4c8a-854a-ba6620ab9074
8426e329-cd26-49a3-abb5-863940808283	renk	select	Renk	f	0	ac16bace-2752-493d-aeb6-3c6f9977a059
d3edb2af-d3c4-4a15-9b43-8a11167a601c	ebat	select	Ebat	t	0	06938a6c-5437-4422-8a67-5c516fe91666
17dd50b4-00d2-4ed8-8078-7f0bab6e0414	kagit_turu	select	Kağıt Türü	f	0	06938a6c-5437-4422-8a67-5c516fe91666
ff16b04e-f596-469a-af9d-ec6ac076c89e	baski_yonu	select	Baskı Yönü	f	0	06938a6c-5437-4422-8a67-5c516fe91666
83365ad7-83a3-4603-9eaa-3280427d42c1	ebat	select	Ebat	f	0	fe9fef34-dbfa-4314-8f65-2c1359352c58
c5820856-c4ad-4c76-9c80-82f8d2646fde	kirim	select	KIRIM	f	0	fe9fef34-dbfa-4314-8f65-2c1359352c58
9d90ae96-67ae-4eb0-aaad-b08e661699b7	kagit	select	Kağıt	f	0	fe9fef34-dbfa-4314-8f65-2c1359352c58
3b3f45af-f1a7-4e81-9968-2597dbed288e	kagit	select	Kağıt	f	0	edf39510-c96a-4075-97ab-9d29097a3553
e75f178f-e149-4d29-b48f-2c65f9e30424	kagit	select	Kağıt	f	0	5a4f40f1-cc9d-4e79-8045-b7fefbcd4537
464b74d3-e18d-4158-bd77-4d5c0d5eab4b	yon	select	Yön	f	0	5a4f40f1-cc9d-4e79-8045-b7fefbcd4537
2f7fca54-625f-4091-b630-c8ea907e9287	olcu	select	Ölçü	f	0	77f4b716-1b7c-471d-99cc-3b8203baae71
37bfb96c-91e4-47e5-824a-4efb191b0431	renk	select	Renk	f	0	77f4b716-1b7c-471d-99cc-3b8203baae71
faa2937d-4b2a-47b0-893e-97b52c3f3a80	ebat	select	Ebat	f	0	94198885-8d1c-4989-bb5e-baa72b272522
bc151ac5-d6c1-4e3a-97e3-cf707efc0abd	model	image	Model	f	0	41b8301e-26b2-4f11-9565-4d189c9e48e5
17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	boyut	select	Boyut	f	0	41b8301e-26b2-4f11-9565-4d189c9e48e5
7495bf0b-9681-4b1b-9a05-157ee6b457ca	ebat	select	Ebat	f	0	8e970dec-7525-4def-9d67-5c2ec3e74614
67db1c75-8896-4153-947f-4d758f168c61	sekil	image	Şekil	f	0	8e970dec-7525-4def-9d67-5c2ec3e74614
f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	takim	select	Takım	f	0	8e970dec-7525-4def-9d67-5c2ec3e74614
dc49eaaa-3a28-4195-a72f-e1e35e56c983	i_cindekiler	select	İçindekiler	f	0	5e1630ff-a606-4e70-a6a3-a5ddd7827f25
4f597342-0069-47d1-ac04-19d8f9f069f4	malzeme	select	Malzeme	f	0	5e1630ff-a606-4e70-a6a3-a5ddd7827f25
50c66935-efbe-4e2a-9fca-effd21ea3a63	sekil	select	Şekil	f	0	5e1630ff-a606-4e70-a6a3-a5ddd7827f25
134ec1aa-7a9b-473b-9283-21ab3c75c537	hamur	select	Kağıt	f	0	a93c382e-d394-4e9b-928a-0f8b6097fce3
4b8c3e11-c5b4-4783-a320-2b6283fbefba	tasarim_yonu	select	Tasarım Yönü	f	0	a93c382e-d394-4e9b-928a-0f8b6097fce3
fb433077-1084-4e27-a944-529f544d51f2	ebat	select	Ebat	f	0	f6760942-5d2b-4d98-b934-7dc430984b0e
4eaa6d8d-ae08-4516-acaa-49300ca126cd	ebat	select	Ebat	f	0	a93c382e-d394-4e9b-928a-0f8b6097fce3
\.


--
-- Data for Name: catalog_brands; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_brands (id, active, created_at, description, logo_url, name, slug) FROM stdin;
\.


--
-- Data for Name: catalog_categories; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_categories (id, active, created_at, icon, name, slug, sort_order, tagline, updated_at, parent_id) FROM stdin;
2783e48a-b502-454b-bffe-0af7301ec927	t	2026-05-27 16:14:59.736488+00	\N	Altın Yaldızlı Kartvizit	kartvizit-yaldiz	4	Altın Yaldızlı Kartvizit	2026-06-02 08:19:46.770157+00	ac16bace-2752-493d-aeb6-3c6f9977a059
6d5b06e4-572e-44da-88b2-460a4f49cb96	t	2026-06-02 08:57:37.189832+00	📄	Broşür & El İlanı	brosur	20	Tanıtım ve reklam baskıları	2026-06-02 08:57:37.189832+00	\N
43a784da-0d7b-40e8-bfef-7adb8ef96f21	t	2026-06-02 08:57:37.189832+00	✂️	Özel Kesim & Form	kartvizit-ozel	2	\N	2026-06-02 08:57:37.189832+00	ac16bace-2752-493d-aeb6-3c6f9977a059
0613535f-9f95-4160-883b-af5cc07ae7b2	t	2026-06-02 08:57:37.189832+00	🌿	Ekonomik Kartvizit	kartvizit-eko	3	\N	2026-06-02 08:57:37.189832+00	ac16bace-2752-493d-aeb6-3c6f9977a059
b8d56b13-2748-44a6-899a-d173367b403d	t	2026-05-27 16:14:59.736488+00	📄	Katlamalı Broşür	brosur-katlamali	3	\N	2026-05-27 16:14:59.736488+00	6d5b06e4-572e-44da-88b2-460a4f49cb96
06938a6c-5437-4422-8a67-5c516fe91666	t	2026-05-27 16:14:59.736488+00	📄	El İlanı	brosur-el-ilani	1	\N	2026-05-27 16:14:59.736488+00	6d5b06e4-572e-44da-88b2-460a4f49cb96
edf39510-c96a-4075-97ab-9d29097a3553	t	2026-05-27 16:14:59.736488+00	📄	Ekonomik El İlanı	brosur-ekonomik-el-ilani	2	\N	2026-05-27 16:14:59.736488+00	6d5b06e4-572e-44da-88b2-460a4f49cb96
2e997fe3-7d4f-4c9a-92dd-0ce25256cbb8	f	2026-05-27 16:14:59.736488+00	📄	Amerikan Servis	brosur-amerikan-servis	4	\N	2026-06-02 14:55:44.885094+00	6d5b06e4-572e-44da-88b2-460a4f49cb96
7fd43c70-ac25-43a8-997d-9bee5fcdc5f2	f	2026-05-27 16:14:59.736488+00	📄	Masa Sümeni	brosur-masa-sumeni	5	\N	2026-06-02 14:55:48.991888+00	6d5b06e4-572e-44da-88b2-460a4f49cb96
d3f8d09e-fa37-405f-bf7b-f3d3cd7bd424	f	2026-05-27 16:14:59.736488+00	🎁	Mousepad	promosyon-mousepad	5	\N	2026-06-03 09:17:59.375167+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
be969a50-86ce-4044-96e8-490b23552f7d	t	2026-05-27 16:14:59.736488+00	💳	Premium Kartvizit	kartvizit-premium	1	\N	2026-05-27 16:14:59.736488+00	ac16bace-2752-493d-aeb6-3c6f9977a059
961f50a7-1d5c-4c8a-854a-ba6620ab9074	t	2026-05-27 16:14:59.736488+00	💳	Şeffaf PVC Kartvizit	kartvizit-pvc	2	\N	2026-05-27 16:14:59.736488+00	ac16bace-2752-493d-aeb6-3c6f9977a059
68e80d8b-96ad-4e66-9828-e4b70a7a2ef6	t	2026-05-27 16:14:59.736488+00	💳	Kabartmalı Kartvizit	kartvizit-kabartma	3	\N	2026-05-27 16:14:59.736488+00	ac16bace-2752-493d-aeb6-3c6f9977a059
8836a040-5619-4e2e-a1c6-639cdf9783c5	t	2026-05-27 16:14:59.736488+00	💳	Soft Touch Kartvizit	kartvizit-soft-touch	5	\N	2026-05-27 16:14:59.736488+00	ac16bace-2752-493d-aeb6-3c6f9977a059
708668f4-698b-417b-97bf-0102423f593c	t	2026-05-27 16:14:59.736488+00	💳	Ekspres Kartvizit	kartvizit-ekspres	6	\N	2026-05-27 16:14:59.736488+00	ac16bace-2752-493d-aeb6-3c6f9977a059
a93c382e-d394-4e9b-928a-0f8b6097fce3	t	2026-05-27 16:14:59.736488+00	📋	Kartpostal	kurumsal-kartpostal	5	\N	2026-05-27 16:14:59.736488+00	ad720c31-b92b-4bba-8521-7a03c93324ca
190c3c41-e1be-496b-8fe6-d9c9dcde3d38	t	2026-05-27 16:14:59.736488+00	📋	Reçete Baskı	kurumsal-recete	3	\N	2026-05-27 16:14:59.736488+00	ad720c31-b92b-4bba-8521-7a03c93324ca
f6760942-5d2b-4d98-b934-7dc430984b0e	t	2026-05-27 16:14:59.736488+00	📋	Antetli Kağıt	kurumsal-antetli	1	\N	2026-05-27 16:14:59.736488+00	ad720c31-b92b-4bba-8521-7a03c93324ca
87df6959-6da6-4ca5-9077-8ba6e1c85333	t	2026-05-27 16:14:59.736488+00	📋	Sertifika	kurumsal-sertifika	2	\N	2026-05-27 16:14:59.736488+00	ad720c31-b92b-4bba-8521-7a03c93324ca
4a6850e6-86a5-4b8c-ab11-539228096a50	t	2026-05-27 16:14:59.736488+00	📋	Anket Formu	kurumsal-anket-formu	4	\N	2026-05-27 16:14:59.736488+00	ad720c31-b92b-4bba-8521-7a03c93324ca
3de0b0a2-693b-4d29-b588-1b9812db9e94	t	2026-05-27 16:14:59.736488+00	🎁	Islak Mendil	promosyon-islak-mendil	1	\N	2026-05-27 16:14:59.736488+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
dc7e1291-48e3-4cb5-a38d-7ab905aa5145	t	2026-05-27 16:14:59.736488+00	🎁	Baskılı Bardak	promosyon-baskili-bardak	2	\N	2026-05-27 16:14:59.736488+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
909aac03-267a-45e5-9b98-2fac2ba34a47	t	2026-05-27 16:14:59.736488+00	🎁	Bloknot	promosyon-bloknot	3	\N	2026-05-27 16:14:59.736488+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
93bfaf95-800a-4ae5-96ba-674d9bc0a8bb	t	2026-05-27 16:14:59.736488+00	🎁	Magnet	promosyon-magnet	4	\N	2026-05-27 16:14:59.736488+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
1b7361ef-5d50-48ac-b3a6-468ade1c7444	t	2026-05-27 16:14:59.736488+00	🎁	Takvim	promosyon-takvim	6	\N	2026-05-27 16:14:59.736488+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
5e46b861-9b7c-45bd-a40a-1f473b30dfe1	t	2026-05-27 16:14:59.736488+00	📷	Fotoğraf Baskı	foto-fotograf	2	\N	2026-05-27 16:14:59.736488+00	0d53bffa-cf96-4aa0-8e21-2278418ad97a
9baca02a-ad1f-4a0d-8145-0d3d95c12dba	t	2026-05-27 16:14:59.736488+00	📷	Kanvas Tablo	foto-kanvas-tablo	1	\N	2026-05-27 16:14:59.736488+00	0d53bffa-cf96-4aa0-8e21-2278418ad97a
0199dfc8-1809-4bd7-998f-1eca3d2db26c	t	2026-05-27 16:14:59.736488+00	📷	Puzzle Baskı	foto-puzzle	4	\N	2026-05-27 16:14:59.736488+00	0d53bffa-cf96-4aa0-8e21-2278418ad97a
ac6460b2-7caa-441e-bc72-7a933d4a3758	t	2026-05-27 16:14:59.736488+00	📷	Foto Kart	foto-kart	5	\N	2026-05-27 16:14:59.736488+00	0d53bffa-cf96-4aa0-8e21-2278418ad97a
b053f4b9-78e3-45a9-a536-b8ef844b5a4b	t	2026-05-27 16:14:59.736488+00	📷	Kupa Baskı	foto-kupa	3	\N	2026-05-27 16:14:59.736488+00	0d53bffa-cf96-4aa0-8e21-2278418ad97a
d7b967d1-80b4-46cd-93f8-e3f7f532b5b9	t	2026-05-26 21:15:51.692346+00	📕	Katalog	katalog	40	Ürün ve hizmet katalogları	2026-05-26 21:15:51.692346+00	6d5b06e4-572e-44da-88b2-460a4f49cb96
fe9fef34-dbfa-4314-8f65-2c1359352c58	t	2026-05-27 17:19:21.717588+00	📄	Kırımlı El İlanı	kirimli-el-ilani-brosur	12	\N	2026-05-27 17:19:21.717588+00	6d5b06e4-572e-44da-88b2-460a4f49cb96
5a4f40f1-cc9d-4e79-8045-b7fefbcd4537	t	2026-05-27 17:19:21.717588+00	📄	Kapı Askı Broşürü	kapi-aski-brosuru	11	\N	2026-05-27 17:19:21.717588+00	6d5b06e4-572e-44da-88b2-460a4f49cb96
ad720c31-b92b-4bba-8521-7a03c93324ca	t	2026-05-27 16:14:59.736488+00	🏢	Kurumsal Baskılar	kurumsal-urunler	40	\N	2026-05-27 16:14:59.736488+00	\N
0d53bffa-cf96-4aa0-8e21-2278418ad97a	t	2026-05-27 16:14:59.736488+00	🖼️	Tablo & Fotoğraf	tablolar	80	\N	2026-05-27 16:14:59.736488+00	\N
ac16bace-2752-493d-aeb6-3c6f9977a059	t	2026-05-22 14:18:52.552812+00	\N	Kartvizitler	kartvizit	10	\N	2026-05-22 14:18:52.552812+00	\N
13ff22a1-1856-4857-958d-b2244a2b2d40	t	2026-05-26 21:15:51.692346+00	🚩	Bayrak Ürünleri	bayrak-urunleri	30	Yelken, masa ve duvar bayrakları	2026-05-26 21:15:51.692346+00	\N
306c9f83-afcf-42a8-a75c-ca0c054e0e0c	t	2026-05-27 17:19:21.717588+00	📋	Matbaa Ürünleri	matbaa-urunleri	50	\N	2026-05-27 17:19:21.717588+00	\N
a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125	t	2026-05-26 21:15:51.692346+00	🎁	Promosyon Ürünleri	promosyon-urunleri	60	Bardak, kalem, anahtarlık, t-shirt	2026-05-26 21:15:51.692346+00	\N
8fd8fde8-3148-4260-8ca1-97450a9c89d5	t	2026-05-27 17:19:21.717588+00	🖨️	Dijital Baskı Ürünleri	dijital-baski-urunleri	70	\N	2026-05-27 17:19:21.717588+00	\N
b6da22c1-b04e-4dd8-bc19-7951e32f24e0	t	2026-05-27 17:19:21.717588+00	🏠	Emlak Ürünleri	emlak-urunleri	90	\N	2026-05-27 17:19:21.717588+00	\N
f179f36b-97ef-4553-8556-f3b723899a33	t	2026-05-26 21:15:51.692346+00	🖼️	Afiş	afis	20	Vinil ve kağıt afiş baskıları	2026-05-26 21:15:51.692346+00	8fd8fde8-3148-4260-8ca1-97450a9c89d5
e255e01e-c460-4c1b-8e8d-ac7badd16946	t	2026-05-26 21:15:51.692346+00	💌	Davetiye	davetiye	50	Özel gün davetiyeleri	2026-05-26 21:15:51.692346+00	ad720c31-b92b-4bba-8521-7a03c93324ca
99e901fd-eef9-44b6-874e-0f32eaf90b59	f	2026-05-26 21:15:51.692346+00	🎌	Roll-Up	roll-up	60	Roll-up ve display ürünleri	2026-05-26 21:23:02.386238+00	ad720c31-b92b-4bba-8521-7a03c93324ca
8e970dec-7525-4def-9d67-5c2ec3e74614	t	2026-05-27 17:19:21.717588+00	🚩	Masa Bayrağı	masa-bayragi	2	\N	2026-05-27 17:19:21.717588+00	13ff22a1-1856-4857-958d-b2244a2b2d40
94198885-8d1c-4989-bb5e-baa72b272522	t	2026-05-27 17:19:21.717588+00	🚩	Gönder Bayrağı	gonder-bayragi	3	\N	2026-05-27 17:19:21.717588+00	13ff22a1-1856-4857-958d-b2244a2b2d40
77f4b716-1b7c-471d-99cc-3b8203baae71	t	2026-05-27 17:19:21.717588+00	🚩	Gümüş Makam Bayrağı	gumus-makam-bayragi	1	\N	2026-05-27 17:19:21.717588+00	13ff22a1-1856-4857-958d-b2244a2b2d40
5e1630ff-a606-4e70-a6a3-a5ddd7827f25	t	2026-05-27 17:19:21.717588+00	🚩	Yelken Bayrak	yelken-bayrak	4	\N	2026-05-27 17:19:21.717588+00	13ff22a1-1856-4857-958d-b2244a2b2d40
41b8301e-26b2-4f11-9565-4d189c9e48e5	t	2026-05-27 17:19:21.717588+00	🚩	Kırlangıç Bayrak	kirlangic-bayrak	5	\N	2026-05-27 17:19:21.717588+00	13ff22a1-1856-4857-958d-b2244a2b2d40
53be3dba-d3cc-400f-9057-fe78598bfdf8	t	2026-05-27 17:19:21.717588+00	🏢	Kaşeler	kaseler	15	\N	2026-05-27 17:19:21.717588+00	ad720c31-b92b-4bba-8521-7a03c93324ca
663afecb-49b4-4b9e-a2fb-587e3a1acd85	t	2026-05-27 17:19:21.717588+00	🏢	İş Güvenlik Levhaları	is-guvenlik-levhalari	13	\N	2026-05-27 17:19:21.717588+00	ad720c31-b92b-4bba-8521-7a03c93324ca
059101b4-71ed-43b6-945d-992a1548e25e	t	2026-05-27 17:19:21.717588+00	🏢	Tabelalar	tabelalar	16	\N	2026-05-27 17:19:21.717588+00	ad720c31-b92b-4bba-8521-7a03c93324ca
fdaef4e4-6b9b-40ed-b08b-55aa481e66be	t	2026-05-27 17:19:21.717588+00	🏢	Kapı İsimlikleri	kapi-isimlikleri	14	\N	2026-05-27 17:19:21.717588+00	ad720c31-b92b-4bba-8521-7a03c93324ca
2e42287e-4ef4-4a49-a56a-809f437dbf76	t	2026-05-27 17:19:21.717588+00	🏢	Dubalar	dubalar	10	\N	2026-05-27 17:19:21.717588+00	ad720c31-b92b-4bba-8521-7a03c93324ca
ebb14f11-2ee7-40cd-845e-220a5c00ce27	t	2026-05-27 17:19:21.717588+00	📋	Zarflar	zarflar	2	\N	2026-05-27 17:19:21.717588+00	306c9f83-afcf-42a8-a75c-ca0c054e0e0c
6ae8201c-1f24-4964-a0cd-7cffff08b4be	t	2026-05-27 17:19:21.717588+00	📋	Form - Makbuz	form-makbuz	5	\N	2026-05-27 17:19:21.717588+00	306c9f83-afcf-42a8-a75c-ca0c054e0e0c
cca4ae1e-06bb-4a0b-8dae-7251d5f6acba	t	2026-05-27 17:19:21.717588+00	📋	Bloknotlar	bloknotlar	3	\N	2026-05-27 17:19:21.717588+00	306c9f83-afcf-42a8-a75c-ca0c054e0e0c
4e8d7f6d-435d-4983-a5ce-00b7c97897d0	t	2026-05-27 17:19:21.717588+00	📋	Etiketler	etiketler	1	\N	2026-05-27 17:19:21.717588+00	306c9f83-afcf-42a8-a75c-ca0c054e0e0c
de83425b-50b7-4300-90cf-33b3920830da	t	2026-05-27 17:19:21.717588+00	🎁	Masa İsimlikleri	masa-isimlikleri	19	\N	2026-05-27 17:19:21.717588+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
ad5b0099-d0f2-4539-b5e3-2b5b93f038ac	t	2026-05-27 17:19:21.717588+00	🎁	Çakmaklar	cakmaklar	12	\N	2026-05-27 17:19:21.717588+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
028057ca-8cc9-4e10-8596-33b9d1abbd2c	t	2026-05-27 17:19:21.717588+00	🎁	Plaketler	plaketler	16	\N	2026-05-27 17:19:21.717588+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
ab5eef05-1f59-4731-a7fb-204367564c7b	t	2026-05-27 17:19:21.717588+00	🎁	Ajandalar	ajandalar	10	\N	2026-05-27 17:19:21.717588+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
127d2e22-4919-4b6f-91b9-06ffe8340155	t	2026-05-27 17:19:21.717588+00	🎁	Termoslar	termoslar	13	\N	2026-05-27 17:19:21.717588+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
6e897f17-c170-48cd-b49b-84a65ffed17c	t	2026-05-27 17:19:21.717588+00	🎁	Kalemler	kalemler	11	\N	2026-05-27 17:19:21.717588+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
1e2d4cb1-bbc7-4b02-a345-0d782fd78426	t	2026-05-27 17:19:21.717588+00	🎁	Anahtarlıklar	anahtarliklar	14	\N	2026-05-27 17:19:21.717588+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
98f31fd9-b779-408e-b9fa-64a51a9d1215	t	2026-05-27 17:19:21.717588+00	🖨️	Folyolar	folyolar	2	\N	2026-05-27 17:19:21.717588+00	8fd8fde8-3148-4260-8ca1-97450a9c89d5
5d6ce25d-22eb-4fbe-aadd-75f49734c336	t	2026-05-27 17:19:21.717588+00	🖨️	Mat Folyo	mat-folyo	4	\N	2026-05-27 17:19:21.717588+00	8fd8fde8-3148-4260-8ca1-97450a9c89d5
8f6217d7-c331-4112-92b1-34ebd309dcd2	t	2026-05-27 17:19:21.717588+00	🖨️	Viniller	viniller	1	\N	2026-05-27 17:19:21.717588+00	8fd8fde8-3148-4260-8ca1-97450a9c89d5
216aa095-a2b2-4287-8bf0-3aa48cd1befb	t	2026-05-27 17:19:21.717588+00	🖨️	Şeffaf Folyo	seffaf-folyo	7	\N	2026-05-27 17:19:21.717588+00	8fd8fde8-3148-4260-8ca1-97450a9c89d5
a728f015-00b8-499f-a420-e2ce3dd0ff58	t	2026-05-27 17:19:21.717588+00	🖨️	Vinil Branda Afişler	vinil-branda-afisler	3	\N	2026-05-27 17:19:21.717588+00	8fd8fde8-3148-4260-8ca1-97450a9c89d5
0dc83881-acd8-4a59-973a-a26b9188fe45	t	2026-05-27 17:19:21.717588+00	🖨️	Mesh Delikli Vinil	mesh-delikli-vinil	5	\N	2026-05-27 17:19:21.717588+00	8fd8fde8-3148-4260-8ca1-97450a9c89d5
d5cc2218-1def-4e30-934a-f589b53a5d62	t	2026-05-27 17:19:21.717588+00	🖨️	Işıklı Vinil	isikli-vinil	6	\N	2026-05-27 17:19:21.717588+00	8fd8fde8-3148-4260-8ca1-97450a9c89d5
91f6da40-6558-488f-98ca-a412905f8578	t	2026-05-27 17:19:21.717588+00	🖼️	MDF Tablo	mdf-tablo	11	\N	2026-05-27 17:19:21.717588+00	0d53bffa-cf96-4aa0-8e21-2278418ad97a
939e7449-2abc-4920-9da0-8893d5645c78	t	2026-05-27 17:19:21.717588+00	🖼️	Atatürk Tabloları	ataturk-tablo	12	\N	2026-05-27 17:19:21.717588+00	0d53bffa-cf96-4aa0-8e21-2278418ad97a
f2272869-e576-4a72-b568-16875b3bb6d6	t	2026-05-27 17:19:21.717588+00	🏠	Emlak Tabelası	emlak-tabelasi	4	\N	2026-05-27 17:19:21.717588+00	b6da22c1-b04e-4dd8-bc19-7951e32f24e0
27d430ad-e9fb-4554-bbee-2b3551d059a7	t	2026-05-27 17:19:21.717588+00	🏠	Mesh Delikli Vinil Emlak Afişi	mesh-emlak-afisi	1	\N	2026-05-27 17:19:21.717588+00	b6da22c1-b04e-4dd8-bc19-7951e32f24e0
0e861770-c504-4b83-a1c6-7e2daed1c2e8	t	2026-05-27 17:19:21.717588+00	🏠	Vinil Branda Emlak Afişi	vinil-branda-emlak-afisi	2	\N	2026-05-27 17:19:21.717588+00	b6da22c1-b04e-4dd8-bc19-7951e32f24e0
c0f86c4c-4a3b-494a-aca2-7e2267b2a8ba	t	2026-05-27 17:19:21.717588+00	🏠	Emlak Kağıt Afişi	emlak-kagit-afisi	3	\N	2026-05-27 17:19:21.717588+00	b6da22c1-b04e-4dd8-bc19-7951e32f24e0
7119c09d-a9fd-41f5-a3b8-0ecc8eeed95e	t	2026-06-01 14:48:15.30916+00	\N	Standart Kartvizit	standart-kartvizit	0	\N	2026-06-01 14:48:15.309672+00	ac16bace-2752-493d-aeb6-3c6f9977a059
b5523675-7142-47c5-a2f0-3de89eb83f4b	f	2026-05-27 17:19:21.717588+00	🏢	Standlar	standlar	11	\N	2026-06-03 08:27:45.590641+00	ad720c31-b92b-4bba-8521-7a03c93324ca
c425677e-d5b9-40f3-8287-9b69c180ae63	f	2026-05-27 17:19:21.717588+00	🏢	Display Ürünleri	display-urunleri	12	\N	2026-06-03 08:27:48.477706+00	ad720c31-b92b-4bba-8521-7a03c93324ca
c7384df9-6976-47f1-bc46-2c11a8c2f3be	f	2026-05-27 17:19:21.717588+00	📋	Çantalar	cantalar	4	\N	2026-06-03 08:41:18.247674+00	306c9f83-afcf-42a8-a75c-ca0c054e0e0c
555a2f06-5b50-46fd-96df-89b4b1227b60	f	2026-05-27 17:19:21.717588+00	🎁	VIP Setler	vip-setler	15	\N	2026-06-03 09:18:04.288511+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
babb3609-cc5f-4793-9cfe-cb7ae050c88b	f	2026-05-27 17:19:21.717588+00	🎁	Tişörtler	tisortler	17	\N	2026-06-03 09:18:08.548859+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
114983ba-6bba-4799-8b56-5f5945577ae5	f	2026-05-27 17:19:21.717588+00	🎁	Promosyon Paketleri	promosyon-paketleri	18	\N	2026-06-03 09:18:12.632657+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
a8564917-516e-427b-97e4-0ef08f36fc51	f	2026-05-27 17:19:21.717588+00	🎁	Powerbank	powerbank	20	\N	2026-06-03 09:18:15.426843+00	a1ff67a1-e0b2-4a5d-81d7-dfd31cab7125
dab555d3-3224-4863-9d1d-e4725f8600c8	f	2026-05-27 17:19:21.717588+00	🖼️	Dekoratif Tablolar	dekoratif-tablo	13	\N	2026-06-03 12:12:23.39357+00	0d53bffa-cf96-4aa0-8e21-2278418ad97a
\.


--
-- Data for Name: catalog_order_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_order_files (id, created_at, file_size, mime_type, original_name, page_count, page_warning, storage_path, stored_filename, order_id) FROM stdin;
13dff614-a7ae-4c5d-b571-ebe9acd33f01	2026-05-26 08:40:15.485052+00	2888	application/pdf	Multibus_Fiyat_Teklifi.pdf	1	f	customer-designs/CAT-A2432A9A/e7852b2c-ea28-4b9a-bf2c-aaaacb523f24.pdf	e7852b2c-ea28-4b9a-bf2c-aaaacb523f24.pdf	ca56ffb3-fe9c-4c09-8160-c1c05dcb8146
c7e2da0b-243f-41e0-ac84-8fe1fdfa2fad	2026-05-26 08:40:22.456309+00	24209	application/pdf	Multibus_Fiyat_Teklifi_TR_Son.pdf	1	f	customer-designs/CAT-A2432A9A/c7973141-2dbb-4685-8e8a-0ef69e0a86e2.pdf	c7973141-2dbb-4685-8e8a-0ef69e0a86e2.pdf	ca56ffb3-fe9c-4c09-8160-c1c05dcb8146
\.


--
-- Data for Name: catalog_order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_order_items (id, attributes_snapshot, category_id, category_name, category_slug, main_image_url, price_tl, price_usd, product_id, product_name, product_slug, tier_id, tier_qty, order_id) FROM stdin;
ae32d64c-3ffc-4300-a4ca-5b38232677d0	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800	720.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	d5b3450a-1f59-4a5d-9c39-6d0be06f8999	500	b10a38f7-3ba2-4d14-a9a7-c1bccc9d874f
48973cd4-f39e-48ed-b13f-70b50c6481e8	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800	900.00	20.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	62638e0d-6076-4622-a0bf-1a2d60170f07	1000	648c0957-670a-42bc-83d8-1f329933f5e2
837d579e-a715-4cba-b2d7-febe92e52511	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800	720.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	d5b3450a-1f59-4a5d-9c39-6d0be06f8999	500	648c0957-670a-42bc-83d8-1f329933f5e2
f74b2182-533e-4cc2-8a92-346857ccb392	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800	720.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	d5b3450a-1f59-4a5d-9c39-6d0be06f8999	500	0829cae9-467c-471a-ba3b-d8b4fb4af4c6
4e19da45-e40f-4e42-a5fd-b0da3c1be4be	Kagit: 400g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800	720.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	d5b3450a-1f59-4a5d-9c39-6d0be06f8999	500	a9ded8d8-145a-46b9-adab-d9b045251516
ccf28604-7879-4b88-8a73-360221d7cfd2	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800	720.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	d5b3450a-1f59-4a5d-9c39-6d0be06f8999	500	9527a82a-d756-4994-b219-2a207eb53f54
dae4bc30-e4cd-4060-982d-8aa65b992fca	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://d1x3eomzsc6lfz.cloudfront.net/baskiadam/images/products_gallery_images/standart-kartvizit90.jpg	720.00	16.00	b0c65d46-70f3-4e75-aef3-6e605818c174	kartvizit	kartvizit	6361cfbb-fca9-4cc6-9557-83d98c7016cf	100	c50870f7-d311-4100-94c1-581dfae8bfb5
fd253797-46f0-4c54-af0e-a04e9eb5cd1f	Kagit: 400g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800	1620.00	36.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	5abd309c-096b-4128-9bab-8dc0437d13b2	2000	f3ae956a-2478-4cd7-bcc2-5b7d88b88e8c
9a0a8f76-3ad4-43d6-8d87-3df167eaf994	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://d1x3eomzsc6lfz.cloudfront.net/baskiadam/images/products_gallery_images/standart-kartvizit90.jpg	720.00	16.00	b0c65d46-70f3-4e75-aef3-6e605818c174	kartvizit	kartvizit	9f15a889-1e4a-4a1a-a2e3-080aade7f633	100	7b75311a-0db0-46b5-9883-1874b438f3f1
2234580f-c0df-4cd7-8f9b-adffc9c932fc	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://d1x3eomzsc6lfz.cloudfront.net/baskiadam/images/products_gallery_images/standart-kartvizit90.jpg	720.00	16.00	b0c65d46-70f3-4e75-aef3-6e605818c174	kartvizit	kartvizit	9f15a889-1e4a-4a1a-a2e3-080aade7f633	100	7b75311a-0db0-46b5-9883-1874b438f3f1
9836ca0b-55cc-4c34-bfd0-6012b479ab71	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://d1x3eomzsc6lfz.cloudfront.net/baskiadam/images/products_gallery_images/standart-kartvizit90.jpg	720.00	16.00	b0c65d46-70f3-4e75-aef3-6e605818c174	kartvizit	kartvizit	9f15a889-1e4a-4a1a-a2e3-080aade7f633	100	ca56ffb3-fe9c-4c09-8160-c1c05dcb8146
4fd35ae5-a3e6-4ad7-8bc0-6a0fab3df9c9	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://d1x3eomzsc6lfz.cloudfront.net/baskiadam/images/products_gallery_images/standart-kartvizit90.jpg	720.00	16.00	b0c65d46-70f3-4e75-aef3-6e605818c174	kartvizit	kartvizit	9f15a889-1e4a-4a1a-a2e3-080aade7f633	100	ca56ffb3-fe9c-4c09-8160-c1c05dcb8146
bbfdecb9-582a-4ef1-8d02-1eaf399ea3f5	Kagit: 400g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800	720.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	d5b3450a-1f59-4a5d-9c39-6d0be06f8999	500	ca56ffb3-fe9c-4c09-8160-c1c05dcb8146
51e9ce9b-c8a2-4590-be14-1c1fe528ef54	Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://d1x3eomzsc6lfz.cloudfront.net/baskiadam/images/products_gallery_images/standart-kartvizit90.jpg	720.00	16.00	b0c65d46-70f3-4e75-aef3-6e605818c174	kartvizit	kartvizit	9f15a889-1e4a-4a1a-a2e3-080aade7f633	100	ca56ffb3-fe9c-4c09-8160-c1c05dcb8146
bb1ca57f-e575-43a3-ac80-4670b03146bb	\N	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800	2790.00	62.00	61ef4d08-595d-43ae-9b9a-7935b1e9c28c	Kraft Kartvizit	kraft-kartvizit	028a5593-d9ae-456a-bed4-adad0213fa9e	2500	b582379b-e9e0-49d0-a440-89feb4254341
0be264f3-5463-44b7-9eb6-b4336bb2dc38	Baskı Yönü: Çift Yön Baskı; Ebat: 8.5 x 5.5 cm (Yatay); Selefon: Mat Selefon; Kagit: 350g Mat Kuse	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	http://localhost:8080/uploads/product/dca88e62-2ddf-4f59-8ec1-634a629f618b.png	720.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	0536f7cc-a60a-462e-bb8c-ce966713c797	500	623f46bd-c2b4-45af-83b5-3c0404ec1bb4
3f1e81a4-0c9e-403a-b884-5ac17d2991ac	Ebat: 9 x 5 cm; Baskı Yönü: Çift Yön Baskı; Kagit: 400g Parlak Kuşe; Selefon: Mat Selefon	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	http://localhost:8080/uploads/product/dca88e62-2ddf-4f59-8ec1-634a629f618b.png	1620.00	36.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	3e1eb656-54b0-4ded-bf9c-94e72106f69a	2000	66a435be-4bd3-4839-850f-d89a788ceecb
a66f1d07-e41e-4fd8-9b17-1089ad9f11a7	Ebat: 5.5 x 8.5 cm (Standart); Baskı Yönü: Tek Yön Baskı; Kagit: 350g Mat Kuse; Selefon: Selefon Yok	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	http://localhost:8080/uploads/product/dca88e62-2ddf-4f59-8ec1-634a629f618b.png	720.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	0536f7cc-a60a-462e-bb8c-ce966713c797	500	da27f6ec-5486-4d30-b600-2a6cd635a86a
73570fe3-e618-4d39-89e7-b81b10f2a2b6	Ebat: 5.5 x 8.5 cm (Standart); Baskı Yönü: Tek Yön Baskı; Kagit: 350g Mat Kuse; Selefon: Selefon Yok	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	http://localhost:8080/uploads/product/dca88e62-2ddf-4f59-8ec1-634a629f618b.png	720.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	0536f7cc-a60a-462e-bb8c-ce966713c797	500	6feabc04-13d7-4cd0-b754-21319ce35db2
f39cef70-4110-4452-bec9-a04b8e2ef703	Kagit: 350g Mat Kuse; Baskı Yönü: Tek Yön Baskı; Ebat: 5.5 x 8.5 cm (Standart)	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	http://localhost:8080/uploads/product/dca88e62-2ddf-4f59-8ec1-634a629f618b.png	864.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	0536f7cc-a60a-462e-bb8c-ce966713c797	500	478370d2-e437-447c-aa62-d0c91ff6cc62
6993606b-e88f-444c-a171-f65d9fda3848	Ebat: 5.5 x 8.5 cm (Standart); Baskı Yönü: Tek Yön Baskı; Kagit: 350g Mat Kuse; Selefon: Selefon Yok	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	http://localhost:8080/uploads/product/dca88e62-2ddf-4f59-8ec1-634a629f618b.png	864.00	16.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	0536f7cc-a60a-462e-bb8c-ce966713c797	500	38115a26-f74d-4ead-80d5-af68160b78d6
0bec3fb7-b197-4246-956b-e47361341dc6	Ebat: 5.5 x 8.5 cm (Standart); Baskı Yönü: Tek Yön Baskı; Kagit: 350g Mat Kuse; Selefon: Mat Selefon	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	http://localhost:8080/uploads/product/dca88e62-2ddf-4f59-8ec1-634a629f618b.png	993.60	18.40	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	0536f7cc-a60a-462e-bb8c-ce966713c797	500	a051da28-bbe5-4368-bfd8-045d88fba3c7
70a98576-6045-4f63-81d9-1e28e8d06535	Baskı Yönü: Tek Yön Baskı; Kagit: 350g Mat Kuse; Selefon: Selefon Yok; Ebat: 5.5 x 8.5 cm (Standart)	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	http://localhost:8080/uploads/product/dca88e62-2ddf-4f59-8ec1-634a629f618b.png	1080.00	20.00	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	47d30155-cb8c-4e78-a5bb-530d5f70d5eb	1000	a051da28-bbe5-4368-bfd8-045d88fba3c7
ddb0820f-f9f8-402f-acc5-d9c597980b3b	Ebat: 5.5 x 8.5 cm (Standart); Baskı Yönü: Tek Yön Baskı; Kagit: 400g Mat Kuse; Selefon: Selefon Yok	ac16bace-2752-493d-aeb6-3c6f9977a059	Kartvizitler	kartvizit	http://localhost:8080/uploads/product/dca88e62-2ddf-4f59-8ec1-634a629f618b.png	950.40	17.60	db2838c4-395b-4b8f-930d-d278415c67b1	Standart Kartvizit	standart-kartvizit	0536f7cc-a60a-462e-bb8c-ce966713c797	500	a051da28-bbe5-4368-bfd8-045d88fba3c7
447ada38-fd0e-4956-8b33-6f218a9f682d	Ebat: 5.5 x 8.5 cm (Standart); Baskı Yönü: Çift Yön Baskı; Kagit: 400g Mat Kuse; Selefon: Parlak Selefon	7119c09d-a9fd-41f5-a3b8-0ecc8eeed95e	Standart Kartvizit	standart-kartvizit	http://localhost:8080/uploads/product/22b0c35c-ac6a-46b3-8a18-631b1c93d794.png	2295.22	42.50	c92b4f85-2ca3-4e87-8720-d86b68f5b93f	Standart Kartvizit	standart-kartvizit	a694ce5b-be55-4c46-8f1f-a492da382868	200	ff9a8746-42b9-4692-a760-ee19e39d87a5
\.


--
-- Data for Name: catalog_orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_orders (id, city, created_at, customer_address, customer_email, customer_name, customer_phone, district, notes, order_number, status, subtotal_usd, total_tl, updated_at, usd_kur_at_order, user_id, iyzico_conversation_data, iyzico_payment_id, payment_status, coupon_code, discount_amount_tl, subtotal_tl) FROM stdin;
b10a38f7-3ba2-4d14-a9a7-c1bccc9d874f	İstanbul	2026-05-25 19:27:47.529824+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	il@gmail.com	seckin ilbars	05530214776	Kartal	sfsdfsd	CAT-B85BED23	PENDING	16.00	720.00	2026-05-25 19:27:47.567952+00	45.0000	\N	\N	\N	\N	\N	\N	\N
648c0957-670a-42bc-83d8-1f329933f5e2	İstanbul	2026-05-25 19:50:03.210845+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-09A1A97D	PENDING	36.00	1620.00	2026-05-25 19:50:03.272409+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
0829cae9-467c-471a-ba3b-d8b4fb4af4c6	İstanbul	2026-05-25 19:53:45.272815+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	054530214776	Kartal	\N	CAT-4FAA79BD	PENDING	16.00	720.00	2026-05-25 19:53:45.290843+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
a9ded8d8-145a-46b9-adab-d9b045251516	İstanbul	2026-05-25 19:56:11.739597+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-21CA9803	PENDING	16.00	720.00	2026-05-25 19:56:11.76203+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
9527a82a-d756-4994-b219-2a207eb53f54	İstanbul	2026-05-25 19:58:58.67681+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-89BA17EA	PENDING	16.00	720.00	2026-05-26 06:47:24.506695+00	45.0000	\N	\N	\N	PROCESSING	\N	\N	\N
c50870f7-d311-4100-94c1-581dfae8bfb5	İstanbul	2026-05-26 06:56:05.228404+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	ffsdf	CAT-098E3522	PENDING	16.00	720.00	2026-05-26 06:56:05.259901+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
f3ae956a-2478-4cd7-bcc2-5b7d88b88e8c	İstanbul	2026-05-26 07:17:04.85736+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-B022BCFB	PENDING	36.00	1620.00	2026-05-26 07:17:04.871729+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
7b75311a-0db0-46b5-9883-1874b438f3f1	İstanbul	2026-05-26 08:34:43.225626+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-5512C96C	PENDING	32.00	1440.00	2026-05-26 08:34:43.327751+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
ff9a8746-42b9-4692-a760-ee19e39d87a5	Istanbul	2026-06-02 06:03:26.538788+00	Ataturk Cad. No:1	admin@baski.com	Admin Test	05530214776	Kadikoy	asdasdasdasdas	CAT-2C8EBAA7	PENDING	42.50	2295.22	2026-06-02 06:03:26.563128+00	45.0000	\N	\N	\N	PENDING	\N	0.00	\N
ca56ffb3-fe9c-4c09-8160-c1c05dcb8146	İstanbul	2026-05-26 08:39:54.183787+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214476	Kartal	Acele	CAT-A2432A9A	PENDING	64.00	2880.00	2026-05-26 08:40:57.245656+00	45.0000	\N	\N	\N	PROCESSING	\N	\N	\N
b582379b-e9e0-49d0-a440-89feb4254341	İstanbul	2026-05-26 21:11:57.243772+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	dsfsdfsdfs	CAT-CB0EA54F	PENDING	62.00	2790.00	2026-05-26 21:11:57.278445+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
623f46bd-c2b4-45af-83b5-3c0404ec1bb4	İstanbul	2026-05-27 19:58:05.235618+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	33	Kartal	asdad	CAT-848A66B4	PENDING	16.00	720.00	2026-05-27 19:58:05.292421+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
66a435be-4bd3-4839-850f-d89a788ceecb	İstanbul	2026-05-29 18:09:09.764576+00	uğurmumcu mahallesi,Şeyhşamil caddesi FeraLife sitesi b/20	\N	seçkin ilbars	05530214776	kartal	\N	CAT-21409773	PENDING	36.00	1620.00	2026-05-29 18:09:09.83735+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
da27f6ec-5486-4d30-b600-2a6cd635a86a	İstanbul	2026-05-29 18:10:41.003257+00	uğurmumcu mahallesi,Şeyhşamil caddesi FeraLife sitesi b/20	\N	seçkin ilbars	05530214776	kartal	\N	CAT-7C30B7B4	PENDING	16.00	720.00	2026-05-29 18:10:41.019079+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
6feabc04-13d7-4cd0-b754-21319ce35db2	İstanbul	2026-05-29 18:11:53.356652+00	uğurmumcu mahallesi,Şeyhşamil caddesi FeraLife sitesi b/20	\N	seçkin ilbars	05530214776	kartal	\N	CAT-6AF1C83A	PENDING	16.00	720.00	2026-05-29 18:11:53.369579+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
478370d2-e437-447c-aa62-d0c91ff6cc62	İstanbul	2026-05-29 18:32:34.779528+00	uğurmumcu mahallesi,Şeyhşamil caddesi FeraLife sitesi b/20	\N	seçkin ilbars	05530214776	kartal	\N	CAT-90E22FC7	PENDING	16.00	864.00	2026-05-29 18:32:34.814311+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
38115a26-f74d-4ead-80d5-af68160b78d6	İstanbul	2026-05-29 18:33:56.811295+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-CF8C39D2	PENDING	16.00	864.00	2026-05-29 18:33:56.838992+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
a051da28-bbe5-4368-bfd8-045d88fba3c7	İstanbul	2026-05-29 19:19:59.265741+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	test@gmail.com	test	05530214776	Kartal	\N	CAT-7599AA1E	PENDING	56.00	3024.00	2026-05-29 19:19:59.281373+00	45.0000	\N	\N	\N	PENDING	\N	\N	\N
\.


--
-- Data for Name: catalog_product_attribute_values; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_product_attribute_values (id, attribute_id, option_id, product_id) FROM stdin;
2c09f25d-4e5b-4af9-9e9a-c006069b3235	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	5c1c1bdc-91f1-4ddf-96b6-a3886c37e73c
ba433261-55fc-4372-a56f-9cbab180338d	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	fbabc552-7ac1-4d48-8f05-8dbd9841a931
34b5d5ee-b61a-4a9d-8c9e-c5bde786b0fe	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	1a8bd646-5d18-4514-80a7-8c48cf85946f	b8ac33a9-1beb-4b18-98a8-b45d39259271
e7f8ae8c-78f8-4b84-8cdf-e27bed47bede	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	5c1c1bdc-91f1-4ddf-96b6-a3886c37e73c
05461504-27bf-4029-893d-a10610c8d3d3	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	fbabc552-7ac1-4d48-8f05-8dbd9841a931
8809d65d-0e42-4321-86d8-7f8f951ad8d2	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	9423cb73-cc17-4808-99f9-61e504173f90	b8ac33a9-1beb-4b18-98a8-b45d39259271
4ae222b7-8299-4ffd-a36d-9f7266523e7a	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	b69f701e-9fa2-437a-8db4-8d123f76bf94
50d6f213-9726-4959-a1c4-71e411d3c4d3	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	b69f701e-9fa2-437a-8db4-8d123f76bf94
3383e069-c486-4765-8e40-6315ade532e7	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	b69f701e-9fa2-437a-8db4-8d123f76bf94
dc2d23ed-0a56-4fc9-b27a-72df867ec616	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	b69f701e-9fa2-437a-8db4-8d123f76bf94
076aed76-495a-46a0-8bb9-f84db3a0c717	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	2d10ce43-3226-43ed-9d4a-1b6781035b09
efb8000f-7413-4231-9aec-7eff392d67bd	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	2d10ce43-3226-43ed-9d4a-1b6781035b09
632668b9-cb5e-4dc8-9a29-e0e09bff579a	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	2d10ce43-3226-43ed-9d4a-1b6781035b09
7acec5a9-c878-40ce-a03c-6070565a7300	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	2d10ce43-3226-43ed-9d4a-1b6781035b09
f73c783b-0554-419b-8482-08b865d94d1d	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
a990f532-d573-4d05-8f7d-318278148b05	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
9e6d95b0-21b5-46b9-8e43-72c7d07cb93f	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
b4b413e1-0cc8-43b9-a8da-be45a4621dd5	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
e00ddb66-b20c-46f6-b830-8151cf815ade	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
502762be-f8e6-44bd-ae9a-f195e5439356	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
78083514-d393-45fd-89d3-0fbe5e35fb68	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
a9aaa22d-718a-431c-984a-a8dd2dbb9059	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
e3ae03a4-2ea8-492c-9375-97284d8e6ef2	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
e3d6c7bd-3063-41d5-8220-06d5f12eb030	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
e98fb955-8e6a-42e4-ace5-e0a94feecbc4	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
00a36b77-33b5-478c-969e-6c16df102c20	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
1451512e-c5ec-4d2d-b145-d754172ed07d	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
395f14df-bc07-407a-8f89-2a287cc698e6	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
fb8f9c74-13e0-4e3a-8106-a8cb85f73328	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
177a9fe2-5d7a-469f-a503-d8fe56a4522a	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
69716e91-30b0-411d-9580-ee0dcbe3fbfd	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
60d4fa77-14d6-43d7-b295-e5f6a1ef0c37	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
f21de3b1-5786-4815-9b67-a6852fa04164	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
3a8a0a02-f4b2-4769-b150-dfeaef7cd1e1	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
86278142-2497-4e8e-a92c-d1df05be83ec	bc151ac5-d6c1-4e3a-97e3-cf707efc0abd	a2b30cc9-0902-454f-8e9f-1f6708501385	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
e0cc0a71-fcb6-4263-a1ed-cc0c52521b0a	bc151ac5-d6c1-4e3a-97e3-cf707efc0abd	4f752bb8-ce24-466a-b3ea-ebbcedb8c0f1	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
73c1d9e8-6053-4bca-892d-5ec847a15382	bc151ac5-d6c1-4e3a-97e3-cf707efc0abd	44218825-7788-4290-9287-852814eac52e	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
3dffc44c-500b-4bb7-94d3-4a0b4422a430	17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	0a0293b1-9806-433f-af53-4b2ed0adeb52	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
f659cdb6-c60d-45b2-a8ec-ac2dc49c9906	17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	2a7c106f-14f4-4c9e-a4d3-6e9ac00bd269	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
ba10e85d-7322-4aae-8aea-91af327a82a1	17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	86e5066d-4c73-4fb1-b1b2-7d846c86dd9a	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
4dfe0d34-5e79-4b81-b07b-79b735900a99	17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	5336324f-bbd8-4700-92cc-bb860dcac827	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
7919a5a3-3aac-42ae-9aa7-d974b8d36f2c	17c3fc4b-f0e9-4062-91b5-ad3f5d17a45a	942e06b9-dc5e-4e89-bfe9-d292874b90c9	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
e56bd078-de44-4fdf-9c0d-458cef7e419d	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	9625f7c7-3058-4960-a42e-3b3648a5d1b4
11a26640-036f-4d22-9cf1-1da73e065280	9dcacff6-0b5f-42a4-b70e-543f6ae821f4	0c39b136-40f8-43d0-920a-208332cd54f3	9625f7c7-3058-4960-a42e-3b3648a5d1b4
3f8064f8-6fe1-4311-9310-80d9c650083d	9dcacff6-0b5f-42a4-b70e-543f6ae821f4	bc01e1a9-c980-4e66-9885-c7bfb7c3929d	9625f7c7-3058-4960-a42e-3b3648a5d1b4
f15e323d-2711-4cc1-955c-ff288b7b6286	fb433077-1084-4e27-a944-529f544d51f2	5b813f3d-b0a3-4f53-9643-076317071e6c	dbeb2ecb-012f-43f5-a5dc-6523433db614
846e3f5e-13bd-41b4-9f84-b5464b44d721	fb433077-1084-4e27-a944-529f544d51f2	c2eae418-eda3-4adc-aeff-37d41724bc76	dbeb2ecb-012f-43f5-a5dc-6523433db614
401d186c-ca29-4d97-a9ca-4bda93f75847	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	d32e70ec-9b9d-4209-b8a0-3dc47e66f473
815bd476-1e3d-4070-9fb9-9544e9b3029e	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	d32e70ec-9b9d-4209-b8a0-3dc47e66f473
74c6722b-5bb9-436e-882a-e2aabadeb309	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	1a8bd646-5d18-4514-80a7-8c48cf85946f	bcc03a57-f819-447d-8fb7-cf3b1b6a74d1
9d7f17f1-81e9-4631-a070-287c0403a603	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	9423cb73-cc17-4808-99f9-61e504173f90	bcc03a57-f819-447d-8fb7-cf3b1b6a74d1
73008748-f8fa-4126-8cd9-d2df5f03f4ca	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	1a8bd646-5d18-4514-80a7-8c48cf85946f	889bc829-dcf8-4f8d-aba5-88ac06037a39
0b466538-76b7-4d53-8954-d88f1077e5a6	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	9423cb73-cc17-4808-99f9-61e504173f90	889bc829-dcf8-4f8d-aba5-88ac06037a39
c4864f06-3e1f-430b-abc1-bc06e492d36c	83365ad7-83a3-4603-9eaa-3280427d42c1	86483265-1bb5-481d-86b2-33cf9280ae2a	2f926ce2-242c-495d-983d-2c34a4e5e60d
731936e6-7aa3-4132-a5a6-091b2781a4cf	83365ad7-83a3-4603-9eaa-3280427d42c1	af06b99b-57f9-4e5f-8038-bcd39a83dae1	2f926ce2-242c-495d-983d-2c34a4e5e60d
9e99e5ec-5420-4e54-8938-9cf32fca39b9	c5820856-c4ad-4c76-9c80-82f8d2646fde	02cd1c86-d887-43df-8b54-185bccafdd00	2f926ce2-242c-495d-983d-2c34a4e5e60d
77d522f6-6b66-4f23-8101-69ab7e145471	c5820856-c4ad-4c76-9c80-82f8d2646fde	7f91c265-2b93-4b86-928e-550da8c37c15	2f926ce2-242c-495d-983d-2c34a4e5e60d
22e538b5-0deb-43a3-a1b1-435926b3bb33	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
6d12f4a7-5370-45f5-ab8e-fcadc34c5b00	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
c600d8cf-b12e-481d-a608-9c7881366016	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
87e9a848-ebc5-49c0-b335-5d6ce951413f	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
5b8b3c23-700b-42ac-9276-3d8b5afa6faf	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
746ece97-bd7e-4dd9-b4d3-5d41afd05229	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
2d323dd7-1d69-45f9-b647-daca86e83995	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
5266d005-f887-48e4-9d37-61ef60734f32	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
f68894f8-233a-4f63-b8b4-4326bb6dd0e3	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
f3c9f44d-3545-4473-8869-c5a39499a647	9d90ae96-67ae-4eb0-aaad-b08e661699b7	0ddd892c-6957-4b32-bcea-0d1f8c305b62	2f926ce2-242c-495d-983d-2c34a4e5e60d
910943ca-f05f-4c20-bb2f-15ef79a3e2c3	9d90ae96-67ae-4eb0-aaad-b08e661699b7	62f7ffcc-f4f7-4301-a8b6-1e03a6508ce1	2f926ce2-242c-495d-983d-2c34a4e5e60d
fb86398c-4e67-4061-8f8d-65282c96b02d	7495bf0b-9681-4b1b-9a05-157ee6b457ca	9020378a-685d-41de-978a-0457b674229d	bb54d991-8205-4970-b0a7-a49473e7a4d6
a1ee9a0e-6f2b-4f50-b025-d5d594684706	67db1c75-8896-4153-947f-4d758f168c61	ea7107ff-4c6e-4eba-91e3-34a0b36726b2	bb54d991-8205-4970-b0a7-a49473e7a4d6
f111de99-1d23-4032-974a-82e5e0767772	67db1c75-8896-4153-947f-4d758f168c61	2cf68485-b080-4299-9105-6aa8ada21913	bb54d991-8205-4970-b0a7-a49473e7a4d6
fb95a067-f8ca-4dd5-aee1-a13f96a92d69	67db1c75-8896-4153-947f-4d758f168c61	ccabcc2a-de93-4bc1-989b-c18b7a929165	bb54d991-8205-4970-b0a7-a49473e7a4d6
22c5f972-1986-4cf2-9c02-5778ccb959f9	f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	e58dacc7-27ea-48c0-a6a9-d53b571335f4	bb54d991-8205-4970-b0a7-a49473e7a4d6
02a0c193-4eaa-4d80-918c-7d229ee04fe2	f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	cf1a02f4-21bf-49ae-9851-827051943d16	bb54d991-8205-4970-b0a7-a49473e7a4d6
0f5111eb-31f9-457c-bfc6-d8744ffdf984	f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	bb59e052-2fac-4402-9abd-943bee5f4f22	bb54d991-8205-4970-b0a7-a49473e7a4d6
fa608eba-6dbd-40ef-ad3d-899c2aeca5a4	f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	584da31f-0079-4dd4-87d3-bb51506d0e72	bb54d991-8205-4970-b0a7-a49473e7a4d6
facb22d2-3d0d-4ae8-a756-cbbb1b01b2dc	f029e7e3-8a88-4e4d-9fae-31621b1f8bd4	233d71ca-190a-447b-8e4c-d3472b2e3055	bb54d991-8205-4970-b0a7-a49473e7a4d6
65361286-51ee-40dd-a5f4-f93532f832bd	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	ff92cf7d-b1aa-4baa-831f-861da7a21015
5a1812c5-c9d1-4765-9b7d-45a435365aba	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	ff92cf7d-b1aa-4baa-831f-861da7a21015
c10f98a0-d6bf-4524-8e99-e16ab1d85c84	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	93caa48c-b5d8-4289-96b8-e9b7ac2b8d9a
ffa00089-9119-4c22-b4a1-ee68d7514316	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	93caa48c-b5d8-4289-96b8-e9b7ac2b8d9a
67d9bc1f-490c-40b9-8c90-2138a23c6916	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	27217955-03b8-4a3f-b57e-bbff60ac1328
d16f43c1-ba91-4f31-9da1-f57bb08759f4	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	27217955-03b8-4a3f-b57e-bbff60ac1328
6ffd993b-83f0-4fff-9f98-ee6b6c2ecde8	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	1a8bd646-5d18-4514-80a7-8c48cf85946f	d2461563-bae2-493c-9aec-9581f6e937a3
b115e57e-cc97-4e5e-bc02-f3236cd10798	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
0cc867c1-3e64-4235-8b4e-69ab204efe2b	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
f528d477-364e-45b5-9bd8-6df9b0f8abf1	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
e4544890-b0b0-42b6-b3ec-ff09043b2a03	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
afbdd6f8-66fa-4b9f-9aae-7faea3a1f1b9	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
a00a57e3-9f0e-408e-91ad-67df0a054704	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
02d40e6b-94be-4084-ab04-0eb977c208bb	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
a5d0affd-69fb-4847-9ca4-745d43ca6d90	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
d791c5b2-1368-422c-9693-d83e6b83c966	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
2ef0fe99-1abb-49cf-9b6b-5b7c11a37a35	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
c7c16ce8-2d74-42d7-9861-36967aab4936	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
7e203bc8-2bcb-41b5-ae33-bde759adff11	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
ff824a1a-377f-4578-a115-564567876566	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
74473c84-aaca-41a8-90ea-747ea47aa24d	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
d8433e56-a056-41bb-afa3-df94bd6fad35	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
ab5551a0-c3c1-4eda-951e-887caa79f9cb	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
9561ed75-6cc2-45fb-ab2e-93751349c7e7	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
a1239e3e-fed6-4a22-98f3-5cebd09d480e	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
626d255e-d2aa-47d1-9d22-9de9f812c9a7	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
c5c632bf-5405-4fd4-ac5c-5d105c73e0c3	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
6947841d-b4a2-461f-b225-05b59de92373	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	9423cb73-cc17-4808-99f9-61e504173f90	d2461563-bae2-493c-9aec-9581f6e937a3
907160e0-3a93-4b3c-a31a-2680968a352f	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	1a8bd646-5d18-4514-80a7-8c48cf85946f	99420ca6-a8ff-4aa2-bcde-03181677ba26
419c3761-45d9-4f5c-b962-ee64e0a8edec	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	9423cb73-cc17-4808-99f9-61e504173f90	99420ca6-a8ff-4aa2-bcde-03181677ba26
9ff637af-4d46-44fb-88e4-a73158a0a4b4	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	1a8bd646-5d18-4514-80a7-8c48cf85946f	f1480084-32f7-4cd0-9a1f-a66fbcd30ea0
5d74778f-ea68-49c4-903c-3c324438c577	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	9423cb73-cc17-4808-99f9-61e504173f90	f1480084-32f7-4cd0-9a1f-a66fbcd30ea0
82da993a-4e73-4597-a72a-405ef6466186	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	1a8bd646-5d18-4514-80a7-8c48cf85946f	33f1bebe-3e36-4fd5-a623-ef092d18a638
939b0f7f-db98-4753-978f-060a26d9b71e	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	9423cb73-cc17-4808-99f9-61e504173f90	33f1bebe-3e36-4fd5-a623-ef092d18a638
40006259-50c4-430a-9826-78972c5ed6ac	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	fbd34467-d662-4ae4-9c25-1c85a478243e
3b0f30be-8460-4d1b-bbd1-0083a5af9772	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	fbd34467-d662-4ae4-9c25-1c85a478243e
7551e492-507f-47f4-bb13-0a87d41085c0	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	fbd34467-d662-4ae4-9c25-1c85a478243e
d5c25483-8138-4077-bcf3-60c7cbbb7112	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	fbd34467-d662-4ae4-9c25-1c85a478243e
b212a494-0e9a-4fff-8676-89e6acdd76b1	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	fbd34467-d662-4ae4-9c25-1c85a478243e
7ee9722a-5014-4980-a02b-0f07cd962ef5	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	fbd34467-d662-4ae4-9c25-1c85a478243e
501dfa52-dacc-4610-b996-006996d41479	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	fbd34467-d662-4ae4-9c25-1c85a478243e
0828db39-42d8-4c0e-a621-ab64150108d3	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	fbd34467-d662-4ae4-9c25-1c85a478243e
9067499d-8d0f-4038-8231-2fb15d4d789c	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	fbd34467-d662-4ae4-9c25-1c85a478243e
4d3e313c-cb4f-4910-b699-359771ab811c	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	fbd34467-d662-4ae4-9c25-1c85a478243e
07c08d2f-6932-4ddb-a884-cb95448bdbb3	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	fbd34467-d662-4ae4-9c25-1c85a478243e
cbc9e3d1-b251-42a9-9145-076c82d159a6	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	fbd34467-d662-4ae4-9c25-1c85a478243e
7fda87ed-9dae-4b38-938c-1161e5781999	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	fbd34467-d662-4ae4-9c25-1c85a478243e
bf495a98-9356-4f54-82f8-b7d0215cfc14	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	fbd34467-d662-4ae4-9c25-1c85a478243e
863f1e1a-f2ae-4ca1-9afb-dd2db9c0864a	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	fbd34467-d662-4ae4-9c25-1c85a478243e
2416a58c-8ceb-4a57-9fc2-8f6d3bd50628	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	fbd34467-d662-4ae4-9c25-1c85a478243e
c1a8f76b-a67a-430d-a6b6-6726fa78208b	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	fbd34467-d662-4ae4-9c25-1c85a478243e
4bbcf6c8-6053-4b3c-b096-fb020ec13d01	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	fbd34467-d662-4ae4-9c25-1c85a478243e
407a47cd-fd2c-4ae2-bafb-fb1db15fc0a7	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	fbd34467-d662-4ae4-9c25-1c85a478243e
17942149-093c-44bf-87a5-efc0adc1bebb	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	fbd34467-d662-4ae4-9c25-1c85a478243e
f1176cee-c9a2-4367-b947-365e28deec44	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	c50afce6-a0bd-4914-b506-50e99a1faaf4
e02ce449-af96-4bcb-bd04-dc4064838718	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	c50afce6-a0bd-4914-b506-50e99a1faaf4
4b12eabe-c4fe-453c-8eb3-9bac08c844e8	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	c50afce6-a0bd-4914-b506-50e99a1faaf4
c28443c9-ef05-4bfc-a3ed-c7c242ca2774	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	c50afce6-a0bd-4914-b506-50e99a1faaf4
3d101419-63df-414c-82fe-b0a546d1cda1	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	c50afce6-a0bd-4914-b506-50e99a1faaf4
05256376-6500-4de7-a038-f07ad59700fd	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	c50afce6-a0bd-4914-b506-50e99a1faaf4
97e84a3a-8b44-4bd6-a131-02abbd5ed843	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	c50afce6-a0bd-4914-b506-50e99a1faaf4
03317e4e-e572-42e2-9545-a885a66eae30	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	c50afce6-a0bd-4914-b506-50e99a1faaf4
7f66b711-1265-439c-8552-9be845ce74c5	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	c50afce6-a0bd-4914-b506-50e99a1faaf4
25f0ba1d-4dd6-40b3-afe8-37b78609f1d9	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	c50afce6-a0bd-4914-b506-50e99a1faaf4
abccc129-dd9a-451c-aed8-eb69d444ce4d	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	c50afce6-a0bd-4914-b506-50e99a1faaf4
995f6cfa-4566-4c45-a3b9-32dd19cc5bbc	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	c50afce6-a0bd-4914-b506-50e99a1faaf4
1972100d-68a1-4158-9493-321577f4f264	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	c50afce6-a0bd-4914-b506-50e99a1faaf4
d4950fe4-e847-4e56-a3eb-7f9dda752306	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	c50afce6-a0bd-4914-b506-50e99a1faaf4
5588a9f4-384b-42f1-b774-e7a6b00c9179	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	c50afce6-a0bd-4914-b506-50e99a1faaf4
b28bf6be-7145-4923-b189-51efa581b830	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	c50afce6-a0bd-4914-b506-50e99a1faaf4
4ff64a0c-7c39-4fc8-8b3e-50d2a75f1cd6	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	c50afce6-a0bd-4914-b506-50e99a1faaf4
0e762983-619b-4773-ba7b-0a24d542b198	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	c50afce6-a0bd-4914-b506-50e99a1faaf4
94e937ce-c27f-4ed8-a2c6-15147d3b7559	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	c50afce6-a0bd-4914-b506-50e99a1faaf4
7f2eecd9-298a-41e3-8dfb-6353b270f288	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	c50afce6-a0bd-4914-b506-50e99a1faaf4
c8314607-6e37-46ff-8ccf-6254901c721f	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
1fa80eb4-90e8-4025-98d4-aa2bae7e7559	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
ce3e7e9e-804e-4bc5-9b7c-acb3e8714068	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
625c0a6f-2efc-4b0e-8ee4-a8c55fd41fe9	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
760ee370-4f54-4d4b-be28-185869f33f3b	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
70061896-41b4-4d07-bdf0-b5ecec669d84	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
ba93f706-017c-404a-b68b-ed63a4a446ff	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
914cc8d9-afe3-4b9a-bb7d-55cceb225b5f	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
d2983a8e-8fc8-4c31-92b5-bb5de93521ff	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
1e3d89e5-9017-4f1f-8ea1-b95029bb7444	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
6fc3cf5d-d3d1-48d7-99c1-369ca365a734	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
d71c8150-0815-4806-b9c1-73f822e0e240	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
55cd592a-ebfc-4716-839f-9ad1b045e5c4	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
184b76ce-b854-4a41-b00c-9d6cf5f16640	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
3252c7c5-7df9-4649-a48e-4b36cbce0c33	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
8b8d5a60-0d82-4c40-b32d-04a4833d6609	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
328a3c78-17fe-43b1-82cd-0090239e7bba	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
53323a5b-e0cf-49e7-b755-3b2ba576a24d	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
777c42b1-fd66-4e96-8898-76d29713ee46	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
3a894c5a-67ae-419e-aa6d-9bba74d43df6	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
b382fc04-45ca-40c0-a546-0118054bfb1b	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	379f4020-e851-4a34-9703-83e337682ca6
52007577-3df6-42f4-bf3d-d91f196cc1e0	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	379f4020-e851-4a34-9703-83e337682ca6
7eae10e3-0b68-4394-acc5-e07cb066fe7d	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	1a8bd646-5d18-4514-80a7-8c48cf85946f	f1c87cd7-84f7-4b56-84b5-a5557835e192
d549ef73-d972-4ffe-91bf-05ddd53faef8	176daa1a-0316-4fbc-91c9-0f3eb5f29c5f	9423cb73-cc17-4808-99f9-61e504173f90	f1c87cd7-84f7-4b56-84b5-a5557835e192
3e7a3478-f427-4b73-9ab2-2d97cacee7f7	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	c8e2f9ae-385f-43c9-9ba7-e5416112975c
919fd6f2-829a-44a7-8706-55c2107cadec	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	c8e2f9ae-385f-43c9-9ba7-e5416112975c
4a568dc3-1258-4449-a824-22175275edc4	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	c8e2f9ae-385f-43c9-9ba7-e5416112975c
38655f4d-4cf8-40f9-8d2b-9c19f5561a45	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	c8e2f9ae-385f-43c9-9ba7-e5416112975c
bfdaa88d-dc31-4d3a-a250-eb7e4327a7fc	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	c8e2f9ae-385f-43c9-9ba7-e5416112975c
fd34a466-9cbc-40f0-9b74-470b1f2482e8	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	c8e2f9ae-385f-43c9-9ba7-e5416112975c
392e9465-9ab7-4426-b3d7-8f4556faf51d	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	c8e2f9ae-385f-43c9-9ba7-e5416112975c
cc7d58e0-b780-426e-9588-31efd3ecd722	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	c8e2f9ae-385f-43c9-9ba7-e5416112975c
7ce36e1b-25a5-4fe1-8dd9-b8caa5069a1f	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	c8e2f9ae-385f-43c9-9ba7-e5416112975c
a50ee439-a9cc-4ae5-9b23-7bfb6e8180d5	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	c8e2f9ae-385f-43c9-9ba7-e5416112975c
1cb45712-c885-4878-b1a8-09781c981a4b	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	c8e2f9ae-385f-43c9-9ba7-e5416112975c
f5112558-ceb5-4163-af15-f9910b1f9838	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	c8e2f9ae-385f-43c9-9ba7-e5416112975c
0db8feec-8c75-4169-986b-c9f0e90e0b17	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	c8e2f9ae-385f-43c9-9ba7-e5416112975c
c9ddfc27-6aa4-495a-a9ae-fcefe055b7b4	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	c8e2f9ae-385f-43c9-9ba7-e5416112975c
defad485-ae7e-4a0e-bef6-c4057ef6787b	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	c8e2f9ae-385f-43c9-9ba7-e5416112975c
86115c3d-9e0c-4434-8ed8-a4d13edba835	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	c8e2f9ae-385f-43c9-9ba7-e5416112975c
67ee152a-8708-4062-a788-e0e7217f54dc	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	c8e2f9ae-385f-43c9-9ba7-e5416112975c
c880450a-e638-43f4-beb9-3461f7a7d706	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	c8e2f9ae-385f-43c9-9ba7-e5416112975c
5f465339-5369-4b2c-b7dd-1baf72dd09a3	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	c8e2f9ae-385f-43c9-9ba7-e5416112975c
4ca5a3ef-7319-4277-9df7-86269879f800	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	c8e2f9ae-385f-43c9-9ba7-e5416112975c
22cc5aa5-9d69-4a22-832d-3a75876c30e3	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	2d10ce43-3226-43ed-9d4a-1b6781035b09
5669eb25-289a-4375-b739-9623e5dc9be3	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	2d10ce43-3226-43ed-9d4a-1b6781035b09
644d2b4f-f5b6-4102-8217-1318ca059bd9	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	2d10ce43-3226-43ed-9d4a-1b6781035b09
ccfd9e0f-0d0e-4ecd-92ef-ee20e985ee97	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	2d10ce43-3226-43ed-9d4a-1b6781035b09
147ee5d0-b845-4867-a8fe-21b4ffdff9db	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	2d10ce43-3226-43ed-9d4a-1b6781035b09
1059a37d-f846-43f0-a64e-d72ab77704c5	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	2d10ce43-3226-43ed-9d4a-1b6781035b09
92953962-49bf-42f1-a938-d6f71641e7ff	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	2d10ce43-3226-43ed-9d4a-1b6781035b09
836c5dc3-db54-415e-b910-18d3199d93dd	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	2d10ce43-3226-43ed-9d4a-1b6781035b09
f88dcd8e-0012-46f5-82ae-f2a546939b96	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	2d10ce43-3226-43ed-9d4a-1b6781035b09
949f17e3-a58b-4244-b38e-5075e44374ca	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	2d10ce43-3226-43ed-9d4a-1b6781035b09
db1c5524-783f-4284-9334-c14aab108978	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	2d10ce43-3226-43ed-9d4a-1b6781035b09
bfc6b288-7212-4b58-8eb8-6df3f60b3918	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	2d10ce43-3226-43ed-9d4a-1b6781035b09
ed0c47b3-baa8-45ef-b0b6-a892bdac0bed	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	2d10ce43-3226-43ed-9d4a-1b6781035b09
9dd25ac6-1a0a-4cfc-9fba-5fc146f7b8ec	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	2d10ce43-3226-43ed-9d4a-1b6781035b09
61052934-ecf4-464f-8117-67fe3304102b	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	2d10ce43-3226-43ed-9d4a-1b6781035b09
d880c034-e1af-4f4c-8232-48113bbeb753	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	2d10ce43-3226-43ed-9d4a-1b6781035b09
03b82e23-2a99-4de1-af15-186e21894368	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	7c838a0f-3cf5-4087-9793-7ac22befe06f
24b6c9d2-0758-4469-a9da-aa0332081973	e75f178f-e149-4d29-b48f-2c65f9e30424	287a7eed-bddf-4e0d-82ad-462ffcfb4ed4	7d6c8738-455d-488c-a3fc-d5ecf745efa9
c6e87edf-19ea-4d01-b631-bdb34b2c9c05	464b74d3-e18d-4158-bd77-4d5c0d5eab4b	abb818f5-7588-4e3c-b4c5-8d88c2223141	7d6c8738-455d-488c-a3fc-d5ecf745efa9
1a085f76-00b0-4429-b6ee-8f2256c6b6bc	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	faa09eab-a088-4178-ba38-bdfe1e84f067
4b59c0c8-1efd-4bdd-81e3-fedcf1c58d85	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	faa09eab-a088-4178-ba38-bdfe1e84f067
5fef8b5c-16a8-4e7f-95b5-c0b552efe847	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	faa09eab-a088-4178-ba38-bdfe1e84f067
772281ff-f8c0-4f08-9944-eb8ac41baf98	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	faa09eab-a088-4178-ba38-bdfe1e84f067
75d6a70a-fa48-424b-8f02-e0a11bf67c02	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	7c838a0f-3cf5-4087-9793-7ac22befe06f
a25373ab-fd58-4b5e-9a26-bfe5931389cc	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	7c838a0f-3cf5-4087-9793-7ac22befe06f
99e1f014-3698-430d-9a68-d120ba0c05ab	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	7c838a0f-3cf5-4087-9793-7ac22befe06f
55b53940-3574-42e5-a841-9374d6a61fb0	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	7c838a0f-3cf5-4087-9793-7ac22befe06f
bb6b3e4f-6998-4350-a84f-be1e66ae31d8	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	7c838a0f-3cf5-4087-9793-7ac22befe06f
a10f065f-f8db-4ec5-832d-004658a4400e	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	faa09eab-a088-4178-ba38-bdfe1e84f067
f712bcfa-ec6f-4c0d-ae0d-1fcd6bc042ca	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	faa09eab-a088-4178-ba38-bdfe1e84f067
3c3cb756-7aeb-4df7-abda-4716e3357766	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	faa09eab-a088-4178-ba38-bdfe1e84f067
ddbc2dc0-c73b-4729-9601-06649d4dc250	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	7c838a0f-3cf5-4087-9793-7ac22befe06f
4839e28e-fa88-449e-8e80-d1153a6763ef	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	7c838a0f-3cf5-4087-9793-7ac22befe06f
c41576a8-9fc4-4ac7-99f5-e48e02fa05fd	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	7c838a0f-3cf5-4087-9793-7ac22befe06f
c5be3d0e-16d1-4c71-a7ab-096b0b15eeaf	dc49eaaa-3a28-4195-a72f-e1e35e56c983	1e8928fc-47aa-4da7-8393-5258e78b97f3	a2f7ea19-abe4-4998-a223-993b2a5d3090
95511270-c099-47ec-8643-59a47a5050c4	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	7c838a0f-3cf5-4087-9793-7ac22befe06f
5b2ef52c-35fe-4c00-8cc7-b9cc67b8f84a	dc49eaaa-3a28-4195-a72f-e1e35e56c983	d9d7cd8a-53e4-4479-8fbb-7eeea476bce6	a2f7ea19-abe4-4998-a223-993b2a5d3090
2d36cd22-715e-47ce-8a88-18596ca18a1c	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	faa09eab-a088-4178-ba38-bdfe1e84f067
0296d91c-a86e-4251-afe8-d7acfb61509a	dc49eaaa-3a28-4195-a72f-e1e35e56c983	e79ac359-7ce5-4deb-adfa-6374f4943a79	a2f7ea19-abe4-4998-a223-993b2a5d3090
a92f77ca-36e0-484b-8f5f-0633924acdc0	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	faa09eab-a088-4178-ba38-bdfe1e84f067
6dc2af99-da97-4555-a408-b967a0872d97	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	7c838a0f-3cf5-4087-9793-7ac22befe06f
f136fe83-fb2c-422a-ba6c-e706da3c22f7	dc49eaaa-3a28-4195-a72f-e1e35e56c983	dc7fc555-54a8-4be1-9d11-b11467d6e2fe	a2f7ea19-abe4-4998-a223-993b2a5d3090
92404b4a-39c7-4d5e-8785-84c7aed1c7c7	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	faa09eab-a088-4178-ba38-bdfe1e84f067
f765b22f-1b7f-4f98-b109-67abbe249f18	4f597342-0069-47d1-ac04-19d8f9f069f4	093b5ff4-2c73-470f-ac83-6ef94c1af37e	a2f7ea19-abe4-4998-a223-993b2a5d3090
3aa830de-95a1-4cd7-96c5-5def1691ae72	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	faa09eab-a088-4178-ba38-bdfe1e84f067
5f6f5775-630b-4fd7-a2f6-16aad1841e13	4f597342-0069-47d1-ac04-19d8f9f069f4	7b0726f8-8699-4680-b01d-f21fa90934c8	a2f7ea19-abe4-4998-a223-993b2a5d3090
dc4f9c05-0d2d-459a-842e-4174de2e0b77	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	faa09eab-a088-4178-ba38-bdfe1e84f067
e6082557-22c8-46aa-9bb4-a8ad627ec7c1	50c66935-efbe-4e2a-9fca-effd21ea3a63	d4552911-b64b-4ef4-ba60-a3b671f6d9e0	a2f7ea19-abe4-4998-a223-993b2a5d3090
aebabeaf-0ca1-4883-b791-a45d42a3a8b3	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	7c838a0f-3cf5-4087-9793-7ac22befe06f
914137e6-a138-41ee-a2cd-4801e3a6e8af	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	7c838a0f-3cf5-4087-9793-7ac22befe06f
8edafdfa-7fef-4de9-b070-297e2d94409e	50c66935-efbe-4e2a-9fca-effd21ea3a63	11ea5ee7-b93a-4263-803f-6a7122c87a96	a2f7ea19-abe4-4998-a223-993b2a5d3090
b2012e12-7ee3-4231-8690-1d1813ec8a73	50c66935-efbe-4e2a-9fca-effd21ea3a63	7f45144b-1974-4388-9235-4d67ca66b7c1	a2f7ea19-abe4-4998-a223-993b2a5d3090
14da3502-cf1a-468d-86ef-60f5e6bf1176	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	d6b6b2bd-36dd-45b8-918b-2af953a8c2b3
612ad547-a2b2-47dd-85e8-501a3c938122	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	d6b6b2bd-36dd-45b8-918b-2af953a8c2b3
f5167398-12ec-4a61-b5d5-36ff05d2821c	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	7c838a0f-3cf5-4087-9793-7ac22befe06f
9f4fc3ac-31a3-4035-8564-193e28246966	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	faa09eab-a088-4178-ba38-bdfe1e84f067
1106b5e9-293f-464e-b66e-b836969e73a5	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	faa09eab-a088-4178-ba38-bdfe1e84f067
c764c909-c71b-4e7c-9790-e4c6aca1ba23	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	7c838a0f-3cf5-4087-9793-7ac22befe06f
f7bdceca-d601-4400-a2d1-a6a5130ab82a	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	faa09eab-a088-4178-ba38-bdfe1e84f067
dd7500a1-1bc1-4a15-a0d6-e6202c9d96a3	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	7c838a0f-3cf5-4087-9793-7ac22befe06f
65e784bd-c5cd-466f-993f-381279bebbb9	d3edb2af-d3c4-4a15-9b43-8a11167a601c	cb0a2093-7470-498b-8336-7f32e2d23d83	96968a16-96f7-4647-bd50-4ec8dfe32ebf
aa337b6e-6f46-4463-9d1a-a9efdbfcf1fe	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	faa09eab-a088-4178-ba38-bdfe1e84f067
a92a7896-aa69-4251-8b07-fc873c20ba02	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	7c838a0f-3cf5-4087-9793-7ac22befe06f
127d769a-c978-4e54-84c3-bad26c5e9549	d3edb2af-d3c4-4a15-9b43-8a11167a601c	4fe83a00-8aad-48e9-855e-d371a97813bf	96968a16-96f7-4647-bd50-4ec8dfe32ebf
88ff6cd8-9fa5-40cb-b09c-ec98a23e377a	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	7c838a0f-3cf5-4087-9793-7ac22befe06f
879d52e4-9ee3-4636-bc80-87f54c616d0c	d3edb2af-d3c4-4a15-9b43-8a11167a601c	662d4a79-5208-4010-a141-20d05ab287d6	96968a16-96f7-4647-bd50-4ec8dfe32ebf
96d1a29e-0fb9-41f4-a501-cac6bf46c7f5	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	faa09eab-a088-4178-ba38-bdfe1e84f067
5875678a-b446-4b14-9646-c5fa37421707	17dd50b4-00d2-4ed8-8078-7f0bab6e0414	1494663b-6e8f-4296-8225-4ec3d3fda578	96968a16-96f7-4647-bd50-4ec8dfe32ebf
4ef415da-7296-48f5-97a6-f0110a50b098	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	faa09eab-a088-4178-ba38-bdfe1e84f067
cff08f1d-8ac8-4cf8-9a86-9c8e4c618e4d	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	faa09eab-a088-4178-ba38-bdfe1e84f067
cd5a4a6e-a08d-4aff-9c10-6031de45538a	17dd50b4-00d2-4ed8-8078-7f0bab6e0414	d2e8b816-8642-4ef6-a9fd-3a8414c85a4d	96968a16-96f7-4647-bd50-4ec8dfe32ebf
3471e1e9-6289-4671-8fec-8d78b3d487f0	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	7c838a0f-3cf5-4087-9793-7ac22befe06f
a585e8b7-03fc-4889-aafe-7862c8145313	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	faa09eab-a088-4178-ba38-bdfe1e84f067
3c32843d-a16b-4823-9ef0-8d793565efd9	17dd50b4-00d2-4ed8-8078-7f0bab6e0414	125ca603-83f0-4320-866e-a6439fc1a11a	96968a16-96f7-4647-bd50-4ec8dfe32ebf
f5f26ee8-ac1b-49ea-8f9d-389386a12816	ff16b04e-f596-469a-af9d-ec6ac076c89e	89a325af-bfb1-42bb-8aa6-b426d7a243f5	96968a16-96f7-4647-bd50-4ec8dfe32ebf
bf81c0f0-4506-47d8-88d4-49e3c8ae002b	ff16b04e-f596-469a-af9d-ec6ac076c89e	de9e1bd8-4d63-4b4b-8c18-d78bbfdaf318	96968a16-96f7-4647-bd50-4ec8dfe32ebf
de7bcc97-e325-411a-8e2d-d1a0f609e96b	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	7c838a0f-3cf5-4087-9793-7ac22befe06f
13ed95a4-0f2a-43ff-b62d-a954ba9fbefb	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	7a991bcf-1c19-4725-a5c0-99cad0f76515
db0e79be-0465-448e-b293-c2a5e61f3f19	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	7a991bcf-1c19-4725-a5c0-99cad0f76515
3fc3f4a8-39fa-4698-a7a8-b474bb7f5fd7	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	0f113e07-2bd1-4bf3-90a4-f1bcfa491e72
7bceab4c-8d8d-4caf-9278-1a7d509213ad	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	0f113e07-2bd1-4bf3-90a4-f1bcfa491e72
207443e3-2fc8-4101-b54a-f50d85b95ba6	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	c00fe121-4b31-42be-bedd-a7144085ed84
1fb798f8-4984-4ac2-bf00-9b915f383e7e	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	7bb29c68-6d79-46ba-a662-743f7cd78b1e
fa6f29d4-7dc0-4f48-9e13-b8a8992cc758	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	7bb29c68-6d79-46ba-a662-743f7cd78b1e
09aad6b7-abb3-487a-8bce-f9115c72f3c5	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	c00fe121-4b31-42be-bedd-a7144085ed84
37d426e7-eaa1-45ef-83be-d42ca7f9eaf3	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	c00fe121-4b31-42be-bedd-a7144085ed84
26cc5b90-9567-419f-84f2-1c80629b1f46	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	c00fe121-4b31-42be-bedd-a7144085ed84
569d3f4e-a5a4-44c5-b3dd-3407bebc6515	3b3f45af-f1a7-4e81-9968-2597dbed288e	9e81b900-b8a2-46d1-ba3f-d22477d21766	3c6b54cb-f751-40f9-a7c7-a7fa64713001
eaf423c4-476d-4dd5-b4cb-07e9b434381d	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	c00fe121-4b31-42be-bedd-a7144085ed84
da1463a8-95a9-48b7-b10c-6ab791bb41b1	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	c00fe121-4b31-42be-bedd-a7144085ed84
fafdd1f5-12a9-42a6-97ae-5c570f6c57d3	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	c00fe121-4b31-42be-bedd-a7144085ed84
69fca98e-9062-428b-83c7-1bce0e19f8bd	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	7bb29c68-6d79-46ba-a662-743f7cd78b1e
13daa8d4-4571-484f-882f-84dee79089bb	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	c00fe121-4b31-42be-bedd-a7144085ed84
aad12512-a868-45a3-a4fc-261df609dae1	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	c00fe121-4b31-42be-bedd-a7144085ed84
21b5fd18-8f91-467d-ad50-1190bab1cb3d	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	c00fe121-4b31-42be-bedd-a7144085ed84
abf13449-d3b4-436c-9b84-a1d07c96646e	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	c00fe121-4b31-42be-bedd-a7144085ed84
5ff3d350-ffd4-47e9-ba23-492d7605defa	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	c00fe121-4b31-42be-bedd-a7144085ed84
bf3fe058-c912-47dd-ac5f-72f09968ff2d	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	7bb29c68-6d79-46ba-a662-743f7cd78b1e
29484f43-7e08-43ad-ad71-c7c58b52f81a	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	7bb29c68-6d79-46ba-a662-743f7cd78b1e
3d5a4fc0-0a3a-481a-a2e4-9bde78a10b63	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	c00fe121-4b31-42be-bedd-a7144085ed84
4df12a72-7d92-4e3e-8c63-117040d0922f	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	c00fe121-4b31-42be-bedd-a7144085ed84
a82c1c34-8518-4dd1-99f7-17c2d020fda7	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	7bb29c68-6d79-46ba-a662-743f7cd78b1e
a11561aa-c821-427a-91f2-e1d6dae05076	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	c00fe121-4b31-42be-bedd-a7144085ed84
5df92193-e625-4059-912e-6347d7d5f1c9	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	c00fe121-4b31-42be-bedd-a7144085ed84
9f0c9383-87af-4974-8175-6fc133f47a18	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	7bb29c68-6d79-46ba-a662-743f7cd78b1e
436406fe-19d3-4f16-bdf2-69d8346e1a15	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	c00fe121-4b31-42be-bedd-a7144085ed84
19127fc0-8c9d-4ceb-b401-b04de9104c65	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	7bb29c68-6d79-46ba-a662-743f7cd78b1e
a74d73e7-5a27-492c-aa68-25bf248a1aee	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	7bb29c68-6d79-46ba-a662-743f7cd78b1e
98e2ccfb-8761-4b44-a18a-d2bec398e647	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	c00fe121-4b31-42be-bedd-a7144085ed84
e36c44d7-c235-46b5-9656-7e0bb2d5c5e4	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	c00fe121-4b31-42be-bedd-a7144085ed84
b88397b7-b556-46e4-8c6c-3e3e209a1991	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	c00fe121-4b31-42be-bedd-a7144085ed84
96a12423-b2dd-4d23-8157-422550e0b738	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	7bb29c68-6d79-46ba-a662-743f7cd78b1e
24120cdf-82e3-4f0f-9576-7a9843934535	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	7bb29c68-6d79-46ba-a662-743f7cd78b1e
e42df6bb-05a1-4484-9c1f-40fcb48ac096	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	7bb29c68-6d79-46ba-a662-743f7cd78b1e
a2ed27b2-24f1-4d39-bf5b-71074314617b	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	7bb29c68-6d79-46ba-a662-743f7cd78b1e
4f1ab1c7-1bfe-4c24-9218-ebac8d5a991d	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	7bb29c68-6d79-46ba-a662-743f7cd78b1e
114b673a-f658-433a-a91c-4daa4e671033	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	7bb29c68-6d79-46ba-a662-743f7cd78b1e
4e94f88b-07cf-478a-ab74-ea52e0a10137	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	7bb29c68-6d79-46ba-a662-743f7cd78b1e
4a7b090f-411a-4bff-a2ef-6a7d55a95e38	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	7bb29c68-6d79-46ba-a662-743f7cd78b1e
ca75a25f-a676-4a2d-82a2-5860c7dd59e3	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	7bb29c68-6d79-46ba-a662-743f7cd78b1e
5e6be387-81a2-4f0f-8f05-25cc8bb249d6	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	7bb29c68-6d79-46ba-a662-743f7cd78b1e
04529ecc-6d03-4efc-b391-fe98c4bc64e2	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	7bb29c68-6d79-46ba-a662-743f7cd78b1e
815c9cc2-0837-45d8-9b01-763b6f5047dd	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	fa656ba8-e4bf-45f5-a776-e50bf8655260
0467991a-e22c-49d0-8f7c-00c10efe26ae	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	1584ae3c-a607-42a3-a906-192ac2fc8bfe
a833ca0c-1b34-47d4-9e05-97c00b0dd1f0	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	fa656ba8-e4bf-45f5-a776-e50bf8655260
ac5e2ae4-0137-4dc4-9f3a-e771e3e64c64	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	1584ae3c-a607-42a3-a906-192ac2fc8bfe
378939a8-4aea-4c07-879a-7134476df71a	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	1584ae3c-a607-42a3-a906-192ac2fc8bfe
ee0f29e4-f92b-4aaf-8162-456275cdbac6	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	1584ae3c-a607-42a3-a906-192ac2fc8bfe
4c002cb0-ebe5-47c2-a0c1-ae248b525e08	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	fa656ba8-e4bf-45f5-a776-e50bf8655260
1e4289d9-9349-400c-af66-43248d876e17	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	1584ae3c-a607-42a3-a906-192ac2fc8bfe
9594fa94-bd63-4ecb-8fb7-c73b20e5cf91	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	1584ae3c-a607-42a3-a906-192ac2fc8bfe
68430834-0f59-48e9-bfba-c4c063592345	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	1584ae3c-a607-42a3-a906-192ac2fc8bfe
cf813e55-357d-48d4-adef-3d8a9e9759e7	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	1584ae3c-a607-42a3-a906-192ac2fc8bfe
70207ef1-923f-4410-a3c9-46f08a21db50	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	1584ae3c-a607-42a3-a906-192ac2fc8bfe
a1c849ee-3989-4ede-bb75-9a1acf3f48a4	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	1584ae3c-a607-42a3-a906-192ac2fc8bfe
c6e91912-3faa-4faf-8a82-b4c06748b4f0	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	1584ae3c-a607-42a3-a906-192ac2fc8bfe
808c5e05-174f-4f67-b8cd-323734c9952a	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	1584ae3c-a607-42a3-a906-192ac2fc8bfe
ac075f9f-fe55-4655-bae9-7648c9058758	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	1584ae3c-a607-42a3-a906-192ac2fc8bfe
79a596df-9a68-4321-a666-d67461327287	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	1584ae3c-a607-42a3-a906-192ac2fc8bfe
56332c7c-0625-4a58-baa0-48611d5ded68	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	fa656ba8-e4bf-45f5-a776-e50bf8655260
6668ca80-c23f-40cd-adbb-0f965e27dba7	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	1584ae3c-a607-42a3-a906-192ac2fc8bfe
527bfe3e-89eb-4e97-bf34-1ab2f8887e98	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	fa656ba8-e4bf-45f5-a776-e50bf8655260
2c4105d7-2473-40d3-b5cf-e9c7d5fb3439	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	fa656ba8-e4bf-45f5-a776-e50bf8655260
11490ceb-d2db-4716-b4ff-5d7d994656b6	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	1584ae3c-a607-42a3-a906-192ac2fc8bfe
a134ddff-05a4-48c0-baed-78f21334a845	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	1584ae3c-a607-42a3-a906-192ac2fc8bfe
b631913f-c21c-4e45-9dc0-efe4218ced62	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	1584ae3c-a607-42a3-a906-192ac2fc8bfe
2c69eadc-ebac-464f-8ac9-e992056515c6	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	fa656ba8-e4bf-45f5-a776-e50bf8655260
e2438da2-00ef-44c1-b271-05c8bc4a4e07	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	1584ae3c-a607-42a3-a906-192ac2fc8bfe
57fc9825-5a60-41b1-8d65-5c55bb4fc334	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	fa656ba8-e4bf-45f5-a776-e50bf8655260
0989cdee-f344-4e2c-afc7-04e80c4414ab	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	1584ae3c-a607-42a3-a906-192ac2fc8bfe
d019aeaa-6490-48c6-bdc7-5c558737049c	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	fa656ba8-e4bf-45f5-a776-e50bf8655260
8562f7f2-3271-42d9-8f48-252f6900132d	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	fa656ba8-e4bf-45f5-a776-e50bf8655260
7be97eea-8fb7-49cd-991c-b6cf58e40d46	faa2937d-4b2a-47b0-893e-97b52c3f3a80	870e5740-3f96-4bd3-8ae4-5d287b075946	720314fd-1abd-4c8a-a79a-592e5d6c8650
0956c268-f365-4589-8520-9f7bd3f82886	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	fa656ba8-e4bf-45f5-a776-e50bf8655260
f58190d2-311f-47ab-915d-82ac45210ed9	faa2937d-4b2a-47b0-893e-97b52c3f3a80	1b159d72-3460-4d15-af7b-5eb223e6f967	720314fd-1abd-4c8a-a79a-592e5d6c8650
bacbc1d0-3ab3-42c9-bd07-8b4b83f38d45	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	fa656ba8-e4bf-45f5-a776-e50bf8655260
c080ddf6-dd1f-45ce-8523-c82c17a32261	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	fa656ba8-e4bf-45f5-a776-e50bf8655260
df08a694-e2f7-4d0d-a4cb-63bc978f1942	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
37ebd9cb-f5ae-4017-89ee-fd98b827a786	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	fa656ba8-e4bf-45f5-a776-e50bf8655260
74721cd2-15b9-4639-a895-dd735bd14401	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	fa656ba8-e4bf-45f5-a776-e50bf8655260
a6c5232b-3360-4cf3-a839-79d1e747c926	faa2937d-4b2a-47b0-893e-97b52c3f3a80	027d96e2-50b0-4b62-9e83-76a2cd88d4ab	720314fd-1abd-4c8a-a79a-592e5d6c8650
e71e2f92-959e-499c-be5e-0bab9eebe760	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
cbdbf185-cf1f-4212-921f-0740dc5ef33a	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
dcd2e107-4dc4-4066-917a-1534c711df7d	faa2937d-4b2a-47b0-893e-97b52c3f3a80	88da2341-164d-4d1c-b933-ef788345338b	720314fd-1abd-4c8a-a79a-592e5d6c8650
f7aad85c-a4bd-4229-8c70-e1e422e6ad6e	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	fa656ba8-e4bf-45f5-a776-e50bf8655260
67a02b93-4899-4fc8-9f93-1792ae9629c1	faa2937d-4b2a-47b0-893e-97b52c3f3a80	aff3710e-0df2-4a6f-84e3-f975c4b26456	720314fd-1abd-4c8a-a79a-592e5d6c8650
d1f3e2c1-7e43-4fc4-9009-d6bd09b94b59	faa2937d-4b2a-47b0-893e-97b52c3f3a80	95afca9f-0e6a-400c-8136-10f148dcfea7	720314fd-1abd-4c8a-a79a-592e5d6c8650
43995bd3-e881-4ab9-9ab5-a23ae25e174f	f35c006f-3f41-4609-947b-331decc0123c	b5de8cf9-b7d4-4e59-be5f-1542ce035441	fa656ba8-e4bf-45f5-a776-e50bf8655260
d483a509-f940-44c5-bad4-a57fb08aaee6	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
821f3a0b-f4f0-4c52-91b8-6e68a5fddd8d	f35c006f-3f41-4609-947b-331decc0123c	b7ca33eb-18ec-4407-99d9-778f4fca2d22	fa656ba8-e4bf-45f5-a776-e50bf8655260
f09cd76c-eade-45d6-9a24-5f3648828de7	f35c006f-3f41-4609-947b-331decc0123c	a60e91d0-59fd-42fa-93fe-2c88b3670a55	fa656ba8-e4bf-45f5-a776-e50bf8655260
aa1ef4d8-e3ad-490d-935a-e68ea96c4ca5	f35c006f-3f41-4609-947b-331decc0123c	22e0e47e-6b57-4cd4-8069-3718ccec56fb	fa656ba8-e4bf-45f5-a776-e50bf8655260
a946b10f-a874-4239-89d9-d8c1beaf4c8c	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
122d8e58-0676-4332-926e-848f4982c736	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
26c1bbc5-a327-4b28-9c47-51f3dc8c82fb	faa2937d-4b2a-47b0-893e-97b52c3f3a80	cf328e80-9442-4c30-97ce-7ab10ffe2b50	720314fd-1abd-4c8a-a79a-592e5d6c8650
d649ab3b-3375-427d-953e-7fa3855ec4fb	faa2937d-4b2a-47b0-893e-97b52c3f3a80	648afdc4-82d8-469a-bbde-60581cdcc418	720314fd-1abd-4c8a-a79a-592e5d6c8650
6f9a9fce-574c-43cb-bcd0-ecfa87e77e92	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
7ce73d6b-9535-4629-bc2b-9971a05128d2	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
2e5c6723-6aac-4271-ad8b-3f278311bcf4	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
98fb20b8-d363-4e22-8057-1ac44f9bb2d3	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
7146edfc-5f26-484c-80ce-311c0e81721a	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
9da26341-9c53-48c2-b050-43472e735699	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	555185f3-fecb-44b9-90d1-c883fb78c45b
f51c3a01-d335-4828-9103-3e93f45f4d7b	8426e329-cd26-49a3-abb5-863940808283	aa8bd074-8604-491d-93ed-0031888f00c6	b69f701e-9fa2-437a-8db4-8d123f76bf94
f5d20287-f5b3-4509-b508-f89467f5c867	8426e329-cd26-49a3-abb5-863940808283	d746761b-43b9-4053-a72b-7a2808da68bb	b69f701e-9fa2-437a-8db4-8d123f76bf94
641ba674-5405-4480-a4dd-c0112202c703	00b63aa0-71fc-4e48-80e1-c69461ddd504	37e5f7ac-99c0-411a-8006-2c070b64b751	b69f701e-9fa2-437a-8db4-8d123f76bf94
05aa781e-3297-4ebb-aef1-af2fd8accf19	00b63aa0-71fc-4e48-80e1-c69461ddd504	f6cd3211-ca60-4815-a2cd-a9de1f9bd5c1	b69f701e-9fa2-437a-8db4-8d123f76bf94
f3822e7d-5fdd-41bf-832f-de8ef667e24b	00b63aa0-71fc-4e48-80e1-c69461ddd504	19093394-533f-4890-8856-eaba05ff6b21	b69f701e-9fa2-437a-8db4-8d123f76bf94
5bcb92d2-8cc6-4d89-a613-15e3d014542b	00b63aa0-71fc-4e48-80e1-c69461ddd504	67480ace-94bf-4d99-b0bb-73460821fbc0	b69f701e-9fa2-437a-8db4-8d123f76bf94
3a66d2c3-0229-454f-82ba-bb39b7caf922	a6f8a4df-8851-4680-829f-87986f7803de	35083070-9d84-499f-83ea-19db80862f39	b69f701e-9fa2-437a-8db4-8d123f76bf94
48248ec9-ecdf-48a1-a67d-ca31927980de	a6f8a4df-8851-4680-829f-87986f7803de	bfd9bb29-f672-458f-b9b5-65e6359d253d	b69f701e-9fa2-437a-8db4-8d123f76bf94
eb50f7e5-9a8b-4826-a566-ed18564da6ce	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	b69f701e-9fa2-437a-8db4-8d123f76bf94
9f96530d-76ab-44bf-86e1-bec71d1e995a	8811e952-4385-400e-a157-6e3b239a6f49	1c4ec33b-4854-47b3-ad54-daf42a013cc4	b69f701e-9fa2-437a-8db4-8d123f76bf94
fa602ffa-7968-4845-bdac-05110ae6df31	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	b69f701e-9fa2-437a-8db4-8d123f76bf94
3a39f021-f293-482f-b2cc-755d581a1145	8811e952-4385-400e-a157-6e3b239a6f49	5dc33309-c210-428e-a2a3-0d909862125a	b69f701e-9fa2-437a-8db4-8d123f76bf94
dce0b0fa-bbf7-448c-ab50-10f87171dc32	8811e952-4385-400e-a157-6e3b239a6f49	8cc47117-ed20-4dd8-b7e8-1e92a9e53039	b69f701e-9fa2-437a-8db4-8d123f76bf94
2231f36f-3560-41d3-b305-84e2d2cd7fda	8811e952-4385-400e-a157-6e3b239a6f49	7f6a78b6-27e7-4e4f-aee6-8eb1c2673a08	b69f701e-9fa2-437a-8db4-8d123f76bf94
c4a6c9de-772a-4433-8d03-8c11b5650009	8811e952-4385-400e-a157-6e3b239a6f49	1cc895fb-8487-466c-80cb-0b094c1bb1c0	b69f701e-9fa2-437a-8db4-8d123f76bf94
51b03b08-870e-40fa-9dd0-f34296e515ad	8811e952-4385-400e-a157-6e3b239a6f49	85943178-63d2-4623-b71b-19e856a1a45f	b69f701e-9fa2-437a-8db4-8d123f76bf94
9dd23283-0462-41ae-99a8-824df979a040	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	555185f3-fecb-44b9-90d1-c883fb78c45b
78416064-e9fe-44fc-8d7e-50a945a7e49c	72528f26-c08d-4465-9eb7-6053695b93de	422670a0-7918-4f04-b554-43e89f2a4615	f506e467-1f89-4015-8f23-5f2a2aaca99c
1f5ee09d-9981-4c63-88fc-51016e50620a	72528f26-c08d-4465-9eb7-6053695b93de	d306e709-4634-49e6-9b33-d523d414b888	f506e467-1f89-4015-8f23-5f2a2aaca99c
\.


--
-- Data for Name: catalog_product_images; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_product_images (id, alt_text, sort_order, url, product_id) FROM stdin;
33356416-fdf4-4c51-853e-ca95205c9045		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/standart/kstandart1.png	fbd34467-d662-4ae4-9c25-1c85a478243e
40e8952d-4f85-4bb0-80cb-39fcac0bf857		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/standart/kstandart2.png	fbd34467-d662-4ae4-9c25-1c85a478243e
240bb161-df02-44c2-97fd-54311d27e0e1		2	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/standart/kstandart3.png	fbd34467-d662-4ae4-9c25-1c85a478243e
c6121019-fe4a-454e-8ff9-c27bbf6445c3		3	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/standart/kstandart4.png	fbd34467-d662-4ae4-9c25-1c85a478243e
1d0fc89e-c440-4ac8-8a72-627a2b4e2aed		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/altin/altin1.png	c8e2f9ae-385f-43c9-9ba7-e5416112975c
b5a0eaf5-becf-45fc-ae3c-73c4564cd8f9		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/altin/altin2.png	c8e2f9ae-385f-43c9-9ba7-e5416112975c
a4aef848-468e-450e-90da-9526ab783b04		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/ekspres.png	b69f701e-9fa2-437a-8db4-8d123f76bf94
4e9c7615-2dfc-4f17-9b5a-f97d8eacf127		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/kart6.png	b69f701e-9fa2-437a-8db4-8d123f76bf94
a897c197-3c1c-4b7e-ab6b-5f887fb51b46		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/sivama1.png	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
7ddd40b2-0381-40f1-b9ab-66a728d710b2		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/katlii.png	2d10ce43-3226-43ed-9d4a-1b6781035b09
fa23d74b-6c64-412f-9d84-d8dd036cf123		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/katli2.png	2d10ce43-3226-43ed-9d4a-1b6781035b09
b61091a6-f30f-4b99-8e58-82ca0febeb19		2	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/katli.png	2d10ce43-3226-43ed-9d4a-1b6781035b09
7b731612-2c9a-436e-97bf-a4e7dbea8e65		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/soft.png	c50afce6-a0bd-4914-b506-50e99a1faaf4
777b9060-f83a-4da3-8c50-ba679d78114d		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/fantezi.png	7c838a0f-3cf5-4087-9793-7ac22befe06f
cbec2191-9f93-4ed4-b6f2-675860cd7bf8		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/fantezi2.jpg	7c838a0f-3cf5-4087-9793-7ac22befe06f
6c1614c9-fa73-483d-9501-fe0eef42f3f0		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/kare.png	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
761687df-9d0b-430b-a7ac-a13189fad483		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/katli.png	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
ec330f1c-a65f-4d2b-bbac-12ef54bda6aa		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/gofre.png	faa09eab-a088-4178-ba38-bdfe1e84f067
79d959ea-a0ce-4ae1-a3a4-cf0b785a6e4a		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/gofre.png	c00fe121-4b31-42be-bedd-a7144085ed84
e143fb33-ae5d-4a6e-a6ce-86803c3db4b9		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/takvim.png	1584ae3c-a607-42a3-a906-192ac2fc8bfe
727e6ded-344f-4d27-9305-cf195cdf7ced		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/seffaf/seffaf.png	116655bc-452a-4982-a7d2-f464752a949d
c853eff5-cb65-4c0e-8b0e-39e895db23e1		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/seffaf/seffaf2.png	116655bc-452a-4982-a7d2-f464752a949d
e0a61c98-35d0-4b85-aa06-e850e9449ff2		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/oval.png	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
5855b52e-bd25-4f46-8f82-4b35dad274a9		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/oval.png	7bb29c68-6d79-46ba-a662-743f7cd78b1e
4abc8126-82e4-41a9-a0a2-acbf255f319c		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/oval.png	fa656ba8-e4bf-45f5-a776-e50bf8655260
c1103c5c-0f6b-45c9-8181-2b362e831ae0		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kartvizit/genel/pvc.png	a948564e-d2e4-406a-9f38-1973fc377675
424a7289-6a06-444d-92fb-ae54c97bc938		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/el/ki1.png	2f926ce2-242c-495d-983d-2c34a4e5e60d
3c5c919f-04f8-448a-ab96-22c862aeadde		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/el/kir2.png	2f926ce2-242c-495d-983d-2c34a4e5e60d
1a5eb854-25f0-4f2a-8ea1-dd17e1ca44ec		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/katolog/katlog1.png	4c6e7f4a-9800-462f-a1a9-751129cc25be
9ea75f22-1e8d-434d-a605-c3b1822ba91f		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/katolog/katolog2.png	4c6e7f4a-9800-462f-a1a9-751129cc25be
cd652c20-9873-4356-94e3-0406e9ff94ae		2	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/katolog/katolog3.png	4c6e7f4a-9800-462f-a1a9-751129cc25be
1ceab3cc-0f43-49f7-bac3-6bb6d92d3ced		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/katolog/aski.png	7d6c8738-455d-488c-a3fc-d5ecf745efa9
9e3c843f-c4fd-44a1-b97a-7c66e50bd9bf		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/el/el3.png	96968a16-96f7-4647-bd50-4ec8dfe32ebf
efc477fb-05f0-43c3-981b-f46574c51e89		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/el/el1.png	96968a16-96f7-4647-bd50-4ec8dfe32ebf
cf59701d-f606-4643-a062-d95f72c0f592		2	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/el/el2.png	96968a16-96f7-4647-bd50-4ec8dfe32ebf
0ea6ede6-e859-4659-9947-477e4143abfb		3	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/el/el4.png	96968a16-96f7-4647-bd50-4ec8dfe32ebf
8d97fa1c-7ce1-4654-b44f-f410673187d3		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/el/el3.png	3c6b54cb-f751-40f9-a7c7-a7fa64713001
ea4f21cf-161f-4300-b67b-324c2cdf59df		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/el/el2.png	3c6b54cb-f751-40f9-a7c7-a7fa64713001
8fb64fcc-7b5f-425b-bcf3-e5b3461572ea		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/bayrak/masabayrak1.png	04bce68a-3bce-4c0e-a1d5-6d3dcd09b053
a63d52cc-a354-4a9a-8d5a-86a6369165bc		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/bayrak/masabayrak2.png	04bce68a-3bce-4c0e-a1d5-6d3dcd09b053
dac1ef69-6d2f-4f6c-b295-902dd54796e0		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/bayrak/gonder.png	720314fd-1abd-4c8a-a79a-592e5d6c8650
ac30b6d1-3425-467f-8fa1-b799f5fe4436		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/bayrak/turk.jpeg	720314fd-1abd-4c8a-a79a-592e5d6c8650
dfa975d7-9b6f-48e7-b6db-76dc211d1dd3		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/bayrak/kirlan.png	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
6d13a9a5-23f3-40d1-9a37-c52fc95e1492		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/bayrak/k%C4%B1rlan2.png	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
915d7a26-2d6a-4151-b75f-883a96944763		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/bayrak/masabayrak.png	bb54d991-8205-4970-b0a7-a49473e7a4d6
1bc926a6-c80e-49db-b502-2431cfca837b		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/bayrak/masa.png	bb54d991-8205-4970-b0a7-a49473e7a4d6
160c719b-8ba6-411b-93e7-edf5d15d4c1e		2	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/bayrak/masa5.png	bb54d991-8205-4970-b0a7-a49473e7a4d6
d6d55d30-2278-4733-91be-e2c845285e86		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/yelken/yelken1.png	a2f7ea19-abe4-4998-a223-993b2a5d3090
bcf6998e-9003-4f5c-8e39-2f40ecb06868		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/yelken/yelken3.png	a2f7ea19-abe4-4998-a223-993b2a5d3090
90dabc4d-5f7c-431e-8abc-8f7d1f80a322		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/recete.jpg	9625f7c7-3058-4960-a42e-3b3648a5d1b4
067d0053-2622-4e47-8cae-b4f169f2235b		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/postal.png	ff92cf7d-b1aa-4baa-831f-861da7a21015
2d8d003b-6eb3-45a6-a74e-d4a199d1f844		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/not.png	dbeb2ecb-012f-43f5-a5dc-6523433db614
ae94cc0f-0c5b-412a-b2f4-8bcfeadf6d6b		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/not2.png	dbeb2ecb-012f-43f5-a5dc-6523433db614
e7c352a4-4a81-4bc6-8a16-a0a67711a418		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/guvenlik.jpg	555185f3-fecb-44b9-90d1-c883fb78c45b
ea12a4b7-2723-4914-a8ae-01460cac0d28		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/kase.png	93caa48c-b5d8-4289-96b8-e9b7ac2b8d9a
1e80bf6f-1b27-4bf8-8e61-5f20d4c148f1		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/kase1.png	93caa48c-b5d8-4289-96b8-e9b7ac2b8d9a
ffdc3b53-6c17-41e6-b405-3dae44ffc0dd		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/davetiye.png	27217955-03b8-4a3f-b57e-bbff60ac1328
99492022-0a42-46ee-9b8a-3a70a8df2a5f		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/sertifika.png	d32e70ec-9b9d-4209-b8a0-3dc47e66f473
6c6de5ee-e6ca-445a-a574-2b6f5ede7177		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/anket.png	379f4020-e851-4a34-9703-83e337682ca6
450ea59f-3b62-4d60-aeb4-ce11e54a17d9		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/duba.png	d6b6b2bd-36dd-45b8-918b-2af953a8c2b3
a21940a6-9d1d-4777-919c-3041fe37b8c2		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/duba1.png	d6b6b2bd-36dd-45b8-918b-2af953a8c2b3
5add17db-1ecf-4d25-9465-399da58c208a		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/kapi.png	7a991bcf-1c19-4725-a5c0-99cad0f76515
b8fe88c3-909c-4e75-9ab6-4fa6e63af217		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/tabela.png	0f113e07-2bd1-4bf3-90a4-f1bcfa491e72
b0137f8f-aa87-496c-b37a-0459b2a198dd		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/rol1.png	f506e467-1f89-4015-8f23-5f2a2aaca99c
f38b11d3-3a7e-4c4a-a714-e1f61fd3b44a		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/kurumsal/rol.png	f506e467-1f89-4015-8f23-5f2a2aaca99c
3a4a6fa0-b56a-4e9d-9c13-e99e6161a78f		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/matbaa/bloknot.png	8688f2dc-c168-42b0-a950-f999c383712f
43dd8e44-5866-470e-9d19-cb9c575c45d1		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/matbaa/zarf.png	7b66d82d-b943-465b-9767-58c44bc23f5e
72286783-fb21-4f92-a71e-1483cd55da69		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/matbaa/etiket.png	9e29855f-90c3-4e56-8236-4de364524522
bb251966-6c64-4383-aa4c-4b13ccc7f403		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/matbaa/makbuz1.png	76421511-87ff-4ace-be67-d578b6271acf
cca06c69-ea5f-45a8-977c-2e69df2b2436		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/matbaa/makbuz.png	76421511-87ff-4ace-be67-d578b6271acf
df3c23b6-a187-4b61-a67f-6b0b87ab593d		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/matbaa/bloknot.png	cf7b4ed5-182d-4049-97b9-9fbb3baa9e4b
c4534c59-25bf-4e6e-a162-b80095eccf86		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/cakmak.png	82b26352-23ab-4b79-9232-d1d0d62fe418
98a1e908-92ca-4ab5-8a68-4662feea22c9		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/termos.png	657fb80e-07af-4db2-8176-6c13a8a1b0a1
bbc35375-6c48-42d0-9341-346f28631dac		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/magnet.png	97cfc740-1f60-40cc-b3fb-e572ff01a96f
4fbfd7fe-e131-47f8-a2c2-f7bf729319d4		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/bardak1.png	dd052ed1-646a-4dd4-bf19-6a24eef5e2af
043e0e92-3029-4380-96ca-49615d434e4e		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/bardak.png	dd052ed1-646a-4dd4-bf19-6a24eef5e2af
a9f345ef-0d28-4104-995b-34f641fb6921		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/kalem.png	1334b694-251c-44b3-9a65-c00fefc6af43
8df23885-ef3e-4ecc-ab80-4d3ba54cce21		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/ajanda.png	744af4b7-c027-45a7-a3b3-2a20a9bb67cd
1dd98dc3-5a38-403a-841b-126e21421c5e		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/mendil.png	83303a4f-d1f6-45b8-b33c-3a9744b36221
7c8801fb-2b15-476c-9f01-0adb9a7d3b7d		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/anahtarlık.png	b7dde16a-5767-485d-a581-a57b6fde3043
92181e09-2a98-48f4-8058-d9d2a01eeb1a		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/plaket.png	b8247ee9-c10e-4853-9060-5a45eb09b3fe
5242d2a7-5cdd-463e-abb7-bfd65b77528a		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/takvim.png	bd6e9414-9a75-43b2-9419-b1b88b7c5880
1f29dff1-8e07-4bbc-b815-9c24f89f5cc3		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/takvim1.png	bd6e9414-9a75-43b2-9419-b1b88b7c5880
9826faf1-258b-487a-ae27-090c5714597e		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/isim2.png	ce2527bf-569c-41cc-a6de-997605b1d40d
ef56ed22-1c10-4af3-9c82-f6892b9800e7		1	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/promosyon/isimlik.png	ce2527bf-569c-41cc-a6de-997605b1d40d
8f642caf-2d88-4420-a749-920c60607eb9		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/dijital/vinil.png	331c165c-cb29-4e7d-bd8c-6659da4ad7d5
6d2783e6-b6f7-4b98-920e-0591850abc46		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/dijital/afis.png	9fea8b2c-682e-443d-a292-23c06eaeb3ea
0a8bfa54-2e25-465a-9242-b1a98bc1d004		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/dijital/folyo.png	3efde787-c772-477d-ae03-d2a5fd49868b
aebfe45e-e5df-4efd-9e6f-f4fbb1dde4e5		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/dijital/vinil.png	ea68cd2a-5e5b-437a-926d-9e110bb88058
901b6868-65cc-4f0c-9304-f34234c19e0b		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/dijital/sef.png	7fc39472-cf1c-4a28-97f2-2345c9a62f3c
7110bfe6-eebf-4851-baad-fcec71e0c980		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/dijital/isikli.png	d3aaf05d-fca8-4037-a196-8826d2921eb5
2b055a09-f868-4619-a378-745083efaecc		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/dijital/folyo.png	86793400-2856-4837-bae8-e5aaf26fdc69
cb48afec-065e-48f6-890d-48f55b4ab5a6		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/dijital/delikli.png	8bcc3b47-be5e-4b70-93fc-6e5c0e38dba3
2023f760-d51c-493a-b165-56766dd653c4		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/emlak/emlakafis.png	5a2d6cfa-bc9d-48fc-a2a0-ac853dc1933e
301fd95b-c087-4d4c-9c25-344f7ad03dd0		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/emlak/satilik3.png	876c23a5-9d73-4e40-be72-bf379d69c21a
63cd8275-39be-4831-a803-b28d40b40d09		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/emlak/satilik2.png	e372bb93-00f6-46cb-baa4-9e0e820b2e92
e2d55634-c99a-46c4-ab02-470ef876ffdb		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/emlak/emlak1.png	9de8cdb2-10de-4075-81e6-9a09ab326040
a401f0d1-02f8-4b4b-9b00-2f03ba42eb25		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/tablo/ataturk.png	bcc03a57-f819-447d-8fb7-cf3b1b6a74d1
343a2bbc-523d-4cc7-9009-a432b2143859		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/tablo/resimler.png	d2461563-bae2-493c-9aec-9581f6e937a3
13eaf6b8-9a0d-4be9-998e-7368704e16e8		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/tablo/mdftablo.png	f1c87cd7-84f7-4b56-84b5-a5557835e192
dea39a58-0a6a-48c9-acd4-3b3322b37445		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/tablo/puzzle.png	889bc829-dcf8-4f8d-aba5-88ac06037a39
7dcdd1f2-33a9-494d-bf72-5fd5af6207f0		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/tablo/kupa.png	99420ca6-a8ff-4aa2-bcde-03181677ba26
6938efb8-10c4-48d5-9491-01d21835e8e6		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/tablo/tablo.png	f1480084-32f7-4cd0-9a1f-a66fbcd30ea0
92fa7ac7-5e95-4157-9429-0900fdb23c61		0	https://pub-5f066b06e62c497999ee4b8c82794c50.r2.dev/tablo/resimler.png	33f1bebe-3e36-4fd5-a623-ef092d18a638
\.


--
-- Data for Name: catalog_product_reviews; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_product_reviews (id, anonymous, approved, comment, created_at, order_id, rating, updated_at, user_email, user_id, user_name, product_id) FROM stdin;
\.


--
-- Data for Name: catalog_product_tiers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_product_tiers (id, price_usd, qty, sort_order, product_id) FROM stdin;
e04e7978-0e37-432f-9d1d-0ca7cba3d75d	6.00	1	0	93caa48c-b5d8-4289-96b8-e9b7ac2b8d9a
5e2e09b7-6e6e-4e2f-8b36-8f647ab07b07	15.00	3	1	93caa48c-b5d8-4289-96b8-e9b7ac2b8d9a
2989a8b2-46f8-4b8f-bc49-3f86ae7bd263	24.00	5	2	93caa48c-b5d8-4289-96b8-e9b7ac2b8d9a
4888ef44-67c8-4cb4-9cfe-a788fda7e5c2	13.00	100	0	27217955-03b8-4a3f-b57e-bbff60ac1328
36360052-7626-40f7-8b02-92d650a1373a	28.60	250	1	27217955-03b8-4a3f-b57e-bbff60ac1328
0a3630a4-074e-46af-a84b-fdc8cbb7528e	52.00	500	2	27217955-03b8-4a3f-b57e-bbff60ac1328
b9ca5215-8e9c-498b-a78b-7f30628f6f20	48.00	500	3	204a4763-e4e6-46f7-a5cd-d51082ff28b2
16ef5d45-084a-4d50-b471-ee96fb36804f	26.40	250	2	204a4763-e4e6-46f7-a5cd-d51082ff28b2
85f7688f-05bc-4639-8339-0fb0ba5c0e87	12.00	100	1	204a4763-e4e6-46f7-a5cd-d51082ff28b2
3b9a5689-243c-4dd6-b61e-24801915e8ed	12.00	100	0	379f4020-e851-4a34-9703-83e337682ca6
f431f367-cc81-4ef4-ae0d-9d6fd8510ef6	26.40	250	1	379f4020-e851-4a34-9703-83e337682ca6
c552a457-4944-4b5f-b409-3a910b08b512	48.00	500	2	379f4020-e851-4a34-9703-83e337682ca6
2c21780d-9d24-4734-83eb-526f895decdb	44.00	500	3	e3bf240f-f342-48bf-856d-d1c9f712d875
afe67d3b-34c3-4bf3-9592-afdf7ca5a3e1	24.20	250	2	e3bf240f-f342-48bf-856d-d1c9f712d875
6d964da9-bbbb-464a-aefe-401e9ad91687	11.00	100	1	e3bf240f-f342-48bf-856d-d1c9f712d875
2e56736c-aaed-424a-9834-40797c01742a	80.00	5	2	d6b6b2bd-36dd-45b8-918b-2af953a8c2b3
e3810200-df4d-45a3-8591-28aeeeedb766	22.00	1	0	f506e467-1f89-4015-8f23-5f2a2aaca99c
6a9ef42f-12ce-41e2-8dd2-38574aa8a26b	55.00	3	1	f506e467-1f89-4015-8f23-5f2a2aaca99c
630aede9-843f-41ea-b13c-830da1d7f6dc	88.00	5	2	f506e467-1f89-4015-8f23-5f2a2aaca99c
d27ef1df-532a-430e-85c5-5bf640d19a0a	10.00	100	0	7b66d82d-b943-465b-9767-58c44bc23f5e
e438a3ed-2f25-4a80-8051-ef064743f5e8	22.00	250	1	7b66d82d-b943-465b-9767-58c44bc23f5e
856601bb-9953-4177-9747-bba2f2483e0e	40.00	500	2	7b66d82d-b943-465b-9767-58c44bc23f5e
7f41103f-4e42-4207-9cc1-9b171adb5056	2.00	50	0	82b26352-23ab-4b79-9232-d1d0d62fe418
9cdcc275-951c-4072-b47e-cc94edffc8ab	3.60	100	1	82b26352-23ab-4b79-9232-d1d0d62fe418
79f59ce3-3d2f-492f-a26c-7210495317bd	8.00	250	2	82b26352-23ab-4b79-9232-d1d0d62fe418
0497dc04-5079-4793-a5d2-221998ede401	2.00	50	0	97cfc740-1f60-40cc-b3fb-e572ff01a96f
8cff7c54-2fd3-4fed-adaf-42f2dcdb48a9	3.60	100	1	97cfc740-1f60-40cc-b3fb-e572ff01a96f
eec7cf43-d004-4b38-aa44-9d40cff74521	8.00	250	2	97cfc740-1f60-40cc-b3fb-e572ff01a96f
657511a1-a644-477f-af40-6b05edcbc9ce	2.00	50	0	83303a4f-d1f6-45b8-b33c-3a9744b36221
e732e188-d8f7-4c86-8d14-5c0c1b90ed0a	3.60	100	1	83303a4f-d1f6-45b8-b33c-3a9744b36221
dae85c9d-130d-4597-bc65-8503ed024c22	8.00	250	2	83303a4f-d1f6-45b8-b33c-3a9744b36221
b913b90d-d79d-4777-b8c3-d0a94a953584	10.00	1	0	331c165c-cb29-4e7d-bd8c-6659da4ad7d5
f5226210-d54b-466b-9ebc-197bb3df83ba	25.00	3	1	331c165c-cb29-4e7d-bd8c-6659da4ad7d5
2d1acddd-b380-47fd-9398-c8f9d9f9e3da	40.00	5	2	331c165c-cb29-4e7d-bd8c-6659da4ad7d5
86d5e531-a47a-45ff-8fdd-ab1a2ae14924	11.00	1	0	3efde787-c772-477d-ae03-d2a5fd49868b
8f39c243-00d3-4d13-abd8-94c6c14f8451	27.50	3	1	3efde787-c772-477d-ae03-d2a5fd49868b
f98b2e22-835b-4a0e-8e87-bb0fad65a302	44.00	5	2	3efde787-c772-477d-ae03-d2a5fd49868b
f4d47edc-f9f8-4aaa-828e-4fdf51c92ed6	11.00	1	0	7fc39472-cf1c-4a28-97f2-2345c9a62f3c
e5588245-f0ee-4e4e-9044-57e1dad93a42	27.50	3	1	7fc39472-cf1c-4a28-97f2-2345c9a62f3c
a2d6cb42-5ab8-48ec-a8cf-c2e90ba8729a	44.00	5	2	7fc39472-cf1c-4a28-97f2-2345c9a62f3c
6fd6d8f2-6b54-4758-be1e-c0f005741d93	13.00	1	0	8bcc3b47-be5e-4b70-93fc-6e5c0e38dba3
3e8f94b8-3d01-42ff-8b2f-d01192ea8916	32.50	3	1	8bcc3b47-be5e-4b70-93fc-6e5c0e38dba3
1b25a5b8-1ab9-428e-88a4-a362f17a3214	52.00	5	2	8bcc3b47-be5e-4b70-93fc-6e5c0e38dba3
dd144e82-fd6b-4086-a4d1-23ec80137e3d	6.00	1	0	e372bb93-00f6-46cb-baa4-9e0e820b2e92
01d98e8e-99cc-49b1-bc58-46468d8e9758	15.00	3	1	e372bb93-00f6-46cb-baa4-9e0e820b2e92
a27dfdd6-d5af-4bff-8729-c702214eec36	24.00	5	2	e372bb93-00f6-46cb-baa4-9e0e820b2e92
55021328-8c45-4dd9-910e-f917588c8756	160.00	5	3	fbabc552-7ac1-4d48-8f05-8dbd9841a931
22b29245-fe98-4efa-a373-ee856c558f2a	100.00	3	2	fbabc552-7ac1-4d48-8f05-8dbd9841a931
ad26e296-64b4-4de9-8117-0f65df56d04e	40.00	1	1	fbabc552-7ac1-4d48-8f05-8dbd9841a931
69191bfd-76a9-4db2-be29-4e363a41e47a	140.00	5	3	5c1c1bdc-91f1-4ddf-96b6-a3886c37e73c
931a24c4-108c-49ed-a501-6ae194844f28	87.50	3	2	5c1c1bdc-91f1-4ddf-96b6-a3886c37e73c
3a1aef9f-a93a-4743-9415-0d12f96a9a68	35.00	1	1	5c1c1bdc-91f1-4ddf-96b6-a3886c37e73c
8903f131-8b5a-4216-963d-16875198f30a	16.00	250	3	763507aa-9d97-4d28-9065-385e68b9fe13
d24d1bac-8342-46e6-b940-571213a84111	7.20	100	2	763507aa-9d97-4d28-9065-385e68b9fe13
15b3bbbe-fd49-4417-9583-0b8d87ce9740	4.00	50	1	763507aa-9d97-4d28-9065-385e68b9fe13
1e76cfd3-d7e0-4908-9d10-585b3de285ed	8.00	100	0	96968a16-96f7-4647-bd50-4ec8dfe32ebf
8b24db54-3780-4550-a037-094d65de8d28	17.60	250	1	96968a16-96f7-4647-bd50-4ec8dfe32ebf
1c9bacd0-8a89-4f4d-bf6c-c12f6a34047b	32.00	500	2	96968a16-96f7-4647-bd50-4ec8dfe32ebf
2d90c49b-f9a7-4ef8-bdeb-0a1e09c2cb6a	45.00	1	0	04bce68a-3bce-4c0e-a1d5-6d3dcd09b053
4414be15-c61e-4186-bb5a-ab7e7f964b6f	112.50	3	1	04bce68a-3bce-4c0e-a1d5-6d3dcd09b053
2d5e8c2e-8212-4ff4-b2f5-7e35dc52d049	180.00	5	2	04bce68a-3bce-4c0e-a1d5-6d3dcd09b053
a89f5542-a9f5-4323-afe8-4e01e7dc962a	12.00	1	0	bb54d991-8205-4970-b0a7-a49473e7a4d6
e91c65c0-5818-4b45-bf05-832f1cb78018	30.00	3	1	bb54d991-8205-4970-b0a7-a49473e7a4d6
a5e3913a-8377-4134-b17a-3a8ee52b3f42	48.00	5	2	bb54d991-8205-4970-b0a7-a49473e7a4d6
533dbaae-0e2e-4fa3-ae23-99bb0027f66c	14.00	100	0	9625f7c7-3058-4960-a42e-3b3648a5d1b4
84da6fe9-aa52-487b-ae9f-73257d61a204	30.80	250	1	9625f7c7-3058-4960-a42e-3b3648a5d1b4
cae3881a-c151-455d-aab7-1de86bd3891c	56.00	500	2	9625f7c7-3058-4960-a42e-3b3648a5d1b4
5997e268-f261-4b76-8e99-06f46e08f3b7	15.00	100	0	dbeb2ecb-012f-43f5-a5dc-6523433db614
e9c9c346-fa93-4228-a075-52ebe635a71a	33.00	250	1	dbeb2ecb-012f-43f5-a5dc-6523433db614
f28ad70d-2d41-4175-b890-cb5d46327c86	60.00	500	2	dbeb2ecb-012f-43f5-a5dc-6523433db614
a116641a-9e5d-406a-8bfe-5a2186009578	16.00	1	0	d3aaf05d-fca8-4037-a196-8826d2921eb5
6e7881bc-6705-41f3-b494-952cc4c49c9e	16.00	250	3	ce7cf5a5-65b3-4a06-948b-3255c002eab4
9b01776c-a5e4-422f-b83f-2f32ab8adaa9	7.20	100	2	ce7cf5a5-65b3-4a06-948b-3255c002eab4
6d1aebee-07d9-4bae-8ccc-15dd08f6cb7f	4.00	50	1	ce7cf5a5-65b3-4a06-948b-3255c002eab4
4d3236fe-59fd-4603-b763-46506bc431b6	40.00	3	1	d3aaf05d-fca8-4037-a196-8826d2921eb5
4e45cead-25a7-40b7-a9e1-99990c5c5ca0	64.00	5	2	d3aaf05d-fca8-4037-a196-8826d2921eb5
548a338f-a116-42a8-84ee-71ab3341221d	14.00	1	0	5a2d6cfa-bc9d-48fc-a2a0-ac853dc1933e
f116f849-5214-4f70-a4cd-7d3e20404870	35.00	3	1	5a2d6cfa-bc9d-48fc-a2a0-ac853dc1933e
86d305e0-c605-4713-8bb4-f7089ffe7b4a	56.00	5	2	5a2d6cfa-bc9d-48fc-a2a0-ac853dc1933e
2d1559e6-8640-4018-99f6-5acfc3e9871f	20.00	1	0	9de8cdb2-10de-4075-81e6-9a09ab326040
f469cc66-11b8-49c1-889f-90c6faf2d61a	50.00	3	1	9de8cdb2-10de-4075-81e6-9a09ab326040
a54b9272-847d-486e-bafb-1637aeb7e341	80.00	5	2	9de8cdb2-10de-4075-81e6-9a09ab326040
0962fa80-46a8-4d43-8936-36a78c9e52dd	8.00	50	0	d2461563-bae2-493c-9aec-9581f6e937a3
e44e0bf1-c2bb-49b0-ad0a-7d2a622b381d	14.40	100	1	d2461563-bae2-493c-9aec-9581f6e937a3
10813c7e-75b0-4530-9899-dd23a5b8b2e8	32.00	250	2	d2461563-bae2-493c-9aec-9581f6e937a3
f075444a-af73-46f7-be7c-34beaa1663bf	7.00	100	0	2f926ce2-242c-495d-983d-2c34a4e5e60d
fe5b5719-8251-4c22-8ebb-600c74e1c6ea	15.40	250	1	2f926ce2-242c-495d-983d-2c34a4e5e60d
a6b5b4f0-d0f4-42b0-b620-41f763ad7d2a	28.00	500	2	2f926ce2-242c-495d-983d-2c34a4e5e60d
666a7cfe-965f-4086-8395-55447d3add7f	25.00	100	0	4c6e7f4a-9800-462f-a1a9-751129cc25be
cef797d1-d3e2-4e4f-a52a-2bc2e4bd5f08	55.00	250	1	4c6e7f4a-9800-462f-a1a9-751129cc25be
50b9d75c-6c56-4345-abb1-b2c9d7ad02b7	100.00	500	2	4c6e7f4a-9800-462f-a1a9-751129cc25be
34d6b77e-84a9-437d-80e0-d307435d6de2	6.00	100	0	3c6b54cb-f751-40f9-a7c7-a7fa64713001
ebedc1d3-3b82-4ae0-ba1c-60d9214a48c6	13.20	250	1	3c6b54cb-f751-40f9-a7c7-a7fa64713001
895d866a-4f64-41e8-b225-78db3c3b7ccd	24.00	500	2	3c6b54cb-f751-40f9-a7c7-a7fa64713001
ca57fd5f-aea5-44c0-8e85-a2cf45e566e8	18.00	100	0	d32e70ec-9b9d-4209-b8a0-3dc47e66f473
1cd165ad-9995-4bc5-b108-4c8876a3fd09	39.60	250	1	d32e70ec-9b9d-4209-b8a0-3dc47e66f473
75e15b4a-8aa1-4a6a-97a0-7bef5020d409	72.00	500	2	d32e70ec-9b9d-4209-b8a0-3dc47e66f473
284c0595-199b-4986-86eb-7f35018fea12	9.00	1	0	7a991bcf-1c19-4725-a5c0-99cad0f76515
c6285f31-a5c0-48f8-bcd4-3b7f52bd6c03	22.50	3	1	7a991bcf-1c19-4725-a5c0-99cad0f76515
72bb5ca0-6fd3-4506-a13c-c3dc732e30e2	36.00	5	2	7a991bcf-1c19-4725-a5c0-99cad0f76515
4b89f9e2-bd49-44d0-880b-1df086eabb26	18.00	1	0	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
0bd48ce6-523f-4d7f-9ef4-cb8b14164895	45.00	3	1	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
dc10f74c-80cb-437c-82ef-288afee3f091	72.00	5	2	b9ad2e9e-c746-45b0-8d29-2f23bd5697c7
8ba6da31-b42a-4c29-bae9-856e6b3dd070	25.00	1	0	0f113e07-2bd1-4bf3-90a4-f1bcfa491e72
32399c7a-c6bf-48d7-806b-729989eec3cd	62.50	3	1	0f113e07-2bd1-4bf3-90a4-f1bcfa491e72
febd076d-0907-41db-8f76-6a23138021b3	100.00	5	2	0f113e07-2bd1-4bf3-90a4-f1bcfa491e72
6949f75d-3f2e-4c78-8075-89f1d50b6c2f	5.00	50	0	99420ca6-a8ff-4aa2-bcde-03181677ba26
cf628495-96d6-4284-adce-6833a75d18df	9.00	100	1	99420ca6-a8ff-4aa2-bcde-03181677ba26
7416579f-59b9-4d77-b54e-f16e96276151	20.00	250	2	99420ca6-a8ff-4aa2-bcde-03181677ba26
b1cec0b6-8265-41e3-bcaf-95349e532b9a	25.00	1	0	f1480084-32f7-4cd0-9a1f-a66fbcd30ea0
fb7e9bc1-7596-4875-b438-944138ef6219	62.50	3	1	f1480084-32f7-4cd0-9a1f-a66fbcd30ea0
c5498c9c-c85b-49a0-abc4-d7c2367cda42	100.00	5	2	f1480084-32f7-4cd0-9a1f-a66fbcd30ea0
67afcf4c-a552-42b9-9317-06ab2de3293d	10.00	100	0	ff92cf7d-b1aa-4baa-831f-861da7a21015
34befb16-ff60-4995-be38-3df24810c695	22.00	250	1	ff92cf7d-b1aa-4baa-831f-861da7a21015
bf29c3d6-24d0-45e1-a15b-5e6f469e5a4f	40.00	500	2	ff92cf7d-b1aa-4baa-831f-861da7a21015
3e414f25-9e22-44c1-b33b-9b6241c374e0	3.00	50	0	8688f2dc-c168-42b0-a950-f999c383712f
042aee86-1471-4dd7-b388-1db106da8368	5.40	100	1	8688f2dc-c168-42b0-a950-f999c383712f
d08a67b7-31d7-4e1f-a653-e5ef8ddb5815	12.00	250	2	8688f2dc-c168-42b0-a950-f999c383712f
49d7d3a6-a3d7-409a-9f1f-4b03744120e1	8.00	100	0	9e29855f-90c3-4e56-8236-4de364524522
8ed7b165-29c1-45a7-99fb-1d9a731903b2	17.60	250	1	9e29855f-90c3-4e56-8236-4de364524522
6491ddcd-c8a6-40d2-95fb-d1d9110d7d76	32.00	500	2	9e29855f-90c3-4e56-8236-4de364524522
04e7e9e2-65ed-451b-9c39-c6efb36243aa	3.00	50	0	33f1bebe-3e36-4fd5-a623-ef092d18a638
01cf5212-1a27-4bc2-ac51-5a428607759f	5.40	100	1	33f1bebe-3e36-4fd5-a623-ef092d18a638
d2b7b25e-489c-456c-83ed-585970af44d2	12.00	250	2	33f1bebe-3e36-4fd5-a623-ef092d18a638
31d8a274-5b1e-4774-afbf-b086de462553	14.00	100	0	76421511-87ff-4ace-be67-d578b6271acf
c8294d30-e986-42a7-b168-8fcc48941797	30.80	250	1	76421511-87ff-4ace-be67-d578b6271acf
d5d2b488-34fb-4b17-b4fb-e6148ee14d5e	56.00	500	2	76421511-87ff-4ace-be67-d578b6271acf
d38478a7-69cc-4881-ba9b-9abd7f0c1f81	12.00	100	0	cf7b4ed5-182d-4049-97b9-9fbb3baa9e4b
a0abbf49-81cc-4866-a924-a4c53fc8a24d	26.40	250	1	cf7b4ed5-182d-4049-97b9-9fbb3baa9e4b
c4dd51f7-c174-4eca-991b-b8cd1bb5d05d	48.00	500	2	cf7b4ed5-182d-4049-97b9-9fbb3baa9e4b
16d67259-384d-486b-a44d-542cb982105e	60.00	250	3	adec4528-0e01-4628-9272-bc786c70d96f
25378280-4ca3-4e1d-82a4-8d7a4857921b	27.00	100	2	adec4528-0e01-4628-9272-bc786c70d96f
f9502ccc-2d8c-4410-8cfa-eb78ed141885	15.00	50	1	adec4528-0e01-4628-9272-bc786c70d96f
4c8f9046-04f5-4e70-84d3-560e3dcbe3f9	24.00	250	3	559b51f9-0ff2-4e14-b439-7a7cc3f72d7e
0cd6a53f-9910-417a-a2bf-82d8787b230b	10.80	100	2	559b51f9-0ff2-4e14-b439-7a7cc3f72d7e
7c0cfd64-57e0-4b8c-aec0-20df0fecbafb	6.00	50	1	559b51f9-0ff2-4e14-b439-7a7cc3f72d7e
31d7d088-f70f-4d46-bc06-cb90ecfcd16e	40.00	250	3	4cd68003-0fff-4594-9d2f-91eed3bd5514
f6f4b3b7-8d9f-4cde-b662-5c623106d03e	18.00	100	2	4cd68003-0fff-4594-9d2f-91eed3bd5514
39ab6d25-dbe4-46f8-b245-ec8a9c40500d	10.00	50	1	4cd68003-0fff-4594-9d2f-91eed3bd5514
4d07a4c7-0850-4d83-b6d7-2958e4587782	48.00	250	3	610bc72f-818a-4e73-8702-53586a0de19a
09fb223d-4afc-42ed-9cec-93f6b722212c	21.60	100	2	610bc72f-818a-4e73-8702-53586a0de19a
489a74ea-4894-4d60-990f-5646eb4e68ae	12.00	50	1	610bc72f-818a-4e73-8702-53586a0de19a
906273b5-5c65-465e-830c-156928b2022b	8.00	50	0	657fb80e-07af-4db2-8176-6c13a8a1b0a1
3d6ede75-e515-4899-beb9-c248352ee287	14.40	100	1	657fb80e-07af-4db2-8176-6c13a8a1b0a1
b815627a-73ee-48cf-b89d-95f7af413b84	32.00	250	2	657fb80e-07af-4db2-8176-6c13a8a1b0a1
5e2b8557-4298-4dce-8a08-ede37ea65809	3.00	50	0	dd052ed1-646a-4dd4-bf19-6a24eef5e2af
75915160-d626-4c1a-b886-96dd4eec9366	5.40	100	1	dd052ed1-646a-4dd4-bf19-6a24eef5e2af
879032d1-0eee-4e7f-a6ac-13231e4cb27c	12.00	250	2	dd052ed1-646a-4dd4-bf19-6a24eef5e2af
7d07765d-6acb-44d7-8e4a-89b557be600d	2.00	50	0	1334b694-251c-44b3-9a65-c00fefc6af43
751c00e3-3ef0-456d-a8a8-3c03a6fc4b47	3.60	100	1	1334b694-251c-44b3-9a65-c00fefc6af43
de023c41-a1d3-412e-8829-e1e414b150ae	8.00	250	2	1334b694-251c-44b3-9a65-c00fefc6af43
00d8e8c9-f784-4f2d-930f-4921c4b0acd3	6.00	50	0	744af4b7-c027-45a7-a3b3-2a20a9bb67cd
f1fa85b5-17b2-4990-abff-ec6a78a6ff20	10.80	100	1	744af4b7-c027-45a7-a3b3-2a20a9bb67cd
2368dd5f-359a-4a0f-b862-5ed6fa8b8e6d	24.00	250	2	744af4b7-c027-45a7-a3b3-2a20a9bb67cd
6e8888fd-25c3-42d6-b37d-e77aaab09897	2.00	50	0	b7dde16a-5767-485d-a581-a57b6fde3043
935ab66d-eaa8-49a9-b99b-3be0c0fa4974	3.60	100	1	b7dde16a-5767-485d-a581-a57b6fde3043
584427b2-b45d-40a0-9a6e-731b192e1f51	8.00	250	2	b7dde16a-5767-485d-a581-a57b6fde3043
4787c224-0c5c-4db0-b8dd-9f9b64b85912	12.00	50	0	b8247ee9-c10e-4853-9060-5a45eb09b3fe
0e06c068-1067-4080-a45d-b96934191bdb	21.60	100	1	b8247ee9-c10e-4853-9060-5a45eb09b3fe
f36f4809-d6ac-456d-b508-db15408b742c	48.00	250	2	b8247ee9-c10e-4853-9060-5a45eb09b3fe
05ec69d8-91fd-48a1-b9f4-875370c33449	5.00	50	0	bd6e9414-9a75-43b2-9419-b1b88b7c5880
0ddc63bb-7181-4a8a-bf6b-d80ffdcc0e28	9.00	100	1	bd6e9414-9a75-43b2-9419-b1b88b7c5880
2446f61c-1a70-48f7-8f18-90e5ae449e0e	20.00	250	2	bd6e9414-9a75-43b2-9419-b1b88b7c5880
1ffdbdd6-a561-40c7-a963-551c221e6258	5.00	50	0	ce2527bf-569c-41cc-a6de-997605b1d40d
ffd8d78e-0847-4b96-a428-523c1810172b	9.00	100	1	ce2527bf-569c-41cc-a6de-997605b1d40d
c0d787e5-7d7f-433e-b644-817c02ee0089	20.00	250	2	ce2527bf-569c-41cc-a6de-997605b1d40d
76469bf2-6c9b-44e9-b738-9d1661af1299	8.00	1	0	9fea8b2c-682e-443d-a292-23c06eaeb3ea
7a986742-a36b-4002-b118-a141d42791bd	20.00	3	1	9fea8b2c-682e-443d-a292-23c06eaeb3ea
3cb98c2a-e00a-45ac-9ded-c80628d59ce7	32.00	5	2	9fea8b2c-682e-443d-a292-23c06eaeb3ea
1da3e6ad-a090-4728-865e-98c017c79f53	12.00	1	0	ea68cd2a-5e5b-437a-926d-9e110bb88058
fbe03258-30cb-4029-a501-3ccc1a47c0f1	30.00	3	1	ea68cd2a-5e5b-437a-926d-9e110bb88058
198a1a68-fb12-48f8-b0e5-e6f9c31478d4	48.00	5	2	ea68cd2a-5e5b-437a-926d-9e110bb88058
5f112feb-6c76-4a91-b4cd-594b3837a656	9.00	1	0	86793400-2856-4837-bae8-e5aaf26fdc69
bc37944b-9246-43cf-8a5f-8e18fc65607c	22.50	3	1	86793400-2856-4837-bae8-e5aaf26fdc69
952b68cc-430a-4d64-81bf-b411cae3287d	96.00	5	3	b8ac33a9-1beb-4b18-98a8-b45d39259271
a5d0f348-26a5-4461-95ad-e908ee645f6d	60.00	3	2	b8ac33a9-1beb-4b18-98a8-b45d39259271
926ea3d4-5be2-4645-bf55-4fa76e42486b	24.00	1	1	b8ac33a9-1beb-4b18-98a8-b45d39259271
edda1b78-ca5e-402a-8954-b0c114552be5	20.00	1	0	d6b6b2bd-36dd-45b8-918b-2af953a8c2b3
ae6a2ef7-6a1f-499d-8400-69e8dae94f1f	50.00	3	1	d6b6b2bd-36dd-45b8-918b-2af953a8c2b3
e65dc839-1fda-4ae4-98e7-123a98121581	36.00	5	2	86793400-2856-4837-bae8-e5aaf26fdc69
39de96c3-8177-4659-8f98-7bb2716e0608	9.00	100	0	7d6c8738-455d-488c-a3fc-d5ecf745efa9
7c4ec58c-c48e-4075-848c-37db3d7a4ad5	19.80	250	1	7d6c8738-455d-488c-a3fc-d5ecf745efa9
c8c5ccd8-8296-46ae-ac4d-f335e6f6bb6f	36.00	500	2	7d6c8738-455d-488c-a3fc-d5ecf745efa9
82844b60-132a-447d-93af-4761a8ba6748	13.00	1	0	876c23a5-9d73-4e40-be72-bf379d69c21a
986483e7-2c37-40c0-b54a-33f3ee3fd589	32.50	3	1	876c23a5-9d73-4e40-be72-bf379d69c21a
2d038178-856a-401a-a815-7c4fac476a0a	52.00	5	2	876c23a5-9d73-4e40-be72-bf379d69c21a
8137819a-9f02-47bc-9fae-16051c9e38d2	12.00	500	0	fbd34467-d662-4ae4-9c25-1c85a478243e
3a5f63a6-f383-44d6-bb66-d3dc5e3a9d9e	18.00	1000	1	fbd34467-d662-4ae4-9c25-1c85a478243e
dc51377f-4e42-4b35-8917-76ecb5148727	38.40	2500	2	fbd34467-d662-4ae4-9c25-1c85a478243e
88622886-fa41-42f7-9f59-2fd9fdac80fd	30.00	500	0	c8e2f9ae-385f-43c9-9ba7-e5416112975c
ba3ed026-9c9a-4663-8ca7-639c0bbff22e	45.00	1000	1	c8e2f9ae-385f-43c9-9ba7-e5416112975c
cfa8ec30-d0f0-4266-aab9-2f73be618513	96.00	2500	2	c8e2f9ae-385f-43c9-9ba7-e5416112975c
3595cf43-6d6d-4d9a-b52c-4dee7b15b115	14.00	500	0	b69f701e-9fa2-437a-8db4-8d123f76bf94
eaef9017-502f-412b-83ed-68b43c92837a	21.00	1000	1	b69f701e-9fa2-437a-8db4-8d123f76bf94
eaba18e2-98de-467e-98cb-f6161db431fa	44.80	2500	2	b69f701e-9fa2-437a-8db4-8d123f76bf94
aafe5c83-37f9-4203-8efe-74783b0bd9aa	22.00	500	0	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
22678f0f-e48a-4259-88cf-c459b92352a8	33.00	1000	1	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
3cfb0231-7d4a-4267-895a-ef2368d77d9a	70.40	2500	2	163c30ac-b337-47c9-bd13-7f1b0a0cb0fa
24885910-e434-4393-9908-77be9a06a5c6	28.00	1	0	bcc03a57-f819-447d-8fb7-cf3b1b6a74d1
6dd0af0a-7295-4d23-9a0d-7454dd5819c2	70.00	3	1	bcc03a57-f819-447d-8fb7-cf3b1b6a74d1
c863fd5f-d84a-4fb8-b9ba-270245fa7c89	112.00	5	2	bcc03a57-f819-447d-8fb7-cf3b1b6a74d1
26fb4a0a-1798-4256-8908-1085b7c6c6cc	28.00	500	0	2d10ce43-3226-43ed-9d4a-1b6781035b09
fe640a5a-22e8-4ef3-8e03-466ff0734ef1	42.00	1000	1	2d10ce43-3226-43ed-9d4a-1b6781035b09
0eb35da2-552d-4610-b0fe-7ac6bd761425	89.60	2500	2	2d10ce43-3226-43ed-9d4a-1b6781035b09
ff43206b-adf3-4e47-9a41-a9e997c6a1c1	22.00	1	0	f1c87cd7-84f7-4b56-84b5-a5557835e192
d64f7b53-d962-41f6-a2cf-16f7c91e27c2	55.00	3	1	f1c87cd7-84f7-4b56-84b5-a5557835e192
bf02bd0a-6c35-4595-b3b1-70a4d2f59607	88.00	5	2	f1c87cd7-84f7-4b56-84b5-a5557835e192
0f4f50e4-b29a-4613-b935-43dabf1fad0d	7.00	50	0	889bc829-dcf8-4f8d-aba5-88ac06037a39
c8c383a7-f9ff-438c-86f3-90fbf7dbff6f	12.60	100	1	889bc829-dcf8-4f8d-aba5-88ac06037a39
ddcbd78b-40a3-4b67-90d7-8fa57b693e49	28.00	250	2	889bc829-dcf8-4f8d-aba5-88ac06037a39
e4a1bfe9-9d7d-47a1-88ad-1932e3f46e5e	24.00	500	0	c50afce6-a0bd-4914-b506-50e99a1faaf4
3c07ea74-353a-47a9-bf8a-132c5e08041b	36.00	1000	1	c50afce6-a0bd-4914-b506-50e99a1faaf4
b4192013-fea7-4b94-8b5c-2fbe8dc4fb20	76.80	2500	2	c50afce6-a0bd-4914-b506-50e99a1faaf4
8064b668-f04a-412e-9b77-a46141b1d776	22.00	500	0	7c838a0f-3cf5-4087-9793-7ac22befe06f
4d2eae3d-38f6-4e5b-a8b2-0c9b8e09b15e	33.00	1000	1	7c838a0f-3cf5-4087-9793-7ac22befe06f
f7db0ee3-7d3f-40d1-944e-f490cb7819bd	70.40	2500	2	7c838a0f-3cf5-4087-9793-7ac22befe06f
1e916119-0e3b-41b7-99f3-2beee1d6e261	30.00	1	0	720314fd-1abd-4c8a-a79a-592e5d6c8650
ffa712d7-8e2b-462a-9741-265eccdc30be	75.00	3	1	720314fd-1abd-4c8a-a79a-592e5d6c8650
cc914e63-c5f0-4f29-8314-149f9a0323d3	120.00	5	2	720314fd-1abd-4c8a-a79a-592e5d6c8650
5b457ed5-3a83-4d34-ace4-4bfd92614729	18.00	500	0	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
63811124-bcfc-4f29-934d-4131034c82ad	27.00	1000	1	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
85a409e4-f41e-4a1e-beb1-8e21a43b1ced	57.60	2500	2	4cd1ad0a-b8c8-4d4d-b635-2c736de928f8
59ab503a-7eef-4681-9924-8857552486c5	14.00	1	0	a2f7ea19-abe4-4998-a223-993b2a5d3090
3f4f6d2f-35db-4729-a64a-4700f676fd24	35.00	3	1	a2f7ea19-abe4-4998-a223-993b2a5d3090
90d4fdb1-39ac-4af8-affd-da45977a802c	56.00	5	2	a2f7ea19-abe4-4998-a223-993b2a5d3090
adb134ee-09c4-4ae2-8e2e-51ff5befaaf9	20.00	500	0	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
5c797719-90f6-4c67-9a38-ef66dc738192	30.00	1000	1	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
59f71769-9fb8-43ef-a595-356b2fc9dd5d	64.00	2500	2	b2ecc9d8-31b8-414e-ba8e-fc7281149fc7
550a3c52-7550-4151-869d-2d18a366d3a6	8.00	1	0	555185f3-fecb-44b9-90d1-c883fb78c45b
ebb17d7b-4c6d-487a-a3fc-252a74fdbf12	20.00	3	1	555185f3-fecb-44b9-90d1-c883fb78c45b
bcce9acd-1dd3-4ece-a55a-f5a9d5822ccb	32.00	5	2	555185f3-fecb-44b9-90d1-c883fb78c45b
567bc21f-2946-4578-b509-cccc8faaa612	26.00	500	0	faa09eab-a088-4178-ba38-bdfe1e84f067
e9528abb-6326-4334-af66-67c5f4cd3eb5	39.00	1000	1	faa09eab-a088-4178-ba38-bdfe1e84f067
d72642ec-5eab-4033-853e-00297d8ea3eb	83.20	2500	2	faa09eab-a088-4178-ba38-bdfe1e84f067
18b1e6de-73de-45c5-a77d-c451f2db32f9	25.00	500	0	c00fe121-4b31-42be-bedd-a7144085ed84
8ec2e168-be02-40cc-9d07-f834e7842ff4	37.50	1000	1	c00fe121-4b31-42be-bedd-a7144085ed84
2a53da7a-e75d-4251-9d5f-81ed7b6cbacd	80.00	2500	2	c00fe121-4b31-42be-bedd-a7144085ed84
f35dd26c-e48f-4195-97e9-c2aec420051d	20.00	500	0	1584ae3c-a607-42a3-a906-192ac2fc8bfe
54942002-00a0-471b-9863-28968bc2e967	30.00	1000	1	1584ae3c-a607-42a3-a906-192ac2fc8bfe
7fa168fd-e5fb-4155-9af0-561d31e8a8c3	64.00	2500	2	1584ae3c-a607-42a3-a906-192ac2fc8bfe
6f38c281-a877-444c-be9c-d3fd5940dc06	30.00	500	0	116655bc-452a-4982-a7d2-f464752a949d
717972c6-4012-4d38-a714-9895f2e2b101	45.00	1000	1	116655bc-452a-4982-a7d2-f464752a949d
becea933-84a1-4ddc-9dcd-608f03f87621	96.00	2500	2	116655bc-452a-4982-a7d2-f464752a949d
1d9c75ea-a683-43cd-bf96-c98786ad32f5	19.00	500	0	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
737f09af-574c-41ad-9e9f-eba9a4d060f4	28.50	1000	1	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
d30db949-628c-40d6-9489-b923452d4f56	60.80	2500	2	6e6fba56-6b89-43a7-9bcf-f0bd42acba9c
94c46d5b-a253-4e87-81f2-84854b2d70f4	20.00	500	0	7bb29c68-6d79-46ba-a662-743f7cd78b1e
2fb6085f-cb8e-4dcf-81c6-e20734a64c9c	30.00	1000	1	7bb29c68-6d79-46ba-a662-743f7cd78b1e
4f0dba5c-6cf8-4362-96c9-3064f5fde15a	64.00	2500	2	7bb29c68-6d79-46ba-a662-743f7cd78b1e
020e1239-ec04-4fe5-8c10-c073745a04f4	19.00	500	0	fa656ba8-e4bf-45f5-a776-e50bf8655260
795ce72c-d291-4b0e-bec2-f58310f10201	28.50	1000	1	fa656ba8-e4bf-45f5-a776-e50bf8655260
d8ac110c-5b8a-4ed8-8b0e-25adf1fde843	60.80	2500	2	fa656ba8-e4bf-45f5-a776-e50bf8655260
5ebc7dfe-2927-4511-be78-194695f8cac4	25.00	500	0	a948564e-d2e4-406a-9f38-1973fc377675
5b11ad3b-a555-40f2-8395-65b3ac72af7d	37.50	1000	1	a948564e-d2e4-406a-9f38-1973fc377675
e4c17cf2-efc3-41c5-a8e5-b0f70ac1c2b6	80.00	2500	2	a948564e-d2e4-406a-9f38-1973fc377675
\.


--
-- Data for Name: catalog_products; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.catalog_products (id, active, badge, created_at, featured, long_desc, name, original_price, short_desc, slug, sort_order, updated_at, brand_id, category_id) FROM stdin;
76421511-87ff-4ace-be67-d578b6271acf	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Form - Makbuz	\N	Form - Makbuz — profesyonel baskı.	form-makbuz-urun	100	2026-06-02 09:52:14.645762+00	\N	6ae8201c-1f24-4964-a0cd-7cffff08b4be
83303a4f-d1f6-45b8-b33c-3a9744b36221	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Islak Mendil	\N	Islak Mendil — profesyonel baskı.	islak-mendil	100	2026-06-02 09:52:14.645762+00	\N	3de0b0a2-693b-4d29-b588-1b9812db9e94
dd052ed1-646a-4dd4-bf19-6a24eef5e2af	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Baskılı Bardak	\N	Baskılı Bardak — profesyonel baskı.	baskili-bardak	100	2026-06-02 09:52:14.645762+00	\N	dc7e1291-48e3-4cb5-a38d-7ab905aa5145
8688f2dc-c168-42b0-a950-f999c383712f	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Bloknot	\N	Bloknot — profesyonel baskı.	promo-bloknot	100	2026-06-02 09:52:14.645762+00	\N	909aac03-267a-45e5-9b98-2fac2ba34a47
97cfc740-1f60-40cc-b3fb-e572ff01a96f	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Magnet	\N	Magnet — profesyonel baskı.	promo-magnet	100	2026-06-02 09:52:14.645762+00	\N	93bfaf95-800a-4ae5-96ba-674d9bc0a8bb
bd6e9414-9a75-43b2-9419-b1b88b7c5880	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Takvim	\N	Takvim — profesyonel baskı.	takvim	100	2026-06-02 09:52:14.645762+00	\N	1b7361ef-5d50-48ac-b3a6-468ade1c7444
744af4b7-c027-45a7-a3b3-2a20a9bb67cd	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Ajanda	\N	Ajanda — profesyonel baskı.	ajanda	100	2026-06-02 09:52:14.645762+00	\N	ab5eef05-1f59-4731-a7fb-204367564c7b
1334b694-251c-44b3-9a65-c00fefc6af43	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Kalem	\N	Kalem — profesyonel baskı.	kalem	100	2026-06-02 09:52:14.645762+00	\N	6e897f17-c170-48cd-b49b-84a65ffed17c
82b26352-23ab-4b79-9232-d1d0d62fe418	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Çakmak	\N	Çakmak — profesyonel baskı.	cakmak	100	2026-06-02 09:52:14.645762+00	\N	ad5b0099-d0f2-4539-b5e3-2b5b93f038ac
657fb80e-07af-4db2-8176-6c13a8a1b0a1	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Termos	\N	Termos — profesyonel baskı.	termos	100	2026-06-02 09:52:14.645762+00	\N	127d2e22-4919-4b6f-91b9-06ffe8340155
b7dde16a-5767-485d-a581-a57b6fde3043	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Anahtarlık	\N	Anahtarlık — profesyonel baskı.	anahtarlik	100	2026-06-02 09:52:14.645762+00	\N	1e2d4cb1-bbc7-4b02-a345-0d782fd78426
b8247ee9-c10e-4853-9060-5a45eb09b3fe	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Plaket	\N	Plaket — profesyonel baskı.	plaket	100	2026-06-02 09:52:14.645762+00	\N	028057ca-8cc9-4e10-8596-33b9d1abbd2c
ce2527bf-569c-41cc-a6de-997605b1d40d	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Masa İsimliği	\N	Masa İsimliği — profesyonel baskı.	masa-isimligi	100	2026-06-02 09:52:14.645762+00	\N	de83425b-50b7-4300-90cf-33b3920830da
331c165c-cb29-4e7d-bd8c-6659da4ad7d5	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Vinil	\N	Vinil — profesyonel baskı.	vinil	100	2026-06-02 09:52:14.645762+00	\N	8f6217d7-c331-4112-92b1-34ebd309dcd2
86793400-2856-4837-bae8-e5aaf26fdc69	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Folyo	\N	Folyo — profesyonel baskı.	folyo	100	2026-06-02 09:52:14.645762+00	\N	98f31fd9-b779-408e-b9fa-64a51a9d1215
ea68cd2a-5e5b-437a-926d-9e110bb88058	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Vinil Branda Afiş	\N	Vinil Branda Afiş — profesyonel baskı.	vinil-branda-afis	100	2026-06-02 09:52:14.645762+00	\N	a728f015-00b8-499f-a420-e2ce3dd0ff58
3efde787-c772-477d-ae03-d2a5fd49868b	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Mat Folyo	\N	Mat Folyo — profesyonel baskı.	mat-folyo-urun	100	2026-06-02 09:52:14.645762+00	\N	5d6ce25d-22eb-4fbe-aadd-75f49734c336
8bcc3b47-be5e-4b70-93fc-6e5c0e38dba3	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Mesh Delikli Vinil	\N	Mesh Delikli Vinil — profesyonel baskı.	mesh-vinil	100	2026-06-02 09:52:14.645762+00	\N	0dc83881-acd8-4a59-973a-a26b9188fe45
d3aaf05d-fca8-4037-a196-8826d2921eb5	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Işıklı Vinil	\N	Işıklı Vinil — profesyonel baskı.	isikli-vinil-urun	100	2026-06-02 09:52:14.645762+00	\N	d5cc2218-1def-4e30-934a-f589b53a5d62
7fc39472-cf1c-4a28-97f2-2345c9a62f3c	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Şeffaf Folyo	\N	Şeffaf Folyo — profesyonel baskı.	seffaf-folyo-urun	100	2026-06-02 09:52:14.645762+00	\N	216aa095-a2b2-4287-8bf0-3aa48cd1befb
9fea8b2c-682e-443d-a292-23c06eaeb3ea	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Afiş	\N	Afiş — profesyonel baskı.	afis-urun	100	2026-06-02 09:52:14.645762+00	\N	f179f36b-97ef-4553-8556-f3b723899a33
f1480084-32f7-4cd0-9a1f-a66fbcd30ea0	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Kanvas Tablo	\N	Kanvas Tablo — profesyonel baskı.	kanvas-tablo	100	2026-06-02 09:52:14.645762+00	\N	9baca02a-ad1f-4a0d-8145-0d3d95c12dba
d2461563-bae2-493c-9aec-9581f6e937a3	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Fotoğraf Baskı	\N	Fotoğraf Baskı — profesyonel baskı.	fotograf-baski-urun	100	2026-06-02 09:52:14.645762+00	\N	5e46b861-9b7c-45bd-a40a-1f473b30dfe1
99420ca6-a8ff-4aa2-bcde-03181677ba26	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Kupa Baskı	\N	Kupa Baskı — profesyonel baskı.	kupa-baski	100	2026-06-02 09:52:14.645762+00	\N	b053f4b9-78e3-45a9-a536-b8ef844b5a4b
889bc829-dcf8-4f8d-aba5-88ac06037a39	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Puzzle Baskı	\N	Puzzle Baskı — profesyonel baskı.	puzzle-baski	100	2026-06-02 09:52:14.645762+00	\N	0199dfc8-1809-4bd7-998f-1eca3d2db26c
33f1bebe-3e36-4fd5-a623-ef092d18a638	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Foto Kart	\N	Foto Kart — profesyonel baskı.	foto-kart-urun	100	2026-06-02 09:52:14.645762+00	\N	ac6460b2-7caa-441e-bc72-7a933d4a3758
f1c87cd7-84f7-4b56-84b5-a5557835e192	t	\N	2026-06-02 09:52:14.645762+00	f	\N	MDF Tablo	\N	MDF Tablo — profesyonel baskı.	mdf-tablo-urun	100	2026-06-02 09:52:14.645762+00	\N	91f6da40-6558-488f-98ca-a412905f8578
ce7cf5a5-65b3-4a06-948b-3255c002eab4	f	\N	2026-06-02 09:52:14.645762+00	f	\N	Mousepad	\N	Mousepad — profesyonel baskı.	mousepad	100	2026-06-03 09:12:31.108909+00	\N	d3f8d09e-fa37-405f-bf7b-f3d3cd7bd424
adec4528-0e01-4628-9272-bc786c70d96f	f	\N	2026-06-02 09:52:14.645762+00	f	\N	VIP Set	\N	VIP Set — profesyonel baskı.	vip-set	100	2026-06-03 09:12:35.301359+00	\N	555a2f06-5b50-46fd-96df-89b4b1227b60
4cd68003-0fff-4594-9d2f-91eed3bd5514	f	\N	2026-06-02 09:52:14.645762+00	f	\N	Promosyon Paketi	\N	Promosyon Paketi — profesyonel baskı.	promosyon-paketi	100	2026-06-03 09:12:38.309607+00	\N	114983ba-6bba-4799-8b56-5f5945577ae5
559b51f9-0ff2-4e14-b439-7a7cc3f72d7e	f	\N	2026-06-02 09:52:14.645762+00	f	\N	Tişört	\N	Tişört — profesyonel baskı.	tisort	100	2026-06-03 09:12:41.994726+00	\N	babb3609-cc5f-4793-9cfe-cb7ae050c88b
610bc72f-818a-4e73-8702-53586a0de19a	f	\N	2026-06-02 09:52:14.645762+00	f	\N	Powerbank	\N	Powerbank — profesyonel baskı.	powerbank-urun	100	2026-06-03 09:18:44.696778+00	\N	a8564917-516e-427b-97e4-0ef08f36fc51
163c30ac-b337-47c9-bd13-7f1b0a0cb0fa	t	\N	2026-06-02 09:29:23.63945+00	t	\N	Sıvama Kartvizit	\N	Sıvama tekniğiyle parlak yüzey, premium görünüm.	sivama-kartvizit	10	2026-06-02 09:29:23.63945+00	\N	be969a50-86ce-4044-96e8-490b23552f7d
2d10ce43-3226-43ed-9d4a-1b6781035b09	t	\N	2026-06-02 09:29:23.63945+00	t	\N	3 Katlı Sandviç Kartvizit	\N	3 katmanlı kalın yapı, lüks ve dayanıklı dokunuş.	3-katli-sandvic-kartvizit	11	2026-06-02 09:29:23.63945+00	\N	be969a50-86ce-4044-96e8-490b23552f7d
7c838a0f-3cf5-4087-9793-7ac22befe06f	t	\N	2026-06-02 09:29:23.63945+00	f	\N	Tuale Fantazi Kartvizit	\N	Tuale dokulu özel kağıt, sanatsal ve özgün etki.	tuale-fantazi-kartvizit	12	2026-06-02 09:29:23.63945+00	\N	be969a50-86ce-4044-96e8-490b23552f7d
c00fe121-4b31-42be-bedd-a7144085ed84	t	\N	2026-06-02 09:29:23.63945+00	f	\N	Gofreli Kartvizit	\N	Kabartma desenli, dokunsal etki yaratan kartvizit.	gofreli-kartvizit	20	2026-06-02 09:29:23.63945+00	\N	68e80d8b-96ad-4e66-9828-e4b70a7a2ef6
faa09eab-a088-4178-ba38-bdfe1e84f067	t	\N	2026-06-02 09:29:23.63945+00	t	\N	Kabartma Laklı Kartvizit	\N	Selektif lak kabartma, modern ve şık tasarım.	kabartma-lakli-kartvizit	21	2026-06-02 09:29:23.63945+00	\N	68e80d8b-96ad-4e66-9828-e4b70a7a2ef6
c50afce6-a0bd-4914-b506-50e99a1faaf4	t	\N	2026-06-02 09:29:23.63945+00	f	\N	Yumuşak Dokulu Kartvizit	\N	SoftTouch teknolojisi, yumuşak ve premium hisli yüzey.	softtouch-kartvizit	40	2026-06-02 09:29:23.63945+00	\N	8836a040-5619-4e2e-a1c6-639cdf9783c5
4cd1ad0a-b8c8-4d4d-b635-2c736de928f8	t	\N	2026-06-02 09:29:23.63945+00	f	\N	Kare Kartvizit	\N	9x9cm kare format, dikkat çekici alternatif tasarım.	kare-kartvizit	50	2026-06-02 09:29:23.63945+00	\N	43a784da-0d7b-40e8-bfef-7adb8ef96f21
b2ecc9d8-31b8-414e-ba8e-fc7281149fc7	t	\N	2026-06-02 09:29:23.63945+00	f	\N	Katlamalı Kartvizit	\N	Katlanabilir tasarım, içinde detay sunma alanı.	katlamali-kartvizit	51	2026-06-02 09:29:23.63945+00	\N	43a784da-0d7b-40e8-bfef-7adb8ef96f21
6e6fba56-6b89-43a7-9bcf-f0bd42acba9c	t	\N	2026-06-02 09:29:23.63945+00	f	\N	Oval Kesim Kartvizit	\N	Köşeleri oval kesim, modern ve şık silüet.	oval-kesim-kartvizit	52	2026-06-02 09:29:23.63945+00	\N	43a784da-0d7b-40e8-bfef-7adb8ef96f21
7bb29c68-6d79-46ba-a662-743f7cd78b1e	t	\N	2026-06-02 09:29:23.63945+00	f	\N	İki Kenar Oval Kartvizit	\N	Üst ve alt kenarları oval, dikkat çekici form.	iki-kenar-oval-kartvizit	53	2026-06-02 09:29:23.63945+00	\N	43a784da-0d7b-40e8-bfef-7adb8ef96f21
1584ae3c-a607-42a3-a906-192ac2fc8bfe	t	\N	2026-06-02 09:29:23.63945+00	f	\N	Takvimli Kartvizit	\N	Arkasında takvim baskı, uzun süreli akılda kalıcılık.	takvimli-kartvizit	54	2026-06-02 09:29:23.63945+00	\N	43a784da-0d7b-40e8-bfef-7adb8ef96f21
a948564e-d2e4-406a-9f38-1973fc377675	t	\N	2026-06-02 09:29:23.63945+00	f	\N	PVC Kaplı Kartvizit	\N	PVC kaplama, su geçirmez ve uzun ömürlü kullanım.	pvc-kapli-kartvizit	60	2026-06-02 09:29:23.63945+00	\N	961f50a7-1d5c-4c8a-854a-ba6620ab9074
116655bc-452a-4982-a7d2-f464752a949d	t	\N	2026-06-02 09:29:23.63945+00	t	\N	Şeffaf Kartvizit	\N	Şeffaf plastik malzeme, lüks ve dikkat çekici.	seffaf-kartvizit	61	2026-06-02 09:29:23.63945+00	\N	961f50a7-1d5c-4c8a-854a-ba6620ab9074
fa656ba8-e4bf-45f5-a776-e50bf8655260	t	\N	2026-06-02 09:29:23.63945+00	t	\N	Kraft Kartvizit	\N	Kraft kağıt, doğal ve özgün görünüm. Eco friendly.	kraft-kartvizit	70	2026-06-02 09:29:23.63945+00	\N	0613535f-9f95-4160-883b-af5cc07ae7b2
bcc03a57-f819-447d-8fb7-cf3b1b6a74d1	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Atatürk Tablosu	\N	Atatürk Tablosu — profesyonel baskı.	ataturk-tablo-urun	100	2026-06-02 09:52:14.645762+00	\N	939e7449-2abc-4920-9da0-8893d5645c78
5a2d6cfa-bc9d-48fc-a2a0-ac853dc1933e	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Mesh Emlak Afişi	\N	Mesh Emlak Afişi — profesyonel baskı.	mesh-emlak-afisi-urun	100	2026-06-02 09:52:14.645762+00	\N	27d430ad-e9fb-4554-bbee-2b3551d059a7
876c23a5-9d73-4e40-be72-bf379d69c21a	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Vinil Branda Emlak Afişi	\N	Vinil Branda Emlak Afişi — profesyonel baskı.	vinil-emlak-afisi	100	2026-06-02 09:52:14.645762+00	\N	0e861770-c504-4b83-a1c6-7e2daed1c2e8
e372bb93-00f6-46cb-baa4-9e0e820b2e92	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Kağıt Emlak Afişi	\N	Kağıt Emlak Afişi — profesyonel baskı.	kagit-emlak-afisi	100	2026-06-02 09:52:14.645762+00	\N	c0f86c4c-4a3b-494a-aca2-7e2267b2a8ba
9de8cdb2-10de-4075-81e6-9a09ab326040	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Emlak Tabelası	\N	Emlak Tabelası — profesyonel baskı.	emlak-tabelasi-urun	100	2026-06-02 09:52:14.645762+00	\N	f2272869-e576-4a72-b568-16875b3bb6d6
fbd34467-d662-4ae4-9c25-1c85a478243e	t	\N	2026-06-02 10:51:57.143448+00	f	İşte standart kartvizit için kullanabileceğiniz uzun bir ürün açıklaması:\n\n---\n\n**Standart Kartvizit**\n\nİş hayatında ilk izlenim her şeydir ve standart kartvizitimiz, profesyonel kimliğinizi en doğru şekilde yansıtmanız için tasarlandı. Klasik 85 x 55 mm ölçülerindeki bu kartvizit, cüzdana, kartlık ya da çantaya kolayca sığar; her ortamda pratik ve kullanışlı bir çözüm sunar.\n\nKaliteli kuşe karton üzerine yüksek çözünürlüklü baskı tekniğiyle üretilen kartvizitlerimiz, canlı renkler ve net detaylarla göz alıcı bir görünüm sağlar. İster mat ister parlak laminasyon seçeneğiyle tercih edin; her iki kaplama da kartınıza dayanıklılık kazandırırken zarif bir dokunuş katar. Mat yüzey sade ve şık bir duruş sunarken, parlak yüzey renklerin daha da öne çıkmasını sağlar.\n\nTek yüz ya da çift yüz baskı seçenekleriyle, ön yüzde adınızı, unvanınızı ve iletişim bilgilerinizi; arka yüzde ise logonuzu, sloganınızı veya QR kodunuzu rahatlıkla kullanabilirsiniz. Tasarımınızı kendiniz hazırlayabilir ya da hazır şablonlarımız arasından markanıza en uygun olanı seçebilirsiniz.\n\nDengeli gramajı sayesinde hem sağlam hem de kullanışlı olan kartvizitlerimiz, kolay kolay kırışmaz veya bükülmez. Standart formatı her sektör için uygundur; serbest çalışanlardan kurumsal firmalara, yeni girişimcilerden deneyimli profesyonellere kadar herkesin ihtiyacına yanıt verir.\n\nHızlı teslimat ve uygun fiyat avantajıyla, profesyonel bir kartvizite sahip olmak için zaman ve bütçe sorunu yaşamazsınız. Markanızı her tanışmada akılda kalıcı kılmak ve iletişim bilgilerinizi şık bir şekilde paylaşmak için standart kartvizitimiz ideal bir tercihtir.\n\n---\n\nİstersen bu metni belirli bir sektöre (örneğin avukatlık, kafe, danışmanlık) göre özelleştirebilir ya da daha kısa/satış odaklı bir versiyon hazırlayabilirim. Ayrıca "premium" veya farklı kartvizit türleri için de açıklama yazabilirim.	Standart Kartvizit	\N	Ekonomik, hızlı teslim standart kartvizit.	standart-kartvizit-urun	5	2026-06-02 11:32:24.097476+00	\N	7119c09d-a9fd-41f5-a3b8-0ecc8eeed95e
c8e2f9ae-385f-43c9-9ba7-e5416112975c	t	\N	2026-06-02 09:29:23.63945+00	t	İşte standart kartvizit için kullanabileceğiniz uzun bir ürün açıklaması:\n\n---\n\n**Standart Kartvizit**\n\nİş hayatında ilk izlenim her şeydir ve standart kartvizitimiz, profesyonel kimliğinizi en doğru şekilde yansıtmanız için tasarlandı. Klasik 85 x 55 mm ölçülerindeki bu kartvizit, cüzdana, kartlık ya da çantaya kolayca sığar; her ortamda pratik ve kullanışlı bir çözüm sunar.\n\nKaliteli kuşe karton üzerine yüksek çözünürlüklü baskı tekniğiyle üretilen kartvizitlerimiz, canlı renkler ve net detaylarla göz alıcı bir görünüm sağlar. İster mat ister parlak laminasyon seçeneğiyle tercih edin; her iki kaplama da kartınıza dayanıklılık kazandırırken zarif bir dokunuş katar. Mat yüzey sade ve şık bir duruş sunarken, parlak yüzey renklerin daha da öne çıkmasını sağlar.\n\nTek yüz ya da çift yüz baskı seçenekleriyle, ön yüzde adınızı, unvanınızı ve iletişim bilgilerinizi; arka yüzde ise logonuzu, sloganınızı veya QR kodunuzu rahatlıkla kullanabilirsiniz. Tasarımınızı kendiniz hazırlayabilir ya da hazır şablonlarımız arasından markanıza en uygun olanı seçebilirsiniz.\n\nDengeli gramajı sayesinde hem sağlam hem de kullanışlı olan kartvizitlerimiz, kolay kolay kırışmaz veya bükülmez. Standart formatı her sektör için uygundur; serbest çalışanlardan kurumsal firmalara, yeni girişimcilerden deneyimli profesyonellere kadar herkesin ihtiyacına yanıt verir.\n\nHızlı teslimat ve uygun fiyat avantajıyla, profesyonel bir kartvizite sahip olmak için zaman ve bütçe sorunu yaşamazsınız. Markanızı her tanışmada akılda kalıcı kılmak ve iletişim bilgilerinizi şık bir şekilde paylaşmak için standart kartvizitimiz ideal bir tercihtir.\n\n---\n\nİstersen bu metni belirli bir sektöre (örneğin avukatlık, kafe, danışmanlık) göre özelleştirebilir ya da daha kısa/satış odaklı bir versiyon hazırlayabilirim. Ayrıca "premium" veya farklı kartvizit türleri için de açıklama yazabilirim.	Altın Yaldızlı Kartvizit	\N	Altın yaldız detayları ile premium görünüm.	altin-yaldizli-kartvizit	30	2026-06-02 11:56:03.339046+00	\N	2783e48a-b502-454b-bffe-0af7301ec927
b8ac33a9-1beb-4b18-98a8-b45d39259271	f	\N	2026-06-02 09:52:14.645762+00	f	\N	Dekoratif Tablo	\N	Dekoratif Tablo — profesyonel baskı.	dekoratif-tablo-urun	100	2026-06-03 12:10:45.215368+00	\N	dab555d3-3224-4863-9d1d-e4725f8600c8
7d6c8738-455d-488c-a3fc-d5ecf745efa9	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Kapı Askı Broşürü	\N	Kapı Askı Broşürü — profesyonel baskı.	kapi-aski-brosuru-urun	100	2026-06-02 09:52:14.645762+00	\N	5a4f40f1-cc9d-4e79-8045-b7fefbcd4537
4c6e7f4a-9800-462f-a1a9-751129cc25be	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Katalog Baskı	\N	Katalog Baskı — profesyonel baskı.	katalog-urun	100	2026-06-02 09:52:14.645762+00	\N	d7b967d1-80b4-46cd-93f8-e3f7f532b5b9
04bce68a-3bce-4c0e-a1d5-6d3dcd09b053	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Gümüş Makam Bayrağı	\N	Gümüş Makam Bayrağı — profesyonel baskı.	makam-bayragi	100	2026-06-02 09:52:14.645762+00	\N	77f4b716-1b7c-471d-99cc-3b8203baae71
d32e70ec-9b9d-4209-b8a0-3dc47e66f473	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Sertifika	\N	Sertifika — profesyonel baskı.	sertifika	100	2026-06-02 09:52:14.645762+00	\N	87df6959-6da6-4ca5-9077-8ba6e1c85333
9625f7c7-3058-4960-a42e-3b3648a5d1b4	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Reçete Baskı	\N	Reçete Baskı — profesyonel baskı.	recete-baski	100	2026-06-02 09:52:14.645762+00	\N	190c3c41-e1be-496b-8fe6-d9c9dcde3d38
379f4020-e851-4a34-9703-83e337682ca6	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Anket Formu	\N	Anket Formu — profesyonel baskı.	anket-formu	100	2026-06-02 09:52:14.645762+00	\N	4a6850e6-86a5-4b8c-ab11-539228096a50
ff92cf7d-b1aa-4baa-831f-861da7a21015	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Kartpostal	\N	Kartpostal — profesyonel baskı.	kartpostal	100	2026-06-02 09:52:14.645762+00	\N	a93c382e-d394-4e9b-928a-0f8b6097fce3
d6b6b2bd-36dd-45b8-918b-2af953a8c2b3	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Duba	\N	Duba — profesyonel baskı.	duba	100	2026-06-02 09:52:14.645762+00	\N	2e42287e-4ef4-4a49-a56a-809f437dbf76
555185f3-fecb-44b9-90d1-c883fb78c45b	t	\N	2026-06-02 09:52:14.645762+00	f	\N	İş Güvenlik Levhası	\N	İş Güvenlik Levhası — profesyonel baskı.	is-guvenlik-levhasi	100	2026-06-02 09:52:14.645762+00	\N	663afecb-49b4-4b9e-a2fb-587e3a1acd85
7a991bcf-1c19-4725-a5c0-99cad0f76515	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Kapı İsimliği	\N	Kapı İsimliği — profesyonel baskı.	kapi-isimligi	100	2026-06-02 09:52:14.645762+00	\N	fdaef4e4-6b9b-40ed-b08b-55aa481e66be
93caa48c-b5d8-4289-96b8-e9b7ac2b8d9a	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Kaşe	\N	Kaşe — profesyonel baskı.	kase	100	2026-06-02 09:52:14.645762+00	\N	53be3dba-d3cc-400f-9057-fe78598bfdf8
0f113e07-2bd1-4bf3-90a4-f1bcfa491e72	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Tabela	\N	Tabela — profesyonel baskı.	tabela	100	2026-06-02 09:52:14.645762+00	\N	059101b4-71ed-43b6-945d-992a1548e25e
27217955-03b8-4a3f-b57e-bbff60ac1328	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Davetiye	\N	Davetiye — profesyonel baskı.	davetiye-urun	100	2026-06-02 09:52:14.645762+00	\N	e255e01e-c460-4c1b-8e8d-ac7badd16946
f506e467-1f89-4015-8f23-5f2a2aaca99c	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Roll-Up Banner	\N	Roll-Up Banner — profesyonel baskı.	roll-up-urun	100	2026-06-02 09:52:14.645762+00	\N	99e901fd-eef9-44b6-874e-0f32eaf90b59
9e29855f-90c3-4e56-8236-4de364524522	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Etiket	\N	Etiket — profesyonel baskı.	etiket	100	2026-06-02 09:52:14.645762+00	\N	4e8d7f6d-435d-4983-a5ce-00b7c97897d0
7b66d82d-b943-465b-9767-58c44bc23f5e	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Zarf	\N	Zarf — profesyonel baskı.	zarf	100	2026-06-02 09:52:14.645762+00	\N	ebb14f11-2ee7-40cd-845e-220a5c00ce27
cf7b4ed5-182d-4049-97b9-9fbb3baa9e4b	t	\N	2026-06-02 09:52:14.645762+00	f	\N	Bloknot	\N	Bloknot — profesyonel baskı.	bloknot	100	2026-06-02 09:52:14.645762+00	\N	cca4ae1e-06bb-4a0b-8dae-7251d5f6acba
96968a16-96f7-4647-bd50-4ec8dfe32ebf	t	\N	2026-06-02 09:52:14.645762+00	f	El İlanı Siparişi Öncesi Dikkat Edilmesi Gerekenler\nEl ilanlarınızda yazan yazıların okunaklı olduğundan emin olun. Uygun font ve renk seçenekleri, yazıların daha okunabilir olmasını sağlar.\nÖrnek ilanları ve el ilanı tasarımlarını incelemek, kendi ilanınız için size ilham verici fikirler sağlayacaktır.\nEl ilanınızın kısa bir süre içinde hemen karşı tarafın ilgisini çekmesi gerekir. Bunun için tasarımınızda çarpıcı öğelere yer verebilirsiniz. Dikkat çekici renkler, resim ve tanıtım amacınıza uygun sloganlar bu konuda size yardımcı olacaktır.\nİlanınızda, bu tanıtım faaliyetinde ne amaçladığınızı, okuyana nasıl bir değer vadettiğinizi açık ve net bir şekilde ifade etmeniz, daha akılda kalıcı olmanızı sağlayacaktır.\nİlanda yalnızca paragraf şeklinde düz metinlere yer vermek yerine, ilgili başlıklar altında maddeleyerek, mesajınızı hap bilgiler şeklinde sunmanız okunma oranını artıracaktır.\nSon cümleler, en çok göz atılan ve en fazla akılda kalan kısımlardır. İletmek istediğiniz mesajınızı, harekete geçiren vurucu bir cümleyle bitirmeye özen gösterin.\nEl ilanınızda iletişim bilgilerinizin eksiksiz olduğundan, sosyal medya hesaplarınızın da bu bilgiler arasında olduğundan emin olunuz.	El İlanı	\N	El İlanı — profesyonel baskı.	el-ilani	100	2026-06-02 14:07:06.637707+00	\N	06938a6c-5437-4422-8a67-5c516fe91666
e3bf240f-f342-48bf-856d-d1c9f712d875	f	\N	2026-06-02 09:52:14.645762+00	f	\N	Masa Sümeni	\N	Masa Sümeni — profesyonel baskı.	masa-sumeni	100	2026-06-02 14:35:08.833491+00	\N	7fd43c70-ac25-43a8-997d-9bee5fcdc5f2
a2f7ea19-abe4-4998-a223-993b2a5d3090	t	\N	2026-06-02 09:52:14.645762+00	f	Yelken Bayrak Baskı Hakkında\nYelken bayrak tanıtım faaliyetleriniz için önemli bir reklam ürünüdür. Yelken bayrağı açılış etkinliklerinden fuar organizasyonlarına, mağaza önlerine kadar markanızı duyurmak istediğiniz her alanda kullanabilirsiniz.\n\nYelken bayrak bir diğer adıyla plaj bayrağı üzerine her çeşit yazı, fotoğraf, grafik bastırabileceğiniz reklam materyalidir. Esnek, dayanıklı ve hafif bir reklam bayrağı türü olan yelken bayrak iç ve dış mekanlarda rahatlıkla kullanılabilir. Kurumsal kimlik çalışmalarının bir parçası olan yelken bayrak, kalabalık bir caddede dahi fark edilmenizi sağlar. Yapısı itibariyle rüzgarın estiği yöne dönen ve sürekli açık kalabilen yelken bayrak kampanyanızı, markanızı, dükkanınızın yerini anlatmanın en kolay yoludur.\n\nYelken bayrak kesimi tercihinize bağlı olarak değişir. Bayrağınızı yelken bayrak, L bayrak veya damla bayrak şeklinde kestirebilirsiniz. Yelken bayrak tasarımı için bidolubaski.com’un hazırladığı şablonları kullanabilir veya kendiniz tasarlayabilirsiniz. Yaygın olarak kullanılan yelken bayrak ölçüleri 75x250 santimetre ve 75x300 santimetredir. Siparişlerinizi, sadece bayrak, sadece sopa, sopa + duba ve bayrak + sopa + duba şeklinde 4 farklı kombinasyonda oluşturabilirsiniz.\n\nMalzeme Bilgisi\nBayraklarda kullanılan malzeme ekonomik ve standart seçeneklerinde farklılıklar göstermektedir. Ekonomik seçeneğinde bayrak 90 gr. raşel kumaş, malzeme demirdir; standart seçenekte ise bayrak 110 gr. raşel kumaş, malzeme alüminyumdur.\nKısa süreli kullanımlar için ekonomik malzemeyi promosyon ürün olarak tercih edebilirsiniz. Uzun süreli kullanımlar için ve dış mekan koşullarına daha dayanıklı olması açısından standart malzeme tercih etmeniz önerilir.\nDirek boyu bayrak boyutundan 50 cm daha fazladır, 50 cm'lik kısım bidona takılmaktadır.\nBayrağı bidona takmak için gerekli olan tıpa, bidonun altında yer almaktadır.\nDubanın altında bulunan, yelken bayrak direğinin takılacağı aparatın, çok fazla sıkıştırılmaması gerekmektedir.\nBayrakların duba kısmına su veya kum doldurulabilir. 100x400 cm'lik bayrağın duba kapasitesi 32 litre, diğer bayrakların ise 20 litredir.\nÜrün kurulum kılavuzu ile birlikte gönderilmektedir.\nÜrünü satın aldıktan sonra bayrağı maksimum 30 derecede yıkamanız gerekmektedir.\nYelken Bayrak Kullanım Alanları\nPlaj bayrak, dubalı bayrak veya olta bayrak olarak da bilinen yelken bayrağı, tanıtım yapmak istediğiniz her alanda tercih edebilirsiniz. Yelken bayrak reklam, kampanya, duyuru, fuar organizasyonlarında, kapı önü süslemelerinde, açılışlarda iç ve dış mekanlarda kullanılabilir. Mağaza önleri, fuar standları veya firma tanıtımlarında kullanacağınız yelken bayrak fark edilmenizi sağlar. Yelken bayrak uzun kullanım ömrü ve yarattığı etki nedeniyle çok tercih edilen reklam materyalleri arasındadır.\n\nYelken bayrak fiyatları ölçü ve adede göre farklılık gösterir. Online matbaa bidolubaski.com üzerinden 75x250 cm, 75x300 cm, 100x400 cm ve 110x250 cm ebatlarında yelken bayrak siparişlerinizi en uygun fiyata, en kolay şekilde verebilirsiniz. Yelken bayrak siparişi vermek için bidolubaski.com üzerinden tasarım dosyanızı iletmeniz, yelken bayrak baskı ölçü ve adedini belirtmeniz yeterli. Bidolubaskı’da yelken bayrak siparişlerinizi ücretsiz kargo ve kredi kartına 6 taksit avantajı ile teslim alabilirsiniz.\n\nYelken Bayrak Siparişi Vermeden Önce Dikkat Edilmesi Gerekenler\nİçerik seçimini doğru seçtiğinizden emin olunuz.\nYelken bayrak tasarımınızı baskı onayı vermeden mutlaka kontrol edin.\nYelken bayrak tasarımınızın etkili olması için çarpıcı görsel ve doğru sloganı tercih edin.\nYelken bayrak kurumsal kimliğinizin bir parçasıdır. Bu nedenle firma bilgilerinizin, logonuzun yer almasını sağlayın.        \nYelken bayrak üzerindeki yazıların imla kurallarına uygun bir şekilde yazıldığına emin olun.\nSipariş vereceğiniz ürün ölçünüz ile tasarım ölçünüzün aynı olmalı ve taşma payı verilmeli.\nVereceğiniz bayrak siparişinizde Türk bayrağı basılmasını istemeniz durumunda, talebinizi tasarım yükleme alanında grafikerimize not olarak iletmeniz, yeterlidir. Bayrak siparişiniz, Türk Bayrağı Kanunu'nda belirtilen şablona uygun şekilde, basılacaktır.\nDikkat: Bayrak ürünlerimizde kumaşa baskı yapıldığı için, kağıda baskı yapılan ürünlere ve ekranda görünen renklere göre %10-15 oranında ton farkı oluşabilir. Kurumsal renkleriniz için mutlaka Pantone renklerinizi belirtmenizi rica ederiz.	Yelken Bayrak	\N	Yelken Bayrak — profesyonel baskı.	yelken-bayrak-urun	100	2026-06-02 19:59:23.067285+00	\N	5e1630ff-a606-4e70-a6a3-a5ddd7827f25
204a4763-e4e6-46f7-a5cd-d51082ff28b2	f	\N	2026-06-02 09:52:14.645762+00	f	\N	Katlamalı Broşür	\N	Katlamalı Broşür — profesyonel baskı.	katlamali-brosur-urun	100	2026-06-02 14:36:21.934472+00	\N	b8d56b13-2748-44a6-899a-d173367b403d
720314fd-1abd-4c8a-a79a-592e5d6c8650	t	\N	2026-06-02 09:52:14.645762+00	f	Direğe çekmeye uygun kanca / plastik aparat\nYıkanabilir ve suya dayanıklı\nLogo baskısı net ve canlı renkli\nStandart üretim toleransları uygulanır	Gönder Bayrağı	\N	Gönder Bayrağı — profesyonel baskı.	gonder-bayragi-urun	100	2026-06-02 19:18:46.803736+00	\N	94198885-8d1c-4989-bb5e-baa72b272522
b9ad2e9e-c746-45b0-8d29-2f23bd5697c7	t	\N	2026-06-02 09:52:14.645762+00	f	Şirketlerin, davetlerin, organizaysonların vazgeçilmez ürünü Kurmaş Kırlangıç Bayraklar, kullanım ve saklama kolaylığı ile yüksek talep gören bir üründür.\n\nSiz de kumaş kırlangıç bayrak ile firmanızın tanıtımı yapmayı ihmal etmeyin!\n\nKırlangıç Bayrak Özellikleri\n\n440 gr. Avrupa Branda\nYüksek Kaliteli Dijital Baskı\nFarklı ebat seçenekleri\nAsılmaya Hazır	Kırlangıç Bayrak	\N	Kırlangıç Bayrak — profesyonel baskı.	kirlangic-bayrak-urun	100	2026-06-02 19:33:06.638891+00	\N	41b8301e-26b2-4f11-9565-4d189c9e48e5
5c1c1bdc-91f1-4ddf-96b6-a3886c37e73c	f	\N	2026-06-02 09:52:14.645762+00	f	\N	Display	\N	Display — profesyonel baskı.	display	100	2026-06-03 08:28:08.251658+00	\N	c425677e-d5b9-40f3-8287-9b69c180ae63
fbabc552-7ac1-4d48-8f05-8dbd9841a931	f	\N	2026-06-02 09:52:14.645762+00	f	\N	Stand	\N	Stand — profesyonel baskı.	stand	100	2026-06-03 08:28:12.257515+00	\N	b5523675-7142-47c5-a2f0-3de89eb83f4b
763507aa-9d97-4d28-9065-385e68b9fe13	f	\N	2026-06-02 09:52:14.645762+00	f	\N	Çanta	\N	Çanta — profesyonel baskı.	canta	100	2026-06-03 08:41:04.26542+00	\N	c7384df9-6976-47f1-bc46-2c11a8c2f3be
b69f701e-9fa2-437a-8db4-8d123f76bf94	t	\N	2026-06-02 10:51:57.143448+00	f	Kartvizit olarak kullanılan ve bir nevi kimlik belgesi olarak da adlandırabilecek tanıtım araçları matbaalarda basılan ürünlerdir. Bu tür tanıtım araçları kişilerin ticari faaliyetlerle meşgul olması durumunda onlara kurumsallık kazandırır. İşletmenin kartvizite sahip olması ise onun açısından marka imajı yaratmaya yarar.\n\nDetaylı bilgi için: https://www.basyolla.com/kartvizit-nedir-neden-onemlidir/\n\nFirmanın marka kimliğine ihtiyaç duyması sebebi ile çeşitli reklam araçları ile bu durum sağlanır. Marka kimliği oluşturulurken kullanılan ürünler arasında marka logosu, firma ismi ya da kartvizit gibi malzemeler kullanılabilir.\n\nBundan dolayı da kartvizit firmayı müşterilerine tanıtan, işletmenin hedef kitlesi ya da potansiyel müşterileri ile arasında bağ kuran bir malzemedir. Kartvizit üzerinde kişi ya da işletmenin kimlik ve iletişim bilgileri bulunur. Bundan dolayı da bir nevi kimlik belgesi olarak kabul edilir.	Ekspres Kartvizit	\N	Aynı/sonraki gün teslim kartvizit.	ekspres-kartvizit	8	2026-06-02 12:48:00.377431+00	\N	708668f4-698b-417b-97bf-0102423f593c
2f926ce2-242c-495d-983d-2c34a4e5e60d	t	\N	2026-06-02 09:52:14.645762+00	f	Broşür, kırımlar sayesinde birden fazla sayfadan oluşan yüksek baskı tekniği ile üretilen reklam tanıtım aracıdır. Firma hakkında bilgi vermenin yanı sıra ürün ve hizmetler hakkında da detaylı bilgi vermek isteyen firmaların ve işletmelerin kullanmayı tercih ettikleri broşür baskı ürünü, en çok kullanılan baskı ürünleri arasında yer almaktadır. Bu ürün de el ilanı gibi sokaklarda, ofislerde, mağazalarda, dükkanlarda, işletmelerde, fuarlarda ve aklınıza gelen pek çok yerde sıklıkla kullanılabilir.\n\nBroşürlerde el ilanında farklı olarak belirleyici bir değişken daha bulunur; kırım çeşidi. Broşürler boyutuna da bağlı olmak üzere Tek Kırım, iki Kırım ve İçe Kırım gibi kırım çeşitlerine sahiptir. Bu da tasarımsal olarak içerisinde daha farklı ve fazla bilgiye yer vermenize imkân tanır. Yine burada kullanılacak olan kâğıdın gramajı, firmanızın müşterilerin gözünde yaratacağı algıda önemli bir rol oynar. Bu nedenle de yapacağınız gramaj çeşitlerinde kullanım alanını ve yaratmak isteyeceğiniz algıyı göz önünde bulundurmanızı tavsiye ederiz.\n\nBaskikapinda.com un müşteri memnuniyeti, uygun ve kaliteli hizmet anlayışı sayesinde sipariş edeceğiniz el ilanı ve broşürler için farklı ebat, adet, gramaj seçeneklerine sahipsiniz. El ilanı ve broşür tasarımınızı tamamladıktan sonra baskı için istediğiniz boyutu, adet ve kâğıt türünü seçmeniz ve site üzerinden tasarım dosyanızı iletmeniz siparişinizi oluşturmanız için yeterlidir.\n\nEğer hazır bir tasarımınız yoksa Türkiye’de bir, ilki Tasarımlarınız profesyonel grafik departmanımız tarafında ücretsiz olarak yapılmaktadır. El ilanı ve broşür fiyatları seçeceğiniz özelliklere göre değişiklik gösterir.\n\nEl ilanı ve Broşür bastırma aşamasına geçmeden önce tasarımınızı tekrar gözden geçirmeniz, hatta üçüncü kişilere göstererek fikir almanız, gözden kaçabilecek ufak hataları önceden fark etmenize ola	Kırımlı El İlanı	\N	Kırımlı El İlanı — profesyonel baskı.	kirimli-el-ilani	100	2026-06-02 14:25:53.450043+00	\N	fe9fef34-dbfa-4314-8f65-2c1359352c58
3c6b54cb-f751-40f9-a7c7-a7fa64713001	t	\N	2026-06-02 09:52:14.645762+00	f	El ilanları, tanıtım faaliyetleriniz için klasik ve vazgeçilmez bir pazarlama aracıdır. Bir kağıda sığdırdığınız ana mesajınızın elden ele dolaşmasına imkan sağlar. Fazla yer tutmaz, kolayca okunur böylece bir el ilanı ile birden fazla kişiye ulaşabilirsiniz. Bu açıdan bakıldığında, üzerindeki bilgilerin kolay tüketilebilir olması bir dezavantaj değil, tam tersine bir avantajdır.\n\nEkonomik El İlanı bidolubaski.com müşterilerine özel sunulan en uygun el ilanıdır. Tek yöne 4 renk CMYK ofset baskı yapılmaktadır. 2500 adetten 20000 adede kadar tek seferde sipariş verebilirsiniz. 90 gr. kuşe kağıt kullanılmaktadır. Daha kalın kağıt gramajları için El İlanı ürününü tercih edebilirsiniz.\n\nBidolubaski.com’un müşteri odaklı hizmet anlayışı sayesinde sipariş edeceğiniz ilanlar için farklı ebat seçeneklerine sahipsiniz. İlan tasarımınızı tamamladıktan sonra baskı için istediğiniz boyutu, adet ve kağıt türünü seçmeniz ve site üzerinden tasarım dosyanızı iletmeniz siparişinizi oluşturmanız için yeterlidir. El ilanı fiyatları seçeceğiniz bu özelliklere göre değişiklik gösterir.\n\nOnline el ilanı siparişi vermek, kurumunuz için hızlı ve pratik bir çözümdür. Sitedeki adımları izleyerek kolayca sipariş verebilirsiniz. Bidolubaskı’nın online matbaa alanındaki uzmanlığından faydalanın, ilanların pazarlama dünyasındaki gücünden hemen faydalanmaya başlayın.	Ekonomik El İlanı	\N	Ekonomik El İlanı — profesyonel baskı.	ekonomik-el-ilani	100	2026-06-02 14:42:42.90616+00	\N	edf39510-c96a-4075-97ab-9d29097a3553
bb54d991-8205-4970-b0a7-a49473e7a4d6	t	\N	2026-06-02 09:52:14.645762+00	f	Masa Bayrağı Baskı Hakkında\nMasa bayrakları özellikle; kamu kuruluşları, belediyeler, oteller, şirketler ve dernekler tarafından kullanılmaktadır. Masa bayraklarına genellikle logo bastırılır ve şirketler, dernekler, kuruluşlar çalışma masalarında, toplantı masalarında ya da fuar, tanıtım gibi etkinliklerde bayrakları kullanırlar. Yönetici masalarında da sıklıkla masa bayrakları bulunur, yöneticilerin önemli görüşmelerinde masa bayrakları kurumsallık göstergesi olur, aynı zamanda şirketlerin yer aldığı ya da çalıştığı ülkelerin bayrakları da bastırılarak kullanılır.\n\nMasa bayrağı için kullanılan standart ölçüler 15 x 22,5 ve 8x32 cm'dir. Malzeme olarak çift kat saten kumaş kullanılır ve genellikle çift taraflı baskı yapılır. Masa bayrağı direkleri isteğe göre; tekli, ikili, üçlü, dörtlü ya da beşli olarak yapılabilmektedir. Çift taraflı baskılarda baskının arka yüzeye yansımasını önlemek için, ekstra astar ile kumaş kalitesi artırılmıştır.\n\nSeçtiğiniz masa bayrağı takımına göre farklı tasarım yükleyebilirsiniz. Örneğin; 3'lü Takım sipariş etmeniz durumunda ön-arka aynı olacak şekilde 3 farklı tasarım yükleyebilirsiniz. Tüm adetlerde aynı 3 tasarımınız bulunmaktadır.\n\nOnline matbaa Bidolubaski.com'dan, baskılı masa bayrağı ve kırlangıç bayrak siparişi verebilirsiniz. İstemiş olduğunuz masa bayrağı baskı özelliklerini seçmeniz yeterlidir.\n\nMasa Bayrağı Siparişi Öncesi Dikkat Edilmesi Gerekenler\nMasa bayrağı fiyatları istemiş olduğunuz ürün özelliklerine göre değişkenlik gösterecektir. Bu nedenle, sipariş vermeden önce istediğiniz ürün özelliklerini doğru seçtiğinizden emin olun.\nMasa bayrağı tasarımında yer alacak logonuzu yüksek çözünürlüklü olarak kullanın.\nTasarım dosyanızı ai, psd ya da pdf olarak siteye yükleyin.\nBayrak ürünlerimizde kumaşa baskı yapıldığı için, kağıda baskı yapılan ürünlere ve ekranda görünen renklere göre %10-15 oranında ton farkı oluşabilir. Kurumsal renkleriniz için mutlaka Pantone renklerinizi belirtmenizi rica ederiz.\nİçerik seçimini doğru seçtiğinizden emin olunuz.\nVereceğiniz bayrak siparişinizde Türk bayrağı basılmasını istemeniz durumunda, talebinizi tasarım yükleme alanında grafikerimize not olarak iletmeniz, yeterlidir. Bayrak siparişiniz, Türk Bayrağı Kanunu'nda belirtilen şablona uygun şekilde, basılacaktır.\nNot: Lisans gerektiren tasarımlar, ör. spor kulüplerine ilişkin ürünler basılamamaktadır.	Masa Bayrağı	\N	Masa Bayrağı — profesyonel baskı.	masa-bayragi-urun	100	2026-06-02 19:49:20.060458+00	\N	8e970dec-7525-4def-9d67-5c2ec3e74614
dbeb2ecb-012f-43f5-a5dc-6523433db614	t	\N	2026-06-02 09:52:14.645762+00	f	Antetli Kağıt Baskı Hakkında\nAntetli kağıt, kurumsal imajınızı destekleyen en önemli araçlardan biridir. Sadece şirket dışı yazışmalarınızda değil, antetli kağıdı şirket içinde, departmanlar arası iletişimde de kullanabilir ve böylece çok daha resmi ve ciddi bir imaj çizmenize yardımcı olur.\n\nAntetli kağıt baskı, bir şirketin her zaman ihtiyaç duyduğu belgelerden biridir. Özel bir yazışma yaparken sıradan bir A4 kağıt kullanmak yerine, antetli kağıdı tercih etmeniz durumunda kurumsallığınızı en iyi şekilde yansıtmış olursunuz. Bunun yanında, firma çalışanlarınızın yazışmalarını da daha resmi bir şekilde gerçekleştirmelerini sağlar.\n\nBidolubaski.com, tüm kurumsal ofis ihtiyaçlarınızda yanınızdadır. Memnuniyet garantisi ile basılan antetli kağıtlarınız, resmi yazışmalarınıza uygun bir kalitede adresinize kadar ulaştırılır. Antetli kağıt baskı için 4 renk CMYK seçeneği ile online antetli kağıt siparişinizi oluşturabilirsiniz. A4 ve A5 kağıt ebatlarında hazırlanan antetli kağıtlarınız 80 gr, 1. Hamur kağıt ile hazırlanır. Antetli kağıt fiyatları ebat seçeneklerine göre değişiklik gösterir. Online matbaa hizmetimizden faydalanmak için baskıya hazır tasarım dosyanızı bize gönderin, Türkiye’nin neresinde olursa olun, birkaç gün içinde kapınızdan teslim alın.\n\nAntetli Kağıt Siparişi Öncesi Dikkat Edilmesi Gerekenler\nAntetli kağıt, firmanızın resmi yazışmalarda kullanacağı özel bir kağıttır. Bu yüzden, tasarımını oluştururken bu ciddiyeti yansıtmaya özen gösterin.\nAntetli kağıtta firma logonuz, adres ve diğer iletişim bilgilerinizin eksiksiz olması gerekmektedir. Baskıdan önce bu bilgileri tekrar gözden geçirmeniz, olası yanlışlıkların önüne geçmenizi sağlar.\nFirma logonuzu, sayfanın üst kısımda, sol veya sağa hizalı olarak kullanabilirsiniz.\nİletişim bilgilerinizi yazmak için en uygun alan sayfanın en alt kısmında bulunan bölümdür. Adres ve telefon gibi bilgileriniz bu kısımda yer almalıdır.	Antetli Kağıt	\N	Antetli Kağıt — profesyonel baskı.	antetli-kagit	100	2026-06-03 08:04:59.38936+00	\N	f6760942-5d2b-4d98-b934-7dc430984b0e
\.


--
-- Data for Name: coupons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.coupons (id, active, auto_issue_on_first_visit, auto_issue_on_order_amount, code, created_at, current_usage, description, discount_amount, discount_percent, end_date, gift_amount, max_usage, min_order_amount, name, per_user_limit, start_date, type, updated_at) FROM stdin;
60c48c9b-d742-4546-aeb3-81826d5673f4	t	t	\N	HOSGELDIN100	2026-05-27 20:00:40.549097	0	Yeni üyelere özel ₺100 indirim. Minimum 500 TL alışverişte geçerlidir.	100.00	\N	\N	\N	\N	500.00	Hoş Geldin Kuponu	1	\N	AMOUNT	2026-05-27 20:00:40.549097
f81936b5-8632-45d5-b78a-f95c9a6d2ee3	t	f	5000.00	HEDIYE1000	2026-05-27 20:00:40.557293	0	5000 TL ve üzeri alışverişlerinizde sonraki siparişinizde kullanabileceğiniz ₺1000 hediye kuponu.	\N	\N	\N	1000.00	\N	1000.00	5000 TL ve Üzeri Hediye	1	\N	GIFT	2026-05-27 20:00:40.557293
f5613149-8fd7-453b-8482-a63643ea409d	t	f	\N	INDIRIM10	2026-05-27 20:00:40.561437	0	Tüm ürünlerde %10 indirim. Minimum 300 TL.	\N	10.00	\N	\N	100	300.00	%10 İndirim	1	\N	PERCENT	2026-05-27 20:00:40.561437
\.


--
-- Data for Name: dealers; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.dealers (id, address, city, company_name, created_at, credit_limit, discount_rate, district, notes, phone, rejection_reason, status, tax_number, tax_office, updated_at, user_id, business_type, estimated_monthly_revenue, note, website) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.files (id, original_name, page_count, s3key, status, uploaded_at, order_item_id) FROM stdin;
\.


--
-- Data for Name: hero_slides; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.hero_slides (id, active, background_color, created_at, cta_link, cta_text, description, ends_at, image_url, label, layout, mobile_image_url, sort_order, starts_at, title, updated_at) FROM stdin;
1775b562-9b8b-4c5d-bbbc-60c8c8d10445	f	#fef3c7	2026-05-26 17:47:15.30608+00	/urun/standart-kartvizit	İncele	1000 adet sadece 850 TL	\N	http://localhost:8080/uploads/hero/ffd4ebc8-48c4-433c-b67a-dbb05e711578.png	%50 İNDİRİM	IMAGE_ONLY	\N	0	\N	Standart Kartvizit	2026-06-01 12:01:22.044411+00
d51eee94-6e2b-4197-9efc-5bb2a74665be	t	#fef3c7	2026-05-29 17:56:42.837937+00	/urunler	Promosyon	\N	\N	http://localhost:8080/uploads/hero/5d62147a-1425-4838-be30-5303d76d36a7.png	\N	IMAGE_ONLY	\N	0	\N	genel	2026-06-01 12:01:28.956615+00
b069c7b2-ee61-4b20-b51c-c52d32be1cff	t	#ccfbf1	2026-05-29 18:43:54.58223+00	/katalog/kartvizit	\N	\N	\N	http://localhost:8080/uploads/hero/de93d682-a8d3-427f-ab69-d5e217d909da.png	\N	IMAGE_ONLY	\N	0	\N	kartvizit	2026-06-01 12:01:34.75395+00
b44c4142-a4ce-4277-99f2-3a91eb6a0643	t	#fef3c7	2026-05-29 18:58:41.288167+00	/katalog/promosyon-urunleri	\N	\N	\N	http://localhost:8080/uploads/hero/08d7a933-69db-4eb4-a310-314c3a368afb.png	\N	IMAGE_ONLY	\N	0	\N	promosyon	2026-06-01 12:01:43.125527+00
8da5a778-ebce-4820-b16e-588bad6822a2	t	#fef3c7	2026-05-30 20:58:37.765926+00	/dijital-baski-urunleri	\N	\N	\N	http://localhost:8080/uploads/hero/de424d81-811f-4d0f-94f3-299792487c59.png	\N	IMAGE_ONLY	\N	0	\N	vinil	2026-06-01 12:01:57.856974+00
14461727-519a-4866-bb2c-366bd5038e22	t	#fef3c7	2026-05-30 06:55:40.771971+00	/urun/yelken-bayrak	İncele	\N	\N	http://localhost:8080/uploads/hero/ed4c55b3-ba6e-4f3f-860f-424f491fc557.png	\N	IMAGE_ONLY	http://localhost:8080/uploads/hero/5307ce24-9c12-486c-981b-d9af93bb4ac9.png	0	\N	yelkenbayrak	2026-06-01 12:02:53.096371+00
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.notifications (id, channel, recipient, sent_at, status, order_id) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_items (id, height_cm, product_type, quantity, unit_price, width_cm, order_id) FROM stdin;
f2ec50bd-d25f-4147-9ab6-b972d025caa3	50	buyuk-format-vinil	2	92.50	100	dce85c16-a4ac-49fc-acf5-f98f7fbc5728
6bc803ee-7870-48a7-9975-fe97674c8cd5	50	buyuk-format-vinil	2	92.50	100	587073ca-a60c-40f3-bcdd-30766735e7e6
078d2583-474a-43c5-8acf-9f90dd456486	50	buyuk-format-vinil	2	92.50	100	4e653d18-8ba6-4b37-9873-1b81eb949ef6
cbae5de6-199a-4830-a1ff-caf8231e2521	7	buyuk-format-branda	2	12.00	3	a5e07398-0077-4d49-824a-55ea5a1549a8
a1eb3e47-eb81-4fdc-91c7-1e041dead925	500	buyuk-format-vinil-baski	1000	1850.00	200	a5e07398-0077-4d49-824a-55ea5a1549a8
236a8e71-6a91-425a-8821-8ed6dbeb3dee	2	tabela-forex	1	12.00	11	a5e07398-0077-4d49-824a-55ea5a1549a8
d5018df6-1407-4222-8534-59cc42b7af36	\N	promosyon-kupa	1	45.00	\N	fb7865fe-e21d-41ca-8451-c10d6238cfbf
387587ce-7ca8-45a2-a08b-654cc45d399d	\N	promosyon-bez-canta	1	35.00	\N	d3196c34-9c84-4a4b-8065-21848e2b52bc
61ed8286-1fc4-4b50-9003-4bf15745ab8e	2	tabela-forex	1	12.00	3	d3196c34-9c84-4a4b-8065-21848e2b52bc
c859ed65-106e-47bf-b946-79f6408290bf	\N	promosyon-kupa	1	45.00	\N	e4535a7e-8465-4dde-aa57-1f9eda22bebe
9dde983c-c617-4b4b-8ea5-4ec143ee1d18	\N	promosyon-kupa	1	45.00	\N	e4535a7e-8465-4dde-aa57-1f9eda22bebe
5fbc96db-e870-455f-8aae-3e290763ad70	\N	promosyon-bez-canta	1	35.00	\N	e4535a7e-8465-4dde-aa57-1f9eda22bebe
5d0d2f33-fe40-4a32-a5c4-589b0d15795a	\N	promosyon-bez-canta	1	35.00	\N	e4535a7e-8465-4dde-aa57-1f9eda22bebe
e4ae3c82-f883-4392-87e4-a7e46e01ea83	50	tabela-forex	1	12.00	10	eceafd77-0170-4228-9149-0c8b35e0d03f
ef9e4f4d-c90e-4a11-951d-0080d549f552	50	tabela-forex	1	12.00	10	eceafd77-0170-4228-9149-0c8b35e0d03f
89336644-fe96-4dce-9883-d587b9601d87	\N	promosyon-kupa	1	45.00	\N	77678308-3be1-40de-8336-3ba2e1ff70ff
d2e01ebf-6289-48e0-a354-0937aad96675	\N	promosyon-kupa	1	45.00	\N	77678308-3be1-40de-8336-3ba2e1ff70ff
e557208a-4b83-4a6a-9ff6-a8847a24954f	\N	promosyon-kupa	1	45.00	\N	9be267fd-8fbe-4506-bc3f-d988f3bb579f
321e340e-538b-4ca2-92b5-bb10ad162362	\N	promosyon-kupa	1	45.00	\N	9be267fd-8fbe-4506-bc3f-d988f3bb579f
469da0f1-9bf7-4820-bb25-e503b1647b41	50	tabela-forex	1	60.00	100	0fe95dc1-3a1b-4c72-9730-5231e9e1e44c
887b1418-4a1d-474c-aa53-29c1f2cee13b	50	tabela-forex	1	60.00	100	0fe95dc1-3a1b-4c72-9730-5231e9e1e44c
dec90b83-593a-4306-a6ea-8547f943e570	\N	promosyon-kupa	1	45.00	\N	c7f68167-a2c7-4b77-8431-f8c1a9cb2dbf
e9cf3216-2cb0-4382-a735-781af643fb29	\N	promosyon-kupa	1	45.00	\N	c7f68167-a2c7-4b77-8431-f8c1a9cb2dbf
0a6d59aa-bb77-4c71-94a5-086839cbcd72	\N	promosyon-kupa	1	45.00	\N	d3d5c2e7-629f-4c84-ab7f-82380694c86e
14a516b6-b952-4e91-af85-bc151cec9a34	\N	promosyon-kupa	1	45.00	\N	d3d5c2e7-629f-4c84-ab7f-82380694c86e
f711b0c5-f393-431d-9ee5-618a8c3349b3	100	buyuk-format-vinil-baski	1	72.00	50	0f0cb41f-a87d-464b-becf-54b8cda80ffa
1f71508a-6c2c-4820-80c5-e08dbf6e4c51	100	buyuk-format-vinil-baski	1	72.00	50	0f0cb41f-a87d-464b-becf-54b8cda80ffa
\.


--
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.order_status_history (id, created_at, note, status, order_id) FROM stdin;
f841eb89-ed68-4677-9907-9550fea9e797	2026-05-19 17:42:16.955591	Sipariş onaylandı, incelemeye alındı	REVIEWING	4e653d18-8ba6-4b37-9873-1b81eb949ef6
38db518b-9902-47d2-8ef1-70671b71e7e2	2026-05-19 17:42:23.608809	Sipariş onaylandı, incelemeye alındı	REVIEWING	4e653d18-8ba6-4b37-9873-1b81eb949ef6
93cae277-20ce-484b-a32d-a0f47ddcac1c	2026-05-20 08:43:23.508605	Baskıya gönderildi	PRINTING	4e653d18-8ba6-4b37-9873-1b81eb949ef6
d9c41e68-e12d-493f-a6ac-4c3e8bdcc751	2026-05-20 08:43:35.849309	Kargoya verildi	SHIPPED	4e653d18-8ba6-4b37-9873-1b81eb949ef6
5bdacfc1-2120-4def-a2e5-321d082ebaba	2026-05-20 08:43:38.02388	Sipariş tamamlandı	COMPLETED	4e653d18-8ba6-4b37-9873-1b81eb949ef6
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.orders (id, created_at, declared_prints, pdf_page_count, shipping_address, status, total_price, user_id) FROM stdin;
dce85c16-a4ac-49fc-acf5-f98f7fbc5728	2026-05-19 15:10:11.279266	1	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	185.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
587073ca-a60c-40f3-bcdd-30766735e7e6	2026-05-19 15:46:28.867238	1	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	185.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
4e653d18-8ba6-4b37-9873-1b81eb949ef6	2026-05-19 17:11:29.376051	1	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	COMPLETED	185.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
a5e07398-0077-4d49-824a-55ea5a1549a8	2026-05-21 18:04:24.567384	5	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	1850036.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
fb7865fe-e21d-41ca-8451-c10d6238cfbf	2026-05-21 18:04:36.767846	1	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	45.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
d3196c34-9c84-4a4b-8065-21848e2b52bc	2026-05-21 18:05:14.392022	2	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	47.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
e4535a7e-8465-4dde-aa57-1f9eda22bebe	2026-05-22 08:41:59.666643	4	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	160.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
eceafd77-0170-4228-9149-0c8b35e0d03f	2026-05-22 08:42:25.080261	2	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	24.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
77678308-3be1-40de-8336-3ba2e1ff70ff	2026-05-22 08:50:46.18578	2	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	90.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
9be267fd-8fbe-4506-bc3f-d988f3bb579f	2026-05-22 08:51:13.195915	2	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	90.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
0fe95dc1-3a1b-4c72-9730-5231e9e1e44c	2026-05-22 10:04:30.337683	2	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	120.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
c7f68167-a2c7-4b77-8431-f8c1a9cb2dbf	2026-05-22 10:43:43.797407	2	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	90.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
d3d5c2e7-629f-4c84-ab7f-82380694c86e	2026-05-22 10:52:42.48916	2	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	90.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
0f0cb41f-a87d-464b-becf-54b8cda80ffa	2026-05-22 15:51:35.991737	2	0	Admin Test, Ataturk Cad. No:1 Kadikoy/Istanbul Türkiye	PENDING	144.00	c2a9af4c-0956-4e71-bde1-f8a8f9258586
\.


--
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.payments (id, amount, paid_at, provider, provider_ref, status, order_id) FROM stdin;
d3cd95e2-7b85-446b-ae5e-da9699ea8db0	185.00	\N	iyzico	\N	PENDING	dce85c16-a4ac-49fc-acf5-f98f7fbc5728
875b41d3-c018-4549-a665-c5c13ce0f88d	185.00	\N	iyzico	\N	PENDING	587073ca-a60c-40f3-bcdd-30766735e7e6
e7edb928-6fc9-4815-9f5c-532d9f2a91ad	185.00	\N	iyzico	\N	PENDING	4e653d18-8ba6-4b37-9873-1b81eb949ef6
6f80cc49-8249-49a3-857e-64d5da8da3ac	1850036.00	\N	iyzico	\N	PENDING	a5e07398-0077-4d49-824a-55ea5a1549a8
9256dcbd-f14c-43ae-85aa-9c9fa4d86066	45.00	\N	iyzico	\N	PENDING	fb7865fe-e21d-41ca-8451-c10d6238cfbf
26c4fa5d-3757-4917-9e42-901d3664c13d	47.00	\N	iyzico	\N	PENDING	d3196c34-9c84-4a4b-8065-21848e2b52bc
29038148-bf9c-4437-b1d5-45c794b32ff3	160.00	\N	iyzico	\N	PENDING	e4535a7e-8465-4dde-aa57-1f9eda22bebe
5166af3b-38e2-43dd-aeb1-797ca880c798	24.00	\N	iyzico	\N	PENDING	eceafd77-0170-4228-9149-0c8b35e0d03f
0040d8c1-8ddf-4cc7-be86-a63d64ae8d21	90.00	\N	iyzico	\N	PENDING	77678308-3be1-40de-8336-3ba2e1ff70ff
c3c69d7e-b79a-4c6c-8c87-b82f12f36a28	90.00	\N	iyzico	\N	PENDING	9be267fd-8fbe-4506-bc3f-d988f3bb579f
9b7aa288-63a3-49bb-bc2a-85874e304637	120.00	\N	iyzico	\N	PENDING	0fe95dc1-3a1b-4c72-9730-5231e9e1e44c
964cbc09-cf8a-4a61-8f2b-004a9525f3ad	90.00	\N	iyzico	\N	PENDING	c7f68167-a2c7-4b77-8431-f8c1a9cb2dbf
f5df4d6c-4815-4c2a-adf0-1c621e3ab64e	90.00	\N	iyzico	\N	PENDING	d3d5c2e7-629f-4c84-ab7f-82380694c86e
09bd0f08-85ab-4ee9-8f8f-e9d348692a7b	144.00	\N	iyzico	\N	PENDING	0f0cb41f-a87d-464b-becf-54b8cda80ffa
\.


--
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.permissions (id, category, code, label) FROM stdin;
040bef77-2083-441c-ad91-fb64b77e4e7d	Sipariş	siparis.goruntule	Siparişleri görüntüle
28d04e70-735b-4efa-a446-bcfed87f4d02	Sipariş	siparis.durum_guncelle	Sipariş durumu güncelle
b106de7b-69e4-458e-b173-706b7f200133	Sipariş	siparis.onayla	Sipariş onayla
4dcca2db-d2dd-4577-895c-2e7ba95a5fd5	Sipariş	siparis.reddet	Sipariş reddet
180988c6-db2a-4f97-b599-85125bdac6d0	Sipariş	siparis.baskiya_gonder	Baskıya gönder
abdbb250-1083-4eea-80a4-a7e351e83694	Sipariş	siparis.kargola	Kargoya ver
acb4b4d6-96ce-418a-8cee-cd53fd897797	Sipariş	siparis.tamamla	Siparişi tamamla
36392c6c-4235-406a-ba8d-48c638898cc9	Ödeme	odeme.goruntule	Ödemeleri görüntüle
27173064-4934-4ca3-8f37-4a6d383f93c0	Ödeme	odeme.rapor	Ödeme raporu al
efb04aea-4485-41c4-8c77-00ca852d0003	Ödeme	odeme.iade	İade işlemi yap
e1c7a7a3-f0e3-4047-a320-6f1b1a9576e9	Ürün	urun.goruntule	Ürünleri görüntüle
41708101-425f-4b6e-9260-7a6e484a0f56	Ürün	urun.duzenle	Ürün ekle/düzenle
6ed43423-604c-488c-ba97-db5fba5f1a9c	Ürün	urun.sil	Ürün sil/pasif yap
a8cde1c3-2788-4ef4-aab5-c43bf0be2ddb	Ürün	urun.fiyat_guncelle	Fiyat güncelle
ef8f9d9e-ce11-464a-9215-f72417afc910	Ürün	urun.import	Excel ile toplu yükle
f98acd04-729a-41b8-82b3-10ce8afc41a5	Kullanıcı	kullanici.goruntule	Kullanıcıları görüntüle
5c4a50c4-f610-498c-a367-5258d41af6a6	Kullanıcı	kullanici.duzenle	Kullanıcı düzenle
ae87eeeb-9b2b-4679-bd2a-4d728d81344f	Kullanıcı	kullanici.rol_ver	Kullanıcıya rol ata
b94af777-a8c1-4b62-8f6a-b49dd8cf18c7	Rapor	rapor.ciro	Ciro raporunu gör
6305a29f-1ae4-4ee4-b796-98cad99b6561	Rapor	rapor.gunluk	Günlük rapor
23142978-26c4-436a-ad95-ea09d5309e44	Rapor	rapor.musteri	Müşteri raporu
a147dc71-1bd8-4d9e-8537-595467242d30	Referans	referans.yonet	Referans ekle/düzenle/sil
\.


--
-- Data for Name: pre_order_files; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.pre_order_files (id, claimed_at, claimed_by_order_id, created_at, file_size, mime_type, original_name, stored_path) FROM stdin;
5f1e1e89-dfd3-4feb-b03f-7cecd274c850	2026-05-29 18:09:09.730214+00	66a435be-4bd3-4839-850f-d89a788ceecb	2026-05-29 18:08:11.557444+00	2888	application/pdf	Multibus_Fiyat_Teklifi.pdf	C:\\ard\\ard-backend\\uploads\\design\\5f1e1e89-dfd3-4feb-b03f-7cecd274c850.pdf
a56de09d-e716-499b-9c59-5206663c5c9b	2026-05-29 18:10:40.994882+00	da27f6ec-5486-4d30-b600-2a6cd635a86a	2026-05-29 18:10:03.74666+00	1189949	application/pdf	MLŞ-185 DIAFONBOX_Kullanım Kılavuzu (2).pdf	C:\\ard\\ard-backend\\uploads\\design\\a56de09d-e716-499b-9c59-5206663c5c9b.pdf
1a063eb0-bfa3-4083-95f7-dab66b12ff12	2026-05-29 18:11:53.35274+00	6feabc04-13d7-4cd0-b754-21319ce35db2	2026-05-29 18:11:31.839797+00	2540043	image/png	0d704fef-fbf9-41f9-b68f-dcf82dcf3bca.png	C:\\ard\\ard-backend\\uploads\\design\\1a063eb0-bfa3-4083-95f7-dab66b12ff12.png
73ab8294-de1e-4d7f-a3aa-0d49352ed8d5	2026-05-29 18:32:34.741564+00	478370d2-e437-447c-aa62-d0c91ff6cc62	2026-05-29 18:32:11.781119+00	306213	image/jpeg	2023_07_web-offset-printing-machine.jpg	C:\\ard\\ard-backend\\uploads\\design\\73ab8294-de1e-4d7f-a3aa-0d49352ed8d5.jpg
28212ddc-2e43-46b1-946c-09585e99a98f	2026-05-29 18:33:56.787515+00	38115a26-f74d-4ead-80d5-af68160b78d6	2026-05-29 18:33:13.924478+00	2097651	image/png	ChatGPT Image 26 May 2026 16_57_36.png	C:\\ard\\ard-backend\\uploads\\design\\28212ddc-2e43-46b1-946c-09585e99a98f.png
b7ca1892-1863-4be3-9b50-09eb2733079a	\N	\N	2026-05-29 18:52:51.704441+00	2708329	image/png	0ee81ec9-e95b-4143-b02a-f81b780218ed.png	C:\\ard\\ard-backend\\uploads\\design\\b7ca1892-1863-4be3-9b50-09eb2733079a.png
7c4846a2-a069-4204-81bb-11bae2379656	2026-05-29 19:19:59.255939+00	a051da28-bbe5-4368-bfd8-045d88fba3c7	2026-05-29 18:34:28.618075+00	2097651	image/png	ChatGPT Image 26 May 2026 16_57_36.png	C:\\ard\\ard-backend\\uploads\\design\\7c4846a2-a069-4204-81bb-11bae2379656.png
93f08652-05c5-417a-a138-2a81ba40f797	2026-05-29 19:19:59.255939+00	a051da28-bbe5-4368-bfd8-045d88fba3c7	2026-05-29 19:01:08.071699+00	1947107	image/png	ChatGPT Image 29 May 2026 21_55_49.png	C:\\ard\\ard-backend\\uploads\\design\\93f08652-05c5-417a-a138-2a81ba40f797.png
5b0fb296-41b5-4aaf-920e-4d8f1440c9a9	2026-05-29 19:19:59.255939+00	a051da28-bbe5-4368-bfd8-045d88fba3c7	2026-05-29 19:19:45.039471+00	1749820	image/png	baskiurunleri-showcase.png	C:\\ard\\ard-backend\\uploads\\design\\5b0fb296-41b5-4aaf-920e-4d8f1440c9a9.png
98fd4651-1256-4504-9aab-a6c0f19d87db	\N	\N	2026-06-02 05:58:26.0649+00	69020	application/pdf	PDKS_Azure_Gecis_Rehberi.pdf	C:\\ard\\ard-backend\\uploads\\design\\98fd4651-1256-4504-9aab-a6c0f19d87db.pdf
99b8e626-f5ff-4766-bae9-a0d8de4bab3c	\N	\N	2026-06-02 06:01:48.974117+00	1100312	application/pdf	Adsız tasarım.pdf	C:\\ard\\ard-backend\\uploads\\design\\99b8e626-f5ff-4766-bae9-a0d8de4bab3c.pdf
7b5d5985-a875-4d46-aa1b-9339398c18f4	2026-06-02 06:03:26.520156+00	ff9a8746-42b9-4692-a760-ee19e39d87a5	2026-06-02 06:03:06.257345+00	754937	application/pdf	Beyaz ve Mavi Sade Pilates Eğitimi Instagram Gönderisi (1).pdf	C:\\ard\\ard-backend\\uploads\\design\\7b5d5985-a875-4d46-aa1b-9339398c18f4.pdf
\.


--
-- Data for Name: price_rules; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.price_rules (id, base_price, max_qty, min_qty, multiplier, option_key, option_value, price_delta, rule_type, unit_price, product_type_id) FROM stdin;
4eae9a02-c02c-4187-a4cc-0f10d8c06ca5	100.00	\N	1	\N	\N	\N	\N	AREA_BASED	\N	7b4a1463-b298-4e8e-8fc5-03b5ff2bfa6b
e1aea76b-9cae-444c-b980-040eb516fa70	3.20	\N	1	\N	\N	\N	\N	AREA_BASED	\N	0dc9ff09-3a78-4ddc-abb2-8bdc1bafe58e
f9bace09-4e52-4de4-af57-67c9456fb4cf	3.50	\N	1	\N	\N	\N	\N	AREA_BASED	\N	761fbdcb-563a-4738-9218-02b4a97a18bb
\.


--
-- Data for Name: product_configs; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_configs (id, affects_price, display_order, field_key, field_type, options, required, product_type_id) FROM stdin;
\.


--
-- Data for Name: product_types; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.product_types (id, description, has_file, is_active, min_order, name, pricing_model, slug, unit, image_url, badge, featured, original_price) FROM stdin;
7b4a1463-b298-4e8e-8fc5-03b5ff2bfa6b	asdas	t	t	1	fsdfsdf	AREA_BASED	buyuk-format-fsdfsdfds	m2	https://artemizreklam.com/wp-content/uploads/2021/03/vinil-baski-600x450.jpg	YENİ	t	125.00
0dc9ff09-3a78-4ddc-abb2-8bdc1bafe58e	Super Vinil Baskı	t	t	1	Vinil Baskı	AREA_BASED	buyuk-format-vinil-baski	m2	https://www.poshreklam.com/wp-content/uploads/2025/07/posh-reklam-vinil-baski-banner.webp		t	0.00
761fbdcb-563a-4738-9218-02b4a97a18bb	FOLYO BASKI	t	t	1	Folyo Baskı	AREA_BASED	buyuk-format-folyo-baski	m2	https://www.dinamiktanitim.com/image/cache/catalog/dijital-baski/1-Sinif-Dijital-Baski-Makineleri-450x450-500x515.jpg	YENİ	t	0.00
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.system_settings (key, description, value) FROM stdin;
\.


--
-- Data for Name: user_app_roles; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_app_roles (id, assigned_at, assigned_by, app_role_id, user_id) FROM stdin;
02315e54-d123-45e9-997d-1ebac3c8ba4a	2026-05-20 10:43:08.239564	admin@baski.com	e5a63db2-3c9d-4e08-afc9-2ab7fb67e3e0	c2a9af4c-0956-4e71-bde1-f8a8f9258586
93503184-b52b-4a72-85e9-af5a786d01f4	2026-05-20 10:43:19.328474	admin@baski.com	ab86f054-f176-43a3-a233-69d2897928cd	c2a9af4c-0956-4e71-bde1-f8a8f9258586
8f8e5202-ff04-4bd1-b9ac-45e7ead067cd	2026-05-20 14:32:10.524221	admin@baski.com	fa0e64d1-cbc8-4abf-a283-c824a1f5b5ef	8a4ac4fd-f4dd-4032-83b2-72ffe913377f
\.


--
-- Data for Name: user_coupons; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.user_coupons (id, created_at, expires_at, issued_at, order_id, source, used, used_at, user_id, coupon_id) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: -
--

COPY public.users (id, created_at, email, name, password, phone, role, email_verified, google_id) FROM stdin;
7b8a427a-cf5b-400a-868a-c62c6fb30c99	2026-05-19 21:39:29.80454	ilbarsseckin@gmail.com	seçkin ilbars	$2a$10$/Q5bOasIpH.EClgOd2bCqeTKpVMSUBYxuTAHBqDg/o4Cuqytv2AwW	05530214776	CUSTOMER	\N	\N
c2a9af4c-0956-4e71-bde1-f8a8f9258586	2026-05-19 13:26:58.825019	admin@baski.com	Admin	$2a$10$/cJFoXPHcLcQV46xRpDUxu6Qs8vuAPjcrnKtPOUJyYfZ.N5TvP3rS	05001234567	ADMIN	\N	\N
d524f0ed-f101-4a09-ada5-033b7dc062e1	2026-05-20 11:02:18.472145	arif@gmail.com	arif	$2a$10$.EytYLqld6foWFMGDx5kyuuAHViqg9xTZuumGuKAEuJ3sTxrqAXcu		OPERATOR	\N	\N
8a4ac4fd-f4dd-4032-83b2-72ffe913377f	2026-05-20 10:59:18.839038	ayse@gmail.com	ayse	$2a$10$KkpDk95eXLAStVP2TkjCF./ikuD4jTDiw3EKtpB.rlygC.NAgLwC6		OPERATOR	\N	\N
b9b78f85-d48a-45ee-9db8-9b39781bde32	2026-05-29 21:54:39.94968	test@gmail.com	test	$2a$10$uW5ld8pBt4Z1X0OFowMfkOrJ5XcqyOXNB6V/aE4CAXLPc82q5fTSq	05530214776	CUSTOMER	f	\N
\.


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: app_role_permissions app_role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT app_role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: app_roles app_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_roles
    ADD CONSTRAINT app_roles_pkey PRIMARY KEY (id);


--
-- Name: brand_references brand_references_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.brand_references
    ADD CONSTRAINT brand_references_pkey PRIMARY KEY (id);


--
-- Name: campaigns campaigns_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.campaigns
    ADD CONSTRAINT campaigns_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: catalog_attribute_options catalog_attribute_options_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_attribute_options
    ADD CONSTRAINT catalog_attribute_options_pkey PRIMARY KEY (id);


--
-- Name: catalog_attributes catalog_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_attributes
    ADD CONSTRAINT catalog_attributes_pkey PRIMARY KEY (id);


--
-- Name: catalog_brands catalog_brands_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT catalog_brands_pkey PRIMARY KEY (id);


--
-- Name: catalog_categories catalog_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_categories
    ADD CONSTRAINT catalog_categories_pkey PRIMARY KEY (id);


--
-- Name: catalog_order_files catalog_order_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_order_files
    ADD CONSTRAINT catalog_order_files_pkey PRIMARY KEY (id);


--
-- Name: catalog_order_items catalog_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_order_items
    ADD CONSTRAINT catalog_order_items_pkey PRIMARY KEY (id);


--
-- Name: catalog_orders catalog_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_orders
    ADD CONSTRAINT catalog_orders_pkey PRIMARY KEY (id);


--
-- Name: catalog_product_attribute_values catalog_product_attribute_values_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_product_attribute_values
    ADD CONSTRAINT catalog_product_attribute_values_pkey PRIMARY KEY (id);


--
-- Name: catalog_product_images catalog_product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_product_images
    ADD CONSTRAINT catalog_product_images_pkey PRIMARY KEY (id);


--
-- Name: catalog_product_reviews catalog_product_reviews_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_product_reviews
    ADD CONSTRAINT catalog_product_reviews_pkey PRIMARY KEY (id);


--
-- Name: catalog_product_tiers catalog_product_tiers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_product_tiers
    ADD CONSTRAINT catalog_product_tiers_pkey PRIMARY KEY (id);


--
-- Name: catalog_products catalog_products_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_pkey PRIMARY KEY (id);


--
-- Name: coupons coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT coupons_pkey PRIMARY KEY (id);


--
-- Name: dealers dealers_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: hero_slides hero_slides_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.hero_slides
    ADD CONSTRAINT hero_slides_pkey PRIMARY KEY (id);


--
-- Name: catalog_brands idx_cat_brand_slug; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT idx_cat_brand_slug UNIQUE (slug);


--
-- Name: catalog_categories idx_cat_cat_slug; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_categories
    ADD CONSTRAINT idx_cat_cat_slug UNIQUE (slug);


--
-- Name: catalog_products idx_cat_prod_slug; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT idx_cat_prod_slug UNIQUE (slug);


--
-- Name: catalog_orders idx_catorder_number; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_orders
    ADD CONSTRAINT idx_catorder_number UNIQUE (order_number);


--
-- Name: coupons idx_coupon_code; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.coupons
    ADD CONSTRAINT idx_coupon_code UNIQUE (code);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: pre_order_files pre_order_files_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.pre_order_files
    ADD CONSTRAINT pre_order_files_pkey PRIMARY KEY (id);


--
-- Name: price_rules price_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_rules
    ADD CONSTRAINT price_rules_pkey PRIMARY KEY (id);


--
-- Name: product_configs product_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_configs
    ADD CONSTRAINT product_configs_pkey PRIMARY KEY (id);


--
-- Name: product_types product_types_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_types
    ADD CONSTRAINT product_types_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (key);


--
-- Name: dealers uk10jndvam70sjubvckk4l6cvxr; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT uk10jndvam70sjubvckk4l6cvxr UNIQUE (user_id);


--
-- Name: files uk2bsy7ojkfd5129barybedxjrd; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT uk2bsy7ojkfd5129barybedxjrd UNIQUE (order_item_id);


--
-- Name: dealers uk40654vo0wa4g02l8ltqpayvs0; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT uk40654vo0wa4g02l8ltqpayvs0 UNIQUE (tax_number);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: permissions uk7lcb6glmvwlro3p2w2cewxtvd; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT uk7lcb6glmvwlro3p2w2cewxtvd UNIQUE (code);


--
-- Name: product_types uk9abi23631rfwuaml6m9a0pjok; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_types
    ADD CONSTRAINT uk9abi23631rfwuaml6m9a0pjok UNIQUE (slug);


--
-- Name: app_roles ukfvrw9klein793jl7h2qug4a5t; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_roles
    ADD CONSTRAINT ukfvrw9klein793jl7h2qug4a5t UNIQUE (name);


--
-- Name: user_app_roles user_app_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_app_roles
    ADD CONSTRAINT user_app_roles_pkey PRIMARY KEY (id);


--
-- Name: user_coupons user_coupons_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_coupons
    ADD CONSTRAINT user_coupons_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_campaign_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_active ON public.campaigns USING btree (active);


--
-- Name: idx_campaign_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_campaign_sort ON public.campaigns USING btree (sort_order);


--
-- Name: idx_cat_attr_cat; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_attr_cat ON public.catalog_attributes USING btree (category_id);


--
-- Name: idx_cat_attr_opt_attr; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_attr_opt_attr ON public.catalog_attribute_options USING btree (attribute_id);


--
-- Name: idx_cat_cat_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_cat_parent ON public.catalog_categories USING btree (parent_id);


--
-- Name: idx_cat_img_prod; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_img_prod ON public.catalog_product_images USING btree (product_id);


--
-- Name: idx_cat_parent; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_parent ON public.catalog_categories USING btree (parent_id);


--
-- Name: idx_cat_pav_attr; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_pav_attr ON public.catalog_product_attribute_values USING btree (attribute_id);


--
-- Name: idx_cat_pav_prod; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_pav_prod ON public.catalog_product_attribute_values USING btree (product_id);


--
-- Name: idx_cat_prod_brand; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_prod_brand ON public.catalog_products USING btree (brand_id);


--
-- Name: idx_cat_prod_cat; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_prod_cat ON public.catalog_products USING btree (category_id);


--
-- Name: idx_cat_tier_prod; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_cat_tier_prod ON public.catalog_product_tiers USING btree (product_id);


--
-- Name: idx_catfile_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catfile_created ON public.catalog_order_files USING btree (created_at);


--
-- Name: idx_catfile_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catfile_order ON public.catalog_order_files USING btree (order_id);


--
-- Name: idx_catorder_created; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catorder_created ON public.catalog_orders USING btree (created_at);


--
-- Name: idx_catorder_payment; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catorder_payment ON public.catalog_orders USING btree (payment_status);


--
-- Name: idx_catorder_status; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catorder_status ON public.catalog_orders USING btree (status);


--
-- Name: idx_catorder_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catorder_user ON public.catalog_orders USING btree (user_id);


--
-- Name: idx_catorderitem_order; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_catorderitem_order ON public.catalog_order_items USING btree (order_id);


--
-- Name: idx_coupon_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_coupon_active ON public.coupons USING btree (active);


--
-- Name: idx_hero_active; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hero_active ON public.hero_slides USING btree (active);


--
-- Name: idx_hero_sort; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_hero_sort ON public.hero_slides USING btree (sort_order);


--
-- Name: idx_review_approved; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_approved ON public.catalog_product_reviews USING btree (approved);


--
-- Name: idx_review_product; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_product ON public.catalog_product_reviews USING btree (product_id);


--
-- Name: idx_review_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_review_user ON public.catalog_product_reviews USING btree (user_id);


--
-- Name: idx_user_coupon_coupon; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_coupon_coupon ON public.user_coupons USING btree (coupon_id);


--
-- Name: idx_user_coupon_used; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_coupon_used ON public.user_coupons USING btree (used);


--
-- Name: idx_user_coupon_user; Type: INDEX; Schema: public; Owner: -
--

CREATE INDEX idx_user_coupon_user ON public.user_coupons USING btree (user_id);


--
-- Name: addresses fk1fa36y2oqhao3wgg2rw1pi459; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT fk1fa36y2oqhao3wgg2rw1pi459 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: catalog_product_reviews fk2kgl0mo84s9ojf49gy64x33km; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_product_reviews
    ADD CONSTRAINT fk2kgl0mo84s9ojf49gy64x33km FOREIGN KEY (product_id) REFERENCES public.catalog_products(id);


--
-- Name: orders fk32ql8ubntj5uh44ph9659tiih; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk32ql8ubntj5uh44ph9659tiih FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: price_rules fk6kjo14mp38w3vg9mtihp6qm8o; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.price_rules
    ADD CONSTRAINT fk6kjo14mp38w3vg9mtihp6qm8o FOREIGN KEY (product_type_id) REFERENCES public.product_types(id);


--
-- Name: notifications fk6og1jgdhfyqm6mk8v6a1qxias; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk6og1jgdhfyqm6mk8v6a1qxias FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: catalog_products fk71llqey9drw2ddppk1x5d7y8a; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT fk71llqey9drw2ddppk1x5d7y8a FOREIGN KEY (category_id) REFERENCES public.catalog_categories(id);


--
-- Name: user_app_roles fk7887shsgpv00sxotrp5e40s4; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_app_roles
    ADD CONSTRAINT fk7887shsgpv00sxotrp5e40s4 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments fk81gagumt0r8y3rmudcgpbk42l; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk81gagumt0r8y3rmudcgpbk42l FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: catalog_product_images fk8cen2hupbgmww0k9ktx855cfy; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_product_images
    ADD CONSTRAINT fk8cen2hupbgmww0k9ktx855cfy FOREIGN KEY (product_id) REFERENCES public.catalog_products(id);


--
-- Name: catalog_product_attribute_values fk92fl2875p0i2bgmt4mytslds7; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_product_attribute_values
    ADD CONSTRAINT fk92fl2875p0i2bgmt4mytslds7 FOREIGN KEY (option_id) REFERENCES public.catalog_attribute_options(id);


--
-- Name: catalog_product_tiers fk9a812dlsy06g8w4up2h7ja3cl; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_product_tiers
    ADD CONSTRAINT fk9a812dlsy06g8w4up2h7ja3cl FOREIGN KEY (product_id) REFERENCES public.catalog_products(id);


--
-- Name: user_coupons fk9oi3p5xyfe4j32xs54nn7mi20; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_coupons
    ADD CONSTRAINT fk9oi3p5xyfe4j32xs54nn7mi20 FOREIGN KEY (coupon_id) REFERENCES public.coupons(id);


--
-- Name: carts fkb5o626f86h46m4s7ms6ginnop; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fkb5o626f86h46m4s7ms6ginnop FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_configs fkbesof4ivunprgtgl02m8ot8ji; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.product_configs
    ADD CONSTRAINT fkbesof4ivunprgtgl02m8ot8ji FOREIGN KEY (product_type_id) REFERENCES public.product_types(id);


--
-- Name: order_items fkbioxgbv59vetrxe0ejfubep1w; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkbioxgbv59vetrxe0ejfubep1w FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: catalog_attributes fkcnoaqdir9tqw97rx9qai3a8x; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_attributes
    ADD CONSTRAINT fkcnoaqdir9tqw97rx9qai3a8x FOREIGN KEY (category_id) REFERENCES public.catalog_categories(id);


--
-- Name: catalog_product_attribute_values fkdtpgrpnj7p8r7jbd7g8wff2re; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_product_attribute_values
    ADD CONSTRAINT fkdtpgrpnj7p8r7jbd7g8wff2re FOREIGN KEY (attribute_id) REFERENCES public.catalog_attributes(id);


--
-- Name: cart_items fkf9owekfxuecvej3oog3tfbl78; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkf9owekfxuecvej3oog3tfbl78 FOREIGN KEY (product_type_id) REFERENCES public.product_types(id);


--
-- Name: catalog_products fkhshn9rn4ctcb47abmqbaqtx87; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT fkhshn9rn4ctcb47abmqbaqtx87 FOREIGN KEY (brand_id) REFERENCES public.catalog_brands(id);


--
-- Name: catalog_product_attribute_values fkk8skj7um9456efqgey4fs59yg; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_product_attribute_values
    ADD CONSTRAINT fkk8skj7um9456efqgey4fs59yg FOREIGN KEY (product_id) REFERENCES public.catalog_products(id);


--
-- Name: app_role_permissions fkkbwih5u1ia34o15953kubu94f; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT fkkbwih5u1ia34o15953kubu94f FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: catalog_order_items fkku4k5sde1qrwxk4wxd4gt3twj; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_order_items
    ADD CONSTRAINT fkku4k5sde1qrwxk4wxd4gt3twj FOREIGN KEY (order_id) REFERENCES public.catalog_orders(id);


--
-- Name: catalog_categories fkmausmraxpfw3ir4m4b0xsvtry; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_categories
    ADD CONSTRAINT fkmausmraxpfw3ir4m4b0xsvtry FOREIGN KEY (parent_id) REFERENCES public.catalog_categories(id);


--
-- Name: user_app_roles fkmrtxog42fhl4hjl6uuyhtbotd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.user_app_roles
    ADD CONSTRAINT fkmrtxog42fhl4hjl6uuyhtbotd FOREIGN KEY (app_role_id) REFERENCES public.app_roles(id);


--
-- Name: files fkmuh938t60lw4df8ggbs4v6qrd; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT fkmuh938t60lw4df8ggbs4v6qrd FOREIGN KEY (order_item_id) REFERENCES public.order_items(id);


--
-- Name: order_status_history fknmcbg3mmbt8wfva97ra40nmp3; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT fknmcbg3mmbt8wfva97ra40nmp3 FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: cart_items fkpcttvuq4mxppo8sxggjtn5i2c; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkpcttvuq4mxppo8sxggjtn5i2c FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: catalog_attribute_options fkqajudtehmp5jc8okn86few4xf; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_attribute_options
    ADD CONSTRAINT fkqajudtehmp5jc8okn86few4xf FOREIGN KEY (attribute_id) REFERENCES public.catalog_attributes(id);


--
-- Name: dealers fkqoq67umfy4ce8rtk8872opdpp; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT fkqoq67umfy4ce8rtk8872opdpp FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: app_role_permissions fksj8wgtocscsk3cv3d7pngtv1s; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT fksj8wgtocscsk3cv3d7pngtv1s FOREIGN KEY (role_id) REFERENCES public.app_roles(id);


--
-- Name: catalog_order_files fktmdge251d2drsqvloc6ehw823; Type: FK CONSTRAINT; Schema: public; Owner: -
--

ALTER TABLE ONLY public.catalog_order_files
    ADD CONSTRAINT fktmdge251d2drsqvloc6ehw823 FOREIGN KEY (order_id) REFERENCES public.catalog_orders(id);


--
-- PostgreSQL database dump complete
--

\unrestrict Y4SgVYOMfVWcuoyd5wyfCvYQbirsef32DpY9cr5sfybWqivhlFPGvZbHdS4Xa2B

