<?php
header('Content-Type: application/json');
require_once 'database_mysql.php'; // Asegúrate que este archivo conecta correctamente a MySQL
 // función definida en database_mysql.php

$action = $_GET['action'] ?? null;

// Insertar nuevo espacio
if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $nombre = $_POST['nombre'] ?? '';
    $tipo = $_POST['tipo'] ?? '';
    $capacidad = $_POST['capacidad'] ?? 0;
    $descripcion = $_POST['descripcion'] ?? '';
    $departamento_id = 1; // Puedes cambiar esto por selección dinámica si lo deseas

    $sql = "INSERT INTO espacios (departamento_id, nombre, tipo, capacidad, descripcion) VALUES (?, ?, ?, ?, ?)";
    $stmt = $conexion->prepare($sql);
    $stmt->bind_param("issis", $departamento_id, $nombre, $tipo, $capacidad, $descripcion);

    if ($stmt->execute()) {
        echo json_encode(['mensaje' => 'Espacio agregado correctamente']);
    } else {
        echo json_encode(['mensaje' => 'Error al agregar espacio']);
    }
    exit;
}

// Obtener todos los espacios
if ($action === 'obtener_espacios') {
    $resultado = $conexion->query("SELECT nombre, tipo, capacidad, descripcion FROM espacios WHERE activo = 1 ORDER BY nombre ASC");
    $espacios = [];

    while ($fila = $resultado->fetch_assoc()) {
        $espacios[] = $fila;
    }

    echo json_encode($espacios);
    exit;
}

// Obtener todas las reservas
if ($action === 'obtener_reservas') {
    $sql = "SELECT r.fecha, r.horario, r.estado, e.nombre AS espacio, u.nombre AS usuario
            FROM reservas r
            JOIN espacios e ON r.espacio_id = e.id
            LEFT JOIN usuarios u ON r.usuario_id = u.id
            ORDER BY r.fecha DESC";

    $resultado = $conexion->query($sql);
    $reservas = [];

    while ($fila = $resultado->fetch_assoc()) {
        $reservas[] = $fila;
    }

    echo json_encode($reservas);
    exit;
}

// Si no se reconoce la acción
echo json_encode(['mensaje' => 'Acción no válida']);


// Cerrar la conexión a la base de datos
$conexion->close();
?>
