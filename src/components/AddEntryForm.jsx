import { useState } from 'react';

export default function AddEntryForm({ categories, onAdd, placeholder }) {
  const [description, setDescription] = useState('');
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState(categories[0]);
  const [error, setError] = useState('');

  function handleSubmit(e) {
    e.preventDefault();
    const parsedAmount = parseFloat(amount);
    if (!description.trim()) {
      setError('Description is required.');
      return;
    }
    if (isNaN(parsedAmount) || parsedAmount <= 0) {
      setError('Enter a valid amount greater than 0.');
      return;
    }
    setError('');
    onAdd({ description, amount: parsedAmount, category });
    setDescription('');
    setAmount('');
    setCategory(categories[0]);
  }

  return (
    <form onSubmit={handleSubmit} className="mt-3 space-y-2">
      {error && (
        <p className="text-xs text-red-500 font-medium">{error}</p>
      )}
      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          placeholder={placeholder || 'Description'}
          className="flex-1 border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-300"
        />
        <input
          type="number"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder="Amount ($)"
          min="0.01"
          step="0.01"
          className="w-full sm:w-32 border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 placeholder-gray-300"
        />
        <select
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full sm:w-40 border border-pink-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-pink-300 text-gray-700 bg-white"
        >
          {categories.map((cat) => (
            <option key={cat} value={cat}>
              {cat}
            </option>
          ))}
        </select>
        <button
          type="submit"
          className="bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white text-sm font-semibold rounded-lg px-5 py-2 transition-colors whitespace-nowrap"
        >
          + Add
        </button>
      </div>
    </form>
  );
}
