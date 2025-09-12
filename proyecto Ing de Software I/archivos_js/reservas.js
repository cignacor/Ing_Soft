document.getElementById('loginForm').addEventListener('submit', function(e) {
    e.preventDefault()

try{
    const rol = document.getElementById('tipo_persona').value;

    if (rol === 'estudiante') {
        window.location.href = "../archivos_html/reserva_estudiante.html";
    }else if (rol === 'profesor'){
          window.location.href = "../archivos_html/reserva_profesor.html";
    }else if (rol === 'administrativo')
            window.location.href = "../archivos_html/reserva_administrativo.html";

}catch (error){
    console.error("Error:", error);
        alert("El rol no es valido");
    
}
    });