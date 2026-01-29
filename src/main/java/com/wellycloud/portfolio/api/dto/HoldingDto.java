package com.wellycloud.portfolio.api.dto;

import java.math.BigDecimal;

public record HoldingDto(
    String symbol,
    BigDecimal shares,
    BigDecimal avgCost,
    BigDecimal invested,
    BigDecimal lastPrice,
    BigDecimal marketValue,
    BigDecimal unrealizedPnl,
    BigDecimal realizedPnl,
    BigDecimal dividends,
    BigDecimal fees
) {}
