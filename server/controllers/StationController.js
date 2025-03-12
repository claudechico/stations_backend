import Station from '../models/Station.js';

export const getAllStations = async (req, res) => {
  try {
    const stations = await Station.findAll();
    res.json(stations);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const getStationById = async (req, res) => {
  try {
    const station = await Station.findByPk(req.params.id);
    if (!station) return res.status(404).json({ message: 'Station not found' });
    res.json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const createStation = async (req, res) => {
  try {
    const station = await Station.create(req.body);
    res.status(201).json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const updateStation = async (req, res) => {
  try {
    const station = await Station.findByPk(req.params.id);
    if (!station) return res.status(404).json({ message: 'Station not found' });
    await station.update(req.body);
    res.json(station);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};

export const deleteStation = async (req, res) => {
  try {
    const station = await Station.findByPk(req.params.id);
    if (!station) return res.status(404).json({ message: 'Station not found' });
    await station.destroy();
    res.json({ message: 'Station deleted' });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
