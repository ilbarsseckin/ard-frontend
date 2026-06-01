--
-- PostgreSQL database dump
--

\restrict mI8GClZgu54qA3tE10Qv3S2SKyRDT1TMpBsydcmhVMspwzeI9qFbNeZNMrSHr0F

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
-- Name: addresses; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.addresses OWNER TO baski_user;

--
-- Name: app_role_permissions; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.app_role_permissions (
    role_id uuid NOT NULL,
    permission_id uuid NOT NULL
);


ALTER TABLE public.app_role_permissions OWNER TO baski_user;

--
-- Name: app_roles; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.app_roles (
    id uuid NOT NULL,
    description character varying(255),
    is_active boolean,
    name character varying(255) NOT NULL
);


ALTER TABLE public.app_roles OWNER TO baski_user;

--
-- Name: brand_references; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.brand_references OWNER TO baski_user;

--
-- Name: cart_items; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.cart_items OWNER TO baski_user;

--
-- Name: carts; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.carts (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    expires_at timestamp(6) without time zone,
    updated_at timestamp(6) without time zone,
    user_id uuid NOT NULL
);


ALTER TABLE public.carts OWNER TO baski_user;

--
-- Name: catalog_attribute_options; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.catalog_attribute_options (
    id uuid NOT NULL,
    color_hex character varying(10),
    sort_order integer,
    value character varying(255) NOT NULL,
    attribute_id uuid NOT NULL
);


ALTER TABLE public.catalog_attribute_options OWNER TO baski_user;

--
-- Name: catalog_attributes; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.catalog_attributes OWNER TO baski_user;

--
-- Name: catalog_brands; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.catalog_brands OWNER TO baski_user;

--
-- Name: catalog_categories; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.catalog_categories OWNER TO baski_user;

--
-- Name: catalog_order_files; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.catalog_order_files OWNER TO baski_user;

--
-- Name: catalog_order_items; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.catalog_order_items OWNER TO baski_user;

--
-- Name: catalog_orders; Type: TABLE; Schema: public; Owner: baski_user
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
    CONSTRAINT catalog_orders_payment_status_check CHECK (((payment_status)::text = ANY ((ARRAY['PENDING'::character varying, 'PROCESSING'::character varying, 'PAID'::character varying, 'FAILED'::character varying, 'REFUNDED'::character varying])::text[]))),
    CONSTRAINT catalog_orders_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'CONFIRMED'::character varying, 'IN_PRODUCTION'::character varying, 'READY'::character varying, 'SHIPPED'::character varying, 'DELIVERED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.catalog_orders OWNER TO baski_user;

--
-- Name: catalog_product_attribute_values; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.catalog_product_attribute_values (
    id uuid NOT NULL,
    attribute_id uuid NOT NULL,
    option_id uuid NOT NULL,
    product_id uuid NOT NULL
);


ALTER TABLE public.catalog_product_attribute_values OWNER TO baski_user;

--
-- Name: catalog_product_images; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.catalog_product_images (
    id uuid NOT NULL,
    alt_text character varying(200),
    sort_order integer,
    url character varying(500) NOT NULL,
    product_id uuid NOT NULL
);


ALTER TABLE public.catalog_product_images OWNER TO baski_user;

--
-- Name: catalog_product_tiers; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.catalog_product_tiers (
    id uuid NOT NULL,
    price_usd numeric(12,2) NOT NULL,
    qty integer NOT NULL,
    sort_order integer,
    product_id uuid NOT NULL
);


ALTER TABLE public.catalog_product_tiers OWNER TO baski_user;

--
-- Name: catalog_products; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.catalog_products OWNER TO baski_user;

--
-- Name: dealers; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.dealers OWNER TO baski_user;

--
-- Name: files; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.files OWNER TO baski_user;

--
-- Name: hero_slides; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.hero_slides OWNER TO baski_user;

--
-- Name: notifications; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.notifications (
    id uuid NOT NULL,
    channel character varying(255) NOT NULL,
    recipient character varying(255) NOT NULL,
    sent_at timestamp(6) without time zone,
    status character varying(255),
    order_id uuid NOT NULL
);


ALTER TABLE public.notifications OWNER TO baski_user;

--
-- Name: order_items; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.order_items OWNER TO baski_user;

--
-- Name: order_status_history; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.order_status_history (
    id uuid NOT NULL,
    created_at timestamp(6) without time zone,
    note character varying(255),
    status character varying(255) NOT NULL,
    order_id uuid NOT NULL,
    CONSTRAINT order_status_history_status_check CHECK (((status)::text = ANY ((ARRAY['PENDING'::character varying, 'PAID'::character varying, 'REVIEWING'::character varying, 'PRINTING'::character varying, 'SHIPPED'::character varying, 'COMPLETED'::character varying, 'CANCELLED'::character varying])::text[])))
);


ALTER TABLE public.order_status_history OWNER TO baski_user;

--
-- Name: orders; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.orders OWNER TO baski_user;

--
-- Name: payments; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.payments OWNER TO baski_user;

--
-- Name: permissions; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.permissions (
    id uuid NOT NULL,
    category character varying(255),
    code character varying(255) NOT NULL,
    label character varying(255) NOT NULL
);


ALTER TABLE public.permissions OWNER TO baski_user;

--
-- Name: price_rules; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.price_rules OWNER TO baski_user;

--
-- Name: product_configs; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.product_configs OWNER TO baski_user;

--
-- Name: product_types; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.product_types OWNER TO baski_user;

--
-- Name: system_settings; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.system_settings (
    key character varying(255) NOT NULL,
    description character varying(255),
    value text NOT NULL
);


