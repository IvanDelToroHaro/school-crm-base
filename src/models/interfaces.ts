export type Rol = "profesor" | "alumno" | "administrador";

export interface Usuario {
  id: number;
  nombre: string;
  rol: Rol;
  activo: boolean;
}
