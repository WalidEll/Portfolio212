package com.wellycloud.portfolio.portfolios;

import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.io.IOException;
import java.nio.file.*;
import java.time.Instant;
import java.util.*;

@Component
@RequiredArgsConstructor
public class PortfolioRegistry {
  private final ObjectMapper mapper;

  @Value("${app.portfolios.dir:./data/portfolios}")
  String dir;

  private Path indexPath() {
    return Path.of(dir).resolve("index.json");
  }

  public synchronized List<PortfolioInfo> list() {
    try {
      ensureDir();
      Path idx = indexPath();
      if (!Files.exists(idx)) return List.of(defaultPortfolio());
      List<PortfolioInfo> all = mapper.readValue(Files.readString(idx), new TypeReference<>() {});
      if (all.isEmpty()) return List.of(defaultPortfolio());
      return all;
    } catch (Exception e) {
      return List.of(defaultPortfolio());
    }
  }

  public synchronized PortfolioInfo create(String slug, String name) throws IOException {
    validateSlug(slug);
    ensureDir();

    List<PortfolioInfo> all = new ArrayList<>(list());
    boolean exists = all.stream().anyMatch(p -> p.slug().equals(slug));
    if (exists) return all.stream().filter(p -> p.slug().equals(slug)).findFirst().orElseThrow();

    Path dbPath = Path.of(dir).resolve(slug + ".db");
    // touch file
    if (!Files.exists(dbPath)) Files.createFile(dbPath);

    PortfolioInfo info = new PortfolioInfo(slug, name == null || name.isBlank() ? slug : name, dbPath.toString(), Instant.now().toString());
    all.add(info);

    writeIndex(all);
    return info;
  }

  public Path dbPathFor(String slug) {
    validateSlug(slug);
    return Path.of(dir).resolve(slug + ".db");
  }

  private void writeIndex(List<PortfolioInfo> all) throws IOException {
    Path idx = indexPath();
    Files.writeString(idx, mapper.writerWithDefaultPrettyPrinter().writeValueAsString(all), StandardOpenOption.CREATE, StandardOpenOption.TRUNCATE_EXISTING);
  }

  private void ensureDir() throws IOException {
    Files.createDirectories(Path.of(dir));
    // ensure default exists
    Path def = Path.of(dir).resolve("default.db");
    if (!Files.exists(def)) Files.createFile(def);
  }

  private static void validateSlug(String slug) {
    if (slug == null || !slug.matches("[a-z0-9-]{2,32}")) {
      throw new IllegalArgumentException("Invalid slug. Use [a-z0-9-], 2-32 chars.");
    }
  }

  private PortfolioInfo defaultPortfolio() {
    return new PortfolioInfo("default", "Default", Path.of(dir).resolve("default.db").toString(), "");
  }

  public record PortfolioInfo(String slug, String name, String dbPath, String createdAt) {}
}