ALTER TABLE public.system_settings OWNER TO baski_user;

--
-- Name: user_app_roles; Type: TABLE; Schema: public; Owner: baski_user
--

CREATE TABLE public.user_app_roles (
    id uuid NOT NULL,
    assigned_at timestamp(6) without time zone,
    assigned_by character varying(255),
    app_role_id uuid NOT NULL,
    user_id uuid NOT NULL
);


ALTER TABLE public.user_app_roles OWNER TO baski_user;

--
-- Name: users; Type: TABLE; Schema: public; Owner: baski_user
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


ALTER TABLE public.users OWNER TO baski_user;

--
-- Data for Name: addresses; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.addresses (id, address_line, city, country, district, full_name, is_default, phone, title, user_id) FROM stdin;
f59e7694-aed1-42ca-b028-59ee4140cddf	Ataturk Cad. No:1	Istanbul	Türkiye	Kadikoy	Admin Test	t	05001234567	Ofis	c2a9af4c-0956-4e71-bde1-f8a8f9258586
\.


--
-- Data for Name: app_role_permissions; Type: TABLE DATA; Schema: public; Owner: baski_user
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
-- Data for Name: app_roles; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.app_roles (id, description, is_active, name) FROM stdin;
e5a63db2-3c9d-4e08-afc9-2ab7fb67e3e0	Sipariş yönetimi ve üretim takibi	t	Operatör
a0bdaf1e-4386-485d-859c-1407813591a7	Ödeme ve ciro raporları	t	Muhasebe
fa0e64d1-cbc8-4abf-a283-c824a1f5b5ef	Sadece üretim aşamasındaki siparişler	t	Üretim
ab86f054-f176-43a3-a233-69d2897928cd	Tüm yetkilere sahip	t	Admin
\.


--
-- Data for Name: brand_references; Type: TABLE DATA; Schema: public; Owner: baski_user
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
-- Data for Name: cart_items; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.cart_items (id, declared_prints, file_original_name, file_pages_count, files3key, height_cm, options_json, price_breakdown, quantity, total_price, unit_price, width_cm, cart_id, product_type_id, created_at) FROM stdin;
\.


--
-- Data for Name: carts; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.carts (id, created_at, expires_at, updated_at, user_id) FROM stdin;
9c070173-c049-4037-88f2-07ba841202d5	\N	2026-05-23 15:51:24.804787	2026-05-22 15:51:24.8332	c2a9af4c-0956-4e71-bde1-f8a8f9258586
\.


--
-- Data for Name: catalog_attribute_options; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.catalog_attribute_options (id, color_hex, sort_order, value, attribute_id) FROM stdin;
ec7c68f7-fa71-48fb-9b6b-8ae860df1492	\N	1	350g Mat Kuse	8811e952-4385-400e-a157-6e3b239a6f49
f05cceae-93c1-4205-8c9b-ddcd55ca4e83	\N	2	400g Mat Kuse	8811e952-4385-400e-a157-6e3b239a6f49
8cc47117-ed20-4dd8-b7e8-1e92a9e53039	\N	3	500	8811e952-4385-400e-a157-6e3b239a6f49
\.


--
-- Data for Name: catalog_attributes; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.catalog_attributes (id, attr_key, input_type, label, required, sort_order, category_id) FROM stdin;
8811e952-4385-400e-a157-6e3b239a6f49	kagit	select	Kagit	t	1	ac16bace-2752-493d-aeb6-3c6f9977a059
\.


--
-- Data for Name: catalog_brands; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.catalog_brands (id, active, created_at, description, logo_url, name, slug) FROM stdin;
\.


--
-- Data for Name: catalog_categories; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.catalog_categories (id, active, created_at, icon, name, slug, sort_order, tagline, updated_at, parent_id) FROM stdin;
ac16bace-2752-493d-aeb6-3c6f9977a059	t	2026-05-22 14:18:52.552812+00	\N	Kartvizitler	kartvizit	0	\N	2026-05-22 14:18:52.552812+00	\N
f2874bbe-0edf-4862-863b-2fe0399557f9	t	2026-05-25 18:24:49.040396+00	\N	kartvizitim	kartvizitim	0	kartivizit tasarlşa	2026-05-25 18:24:49.040396+00	\N
21fa98de-9129-4fee-b6c4-f23d36f6cc37	t	2026-05-22 14:19:20.745404+00	\N	Standart Kartvizit	kartvizit-standart	0	\N	2026-05-25 18:25:27.981427+00	ac16bace-2752-493d-aeb6-3c6f9977a059
f632a49c-6d19-4c8e-bbb5-b23a38dc8d2f	t	2026-05-25 18:26:02.889045+00	\N	Vinil baskı	vinil-baski	1	vinil baskılar çok iyi	2026-05-25 18:26:02.889045+00	\N
\.


--
-- Data for Name: catalog_order_files; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.catalog_order_files (id, created_at, file_size, mime_type, original_name, page_count, page_warning, storage_path, stored_filename, order_id) FROM stdin;
13dff614-a7ae-4c5d-b571-ebe9acd33f01	2026-05-26 08:40:15.485052+00	2888	application/pdf	Multibus_Fiyat_Teklifi.pdf	1	f	customer-designs/CAT-A2432A9A/e7852b2c-ea28-4b9a-bf2c-aaaacb523f24.pdf	e7852b2c-ea28-4b9a-bf2c-aaaacb523f24.pdf	ca56ffb3-fe9c-4c09-8160-c1c05dcb8146
c7e2da0b-243f-41e0-ac84-8fe1fdfa2fad	2026-05-26 08:40:22.456309+00	24209	application/pdf	Multibus_Fiyat_Teklifi_TR_Son.pdf	1	f	customer-designs/CAT-A2432A9A/c7973141-2dbb-4685-8e8a-0ef69e0a86e2.pdf	c7973141-2dbb-4685-8e8a-0ef69e0a86e2.pdf	ca56ffb3-fe9c-4c09-8160-c1c05dcb8146
\.


