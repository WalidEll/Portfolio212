package com.wellycloud.portfolio.api.dto;

import com.wellycloud.portfolio.domain.TransactionType;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;
import java.time.LocalDate;

public record CreateTxRequest(
    @NotNull LocalDate tradeDate,
    @NotBlank String symbol,
    @NotNull TransactionType type,
    /** Shares for BUY/SELL. */
    BigDecimal quantity,
    /** Price per share for BUY/SELL (optional if total is provided). */
    BigDecimal price,
    /** Total cost/proceeds for BUY/SELL (optional; used to derive avg price per share). */
    BigDecimal total,
    /** Amount (MAD) for DIVIDEND/FEE types. */
    BigDecimal amount,
    String note
) {}
