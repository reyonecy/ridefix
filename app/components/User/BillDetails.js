'use client';
import { useEffect, useState } from 'react';
import { getBillDetails } from '@/app/utils/vehicleapi';

export default function BillDetails({ billId, onClose }) {
  const [bill, setBill] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchBillDetails();
  }, [billId]);

  const fetchBillDetails = async () => {
    try {
      setLoading(true);
      const response = await getBillDetails(billId);
      if (response.success) {
        setBill(response.data);
      } else {
        setError(response.message);
      }
    } catch (error) {
      setError('Failed to fetch bill details');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  if (loading) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
          <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto"></div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
        <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl">
          <div className="text-red-600 text-center">{error}</div>
          <button
            onClick={onClose}
            className="mt-4 px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 w-full"
          >
            Close
          </button>
        </div>
      </div>
    );
  }

  if (!bill) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center overflow-y-auto">
      <div className="bg-white p-6 rounded-lg shadow-xl w-full max-w-2xl m-4">
        {/* Header */}
        <div className="flex justify-between items-start mb-6">
          <div>
            <h2 className="text-2xl font-bold">Bill Details</h2>
            <p className="text-gray-600">Generated on: {formatDate(bill.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        {/* Workshop and Repair Info */}
        <div className="mb-6">
          <div className="bg-gray-50 rounded-lg p-4">
            <h3 className="font-semibold text-lg mb-2">Workshop Details</h3>
            <p>Workshop: {bill.workshop_name}</p>
            {bill.repair_description && (
              <p className="mt-2">Repair Description: {bill.repair_description}</p>
            )}
          </div>
        </div>

        {/* Parts Used */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Parts Used</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-4 gap-4 font-medium mb-2">
              <div>Part Name</div>
              <div>Cost</div>
              <div>Quantity</div>
              <div>Total</div>
            </div>
            {bill.parts_used.map((part, index) => (
              <div key={index} className="grid grid-cols-4 gap-4 py-2 border-t">
                <div>{part.part_name}</div>
                <div>₹{part.part_cost}</div>
                <div>{part.quantity}</div>
                <div>₹{part.part_cost * part.quantity}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Extra Charges */}
        <div className="mb-6">
          <h3 className="font-semibold text-lg mb-2">Extra Charges</h3>
          <div className="bg-gray-50 rounded-lg p-4">
            <div className="grid grid-cols-2 gap-4 font-medium mb-2">
              <div>Description</div>
              <div>Amount</div>
            </div>
            {bill.extra_charges.map((charge, index) => (
              <div key={index} className="grid grid-cols-2 gap-4 py-2 border-t">
                <div>{charge.charge_name}</div>
                <div>₹{charge.charge_cost}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Totals */}
        <div className="border-t pt-4">
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Parts Total:</span>
              <span>₹{bill.parts_total}</span>
            </div>
            <div className="flex justify-between">
              <span>Extra Charges Total:</span>
              <span>₹{bill.charges_total}</span>
            </div>
            <div className="flex justify-between font-bold text-lg">
              <span>Grand Total:</span>
              <span>₹{bill.grand_total}</span>
            </div>
          </div>
        </div>

        {/* Payment Status */}
        <div className="mt-6 flex justify-between items-center">
          <div className="flex items-center">
            <span className="mr-2">Payment Status:</span>
            <span className={`px-3 py-1 rounded-full text-sm ${
              bill.payment_status === 'Paid'
                ? 'bg-green-100 text-green-800'
                : 'bg-yellow-100 text-yellow-800'
            }`}>
              {bill.payment_status}
            </span>
          </div>
          {bill.payment_reference && (
            <div className="text-sm text-gray-600">
              Ref: {bill.payment_reference}
            </div>
          )}
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-end space-x-4">
          <button
            onClick={() => window.print()}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Print Bill
          </button>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
} 