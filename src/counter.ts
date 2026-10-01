import type { RolUsuario, Usuario } from "./models/interfaces";

export function devuelveAlAlumno(usuarioDelCentro: Usuario[], id: string): Usuario | undefined {
  return usuarioDelCentro.find(usuario => usuario.id === id && usuario.rol === "alumno");
}

export function filtrarUsuariosPorRol(usuarios: Usuario[], rol: RolUsuario): Usuario[] {
    return usuarios.filter(usuario => usuario.rol === rol);
}