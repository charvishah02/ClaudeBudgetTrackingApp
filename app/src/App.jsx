import { useState } from 'react'

const FOOD_BUDGET = 100
const NUM_DAYS = 4

const FOOD_CATEGORIES = ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Coffee']
const TRANSPORT_CATEGORIES = ['Uber', 'Lyft', 'Flight', 'Train', 'Taxi', 'Subway', 'Rental car', 'Other']

const TRANSPORT_COLORS = {
  Uber: 'bg-gray-900 text-white',
  Lyft: 'bg-pink-500 text-white',
  Flight: 'bg-blue-600 text-white',
  Train: 'bg-green-600 text-white',
  Taxi: 'bg-yellow-400 text-gray-900',
  Subway: 'bg-orange-500 text-white',
  'Rental car': 'bg-purple-600 text-white',
  Other: 'bg-gray-500 text-white',
}

const TRANSPORT_DOT_COLORS = {
  Uber: 'bg-gray-900',
  Lyft: 'bg-pink-500',
  Flight: 'bg-blue-600',
  Train: 'bg-green-600',
  Taxi: 'bg-yellow-400',
  Subway: 'bg-orange-500',
  'Rental car': 'bg-purple-600',
  Other: 'bg-gray-500',
}

const FOOD_COLORS = {
  Breakfast: 'bg-amber-100 text-amber-800',
  Lunch: 'bg-lime-100 text-lime-800',
  Dinner: 'bg-indigo-100 text-indigo-800',
  Snack: 'bg-rose-100 text-rose-800',
  Coffee: 'bg-yellow-100 text-yellow-900',
}

function initState() {
  return {
    days: Array.from({ length: NUM_DAYS }, () => ({ food: [], transport: [] })),
  }
}

function getCategoryColor(category) {
  return FOOD_COLORS[category] || TRANSPORT_COLORS[category] || 'bg-gray-100 text-gray-700'
}

