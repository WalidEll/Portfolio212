package com.wellycloud.portfolio.repo;

import com.wellycloud.portfolio.domain.Instrument;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface InstrumentRepo extends JpaRepository<Instrument, Long> {
  Optional<Instrument> findBySymbol(String symbol);
}
