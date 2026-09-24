import type { Usuario, Rol } from "../models/interfaces";

export class CRMController {
  // Propiedades
  private usuarioDelCentro: Usuario[] = [];
  private readonly CLAVE_STORAGE = "school_crm_usuarios";

  //Constructor
  constructor(private version: string = "1.0.0") {
    const datosLocales = localStorage.getItem(this.CLAVE_STORAGE);

    if (datosLocales) {
      this.usuarioDelCentro = JSON.parse(datosLocales);
    } else {
      this.usuarioDelCentro = [
        {
          id: 1,
          nombre: "Juan Pérez",
          rol: "profesor",
          activo: true,
        },
        {
          id: 2,
          nombre: "María López",
          rol: "alumno",
          activo: true,
        },
        {
          id: 3,
          nombre: "Carlos García",
          rol: "administrador",
          activo: true,
        },
        {
          id: 4,
          nombre: "Ana Torres",
          rol: "profesor",
          activo: false,
        },
        {
          id: 5,
          nombre: "Luis Fernández",
          rol: "alumno",
          activo: false,
        },
        {
          id: 6,
          nombre: "Elena Martínez",
          rol: "administrador",
          activo: false,
        },
      ];
      this.guardarEnDisco();
    }
  }

  // Métodos: Funcione de ayer qeu estaba en counter.ts, ahora en la clase CrmController convertida en un método de la clase.
  filtrarUsuariosPorRol(rolBuscado: Rol): Usuario[] {
    return this.usuarioDelCentro.filter(
      (usuario) => usuario.rol === rolBuscado,
    );
  }

  obtenerUsuariosPorRol(rolBuscado: Rol): Usuario[] {
    return this.filtrarUsuariosPorRol(rolBuscado);
  }
  actualizarVersion(nuevaVersion: string): void {
    this.version = nuevaVersion;
  }

  verVersion(): string {
    return this.version;
  }

  agregarUsuario(nuevoUsuario: Usuario): string {
    const idDuplicado = this.usuarioDelCentro.some(
      (usuario) => usuario.id === nuevoUsuario.id,
    );

    if (idDuplicado) {
      return "El id " + nuevoUsuario.id + " ya está ocupado.";
    }

    this.usuarioDelCentro.push(nuevoUsuario);
    this.guardarEnDisco();
    return "El usuario " + nuevoUsuario.nombre + " se ha agregado correctamente.";
  }

  private guardarEnDisco(): void {
    localStorage.setItem(
      this.CLAVE_STORAGE,
      JSON.stringify(this.usuarioDelCentro),
    );
  }
}