--
-- Data for Name: catalog_order_items; Type: TABLE DATA; Schema: public; Owner: baski_user
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
\.


--
-- Data for Name: catalog_orders; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.catalog_orders (id, city, created_at, customer_address, customer_email, customer_name, customer_phone, district, notes, order_number, status, subtotal_usd, total_tl, updated_at, usd_kur_at_order, user_id, iyzico_conversation_data, iyzico_payment_id, payment_status) FROM stdin;
b10a38f7-3ba2-4d14-a9a7-c1bccc9d874f	İstanbul	2026-05-25 19:27:47.529824+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	il@gmail.com	seckin ilbars	05530214776	Kartal	sfsdfsd	CAT-B85BED23	PENDING	16.00	720.00	2026-05-25 19:27:47.567952+00	45.0000	\N	\N	\N	\N
648c0957-670a-42bc-83d8-1f329933f5e2	İstanbul	2026-05-25 19:50:03.210845+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-09A1A97D	PENDING	36.00	1620.00	2026-05-25 19:50:03.272409+00	45.0000	\N	\N	\N	PENDING
0829cae9-467c-471a-ba3b-d8b4fb4af4c6	İstanbul	2026-05-25 19:53:45.272815+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	054530214776	Kartal	\N	CAT-4FAA79BD	PENDING	16.00	720.00	2026-05-25 19:53:45.290843+00	45.0000	\N	\N	\N	PENDING
a9ded8d8-145a-46b9-adab-d9b045251516	İstanbul	2026-05-25 19:56:11.739597+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-21CA9803	PENDING	16.00	720.00	2026-05-25 19:56:11.76203+00	45.0000	\N	\N	\N	PENDING
9527a82a-d756-4994-b219-2a207eb53f54	İstanbul	2026-05-25 19:58:58.67681+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-89BA17EA	PENDING	16.00	720.00	2026-05-26 06:47:24.506695+00	45.0000	\N	\N	\N	PROCESSING
c50870f7-d311-4100-94c1-581dfae8bfb5	İstanbul	2026-05-26 06:56:05.228404+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	ffsdf	CAT-098E3522	PENDING	16.00	720.00	2026-05-26 06:56:05.259901+00	45.0000	\N	\N	\N	PENDING
f3ae956a-2478-4cd7-bcc2-5b7d88b88e8c	İstanbul	2026-05-26 07:17:04.85736+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-B022BCFB	PENDING	36.00	1620.00	2026-05-26 07:17:04.871729+00	45.0000	\N	\N	\N	PENDING
7b75311a-0db0-46b5-9883-1874b438f3f1	İstanbul	2026-05-26 08:34:43.225626+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214776	Kartal	\N	CAT-5512C96C	PENDING	32.00	1440.00	2026-05-26 08:34:43.327751+00	45.0000	\N	\N	\N	PENDING
ca56ffb3-fe9c-4c09-8160-c1c05dcb8146	İstanbul	2026-05-26 08:39:54.183787+00	Uğur Mumcu\nŞeyh Şamil Cd. No:15	\N	seckin ilbars	05530214476	Kartal	Acele	CAT-A2432A9A	PENDING	64.00	2880.00	2026-05-26 08:40:57.245656+00	45.0000	\N	\N	\N	PROCESSING
\.


--
-- Data for Name: catalog_product_attribute_values; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.catalog_product_attribute_values (id, attribute_id, option_id, product_id) FROM stdin;
128f1a1b-7a36-4c92-a611-b3f3edbd6d51	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	03a43aef-3ab2-42a3-b77c-4ce951d3f583
b204096f-7311-431b-a58a-52e791a2e1a1	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	4179c030-74c3-4452-9056-f17fca3af7b1
2c38430d-f09b-4600-aecf-feabb951a0f5	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	e746542e-9679-44c1-ad34-c44d44d7483e
c0c1c004-3e9b-4e58-b532-0b4e10dea786	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	db2838c4-395b-4b8f-930d-d278415c67b1
f3577006-5171-4422-b190-6e779b5e50ba	8811e952-4385-400e-a157-6e3b239a6f49	f05cceae-93c1-4205-8c9b-ddcd55ca4e83	db2838c4-395b-4b8f-930d-d278415c67b1
ce2f4040-bf67-4490-974f-9e14ee120bf1	8811e952-4385-400e-a157-6e3b239a6f49	ec7c68f7-fa71-48fb-9b6b-8ae860df1492	b0c65d46-70f3-4e75-aef3-6e605818c174
\.


