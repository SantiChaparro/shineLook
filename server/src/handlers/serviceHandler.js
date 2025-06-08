const {
  getAllServices,
  postNewService,
  updatedService,
  getService,
  distroyService,
} = require("../controllers/serviceControllers");

const getServices = async (req, res) => {
  const { tenantId } = req.query;
  console.log("tenantId", tenantId);
  
  try {
    const services = await getAllServices(tenantId);

    if (services) {
      res.status(200).json(services);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const postService = async (req, res) => {
  const { service_name, cost, category, tenantId } = req.body;

  try {
    const service = await postNewService(service_name, cost, category, tenantId);

    if (service) {
      res.status(200).json(service);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const getServiceById = async (req, res) => {
  const { id } = req.params;

  try {
    const service = await getService(id);

    if (service) {
      res.status(200).json(service);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const updateService = async (req, res) => {
  const serviceData = req.body;
  const { id } = req.params;

  try {
    const service = await updatedService(id, serviceData);

    if (service) {
      res.status(200).json(service);
    }
  } catch (error) {
    res.status(500).send({ error: error.message });
  }
};

const deleteService = async (req, res) => {
  const { id } = req.params;

  try {
    const deletedService = await distroyService(id);

    if (deleteService) {
      res.status(200).json(deleteService);
    }
  } catch (error) {
    req.status(500).json({ error: error.message });
  }
};

module.exports = {
  getServices,
  postService,
  updateService,
  getServiceById,
  deleteService,
};
