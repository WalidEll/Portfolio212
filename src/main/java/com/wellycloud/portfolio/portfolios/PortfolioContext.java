package com.wellycloud.portfolio.portfolios;

public final class PortfolioContext {
  private static final ThreadLocal<String> CURRENT = new ThreadLocal<>();

  private PortfolioContext() {}

  public static void set(String slug) {
    CURRENT.set(slug);
  }

  public static String get() {
    return CURRENT.get();
  }

  public static void clear() {
    CURRENT.remove();
  }
}
