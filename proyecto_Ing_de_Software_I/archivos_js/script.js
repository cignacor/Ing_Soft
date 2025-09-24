// SICAU - Sistema de Reservas Universitarias
// JavaScript vanilla para funcionalidad completa

class SICAUReservationSystem {
    constructor() {
        this.currentStep = 1;
        this.selectedDepartamento = null;
        this.selectedEspacio = null;
        this.selectedFecha = null;
        this.selectedHorario = null;
        this.selectedHorarios = [];
        this.reservaEnEdicion = null;
        this.reservas = [];
        this.departamentos = [];
        this.espacios = [];

        // Configuración del backend
        this.apiBaseUrl = '/Ing_Soft/proyecto_Ing_de_Software_I/archivos_php/reservas.php';

        this.init();
        this.setupHeaderScroll();
    }

    init() {
        this.loadEventListeners();
        this.loadDepartamentos();
        this.loadEspacios();
        this.setupDateValidation();
        this.loadReservas();
        this.setupMobileMenu();
        this.setupTabs();
        this.setupFilters();
        this.loadEspaciosShowcase();
    }

    // Configurar comportamiento del header al hacer scroll
    setupHeaderScroll() {
        const header = document.querySelector(".header");

        if (!header) return;

        window.addEventListener("scroll", () => {
            const scrollTop = window.pageYOffset || document.documentElement.scrollTop;

            // Si estamos al principio de la página (10px o menos), mostrar el header
            if (scrollTop <= 10) {
                header.classList.remove("hidden");
                header.classList.add("show");
            }
            // Si hemos hecho scroll hacia abajo, ocultar el header completamente
            else {
                header.classList.remove("show");
                header.classList.add("hidden");
            }
        }, { passive: true });
    }

