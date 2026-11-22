const EVENTS_URL = '/api/events';
    const FIGHTERS_URL = '/api/fighters';
    let fighters = [];
    document.addEventListener('DOMContentLoaded', async () => {
        await loadFighter();
        addFight();
        await loadEvents(); 
    });
    async function loadFighter() {
        try {
            const res = await fetch(FIGHTERS_URL);
            if (!res.ok) throw new Error('No se pudieron cargar los peleadores');
            fighters = await res.json();
        } catch (error) {
            console.error(error);
            showStatus(error.message);
        }
    }
    function fighterOptions() {
        return '<option value="">Seleccionar...</option>' +
            fighters.map(f =>
                `<option value="${f.idFighters}">${escapeHTML(f.fullName)} (${escapeHTML(f.nickname)})</option>`
            ).join('');
    }
    function addFight() {
        const container = document.getElementById('fightsContainer');
        const posicion = container.children.length + 1;

        const row = document.createElement('div');
        row.className = 'fight-row';
        row.innerHTML = `
            <div class="form-group">
                <label>Esquina roja:</label>
                <select class="red" required>${fighterOptions()}</select>
            </div>
            <div class="form-group">
                <label>Esquina azul:</label>
                <select class="blue" required>${fighterOptions()}</select>
            </div>
            <div class="form-group">
                <label>Posición:</label>
                <input type="number" class="pos" min="1" value="${posicion}" required>
            </div>
            <div class="form-group">
                <label>Peso pactado:</label>
                <input type="number" class="weight" min="0">
            </div>
            <div class="form-group">
                <label>Valor del contrato:</label>
                <input type="number" class="contract" min="0">
            </div>
            <button type="button" class="btn-delete"
                    onclick="this.closest('.fight-row').remove()">Quitar</button>
        `;
        container.appendChild(row);
    }
    document.getElementById('eventForm').addEventListener('submit', async (e) => {

        e.preventDefault();

        const id = document.getElementById('eventId').value;

        const evento = {
            name: document.getElementById('eventName').value,
            date: document.getElementById('eventDate').value,
            place: document.getElementById('eventPlace').value
        };

        // Solo recoger peleas cuando estamos creando un evento
        let fights = [];

        if (!id) {

            fights = [...document.querySelectorAll('.fight-row')].map(r => ({
                red: r.querySelector('.red').value,
                blue: r.querySelector('.blue').value,
                pos: r.querySelector('.pos').value,
                weight: r.querySelector('.weight').value,
                contract: r.querySelector('.contract').value
            }));

            if (fights.some(f => !f.red || !f.blue)) {
                showStatus('Debes seleccionar los dos peleadores');
                return;
            }

            if (fights.some(f => f.red === f.blue)) {
                showStatus('Un peleador no puede enfrentarse a sí mismo');
                return;
            }
        }

        try {

            const response = await fetch(
                id ? `${EVENTS_URL}/${id}` : EVENTS_URL,
                {
                    method: id ? 'PUT' : 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify(evento)
                }
            );

            if (!response.ok) {
                throw new Error('No se pudo guardar el evento');
            }

            const saved = await response.json();

            // Agregar las peleas al evento recién creado
            if (!id) {

                for (const f of fights) {

                    const params = new URLSearchParams({
                        fighter1Id: f.red,
                        fighter2Id: f.blue,
                        order: f.pos
                    });

                    if (f.weight) params.append('weight', f.weight);
                    if (f.contract) params.append('contract', f.contract);

                    const fightResponse = await fetch(
                        `${EVENTS_URL}/${saved.id}/fights?${params}`,
                        { method: 'POST' }
                    );

                    if (!fightResponse.ok) {
                        throw new Error(
                            'Evento creado, pero falló al agregar una pelea'
                        );
                    }
                }
            }

            showStatus(
                id
                    ? 'Evento actualizado correctamente'
                    : 'Evento registrado correctamente'
            );

            clearEventForm();

            await loadEvents();

        } catch (error) {
            console.error(error);
            showStatus('Error: ' + error.message);
        }
    });

    function escapeHTML(value) {
        if (value === null || value === undefined) return '-';
        return String(value).replace(/[&<>"']/g, c => ({
            '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;'
        })[c]);
    }
    function showStatus(message) {
        document.getElementById('status').textContent = message;
    }
    
    async function loadEvents() {
    try {
        const response = await fetch(EVENTS_URL);

        if (!response.ok) {
            throw new Error('No se pudieron cargar los eventos');
        }

        const events = await response.json();
        const tbody = document.getElementById('eventTableBody');

        tbody.innerHTML = '';

        for (const event of events) {

            const fightsResponse = await fetch(
                `${EVENTS_URL}/${event.id}/fights`
            );

            const fights = fightsResponse.ok
                ? await fightsResponse.json()
                : [];

            tbody.innerHTML += `
                <tr>
                    <td>${escapeHTML(event.id)}</td>
                    <td>${escapeHTML(event.name)}</td>
                    <td>${escapeHTML(event.date)}</td>
                    <td>${escapeHTML(event.place)}</td>
                    <td>${fights.length}</td>

                    <td>
                        <button class="btn-fights"
                            onclick="showFights(${event.id})">
                            Ver peleas
                        </button>

                        <button class="btn-edit"
                            onclick="editEvent(${event.id})">
                            Editar
                        </button>

                        <button class="btn-delete"
                            onclick="deleteEvent(${event.id})">
                            Eliminar
                        </button>
                    </td>
                </tr>

                <tr id="fights-${event.id}" style="display:none">
                    <td colspan="6">
                        <div class="fights-details"
                            id="details-${event.id}">
                        </div>
                    </td>
                </tr>
            `;
        }

    } catch (error) {
        console.error(error);
        showStatus(error.message);
    }
}
// Mostrar las peleas de un evento
async function showFights(eventId) {
    const row = document.getElementById(`fights-${eventId}`);
    if (row.style.display === 'table-row') {
        row.style.display = 'none';
        return;
    }
    row.style.display = 'table-row';
    const container = document.getElementById(`details-${eventId}`);
    container.innerHTML = 'Cargando peleas...';
    try {
        const response = await fetch(
            `${EVENTS_URL}/${eventId}/fights`
        );
        if (!response.ok) {
            throw new Error('No se pudieron cargar las peleas');
        }
        const fights = await response.json();
        if (fights.length === 0) {
            container.innerHTML = '<p>Este evento todavía no tiene peleas.</p>';
            return;
        }
        container.innerHTML = `
            <h3>Cartelera del evento</h3>
            <table>
                <thead>
                    <tr>
                        <th>Orden</th>
                        <th>Esquina roja</th>
                        <th>Esquina azul</th>
                        <th>Peso</th>
                        <th>Contrato</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody>
                    ${fights.map(f => `
                        <tr>
                            <td>${escapeHTML(f.order)}</td>
                            <td>${escapeHTML(f.fighterOne?.fullName)}</td>
                            <td>${escapeHTML(f.fighterTwo?.fullName)}</td>
                            <td>${escapeHTML(f.weight)}</td>
                            <td>${escapeHTML(f.contract)}</td>
                            <td>
                                <button class="btn-edit"
                                    onclick="editFight(${eventId}, ${f.id})">
                                    Editar
                                </button>
                                <button class="btn-delete"
                                    onclick="deleteFight(${eventId}, ${f.id})">
                                    Eliminar
                                </button>
                            </td>
                        </tr>
                    `).join('')}
                </tbody>
            </table>
            <div id="fightEditor-${eventId}"></div>
        `;
    } catch (error) {
        console.error(error);
        showStatus(error.message);
    }
}
async function editEvent(id) {
    try {
        const response = await fetch(`${EVENTS_URL}/${id}`);
        if (!response.ok) {
            throw new Error('No se encontró el evento');
        }
        const event = await response.json();
        document.getElementById('eventId').value = event.id;
        document.getElementById('eventName').value = event.name;
        document.getElementById('eventDate').value = event.date;
        document.getElementById('eventPlace').value = event.place;
        // Al editar el evento no semodifica su cartelera
        document.getElementById('fightsContainer').innerHTML = '';
        document.getElementById('btnSubmit').textContent =
            'Actualizar evento';
        document.getElementById('btnCancel').style.display = 'block';
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    } catch (error) {
        showStatus(error.message);
    }
}
// Eliminar evento
async function deleteEvent(id) {
    if (!confirm('¿Seguro que deseas eliminar este evento y sus peleas?')) {
        return;
    }
    try {
        const response = await fetch(`${EVENTS_URL}/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) {
            throw new Error('No se pudo eliminar el evento');
        }
        showStatus('Evento eliminado correctamente');
        clearEventForm();
        await loadEvents();
    } catch (error) {
        console.error(error);
        showStatus(error.message);
    }
}
function fighterOptions(selectedId = '') {
    return '<option value="">Seleccionar...</option>' +
        fighters.map(f => `
            <option value="${f.idFighters}"
                ${Number(f.idFighters) === Number(selectedId) ? 'selected' : ''}>
                ${escapeHTML(f.fullName)} (${escapeHTML(f.nickname)})
            </option>
        `).join('');
}
// Editar pelea
async function editFight(eventId, fightId) {
    try {
        const response = await fetch(
            `${EVENTS_URL}/${eventId}/fights/${fightId}`
        );
        if (!response.ok) {
            throw new Error('No se encontró la pelea');
        }
        const fight = await response.json();
        const editor = document.getElementById(
            `fightEditor-${eventId}`
        );
        editor.innerHTML = `
            <h3>Editar pelea</h3>
            <div class="fight-row fight-edit-row">
                <div class="form-group">
                    <label>Esquina roja:</label>
                    <select id="editRed">
                        ${fighterOptions(fight.fighterOne.idFighters)}
                    </select>
                </div>
                <div class="form-group">
                    <label>Esquina azul:</label>
                    <select id="editBlue">
                        ${fighterOptions(fight.fighterTwo.idFighters)}
                    </select>
                </div>
                <div class="form-group">
                    <label>Orden:</label>
                    <input type="number" id="editOrder"
                        min="1" value="${fight.order ?? ''}">
                </div>
                <div class="form-group">
                    <label>Peso:</label>
                    <input type="number" id="editWeight"
                        min="0" value="${fight.weight ?? ''}">
                </div>
                <div class="form-group">
                    <label>Contrato:</label>
                    <input type="number" id="editContract"
                        min="0" value="${fight.contract ?? ''}">
                </div>
                <button type="button" class="btn-save"
                    onclick="saveFight(${eventId}, ${fightId})">
                    Guardar
                </button>
            </div>
        `;
    } catch (error) {
        console.error(error);
        showStatus(error.message);
    }
}
// Guardar cambios de una pelea
async function saveFight(eventId, fightId) {
    const red = document.getElementById('editRed').value;
    const blue = document.getElementById('editBlue').value;
    if (!red || !blue) {
        showStatus('Debes seleccionar ambos peleadores');
        return;
    }
    if (red === blue) {
        showStatus('Un peleador no puede enfrentarse a sí mismo');
        return;
    }
    const params = new URLSearchParams({
        fighter1Id: red,
        fighter2Id: blue,
        order: document.getElementById('editOrder').value
    });
    const weight = document.getElementById('editWeight').value;
    const contract = document.getElementById('editContract').value;
    if (weight !== '') params.append('weight', weight);
    if (contract !== '') params.append('contract', contract);
    try {
        const response = await fetch(
            `${EVENTS_URL}/${eventId}/fights/${fightId}?${params}`,
            { method: 'PUT' }
        );
        if (!response.ok) {
            throw new Error('No se pudo actualizar la pelea');
        }
        showStatus('Pelea actualizada correctamente');
        // Recargar las peleas
        const container = document.getElementById(`details-${eventId}`);
        container.innerHTML = '';
        await showFights(eventId);
        await loadEvents();
    } catch (error) {
        console.error(error);
        showStatus(error.message);
    }
}
// Eliminar pelea
async function deleteFight(eventId, fightId) {
    if (!confirm('¿Deseas eliminar esta pelea?')) {
        return;
    }
    try {
        const response = await fetch(
            `${EVENTS_URL}/${eventId}/fights/${fightId}`,
            { method: 'DELETE' }
        );
        if (!response.ok) {
            throw new Error('No se pudo eliminar la pelea');
        }
        showStatus('Pelea eliminada correctamente');
        await loadEvents();
        const container = document.getElementById(`details-${eventId}`);
        container.innerHTML = '';
        await showFights(eventId);
    } catch (error) {
        console.error(error);
        showStatus(error.message);
    }
}
// Limpiar formulario
function clearEventForm() {
    document.getElementById('eventForm').reset();
    document.getElementById('eventId').value = '';
    document.getElementById('fightsContainer').innerHTML = '';
    document.getElementById('btnSubmit').textContent = 'Registrar evento';
    document.getElementById('btnCancel').style.display = 'none';
    addFight();
}
// Cancelar edición
function cancelEventEdit() {
    clearEventForm();
}