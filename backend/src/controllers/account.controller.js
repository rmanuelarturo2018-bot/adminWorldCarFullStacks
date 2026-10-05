import { Account, Role } from '../models/index.js';
import { gentoken, validateToken } from '../token.js';


export const login =  async (req, res) => {
// recibir los datos del body de la petición
    const { email, password } = req.body;

    // buscar el usuario en la base de datos
    // desencriptar la contraseña y comparar con la contraseña ingresada
    const user = await Account.findOne({ 
        attributes: ['id', 'email','password', 'firstName', 'lastName', 'name'],
        where: { email },
        include: [
            {
              model: Role, 
              attributes: ['id','name','menu'], 

            }
        ]
    });
    if (!user) {
        return res.json({
            result: "error",
            msg: 'Usuario no encontrado'
        });
    }
    const isValidPassword = await user.validatePassword(password);
    if (!isValidPassword) {
        return res.json({
            result: "error",
            msg: 'Contraseña incorrecta'
        });
    }
    const userWithoutPassword = {
        id: user.id,
        email: user.email,
        firstName: user.firstName,
        lastName: user.lastName,
        role: user.Role ? { id: user.Role.id, name: user.Role.name, menu: user.Role.menu } : null
    };

    // Generar token JWT con expiración de 1 hora y payload posicional [name, iduser, email]
    const token = gentoken('1h', [`${user.firstName} ${user.lastName}`, user.id, user.email, user.Role ? user.Role.name : null]);
    return res.json({
        result: "success",
        msg: 'Usuario logueado correctamente',
        data: userWithoutPassword,
        token
    });

}

export const register =async (req, res) => {
    // Evitar que el cliente envíe un id u otros campos inesperados que sobrescriban registros
    const body = Object.assign({}, req.body);
    if ('id' in body) {
        console.warn(`[account.controller] register: request body contained id=${body.id} -> ignoring it`);
        delete body.id;
    }

    const { email, password, firstName, lastName } = body;
    // valida que campos no esten vacios
    if (!email || !password || !firstName || !lastName) {
        return res.status(403).json({
            result: "error",
            msg: 'Todos los campos son obligatorios'
        });
    }

    console.debug(`[account.controller] register: creating user email=${email}`);

    // validar que el email no exista en la base de datos
    const validateEmail= await Account.findOne({ where: { email } });
    if (validateEmail && validateEmail.email === email) {
        return res.status(403).json({
            result: "error",
            msg: 'El email ya existe'
        });
    }
    // INICIAMOS TRANSACTION PARA CREAR EL USUARIO
    const t = await Account.sequelize.transaction(); //transaction para crear el usuario
    try {
        
        // crear el usuario en la base de datos
        const result = await Account.create(
            { email, password, firstName, lastName},
            { transaction: t }
        );
        await t.commit(); // confirmar la transacción
        console.debug(`[account.controller] register: created user id=${result.id} email=${result.email}`);

        // No devolver la contraseña (ni hasheada) en la respuesta
        return res.status(200).json({
            result: "success",
            msg: 'Usuario creado correctamente',
            data: {
                id: result.id,
                email: result.email,
                firstName: result.firstName,
                lastName: result.lastName
            }
        });

    } catch (error) {
        console.error(error);
        await t.rollback(); // revertir la transacción en caso de error
        return res.status(500).json({
            result: "error",
            msg: 'Error al crear el usuario',
            error: error.message
        });
    }
    
}

export const getAllUsers = async (req, res) => {
    const {id,isActived} = req.query;
    try {
        const users = await Account.findAll({
            attributes: ['id', 'email', 'firstName', 'lastName', 'isActived', 'name'],
            where: {
                ...(id && { id }),
                ...(isActived && { isActived })
            }
        });
        return res.status(200).json({
            result: "success",
            msg: 'Usuarios obtenidos correctamente',
            data: users
        });
    } catch (error) {
        return res.status(500).json({
            result: "error",
            msg: 'Error al obtener los usuarios',
            error: error.message
        });
    }
}

// Actualizar un usuario por ID
export const updateUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { email, firstName, lastName, password, isActived } = req.body;

        const requester = req.user || null;

        if (!requester) {
            return res.status(401).json({ result: 'error', msg: 'Authentication required' });
        }

        const user = await Account.findByPk(id);
        if (!user) {
            return res.status(404).json({ result: "error", msg: 'Usuario no encontrado' });
        }

        // Solo actualizar los campos que vengan en el body
        const updates = {
            ...(typeof email !== 'undefined' && { email }),
            ...(typeof firstName !== 'undefined' && { firstName }),
            ...(typeof lastName !== 'undefined' && { lastName }),
            ...(typeof password !== 'undefined' && { password }),
            ...(typeof isActived !== 'undefined' && { isActived })
        };

        await user.update(updates);

        const userWithoutPassword = {
            id: user.id,
            email: user.email,
            firstName: user.firstName,
            lastName: user.lastName,
            isActived: user.isActived
        };

        return res.status(200).json({
            result: "success",
            msg: 'Usuario actualizado correctamente',
            data: userWithoutPassword
        });
    } catch (error) {
        console.error(error);
        return res.status(500).json({
            result: "error",
            msg: 'Error al actualizar el usuario',
            error: error.message
        });
    }
}

