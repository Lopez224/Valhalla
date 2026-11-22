package com.fight.crud.model;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.Table; 
import com.fasterxml.jackson.annotation.JsonIgnore;

@Entity
@Table(name = "fights") 
public class Fight {
    @Id 
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id; 

    @ManyToOne
    @JoinColumn(name = "event_id")
    @JsonIgnore
    private Event event; 

    @ManyToOne
    @JoinColumn (name = "red_corner_id")
    private Fighter fighterOne; 

    @ManyToOne
    @JoinColumn (name = "blue_corner_id")
    private Fighter fighterTwo; 

    @Column (name = "orde")
    private Integer order; 

    @Column (name = "agreed_weight")
    private Integer weight; 

    @Column (name = "contract_value")
    private Integer contract; 

    public Fight(){

    }
    public Fight(Event event, Fighter fighterOne, Fighter fighterTwo, Integer order, Integer weight, Integer contract){
        this.event = event; 
        this.fighterOne = fighterOne; 
        this.fighterTwo = fighterTwo; 
        this.order = order; 
        this.weight = weight; 
        this.contract = contract; 
    }
    public Integer getId(){
        return id;
    }
    public void setId(Integer id){
        this.id = id; 
    }
    public Event getEvent(){
        return event; 
    }
    public void setEvent(Event event){
        this.event = event; 
    }
    public Fighter getFighterOne(){
        return fighterOne; 
    }
    public void setFighterOne(Fighter fighter){
        this.fighterOne = fighter; 
    }
    public Fighter getFighterTwo(){
        return fighterTwo; 
    }
    public void setFighterTwo(Fighter fighter){
        this.fighterTwo = fighter; 
    }
    public Integer getOrder(){
        return order; 
    }
    public void setOrder(Integer order){
        this.order = order; 
    }
    public Integer getWeight(){
        return weight; 
    }
    public void setWeight(Integer weight){
        this.weight = weight;
    }
    public Integer getContract(){
        return contract; 
    }
    public void setContract(Integer contract){
        this.contract = contract; 
    }
}