--
-- Data for Name: catalog_product_images; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.catalog_product_images (id, alt_text, sort_order, url, product_id) FROM stdin;
906d8ca6-0fcf-4416-ae0c-7747daff54c9		0	https://images.unsplash.com/photo-1572025442646-866d16c84a54?w=800	db2838c4-395b-4b8f-930d-d278415c67b1
a3af5e59-3ffe-4c6c-a727-586aacd998fe		1	https://images.unsplash.com/photo-1606857521015-7f9fcf423740?w=80	db2838c4-395b-4b8f-930d-d278415c67b1
1072438f-19da-4aa6-9810-eecb3a6f4e4d		0	https://d1x3eomzsc6lfz.cloudfront.net/baskiadam/images/products_gallery_images/standart-kartvizit90.jpg	b0c65d46-70f3-4e75-aef3-6e605818c174
8b52cb4c-0b14-4e5d-a5e5-e9e5ef285d48		1	http://localhost:8080/uploads/product/56f1ed47-07cd-4a26-97ef-922de5414ab7.png	b0c65d46-70f3-4e75-aef3-6e605818c174
6079383b-efd4-4b15-aa3b-ce54eb781113		2	http://localhost:8080/uploads/product/9c722e5c-1cbf-4dfb-aac1-985c8e1905ce.jpeg	b0c65d46-70f3-4e75-aef3-6e605818c174
\.


--
-- Data for Name: catalog_product_tiers; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.catalog_product_tiers (id, price_usd, qty, sort_order, product_id) FROM stdin;
d5b3450a-1f59-4a5d-9c39-6d0be06f8999	16.00	500	0	db2838c4-395b-4b8f-930d-d278415c67b1
62638e0d-6076-4622-a0bf-1a2d60170f07	20.00	1000	1	db2838c4-395b-4b8f-930d-d278415c67b1
5abd309c-096b-4128-9bab-8dc0437d13b2	36.00	2000	2	db2838c4-395b-4b8f-930d-d278415c67b1
9f15a889-1e4a-4a1a-a2e3-080aade7f633	16.00	100	0	b0c65d46-70f3-4e75-aef3-6e605818c174
\.


--
-- Data for Name: catalog_products; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.catalog_products (id, active, badge, created_at, featured, long_desc, name, original_price, short_desc, slug, sort_order, updated_at, brand_id, category_id) FROM stdin;
b0c65d46-70f3-4e75-aef3-6e605818c174	t	\N	2026-05-22 15:23:46.268547+00	t	\N	kartvizit	\N	350	kartvizit	1	2026-05-22 15:23:46.268547+00	\N	ac16bace-2752-493d-aeb6-3c6f9977a059
e8c915e1-2ad1-4e70-8899-939cac816feb	t	\N	2026-05-22 15:24:56.613804+00	f	sdfsdfsdf	sfsdfsdfsd	\N	sfsdfsdfs	sfsdfsdfsd	0	2026-05-22 15:24:56.613804+00	\N	21fa98de-9129-4fee-b6c4-f23d36f6cc37
03a43aef-3ab2-42a3-b77c-4ce951d3f583	t	\N	2026-05-22 15:44:39.87653+00	f	sdsd	sdsds	\N	sdsd	sdsds	0	2026-05-22 15:44:39.87653+00	\N	ac16bace-2752-493d-aeb6-3c6f9977a059
4179c030-74c3-4452-9056-f17fca3af7b1	t	\N	2026-05-22 15:45:30.29279+00	f	vcv	dfdfdfdf	\N	vcv	dfdfdfdf	0	2026-05-22 15:45:30.29279+00	\N	ac16bace-2752-493d-aeb6-3c6f9977a059
e746542e-9679-44c1-ad34-c44d44d7483e	t	\N	2026-05-22 15:54:21.476238+00	f	dssd	assas	\N	dssdsd	assas	0	2026-05-22 15:54:21.476238+00	\N	ac16bace-2752-493d-aeb6-3c6f9977a059
db2838c4-395b-4b8f-930d-d278415c67b1	t	\N	2026-05-22 15:15:14.445554+00	t	Standart kartvizitlerimiz 350g ve 400g mat kuşe kağıt seçenekleriyle hazırlanır. \nYüksek çözünürlüklü baskı, canlı renkler ve uzun ömürlü kalite sunar.\n\n✓ Çift taraflı baskı\n✓ 48 saat hızlı teslim\n✓ Ücretsiz tasarım desteği\n✓ Tüm Türkiye'ye kargo\n\nStandart boyut: 8.5 × 5.5 cm\nMinimum sipariş: 500 adet	Standart Kartvizit	\N	350g/400g mat veya parlak kuşe, çift taraflı baskı, 48 saat teslim	standart-kartvizit	0	2026-05-25 18:29:41.955218+00	\N	ac16bace-2752-493d-aeb6-3c6f9977a059
\.


--
-- Data for Name: dealers; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.dealers (id, address, city, company_name, created_at, credit_limit, discount_rate, district, notes, phone, rejection_reason, status, tax_number, tax_office, updated_at, user_id, business_type, estimated_monthly_revenue, note, website) FROM stdin;
\.


--
-- Data for Name: files; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.files (id, original_name, page_count, s3key, status, uploaded_at, order_item_id) FROM stdin;
\.


--
-- Data for Name: hero_slides; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.hero_slides (id, active, background_color, created_at, cta_link, cta_text, description, ends_at, image_url, label, layout, mobile_image_url, sort_order, starts_at, title, updated_at) FROM stdin;
3ee2dfa3-3077-4939-af15-e5608fead0df	t	#dcfce7	2026-05-26 17:44:55.887151+00	/urun/standart-kartvizit	Hemen Sipariş Ver	\N	\N	https://images.unsplash.com/photo-1606844999462-9c91d4f24a85?w=800	Reklamınız Kalıcı Olsun	SPLIT_LEFT	\N	0	\N	Oto Kokusu	2026-05-26 17:44:55.887151+00
1775b562-9b8b-4c5d-bbbc-60c8c8d10445	t	#fef3c7	2026-05-26 17:47:15.30608+00	/urun/standart-kartvizit	İncele	1000 adet sadece 850 TL	\N	https://picsum.photos/seed/kart/1000/500	%50 İNDİRİM	SPLIT_RIGHT	\N	0	\N	Standart Kartvizit	2026-05-26 17:47:15.30608+00
\.


