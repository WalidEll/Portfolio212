package com.wellycloud.portfolio.portfolios;

import lombok.RequiredArgsConstructor;
import org.sqlite.SQLiteDataSource;
import org.springframework.stereotype.Component;

import javax.sql.DataSource;
import java.nio.file.Path;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Component
@RequiredArgsConstructor
public class PortfolioDataSourceProvider {
  private final PortfolioRegistry registry;

  private final Map<String, DataSource> cache = new ConcurrentHashMap<>();

  public DataSource getDataSource(String slug) {
    return cache.computeIfAbsent(slug, this::create);
  }

  private DataSource create(String slug) {
    Path dbPath = registry.dbPathFor(slug);
    SQLiteDataSource ds = new SQLiteDataSource();
    ds.setUrl("jdbc:sqlite:" + dbPath.toAbsolutePath());
    return ds;
  }
}
