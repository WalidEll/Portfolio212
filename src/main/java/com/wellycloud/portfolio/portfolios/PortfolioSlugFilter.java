package com.wellycloud.portfolio.portfolios;

import jakarta.servlet.FilterChain;
import jakarta.servlet.ServletException;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.stereotype.Component;
import org.springframework.web.filter.OncePerRequestFilter;

import java.io.IOException;

@Component
public class PortfolioSlugFilter extends OncePerRequestFilter {

  @Override
  protected void doFilterInternal(
      HttpServletRequest request,
      HttpServletResponse response,
      FilterChain filterChain
  ) throws ServletException, IOException {

    String path = request.getRequestURI();
    // expected: /api/p/{slug}/...
    String slug = extractSlug(path);

    if (slug != null) {
      PortfolioContext.set(slug);
    } else {
      // For endpoints that don't have a slug (e.g. /api/portfolios), use default
      PortfolioContext.set("default");
    }

    try {
      filterChain.doFilter(request, response);
    } finally {
      PortfolioContext.clear();
    }
  }

  private String extractSlug(String path) {
    if (path == null) return null;
    String prefix = "/api/p/";
    int idx = path.indexOf(prefix);
    if (idx != 0) return null;
    String rest = path.substring(prefix.length());
    int slash = rest.indexOf('/');
    if (slash < 0) return rest.isBlank() ? null : rest;
    String slug = rest.substring(0, slash);
    return slug.isBlank() ? null : slug;
  }
}
