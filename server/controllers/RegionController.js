import { Region } from '../models/Location.js';

export const getAllRegions = async (req, res) => {
  try {
    const regions = await Region.findAll();
    res.json(regions);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getRegionById = async (req, res) => {
  try {
    const region = await Region.findByPk(req.params.id);
    if (!region) return res.status(404).json({ message: 'Region not found' });
    res.json(region);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createRegion = async (req, res) => {
  try {
    const region = await Region.create(req.body);
    res.status(201).json(region);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateRegion = async (req, res) => {
  try {
    const region = await Region.findByPk(req.params.id);
    if (!region) return res.status(404).json({ message: 'Region not found' });
    await region.update(req.body);
    res.json(region);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteRegion = async (req, res) => {
  try {
    const region = await Region.findByPk(req.params.id);
    if (!region) return res.status(404).json({ message: 'Region not found' });
    await region.destroy();
    res.json({ message: 'Region deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