    // Cargar Event Listeners
    loadEventListeners() {
        // Navegación entre pasos
        document.getElementById('nextToStep2')?.addEventListener('click', () => this.nextStep(2));
        document.getElementById('backToStep1')?.addEventListener('click', () => this.prevStep(1));
        document.getElementById('nextToStep3')?.addEventListener('click', () => this.nextStep(3));
        document.getElementById('backToStep2')?.addEventListener('click', () => this.prevStep(2));
        document.getElementById('nextToStep4')?.addEventListener('click', () => this.nextStep(4));
        document.getElementById('backToStep3')?.addEventListener('click', () => this.prevStep(3));
        document.getElementById('confirmarReserva')?.addEventListener('click', () => this.confirmarReserva());

        // Selección de departamento
        document.querySelectorAll('.departamento-card').forEach(card => {
            card.addEventListener('click', (e) => this.selectDepartamento(e));
        });

        // Validación de fecha y horario
        document.getElementById('fechaReserva')?.addEventListener('change', (e) => this.validateFecha(e));
        document.getElementById('horaInicio')?.addEventListener('change', (e) => this.validateHorario(e));
        document.getElementById('horaFin')?.addEventListener('change', (e) => this.validateHorario(e));

        // Mobile menu
        document.getElementById('mobileMenuToggle')?.addEventListener('click', this.toggleMobileMenu);

        // Modales
        document.querySelectorAll('.modal .btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const modalId = e.target.closest('.modal').id;
                this.closeModal(modalId);
            });
        });
    }

    // Cargar departamentos desde el backend
    async loadDepartamentos() {
        try {
            const response = await fetch(`${this.apiBaseUrl}?action=departamentos`);
            const result = await response.json();

            if (result.success) {
                this.departamentos = result.data;
                this.updateDepartamentosDisplay();
            } else {
                console.error('Error cargando departamentos:', result.message);
                this.showError('Error cargando departamentos');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            this.showError('Error de conexión con el servidor');
        }
    }

    // Actualizar display de departamentos
    updateDepartamentosDisplay() {
        // Los departamentos se cargan dinámicamente desde el backend
        // No necesitamos hacer nada aquí ya que el HTML tiene los departamentos hardcodeados
        // pero en una implementación real, se cargarían dinámicamente
    }

    // Cargar espacios desde el backend
    async loadEspacios() {
        try {
            const response = await fetch(`${this.apiBaseUrl}?action=espacios`);
            const result = await response.json();

            if (result.success) {
                this.espacios = result.data;
            } else {
                console.error('Error cargando espacios:', result.message);
                this.showError('Error cargando espacios');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            this.showError('Error de conexión con el servidor');
        }
    }

    // Cargar espacios en la sección showcase
    loadEspaciosShowcase() {
        // Pequeño delay para asegurar que el DOM esté listo
        setTimeout(() => {
            this.filterEspacios('todos');
        }, 100);
    }

    // Seleccionar departamento
    selectDepartamento(event) {
        const card = event.currentTarget;
        const departamentoId = card.dataset.departamento;

        // Remover selección anterior
        document.querySelectorAll('.departamento-card').forEach(c => c.classList.remove('selected'));

        // Seleccionar nuevo
        card.classList.add('selected');
        this.selectedDepartamento = departamentoId;

        // Actualizar botón
        const nextBtn = document.getElementById('nextToStep2');
        if (nextBtn) {
            nextBtn.disabled = false;
        }

        // Cargar espacios del departamento desde el backend
        this.loadEspaciosByDepartamento(departamentoId);
    }

    // Cargar espacios por departamento desde el backend
    async loadEspaciosByDepartamento(departamentoId) {
        try {
            const response = await fetch(`${this.apiBaseUrl}?action=espacios&departamento=${departamentoId}`);
            const result = await response.json();

            if (result.success) {
                const container = document.getElementById('espaciosContainer');
                if (!container) return;

                container.innerHTML = '';

                result.data.forEach(espacio => {
                    const espacioCard = document.createElement('div');
                    espacioCard.className = 'espacio-card';
                    espacioCard.dataset.espacioId = espacio.id;
                    espacioCard.addEventListener('click', (e) => this.selectEspacio(e, espacio));

                    espacioCard.innerHTML = `
                        <div class="espacio-header">
                            <span class="espacio-nombre">${espacio.nombre}</span>
                            <span class="espacio-tipo ${espacio.tipo}">${this.getTipoLabel(espacio.tipo)}</span>
                        </div>
                        <div class="espacio-capacidad">
                            <i class="fas fa-users"></i> Capacidad: ${espacio.capacidad} personas
                        </div>
                        <div class="espacio-descripcion">${espacio.descripcion}</div>
                    `;

                    container.appendChild(espacioCard);
                });
            } else {
                console.error('Error cargando espacios:', result.message);
                this.showError('Error cargando espacios del departamento');
            }
        } catch (error) {
            console.error('Error de conexión:', error);
            this.showError('Error de conexión con el servidor');
        }
    }

    // Obtener etiqueta del tipo de espacio
    getTipoLabel(tipo) {
        const labels = {
            'aula': 'Aula',
            'laboratorio': 'Laboratorio',
            'comun': 'Espacio Común'
        };
        return labels[tipo] || tipo;
    }

    // Seleccionar espacio
    selectEspacio(event, espacio) {
        const card = event.currentTarget;

        // Remover selección anterior
        document.querySelectorAll('.espacio-card').forEach(c => c.classList.remove('selected'));

        // Seleccionar nuevo
        card.classList.add('selected');
        this.selectedEspacio = espacio;

        // Actualizar botón
        const nextBtn = document.getElementById('nextToStep3');
        if (nextBtn) {
            nextBtn.disabled = false;
        }
    }

    // Configurar validación de fecha
    setupDateValidation() {
        const fechaInput = document.getElementById('fechaReserva');
        if (fechaInput) {
            // Establecer fecha mínima (mañana)
            const tomorrow = new Date();
            tomorrow.setDate(tomorrow.getDate() + 1);
            fechaInput.min = tomorrow.toISOString().split('T')[0];
        }
    }

    // Validar fecha seleccionada
    validateFecha(event) {
        const fecha = event.target.value;
        this.selectedFecha = fecha;

        if (fecha) {
            // Mostrar sección de horarios
            const horarioSection = document.getElementById('horarioSection');
            if (horarioSection) {
                horarioSection.style.display = 'block';
            }
            // Cargar horarios disponibles para esta fecha
            this.loadHorariosDisponibles(fecha);
        } else {
            // Ocultar sección de horarios
            const horarioSection = document.getElementById('horarioSection');
            if (horarioSection) {
                horarioSection.style.display = 'none';
            }
            this.selectedHorarios = [];
            this.updateHorariosSeleccionados();
        }

        // Actualizar botón siguiente
        this.updateNextButton();
    }

    // Validar horario seleccionado
    validateHorario(event) {
        const horaInicio = document.getElementById('horaInicio')?.value;
        const horaFin = document.getElementById('horaFin')?.value;

        // Validar que ambas horas estén seleccionadas
        if (!horaInicio || !horaFin) {
            this.selectedHorario = null;
            this.updateNextButton();
            return;
        }

        // Validar bloques de 2 horas pares (4-6, 8-10, 10-12, 14-16, 16-18, etc.)
        const horaInicioNum = parseInt(horaInicio.split(':')[0]);
        const horaFinNum = parseInt(horaFin.split(':')[0]);

        // Verificar que sea un bloque de exactamente 2 horas
        if (horaFinNum - horaInicioNum !== 2) {
            this.showError('Solo se permiten bloques de 2 horas (ej: 8:00-10:00, 14:00-16:00)');
            this.selectedHorario = null;
            this.updateNextButton();
            return;
        }

        // Verificar que sean horas pares válidas
        const horariosValidos = [4, 6, 8, 10, 12, 14, 16, 18, 20];
        if (!horariosValidos.includes(horaInicioNum) || !horariosValidos.includes(horaFinNum)) {
            this.showError('Horarios no válidos. Use solo horarios pares: 4:00, 6:00, 8:00, 10:00, 12:00, 14:00, 16:00, 18:00, 20:00');
            this.selectedHorario = null;
            this.updateNextButton();
            return;
        }

        // Verificar que la hora de fin sea posterior a la de inicio
        if (horaInicio >= horaFin) {
            this.showError('La hora de fin debe ser posterior a la hora de inicio');
            this.selectedHorario = null;
            this.updateNextButton();
            return;
        }

        // Verificar conflictos de reservas si tenemos fecha y espacio seleccionados
        if (this.selectedFecha && this.selectedEspacio) {
            const conflicto = this.verificarConflictoReserva(this.selectedFecha, `${horaInicio}-${horaFin}`, this.selectedEspacio.id);
            if (conflicto) {
                this.showError('Este horario ya está reservado para este espacio. Por favor selecciona otro horario.');
                this.selectedHorario = null;
                this.updateNextButton();
                return;
            }
        }

        this.selectedHorario = `${horaInicio}-${horaFin}`;
        this.updateNextButton();
    }

    // Verificar si existe conflicto de reserva
    verificarConflictoReserva(fecha, horario, espacioId) {
        // Verificar si hay reservas activas para este horario y espacio
        return this.reservas.some(reserva => {
            return reserva.estado === 'activa' &&
                reserva.fecha === fecha &&
                reserva.espacio.id === espacioId &&
                reserva.horario === horario;
        });
    }

    // Actualizar botón siguiente
    updateNextButton() {
        const nextBtn = document.getElementById('nextToStep4');
        if (nextBtn) {
            const isValid = this.selectedFecha && this.selectedHorario && this.selectedEspacio;
            nextBtn.disabled = !isValid;
        }
    }

    // Navegación entre pasos
    nextStep(step) {
        if (this.validateCurrentStep()) {
            this.showStep(step);
            this.updateProgressBar(step);

            // Mostrar resumen cuando se llegue al paso 4
            if (step === 4) {
                this.mostrarResumenReserva();
            }
        }
    }

    prevStep(step) {
        this.showStep(step);
        this.updateProgressBar(step);
    }

    // Mostrar paso específico
    showStep(step) {
        // Ocultar todos los pasos
        document.querySelectorAll('.reserva-step').forEach(s => s.classList.remove('active'));

        // Mostrar el paso actual
        const stepElement = document.getElementById(`step${step}`);
        if (stepElement) {
            stepElement.classList.add('active');
        }
        this.currentStep = step;

        // Scroll suave al paso
        stepElement?.scrollIntoView({
            behavior: 'smooth',
            block: 'start'
        });
    }

    // Actualizar barra de progreso
    updateProgressBar(step) {
        const progressFill = document.getElementById('progressFill');
        const steps = document.querySelectorAll('.progress-step');

        // Actualizar estados de los pasos
        steps.forEach((stepElement, index) => {
            const stepNumber = index + 1;

            stepElement.classList.remove('active', 'completed');

            if (stepNumber < step) {
                stepElement.classList.add('completed');
            } else if (stepNumber === step) {
                stepElement.classList.add('active');
            }
        });

        // Actualizar barra de progreso
        if (progressFill) {
            const progress = ((step - 1) / 3) * 100;
            progressFill.style.width = `${progress}%`;
        }
    }

    // Validar paso actual
    validateCurrentStep() {
        switch (this.currentStep) {
            case 1:
                return this.selectedDepartamento !== null;
            case 2:
                return this.selectedEspacio !== null;
            case 3:
                return this.selectedFecha !== null && this.selectedHorario !== null;
            default:
                return true;
        }
    }

    // Convertir horario del formato HH:MM-HH:MM al formato manana/tarde
    convertirHorario(horario) {
        if (!horario || !horario.includes('-')) {
            return null;
        }

        const [horaInicio, horaFin] = horario.split('-');
        const horaInicioNum = parseInt(horaInicio.split(':')[0]);
        const horaFinNum = parseInt(horaFin.split(':')[0]);

        // Mañana: 8:00-12:00
        if (horaInicioNum >= 8 && horaFinNum <= 12) {
            return 'manana';
        }
        // Tarde: 14:00-18:00
        else if (horaInicioNum >= 14 && horaFinNum <= 18) {
            return 'tarde';
        }

        return null;
    }

    // Confirmar reserva
    async confirmarReserva() {
        if (!this.validateCurrentStep()) {
            this.showError('Por favor complete todos los campos requeridos');
            return;
        }

        this.showLoading();

        try {
            const horarioBackend = this.convertirHorario(this.selectedHorario);

            if (!horarioBackend) {
                this.showError('Horario inválido. Solo se permiten bloques de mañana (8:00-12:00) o tarde (14:00-18:00)');
                return;
            }

            const reservaData = {
                id: this.reservaEnEdicion ?? null,
                espacio_id: this.selectedEspacio.id,
                departamento_codigo: this.selectedDepartamento,
                fecha: this.selectedFecha,
                horario: horarioBackend,
                usuario_id: null
            };

            const action = this.reservaEnEdicion ? 'editar' : 'reservar';

            const response = await fetch(`${this.apiBaseUrl}?action=${action}`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(reservaData)
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess(this.reservaEnEdicion ? '¡Reserva actualizada!' : '¡Reserva confirmada exitosamente!');
                this.resetForm();
                this.loadReservas();
                this.reservaEnEdicion = null; // limpiar edición
            } else {
                this.showError(result.message || 'Error al procesar la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('Error de conexión con el servidor');
        }
    }


    // Cargar reservas desde el backend
    async loadReservas() {
        try {
            const response = await fetch(`${this.apiBaseUrl}?action=reservas`);
            const result = await response.json();

            if (result.success) {
                this.reservas = result.data;
                this.updateReservasDisplay();
            } else {
                console.error('Error cargando reservas:', result.message);
            }
        } catch (error) {
            console.error('Error de conexión:', error);
        }
    }

    // Actualizar display de reservas
    updateReservasDisplay() {
        this.updateReservasActivas();
        this.updateHistorialReservas();
    }

    // Actualizar reservas activas
    updateReservasActivas() {
        const container = document.getElementById('reservasActivasGrid');
        if (!container) return;

        const activas = this.reservas.filter(r => r.estado === 'activa');

        if (activas.length === 0) {
            container.innerHTML = '<p class="text-center">No tienes reservas activas</p>';
            return;
        }

        container.innerHTML = activas.map(reserva => `
            <div class="reserva-item">
                <div class="reserva-info">
                    <span class="reserva-titulo">${reserva.espacio_nombre}</span>
                    <span class="reserva-estado activa">Activa</span>
                </div>
                <div class="reserva-detalles">
                    <strong>Departamento:</strong> ${reserva.departamento_nombre}<br>
                    <strong>Fecha:</strong> ${this.formatDate(reserva.fecha)}<br>
                    <strong>Horario:</strong> ${this.getHorarioLabel(reserva.horario)}
                </div>
                <div class="reserva-acciones">
                    <button class="btn btn-small btn-warning" onclick="sicau.cargarReservaEnPasos(${reserva.id})">
                        <i class="fas fa-edit"></i> Editar
                    </button>
                    <button class="btn btn-small btn-secondary" onclick="sicau.cancelarReserva(${reserva.id})">
                        <i class="fas fa-times"></i> Cancelar
                    </button>
                </div>
            </div>
        `).join('');
    }

    // Actualizar historial de reservas
    updateHistorialReservas() {
        const container = document.getElementById('reservasHistorialGrid');
        if (!container) return;

        // Incluir todas las reservas que no estén activas (canceladas, completadas, etc.)
        const historial = this.reservas.filter(r => r.estado !== 'activa');

        if (historial.length === 0) {
            container.innerHTML = '<p class="text-center">No hay historial de reservas</p>';
            return;
        }

        container.innerHTML = historial.map(reserva => `
            <div class="reserva-item">
                <div class="reserva-info">
                    <span class="reserva-titulo">${reserva.espacio_nombre}</span>
                    <span class="reserva-estado ${reserva.estado}">${this.getStatusLabel(reserva.estado)}</span>
                </div>
                <div class="reserva-detalles">
                    <strong>Departamento:</strong> ${reserva.departamento_nombre}<br>
                    <strong>Fecha:</strong> ${this.formatDate(reserva.fecha)}<br>
                    <strong>Horario:</strong> ${this.getHorarioLabel(reserva.horario)}<br>
                    ${reserva.estado === 'cancelada' ? '<strong>Estado:</strong> <span class="estado-cancelada">CANCELADA</span>' : ''}
                    ${reserva.estado === 'completada' ? '<strong>Estado:</strong> <span class="estado-completada">COMPLETADA</span>' : ''}
                </div>
            </div>
        `).join('');
    }

    // Obtener etiqueta de estado de reserva
    getStatusLabel(estado) {
        const labels = {
            'activa': 'Activa',
            'cancelada': 'Cancelada',
            'completada': 'Completada',
            'pendiente': 'Pendiente',
            'rechazada': 'Rechazada'
        };
        return labels[estado] || estado;
    }

    // Cancelar reserva
    async cancelarReserva(reservaId) {
        if (!confirm('¿Estás seguro de que deseas cancelar esta reserva?')) {
            return;
        }

        try {
            const response = await fetch(`${this.apiBaseUrl}?action=cancelar_reserva`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    reserva_id: reservaId,
                    usuario_id: null
                })
            });

            const result = await response.json();

            if (result.success) {
                this.showSuccess('Reserva cancelada con éxito');
                this.loadReservas(); // Recargar las reservas
            } else {
                this.showError(result.message || 'Error al cancelar la reserva');
            }
        } catch (error) {
            console.error('Error:', error);
            this.showError('Error de conexión con el servidor');
        }
    }

    cargarReservaEnPasos(reservaId) {
        const reserva = this.reservas.find(r => r.id === reservaId);
        if (!reserva) return;

        // Paso 1: departamento
        this.selectedDepartamento = reserva.departamento_codigo;
        document.querySelectorAll(".departamento-card").forEach(card => {
            if (card.dataset.departamento === reserva.departamento_codigo) {
                card.classList.add("selected");
            } else {
                card.classList.remove("selected");
            }
        });

        // Paso 2: espacio
        this.selectedEspacio = { id: reserva.espacio_id, nombre: reserva.espacio_nombre, capacidad: reserva.capacidad };
        // (no necesitas volver a pintar, basta con guardarlo)

        // Paso 3: fecha y horario
        this.selectedFecha = reserva.fecha;
        document.getElementById("fechaReserva").value = reserva.fecha;

        this.selectedHorario = reserva.horario;
        this.selectedHorarios = [reserva.horario];
        this.updateHorariosSeleccionados();

        // Guardar que estamos editando
        this.reservaEnEdicion = reserva.id;

        // Ir al paso 4 (confirmar)
        this.nextStep(4);
    }

    // Mostrar resumen de la reserva
    mostrarResumenReserva() {
        const resumenContainer = document.getElementById('resumenReserva');
        if (!resumenContainer) return;

        const departamento = this.departamentos.find(d => d.codigo === this.selectedDepartamento);
        const departamentoNombre = departamento ? departamento.nombre : this.selectedDepartamento;

        const fechaFormateada = this.formatDate(this.selectedFecha);
        const horarioFormateado = this.getHorarioLabel(this.selectedHorario);

        resumenContainer.innerHTML = `
            <div class="resumen-item">
                <div class="resumen-label">Departamento:</div>
                <div class="resumen-value">${departamentoNombre}</div>
            </div>
            <div class="resumen-item">
                <div class="resumen-label">Espacio:</div>
                <div class="resumen-value">${this.selectedEspacio.nombre}</div>
            </div>
            <div class="resumen-item">
                <div class="resumen-label">Fecha:</div>
                <div class="resumen-value">${fechaFormateada}</div>
            </div>
            <div class="resumen-item">
                <div class="resumen-label">Horario:</div>
                <div class="resumen-value">${horarioFormateado}</div>
            </div>
            <div class="resumen-item">
                <div class="resumen-label">Capacidad:</div>
                <div class="resumen-value">${this.selectedEspacio.capacidad} personas</div>
            </div>
        `;
    }

    // Obtener etiqueta del horario
    getHorarioLabel(horario) {
        const labels = {
            'manana': 'Mañana (8:00 - 12:00)',
            'tarde': 'Tarde (14:00 - 18:00)'
        };

        // Si es un horario personalizado (formato "HH:MM-HH:MM"), formatearlo
        if (horario && horario.includes('-') && !labels[horario]) {
            const [horaInicio, horaFin] = horario.split('-');
            return `Personalizado (${horaInicio} - ${horaFin})`;
        }

        return labels[horario] || horario;
    }

    // Formatear fecha
    formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('es-ES', {
            weekday: 'long',
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    }

    // Resetear formulario
    resetForm() {
        this.currentStep = 1;
        this.selectedDepartamento = null;
        this.selectedEspacio = null;
        this.selectedFecha = null;
        this.selectedHorario = null;
        this.selectedHorarios = [];

        // Limpiar selecciones visuales
        document.querySelectorAll('.departamento-card').forEach(c => c.classList.remove('selected'));
        document.querySelectorAll('.espacio-card').forEach(c => c.classList.remove('selected'));

        // Resetear formulario
        const fechaInput = document.getElementById('fechaReserva');
        const horaInicio = document.getElementById('horaInicio');
        const horaFin = document.getElementById('horaFin');

        if (fechaInput) fechaInput.value = '';
        if (horaInicio) horaInicio.value = '';
        if (horaFin) horaFin.value = '';

        // Resetear botones
        const nextBtn2 = document.getElementById('nextToStep2');
        const nextBtn3 = document.getElementById('nextToStep3');
        const nextBtn4 = document.getElementById('nextToStep4');

        if (nextBtn2) nextBtn2.disabled = true;
        if (nextBtn3) nextBtn3.disabled = true;
        if (nextBtn4) nextBtn4.disabled = true;

        // Mostrar primer paso
        this.showStep(1);
        this.updateProgressBar(1);
    }

    // Setup mobile menu
    setupMobileMenu() {
        const toggle = document.getElementById('mobileMenuToggle');
        const menu = document.querySelector('.nav-menu');

        if (toggle && menu) {
            toggle.addEventListener('click', () => {
                menu.classList.toggle('active');
            });
        }
    }

    // Setup tabs
    setupTabs() {
        document.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const tabName = e.target.dataset.tab;

                // Actualizar botones
                document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Mostrar contenido
                document.querySelectorAll('.tab-content').forEach(content => {
                    content.style.display = 'none';
                });
                const targetTab = document.getElementById(`reservas${tabName.charAt(0).toUpperCase() + tabName.slice(1)}`);
                if (targetTab) {
                    targetTab.style.display = 'block';
                }
            });
        });
    }

    // Setup filters
    setupFilters() {
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                const filter = e.target.dataset.filter;

                // Actualizar botones
                document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
                e.target.classList.add('active');

                // Filtrar espacios
                this.filterEspacios(filter);
            });
        });
    }

    // Filtrar espacios
    filterEspacios(filter) {
        const container = document.getElementById('espaciosShowcase');
        if (!container) return;

        let filteredEspacios = this.espacios;

        if (filter !== 'todos') {
            // Mapear los filtros del HTML a los tipos de espacios en los datos
            const tipoMap = {
                'aulas': 'aula',
                'laboratorios': 'laboratorio',
                'comunes': 'comun'
            };

            const tipoFiltro = tipoMap[filter] || filter;
            filteredEspacios = this.espacios.filter(e => e.tipo === tipoFiltro);
        }

        container.innerHTML = filteredEspacios.map(espacio => `
            <div class="espacio-showcase">
                <div class="espacio-imagen">
                    <i class="${this.getEspacioIcon(espacio.tipo)}"></i>
                </div>
                <div class="espacio-contenido">
                    <div class="espacio-header">
                        <span class="espacio-nombre">${espacio.nombre}</span>
                        <span class="espacio-tipo ${espacio.tipo}">${this.getTipoLabel(espacio.tipo)}</span>
                    </div>
                    <div class="espacio-meta">
                        <span><i class="fas fa-building"></i> ${espacio.departamento_nombre}</span>
                        <span><i class="fas fa-users"></i> ${espacio.capacidad}</span>
                    </div>
                    <div class="espacio-descripcion">${espacio.descripcion}</div>
                </div>
            </div>
        `).join('');
    }

    // Obtener icono del espacio
    getEspacioIcon(tipo) {
        const icons = {
            'aula': 'fas fa-chalkboard-teacher',
            'laboratorio': 'fas fa-flask',
            'comun': 'fas fa-users'
        };
        return icons[tipo] || 'fas fa-door-open';
    }

    // Mostrar loading
    showLoading() {
        const modal = document.getElementById('loadingModal');
        if (modal) {
            modal.classList.add('active');
        }
    }

    // Ocultar loading
    hideLoading() {
        const modal = document.getElementById('loadingModal');
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Mostrar éxito
    showSuccess(message) {
        this.hideLoading();
        const modal = document.getElementById('successModal');
        if (modal) {
            const messageElement = document.getElementById('successMessage');
            if (messageElement) {
                messageElement.textContent = message;
            }
            modal.classList.add('active');
        }
    }

    // Mostrar error
    showError(message) {
        this.hideLoading();
        const errorModal = document.getElementById('errorModal');
        if (errorModal) {
            const errorMessage = document.getElementById('errorMessage');
            if (errorMessage) {
                errorMessage.textContent = message;
            }
            errorModal.classList.add('active');
        }
    }

    // Cerrar modal
    closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }

    // Toggle mobile menu
    toggleMobileMenu() {
        const menu = document.querySelector('.nav-menu');
        if (menu) {
            menu.classList.toggle('active');
        }
    }

    // Cargar horarios disponibles para una fecha
    async loadHorariosDisponibles(fecha) {
        console.log('=== DEBUG loadHorariosDisponibles ===');
        console.log('Fecha recibida:', fecha);
        console.log('selectedEspacio:', this.selectedEspacio);
        console.log('selectedEspacio.id:', this.selectedEspacio ? this.selectedEspacio.id : 'undefined');

        const container = document.getElementById('horariosDisponibles');
        console.log('Container encontrado:', container);

        if (!container) {
            console.error('ERROR: No se encontró el contenedor horariosDisponibles');
            return;
        }

        if (!this.selectedEspacio) {
            console.error('ERROR: No hay espacio seleccionado');
            return;
        }

        container.innerHTML = '';

        // Definir bloques de horarios disponibles (de 6:00 AM a 10:00 PM)
        const bloquesHorarios = [
            { inicio: '06:00', fin: '08:00', label: '6:00 AM - 8:00 AM' },
            { inicio: '08:00', fin: '10:00', label: '8:00 AM - 10:00 AM' },
            { inicio: '10:00', fin: '12:00', label: '10:00 AM - 12:00 PM' },
            { inicio: '12:00', fin: '14:00', label: '12:00 PM - 2:00 PM' },
            { inicio: '14:00', fin: '16:00', label: '2:00 PM - 4:00 PM' },
            { inicio: '16:00', fin: '18:00', label: '4:00 PM - 6:00 PM' },
            { inicio: '18:00', fin: '20:00', label: '6:00 PM - 8:00 PM' },
            { inicio: '20:00', fin: '22:00', label: '8:00 PM - 10:00 PM' }
        ];

        // Verificar disponibilidad de cada bloque con el backend
        for (const bloque of bloquesHorarios) {
            try {
                const response = await fetch(`${this.apiBaseUrl}?action=disponibilidad&espacio_id=${this.selectedEspacio.id}&fecha=${fecha}&horario=${bloque.inicio}-${bloque.fin}`);
                const result = await response.json();

                const bloqueElement = document.createElement('div');
                bloqueElement.className = 'horario-bloque';
                bloqueElement.dataset.horario = bloque.inicio + '-' + bloque.fin;

                const disponible = result.disponible;

                bloqueElement.innerHTML = `
                    <div class="horario-tiempo">${bloque.label}</div>
                    <div class="horario-estado ${disponible ? 'disponible' : 'ocupado'}">
                        ${disponible ? 'Disponible' : 'Ya reservado'}
                    </div>
                `;

                // Solo permitir selección si está disponible
                if (disponible) {
                    bloqueElement.addEventListener('click', () => this.toggleHorarioSeleccion(bloque.inicio + '-' + bloque.fin));
                    bloqueElement.classList.add('selectable');
                } else {
                    bloqueElement.classList.add('ocupado');
                }

                container.appendChild(bloqueElement);
            } catch (error) {
                console.error('Error verificando disponibilidad:', error);
            }
        }

        // Inicializar horarios seleccionados como array vacío
        this.selectedHorarios = [];
        this.updateHorariosSeleccionados();
    }

    // Alternar selección de horario
    toggleHorarioSeleccion(horario) {
        // ✅ VALIDACIÓN OBLIGATORIA: Verificar que hay una fecha seleccionada
        if (!this.selectedFecha) {
            this.showError('Por favor selecciona primero una fecha antes de elegir un horario.');
            return;
        }

        const bloque = document.querySelector(`[data-horario="${horario}"]`);

        if (bloque.classList.contains('selected')) {
            // Deseleccionar
            bloque.classList.remove('selected');
            this.selectedHorarios = this.selectedHorarios.filter(h => h !== horario);
        } else {
            // Seleccionar
            bloque.classList.add('selected');
            this.selectedHorarios.push(horario);
        }

        this.updateHorariosSeleccionados();
    }

    // Actualizar horarios seleccionados
    updateHorariosSeleccionados() {
        const horaInicio = document.getElementById('horaInicio');
        const horaFin = document.getElementById('horaFin');

        if (this.selectedHorarios.length === 1) {
            const horario = this.selectedHorarios[0];
            const [inicio, fin] = horario.split('-');
            if (horaInicio) horaInicio.value = inicio;
            if (horaFin) horaFin.value = fin;
            this.selectedHorario = horario;
        } else {
            if (horaInicio) horaInicio.value = '';
            if (horaFin) horaFin.value = '';
            this.selectedHorario = null;
        }

        this.updateNextButton();
    }
}

//redireccionamiento de login a index
/*form.addEventListener("submit", function (e) {
  e.preventDefault();

  const datos = {
    tipo_de_persona: document.getElementById("tipo_de_persona").value,
    email: document.getElementById("email").value,
    password: document.getElementById("password").value
  };

  fetch("ruta/a/login.php", {
    method: "POST",
    headers: { "Content-Type": "application/x-www-form-urlencoded" },
    body: new URLSearchParams(datos)
  })
    .then(res => res.json())
    .then(data => {
      if (data.status === "success") {
        window.location.href = "index.html";
      } else {
        alert(data.message);
      }
    })
    .catch(() => {
      alert("Error de conexión.");
    });
});*/


// Inicializar el sistema cuando se carga la página
document.addEventListener('DOMContentLoaded', () => {
    window.sicau = new SICAUReservationSystem();
});
