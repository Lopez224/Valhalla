package com.fight.crud.model;

import java.math.BigDecimal;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table; 

@Entity
@Table(name = "fighter")
public class Fighter {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "`idFighters`")
    private Integer idFighters;  

    @Column(name = "Nombre Completo")
    private String fullName;

    @Column(name = "Apodo")
    private String nickname;

    @Column(name = "Nacionalidad")
    private String nationality;

    @Column(name = "Estilo de combate")
    private String combatStyle;

    @Column(name = "Base")
    private String base;

    @Column(name = "Edad")
    private Integer age;

    @Column(name = "Altura")
    private BigDecimal height;

    @Column(name = "Alcance")
    private BigDecimal reach;

    @Column(name = "PPV")
    private BigDecimal ppv;

    @Column(name = "Show Payment")
    private Integer showPayment;

    @Column(name = "Promotora")
    private String promoter;

    @Column(name = "Record")
    private String record;
    @Column(name = "Foto")
    private String photo; 
    
    public Fighter() {
    }

    public Fighter(String fullName, String nickname, String nationality, String combatStyle, String base, Integer age, BigDecimal height, BigDecimal reach, BigDecimal ppv, Integer showPayment, String promoter, String record) {
        this.fullName = fullName;
        this.nickname = nickname;
        this.nationality = nationality;
        this.combatStyle = combatStyle;
        this.base = base;
        this.age = age;
        this.height = height;
        this.reach = reach;
        this.ppv = ppv;
        this.showPayment = showPayment;
        this.promoter = promoter;
        this.record = record;
    }

    // Getters y Setters
    public Integer getIdFighters() {
        return idFighters;
    }

    public void setIdFighters(Integer idFighters) {
        this.idFighters = idFighters;
    }

    public String getFullName() {
        return fullName;
    }

    public void setFullName(String fullName) {
        this.fullName = fullName;
    }

    public String getNickname() {
        return nickname;
    }

    public void setNickname(String nickname) {
        this.nickname = nickname;
    }

    public String getNationality() {
        return nationality;
    }

    public void setNationality(String nationality) {
        this.nationality = nationality;
    }

    public String getCombatStyle() {
        return combatStyle;
    }

    public void setCombatStyle(String combatStyle) {
        this.combatStyle = combatStyle;
    }

    public String getBase() {
        return base;
    }

    public void setBase(String base) {
        this.base = base;
    }

    public Integer getAge() {
        return age;
    }

    public void setAge(Integer age) {
        this.age = age;
    }

    public BigDecimal getHeight() {
        return height;
    }

    public void setHeight(BigDecimal height) {
        this.height = height;
    }

    public BigDecimal getReach() {
        return reach;
    }

    public void setReach(BigDecimal reach) {
        this.reach = reach;
    }

    public BigDecimal getPpv() {
        return ppv;
    }

    public void setPpv(BigDecimal ppv) {
        this.ppv = ppv;
    }

    public Integer getShowPayment() {
        return showPayment;
    }

    public void setShowPayment(Integer showPayment) {
        this.showPayment = showPayment;
    }

    public String getPromoter() {
        return promoter;
    }

    public void setPromoter(String promoter) {
        this.promoter = promoter;
    }

    public String getRecord() {
        return record;
    }

    public void setRecord(String record) {
        this.record = record;
    }
    public String getPhoto(){
        return photo; 
    }
    public void setPhoto(String photo){
        this.photo = photo; 
    }
}
