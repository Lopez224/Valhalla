const API_URL = '/api/fighters';
    let fighters = [];
    document.addEventListener('DOMContentLoaded', getFighters);
    // Obtener y listar peleadores
    async function getFighters() {
        try {
            const response = await fetch(API_URL);
            if (!response.ok) {
                throw new Error('No se pudieron obtener los peleadores');
            }

            fighters = await response.json();
            const tbody = document.getElementById('fighterTableBody');
            tbody.innerHTML = '';
            fighters.forEach(f => {

                tbody.innerHTML += `
                    <tr>
                        <td>${escapeHTML(f.idFighters)}</td>
                        <td>${escapeHTML(f.fullName)}</td>
                        <td>${escapeHTML(f.nickname)}</td>
                        <td>${escapeHTML(f.nationality)}</td>
                        <td>${escapeHTML(f.combatStyle)}</td>
                        <td>${escapeHTML(f.base)}</td>
                        <td>${escapeHTML(f.age)}</td>
                        <td>${escapeHTML(f.height)}</td>
                        <td>${escapeHTML(f.reach)}</td>
                        <td>${escapeHTML(f.ppv)}</td>
                        <td>${escapeHTML(f.showPayment)}</td>
                        <td>${escapeHTML(f.promoter)}</td>
                        <td>${escapeHTML(f.record)}</td>

                        <td>
                            <button class="btn-edit"
                                    data-id="${f.idFighters}">
                                Editar
                            </button>

                            <button class="btn-delete"
                                    data-id="${f.idFighters}">
                                Eliminar
                            </button>
                        </td>
                    </tr>
                `;

            });

            tbody.querySelectorAll('.btn-edit').forEach(button => {
                button.addEventListener('click', () => {
                    getEdition(Number(button.dataset.id));
                });
            });

            tbody.querySelectorAll('.btn-delete').forEach(button => {
                button.addEventListener('click', () => {
                    elimineFighter(Number(button.dataset.id));
                });
            });

            showStatus('');
        } catch (error) {
            console.error(error);
            showStatus('Error al cargar los peleadores');
        }
    }
    // Registrar o actualizar peleador
    document.getElementById('fighterForm')
        .addEventListener('submit', async (e) => {
            e.preventDefault();
            const id = document.getElementById('fighterId').value;
            const fighter = {
                nombreCompleto: document.getElementById('nombreCompleto').value,
                apodo: document.getElementById('apodo').value,
                nacionalidad: document.getElementById('nacionalidad').value,
                estiloDeCombate: document.getElementById('estiloDeCombate').value,
                base: document.getElementById('base').value,
                edad: Number(document.getElementById('edad').value),
                altura: Number(document.getElementById('altura').value),
                alcance: Number(document.getElementById('alcance').value),
                ppv: Number(document.getElementById('ppv').value),
                showPayment: Number(document.getElementById('showPayment').value),
                promotora: document.getElementById('promotora').value,
                record: document.getElementById('record').value
            };
            try {
                const url = id ? `${API_URL}/${id}` : API_URL;
                const method = id ? 'PUT' : 'POST';
                const response = await fetch(url, {
                    method: method,

                    headers: {
                        'Content-Type': 'application/json'
                    },

                    body: JSON.stringify(fighter)
                });

                if (!response.ok) {
                    const error = await response.text();
                    throw new Error(error || 'Error al guardar el peleador');
                }
                
                const savedFighter = await response.json();
                const fighterId = id || savedFighter.idFighters;

                
                const fotoInput = document.getElementById('foto');

                if (fotoInput.files.length > 0) {

                    const formData = new FormData();

                    formData.append('foto', fotoInput.files[0]);
                    const fotoResponse = await fetch(
                        `${API_URL}/${fighterId}/foto`,
                        {
                            method: 'POST',
                            body: formData
                        }
                    );
                    if (!fotoResponse.ok) {
                        throw new Error(
                            'Peleador guardado, pero hubo un error al subir la foto'
                        );
                    }
                }
                showStatus(
                    id ? 'Peleador actualizado correctamente'
                       : 'Peleador registrado correctamente'
                );
                clearForm();
                await getFighters();
            } catch (error) {
                console.error(error);
                showStatus('Error al guardar: ' + error.message);
            }
        });
    // Preparar edición
    function getEdition(id) {
        const fighter = fighters.find(f => f.idFighters === id);
        if (!fighter) {
            showStatus('No se encontró el peleador');
            return;
        }
        document.getElementById('fighterId').value = fighter.idFighters;
        document.getElementById('nombreCompleto').value = fighter.fullName ?? '';
        document.getElementById('apodo').value = fighter.nickname ?? '';
        document.getElementById('nacionalidad').value = fighter.nationality ?? '';
        document.getElementById('estiloDeCombate').value = fighter.combatStyle ?? '';
        document.getElementById('base').value = fighter.base ?? '';
        document.getElementById('edad').value = fighter.age ?? '';
        document.getElementById('altura').value = fighter.height ?? '';
        document.getElementById('alcance').value = fighter.reach ?? '';
        document.getElementById('ppv').value = fighter.ppv ?? '';
        document.getElementById('showPayment').value = fighter.showPayment ?? '';
        document.getElementById('promotora').value = fighter.promoter ?? '';
        document.getElementById('record').value = fighter.record ?? '';
        document.getElementById('btnSubmit').textContent =
            'Actualizar peleador';
        document.getElementById('btnCancel').style.display = 'block';
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    // Limpiar formulario
    function clearForm() {
        document.getElementById('fighterForm').reset();
        document.getElementById('fighterId').value = '';
        document.getElementById('btnSubmit').textContent =
            'Registrar peleador';
        document.getElementById('btnCancel').style.display = 'none';
    }
    // Eliminar peleador
    async function elimineFighter(id) {
        if (!confirm('¿Estás seguro de eliminar este peleador?')) {
            return;
        }
        try {
            const response = await fetch(`${API_URL}/${id}`, {
                method: 'DELETE'
            });
            if (!response.ok) {
                throw new Error('No se pudo eliminar el peleador');
            }
            showStatus('Peleador eliminado correctamente');
            clearForm();
            await getFighters();
        } catch (error) {
            console.error(error);
            showStatus(error.message);
        }
    }
    // Evitar interpretar datos recibidos como HTML
    function escapeHTML(value) {
        if (value === null || value === undefined) {
            return '-';
        }
        return String(value).replace(/[&<>"']/g, char => ({
            '&': '&amp;',
            '<': '&lt;',
            '>': '&gt;',
            '"': '&quot;',
            "'": '&#39;'
        })[char]);
    }
    // Mostrar mensajes
    function showStatus(message) {
        document.getElementById('status').textContent = message;
    }