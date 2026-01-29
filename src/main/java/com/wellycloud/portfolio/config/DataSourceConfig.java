package com.wellycloud.portfolio.config;

import com.wellycloud.portfolio.portfolios.PortfolioDataSourceProvider;
import com.wellycloud.portfolio.portfolios.RoutingDataSource;
import lombok.RequiredArgsConstructor;
import org.springframework.boot.autoconfigure.jdbc.DataSourceProperties;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;

import javax.sql.DataSource;

@Configuration
@RequiredArgsConstructor
public class DataSourceConfig {
  private final PortfolioDataSourceProvider provider;

  @Bean
  public DataSource dataSource(DataSourceProperties ignored) {
    // Ignore Spring's default datasource properties; we route per-request by portfolio slug.
    return new RoutingDataSource(provider);
  }
}
