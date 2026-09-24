import {CRMController} from "./controllers/crm.controller";
//Instanciamos la clase CRMController
const miEscuelaCRM = new CRMController("1.0.0");

console.log("Versión inicial del CRM:", miEscuelaCRM.verVersion());
//Usamos sus métodos.
const profesores = miEscuelaCRM.filtrarUsuariosPorRol("profesor");

console.log("Profesores del centro:", profesores);

const nuevoUsuario = {
	id: 7,
	nombre: "Sofía Navarro",
	rol: "alumno" as const,
	activo: true,
};

console.log("Alta de usuario:", miEscuelaCRM.agregarUsuario(nuevoUsuario));