package com.wellycloud.portfolio.service;

import com.wellycloud.portfolio.domain.Instrument;
import com.wellycloud.portfolio.repo.InstrumentRepo;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class InstrumentService {
  private final InstrumentRepo repo;

  public Instrument ensureExists(String symbol) {
    return repo.findBySymbol(symbol)
        .orElseGet(() -> repo.save(Instrument.builder().symbol(symbol).build()));
  }
}
