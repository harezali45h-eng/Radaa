export const getSaccoOverview = async (saccoId) => {
  const id = saccoId ? saccoId.toString() : null;

  return {
    saccoId: id,
    activeMatatus: 0,
    activeTrips: 0,
    completedTripsLastHour: 0,
    averageOccupancy: null
  };
};

export const getSaccoTimeSeries = async (saccoId, range = "1h") => {
  const id = saccoId ? saccoId.toString() : null;

  return {
    saccoId: id,
    range,
    points: []
  };
};
