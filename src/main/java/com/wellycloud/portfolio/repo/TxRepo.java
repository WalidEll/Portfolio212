package com.wellycloud.portfolio.repo;

import com.wellycloud.portfolio.domain.Tx;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface TxRepo extends JpaRepository<Tx, Long> {
  List<Tx> findAllBySymbolOrderByTradeDateAscIdAsc(String symbol);

  List<Tx> findAllByTradeDateBetween(LocalDate from, LocalDate to);
}
