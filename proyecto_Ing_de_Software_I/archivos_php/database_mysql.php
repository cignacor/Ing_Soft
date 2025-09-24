<?php
//Configuración y el manejo de base de datos MySQL
//PHP 8.4 - kkjs_bd

class DatabaseMySQL {
    private $db;
    private $host = 'localhost';
    private $username = 'root';
    private $password = '';
    private $database = 'kkjs_bd';

    public function __construct() {
        $this->connect();
        $this->seedData();
    }

    /**
     * Conectar a la base de datos MySQL
     */
    private function connect() {
        try {
            $this->db = new PDO(
                "mysql:host={$this->host};dbname={$this->database};charset=utf8mb4",
                $this->username,
                $this->password,
                [
                    PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                    PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                    PDO::MYSQL_ATTR_INIT_COMMAND => "SET NAMES utf8mb4"
                ]
            );
        } catch (PDOException $e) {
            throw new Exception("Error de conexión a la base de datos: " . $e->getMessage());
        }
    }



    /**
     * Insertar datos iniciales (seed data)
     */
    private function seedData() {
        // Verificar si ya existen datos
        $count = $this->db->query("SELECT COUNT(*) as total FROM departamentos")->fetch()['total'];

        if ($count == 0) {
            // Insertar departamentos académicos
            $departamentos = [
                ['diseno', 'Diseño', 'fas fa-palette', 'Talleres de diseño gráfico y digital'],
                ['electrica', 'Eléctrica', 'fas fa-bolt', 'Laboratorios de circuitos y electrónica'],
                ['mecanica', 'Mecánica', 'fas fa-cog', 'Talleres de mecánica y maquinaria'],
                ['produccion', 'Producción', 'fas fa-industry', 'Instalaciones de producción industrial'],
                ['sistemas-digitales', 'Sistemas Digitales', 'fas fa-microchip', 'Laboratorios de sistemas embebidos'],
                ['deportivos', 'Deportivos', 'fas fa-futbol', 'Instalaciones deportivas y gimnasios']
            ];

            $stmt = $this->db->prepare("INSERT INTO departamentos (codigo, nombre, icono, descripcion) VALUES (?, ?, ?, ?)");

            foreach ($departamentos as $depto) {
                $stmt->execute($depto);
            }

            // Insertar espacios
            $espacios = [
                // Diseño
                [1, 'Taller de Diseño Gráfico 1', 'laboratorio', 20, 'Equipado con computadoras Mac y software Adobe'],
                [1, 'Taller de Diseño Gráfico 2', 'laboratorio', 20, 'Especializado en diseño digital y multimedia'],
                [1, 'Aula de Diseño A', 'aula', 35, 'Aula teórica con proyector HD'],
                [1, 'Aula de Diseño B', 'aula', 30, 'Aula práctica con mesas de dibujo'],

                // Eléctrica
                [2, 'Laboratorio de Circuitos 1', 'laboratorio', 25, 'Equipos de medición y protoboards'],
                [2, 'Laboratorio de Circuitos 2', 'laboratorio', 25, 'Analizadores de espectro y osciloscopios'],
                [2, 'Aula de Eléctrica A', 'aula', 40, 'Aula magistral con equipo audiovisual'],
                [2, 'Aula de Eléctrica B', 'aula', 35, 'Aula práctica con bancos de trabajo'],

                // Mecánica
                [3, 'Taller de Mecánica 1', 'laboratorio', 20, 'Tornos y fresadoras industriales'],
                [3, 'Taller de Mecánica 2', 'laboratorio', 20, 'Equipos de soldadura y metrología'],
                [3, 'Aula de Mecánica A', 'aula', 40, 'Aula teórica con proyector'],
                [3, 'Aula de Mecánica B', 'aula', 35, 'Aula práctica con modelos didácticos'],

                // Producción
                [4, 'Laboratorio de Producción 1', 'laboratorio', 25, 'Software CAD/CAM y CNC'],
                [4, 'Laboratorio de Producción 2', 'laboratorio', 25, 'Equipos de control numérico'],
                [4, 'Aula de Producción A', 'aula', 40, 'Aula teórica con equipo multimedia'],
                [4, 'Aula de Producción B', 'aula', 35, 'Aula práctica con estaciones de trabajo'],

                // Sistemas Digitales
                [5, 'Laboratorio de Sistemas 1', 'laboratorio', 25, 'Microcontroladores y FPGA'],
                [5, 'Laboratorio de Sistemas 2', 'laboratorio', 25, 'Sistemas embebidos y IoT'],
                [5, 'Aula de Sistemas A', 'aula', 40, 'Aula magistral con pantallas interactivas'],
                [5, 'Aula de Sistemas B', 'aula', 35, 'Aula práctica con kits de desarrollo'],

                // Deportivos
                [6, 'Gimnasio Principal', 'comun', 50, 'Equipos cardiovasculares y de fuerza'],
                [6, 'Cancha de Fútbol', 'comun', 22, 'Cancha sintética con iluminación'],
                [6, 'Cancha de Básquetbol', 'comun', 10, 'Cancha techada con tableros electrónicos'],
                [6, 'Sala de Aeróbicos', 'comun', 30, 'Espacio para clases grupales']
            ];

            $stmt = $this->db->prepare("INSERT INTO espacios (departamento_id, nombre, tipo, capacidad, descripcion) VALUES (?, ?, ?, ?, ?)");

            foreach ($espacios as $espacio) {
                $stmt->execute($espacio);
            }

            // Insertar usuarios de ejemplo
            $usuarios = [
                ['Ana García', 'ana.garcia@universidad.edu', '3001234567', 'EST2024001', 'estudiante', 'Diseño', 'password123'],
                ['Carlos Rodríguez', 'carlos.rodriguez@universidad.edu', '3002345678', 'EST2024002', 'estudiante', 'Eléctrica', 'password123'],
                ['María López', 'maria.lopez@universidad.edu', '3003456789', 'EST2024003', 'estudiante', 'Mecánica', 'password123'],
                ['Prof. Juan Martínez', 'juan.martinez@universidad.edu', '3004567890', 'PROF001', 'profesor', 'Sistemas Digitales', 'password123'],
                ['Prof. Laura Hernández', 'laura.hernandez@universidad.edu', '3005678901', 'PROF002', 'profesor', 'Producción', 'password123'],
                ['Admin Sistema', 'admin@sicau.edu', '3006789012', 'ADMIN001', 'administrador', 'Administración', 'admin123']
            ];

            $stmt = $this->db->prepare("INSERT INTO usuarios (nombre, email, telefono, codigo_estudiante, tipo, departamento, contrasena) VALUES (?, ?, ?, ?, ?, ?, ?)");

            foreach ($usuarios as $usuario) {
                $stmt->execute($usuario);
            }

            // Insertar reservas de ejemplo
            $reservas = [
                [1, 1, 'diseno', '2024-12-01', '08:00-10:00', 'activa'],
                [5, 2, 'electrica', '2024-12-02', '14:00-16:00', 'activa'],
                [9, 3, 'mecanica', '2024-12-03', '10:00-12:00', 'activa'],
                [13, 4, 'produccion', '2024-12-04', '16:00-18:00', 'activa'],
                [17, 5, 'sistemas-digitales', '2024-12-05', '08:00-10:00', 'activa'],
                [21, 6, 'deportivos', '2024-12-06', '14:00-16:00', 'activa']
            ];

            $stmt = $this->db->prepare("INSERT INTO reservas (espacio_id, usuario_id, departamento_codigo, fecha, horario, estado) VALUES (?, ?, ?, ?, ?, ?)");

            foreach ($reservas as $reserva) {
                $stmt->execute($reserva);
            }
        } else {
            // Si ya existen departamentos, verificar si hay reservas
            $countReservas = $this->db->query("SELECT COUNT(*) as total FROM reservas")->fetch()['total'];
            if ($countReservas == 0) {
                // Insertar reservas de ejemplo
                $reservas = [
                    [1, 1, 'diseno', '2024-12-01', '08:00-10:00', 'activa'],
                    [2, 2, 'electrica', '2024-12-02', '14:00-16:00', 'activa'],
                    [3, 3, 'mecanica', '2024-12-03', '10:00-12:00', 'activa'],
                    [4, 4, 'produccion', '2024-12-04', '16:00-18:00', 'activa'],
                    [5, 5, 'sistemas-digitales', '2024-12-05', '08:00-10:00', 'activa'],
                    [6, 6, 'deportivos', '2024-12-06', '14:00-16:00', 'activa']
                ];

                $stmt = $this->db->prepare("INSERT INTO reservas (espacio_id, usuario_id, departamento_codigo, fecha, horario, estado) VALUES (?, ?, ?, ?, ?, ?)");

                foreach ($reservas as $reserva) {
                    $stmt->execute($reserva);
                }
            }
        }
    }

