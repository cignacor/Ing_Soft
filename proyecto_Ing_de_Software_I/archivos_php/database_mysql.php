<?php

class DatabaseMySQL {
    private $db;

  
    private $host = 'localhost';
    private $username = 'root';
    private $password = '';
    private $database = 'kkjs_bd';

  
    private const ESTADO_ACTIVA = 'activa';
    private const ESTADO_CANCELADA = 'cancelada';
    private const ESTADO_COMPLETADA = 'completada';

    private const SQL_COUNT_DEPT = "SELECT COUNT(*) as total FROM departamentos";
    private const SQL_COUNT_RES = "SELECT COUNT(*) as total FROM reservas";

    public function __construct() {
        $this->connect();
        $this->seedData();
    }

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
            throw new Exception("Error de conexión: " . $e->getMessage());
        }
    }

   
    private function seedData() {
        if ($this->db->query(self::SQL_COUNT_DEPT)->fetch()['total'] == 0) {
            $this->insertDepartamentos();
            $this->insertEspacios();
            $this->insertUsuarios();
            $this->insertReservas();
        } elseif ($this->db->query(self::SQL_COUNT_RES)->fetch()['total'] == 0) {
            $this->insertReservas();
        }
    }

    private function insertDepartamentos() {
        $data = [
            ['diseno', 'Diseño', 'fas fa-palette', 'Talleres de diseño gráfico y digital'],
            ['electrica', 'Eléctrica', 'fas fa-bolt', 'Laboratorios de circuitos y electrónica'],
            ['mecanica', 'Mecánica', 'fas fa-cog', 'Talleres de mecánica y maquinaria'],
            ['produccion', 'Producción', 'fas fa-industry', 'Instalaciones de producción industrial'],
            ['sistemas-digitales', 'Sistemas Digitales', 'fas fa-microchip', 'Laboratorios de sistemas embebidos'],
            ['deportivos', 'Deportivos', 'fas fa-futbol', 'Instalaciones deportivas y gimnasios'],
        ];

        $stmt = $this->db->prepare(
            "INSERT INTO departamentos (codigo, nombre, icono, descripcion) VALUES (?, ?, ?, ?)"
        );

        foreach ($data as $row) $stmt->execute($row);
    }

    private function insertEspacios() {
       
        $espacios = [
            [1, 'Taller de Diseño Gráfico 1', 'laboratorio', 20, 'Equipado con computadoras Mac y software Adobe'],
            [1, 'Taller de Diseño Gráfico 2', 'laboratorio', 20, 'Especializado en diseño digital y multimedia'],
            [1, 'Aula de Diseño A', 'aula', 35, 'Aula teórica con proyector HD'],
            [1, 'Aula de Diseño B', 'aula', 30, 'Aula práctica con mesas de dibujo'],
            // …
        ];

        $stmt = $this->db->prepare(
            "INSERT INTO espacios (departamento_id, nombre, tipo, capacidad, descripcion)
             VALUES (?, ?, ?, ?, ?)"
        );

        foreach ($espacios as $e) $stmt->execute($e);
    }

    private function insertUsuarios() {
        $usuarios = [
            ['Ana García', 'ana.garcia@universidad.edu', '3001234567', 'EST2024001', 'estudiante', 'Diseño', 'password123'],
            ['Carlos Rodríguez', 'carlos.rodriguez@universidad.edu', '3002345678', 'EST2024002', 'estudiante', 'Eléctrica', 'password123'],
            ['María López', 'maria.lopez@universidad.edu', '3003456789', 'EST2024003', 'estudiante', 'Mecánica', 'password123'],
            // …
        ];

        $stmt = $this->db->prepare(
            "INSERT INTO usuarios (nombre, email, telefono, codigo_estudiante, tipo, departamento, contrasena)
             VALUES (?, ?, ?, ?, ?, ?, ?)"
        );

        foreach ($usuarios as $u) $stmt->execute($u);
    }

    private function insertReservas() {
        $reservas = [
            [1, 1, 'diseno', '2024-12-01', '08:00-10:00', self::ESTADO_ACTIVA],
            // …
        ];

        $stmt = $this->db->prepare(
            "INSERT INTO reservas (espacio_id, usuario_id, departamento_codigo, fecha, horario, estado)
             VALUES (?, ?, ?, ?, ?, ?)"
        );

        foreach ($reservas as $r) $stmt->execute($r);
    }

  
    public function checkDisponibilidad($espacioId, $fecha, $horario) {
        $sql = "
            SELECT COUNT(*) AS count
            FROM reservas
            WHERE espacio_id = ? AND fecha = ? AND horario = ? AND estado = '" . self::ESTADO_ACTIVA . "'
        ";

        $stmt = $this->db->prepare($sql);
        $stmt->execute([$espacioId, $fecha, $horario]);
        return $stmt->fetch()['count'] == 0;
    }

}