--
-- Data for Name: notifications; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.notifications (id, channel, recipient, sent_at, status, order_id) FROM stdin;
\.


--
-- Data for Name: order_items; Type: TABLE DATA; Schema: public; Owner: baski_user
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
-- Data for Name: order_status_history; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.order_status_history (id, created_at, note, status, order_id) FROM stdin;
f841eb89-ed68-4677-9907-9550fea9e797	2026-05-19 17:42:16.955591	Sipariş onaylandı, incelemeye alındı	REVIEWING	4e653d18-8ba6-4b37-9873-1b81eb949ef6
38db518b-9902-47d2-8ef1-70671b71e7e2	2026-05-19 17:42:23.608809	Sipariş onaylandı, incelemeye alındı	REVIEWING	4e653d18-8ba6-4b37-9873-1b81eb949ef6
93cae277-20ce-484b-a32d-a0f47ddcac1c	2026-05-20 08:43:23.508605	Baskıya gönderildi	PRINTING	4e653d18-8ba6-4b37-9873-1b81eb949ef6
d9c41e68-e12d-493f-a6ac-4c3e8bdcc751	2026-05-20 08:43:35.849309	Kargoya verildi	SHIPPED	4e653d18-8ba6-4b37-9873-1b81eb949ef6
5bdacfc1-2120-4def-a2e5-321d082ebaba	2026-05-20 08:43:38.02388	Sipariş tamamlandı	COMPLETED	4e653d18-8ba6-4b37-9873-1b81eb949ef6
\.


--
-- Data for Name: orders; Type: TABLE DATA; Schema: public; Owner: baski_user
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
-- Data for Name: payments; Type: TABLE DATA; Schema: public; Owner: baski_user
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
-- Data for Name: permissions; Type: TABLE DATA; Schema: public; Owner: baski_user
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
-- Data for Name: price_rules; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.price_rules (id, base_price, max_qty, min_qty, multiplier, option_key, option_value, price_delta, rule_type, unit_price, product_type_id) FROM stdin;
4eae9a02-c02c-4187-a4cc-0f10d8c06ca5	100.00	\N	1	\N	\N	\N	\N	AREA_BASED	\N	7b4a1463-b298-4e8e-8fc5-03b5ff2bfa6b
e1aea76b-9cae-444c-b980-040eb516fa70	3.20	\N	1	\N	\N	\N	\N	AREA_BASED	\N	0dc9ff09-3a78-4ddc-abb2-8bdc1bafe58e
f9bace09-4e52-4de4-af57-67c9456fb4cf	3.50	\N	1	\N	\N	\N	\N	AREA_BASED	\N	761fbdcb-563a-4738-9218-02b4a97a18bb
\.


--
-- Data for Name: product_configs; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.product_configs (id, affects_price, display_order, field_key, field_type, options, required, product_type_id) FROM stdin;
\.


--
-- Data for Name: product_types; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.product_types (id, description, has_file, is_active, min_order, name, pricing_model, slug, unit, image_url, badge, featured, original_price) FROM stdin;
7b4a1463-b298-4e8e-8fc5-03b5ff2bfa6b	asdas	t	t	1	fsdfsdf	AREA_BASED	buyuk-format-fsdfsdfds	m2	https://artemizreklam.com/wp-content/uploads/2021/03/vinil-baski-600x450.jpg	YENİ	t	125.00
0dc9ff09-3a78-4ddc-abb2-8bdc1bafe58e	Super Vinil Baskı	t	t	1	Vinil Baskı	AREA_BASED	buyuk-format-vinil-baski	m2	https://www.poshreklam.com/wp-content/uploads/2025/07/posh-reklam-vinil-baski-banner.webp		t	0.00
761fbdcb-563a-4738-9218-02b4a97a18bb	FOLYO BASKI	t	t	1	Folyo Baskı	AREA_BASED	buyuk-format-folyo-baski	m2	https://www.dinamiktanitim.com/image/cache/catalog/dijital-baski/1-Sinif-Dijital-Baski-Makineleri-450x450-500x515.jpg	YENİ	t	0.00
\.


--
-- Data for Name: system_settings; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.system_settings (key, description, value) FROM stdin;
\.


--
-- Data for Name: user_app_roles; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.user_app_roles (id, assigned_at, assigned_by, app_role_id, user_id) FROM stdin;
02315e54-d123-45e9-997d-1ebac3c8ba4a	2026-05-20 10:43:08.239564	admin@baski.com	e5a63db2-3c9d-4e08-afc9-2ab7fb67e3e0	c2a9af4c-0956-4e71-bde1-f8a8f9258586
93503184-b52b-4a72-85e9-af5a786d01f4	2026-05-20 10:43:19.328474	admin@baski.com	ab86f054-f176-43a3-a233-69d2897928cd	c2a9af4c-0956-4e71-bde1-f8a8f9258586
8f8e5202-ff04-4bd1-b9ac-45e7ead067cd	2026-05-20 14:32:10.524221	admin@baski.com	fa0e64d1-cbc8-4abf-a283-c824a1f5b5ef	8a4ac4fd-f4dd-4032-83b2-72ffe913377f
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: baski_user
--

