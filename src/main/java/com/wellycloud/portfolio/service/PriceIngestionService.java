package com.wellycloud.portfolio.service;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.wellycloud.portfolio.domain.Instrument;
import com.wellycloud.portfolio.domain.PriceSnapshot;
import com.wellycloud.portfolio.repo.InstrumentRepo;
import com.wellycloud.portfolio.repo.PriceSnapshotRepo;
import com.wellycloud.portfolio.service.wafa.WafaDto;
import com.wellycloud.portfolio.service.wafa.WafaBourseClient;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;

@Service
@RequiredArgsConstructor
@Slf4j
public class PriceIngestionService {
  private static final DateTimeFormatter WAFA_DATE = DateTimeFormatter.ofPattern("dd/MM/yyyy HH:mm:ss");

  private final InstrumentRepo instrumentRepo;
  private final PriceSnapshotRepo priceRepo;
  private final WafaBourseClient client;
  private final ObjectMapper mapper;

  public int refreshAllDaily() {
    List<Instrument> instruments = instrumentRepo.findAll();
    int inserted = 0;

    for (Instrument i : instruments) {
      try {
        inserted += refreshSymbolDaily(i.getSymbol());
      } catch (Exception e) {
        log.warn("Failed to refresh {}: {}", i.getSymbol(), e.getMessage());
      }
    }

    return inserted;
  }

  public int refreshSymbolDaily(String symbol) throws Exception {
    String json = client.fetchValeurIndicators(symbol, "D", 1);

    // Response is an array: [ { "VALEUR-INDICATORS": { ... } } ]
    List<WafaDto.Root> roots = mapper.readValue(json, new TypeReference<>() {});
    if (roots.isEmpty() || roots.get(0).valeurIndicators() == null || !roots.get(0).valeurIndicators().valid()) {
      return 0;
    }

    var data = roots.get(0).valeurIndicators().data();
    if (data == null || data.isEmpty()) return 0;
    WafaDto.Item item = data.get(0);

    // update instrument name if missing
    instrumentRepo.findBySymbol(symbol).ifPresent(inst -> {
      if (inst.getName() == null && item.libelle() != null) {
        inst.setName(item.libelle().trim());
        instrumentRepo.save(inst);
      }
    });

    LocalDateTime quoteTime = LocalDateTime.parse(item.dateDernierCours(), WAFA_DATE);

    boolean exists = priceRepo.findBySymbolAndQuoteTime(symbol, quoteTime).isPresent();
    if (exists) return 0;

    PriceSnapshot snap = PriceSnapshot.builder()
        .symbol(symbol)
        .quoteTime(quoteTime)
        .last(item.dernierCours())
        .open(item.ouverture())
        .reference(item.coursDeReferance())
        .changePct(item.variation())
        .qtyTraded(item.qteEchangee())
        .volumeValue(item.volume())
        .high(item.plusHaut())
        .low(item.plusBas())
        .source("wafabourse")
        .build();

    priceRepo.save(snap);
    return 1;
  }
}
