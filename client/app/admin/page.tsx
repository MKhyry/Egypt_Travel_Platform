'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/layout/MainLayout';
import { useAuthStore } from '@/store/authStore';
import { placesAPI, hotelsAPI, packagesAPI } from '@/lib/api';

type EntityType = 'places' | 'hotels' | 'packages';

export default function AdminPage() {
  const router = useRouter();
  const { user, isInitializing } = useAuthStore();
  const [activeTab, setActiveTab] = useState<EntityType>('places');
  const [items, setItems] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingItem, setEditingItem] = useState<any>(null);
  const [formData, setFormData] = useState<Record<string, any>>({});
  const [submitting, setSubmitting] = useState(false);
  const [message, setMessage] = useState('');
  const [errors, setErrors] = useState<string[]>([]);

  useEffect(() => {
    if (isInitializing) return;
    if (!user) { router.push('/login'); return; }
    if (user.role !== 'admin') { router.push('/'); return; }
    fetchItems();
  }, [user, isInitializing, activeTab]);

  const fetchItems = async () => {
    setIsLoading(true);
    try {
      let res;
      if (activeTab === 'places') res = await placesAPI.getAll();
      else if (activeTab === 'hotels') res = await hotelsAPI.getAll();
      else res = await packagesAPI.getAll();
      setItems(res.data.data || []);
    } catch (err) {
      setItems([]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this item?')) return;
    try {
      if (activeTab === 'places') await placesAPI.delete(id);
      else if (activeTab === 'hotels') await hotelsAPI.delete(id);
      else await packagesAPI.delete(id);
      setMessage('Deleted successfully');
      fetchItems();
    } catch (err: any) {
      setMessage(err?.response?.data?.message || 'Delete failed');
    }
  };

  const startEdit = (item: any) => {
    setEditingItem(item);
    // Only copy editable fields, exclude system fields
    const { _id, __v, createdAt, updatedAt, ...editable } = item;
    // Convert arrays to comma-separated strings for form display
    if (Array.isArray(editable.images)) editable.images = editable.images.join(', ');
    if (Array.isArray(editable.regions)) editable.regions = editable.regions.join(', ');
    if (Array.isArray(editable.amenities)) editable.amenities = editable.amenities.join(', ');
    if (Array.isArray(editable.nearbyPlaces)) editable.nearbyPlaces = editable.nearbyPlaces.join(', ');
    if (Array.isArray(editable.tips)) editable.tips = editable.tips.join(', ');
    if (editable.location && typeof editable.location === 'object') editable.location = JSON.stringify(editable.location);
    setFormData(editable);
    setShowForm(true);
  };

  const startCreate = () => {
    setEditingItem(null);
    setFormData({});
    setShowForm(true);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    setMessage('');
    setErrors([]);
    try {
      const data: Record<string, any> = { ...formData };
      // Convert comma-separated strings to arrays
      if (typeof data.images === 'string') data.images = data.images.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (typeof data.regions === 'string') data.regions = data.regions.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (typeof data.amenities === 'string') data.amenities = data.amenities.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (typeof data.nearbyPlaces === 'string') data.nearbyPlaces = data.nearbyPlaces.split(',').map((s: string) => s.trim()).filter(Boolean);
      if (typeof data.tips === 'string') data.tips = data.tips.split(',').map((s: string) => s.trim()).filter(Boolean);

      // Parse location JSON for places
      if (activeTab === 'places' && data.location && typeof data.location === 'string') {
        try {
          data.location = JSON.parse(data.location);
        } catch {
          delete data.location;
        }
      }

      let res;
      if (editingItem) {
        if (activeTab === 'places') res = await placesAPI.update(editingItem._id, data);
        else if (activeTab === 'hotels') res = await hotelsAPI.update(editingItem._id, data);
        else res = await packagesAPI.update(editingItem._id, data);
        setMessage('Updated successfully');
      } else {
        if (activeTab === 'places') res = await placesAPI.create(data);
        else if (activeTab === 'hotels') res = await hotelsAPI.create(data);
        else res = await packagesAPI.create(data);
        setMessage('Created successfully');
      }
      setShowForm(false);
      setEditingItem(null);
      fetchItems();
    } catch (err: any) {
      const responseData = err?.response?.data;
      if (responseData?.errors && Array.isArray(responseData.errors)) {
        setErrors(responseData.errors);
        setMessage('Please fix the validation errors below');
      } else {
        setMessage(responseData?.message || 'Operation failed. Check console for details.');
      }
      console.error('Form submission error:', err?.response?.data || err);
    } finally {
      setSubmitting(false);
    }
  };

  const renderField = (key: string, value: any) => {
    if (key === '_id' || key === '__v' || key === 'createdAt' || key === 'updatedAt') return null;
    if (Array.isArray(value)) return `${key}: ${value.length} items`;
    if (typeof value === 'object' && value !== null) return `${key}: [object]`;
    return `${key}: ${String(value).slice(0, 50)}`;
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto px-8 py-stack-lg">
        <h1 className="font-h1 text-h1 text-on-surface mb-8">Admin Dashboard</h1>

        {message && (
          <div className={`p-4 rounded-lg mb-6 ${message.includes('success') ? 'bg-secondary-container text-on-secondary-container' : 'bg-error-container text-error'}`}>
            {message}
            {errors.length > 0 && (
              <ul className="mt-2 ml-4 list-disc text-sm">
                {errors.map((err, i) => <li key={i}>{err}</li>)}
              </ul>
            )}
          </div>
        )}

        {/* Tabs */}
        <div className="flex gap-2 mb-8">
          {(['places', 'hotels', 'packages'] as EntityType[]).map((tab) => (
            <button
              key={tab}
              onClick={() => { setActiveTab(tab); setShowForm(false); setEditingItem(null); }}
              className={`px-6 py-3 rounded-lg font-label-caps uppercase tracking-widest transition-all ${
                activeTab === tab ? 'bg-primary text-on-primary' : 'bg-surface-container text-on-surface-variant hover:bg-surface-container-high'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Create Button */}
        <button
          onClick={startCreate}
          className="mb-6 bg-primary text-on-primary px-6 py-3 rounded-lg font-label-caps uppercase tracking-widest hover:bg-primary/90 transition-all"
        >
          + Add New {activeTab.slice(0, -1)}
        </button>

        {/* Form */}
        {showForm && (
          <div className="bg-surface-container-lowest rounded-xl p-8 border border-surface-container-high mb-8">
            <h2 className="font-h2 text-h2 text-on-surface mb-6">
              {editingItem ? 'Edit' : 'Create'} {activeTab.slice(0, -1)}
            </h2>
            <form onSubmit={handleSubmit} className="space-y-4">
              {activeTab === 'places' && (
                <>
                  <div>
                    <input placeholder="Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                    <p className="text-xs text-on-surface-variant mt-1">Enter the place name (min 2 characters)</p>
                  </div>
                  <div>
                    <input placeholder="City" value={formData.city || ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                    <p className="text-xs text-on-surface-variant mt-1">E.g., Cairo, Luxor, Aswan</p>
                  </div>
                  <div>
                    <input placeholder="Category" value={formData.category || ''} onChange={(e) => setFormData({ ...formData, category: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                    <p className="text-xs text-on-surface-variant mt-1">E.g., historical, nature, beach, adventure, cultural</p>
                  </div>
                  <div>
                    <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                  </div>
                  <div>
                    <textarea placeholder="Images (comma-separated URLs)" value={formData.images || ''} onChange={(e) => setFormData({ ...formData, images: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                    <p className="text-xs text-on-surface-variant mt-1">Enter Cloudinary URLs separated by commas</p>
                  </div>
                  <div>
                    <input placeholder="Rating (0-5)" type="number" step="0.1" min="0" max="5" value={formData.rating || ''} onChange={(e) => setFormData({ ...formData, rating: parseFloat(e.target.value) })} className="w-full p-3 border border-outline-variant rounded-lg" />
                  </div>
                  <div>
                    <input placeholder="Visit Duration (hours)" type="number" value={formData.visitDuration || ''} onChange={(e) => setFormData({ ...formData, visitDuration: parseInt(e.target.value) })} className="w-full p-3 border border-outline-variant rounded-lg" />
                  </div>
                  <div>
                    <textarea placeholder="Tips (comma-separated)" value={formData.tips || ''} onChange={(e) => setFormData({ ...formData, tips: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" />
                    <p className="text-xs text-on-surface-variant mt-1">E.g., Best visited in morning, Wear comfortable shoes</p>
                  </div>
                  <div>
                    <input placeholder='Location (e.g., 30.0, 31.0)' value={formData.location || ''} onChange={(e) => setFormData({ ...formData, location: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" />
                    <p className="text-xs text-on-surface-variant mt-1">Enter valid JSON with lat and lng (e.g., lat: 30.0, lng: 31.0)</p>
                  </div>
                </>
              )}
              {activeTab === 'hotels' && (
                <>
                  <div>
                    <input placeholder="Name" value={formData.name || ''} onChange={(e) => setFormData({ ...formData, name: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                  </div>
                  <div>
                    <input placeholder="City" value={formData.city || ''} onChange={(e) => setFormData({ ...formData, city: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                    <p className="text-xs text-on-surface-variant mt-1">E.g., Cairo, Luxor, Aswan</p>
                  </div>
                  <div>
                    <input placeholder="Stars (1-5)" type="number" min="1" max="5" value={formData.stars || ''} onChange={(e) => setFormData({ ...formData, stars: parseInt(e.target.value) })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                  </div>
                  <div>
                    <input placeholder="Price Per Night" type="number" value={formData.pricePerNight || ''} onChange={(e) => setFormData({ ...formData, pricePerNight: parseFloat(e.target.value) })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                  </div>
                  <div>
                    <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" />
                  </div>
                  <div>
                    <textarea placeholder="Images (comma-separated URLs)" value={formData.images || ''} onChange={(e) => setFormData({ ...formData, images: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                    <p className="text-xs text-on-surface-variant mt-1">Enter Cloudinary URLs separated by commas</p>
                  </div>
                  <div>
                    <input placeholder="Amenities (comma-separated)" value={formData.amenities || ''} onChange={(e) => setFormData({ ...formData, amenities: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" />
                    <p className="text-xs text-on-surface-variant mt-1">E.g., WiFi, Pool, Gym, Spa</p>
                  </div>
                  <div>
                    <input placeholder="Nearby Places IDs (comma-separated ObjectIds)" value={formData.nearbyPlaces || ''} onChange={(e) => setFormData({ ...formData, nearbyPlaces: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" />
                    <p className="text-xs text-on-surface-variant mt-1">Enter valid MongoDB ObjectIds separated by commas</p>
                  </div>
                </>
              )}
              {activeTab === 'packages' && (
                <>
                  <div>
                    <input placeholder="Title" value={formData.title || ''} onChange={(e) => setFormData({ ...formData, title: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                  </div>
                  <div>
                    <input placeholder="Days" type="number" value={formData.days || ''} onChange={(e) => setFormData({ ...formData, days: parseInt(e.target.value) })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                  </div>
                  <div>
                    <input placeholder="Price" type="number" value={formData.price || ''} onChange={(e) => setFormData({ ...formData, price: parseFloat(e.target.value) })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                  </div>
                  <div>
                    <textarea placeholder="Description" value={formData.description || ''} onChange={(e) => setFormData({ ...formData, description: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                  </div>
                  <div>
                    <input placeholder="Image URL" value={formData.image || ''} onChange={(e) => setFormData({ ...formData, image: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                  </div>
                  <div>
                    <input placeholder="Tier (Luxury/Boutique/Essential)" value={formData.tier || ''} onChange={(e) => setFormData({ ...formData, tier: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                    <p className="text-xs text-on-surface-variant mt-1">Must be one of: Luxury, Boutique, Essential</p>
                  </div>
                  <div>
                    <input placeholder="Regions (comma-separated)" value={formData.regions || ''} onChange={(e) => setFormData({ ...formData, regions: e.target.value })} className="w-full p-3 border border-outline-variant rounded-lg" required />
                    <p className="text-xs text-on-surface-variant mt-1">E.g., Upper Egypt, Red Sea, Sinai</p>
                  </div>
                </>
              )}
              <div className="flex gap-4">
                <button type="submit" disabled={submitting} className="bg-primary text-on-primary px-6 py-3 rounded-lg font-bold disabled:opacity-50">
                  {submitting ? 'Saving...' : 'Save'}
                </button>
                <button type="button" onClick={() => { setShowForm(false); setEditingItem(null); }} className="border border-outline-variant px-6 py-3 rounded-lg">
                  Cancel
                </button>
              </div>
            </form>
          </div>
        )}

        {/* List */}
        {isLoading ? (
          <div className="text-center py-20 text-on-surface-variant">Loading...</div>
        ) : (
          <div className="bg-surface-container-lowest rounded-xl border border-surface-container-high overflow-hidden">
            <table className="w-full">
              <thead className="bg-surface-container">
                <tr>
                  <th className="text-left p-4 font-label-caps text-label-caps">Name</th>
                  <th className="text-left p-4 font-label-caps text-label-caps">Details</th>
                  <th className="text-right p-4 font-label-caps text-label-caps">Actions</th>
                </tr>
              </thead>
              <tbody>
                {items.map((item) => (
                  <tr key={item._id} className="border-t border-surface-container-high">
                    <td className="p-4">
                      <div className="font-bold text-on-surface">{item.name || item.title}</div>
                      <div className="text-sm text-on-surface-variant">{item.city || item.tier}</div>
                    </td>
                    <td className="p-4 text-sm text-on-surface-variant">
                      {Object.entries(item).slice(0, 6).map(([key, value]) => renderField(key, value)).filter(Boolean).map((s, i) => (
                        <div key={i} className="text-xs">{s}</div>
                      ))}
                    </td>
                    <td className="p-4 text-right">
                      <button onClick={() => startEdit(item)} className="text-primary mr-4 hover:underline">Edit</button>
                      <button onClick={() => handleDelete(item._id)} className="text-error hover:underline">Delete</button>
                    </td>
                  </tr>
                ))}
                {items.length === 0 && (
                  <tr><td colSpan={3} className="text-center p-8 text-on-surface-variant">No {activeTab} found</td></tr>
                )}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
