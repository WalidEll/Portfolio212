package com.wellycloud.portfolio.service.wafa;

import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.stereotype.Component;
import org.springframework.web.reactive.function.client.WebClient;

import java.util.List;
import java.util.Map;

@Component
@RequiredArgsConstructor
public class WafaBourseClient {
  private final WebClient.Builder webClientBuilder;

  @Value("${app.priceSource.baseUrl}")
  String baseUrl;

  @Value("${app.priceSource.endpointPath}")
  String endpointPath;

  public String fetchValeurIndicators(String symbol, String frequence, int nbr) {
    // Matches the request structure you captured from wafabourse.
    Map<String, Object> payload = Map.of(
        "ACTIONS",
        List.of(
            Map.of(
                "ACTION", Map.of("NAME", "VALEUR-INDICATORS", "TYPE", "SELECT", "VALUE", "VALEUR-INDICATORS"),
                "PARAMS",
                List.of(
                    Map.of("NAME", "Symbol_", "TYPE", "S", "VALUE", symbol),
                    Map.of("NAME", "Frequence_", "TYPE", "S", "VALUE", frequence),
                    Map.of("NAME", "Nbr_", "TYPE", "I", "VALUE", nbr)
                )
            )
        )
    );

    WebClient client = webClientBuilder
        .baseUrl(baseUrl)
        .defaultHeader(HttpHeaders.ACCEPT, MediaType.APPLICATION_JSON_VALUE)
        .defaultHeader(HttpHeaders.CONTENT_TYPE, MediaType.APPLICATION_JSON_VALUE)
        .build();

    return client.post()
        .uri(endpointPath)
        .bodyValue(payload)
        .retrieve()
        .bodyToMono(String.class)
        .block();
  }
}
