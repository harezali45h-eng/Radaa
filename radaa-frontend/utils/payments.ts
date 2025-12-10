export const calculateFareWithFee = (fare: number) => {
  const fee = 6;
  const totalCharge = fare + fee;
  const driverReceives = fare - 0; // no driver commission yet
  const platformCut = fee; // you keep 6 KES for now
  return { totalCharge, driverReceives, platformCut };
};
