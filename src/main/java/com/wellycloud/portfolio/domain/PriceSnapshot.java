package com.wellycloud.portfolio.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDateTime;

@Entity
@Table(
    name = "price_snapshot",
    uniqueConstraints = @UniqueConstraint(name = "uq_price_snapshot", columnNames = {"symbol", "quote_time"})
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class PriceSnapshot {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(nullable = false, length = 32)
  private String symbol;

  @Column(name = "quote_time", nullable = false)
  private LocalDateTime quoteTime;

  @Column(nullable = false, precision = 18, scale = 6)
  private BigDecimal last;

  @Column(precision = 18, scale = 6)
  private BigDecimal open;

  @Column(name = "reference", precision = 18, scale = 6)
  private BigDecimal reference;

  @Column(name = "change_pct", precision = 18, scale = 6)
  private BigDecimal changePct;

  @Column(name = "qty_traded", precision = 18, scale = 6)
  private BigDecimal qtyTraded;

  @Column(name = "volume_value", precision = 18, scale = 6)
  private BigDecimal volumeValue;

  @Column(precision = 18, scale = 6)
  private BigDecimal high;

  @Column(precision = 18, scale = 6)
  private BigDecimal low;

  @Column(nullable = false, length = 64)
  private String source;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @PrePersist
  void prePersist() {
    if (createdAt == null) createdAt = Instant.now();
    if (source == null) source = "wafabourse";
  }
}
