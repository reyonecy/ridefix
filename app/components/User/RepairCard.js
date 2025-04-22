'use client';
import { useState, useEffect } from 'react';
import { getBillDetails } from '@/app/utils/vehicleapi';

const RepairCard = ({ repair }) => {
  const [billDetails, setBillDetails] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [isExpanded, setIsExpanded] = useState(false);

  useEffect(() => {
    // Fetch bill details if repair is billed
    if (repair.bill_status === 'Billed' && repair.bill_id) {
      fetchBillDetails();
    }
  }, [repair.bill_status, repair.bill_id]);

  const fetchBillDetails = async () => {
    try {
      setLoading(true);
      const response = await getBillDetails(repair.bill_id);
      if (response.success) {
        setBillDetails(response.data);
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
      day: 'numeric'
    });
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6 mb-4">
      {/* Basic Repair Info */}
      <div className="flex justify-between items-start mb-4">
        <div>
          <h3 className="text-lg font-semibold">
            Vehicle: {repair.vehicle_name}
          </h3>
          <p className="text-gray-600">
            Workshop: {repair.workshop_id?.name}
          </p>
          <p className="text-gray-600">
            Requested: {formatDate(repair.createdAt)}
          </p>
        </div>
        <div className="flex flex-col items-end">
          <span className={`px-3 py-1 rounded-full text-sm ${
            repair.status === 'Completed' ? 'bg-green-100 text-green-800' :
            repair.status === 'Accepted' ? 'bg-blue-100 text-blue-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {repair.status}
          </span>
          {repair.bill_status === 'Billed' && (
            <span className="mt-2 text-green-600 text-sm font-medium">
              Bill Generated
            </span>
          )}
        </div>
      </div>

      <div className="text-gray-700 mb-4">
        <strong>Repair Description:</strong>
        <p>{repair.repair_description}</p>
      </div>

      {/* Bill Section */}
      {repair.bill_status === 'Billed' && (
        <div className="mt-4 border-t pt-4">
          {loading ? (
            <div className="flex justify-center">
              <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
            </div>
          ) : error ? (
            <p className="text-red-600 text-sm">{error}</p>
          ) : billDetails && (
            <div className="space-y-4">
              <button
                onClick={() => setIsExpanded(!isExpanded)}
                className="w-full flex justify-between items-center text-left text-blue-600 hover:text-blue-700"
              >
                <span className="font-medium">
                  {isExpanded ? 'Hide Bill Details' : 'Show Bill Details'}
                </span>
                <svg
                  className={`w-5 h-5 transform transition-transform ${isExpanded ? 'rotate-180' : ''}`}
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>

              {isExpanded && (
                <div className="space-y-4">
                  {/* Parts Used */}
                  <div className="bg-gray-50 rounded-lg p-4">
                    <h4 className="font-medium mb-2">Parts Used</h4>
                    <div className="grid grid-cols-4 gap-2 text-sm">
                      <div className="font-medium">Part</div>
                      <div className="font-medium">Cost</div>
                      <div className="font-medium">Qty</div>
                      <div className="font-medium">Total</div>
                      {billDetails.parts_used.map((part, index) => (
                        <>
                          <div>{part.part_name}</div>
                          <div>₹{part.part_cost}</div>
                          <div>{part.quantity}</div>
                          <div>₹{part.part_cost * part.quantity}</div>
                        </>
                      ))}
                    </div>
                  </div>

                  {/* Extra Charges */}
                  {billDetails.extra_charges.length > 0 && (
                    <div className="bg-gray-50 rounded-lg p-4">
                      <h4 className="font-medium mb-2">Extra Charges</h4>
                      <div className="grid grid-cols-2 gap-2 text-sm">
                        <div className="font-medium">Description</div>
                        <div className="font-medium">Amount</div>
                        {billDetails.extra_charges.map((charge, index) => (
                          <>
                            <div>{charge.charge_name}</div>
                            <div>₹{charge.charge_cost}</div>
                          </>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Totals */}
                  <div className="border-t pt-4">
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span>Parts Total:</span>
                        <span>₹{billDetails.parts_total}</span>
                      </div>
                      <div className="flex justify-between">
                        <span>Extra Charges Total:</span>
                        <span>₹{billDetails.charges_total}</span>
                      </div>
                      <div className="flex justify-between font-bold text-base">
                        <span>Grand Total:</span>
                        <span>₹{billDetails.grand_total}</span>
                      </div>
                    </div>
                  </div>

                  {/* Payment Status */}
                  <div className="flex justify-between items-center pt-2">
                    <div className="flex items-center">
                      <span className="mr-2">Payment Status:</span>
                      <span className={`px-3 py-1 rounded-full text-sm ${
                        billDetails.payment_status === 'Paid'
                          ? 'bg-green-100 text-green-800'
                          : 'bg-yellow-100 text-yellow-800'
                      }`}>
                        {billDetails.payment_status}
                      </span>
                    </div>
                    <button
                      onClick={() => window.print()}
                      className="px-4 py-2 text-sm bg-blue-600 text-white rounded-md hover:bg-blue-700"
                    >
                      Print Bill
                    </button>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default RepairCard; 