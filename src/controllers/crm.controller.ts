import type {
  Asistencia,
  DiaSemana,
  EstadoAsistencia,
  FranjaHoraria,
  RegistroHorario,
  RolUsuario,
  Sancion,
  TipoSancion,
  Usuario,
} from "../models/interfaces";
import { StorageService } from "../services/storage.service";

export class CRMController {
  private readonly asistenciaStorage = new StorageService<Asistencia>("crm_asistencias");
  private readonly sancionesStorage = new StorageService<Sancion>("crm_sanciones");
  private readonly horariosStorage = new StorageService<RegistroHorario>("crm_horarios");
  private readonly usuariosStorage = new StorageService<Usuario>("crm_usuarios");

  constructor(private version: string = "1.0.0") {}

  public async registrarAsistencia(
    alumnoId: string,
    profesorId: string,
    franja: FranjaHoraria,
    estado: EstadoAsistencia,
    fecha: string = new Date().toISOString().slice(0, 10),
  ): Promise<boolean> {
    await this.simularRed();
    const asistencias = await this.asistenciaStorage.getAll();
    const existeRegistro = asistencias.some(
      (asistencia) =>
        asistencia.alumnoId === alumnoId &&
        asistencia.fecha === fecha &&
        asistencia.franja === franja,
    );

    if (existeRegistro) return false;

    await this.asistenciaStorage.add({
      id: crypto.randomUUID(),
      alumnoId,
      profesorId,
      fecha,
      franja,
      estado,
    });
    return true;
  }

  public async registrarSancion(
    alumnoId: string,
    profesorId: string,
    tipo: TipoSancion,
    descripcion: string,
  ): Promise<void> {
    await this.simularRed();
    await this.sancionesStorage.add({
      id: crypto.randomUUID(),
      alumnoId,
      profesorId,
      fecha: new Date().toISOString(),
      tipo,
      descripcion,
    });
  }

  public async comprobarConflictoProfesor(
    profesorId: string,
    dia: DiaSemana,
    franja: FranjaHoraria,
  ): Promise<boolean> {
    await this.simularRed();
    const horarios = await this.horariosStorage.getAll();
    return horarios.some(
      (horario) =>
        horario.profesorId === profesorId &&
        horario.dia === dia &&
        horario.franja === franja,
    );
  }

  public async registrarHorario(horario: RegistroHorario): Promise<boolean> {
    const hayConflicto = await this.comprobarConflictoProfesor(
      horario.profesorId,
      horario.dia,
      horario.franja,
    );
    if (hayConflicto) return false;

    await this.horariosStorage.add(horario);
    return true;
  }

  public async obtenerInformeAlumno(
    alumnoId: string,
  ): Promise<{ faltas: number; retrasos: number; sanciones: number }> {
    await this.simularRed();
    const [asistencias, sanciones] = await Promise.all([
      this.asistenciaStorage.getAll(),
      this.sancionesStorage.getAll(),
    ]);
    const asistenciasAlumno = asistencias.filter(
      (asistencia) => asistencia.alumnoId === alumnoId,
    );

    return {
      faltas: asistenciasAlumno.filter((asistencia) => asistencia.estado === "falta").length,
      retrasos: asistenciasAlumno.filter((asistencia) => asistencia.estado === "retraso").length,
      sanciones: sanciones.filter((sancion) => sancion.alumnoId === alumnoId).length,
    };
  }

  public async registrarUsuarioAsync(nuevoUsuario: Usuario): Promise<boolean> {
    await this.simularRed();
    const usuarios = await this.usuariosStorage.getAll();
    if (usuarios.some((usuario) => usuario.id === nuevoUsuario.id)) return false;
    await this.usuariosStorage.add(nuevoUsuario);
    return true;
  }

  public async obtenerUsuariosPorRol(rol: RolUsuario): Promise<Usuario[]> {
    const usuarios = await this.usuariosStorage.getAll();
    return usuarios.filter((usuario) => usuario.rol === rol);
  }

  public registrarSancionAsync(
    alumnoId: string,
    profesorId: string,
    tipo: TipoSancion,
    descripcion: string,
  ): Promise<void> {
    return this.registrarSancion(alumnoId, profesorId, tipo, descripcion);
  }

  public actualizarVersion(nuevaVersion: string): void {
    this.version = nuevaVersion;
  }

  public verVersion(): string {
    return this.version;
  }

  private async simularRed(): Promise<void> {
    await new Promise<void>((resolve) => setTimeout(resolve, 300));
  }
}