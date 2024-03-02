import Company from './company.model.js';
import exceljs from 'exceljs';

export const addCompany = async (req, res) => {
    try {
        // Verificar
        if (!req.admin || req.admin.role !== 'ADMIN') {
            return res.status(403).send({ message: 'Unauthorized access' });
        }
        // Captura
        const {name, industry, address, phone, email, registeredby, impactLevel, yearsInBusiness, businessCategory} = req.body;
        // Verificar
        if (!name || !industry || !address || !phone || !email || !registeredby || !impactLevel || !yearsInBusiness || !businessCategory) {
            return res.status(400).send({ message: 'All fields are required' });
        }
        // Crea una nueva instancia
        const newCompany = new Company({
            name, industry, address, phone, email, registeredby, impactLevel, yearsInBusiness, businessCategory
        });

        // Aqui guardamos la nueva empresa
        const savedCompany = await newCompany.save();

        // Respondemos un mensaje de exitó
        return res.status(201).send({ message: 'Company added successfully', company: savedCompany });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error when adding an existing company to the database' });
    }
};



export const getAllCompaniesAZ = async (req, res) => {
    try {
        let { filterByCategory, filterByYears, sortBy, sortOrder } = req.query;
        let query = Company.find();
        // Filtra categoría
        if (filterByCategory) {
            query = query.where('businessCategory').equals(filterByCategory);
        }
        // Filtra años
        if (filterByYears) {
            query = query.where('yearsInBusiness').equals(filterByYears);
        }
        // Ordena resultados 
        let sortParams = {};
        if (sortBy) {
            sortParams[sortBy] = sortOrder === 'desc' ? -1 : 1;
        } else {
            // Ordena por nombre
            sortParams['name'] = 1;
        }
        query = query.sort(sortParams);

        // Muestra campos adicionales
        query = query.populate('registeredby', 'name').populate('businessCategory', 'name');

        // Ejecuta consulta
        const companies = await query.exec();

        res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al recuperar las empresas', error: error.message });
    }
};


export const getAllCompaniesZA = async (req, res) => {
    try {
        let { filterByCategory, filterByYears } = req.query;
        let query = Company.find();
        
        // Filtra categoría
        if (filterByCategory) {
            query = query.where('businessCategory').equals(filterByCategory);
        }
        // Filtra años
        if (filterByYears) {
            query = query.where('yearsInBusiness').equals(filterByYears);
        }
        
        //Forma descendente por
        let sortParams = { 'name': -1 };
        query = query.sort(sortParams);

        // Campos adicionales
        query = query.populate('registeredby', 'name').populate('businessCategory', 'name');

        // Ejecuta consulta
        let companies = await query.exec();
        
        // Filtra empresas que comienzan con "Z"
        const companiesStartingWithZ = companies.filter(company => company.name.startsWith('Z'));
        // Filtra empresas que no empiezan con Z
        const companiesNotStartingWithZ = companies.filter(company => !company.name.startsWith('Z'));
        // Ordena empresas que no empiezan con Z
        companiesNotStartingWithZ.sort((a, b) => {
            return a.name < b.name ? 1 : -1;
        });
        // Combina
        companies = companiesStartingWithZ.concat(companiesNotStartingWithZ);

        res.status(200).json(companies);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error al recuperar las empresas', error: error.message });
    }
};



export const updateCompany = async (req, res) => {
    try {
        // Obtener el ID
        const { id } = req.params;
        // Obtener los datos
        const data = req.body;
        // Validar 
        if (!Object.keys(data).length) {
            return res.status(400).send({ message: 'No data provided for update' });
        }
        // Actualiza 
        const updatedCompany = await Company.findOneAndUpdate(
            { _id: id },
            data,
            { new: true }
        ).populate('registeredby', 'name').populate('businessCategory', 'name');
        // Validar la actualización
        if (!updatedCompany) {
            return res.status(404).send({ message: 'Company not found or not updated' });
        }
        // Responder con un mensaje
        return res.status(200).send({ message: 'Company updated successfully', updatedCompany });
    } catch (error) {
        console.error(error);
        return res.status(500).send({ message: 'Error updating company' });
    }
};


export const generateExcelReport = async (req, res) => {
    try {
        // Obtener todas las empresas registradas
        const companies = await Company.find().populate('registeredby', 'name').populate('businessCategory', 'name');
        // Crear un nuevo libro de Excel
        const workbook = new exceljs.Workbook();
        const worksheet = workbook.addWorksheet('Companies');
        // Define
        worksheet.columns = [
            { header: 'Name', key: 'name', width: 20 },
            { header: 'Industry', key: 'industry', width: 20 },
            { header: 'Address', key: 'address', width: 30 },
            { header: 'Phone', key: 'phone', width: 15 },
            { header: 'Email', key: 'email', width: 30 },
            { header: 'Registered By', key: 'registeredby', width: 20 },
            { header: 'Impact Level', key: 'impactLevel', width: 15 },
            { header: 'Years in Business', key: 'yearsInBusiness', width: 20 },
            { header: 'Business Category', key: 'businessCategory', width: 30 }
        ];
        // Agregamos los datos
        companies.forEach(company => {
            const registeredBy = company.registeredby ? company.registeredby.name : '';
            const businessCategory = company.businessCategory ? company.businessCategory.name : '';

            worksheet.addRow({
                name: company.name,
                industry: company.industry,
                address: company.address,
                phone: company.phone,
                email: company.email,
                registeredby: registeredBy,
                impactLevel: company.impactLevel,
                yearsInBusiness: company.yearsInBusiness,
                businessCategory: businessCategory
            });
        });

        worksheet.eachRow(row => {
            row.alignment = {vertical: 'middle', horizontal: 'center'};
        })
        // Eespuesta HTTP para el archivo Excel
        res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
        res.setHeader('Content-Disposition', 'attachment; filename=company_report.xlsx');
        await workbook.xlsx.write(res);
        res.end();
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'Error generating Excel report' });
    }
};
