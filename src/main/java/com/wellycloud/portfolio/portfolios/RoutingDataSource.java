package com.wellycloud.portfolio.portfolios;

import org.springframework.jdbc.datasource.AbstractDataSource;

import javax.sql.DataSource;
import java.sql.Connection;
import java.sql.SQLException;

public class RoutingDataSource extends AbstractDataSource {
  private final PortfolioDataSourceProvider provider;

  public RoutingDataSource(PortfolioDataSourceProvider provider) {
    this.provider = provider;
  }

  @Override
  public Connection getConnection() throws SQLException {
    return current().getConnection();
  }

  @Override
  public Connection getConnection(String username, String password) throws SQLException {
    return current().getConnection(username, password);
  }

  private DataSource current() {
    String slug = PortfolioContext.get();
    if (slug == null || slug.isBlank()) slug = "default";
    return provider.getDataSource(slug);
  }
}
