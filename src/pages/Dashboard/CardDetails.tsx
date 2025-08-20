"use client"
import React, { useState } from "react"

const CardDetails = () => {
  const [cardNumber, setCardNumber] = useState("4111 1111 1111 1234")
  const [cardHolder, setCardHolder] = useState("John Doe")
  const [expiry, setExpiry] = useState("08/27")
  const [cvv, setCvv] = useState("123")
  const [loading, setLoading] = useState(false)

  const handleUpdate = async () => {
    setLoading(true)
    try {
      // Example API call (replace with your real API endpoint)
      const response = await fetch("/api/update-card", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cardNumber, cardHolder, expiry, cvv }),
      })

      if (!response.ok) throw new Error("Failed to update card")

      alert("Card updated successfully ✅")
    } catch (error) {
      console.error(error)
      alert("Something went wrong ❌")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100 p-4">
      <div className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-md">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Card Details</h2>

        {/* Card Preview */}
        <div className="bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 text-white rounded-xl p-6 mb-6 shadow-md">
          <div className="flex justify-between items-center mb-6">
            <span className="text-sm font-light">Credit Card</span>
            <span className="text-xs">VISA</span>
          </div>
          <p className="text-lg tracking-widest mb-6">
            {cardNumber.replace(/\d{12}(\d{4})/, "**** **** **** $1")}
          </p>
          <div className="flex justify-between text-sm">
            <div>
              <p className="uppercase text-xs opacity-70">Card Holder</p>
              <p className="font-medium">{cardHolder}</p>
            </div>
            <div>
              <p className="uppercase text-xs opacity-70">Expires</p>
              <p className="font-medium">{expiry}</p>
            </div>
          </div>
        </div>

        {/* Editable Inputs */}
        <div className="space-y-4">
          <div>
            <label className="text-sm text-gray-600">Card Number</label>
            <input
              type="text"
              value={cardNumber}
              onChange={(e) => setCardNumber(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div>
            <label className="text-sm text-gray-600">Card Holder</label>
            <input
              type="text"
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
            />
          </div>
          <div className="flex gap-4">
            <div className="flex-1">
              <label className="text-sm text-gray-600">Expiry Date</label>
              <input
                type="text"
                value={expiry}
                onChange={(e) => setExpiry(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
            <div className="flex-1">
              <label className="text-sm text-gray-600">CVV</label>
              <input
                type="password"
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                className="w-full mt-1 p-2 border rounded-lg focus:ring-2 focus:ring-indigo-500"
              />
            </div>
          </div>
        </div>

       
        <div className="mt-6">
          <button
            onClick={handleUpdate}
            disabled={loading}
            className="w-full bg-indigo-600 text-white py-2 rounded-lg hover:bg-indigo-700 transition disabled:opacity-50"
          >
            {loading ? "Updating..." : "Submit Card"}
          </button>
        </div>
      </div>
    </div>
  )
}

export default CardDetails
