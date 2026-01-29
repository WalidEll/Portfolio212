package com.wellycloud.portfolio.portfolios;

import lombok.RequiredArgsConstructor;
import org.springframework.boot.ApplicationArguments;
import org.springframework.boot.ApplicationRunner;
import org.springframework.stereotype.Component;

/**
 * Ensures the portfolios directory and the default SQLite DB file exist at startup.
 * This prevents Hibernate from failing during boot if ./data/portfolios is missing.
 */
@Component
@RequiredArgsConstructor
public class PortfolioStartup implements ApplicationRunner {
  private final PortfolioRegistry registry;

  @Override
  public void run(ApplicationArguments args) {
    // Triggers registry.ensureDir() via list() and creates default.db if needed.
    registry.list();
  }
}
