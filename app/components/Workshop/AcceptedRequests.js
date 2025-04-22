"use client";
import { useEffect, useState } from 'react';
import { useWorkshopLoginStore } from '@/app/stores/useWorkshopStore';
import { updateRepairRequest, generateBill } from '@/app/utils/workshopapi';

function AcceptedRequests() {
  const [loading, setLoading] = useState(true);
  const [selectedRepair, setSelectedRepair] = useState(null);
  const [parts, setParts] = useState([{ name: '', cost: '', quantity: 1 }]);
  const [extraCharges, setExtraCharges] = useState([{ description: '', amount: '' }]);
  const [generatingBill, setGeneratingBill] = useState(false);
  const { 
    workshop, 
    acceptedRepairLogs,
    fetchAcceptedRepairLogs 
  } = useWorkshopLoginStore();

  useEffect(() => {
    const loadAcceptedRequests = async () => {
      if (!workshop) return;
      setLoading(true);
      await fetchAcceptedRepairLogs();
      setLoading(false);
    };

    loadAcceptedRequests();
  }, [workshop]);

  const handleAddPart = () => {
    setParts([...parts, { name: '', cost: '', quantity: 1 }]);
  };

  const handleAddCharge = () => {
    setExtraCharges([...extraCharges, { description: '', amount: '' }]);
  };

  const handlePartChange = (index, field, value) => {
    const newParts = [...parts];
    newParts[index][field] = value;
    setParts(newParts);
  };

  const handleChargeChange = (index, field, value) => {
    const newCharges = [...extraCharges];
    newCharges[index][field] = value;
    setExtraCharges(newCharges);
  };

  const handleSubmitUpdate = async (repair_id) => {
    try {
      // Validate and format parts data
      const validParts = parts
        .filter(part => part.name && part.cost)
        .map(part => ({
          name: String(part.name).trim(),
          cost: parseInt(part.cost),
          quantity: parseInt(part.quantity) || 1  // Include quantity
        }));

      // Validate and format charges data
      const validCharges = extraCharges
        .filter(charge => charge.description && charge.amount)
        .map(charge => ({
          description: String(charge.description).trim(),
          amount: parseInt(charge.amount)
        }));

      if (validParts.length === 0) {
        alert('Please add at least one valid part');
        return;
      }

      const response = await updateRepairRequest(
        repair_id,
        validParts,
        validCharges
      );

      if (response.success) {
        alert('Repair request updated successfully');
        setSelectedRepair(null);
        setParts([{ name: '', cost: '', quantity: 1 }]);
        setExtraCharges([{ description: '', amount: '' }]);
        await fetchAcceptedRepairLogs();
      } else {
        alert(response.message || 'Failed to update repair request');
      }
    } catch (error) {
      console.error('Error in handleSubmitUpdate:', error);
      alert(`Error: ${error.message}`);
    }
  };

  const handleGenerateBill = async (repair_id) => {
    try {
      setGeneratingBill(true);
      const response = await generateBill(repair_id);
      
      if (response.success) {
        alert('Bill generated successfully');
        // Refresh the repair logs to show updated status
        await fetchAcceptedRepairLogs();
      } else {
        alert(response.message || 'Failed to generate bill');
      }
    } catch (error) {
      console.error('Error generating bill:', error);
      alert('Failed to generate bill');
    } finally {
      setGeneratingBill(false);
    }
  };

  if (!workshop) {
    return <div>Please log in to view accepted requests.</div>;
  }

  return (
    <div className="p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-bold">Accepted Repair Requests</h2>
        <button 
          onClick={() => fetchAcceptedRepairLogs()}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Refresh
        </button>
      </div>

      {loading ? (
        <p>Loading...</p>
      ) : acceptedRepairLogs.length > 0 ? (
        <ul className="space-y-3">
          {acceptedRepairLogs.map((log) => (
            <li key={log._id} className="p-4 bg-gray-100 rounded shadow">
              <div className="grid grid-cols-2 gap-4">
                <div>
                <p><strong>Vehicle:</strong> {log.vehicle_make}</p>
                <p><strong>Model:</strong> {log.vehicle_model}</p>
                  <p><strong>Issue:</strong> {log.repair_description}</p>
                </div>
                <div>
                  <p><strong>Status:</strong> 
                    <span className="ml-2 px-2 py-1 bg-green-100 text-green-800 rounded">
                      {log.status}
                    </span>
                  </p>
                  <p><strong>Accepted Time:</strong> {new Date(log.updatedAt).toLocaleString()}</p>
                  <p><strong>Requested Time:</strong> {new Date(log.createdAt).toLocaleString()}</p>
                </div>
              </div>
              <div className="  mt-2 pt-2 border-t border-gray-200">
                <p><strong>Customer Details:</strong></p>
                <h2 className="text-md ">
                  <p><strong>Name</strong>  {log.customer_name}</p> 
                  <p><strong>Contact:</strong>  {log.customer_phone}</p> 
                  <p><strong>Email:</strong> {log.customer_email}</p> 
                  <p><strong>Address:</strong> {log.customer_address}</p> 
                 
                </h2>
              </div>

              {/* Update Form */}
              <div className="mt-4 border-t pt-4">
                <button
                  onClick={() => setSelectedRepair(selectedRepair === log._id ? null : log._id)}
                  className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
                >
                  {selectedRepair === log._id ? 'Cancel Update' : 'Update Repair'}
                </button>

                {selectedRepair === log._id && (
                  <div className="mt-4 space-y-4">
                    {/* Parts Used Section */}
                    <div>
                      <h3 className="font-bold mb-2">Parts Used</h3>
                      {parts.map((part, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Part name"
                            value={part.name || ''}
                            onChange={(e) => handlePartChange(index, 'name', e.target.value)}
                            className="border rounded p-2 flex-1"
                          />
                          <input
                            type="number"
                            placeholder="Cost"
                            value={part.cost || ''}
                            onChange={(e) => handlePartChange(index, 'cost', e.target.value)}
                            className="border rounded p-2 w-32"
                          />
                          <input
                            type="number"
                            placeholder="Quantity"
                            value={part.quantity || 1}
                            min="1"
                            onChange={(e) => handlePartChange(index, 'quantity', e.target.value)}
                            className="border rounded p-2 w-24"
                          />
                        </div>
                      ))}
                      <button
                        onClick={handleAddPart}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        + Add Part
                      </button>
                    </div>

                    {/* Extra Charges Section */}
                    <div>
                      <h3 className="font-bold mb-2">Extra Charges</h3>
                      {extraCharges.map((charge, index) => (
                        <div key={index} className="flex gap-2 mb-2">
                          <input
                            type="text"
                            placeholder="Description"
                            value={charge.description}
                            onChange={(e) => handleChargeChange(index, 'description', e.target.value)}
                            className="border rounded p-2 flex-1"
                          />
                          <input
                            type="number"
                            placeholder="Amount"
                            value={charge.amount}
                            onChange={(e) => handleChargeChange(index, 'amount', e.target.value)}
                            className="border rounded p-2 w-32"
                          />
                        </div>
                      ))}
                      <button
                        onClick={handleAddCharge}
                        className="text-blue-500 hover:text-blue-600"
                      >
                        + Add Charge
                      </button>
                    </div>

                    {/* Submit Button */}
                    <button
                      onClick={() => handleSubmitUpdate(log._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Submit Update
                    </button>
                  </div>
                )}
              </div>

              {/* Bill Status and Generation */}
              <div className="mt-4 flex items-center justify-between">
                <div>
                  <span className="font-medium">Bill Status: </span>
                  <span className={`${
                    log.bill_status === 'Billed' ? 'text-green-600' : 'text-yellow-600'
                  }`}>
                    {log.bill_status || 'Not Billed'}
                  </span>
                </div>
                
                {log.bill_status !== 'Billed' && (
                  <button
                    onClick={() => handleGenerateBill(log._id)}
                    disabled={generatingBill}
                    className={`px-4 py-2 rounded-md text-white ${
                      generatingBill
                        ? 'bg-gray-400 cursor-not-allowed'
                        : 'bg-blue-600 hover:bg-blue-700'
                    }`}
                  >
                    {generatingBill ? 'Generating...' : 'Generate Bill'}
                  </button>
                )}
              </div>

              {/* Bill Details (if available) */}
              {log.bill_id && (
                <div className="mt-4 p-4 bg-gray-50 rounded-md">
                  <h3 className="font-semibold mb-2">Bill Summary</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span>Parts Total:</span>
                      <span>₹{log.parts_used.reduce((total, part) => 
                        total + (part.part_cost * part.quantity), 0)}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Extra Charges Total:</span>
                      <span>₹{log.extra_charges.reduce((total, charge) => 
                        total + charge.charge_cost, 0)}</span>
                    </div>
                    <div className="flex justify-between font-semibold">
                      <span>Grand Total:</span>
                      <span>₹{log.parts_used.reduce((total, part) => 
                        total + (part.part_cost * part.quantity), 0) + 
                        log.extra_charges.reduce((total, charge) => 
                        total + charge.charge_cost, 0)}</span>
                    </div>
                  </div>
                </div>
              )}
            </li>
          ))}
        </ul>
      ) : (
        <div className="text-center py-8">
          <p className="text-gray-500">No accepted repair requests found.</p>
        </div>
      )}
    </div>
  );
}

export default AcceptedRequests;