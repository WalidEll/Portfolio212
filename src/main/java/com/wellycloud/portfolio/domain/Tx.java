package com.wellycloud.portfolio.domain;

import jakarta.persistence.*;
import lombok.*;

import java.math.BigDecimal;
import java.time.Instant;
import java.time.LocalDate;

@Entity
@Table(name = "transactions")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Tx {
  @Id
  @GeneratedValue(strategy = GenerationType.IDENTITY)
  private Long id;

  @Column(name = "trade_date", nullable = false)
  private LocalDate tradeDate;

  @Column(nullable = false, length = 32)
  private String symbol;

  @Enumerated(EnumType.STRING)
  @Column(nullable = false, length = 16)
  private TransactionType type;

  @Column(precision = 18, scale = 6)
  private BigDecimal quantity;

  @Column(precision = 18, scale = 6)
  private BigDecimal price;

  // Used for DIVIDEND/FEE
  @Column(precision = 18, scale = 6)
  private BigDecimal amount;

  @Column(columnDefinition = "text")
  private String note;

  @Column(name = "created_at", nullable = false)
  private Instant createdAt;

  @PrePersist
  void prePersist() {
    if (createdAt == null) createdAt = Instant.now();
  }
}