    /**
     * Obtener todos los departamentos activos
     */
    public function getDepartamentos() {
        $stmt = $this->db->query("SELECT * FROM departamentos WHERE activo = 1 ORDER BY nombre");
        return $stmt->fetchAll();
    }

    /**
     * Obtener espacios por departamento
     */
    public function getEspaciosByDepartamento($departamentoCodigo) {
        $stmt = $this->db->prepare("
            SELECT e.*, d.nombre as departamento_nombre
            FROM espacios e
            JOIN departamentos d ON e.departamento_id = d.id
            WHERE d.codigo = ? AND e.activo = 1
            ORDER BY e.tipo, e.nombre
        ");
        $stmt->execute([$departamentoCodigo]);
        return $stmt->fetchAll();
    }

    /**
     * Obtener espacios por tipo
     */
    public function getEspaciosByTipo($tipo) {
        $stmt = $this->db->prepare("
            SELECT e.*, d.nombre as departamento_nombre, d.codigo as departamento_codigo
            FROM espacios e
            JOIN departamentos d ON e.departamento_id = d.id
            WHERE e.tipo = ? AND e.activo = 1
            ORDER BY d.nombre, e.nombre
        ");
        $stmt->execute([$tipo]);
        return $stmt->fetchAll();
    }

    /**
     * Obtener espacios por departamento y tipo
     */
    public function getEspaciosByDepartamentoAndTipo($departamentoCodigo, $tipo) {
        $stmt = $this->db->prepare("
            SELECT e.*, d.nombre as departamento_nombre
            FROM espacios e
            JOIN departamentos d ON e.departamento_id = d.id
            WHERE d.codigo = ? AND e.tipo = ? AND e.activo = 1
            ORDER BY e.nombre
        ");
        $stmt->execute([$departamentoCodigo, $tipo]);
        return $stmt->fetchAll();
    }

    /**
     * Verificar disponibilidad de un espacio
     */
    public function checkDisponibilidad($espacioId, $fecha, $horario) {
        $stmt = $this->db->prepare("
            SELECT COUNT(*) as count
            FROM reservas
            WHERE espacio_id = ? AND fecha = ? AND horario = ? AND estado = 'activa'
        ");
        $stmt->execute([$espacioId, $fecha, $horario]);
        $result = $stmt->fetch();
        return $result['count'] == 0;
    }

    /**
     * Crear una nueva reserva
     */
    public function crearReserva($espacioId, $departamentoCodigo, $fecha, $horario, $usuarioId = null) {
        try {
            $this->db->beginTransaction();

            // Verificar disponibilidad
            if (!$this->checkDisponibilidad($espacioId, $fecha, $horario)) {
                throw new Exception("El espacio no está disponible en esa fecha y horario");
            }

            $stmt = $this->db->prepare("
                INSERT INTO reservas (espacio_id, usuario_id, departamento_codigo, fecha, horario, estado)
                VALUES (?, ?, ?, ?, ?, 'activa')
            ");
            $stmt->execute([$espacioId, $usuarioId, $departamentoCodigo, $fecha, $horario]);

            $reservaId = $this->db->lastInsertId();
            $this->db->commit();

            return $reservaId;
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /**
     * Obtener reservas activas
     */

    public function getReservas($usuarioId = null) {
    $sql = "
        SELECT r.*, e.nombre as espacio_nombre, e.capacidad, d.nombre as departamento_nombre, u.nombre as usuario
        FROM reservas r
        JOIN espacios e ON r.espacio_id = e.id
        JOIN departamentos d ON r.departamento_codigo = d.codigo
        LEFT JOIN usuarios u ON r.usuario_id = u.id
    ";

    $params = [];
    if ($usuarioId) {
        $sql .= " WHERE r.usuario_id = ?";
        $params[] = $usuarioId;
    }

    $sql .= " ORDER BY r.fecha DESC, r.horario";

    $stmt = $this->db->prepare($sql);
    $stmt->execute($params);
    return $stmt->fetchAll();
}

    public function getHistorialReservas($usuarioId = null) {
        $sql = "
            SELECT r.*, e.nombre as espacio_nombre, e.capacidad, d.nombre as departamento_nombre
            FROM reservas r
            JOIN espacios e ON r.espacio_id = e.id
            JOIN departamentos d ON r.departamento_codigo = d.codigo
            WHERE r.estado != 'activa'
        ";

        $params = [];
        if ($usuarioId) {
            $sql .= " AND r.usuario_id = ?";
            $params[] = $usuarioId;
        }

        $sql .= " ORDER BY r.fecha DESC, r.horario";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Cancelar una reserva
     */
    public function cancelarReserva($reservaId, $usuarioId = null) {
        try {
            $this->db->beginTransaction();

            $sql = "UPDATE reservas SET estado = 'cancelada', updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            $params = [$reservaId];

            if ($usuarioId) {
                $sql .= " AND usuario_id = ?";
                $params[] = $usuarioId;
            }

            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute($params);

            if ($result) {
                $this->db->commit();
                return true;
            } else {
                throw new Exception("No se pudo cancelar la reserva");
            }
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /**
     * Editar una reserva
     */
    public function editarReserva($reservaId, $nuevaFecha, $nuevoHorario, $usuarioId = null) {
        try {
            $this->db->beginTransaction();

            // Verificar que la reserva existe y está activa
            $sql = "SELECT * FROM reservas WHERE id = ? AND estado = 'activa'";
            $params = [$reservaId];

            if ($usuarioId) {
                $sql .= " AND usuario_id = ?";
                $params[] = $usuarioId;
            }

            $stmt = $this->db->prepare($sql);
            $stmt->execute($params);
            $reserva = $stmt->fetch();

            if (!$reserva) {
                throw new Exception("Reserva no encontrada o no disponible para editar");
            }

            // Verificar disponibilidad del nuevo horario
            if (!$this->checkDisponibilidad($reserva['espacio_id'], $nuevaFecha, $nuevoHorario)) {
                throw new Exception("El espacio no está disponible en la nueva fecha y horario");
            }

            // Actualizar la reserva
            $sql = "UPDATE reservas SET fecha = ?, horario = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?";
            $params = [$nuevaFecha, $nuevoHorario, $reservaId];

            if ($usuarioId) {
                $sql .= " AND usuario_id = ?";
                $params[] = $usuarioId;
            }

            $stmt = $this->db->prepare($sql);
            $result = $stmt->execute($params);

            if ($result) {
                $this->db->commit();
                return true;
            } else {
                throw new Exception("No se pudo editar la reserva");
            }
        } catch (Exception $e) {
            $this->db->rollBack();
            throw $e;
        }
    }

    /**
     * Obtener una reserva específica por ID
     */
    public function getReservaById($reservaId, $usuarioId = null) {
        $sql = "
            SELECT r.*, e.nombre as espacio_nombre, e.capacidad, d.nombre as departamento_nombre
            FROM reservas r
            JOIN espacios e ON r.espacio_id = e.id
            JOIN departamentos d ON r.departamento_codigo = d.codigo
            WHERE r.id = ?
        ";

        $params = [$reservaId];

        if ($usuarioId) {
            $sql .= " AND r.usuario_id = ?";
            $params[] = $usuarioId;
        }

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetch();
    }

    /**
     * Obtener estadísticas del sistema
     */
    public function getEstadisticas() {
        $stats = [];

        // Total de departamentos
        $stats['total_departamentos'] = $this->db->query("SELECT COUNT(*) FROM departamentos WHERE activo = 1")->fetch()['COUNT(*)'];

        // Total de espacios
        $stats['total_espacios'] = $this->db->query("SELECT COUNT(*) FROM espacios WHERE activo = 1")->fetch()['COUNT(*)'];

        // Total de reservas activas
        $stats['reservas_activas'] = $this->db->query("SELECT COUNT(*) FROM reservas WHERE estado = 'activa'")->fetch()['COUNT(*)'];

        // Reservas por tipo de espacio
        $stmt = $this->db->query("
            SELECT e.tipo, COUNT(r.id) as count
            FROM espacios e
            LEFT JOIN reservas r ON e.id = r.espacio_id AND r.estado = 'activa'
            GROUP BY e.tipo
        ");
        $stats['reservas_por_tipo'] = $stmt->fetchAll(PDO::FETCH_KEY_PAIR);

        return $stats;
    }

    /**
     * Obtener todos los espacios para el frontend
     */
    public function getAllEspacios() {
        $stmt = $this->db->query("
            SELECT e.*, d.nombre as departamento_nombre, d.codigo as departamento_codigo
            FROM espacios e
            JOIN departamentos d ON e.departamento_id = d.id
            WHERE e.activo = 1
            ORDER BY d.nombre, e.tipo, e.nombre
        ");
        return $stmt->fetchAll();
    }

    /**
     * Agregar un nuevo espacio
     */
    public function addEspacio($nombre, $tipo, $capacidad, $descripcion, $departamentoId) {
        try {
            $stmt = $this->db->prepare("INSERT INTO espacios (departamento_id, nombre, tipo, capacidad, descripcion) VALUES (?, ?, ?, ?, ?)");
            $result = $stmt->execute([$departamentoId, $nombre, $tipo, $capacidad, $descripcion]);
            return $result;
        } catch (Exception $e) {
            error_log("Error al agregar espacio: " . $e->getMessage());
            return false;
        }
    }

    public function editEspacio($id, $nombre, $tipo, $capacidad, $descripcion, $departamentoId) {
        try {
            $stmt = $this->db->prepare("UPDATE espacios SET departamento_id = ?, nombre = ?, tipo = ?, capacidad = ?, descripcion = ? WHERE id = ?");
            $result = $stmt->execute([$departamentoId, $nombre, $tipo, $capacidad, $descripcion, $id]);
            return $result;
        } catch (Exception $e) {
            error_log("Error al editar espacio: " . $e->getMessage());
            return false;
        }
    }

    /**
     * Obtener historial de reservas (incluyendo canceladas y completadas)
     */
    public function getReservasActivas($usuarioId = null) {
        $sql = "
            SELECT r.*, e.nombre as espacio_nombre, e.capacidad, d.nombre as departamento_nombre
            FROM reservas r
            JOIN espacios e ON r.espacio_id = e.id
            JOIN departamentos d ON r.departamento_codigo = d.codigo
            WHERE r.estado IN ('activa', 'cancelada', 'completada')
        ";

        $params = [];
        if ($usuarioId) {
            $sql .= " AND r.usuario_id = ?";
            $params[] = $usuarioId;
        }

        $sql .= " ORDER BY r.fecha DESC, r.horario";

        $stmt = $this->db->prepare($sql);
        $stmt->execute($params);
        return $stmt->fetchAll();
    }

    /**
     * Obtener usuario actual
     */
    public function getUsuarioActual($usuarioId) {
        $stmt = $this->db->prepare("SELECT * FROM usuarios WHERE id = ? AND activo = 1");
        $stmt->execute([$usuarioId]);
        return $stmt->fetch();
    }

    /**
     * Cerrar conexión
     */
    public function close() {
        $this->db = null;
    }

    /**
     * Obtener la conexión PDO
     */
    public function getConnection() {
        return $this->db;
    }
}
