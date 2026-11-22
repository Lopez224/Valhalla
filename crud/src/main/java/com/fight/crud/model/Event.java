package com.fight.crud.model;

import java.time.LocalDate;
import java.util.ArrayList;
import java.util.List;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToMany;
import jakarta.persistence.Table; 

@Entity 
@Table(name = "events")
public class Event {
    @Id 
    @GeneratedValue(strategy= GenerationType.IDENTITY)
    private Integer id; 
    
    @Column(name = "nam")
    private String name; 

    @Column(name = "dat")
    private LocalDate date; 

    @Column(name = "place")
    private String place;  

    @OneToMany(mappedBy = "event", cascade = CascadeType.ALL)
    private List<Fight> fights = new ArrayList<>();

    public Event(){

    }
    public Event(String name, LocalDate date, String place){
        this.name = name; 
        this.date = date; 
        this.place = place; 
    }
    public Integer getId(){
        return id;
    }
    public void setId(Integer id){
        this.id = id; 
    }
    public String getName(){
        return name; 
    }
    public void setName(String name){
        this.name = name; 
    }
    public LocalDate getDate(){
        return date; 
    }
    public void setDate(LocalDate date){
        this.date = date; 
    }
    public String getPlace(){
        return place; 
    }
    public void setPlace(String place){
        this.place = place; 
    }
    public List<Fight> getFights() {
        return fights;
    }

    public void setFights(List<Fight> fights) {
        this.fights = fights;
    }
}
