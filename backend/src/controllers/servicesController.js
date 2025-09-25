// GET /api/services
exports.getServices = (req, res) => {
  const services = [
    { id: 1, name: "Personal Training", description: "Individuelles Training im Studio oder Outdoor" },
    { id: 2, name: "Ernährungsberatung", description: "Maßgeschneiderte Ernährungspläne für deine Ziele" },
    { id: 3, name: "Gruppenkurse", description: "Motivierendes Training in der Gruppe" },
  ];

  res.json(services);
};
