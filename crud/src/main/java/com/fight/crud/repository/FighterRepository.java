package com.fight.crud.repository;

import com.fight.crud.model.Fighter; 
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface FighterRepository extends JpaRepository<Fighter, Integer>{

}
