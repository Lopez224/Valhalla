package com.fight.crud.repository;
import com.fight.crud.model.Event;

import java.time.LocalDate;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository 
public interface EventRepository extends JpaRepository<Event, Integer>{
    //Contenedor para obtener el evento mas cercano. Se usa optional para que en caso de que no hayan eventos (Null) no explote esta chimbada
    Optional<Event> findFirstByDateGreaterThanEqualOrderByDateAsc(LocalDate date);
}
