import apiClient from "../lib/apiClient";

export const changeUserPlan = async (
  package_id: number,
  user_id: number,
  duration: number,
  unit: string,
  currency: string,
  no_of_seat: any
): Promise<void> => {
  try {
    const response = await apiClient.put(`profile/changeplans`, {
      package_id,
      user_id,
      duration,
      unit,
      currency,
      no_of_seat,
    });
    console.log("User  subscribed successfully:", response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to update user name. Please try again."
    );
  }
};
export const verifyTransaction = async (transactionId: any): Promise<any> => {
  try {
    const response = await apiClient.get(
      `/payment/flw/verify/transaction/${transactionId}`
    );
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data?.message ||
        "Failed to verify transaction. Please try again."
    );
  }
};

export const verifyPayment = async (
  transaction_id: string,
  classroom: any,
  userId: string,
  userEmail: string,
  transactionType: string
): Promise<void> => {
  try {
    const response = await apiClient.post("/payment/classroom/add/student", {
      userId,
      classroomId: classroom.id || "id",
      email: userEmail,
      amount: classroom.amount,
      currency: classroom.currency || "USD",
      transactionType,
      txid: transaction_id,
      txRef: `classroom_${classroom.id}_${Date.now()}`, // Generating a transaction reference
    });

    console.log("Payment verified successfully:", response.data);
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to verify payment. Please try again."
    );
  }
};

export const verifyCouponCode = async (couponCode: string): Promise<any> => {
  try {
    const response = await apiClient.post(`/auth/verify/couponcode`, {
      couponCode,
    });
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to verify coupon code. Please try again."
    );
  }
};

export const getPaymentId = async (payload: any): Promise<any> => {
  try {
    const { amount, original_price, package_id, interval, currency } = payload;
    const response = await apiClient.post("/payment/create/flw/plan", {
      amount,
      original_price,
      package_id,
      interval,
      currency,
    });
    console.log("response", response);
    return response.data;
  } catch (error: any) {
    throw new Error(
      error.response?.data || "Failed to fetch payload ID. Please try again."
    );
  }
};
