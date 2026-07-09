import Subscriptions from "../models/subscription/subscription";
import Cars from "../models/car/car";
export const handleSubscriptionExpiry = async () => {
  const today = new Date();
  today.setUTCHours(0, 0, 0, 0);
  const expiringSubs = await Subscriptions.find({ enddate: today, status: { $ne: "expired" } });
  const carIds = expiringSubs.map(sub => sub.carid);
  await Subscriptions.updateMany({ enddate: today }, { $set: { status: "expired" } });
  await Cars.updateMany({ _id: { $in: carIds } }, { $set: { availability_status: "available" } });
};