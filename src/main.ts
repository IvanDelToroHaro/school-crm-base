import { CRMController } from "./controllers/crm.controller";

const crm = new CRMController();

async function ejecutarPrueba(): Promise<void> {
    console.log("=== Iniciando simulación de SchoolCRM ===");

    try {
        const asistenciaRegistrada = await crm.registrarAsistencia(
            "alumno-1",
            "profesor-1",
            "1ª Hora",
            "falta",
        );
          const horarioRegistrado = await crm.registrarHorario({
              dia: "Lunes",
              franja: "1ª Hora",
              cursoId: "curso-1",
              asignaturaId: "asignatura-1",
              profesorId: "profesor-1",
              aula: "Aula 1",
          });
        const conflicto = await crm.comprobarConflictoProfesor(
            "profesor-1",
            "Lunes",
            "1ª Hora",
        );
        await crm.registrarSancion(
            "alumno-1",
            "profesor-1",
            "comportamiento",
            "Interrumpe repetidamente la clase.",
        );
        const informe = await crm.obtenerInformeAlumno("alumno-1");

          console.log("Horario registrado:", horarioRegistrado);
        console.log("Asistencia registrada:", asistenciaRegistrada);
        console.log("¿Hay conflicto horario?:", conflicto);
        console.log("Informe del alumno:", informe);
    } catch (error) {
        console.error("Error en la ejecución:", error);
    }
}

void ejecutarPrueba();