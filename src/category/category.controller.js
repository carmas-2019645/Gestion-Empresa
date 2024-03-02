import Category from './category.model.js';


export const addCategory = async (req, res) => {
    try {
        // Verificar si el usuario es ADMIN
        if (!req.admin || req.admin.role !== 'ADMIN') {
            return res.status(403).send({ message: 'Unauthorized access' });
        }
        // Capturar los datos
        const { name, description } = req.body;
        // Verificar
        if (!name) {
            return res.status(400).send({ message: 'Category name is required' });
        }
        // Crear una nueva instancia
        const newCategory = new Category({
            name,
            description
        });
        // Guardar
        const savedCategory = await newCategory.save();
        // Responde con un mensaje
        return res.status(201).send({ message: 'Category added successfully', category: savedCategory });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error when adding category already exists in the database' });
    }
};
