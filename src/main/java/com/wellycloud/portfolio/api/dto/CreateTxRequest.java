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
    BigDecimal quantity,
    BigDecimal price,
    /** Optional fee (MAD) to apply to BUY/SELL transactions. */
    BigDecimal fee,
    /** Used for DIVIDEND/FEE transaction types (MAD). */
    BigDecimal amount,
    String note
) {}
