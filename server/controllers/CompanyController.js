import { Company, User, Country } from '../models/index.js';
import { uploadImage } from '../utils/imageUpload.js';

export const getAllCompanies = async (req, res) => {
  try {
    const companies = await Company.findAll({
      include: [
        {
          model: User,
          as: 'director',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Country,
          attributes: ['id', 'name', 'code']
        }
      ],
      attributes: {
        exclude: ['logo'] // Don't send the logo binary data in the list
      }
    });
    res.json(companies);
  } catch (error) {
    console.error('Error in getAllCompanies:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getCompanyById = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id, {
      include: [
        {
          model: User,
          as: 'director',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Country,
          attributes: ['id', 'name', 'code']
        }
      ],
      attributes: {
        exclude: ['logo'] // Don't send the logo binary data
      }
    });

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    res.json(company);
  } catch (error) {
    console.error('Error in getCompanyById:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getCompanyLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id, {
      attributes: ['logo', 'logoType']
    });

    if (!company || !company.logo) {
      return res.status(404).json({ message: 'Logo not found' });
    }

    res.setHeader('Content-Type', company.logoType);
    res.send(company.logo);
  } catch (error) {
    console.error('Error in getCompanyLogo:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createCompany = async (req, res) => {
  try {
    console.log(' the logo data is req.body:', req.body);
    const { name, email, countryId, directorId } = req.body;
    let logoData = null;
    let logoType = null;

    // Handle logo upload if provided
    if (req.file) {
      const processedImage = await uploadImage(req.file);
      logoData = processedImage.buffer;
      logoType = processedImage.mimeType;
    }
console.log('the logoData is:', logoData);
    const company = await Company.create({
      name,
      email,
      logo: logoData,
      logoType,
      countryId,
      directorId
    });

    // Fetch without logo data for response
    const companyWithRelations = await Company.findByPk(company.id, {
      include: [
        {
          model: User,
          as: 'director',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Country,
          attributes: ['id', 'name', 'code']
        }
      ],
      attributes: {
        exclude: ['logo']
      }
    });

    res.status(201).json(companyWithRelations);
  } catch (error) {
    console.error('Error in createCompany:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, email, countryId, directorId } = req.body;

    const company = await Company.findByPk(id);
    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    const updateData = {
      name: name || company.name,
      email: email || company.email,
      countryId: countryId || company.countryId,
      directorId: directorId || company.directorId
    };

    // Handle logo upload if provided
    if (req.file) {
      const processedImage = await uploadImage(req.file);
      updateData.logo = processedImage.buffer;
      updateData.logoType = processedImage.mimeType;
    }

    await company.update(updateData);

    // Fetch without logo data for response
    const updatedCompany = await Company.findByPk(id, {
      include: [
        {
          model: User,
          as: 'director',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Country,
          attributes: ['id', 'name', 'code']
        }
      ],
      attributes: {
        exclude: ['logo']
      }
    });

    res.json(updatedCompany);
  } catch (error) {
    console.error('Error in updateCompany:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteCompany = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    await company.destroy();
    res.json({ message: 'Company deleted successfully' });
  } catch (error) {
    console.error('Error in deleteCompany:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateCompanyLogo = async (req, res) => {
  try {
    const { id } = req.params;
    const company = await Company.findByPk(id);

    if (!company) {
      return res.status(404).json({ message: 'Company not found' });
    }

    if (!req.file) {
      return res.status(400).json({ message: 'No logo file provided' });
    }

    const processedImage = await uploadImage(req.file);
    await company.update({
      logo: processedImage.buffer,
      logoType: processedImage.mimeType
    });

    // Fetch without logo data for response
    const updatedCompany = await Company.findByPk(id, {
      include: [
        {
          model: User,
          as: 'director',
          attributes: ['id', 'username', 'email']
        },
        {
          model: Country,
          attributes: ['id', 'name', 'code']
        }
      ],
      attributes: {
        exclude: ['logo']
      }
    });

    res.json(updatedCompany);
  } catch (error) {
    console.error('Error in updateCompanyLogo:', error);
    res.status(500).json({ error: error.message });
  }
};