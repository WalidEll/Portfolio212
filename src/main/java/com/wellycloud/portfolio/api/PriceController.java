package com.wellycloud.portfolio.api;

import com.wellycloud.portfolio.api.dto.PriceSnapshotDto;
import com.wellycloud.portfolio.repo.PriceSnapshotRepo;
import com.wellycloud.portfolio.service.PriceIngestionService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/p/{portfolio}/prices")
@RequiredArgsConstructor
public class PriceController {
  private final PriceSnapshotRepo repo;
  private final PriceIngestionService ingestion;

  @SuppressWarnings("unused")
  @PathVariable("portfolio")
  String portfolio;

  @PostMapping("/refresh")
  public int refresh() {
    return ingestion.refreshAllDaily();
  }

  @GetMapping("/latest")
  public List<PriceSnapshotDto> latest() {
    return repo.findAll().stream()
        .collect(java.util.stream.Collectors.groupingBy(p -> p.getSymbol(),
            java.util.stream.Collectors.maxBy(java.util.Comparator.comparing(p -> p.getQuoteTime()))))
        .values().stream()
        .flatMap(java.util.Optional::stream)
        .map(p -> new PriceSnapshotDto(
            p.getSymbol(),
            p.getQuoteTime(),
            p.getLast(),
            p.getOpen(),
            p.getReference(),
            p.getChangePct(),
            p.getQtyTraded(),
            p.getVolumeValue(),
            p.getHigh(),
            p.getLow()
        ))
        .sorted(java.util.Comparator.comparing(PriceSnapshotDto::symbol))
        .toList();
  }
}
