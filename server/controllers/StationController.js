import { Station, Company, User, City, Region, Country } from '../models/index.js';
import { Op } from 'sequelize';

export const getAllStations = async (req, res) => {
  try {
    const stations = await Station.findAll({
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'logo'],
          required: true
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'username', 'email']
        },
        {
          model: City,
          attributes: ['id', 'name'],
          include: [{
            model: Region,
            attributes: ['id', 'name'],
            include: [{
              model: Country,
              attributes: ['id', 'name', 'code']
            }]
          }]
        }
      ]
    });
    res.json(stations);
  } catch (error) {
    console.error('Error in getAllStations:', error);
    res.status(500).json({ error: error.message });
  }
};

export const getStationById = async (req, res) => {
  try {
    const station = await Station.findByPk(req.params.id, {
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'logo'],
          required: true
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'username', 'email']
        },
        {
          model: City,
          attributes: ['id', 'name'],
          include: [{
            model: Region,
            attributes: ['id', 'name'],
            include: [{
              model: Country,
              attributes: ['id', 'name', 'code']
            }]
          }]
        }
      ]
    });

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    res.json(station);
  } catch (error) {
    console.error('Error in getStationById:', error);
    res.status(500).json({ error: error.message });
  }
};

export const createStation = async (req, res) => {
  try {
    const { name, tin, domainUrl, companyId, managerId, cityId, street } = req.body;

    // Validate required fields
    if (!name || !tin || !domainUrl || !companyId || !cityId || !street) {
      return res.status(400).json({ message: 'Missing required fields' });
    }

    // Check if TIN is unique
    const existingStation = await Station.findOne({ where: { tin } });
    if (existingStation) {
      return res.status(400).json({ message: 'TIN number already exists' });
    }

    // Check if manager is already assigned to another station
    if (managerId) {
      const existingManagerStation = await Station.findOne({ where: { managerId } });
      if (existingManagerStation) {
        return res.status(400).json({ message: 'Manager is already assigned to another station' });
      }
    }

    const station = await Station.create({
      name,
      tin,
      domainUrl,
      companyId,
      managerId,
      cityId,
      street
    });

    // Fetch the created station with all relations
    const createdStation = await Station.findByPk(station.id, {
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'logo'],
          required: true
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'username', 'email']
        },
        {
          model: City,
          attributes: ['id', 'name'],
          include: [{
            model: Region,
            attributes: ['id', 'name'],
            include: [{
              model: Country,
              attributes: ['id', 'name', 'code']
            }]
          }]
        }
      ]
    });

    res.status(201).json(createdStation);
  } catch (error) {
    console.error('Error in createStation:', error);
    res.status(500).json({ error: error.message });
  }
};

export const updateStation = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, tin, domainUrl, companyId, managerId, cityId, street } = req.body;

    const station = await Station.findByPk(id);
    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    // If TIN is being changed, check if new TIN is unique
    if (tin && tin !== station.tin) {
      const existingStation = await Station.findOne({ where: { tin } });
      if (existingStation) {
        return res.status(400).json({ message: 'TIN number already exists' });
      }
    }

    // If manager is being changed, check if new manager is available
    if (managerId && managerId !== station.managerId) {
      const existingManagerStation = await Station.findOne({ 
        where: { 
          managerId,
          id: { [Op.ne]: id } // Now Op will be defined
        } 
      });
      if (existingManagerStation) {
        return res.status(400).json({ message: 'Manager is already assigned to another station' });
      }
    }

    await station.update({
      name: name || station.name,
      tin: tin || station.tin,
      domainUrl: domainUrl || station.domainUrl,
      companyId: companyId || station.companyId,
      managerId: managerId === null ? null : (managerId || station.managerId),
      cityId: cityId || station.cityId,
      street: street || station.street
    });

    // Fetch the updated station with all relations
    const updatedStation = await Station.findByPk(id, {
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'logo'],
          required: true
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'username', 'email']
        },
        {
          model: City,
          attributes: ['id', 'name'],
          include: [{
            model: Region,
            attributes: ['id', 'name'],
            include: [{
              model: Country,
              attributes: ['id', 'name', 'code']
            }]
          }]
        }
      ]
    });

    res.json(updatedStation);
  } catch (error) {
    console.error('Error in updateStation:', error);
    res.status(500).json({ error: error.message });
  }
};

export const deleteStation = async (req, res) => {
  try {
    const { id } = req.params;
    const station = await Station.findByPk(id);

    if (!station) {
      return res.status(404).json({ message: 'Station not found' });
    }

    await station.destroy();
    res.json({ message: 'Station deleted successfully' });
  } catch (error) {
    console.error('Error in deleteStation:', error);
    res.status(500).json({ error: error.message });
  }
};
export const getStationsByCompanyId = async (req, res) => {
  try {
    const { companyId } = req.params;
    const stations = await Station.findAll({
      where: { companyId },
      include: [
        {
          model: Company,
          attributes: ['id', 'name', 'logo'],
          required: true
        },
        {
          model: User,
          as: 'manager',
          attributes: ['id', 'username', 'email']
        },
        {
          model: City,
          attributes: ['id', 'name'],
          include: [
            {
              model: Region,
              attributes: ['id', 'name'],
              include: [
                {
                  model: Country,
                  attributes: ['id', 'name', 'code']
                }
              ]
            }
          ]
        }
      ]
    });

    if (!stations.length) {
      return res.status(404).json({ message: 'No stations found for this company' });
    }

    res.json(stations);
  } catch (error) {
    console.error('Error fetching stations by company id:', error);
    res.status(500).json({ error: error.message });
  }
};


export default {
  getAllStations,
  getStationById,
  createStation,
  updateStation,
  deleteStation,
  getStationsByCompanyId
};