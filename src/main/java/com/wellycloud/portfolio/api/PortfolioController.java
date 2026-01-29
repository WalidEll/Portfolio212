package com.wellycloud.portfolio.api;

import com.wellycloud.portfolio.api.dto.HoldingDto;
import com.wellycloud.portfolio.repo.InstrumentRepo;
import com.wellycloud.portfolio.service.PortfolioService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/p/{portfolio}")
@RequiredArgsConstructor
public class PortfolioController {
  private final InstrumentRepo instrumentRepo;
  private final PortfolioService portfolioService;

  @SuppressWarnings("unused")
  @PathVariable("portfolio")
  String portfolio;

  @GetMapping("/holdings")
  public List<HoldingDto> holdings() {
    var symbols = instrumentRepo.findAll().stream().map(i -> i.getSymbol()).toList();
    return portfolioService.holdingsForSymbols(symbols);
  }
}
