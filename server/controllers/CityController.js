import { City } from '../models/Location.js';

export const getAllCities = async (req, res) => {
  try {
    const cities = await City.findAll();
    res.json(cities);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getCityById = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    res.json(city);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createCity = async (req, res) => {
  try {
    const city = await City.create(req.body);
    res.status(201).json(city);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateCity = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    await city.update(req.body);
    res.json(city);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteCity = async (req, res) => {
  try {
    const city = await City.findByPk(req.params.id);
    if (!city) return res.status(404).json({ message: 'City not found' });
    await city.destroy();
    res.json({ message: 'City deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