function EntryList({ entries, onDelete }) {
  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <li key={entry.id} className="relative group bg-white rounded-xl px-4 py-3 shadow-sm border border-gray-100">
          <button
            onClick={() => onDelete(entry.id)}
            className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 focus:opacity-100 text-gray-400 hover:text-red-500 transition-opacity text-xs leading-none w-5 h-5 flex items-center justify-center rounded-full hover:bg-red-50"
            aria-label="Delete entry"
          >
            ✕
          </button>
          <div className="flex items-center justify-between pr-5">
            <span className="font-medium text-gray-800 text-sm truncate mr-2">{entry.description}</span>
            <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">${Number(entry.amount).toFixed(2)}</span>
          </div>
          <div className="mt-1.5">
            <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${getCategoryColor(entry.category)}`}>
              {entry.category}
            </span>
          </div>
          {entry.comment && (
            <>
              <hr className="my-2 border-gray-100" />
              <p className="text-xs text-gray-500 italic">{entry.comment}</p>
            </>
          )}
        </li>
      ))}
    </ul>
  )
}

function AddEntryForm({ categories, onAdd, label }) {
  const [desc, setDesc] = useState('')
  const [cat, setCat] = useState(categories[0])
  const [amount, setAmount] = useState('')
  const [comment, setComment] = useState('')

  function handleSubmit(e) {
    e.preventDefault()
    const num = Number(amount)
    if (!desc.trim() || !amount || num <= 0) return
    onAdd({ id: crypto.randomUUID(), description: desc.trim(), category: cat, amount: num, comment: comment.trim() })
    setDesc('')
    setAmount('')
    setComment('')
    setCat(categories[0])
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white rounded-xl p-4 shadow-sm border border-gray-100 space-y-3">
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-0"
          placeholder="Description"
          value={desc}
          onChange={(e) => setDesc(e.target.value)}
          required
        />
        <input
          className="w-24 border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="Amount"
          type="number"
          min="0.01"
          step="0.01"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          required
        />
      </div>
      <select
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
        value={cat}
        onChange={(e) => setCat(e.target.value)}
      >
        {categories.map((c) => (
          <option key={c} value={c}>{c}</option>
        ))}
      </select>
      <input
        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-300"
        placeholder="Comment (optional)"
        value={comment}
        onChange={(e) => setComment(e.target.value)}
      />
      <button
        type="submit"
        className="w-full bg-blue-600 hover:bg-blue-700 active:bg-blue-800 text-white text-sm font-medium py-2 rounded-lg transition-colors"
      >
        {label}
      </button>
    </form>
  )
}

function MetricCard({ label, value, colorClass }) {
  return (
    <div className={`rounded-xl p-3 flex flex-col items-center ${colorClass}`}>
      <span className="text-xs font-medium opacity-70 text-center leading-tight">{label}</span>
      <span className="text-base font-bold mt-1">${value}</span>
    </div>
  )
}

function FoodBar({ spent }) {
  const pct = Math.min((spent / FOOD_BUDGET) * 100, 100)
  const over = spent > FOOD_BUDGET
  return (
    <div className="w-full bg-gray-200 rounded-full h-2.5 overflow-hidden">
      <div
        className={`h-2.5 rounded-full transition-all duration-300 ${over ? 'bg-red-500' : 'bg-blue-500'}`}
        style={{ width: `${pct}%` }}
      />
    </div>
  )
}

function DayView({ day, dayIndex, onAddFood, onDeleteFood, onAddTransport, onDeleteTransport }) {
  const foodSpent = day.food.reduce((s, e) => s + e.amount, 0)
  const foodRemaining = FOOD_BUDGET - foodSpent
  const transportTotal = day.transport.reduce((s, e) => s + e.amount, 0)

  const remainingLabel = foodRemaining < 0
    ? `$${Math.abs(foodRemaining).toFixed(2)} over`
    : `$${foodRemaining.toFixed(2)}`

  return (
    <div className="space-y-4">
      {/* Metric Cards */}
      <div className="grid grid-cols-3 gap-2">
        <MetricCard label="Food Spent" value={foodSpent.toFixed(2)} colorClass="bg-blue-50 text-blue-800" />
        <MetricCard
          label="Food Left"
          value={remainingLabel}
          colorClass={foodRemaining < 0 ? 'bg-red-50 text-red-700' : 'bg-green-50 text-green-800'}
        />
        <MetricCard label="Transport" value={transportTotal.toFixed(2)} colorClass="bg-purple-50 text-purple-800" />
      </div>

      {/* Food Progress Bar */}
      <div className="space-y-1">
        <div className="flex justify-between text-xs text-gray-500">
          <span>Food budget</span>
          <span>${foodSpent.toFixed(2)} / $100.00</span>
        </div>
        <FoodBar spent={foodSpent} />
      </div>

      {/* Food Section */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Food</h3>
        {day.food.length === 0 && (
          <p className="text-sm text-gray-400 italic mb-2">No food entries yet.</p>
        )}
        <EntryList entries={day.food} onDelete={(id) => onDeleteFood(dayIndex, id)} />
        <div className="mt-3">
          <AddEntryForm categories={FOOD_CATEGORIES} onAdd={(e) => onAddFood(dayIndex, e)} label="Add food" />
        </div>
      </section>

      {/* Transport Section */}
      <section>
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-2">Transport</h3>
        {day.transport.length === 0 && (
          <p className="text-sm text-gray-400 italic mb-2">No transport entries yet.</p>
        )}
        <EntryList entries={day.transport} onDelete={(id) => onDeleteTransport(dayIndex, id)} />
        <div className="mt-3">
          <AddEntryForm
            categories={TRANSPORT_CATEGORIES}
            onAdd={(e) => onAddTransport(dayIndex, e)}
            label="Add transport"
          />
        </div>
      </section>
    </div>
  )
}

function SummaryView({ days }) {
  const perDay = days.map((day) => ({
    foodSpent: day.food.reduce((s, e) => s + e.amount, 0),
    transportTotal: day.transport.reduce((s, e) => s + e.amount, 0),
  }))

  const totalFood = perDay.reduce((s, d) => s + d.foodSpent, 0)
  const totalBudget = NUM_DAYS * FOOD_BUDGET
  const totalBudgetRemaining = totalBudget - totalFood
  const totalTransport = perDay.reduce((s, d) => s + d.transportTotal, 0)
  const grandTotal = totalFood + totalTransport

  const transportByCategory = {}
  days.forEach((day) => {
    day.transport.forEach((entry) => {
      transportByCategory[entry.category] = (transportByCategory[entry.category] || 0) + entry.amount
    })
  })

  return (
    <div className="space-y-4">
      {/* Food Summary */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Food Summary</h3>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-600">Total spent</span>
          <span className="font-semibold text-gray-900">${totalFood.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-1.5">
          <span className="text-gray-600">Total budget ({NUM_DAYS} × $100)</span>
          <span className="font-semibold text-gray-900">${totalBudget.toFixed(2)}</span>
        </div>
        <div className={`flex justify-between text-sm font-semibold border-t border-gray-100 pt-2 mt-2 ${totalBudgetRemaining < 0 ? 'text-red-600' : 'text-green-700'}`}>
          <span>Budget remaining</span>
          <span>${totalBudgetRemaining.toFixed(2)}</span>
        </div>
      </div>

      {/* Transport Breakdown */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Transport Breakdown</h3>
        {Object.keys(transportByCategory).length === 0 ? (
          <p className="text-sm text-gray-400 italic">No transport entries yet.</p>
        ) : (
          <ul className="space-y-2">
            {Object.entries(transportByCategory).map(([cat, total]) => (
              <li key={cat} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className={`w-2.5 h-2.5 rounded-full flex-shrink-0 ${TRANSPORT_DOT_COLORS[cat] || 'bg-gray-400'}`} />
                  <span className="text-gray-700">{cat}</span>
                </div>
                <span className="font-semibold text-gray-900">${total.toFixed(2)}</span>
              </li>
            ))}
            <li className="flex justify-between text-sm font-semibold border-t border-gray-100 pt-2 mt-1 text-gray-800">
              <span>Total</span>
              <span>${totalTransport.toFixed(2)}</span>
            </li>
          </ul>
        )}
      </div>

      {/* Per-Day Table */}
      <div className="bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <h3 className="text-xs font-semibold text-gray-500 uppercase tracking-widest mb-3">Per-Day Breakdown</h3>
        <table className="w-full text-sm">
          <thead>
            <tr className="text-gray-400 border-b border-gray-100 text-xs">
              <th className="text-left pb-2 font-medium">Day</th>
              <th className="text-right pb-2 font-medium">Food</th>
              <th className="text-right pb-2 font-medium">Remaining</th>
              <th className="text-right pb-2 font-medium">Transport</th>
            </tr>
          </thead>
          <tbody>
            {perDay.map((d, i) => {
              const remaining = FOOD_BUDGET - d.foodSpent
              return (
                <tr key={i} className="border-b border-gray-50 last:border-0">
                  <td className="py-2 text-gray-700 font-medium">Day {i + 1}</td>
                  <td className="py-2 text-right text-gray-900">${d.foodSpent.toFixed(2)}</td>
                  <td className={`py-2 text-right font-medium ${remaining < 0 ? 'text-red-500' : 'text-green-600'}`}>
                    ${remaining.toFixed(2)}
                  </td>
                  <td className="py-2 text-right text-gray-900">${d.transportTotal.toFixed(2)}</td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {/* Grand Total */}
      <div className="bg-gray-900 text-white rounded-xl p-4 shadow-sm">
        <div className="flex justify-between text-sm mb-1.5 text-gray-300">
          <span>Total food</span>
          <span>${totalFood.toFixed(2)}</span>
        </div>
        <div className="flex justify-between text-sm mb-3 text-gray-300">
          <span>Total transport</span>
          <span>${totalTransport.toFixed(2)}</span>
        </div>
        <div className="flex justify-between font-bold text-base border-t border-white/20 pt-3">
          <span>Grand Total</span>
          <span>${grandTotal.toFixed(2)}</span>
        </div>
      </div>
    </div>
  )
}

export default function App() {
  const [state, setState] = useState(initState)
  const [activeTab, setActiveTab] = useState(0) // 0-3 = days, 4 = summary

  function addFood(dayIndex, entry) {
    setState((prev) => ({
      days: prev.days.map((d, i) => i === dayIndex ? { ...d, food: [...d.food, entry] } : d),
    }))
  }

  function deleteFood(dayIndex, id) {
    setState((prev) => ({
      days: prev.days.map((d, i) => i === dayIndex ? { ...d, food: d.food.filter((e) => e.id !== id) } : d),
    }))
  }

  function addTransport(dayIndex, entry) {
    setState((prev) => ({
      days: prev.days.map((d, i) => i === dayIndex ? { ...d, transport: [...d.transport, entry] } : d),
    }))
  }

  function deleteTransport(dayIndex, id) {
    setState((prev) => ({
      days: prev.days.map((d, i) => i === dayIndex ? { ...d, transport: d.transport.filter((e) => e.id !== id) } : d),
    }))
  }

  const tabs = ['Day 1', 'Day 2', 'Day 3', 'Day 4', 'Summary']

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col items-center py-6 px-3">
      <div className="w-full max-w-[420px] flex flex-col gap-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 tracking-tight">Business Trip Tracker</h1>
          <p className="text-sm text-gray-500 mt-0.5">4-day trip · $100/day food budget</p>
        </div>

        {/* Tab Bar */}
        <div className="flex bg-white rounded-xl shadow-sm border border-gray-100 p-1 gap-0.5">
          {tabs.map((tab, i) => (
            <button
              key={tab}
              onClick={() => setActiveTab(i)}
              className={`flex-1 text-xs font-medium py-2 rounded-lg transition-colors ${
                activeTab === i
                  ? 'bg-blue-600 text-white shadow-sm'
                  : 'text-gray-500 hover:text-gray-800 hover:bg-gray-50'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Content */}
        {activeTab < 4 ? (
          <DayView
            day={state.days[activeTab]}
            dayIndex={activeTab}
            onAddFood={addFood}
            onDeleteFood={deleteFood}
            onAddTransport={addTransport}
            onDeleteTransport={deleteTransport}
          />
        ) : (
          <SummaryView days={state.days} />
        )}
      </div>
    </div>
  )
}
