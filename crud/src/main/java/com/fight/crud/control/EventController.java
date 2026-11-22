package com.fight.crud.control;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.web.bind.annotation.RequestParam;

import java.time.LocalDate;
import java.util.List;
import java.util.Comparator;
import com.fight.crud.model.Event;
import com.fight.crud.model.Fight;
import com.fight.crud.model.Fighter;
import com.fight.crud.model.NextEventDTO; 
import com.fight.crud.repository.EventRepository;
import com.fight.crud.repository.FightRepository;
import com.fight.crud.repository.FighterRepository;

@RestController 
@RequestMapping("/api/events")
public class EventController {
    private final EventRepository eventRepository; 
    private final FightRepository fightRepository; 
    private final FighterRepository fighterRepository;

    public EventController(EventRepository eventRepository, FightRepository fightRepository, FighterRepository fighterRepository){
        this.eventRepository = eventRepository; 
        this.fightRepository = fightRepository; 
        this.fighterRepository = fighterRepository; 
    }

    @GetMapping 
    public List<Event> getAll(){
        return eventRepository.findAll();
    }
    @GetMapping("/{id}") 
    public Event searchId(@PathVariable Integer id){
        return eventRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Evento no encontrado"
            ));
    }
    @PostMapping 
    public Event create(@RequestBody Event event){
        return eventRepository.save(event); 
    }
    @PutMapping("/{id}")
    public Event update(@PathVariable Integer id, @RequestBody Event updatedEvent){
        Event event = searchId(id);
        event.setName(updatedEvent.getName());
        event.setDate(updatedEvent.getDate());
        event.setPlace(updatedEvent.getPlace());
        return eventRepository.save(event);
    }
    @DeleteMapping("/{id}") 
    public void delete(@PathVariable Integer id){
        Event event = searchId(id); 
        eventRepository.delete(event); 
    }
     // Agregar una pelea a un evento
    @PostMapping("/{eventId}/fights")
    public Fight addFight(@PathVariable Integer eventId, @RequestParam Integer fighter1Id, @RequestParam Integer fighter2Id, @RequestParam(required = false) Integer order, @RequestParam(required = false) Integer weight, @RequestParam(required = false) Integer contract) {
        Event event = eventRepository.findById(eventId).orElseThrow();
        Fighter f1 = fighterRepository.findById(fighter1Id).orElseThrow();
        Fighter f2 = fighterRepository.findById(fighter2Id).orElseThrow();
        Fight fight = new Fight();
        fight.setEvent(event);
        fight.setFighterOne(f1);
        fight.setFighterTwo(f2);
        fight.setOrder(order);
        fight.setWeight(weight);
        fight.setContract(contract);
        return fightRepository.save(fight);
    }

    // Ver las peleas de un evento
    @GetMapping("/{eventId}/fights")
    public List<Fight> getFights(@PathVariable Integer eventId) {
        return fightRepository.findByEventIdOrderByOrder(eventId);
    }
    @GetMapping("/{eventId}/fights/{fightId}") 
    public Fight searchFightId(@PathVariable Integer id){
        return fightRepository.findById(id).orElseThrow(() -> new ResponseStatusException(
                HttpStatus.NOT_FOUND,
                "Pelea no encontrada"
            ));
    }
    @PutMapping("/{eventId}/fights/{fightId}")
    public Fight update(@PathVariable Integer id, @RequestBody Fight updatedFight){
        Fight fight = searchFightId(id);
        fight.setFighterOne(updatedFight.getFighterOne());
        fight.setFighterTwo(updatedFight.getFighterTwo());
        fight.setOrder(updatedFight.getOrder());
        fight.setWeight(updatedFight.getWeight());
        fight.setContract(updatedFight.getContract()); 
        return fightRepository.save(fight);
    }
    @DeleteMapping("/{eventId}/fights/{fightId}") 
    public void deleteFight(@PathVariable Integer id){
        Fight fight = searchFightId(id); 
        fightRepository.delete(fight); 
    }

    // Metodo para obtener el evento mas cercano a la fecha aactual
    @GetMapping("/next")
    public ResponseEntity<NextEventDTO> getNext() {
        return eventRepository
            .findFirstByDateGreaterThanEqualOrderByDateAsc(LocalDate.now())
            .map(event -> {
                Fight main = event.getFights().stream()
                        .filter(f -> f.getOrder() != null)
                        .min(Comparator.comparing(Fight::getOrder))
                        .orElse(null);
                Integer redId = null, blueId = null;
                String redName = null, blueName = null, redPhoto = null, bluePhoto = null;
                if (main != null) {
                    Fighter red = main.getFighterOne();
                    Fighter blue = main.getFighterTwo();

                    redId = red.getIdFighters();
                    redName = red.getFullName();
                    redPhoto = red.getPhoto();

                    blueId = blue.getIdFighters();
                    blueName = blue.getFullName();
                    bluePhoto = blue.getPhoto();
                }
                return ResponseEntity.ok(new NextEventDTO(
                        event.getId(), event.getName(), event.getDate(), event.getPlace(),
                        redId, redName, redPhoto,
                        blueId, blueName, bluePhoto));
            })
            .orElseGet(() -> ResponseEntity.noContent().build());
        }
}
