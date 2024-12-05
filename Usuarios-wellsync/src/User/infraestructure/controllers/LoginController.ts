import { Request, Response } from "express";
import { LoginUseCase } from "../../application/LoginUseCase";
import { AuditService } from "../../../AuditLog/infraestructure/services/AuditService";
import jwt from 'jsonwebtoken';

export class LoginController {
  constructor(
    private readonly loginUseCase: LoginUseCase,
    private readonly auditService: AuditService  // Inyecta el servicio de auditoría
  ) {}

  async run(req: Request, res: Response) {
    const { correo, password } = req.body;

    // Verificación de que el correo y la contraseña están presentes
    if (!correo || !password) {
      try {
        await this.auditService.logAction('unknown', 'login_failed', 'Correo o contraseña no proporcionados');
      } catch (auditError) {
        console.error('Error al guardar la auditoría de login fallido:', auditError);
      }

      return res.status(400).send({
        status: "Error",
        token: '',
        message: "Correo o contraseña no proporcionados",
      });
    }

    try {
      // Llamada al caso de uso para autenticar al usuario
      const user = await this.loginUseCase.run(correo, password);

      if (user) {
        // Si el usuario es encontrado, generar el JWT
        const token = jwt.sign({ correo }, process.env.JWT_SECRET || 'default_secret', { expiresIn: '1h' });

        try {
          // Registro de auditoría de inicio de sesión exitoso
          await this.auditService.logAction(user.userUuid, 'login', 'Inicio de sesión exitoso');
        } catch (auditError) {
          console.error('Error al guardar la auditoría de login exitoso:', auditError);
        }

        // Respuesta exitosa
        res.status(200).send({
          status: "OK",
          token: token,
          message: "Inicio de sesión exitoso",
          userUuid: user.userUuid,
          leadUuid: user.leadUuid,
        });
      } else {
        // Si el usuario no es encontrado, registrar como intento fallido
        try {
          await this.auditService.logAction('unknown', 'login_failed', `Intento de inicio de sesión fallido para el correo: ${correo}`);
        } catch (auditError) {
          console.error('Error al guardar la auditoría de login fallido:', auditError);
        }

        // Respuesta de error de autenticación
        res.status(400).send({
          status: "Error",
          token: '',
          message: "El usuario o la contraseña son incorrectos",
        });
      }
    } catch (error) {
      // Registro de auditoría de error en el proceso de inicio de sesión
      try {
        await this.auditService.logAction('unknown', 'login_error', `Error en el proceso de inicio de sesión: ${error}`);
      } catch (auditError) {
        console.error('Error al guardar la auditoría de login error:', auditError);
      }

      // Respuesta de error interno
      res.status(500).send({
        status: "Error",
        message: "Ha ocurrido un error en el inicio de sesión",
        error: error,
      });
    }
  }
}












// import { Request, Response } from "express";
// import { LoginUseCase } from "../../application/LoginUseCase";
// import jwt from 'jsonwebtoken';

// export class LoginController {
//   constructor(private readonly loginUseCase: LoginUseCase) {}

//   async run(req: Request, res: Response) {
//     const { correo, password } = req.body;
//     try {
//         const user = await this.loginUseCase.run(correo, password);
        
//         if (user) {
//             const token = jwt.sign({ correo }, 'tu_secreto', { expiresIn: '1h' });
//             res.status(200).send({
//               status: "OK",
//               token: token,
//               message: "Inicio de sesión exitoso",
//               userUuid: user.userUuid,
//               leadUuid: user.leadUuid
//             });
//         } else {
//             res.status(400).send({
//                 status: "Error",
//                 token: '',
//                 message: "El usuario o contraseña son incorrectos",
//             });
//         }
//     } catch (error) {
//       res.status(500).send({
//         status: "Error",
//         message: "Ha ocurrido un error en el inicio de sesión",
//         error: error,
//       });
//     }
//   }
// }





























/*import { Request, Response } from "express";
import { LoginUseCase } from "../../application/LoginUseCase";
import jwt from 'jsonwebtoken';

export class LoginController {
  constructor(private readonly loginUseCase: LoginUseCase) {}

  async run(req: Request, res: Response) {
    const { correo, password } = req.body;
    try {
        const user = await this.loginUseCase.run(correo, password);
        
        if (user) {
            const token = jwt.sign({ correo }, 'tu_secreto', { expiresIn: '1h' });
            res.status(200).send({
              status: "OK",
              token: token,
              message: "Inicio de sesión exitoso",
              userUuid: user.userUuid,
              leadUuid: user.leadUuid
            });
        } else {
            res.status(400).send({
                status: "Error",
                token: '',
                message: "El usuario o contraseña son incorrectos",
            });
        }
    } catch (error) {
      res.status(500).send({
        status: "Error",
        message: "Ha ocurrido un error en el inicio de sesión",
        error: error,
      });
    }
  }
}


*/