COPY public.users (id, created_at, email, name, password, phone, role, email_verified, google_id) FROM stdin;
7b8a427a-cf5b-400a-868a-c62c6fb30c99	2026-05-19 21:39:29.80454	ilbarsseckin@gmail.com	seçkin ilbars	$2a$10$/Q5bOasIpH.EClgOd2bCqeTKpVMSUBYxuTAHBqDg/o4Cuqytv2AwW	05530214776	CUSTOMER	\N	\N
c2a9af4c-0956-4e71-bde1-f8a8f9258586	2026-05-19 13:26:58.825019	admin@baski.com	Admin	$2a$10$/cJFoXPHcLcQV46xRpDUxu6Qs8vuAPjcrnKtPOUJyYfZ.N5TvP3rS	05001234567	ADMIN	\N	\N
d524f0ed-f101-4a09-ada5-033b7dc062e1	2026-05-20 11:02:18.472145	arif@gmail.com	arif	$2a$10$.EytYLqld6foWFMGDx5kyuuAHViqg9xTZuumGuKAEuJ3sTxrqAXcu		OPERATOR	\N	\N
8a4ac4fd-f4dd-4032-83b2-72ffe913377f	2026-05-20 10:59:18.839038	ayse@gmail.com	ayse	$2a$10$KkpDk95eXLAStVP2TkjCF./ikuD4jTDiw3EKtpB.rlygC.NAgLwC6		OPERATOR	\N	\N
\.


--
-- Name: addresses addresses_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT addresses_pkey PRIMARY KEY (id);


--
-- Name: app_role_permissions app_role_permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT app_role_permissions_pkey PRIMARY KEY (role_id, permission_id);


--
-- Name: app_roles app_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.app_roles
    ADD CONSTRAINT app_roles_pkey PRIMARY KEY (id);


--
-- Name: brand_references brand_references_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.brand_references
    ADD CONSTRAINT brand_references_pkey PRIMARY KEY (id);


--
-- Name: cart_items cart_items_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT cart_items_pkey PRIMARY KEY (id);


--
-- Name: carts carts_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT carts_pkey PRIMARY KEY (id);


--
-- Name: catalog_attribute_options catalog_attribute_options_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_attribute_options
    ADD CONSTRAINT catalog_attribute_options_pkey PRIMARY KEY (id);


--
-- Name: catalog_attributes catalog_attributes_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_attributes
    ADD CONSTRAINT catalog_attributes_pkey PRIMARY KEY (id);


--
-- Name: catalog_brands catalog_brands_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT catalog_brands_pkey PRIMARY KEY (id);


--
-- Name: catalog_categories catalog_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_categories
    ADD CONSTRAINT catalog_categories_pkey PRIMARY KEY (id);


--
-- Name: catalog_order_files catalog_order_files_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_order_files
    ADD CONSTRAINT catalog_order_files_pkey PRIMARY KEY (id);


--
-- Name: catalog_order_items catalog_order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_order_items
    ADD CONSTRAINT catalog_order_items_pkey PRIMARY KEY (id);


--
-- Name: catalog_orders catalog_orders_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_orders
    ADD CONSTRAINT catalog_orders_pkey PRIMARY KEY (id);


--
-- Name: catalog_product_attribute_values catalog_product_attribute_values_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_product_attribute_values
    ADD CONSTRAINT catalog_product_attribute_values_pkey PRIMARY KEY (id);


--
-- Name: catalog_product_images catalog_product_images_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_product_images
    ADD CONSTRAINT catalog_product_images_pkey PRIMARY KEY (id);


--
-- Name: catalog_product_tiers catalog_product_tiers_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_product_tiers
    ADD CONSTRAINT catalog_product_tiers_pkey PRIMARY KEY (id);


--
-- Name: catalog_products catalog_products_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT catalog_products_pkey PRIMARY KEY (id);


--
-- Name: dealers dealers_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT dealers_pkey PRIMARY KEY (id);


--
-- Name: files files_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT files_pkey PRIMARY KEY (id);


--
-- Name: hero_slides hero_slides_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.hero_slides
    ADD CONSTRAINT hero_slides_pkey PRIMARY KEY (id);


--
-- Name: catalog_brands idx_cat_brand_slug; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_brands
    ADD CONSTRAINT idx_cat_brand_slug UNIQUE (slug);


--
-- Name: catalog_categories idx_cat_cat_slug; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_categories
    ADD CONSTRAINT idx_cat_cat_slug UNIQUE (slug);


--
-- Name: catalog_products idx_cat_prod_slug; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT idx_cat_prod_slug UNIQUE (slug);


--
-- Name: catalog_orders idx_catorder_number; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_orders
    ADD CONSTRAINT idx_catorder_number UNIQUE (order_number);


--
-- Name: notifications notifications_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT notifications_pkey PRIMARY KEY (id);


--
-- Name: order_items order_items_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT order_items_pkey PRIMARY KEY (id);


--
-- Name: order_status_history order_status_history_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT order_status_history_pkey PRIMARY KEY (id);


--
-- Name: orders orders_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT orders_pkey PRIMARY KEY (id);


--
-- Name: payments payments_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT payments_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_pkey PRIMARY KEY (id);


--
-- Name: price_rules price_rules_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.price_rules
    ADD CONSTRAINT price_rules_pkey PRIMARY KEY (id);


--
-- Name: product_configs product_configs_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.product_configs
    ADD CONSTRAINT product_configs_pkey PRIMARY KEY (id);


--
-- Name: product_types product_types_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.product_types
    ADD CONSTRAINT product_types_pkey PRIMARY KEY (id);


--
-- Name: system_settings system_settings_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.system_settings
    ADD CONSTRAINT system_settings_pkey PRIMARY KEY (key);


