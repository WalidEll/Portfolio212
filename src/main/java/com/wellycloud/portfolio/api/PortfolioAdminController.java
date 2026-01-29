package com.wellycloud.portfolio.api;

import com.wellycloud.portfolio.portfolios.PortfolioRegistry;
import jakarta.validation.constraints.NotBlank;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/portfolios")
@RequiredArgsConstructor
public class PortfolioAdminController {
  private final PortfolioRegistry registry;

  @GetMapping
  public List<PortfolioRegistry.PortfolioInfo> list() {
    return registry.list();
  }

  public record CreatePortfolioRequest(@NotBlank String slug, String name) {}

  @PostMapping
  public PortfolioRegistry.PortfolioInfo create(@RequestBody CreatePortfolioRequest req) throws IOException {
    return registry.create(req.slug(), req.name());
  }
}
