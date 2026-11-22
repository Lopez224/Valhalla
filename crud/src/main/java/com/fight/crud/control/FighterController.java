package com.fight.crud.control;

import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.multipart.MultipartFile;
import org.springframework.web.bind.annotation.RequestParam;

import java.util.List;
import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.UUID;

import com.fight.crud.model.Fighter; 
import com.fight.crud.repository.FighterRepository;



@RestController
@RequestMapping("/api/fighters")
public class FighterController {
    private final FighterRepository repository; 

    public FighterController(FighterRepository repository){
        this.repository = repository; 
    }
    //Esto es un endpoint
    @GetMapping
    public List<Fighter> getFighter() {
        return repository.findAll(); 
    }
    @GetMapping("/{id}")    
    public Fighter getById(@PathVariable Integer id) {
        return repository.findById(id)
            .orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Peleador no encontrado"
            ));
    }
    //endpoint para almacenar un nuevo peleador (post: http://localhost:8080/api/fighter/{id})
    @PostMapping
    public Fighter saveFighter(@RequestBody Fighter fighter) {
        return repository.save(fighter); 
    }
    @PutMapping("/{id}")
    public Fighter update(@PathVariable Integer id, @RequestBody Fighter updatedFighter){
        Fighter fighter = getById(id);

        fighter.setFullName(updatedFighter.getFullName());
        fighter.setNickname(updatedFighter.getNickname());
        fighter.setNationality(updatedFighter.getNationality());
        fighter.setCombatStyle(updatedFighter.getCombatStyle());
        fighter.setBase(updatedFighter.getBase());
        fighter.setAge(updatedFighter.getAge());
        fighter.setHeight(updatedFighter.getHeight());
        fighter.setReach(updatedFighter.getReach());
        fighter.setPpv(updatedFighter.getPpv());
        fighter.setShowPayment(updatedFighter.getShowPayment());
        fighter.setPromoter(updatedFighter.getPromoter());
        fighter.setRecord(updatedFighter.getRecord());
        fighter.setPhoto(updatedFighter.getPhoto()); 
        return repository.save(fighter);
    }
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Integer id){
        Fighter fighte = getById(id); 
        repository.delete(fighte); 
    }
    @PostMapping("/{id}/foto")
    public Fighter uploadPhoto(@PathVariable Integer id, @RequestParam("foto") MultipartFile photo) throws IOException{
        Fighter fighter = repository.findById(id).orElseThrow(() -> new RuntimeException("No se encontro el peleador")); 

        if (photo.isEmpty()){
            throw new RuntimeException("No se ha seleccionado ninguna imagen"); 
        }

        if (photo.getContentType() == null || !photo.getContentType().startsWith("image/")){
            throw new RuntimeException("El archivo debe ser una imagen"); 
        }

        String extension = ""; 

        String originalName = photo.getOriginalFilename(); 
        if (originalName != null && originalName.contains(".")){
            extension = originalName.substring(originalName.lastIndexOf(".")); 
        }
        if (!extension.matches("(?i)\\.(png)")){
            throw new RuntimeException("Formato de imagen no permitido"); 
        }

        String fileName = UUID.randomUUID() + extension; 
        Path directory = Paths.get("uploads/fighters"); 
        Files.createDirectories(directory); 
        Path filePath = directory.resolve(fileName); 
        Files.copy(photo.getInputStream(), filePath); 
        fighter.setPhoto("/uploads/fighters/" + fileName); 
        return repository.save(fighter); 
    }
}