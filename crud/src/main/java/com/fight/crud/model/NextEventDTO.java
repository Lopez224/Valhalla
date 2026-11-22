package com.fight.crud.model;

import java.time.LocalDate;
public record NextEventDTO(
    Integer id,
    String name,
    LocalDate date,
    String place,
    Integer redId,
    String redName,
    String redPhoto,
    Integer blueId,
    String blueName,
    String bluePhoto) {
}
