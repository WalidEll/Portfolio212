package com.wellycloud.portfolio.api;

import com.wellycloud.portfolio.api.dto.CreateTxRequest;
import com.wellycloud.portfolio.domain.Tx;
import com.wellycloud.portfolio.repo.TxRepo;
import com.wellycloud.portfolio.service.InstrumentService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/p/{portfolio}/transactions")
@RequiredArgsConstructor
public class TxController {
  private final TxRepo repo;
  private final InstrumentService instrumentService;

  @GetMapping
  public List<Tx> list(@PathVariable("portfolio") String portfolio) {
    return repo.findAll();
  }

  @PostMapping
  public Tx create(@PathVariable("portfolio") String portfolio, @Valid @RequestBody CreateTxRequest req) {
    instrumentService.ensureExists(req.symbol());

    Tx tx = Tx.builder()
        .tradeDate(req.tradeDate())
        .symbol(req.symbol())
        .type(req.type())
        .quantity(req.quantity())
        .price(req.price())
        .fee(req.fee())
        .amount(req.amount())
        .note(req.note())
        .build();

    return repo.save(tx);
  }

  @DeleteMapping("/{id}")
  public void delete(@PathVariable("portfolio") String portfolio, @PathVariable Long id) {
    repo.deleteById(id);
  }
}
