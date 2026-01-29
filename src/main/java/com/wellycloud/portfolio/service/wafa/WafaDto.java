package com.wellycloud.portfolio.service.wafa;

import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;
import java.util.List;

public class WafaDto {

  public record Root(
      @JsonProperty("VALEUR-INDICATORS") ValeurIndicators valeurIndicators
  ) {}

  public record ValeurIndicators(
      @JsonProperty("Valid") boolean valid,
      @JsonProperty("Data") List<Item> data
  ) {}

  public record Item(
      @JsonProperty("Symbol") String symbol,
      @JsonProperty("Libelle") String libelle,
      @JsonProperty("CoursDeReferance") BigDecimal coursDeReferance,
      @JsonProperty("DernierCours") BigDecimal dernierCours,
      @JsonProperty("Ouverture") BigDecimal ouverture,
      @JsonProperty("DateDernierCours") String dateDernierCours,
      @JsonProperty("Variation") BigDecimal variation,
      @JsonProperty("QteEchangee") BigDecimal qteEchangee,
      @JsonProperty("Volume") BigDecimal volume,
      @JsonProperty("PlusHaut") BigDecimal plusHaut,
      @JsonProperty("PlusBas") BigDecimal plusBas
  ) {}
}
