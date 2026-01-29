package com.wellycloud.portfolio.repo;

import com.wellycloud.portfolio.domain.PriceSnapshot;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDateTime;
import java.util.Optional;

public interface PriceSnapshotRepo extends JpaRepository<PriceSnapshot, Long> {
  Optional<PriceSnapshot> findTopBySymbolOrderByQuoteTimeDesc(String symbol);

  Optional<PriceSnapshot> findBySymbolAndQuoteTime(String symbol, LocalDateTime quoteTime);
}