--
-- Name: dealers uk10jndvam70sjubvckk4l6cvxr; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT uk10jndvam70sjubvckk4l6cvxr UNIQUE (user_id);


--
-- Name: files uk2bsy7ojkfd5129barybedxjrd; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT uk2bsy7ojkfd5129barybedxjrd UNIQUE (order_item_id);


--
-- Name: dealers uk40654vo0wa4g02l8ltqpayvs0; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT uk40654vo0wa4g02l8ltqpayvs0 UNIQUE (tax_number);


--
-- Name: users uk6dotkott2kjsp8vw4d0m25fb7; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT uk6dotkott2kjsp8vw4d0m25fb7 UNIQUE (email);


--
-- Name: permissions uk7lcb6glmvwlro3p2w2cewxtvd; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT uk7lcb6glmvwlro3p2w2cewxtvd UNIQUE (code);


--
-- Name: product_types uk9abi23631rfwuaml6m9a0pjok; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.product_types
    ADD CONSTRAINT uk9abi23631rfwuaml6m9a0pjok UNIQUE (slug);


--
-- Name: app_roles ukfvrw9klein793jl7h2qug4a5t; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.app_roles
    ADD CONSTRAINT ukfvrw9klein793jl7h2qug4a5t UNIQUE (name);


--
-- Name: user_app_roles user_app_roles_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.user_app_roles
    ADD CONSTRAINT user_app_roles_pkey PRIMARY KEY (id);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: idx_cat_attr_cat; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_cat_attr_cat ON public.catalog_attributes USING btree (category_id);


--
-- Name: idx_cat_attr_opt_attr; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_cat_attr_opt_attr ON public.catalog_attribute_options USING btree (attribute_id);


--
-- Name: idx_cat_cat_parent; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_cat_cat_parent ON public.catalog_categories USING btree (parent_id);


--
-- Name: idx_cat_img_prod; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_cat_img_prod ON public.catalog_product_images USING btree (product_id);


--
-- Name: idx_cat_pav_attr; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_cat_pav_attr ON public.catalog_product_attribute_values USING btree (attribute_id);


--
-- Name: idx_cat_pav_prod; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_cat_pav_prod ON public.catalog_product_attribute_values USING btree (product_id);


--
-- Name: idx_cat_prod_brand; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_cat_prod_brand ON public.catalog_products USING btree (brand_id);


--
-- Name: idx_cat_prod_cat; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_cat_prod_cat ON public.catalog_products USING btree (category_id);


--
-- Name: idx_cat_tier_prod; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_cat_tier_prod ON public.catalog_product_tiers USING btree (product_id);


--
-- Name: idx_catfile_created; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_catfile_created ON public.catalog_order_files USING btree (created_at);


--
-- Name: idx_catfile_order; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_catfile_order ON public.catalog_order_files USING btree (order_id);


--
-- Name: idx_catorder_created; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_catorder_created ON public.catalog_orders USING btree (created_at);


--
-- Name: idx_catorder_payment; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_catorder_payment ON public.catalog_orders USING btree (payment_status);


--
-- Name: idx_catorder_status; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_catorder_status ON public.catalog_orders USING btree (status);


--
-- Name: idx_catorder_user; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_catorder_user ON public.catalog_orders USING btree (user_id);


--
-- Name: idx_catorderitem_order; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_catorderitem_order ON public.catalog_order_items USING btree (order_id);


--
-- Name: idx_hero_active; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_hero_active ON public.hero_slides USING btree (active);


--
-- Name: idx_hero_sort; Type: INDEX; Schema: public; Owner: baski_user
--

CREATE INDEX idx_hero_sort ON public.hero_slides USING btree (sort_order);


--
-- Name: addresses fk1fa36y2oqhao3wgg2rw1pi459; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.addresses
    ADD CONSTRAINT fk1fa36y2oqhao3wgg2rw1pi459 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: orders fk32ql8ubntj5uh44ph9659tiih; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.orders
    ADD CONSTRAINT fk32ql8ubntj5uh44ph9659tiih FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: price_rules fk6kjo14mp38w3vg9mtihp6qm8o; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.price_rules
    ADD CONSTRAINT fk6kjo14mp38w3vg9mtihp6qm8o FOREIGN KEY (product_type_id) REFERENCES public.product_types(id);


--
-- Name: notifications fk6og1jgdhfyqm6mk8v6a1qxias; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.notifications
    ADD CONSTRAINT fk6og1jgdhfyqm6mk8v6a1qxias FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: catalog_products fk71llqey9drw2ddppk1x5d7y8a; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT fk71llqey9drw2ddppk1x5d7y8a FOREIGN KEY (category_id) REFERENCES public.catalog_categories(id);


--
-- Name: user_app_roles fk7887shsgpv00sxotrp5e40s4; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.user_app_roles
    ADD CONSTRAINT fk7887shsgpv00sxotrp5e40s4 FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: payments fk81gagumt0r8y3rmudcgpbk42l; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.payments
    ADD CONSTRAINT fk81gagumt0r8y3rmudcgpbk42l FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: catalog_product_images fk8cen2hupbgmww0k9ktx855cfy; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_product_images
    ADD CONSTRAINT fk8cen2hupbgmww0k9ktx855cfy FOREIGN KEY (product_id) REFERENCES public.catalog_products(id);


--
-- Name: catalog_product_attribute_values fk92fl2875p0i2bgmt4mytslds7; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_product_attribute_values
    ADD CONSTRAINT fk92fl2875p0i2bgmt4mytslds7 FOREIGN KEY (option_id) REFERENCES public.catalog_attribute_options(id);


