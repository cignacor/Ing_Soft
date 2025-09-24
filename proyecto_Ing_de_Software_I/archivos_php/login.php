<?php
require_once 'database_mysql.php';

header('Content-Type: application/json');

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $input = json_decode(file_get_contents('php://input'), true);

    $email = $input['email'] ?? '';
    $password = $input['password'] ?? '';
    $tipo = $input['tipo_persona'] ?? '';

    if (empty($email) || empty($password) || empty($tipo)) {
        echo json_encode(['success' => false, 'message' => 'Todos los campos son requeridos']);
        exit;
    }

    try {
        $db = new DatabaseMySQL();
        $conn = $db->getConnection(); // 🔑 obtenemos el PDO

        $stmt = $conn->prepare("SELECT * FROM usuarios WHERE email = ? AND contrasena = ? AND tipo = ? AND activo = 1");
        $stmt->execute([$email, $password, $tipo]);
        $user = $stmt->fetch(PDO::FETCH_ASSOC);

        if ($user) {
            // Determinar URL de redirección
            $redirectUrl = '../archivos_html/index.html';
            if ($tipo === 'administrador') {
                $redirectUrl = '../archivos_html/reserva_administrativo.html';
            }

            echo json_encode([
                'success' => true,
                'message' => 'Login exitoso',
                'user' => [
                    'id' => $user['id'],
                    'nombre' => $user['nombre'],
                    'email' => $user['email'],
                    'tipo' => $user['tipo'],
                    'departamento' => $user['departamento']
                ],
                'redirect' => $redirectUrl
            ]);
        } else {
            echo json_encode(['success' => false, 'message' => 'Credenciales inválidas']);
        }
    } catch (Exception $e) {
        echo json_encode(['success' => false, 'message' => 'Error en el servidor: ' . $e->getMessage()]);
    }
} else {
    echo json_encode(['success' => false, 'message' => 'Método no permitido']);
}
