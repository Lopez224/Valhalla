/*!
* Start Bootstrap - Shop Homepage v5.0.6 (https://startbootstrap.com/template/shop-homepage)
* Copyright 2013-2023 Start Bootstrap
* Licensed under MIT (https://github.com/StartBootstrap/startbootstrap-shop-homepage/blob/master/LICENSE)
*/

// Script para darle un efecto bonito al navbar
const navbar = document.querySelector("#navbar");

const observer = new IntersectionObserver(
  ([e]) => e.target.classList.toggle("is-pinned", e.intersectionRatio < 1),
  { threshold: [1] }
);

observer.observe(navbar);
// Script para controlar la parte de los eventos 
const NEXT_EVENT_URL = '/api/events/next';

const el = id => document.getElementById(id);
let interval = null;

async function loadNextEvent() {
  try {
    // Peticion HTTP
    const res = await fetch(NEXT_EVENT_URL);

    if (res.status === 204) {
      showNoEvent('No hay eventos próximos');
      return;
    }
    if (!res.ok) throw new Error('No se pudo cargar el evento');

    const ev = await res.json();
    printEvent(ev);
    startCounter(ev.date);

  } catch (error) {
    console.error(error);
    showNoEvent('No se pudo cargar el evento');
  }
}

function fill(campo, valor) {
  document.querySelectorAll(`[data-event="${campo}"]`)
          .forEach(n => n.textContent = valor);
}

function printEvent(ev) {
  fill('name', ev.name);
  fill('place', ev.place ?? '');
  fill('date', new Date(ev.date + 'T00:00:00').toLocaleDateString());

  printFighter('red', ev.redId, ev.redName, ev.redPhoto);
  printFighter('blue', ev.blueId, ev.blueName, ev.bluePhoto);
}

function showNoEvent(mensaje) {
  fill('name', mensaje);
  fill('place', '');
  fill('date', '--');
  el('red-img').style.display = 'none';
  el('blue-img').style.display = 'none';
  el('countdown').style.display = 'none';
}
// Poner el atributo x del peleador en la posicion indicada
function printFighter(color, id, names, photo) {
  const img = el(`${color}-img`);
  const name = el(`${color}-name`);

  if (id === null || id === undefined) {
    img.style.display = 'none';
    name.textContent = 'Por definir';
    return;
  }

  name.textContent = names;

  if (photo) {
    img.src = photo;
    img.alt = names;
    img.style.display = '';
  } else {
    img.style.display = 'none';   
  }
}
// Contador 
function startCounter(fechaISO) {

  const objetivo = new Date(fechaISO + 'T00:00:00').getTime();
  const dos = n => String(n).padStart(2, '0');

  const tick = () => {
    const resto = objetivo - Date.now();

    if (resto <= 0) {
      clearInterval(interval);
      el('countdown').innerHTML = "<p class='big'>Fight day!!!</p>";
      return;
    }

    const seg = Math.floor(resto / 1000);
    el('days').textContent = dos(Math.floor(seg / 86400));
    el('hours').textContent = dos(Math.floor((seg % 86400) / 3600));
    el('minutes').textContent = dos(Math.floor((seg % 3600) / 60));
    el('seconds').textContent = dos(seg % 60);
  };

  tick();
  interval = setInterval(tick, 1000);
}
// Desplegar el formulario para escribir los datos de una tarjeta al pagar entradas
const btn = document.getElementById("btn-toggle");
const form = document.getElementById("card")

  btn.addEventListener("click", () => {
    const isHidden = form.style.display === "none";
    form.style.display = isHidden ? "block" : "none";
    
  });

document.addEventListener('DOMContentLoaded', loadNextEvent);