// Endpoint para eliminar usuario (soft delete con isActived)
export const deleteUser = async (req, res) => {
    try {
        const { id } = req.params;
        const { force } = req.query; // ?force=true para borrado físico

        const user = await Account.findByPk(id);
        if (!user) {
            return res.status(404).json({ result: "error", msg: 'Usuario no encontrado' });
        }

        if (force === 'true') {
            // Borrado físico directo de la base de datos
            await user.destroy();
            return res.status(200).json({
                result: "success",
                msg: 'Usuario eliminado permanentemente'
            });
        }

        // Borrado lógico (soft delete): desactivar el usuario
        await user.update({ isActived: false });
        return res.status(200).json({
            result: "success",
            msg: 'Usuario desactivado correctamente',
            data: { id: user.id, email: user.email, isActived: false }
        });
    } catch (error) {
        console.error(error);
        // Si el error es por restricción de llave foránea (FK), dar mensaje claro
        if (error.name === 'SequelizeForeignKeyConstraintError') {
            return res.status(409).json({
                result: "error",
                msg: 'No se puede eliminar: el usuario tiene registros asociados en otras tablas. Use ?force=true o desactive con isActived.',
                error: error.message
            });
        }
        return res.status(500).json({
            result: "error",
            msg: 'Error al eliminar el usuario',
            error: error.message
        });
    }
}

export const getProfile = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ result: 'error', msg: 'Token inválido' });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = validateToken(token);
        if (!decodedToken) {
            return res.status(401).json({ result: 'error', msg: 'Token inválido' });
        }
        const userId = decodedToken.iduser;
        const user = await Account.findByPk(userId, {
            attributes: ['id', 'email', 'firstName', 'lastName', 'name']
        });
        if (!user) {
            return res.status(404).json({ result: 'error', msg: 'Usuario no encontrado' });
        }
        return res.status(200).json({ result: 'success', data: user });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: 'error', msg: 'Error al obtener perfil', error: error.message });
    }
};

export const updateCurrentUser = async (req, res) => {
    try {
        const authHeader = req.headers.authorization;
        
        // 1. Validar que la cabecera exista
        if (!authHeader) {
            return res.status(401).json({
                result: "error",
                msg: "Falta la cabecera de autorización"
            });
        }

        // 2. Extraer el token (cortar después de la palabra 'Bearer')
        const token = authHeader.split(' ')[1]; 
        console.log("🔑 Token recibido en backend:", token); // Log para ver el token en tu consola de VS Code

        // 3. Validar y decodificar el token JWT
        const decodedToken = validateToken(token);
        if (!decodedToken) {
            return res.status(401).json({
                result: "error",
                msg: "Token inválido o expirado"
            });
        }
        
        // El id viene posicional o como propiedad según cómo lo programaste en gentoken
        const userId = decodedToken.iduser; 

        // 4. Buscar y actualizar el usuario en PostgreSQL
        const { email, firstName, lastName } = req.body;
        const user = await Account.findByPk(userId);
        
        if (!user) {
            return res.status(404).json({
                result: "error",
                msg: "Usuario no encontrado"
            });
        }

        if (email) user.email = email;
        if (firstName) user.firstName = firstName;
        if (lastName) user.lastName = lastName;
        await user.save();
        
        // 5. Retornar los datos modificados para que el Frontend se entere
        return res.json({
            result: "success",
            msg: "Usuario actualizado correctamente",
            data: { 
                id: user.id,
                email: user.email,
                firstName: user.firstName,
                lastName: user.lastName
            }
        });

    } catch (error) {   
        console.error("Error crítico en updateCurrentUser:", error);
        res.status(500).json({
            result: "error",
            msg: "Error al actualizar el usuario actual",
            error: error.message
        });
    }
};

// Cambiar contraseña del usuario autenticado
export const changePassword = async (req, res) => {
    try {
        const { currentPassword, newPassword } = req.body;
        if (!currentPassword || !newPassword) {
            return res.status(400).json({ result: 'error', msg: 'Contraseña actual y nueva contraseña son requeridas' });
        }

        const authHeader = req.headers.authorization;
        if (!authHeader) {
            return res.status(401).json({ result: 'error', msg: 'Token inválido' });
        }
        const token = authHeader.split(' ')[1];
        const decodedToken = validateToken(token);
        if (!decodedToken) {
            return res.status(401).json({ result: 'error', msg: 'Token inválido' });
        }
        const userId = decodedToken.iduser;

        const user = await Account.findByPk(userId);
        if (!user) {
            return res.status(404).json({ result: 'error', msg: 'Usuario no encontrado' });
        }

        // Verificar que la contraseña actual sea correcta
        const isValid = await user.validatePassword(currentPassword);
        if (!isValid) {
            return res.status(401).json({ result: 'error', msg: 'La contraseña actual es incorrecta' });
        }

        // Actualizar a la nueva contraseña (el hook beforeUpdate la hasheará)
        user.password = newPassword;
        await user.save();

        return res.status(200).json({ result: 'success', msg: 'Contraseña actualizada correctamente' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: 'error', msg: 'Error al cambiar contraseña', error: error.message });
    }
};

// Nuevo endpoint: reset password por email
export const resetPassword = async (req, res) => {
    try {
        const { email } = req.body;
        if (!email) return res.status(400).json({ result: 'error', msg: 'Email es requerido' });

        const user = await Account.findOne({ where: { email } });
        if (!user) return res.status(404).json({ result: 'error', msg: 'Usuario no encontrado' });

        // Restablecer contraseña a 1234 (el hook beforeUpdate del modelo la hasheará)
        user.password = '1234';
        await user.save();

        return res.status(200).json({ result: 'success', msg: 'Contraseña restablecida a 1234' });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ result: 'error', msg: 'Error al reiniciar la contraseña', error: error.message });
    }
};
