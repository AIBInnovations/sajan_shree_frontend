// components/customers/CustomerList.jsx
import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Plus, Phone, Mail, Eye, Pencil, Trash2, Building2 } from 'lucide-react';
import SearchBar from '../common/SearchBar';
import LoadingSpinner from '../common/LoadingSpinner';
import ConfirmDialog from '../common/ConfirmDialog';
import ApiService from '../../services/api';

const CustomerList = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [customers, setCustomers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [customerToDelete, setCustomerToDelete] = useState(null);
  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    const fetchCustomers = async () => {
      try {
        setLoading(true);
        const data = await ApiService.getCustomers();
        setCustomers(Array.isArray(data) ? data : []);
        setError(null);
      } catch (err) {
        console.error('Error fetching customers:', err);
        setError('Failed to load customers. Please try again.');
      } finally {
        setLoading(false);
      }
    };

    fetchCustomers();
  }, []);

  const handleDeleteCustomer = async () => {
    if (!customerToDelete) return;
    try {
      setDeleting(true);
      await ApiService.deleteCustomer(customerToDelete._id);
      setCustomers((prev) => prev.filter((c) => c._id !== customerToDelete._id));
      setCustomerToDelete(null);
    } catch (err) {
      console.error('Error deleting customer:', err);
      alert(`Error: ${err?.payload?.message || err.message}`);
    } finally {
      setDeleting(false);
    }
  };

  const filteredCustomers = customers.filter((customer) => {
    const term = searchTerm.toLowerCase();
    return (
      (customer.name || '').toLowerCase().includes(term) ||
      (customer.phone || '').toLowerCase().includes(term) ||
      (customer.email || '').toLowerCase().includes(term) ||
      (customer.companyName || '').toLowerCase().includes(term)
    );
  });

  if (loading) return <LoadingSpinner />;
  if (error)
    return (
      <div className="text-center py-8">
        <p className="text-red-600">{error}</p>
      </div>
    );

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <h2 className="text-2xl font-bold text-gray-900">Customers</h2>
        <Link
          to="/customers/new"
          className="inline-flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
        >
          <Plus className="w-4 h-4 mr-2" />
          Add Customer
        </Link>
      </div>

      <SearchBar
        placeholder="Search customers..."
        value={searchTerm}
        onChange={setSearchTerm}
      />

      {filteredCustomers.length === 0 ? (
        <div className="bg-white rounded-lg shadow p-8 text-center text-gray-500">
          No customers found
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredCustomers.map((customer) => (
            <div key={customer._id} className="bg-white rounded-lg shadow p-6">
              <div className="flex justify-between items-start mb-4">
                <div>
                  <h3 className="text-lg font-semibold text-gray-900">
                    {customer.name}
                  </h3>
                  {customer.companyName && (
                    <p className="text-sm text-gray-500 flex items-center mt-1">
                      <Building2 className="w-4 h-4 mr-1" />
                      {customer.companyName}
                    </p>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Link
                    to={`/customers/${customer._id}`}
                    className="text-blue-600 hover:text-blue-900"
                    title="View"
                  >
                    <Eye className="w-5 h-5" />
                  </Link>
                  <Link
                    to={`/customers/edit/${customer._id}`}
                    className="text-gray-600 hover:text-gray-900"
                    title="Edit"
                  >
                    <Pencil className="w-5 h-5" />
                  </Link>
                  <button
                    onClick={() => setCustomerToDelete(customer)}
                    className="text-red-600 hover:text-red-900"
                    title="Delete"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              </div>

              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-600">
                  <Phone className="w-4 h-4 mr-2" />
                  {customer.phone}
                </div>
                {customer.email && (
                  <div className="flex items-center text-gray-600">
                    <Mail className="w-4 h-4 mr-2" />
                    {customer.email}
                  </div>
                )}
              </div>

              {customer.gstNumber && (
                <div className="mt-4 pt-4 border-t border-gray-200 text-sm">
                  <p className="text-gray-500">GST Number</p>
                  <p className="font-semibold">{customer.gstNumber}</p>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      <ConfirmDialog
        isOpen={!!customerToDelete}
        onClose={() => {
          if (!deleting) setCustomerToDelete(null);
        }}
        onConfirm={handleDeleteCustomer}
        title="Delete Customer"
        message={`Are you sure you want to delete ${customerToDelete?.name}? This cannot be undone.`}
      />
    </div>
  );
};

export default CustomerList;
