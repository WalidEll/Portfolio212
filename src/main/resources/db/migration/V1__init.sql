create table instrument (
  id bigserial primary key,
  symbol varchar(32) not null unique,
  name varchar(255) null,
  created_at timestamptz not null default now()
);

create table transaction (
  id bigserial primary key,
  trade_date date not null,
  symbol varchar(32) not null,
  type varchar(16) not null,
  quantity numeric(18,6) null,
  price numeric(18,6) null,
  amount numeric(18,6) null,
  note text null,
  created_at timestamptz not null default now()
);
create index idx_transaction_symbol_date on transaction(symbol, trade_date);

create table price_snapshot (
  id bigserial primary key,
  symbol varchar(32) not null,
  quote_time timestamp not null,
  last numeric(18,6) not null,
  open numeric(18,6) null,
  reference numeric(18,6) null,
  change_pct numeric(18,6) null,
  qty_traded numeric(18,6) null,
  volume_value numeric(18,6) null,
  high numeric(18,6) null,
  low numeric(18,6) null,
  source varchar(64) not null default 'wafabourse',
  created_at timestamptz not null default now(),
  constraint uq_price_snapshot unique(symbol, quote_time)
);
create index idx_price_snapshot_symbol_time on price_snapshot(symbol, quote_time);
