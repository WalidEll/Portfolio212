package com.wellycloud.portfolio.api.dto;

import java.math.BigDecimal;
import java.time.LocalDateTime;

public record PriceSnapshotDto(
    String symbol,
    LocalDateTime quoteTime,
    BigDecimal last,
    BigDecimal open,
    BigDecimal reference,
    BigDecimal changePct,
    BigDecimal qtyTraded,
    BigDecimal volumeValue,
    BigDecimal high,
    BigDecimal low
) {}