--
-- Name: catalog_product_tiers fk9a812dlsy06g8w4up2h7ja3cl; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_product_tiers
    ADD CONSTRAINT fk9a812dlsy06g8w4up2h7ja3cl FOREIGN KEY (product_id) REFERENCES public.catalog_products(id);


--
-- Name: carts fkb5o626f86h46m4s7ms6ginnop; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.carts
    ADD CONSTRAINT fkb5o626f86h46m4s7ms6ginnop FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: product_configs fkbesof4ivunprgtgl02m8ot8ji; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.product_configs
    ADD CONSTRAINT fkbesof4ivunprgtgl02m8ot8ji FOREIGN KEY (product_type_id) REFERENCES public.product_types(id);


--
-- Name: order_items fkbioxgbv59vetrxe0ejfubep1w; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.order_items
    ADD CONSTRAINT fkbioxgbv59vetrxe0ejfubep1w FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: catalog_attributes fkcnoaqdir9tqw97rx9qai3a8x; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_attributes
    ADD CONSTRAINT fkcnoaqdir9tqw97rx9qai3a8x FOREIGN KEY (category_id) REFERENCES public.catalog_categories(id);


--
-- Name: catalog_product_attribute_values fkdtpgrpnj7p8r7jbd7g8wff2re; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_product_attribute_values
    ADD CONSTRAINT fkdtpgrpnj7p8r7jbd7g8wff2re FOREIGN KEY (attribute_id) REFERENCES public.catalog_attributes(id);


--
-- Name: cart_items fkf9owekfxuecvej3oog3tfbl78; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkf9owekfxuecvej3oog3tfbl78 FOREIGN KEY (product_type_id) REFERENCES public.product_types(id);


--
-- Name: catalog_products fkhshn9rn4ctcb47abmqbaqtx87; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_products
    ADD CONSTRAINT fkhshn9rn4ctcb47abmqbaqtx87 FOREIGN KEY (brand_id) REFERENCES public.catalog_brands(id);


--
-- Name: catalog_product_attribute_values fkk8skj7um9456efqgey4fs59yg; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_product_attribute_values
    ADD CONSTRAINT fkk8skj7um9456efqgey4fs59yg FOREIGN KEY (product_id) REFERENCES public.catalog_products(id);


--
-- Name: app_role_permissions fkkbwih5u1ia34o15953kubu94f; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT fkkbwih5u1ia34o15953kubu94f FOREIGN KEY (permission_id) REFERENCES public.permissions(id);


--
-- Name: catalog_order_items fkku4k5sde1qrwxk4wxd4gt3twj; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_order_items
    ADD CONSTRAINT fkku4k5sde1qrwxk4wxd4gt3twj FOREIGN KEY (order_id) REFERENCES public.catalog_orders(id);


--
-- Name: catalog_categories fkmausmraxpfw3ir4m4b0xsvtry; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_categories
    ADD CONSTRAINT fkmausmraxpfw3ir4m4b0xsvtry FOREIGN KEY (parent_id) REFERENCES public.catalog_categories(id);


--
-- Name: user_app_roles fkmrtxog42fhl4hjl6uuyhtbotd; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.user_app_roles
    ADD CONSTRAINT fkmrtxog42fhl4hjl6uuyhtbotd FOREIGN KEY (app_role_id) REFERENCES public.app_roles(id);


--
-- Name: files fkmuh938t60lw4df8ggbs4v6qrd; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.files
    ADD CONSTRAINT fkmuh938t60lw4df8ggbs4v6qrd FOREIGN KEY (order_item_id) REFERENCES public.order_items(id);


--
-- Name: order_status_history fknmcbg3mmbt8wfva97ra40nmp3; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.order_status_history
    ADD CONSTRAINT fknmcbg3mmbt8wfva97ra40nmp3 FOREIGN KEY (order_id) REFERENCES public.orders(id);


--
-- Name: cart_items fkpcttvuq4mxppo8sxggjtn5i2c; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.cart_items
    ADD CONSTRAINT fkpcttvuq4mxppo8sxggjtn5i2c FOREIGN KEY (cart_id) REFERENCES public.carts(id);


--
-- Name: catalog_attribute_options fkqajudtehmp5jc8okn86few4xf; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_attribute_options
    ADD CONSTRAINT fkqajudtehmp5jc8okn86few4xf FOREIGN KEY (attribute_id) REFERENCES public.catalog_attributes(id);


--
-- Name: dealers fkqoq67umfy4ce8rtk8872opdpp; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.dealers
    ADD CONSTRAINT fkqoq67umfy4ce8rtk8872opdpp FOREIGN KEY (user_id) REFERENCES public.users(id);


--
-- Name: app_role_permissions fksj8wgtocscsk3cv3d7pngtv1s; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.app_role_permissions
    ADD CONSTRAINT fksj8wgtocscsk3cv3d7pngtv1s FOREIGN KEY (role_id) REFERENCES public.app_roles(id);


--
-- Name: catalog_order_files fktmdge251d2drsqvloc6ehw823; Type: FK CONSTRAINT; Schema: public; Owner: baski_user
--

ALTER TABLE ONLY public.catalog_order_files
    ADD CONSTRAINT fktmdge251d2drsqvloc6ehw823 FOREIGN KEY (order_id) REFERENCES public.catalog_orders(id);


--
-- PostgreSQL database dump complete
--

\unrestrict mI8GClZgu54qA3tE10Qv3S2SKyRDT1TMpBsydcmhVMspwzeI9qFbNeZNMrSHr0F

