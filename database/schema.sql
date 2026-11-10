-- Run this script in Supabase SQL Editor.

create table if not exists admins (
  id bigint primary key,
  username varchar(50) not null unique,
  email varchar(150),
  password_hash varchar(255) not null,
  last_login timestamptz,
  created_at timestamptz default now()
);

create table if not exists packages (
  id bigint primary key,
  name varchar(150) not null,
  category varchar(20) not null default 'room',
  description text not null,
  price numeric(10,2) not null default 0,
  price_note varchar(80),
  image_url varchar(500) not null,
  features jsonb,
  special_offer varchar(255),
  is_featured boolean not null default false,
  is_active boolean not null default true,
  sort_order integer not null default 0,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists promotions (
  id bigint primary key,
  title varchar(150) not null,
  category varchar(20) not null default 'seasonal',
  description text not null,
  discount_label varchar(60),
  image_url varchar(500) not null,
  valid_from date,
  valid_until date,
  is_active boolean not null default true,
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create table if not exists gallery (
  id bigint primary key,
  title varchar(150) not null,
  category varchar(20) not null,
  image_url varchar(500) not null,
  created_at timestamptz default now()
);

create table if not exists contact_messages (
  id bigint primary key,
  name varchar(120) not null,
  email varchar(150) not null,
  phone varchar(40),
  message text not null,
  is_read boolean not null default false,
  created_at timestamptz default now()
);

create table if not exists site_content (
  content_key varchar(80) primary key,
  content_value text,
  updated_at timestamptz default now()
);

create table if not exists _counters (
  name varchar(80) primary key,
  value bigint not null default 0
);

create index if not exists packages_active_sort_idx on packages (is_active, sort_order);
create index if not exists promotions_active_until_idx on promotions (is_active, valid_until);
create index if not exists gallery_category_idx on gallery (category);
