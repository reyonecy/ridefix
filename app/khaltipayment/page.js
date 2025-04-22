'use client'
import React, { useState, useEffect } from 'react';
import Footer from '../components/shared/Footer';
import Navbar from '../components/shared/Navbar';

function Page() {
  const [status, setStatus] = useState('Processing payment...');
  const [isLoading, setIsLoading] = useState(true);

  // Function to verify payment using Khalti callback API
  const verifyPayment = async () => {
    const urlParams = new URLSearchParams(window.location.search);
    const pidx = urlParams.get('pidx');
    const bill_id = urlParams.get('purchase_order_id'); // Mapping purchase_order_id to bill_id

    if (!pidx || !bill_id) {
      setStatus('Error: Missing payment (pidx) or bill (purchase_order_id) information.');
      setIsLoading(false);
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/api/payment/khaltiCallback?pidx=${pidx}&bill_id=${bill_id}`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      if (data.success) {
        setStatus('Payment verified successfully!');
        // Optionally redirect to a success page after a delay
        setTimeout(() => {
          window.location.href = 'http://localhost:3000';
        }, 2000);
      } else {
        setStatus(`Payment verification failed: ${data.message}`);
        // Optionally redirect to a failure page after a delay
        setTimeout(() => {
          window.location.href = '/failure';
        }, 2000);
      }
    } catch (error) {
      console.error('Error verifying payment:', error);
      setStatus('An error occurred. Please try again later.');
      // Optionally redirect to a failure page after a delay
      setTimeout(() => {
        window.location.href = '/failure';
      }, 2000);
    } finally {
      setIsLoading(false);
    }
  };

  // Call the verification function when the page loads
  useEffect(() => {
    verifyPayment();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow flex items-center justify-center bg-gray-100">
        <div className="text-center p-6 bg-white rounded-lg shadow-lg max-w-md w-full">
          {isLoading ? (
            <>
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500 mx-auto mb-4"></div>
              <p className="text-lg text-gray-700">{status}</p>
            </>
          ) : (
            <p className="text-lg text-gray-700">{status}</p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
}

export default Page;