package com.fight.crud.repository;
import com.fight.crud.model.Fight; 

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface FightRepository extends JpaRepository<Fight, Integer>{
    // Metodo para encontrar las peleas por orden, util para el frontend ya que necesita la pelea registrada en la primera posicion
    List<Fight> findByEventIdOrderByOrder(Integer eventId);
}
