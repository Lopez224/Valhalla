const API_URL = '/api/fighters';
        let fighters = [];
        const fightersList = document.getElementById('fightersList');
        const totalFighters = document.getElementById('totalFighters');
        const searchInput = document.getElementById('searchFighter');
        const emptyMessage = document.getElementById('emptyMessage');
        const loadingMessage = document.getElementById('loadingMessage');
        // Obtener peleadores desde Spring Boot
        async function getFighters() {
            try {
                const response = await fetch(API_URL);
                if (!response.ok) {
                    throw new Error('No se pudieron cargar los peleadores');
                }
                fighters = await response.json();
                loadingMessage.hidden = true;
                renderFighters(fighters);
            } catch (error) {
                console.error(error);
                loadingMessage.textContent =
                    'Error al conectar con el servidor';
            }
        }
        // Generar tarjetas de peleadores
        function renderFighters(list) {
            fightersList.innerHTML = '';
            totalFighters.textContent = list.length;
            emptyMessage.hidden = list.length !== 0;
            list.forEach(fighter => {
                const card = document.createElement('li');
                card.className = 'fighter-card';
                const photoContainer = document.createElement('div');
                photoContainer.className = 'fighter-photo';
                const photo = document.createElement('img');
                photo.src = fighter.photo || '/images/fighter-placeholder.png';
                photo.alt = `Fotografía de ${fighter.fullName}`;
                photo.onerror = function () {
                    this.onerror = null;
                    this.src = '/images/fighter-placeholder.png';
                };
                photoContainer.appendChild(photo);
                const fighterText = document.createElement('div');
                fighterText.className = 'fighter-text';
                const name = document.createElement('h3');
                name.textContent = fighter.fullName || 'Nombre desconocido';
                const nickname = document.createElement('p');
                nickname.className = 'fighter-nickname';
                nickname.textContent = fighter.nickname || 'Sin apodo';
                const record = document.createElement('p');
                record.className = 'fighter-record';
                record.textContent = `RECORD: ${fighter.record || 'Sin registro'}`;
                fighterText.appendChild(name);
                fighterText.appendChild(nickname);
                fighterText.appendChild(record);
                card.appendChild(photoContainer);
                card.appendChild(fighterText);
                fightersList.appendChild(card);
            });
        }
        // Buscar/filtrar peleadores
        searchInput.addEventListener('input', () => {
            const search = searchInput.value.toLowerCase().trim();
            const filteredFighters = fighters.filter(fighter => {
                return (
                    (fighter.nombreCompleto || '').toLowerCase().includes(search) ||
                    (fighter.apodo || '').toLowerCase().includes(search) ||
                    (fighter.record || '').toLowerCase().includes(search)
                );
            });
            renderFighters(filteredFighters);
        });
        // Inicializar
        document.addEventListener('DOMContentLoaded', getFighters);