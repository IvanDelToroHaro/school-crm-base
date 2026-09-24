import type { Rol, Usuario } from "./models/interfaces";

export function devuelveAlAlumno(usuarioDelCentro: Usuario[], id: number): Usuario {
  return usuarioDelCentro.find(usuario => usuario.id === id && usuario.rol === 'alumno')!;
}


export function filtrarUsuariosPorRol(usuarios: Usuario[], rol: Rol, activo: boolean): Usuario[] {
    return usuarios.filter(usuario => usuario.rol === rol && usuario.activo === activo);
}