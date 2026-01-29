package com.wellycloud.portfolio.service;

import com.wellycloud.portfolio.api.dto.HoldingDto;
import com.wellycloud.portfolio.domain.PriceSnapshot;
import com.wellycloud.portfolio.domain.TransactionType;
import com.wellycloud.portfolio.domain.Tx;
import com.wellycloud.portfolio.repo.PriceSnapshotRepo;
import com.wellycloud.portfolio.repo.TxRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.*;

@Service
@RequiredArgsConstructor
public class PortfolioService {
  private final TxRepo txRepo;
  private final PriceSnapshotRepo priceRepo;

  public List<HoldingDto> holdingsForSymbols(Collection<String> symbols) {
    List<HoldingDto> out = new ArrayList<>();
    for (String symbol : symbols) {
      out.add(holding(symbol));
    }
    out.sort(Comparator.comparing(HoldingDto::symbol));
    return out;
  }

  public HoldingDto holding(String symbol) {
    List<Tx> txs = txRepo.findAllBySymbolOrderByTradeDateAscIdAsc(symbol);

    BigDecimal shares = BigDecimal.ZERO;
    BigDecimal avgCost = BigDecimal.ZERO; // weighted
    BigDecimal realized = BigDecimal.ZERO;
    BigDecimal dividends = BigDecimal.ZERO;
    BigDecimal fees = BigDecimal.ZERO;

    for (Tx tx : txs) {
      switch (tx.getType()) {
        case BUY -> {
          BigDecimal qty = nz(tx.getQuantity());
          BigDecimal price = nz(tx.getPrice());
          if (qty.signum() == 0) break;
          BigDecimal totalCost = avgCost.multiply(shares).add(price.multiply(qty));
          shares = shares.add(qty);
          avgCost = shares.signum() == 0 ? BigDecimal.ZERO : totalCost.divide(shares, 6, RoundingMode.HALF_UP);
        }
        case SELL -> {
          BigDecimal qty = nz(tx.getQuantity());
          BigDecimal price = nz(tx.getPrice());
          if (qty.signum() == 0) break;
          BigDecimal pnl = price.subtract(avgCost).multiply(qty);
          realized = realized.add(pnl);
          shares = shares.subtract(qty);
          if (shares.signum() <= 0) {
            shares = BigDecimal.ZERO;
            avgCost = BigDecimal.ZERO;
          }
        }
        case DIVIDEND -> dividends = dividends.add(nz(tx.getAmount()));
        case FEE -> fees = fees.add(nz(tx.getAmount()));
      }
    }

    BigDecimal invested = avgCost.multiply(shares);

    Optional<PriceSnapshot> lastSnap = priceRepo.findTopBySymbolOrderByQuoteTimeDesc(symbol);
    BigDecimal lastPrice = lastSnap.map(PriceSnapshot::getLast).orElse(BigDecimal.ZERO);
    BigDecimal marketValue = lastPrice.multiply(shares);
    BigDecimal unrealized = marketValue.subtract(invested);

    return new HoldingDto(
        symbol,
        shares,
        avgCost,
        invested,
        lastPrice,
        marketValue,
        unrealized,
        realized,
        dividends,
        fees
    );
  }

  private static BigDecimal nz(BigDecimal v) {
    return v == null ? BigDecimal.ZERO : v;
  }
}
