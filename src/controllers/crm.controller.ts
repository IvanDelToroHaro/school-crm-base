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

  public registrarUsuarioAsync(nuevoUsuario: Usuario): Promise<boolean> {
    return new Promise((resolve) => {
      console.log(
        `[NETWORK]: Conectando con el servidor escolar para registrar a ${nuevoUsuario.id}...`,
      );

      // Simulamos un retraso de red de 2 segundos (2000 milisegundos)
      setTimeout(() => {
        // 1. Validamos si el ID ya existe en nuestro array privado
        const idDuplicado = this.usuarioDelCentro.some(
          (user) => user.id === nuevoUsuario.id,
        );

        if (idDuplicado) {
          console.error(`❌ Error: El usuario con ID [${nuevoUsuario.id}] ya existe en el SchoolCRM.`);
          return; // Cortamos la ejecución para no añadirlo
        }


        this.usuarioDelCentro.push(nuevoUsuario);
        localStorage.setItem(
          this.CLAVE_STORAGE,
          JSON.stringify(this.usuarioDelCentro),
        );

        // La operación ha terminado con éxito: resolvemos la promesa
        resolve(true);
      }, 2000);
    });
  }

  public registrarSancionAsync(
    alumnoId: string,
    profesorId: string,
    tipo: "comportamiento" | "expulsion",
    descripcion: string,
  ): Promise<void> {
    return new Promise((resolve) => {
      setTimeout(() => {
        const sanciones = JSON.parse(
          localStorage.getItem("school_crm_sanciones") ?? "[]",
        );

        sanciones.push({
          id: crypto.randomUUID(),
          alumnoId,
          profesorId,
          tipo,
          descripcion,
          fecha: new Date().toISOString(),
        });

        localStorage.setItem(
          "school_crm_sanciones",
          JSON.stringify(sanciones),
        );
        resolve();
      }, 1500);
    });
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

  private guardarEnDisco(): void {
    localStorage.setItem(
      this.CLAVE_STORAGE,
      JSON.stringify(this.usuarioDelCentro),
    );
  }
}