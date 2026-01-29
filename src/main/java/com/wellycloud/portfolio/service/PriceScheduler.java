package com.wellycloud.portfolio.service;

import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Component;

@Component
@RequiredArgsConstructor
@Slf4j
public class PriceScheduler {
  private final PriceIngestionService ingestion;

  // Delayed prices are fine; pull once in the afternoon (Morocco time) and once later.
  // You can adjust later for market hours.
  @Scheduled(cron = "0 15 16 * * MON-FRI", zone = "Africa/Casablanca")
  public void refreshAfternoon() {
    int inserted = ingestion.refreshAllDaily();
    log.info("Price refresh inserted {} snapshots", inserted);
  }

  @Scheduled(cron = "0 15 19 * * MON-FRI", zone = "Africa/Casablanca")
  public void refreshEvening() {
    int inserted = ingestion.refreshAllDaily();
    log.info("Price refresh inserted {} snapshots", inserted);
  }
}
