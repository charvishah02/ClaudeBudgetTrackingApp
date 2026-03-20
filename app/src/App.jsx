import { useState, useEffect } from 'react'

// Full Tailwind class strings — must be literals for build-time detection
const PALETTE = {
  pink:   { swatch: 'bg-pink-500',   badge: 'bg-pink-100 text-pink-800',   bar: 'bg-pink-500',   border: 'border-pink-100',   heading: 'text-pink-500',   btn: 'bg-pink-500 hover:bg-pink-600 active:bg-pink-700 text-white' },
  rose:   { swatch: 'bg-rose-500',   badge: 'bg-rose-100 text-rose-800',   bar: 'bg-rose-500',   border: 'border-rose-100',   heading: 'text-rose-500',   btn: 'bg-rose-500 hover:bg-rose-600 active:bg-rose-700 text-white' },
  orange: { swatch: 'bg-orange-500', badge: 'bg-orange-100 text-orange-800', bar: 'bg-orange-500', border: 'border-orange-100', heading: 'text-orange-500', btn: 'bg-orange-500 hover:bg-orange-600 active:bg-orange-700 text-white' },
  amber:  { swatch: 'bg-amber-500',  badge: 'bg-amber-100 text-amber-800',  bar: 'bg-amber-500',  border: 'border-amber-100',  heading: 'text-amber-600',  btn: 'bg-amber-500 hover:bg-amber-600 active:bg-amber-700 text-white' },
  green:  { swatch: 'bg-green-500',  badge: 'bg-green-100 text-green-800',  bar: 'bg-green-500',  border: 'border-green-100',  heading: 'text-green-600',  btn: 'bg-green-500 hover:bg-green-600 active:bg-green-700 text-white' },
  teal:   { swatch: 'bg-teal-500',   badge: 'bg-teal-100 text-teal-800',   bar: 'bg-teal-500',   border: 'border-teal-100',   heading: 'text-teal-600',   btn: 'bg-teal-500 hover:bg-teal-600 active:bg-teal-700 text-white' },
  blue:   { swatch: 'bg-blue-500',   badge: 'bg-blue-100 text-blue-800',   bar: 'bg-blue-500',   border: 'border-blue-100',   heading: 'text-blue-600',   btn: 'bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white' },
  violet: { swatch: 'bg-violet-500', badge: 'bg-violet-100 text-violet-800', bar: 'bg-violet-500', border: 'border-violet-100', heading: 'text-violet-600', btn: 'bg-violet-500 hover:bg-violet-600 active:bg-violet-700 text-white' },
  purple: { swatch: 'bg-purple-500', badge: 'bg-purple-100 text-purple-800', bar: 'bg-purple-500', border: 'border-purple-100', heading: 'text-purple-600', btn: 'bg-purple-500 hover:bg-purple-600 active:bg-purple-700 text-white' },
}
const PALETTE_KEYS = Object.keys(PALETTE)
function palette(color) { return PALETTE[color] || PALETTE.blue }

function uid() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID()
  return Date.now().toString(36) + Math.random().toString(36).slice(2)
}

function initState() {
  const foodId = uid()
  const transportId = uid()
  const days = Array.from({ length: 4 }, (_, i) => ({
    id: uid(), label: `Day ${i + 1}`,
    entries: { [foodId]: [], [transportId]: [] },
  }))
  return {
    version: 2,
    categories: [
      { id: foodId, name: 'Food', color: 'blue', budget: 100, subCategories: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Coffee'] },
      { id: transportId, name: 'Transport', color: 'blue', budget: null, subCategories: ['Uber', 'Lyft', 'Flight', 'Train', 'Taxi', 'Subway', 'Rental car', 'Other'] },
    ],
    days,
  }
}

function loadState() {
  try {
    const raw = localStorage.getItem('budget-tracker')
    if (!raw) return initState()
    const parsed = JSON.parse(raw)
    // Detect new format
    if (parsed.version === 2 && Array.isArray(parsed.categories) && Array.isArray(parsed.days)) return parsed
    // Old format: migrate
    if (Array.isArray(parsed.days) && parsed.days[0]?.food !== undefined) {
      const foodId = uid(); const transportId = uid()
      return {
        version: 2,
        categories: [
          { id: foodId, name: 'Food', color: 'blue', budget: 100, subCategories: ['Breakfast', 'Lunch', 'Dinner', 'Snack', 'Coffee'] },
          { id: transportId, name: 'Transport', color: 'blue', budget: null, subCategories: ['Uber', 'Lyft', 'Flight', 'Train', 'Taxi', 'Subway', 'Rental car', 'Other'] },
        ],
        days: parsed.days.map((d, i) => ({
          id: uid(), label: `Day ${i + 1}`,
          entries: {
            [foodId]: (d.food || []).map(e => ({ id: e.id || uid(), description: e.description, subCategory: e.category, amount: e.amount })),
            [transportId]: (d.transport || []).map(e => ({ id: e.id || uid(), description: e.description, subCategory: e.category, amount: e.amount })),
          },
        })),
      }
    }
  } catch {}
  return initState()
}

// ─── Entry item (with inline editing) ─────────────────────────────────────────
function EntryItem({ entry, subCategories, color, onDelete, onUpdate }) {
  const [editing, setEditing] = useState(false)
  const [desc, setDesc] = useState(entry.description)
  const [amount, setAmount] = useState(String(entry.amount))
  const [sub, setSub] = useState(entry.subCategory)

  function save() {
    const num = Number(amount)
    if (!desc.trim() || !num || num <= 0) return
    onUpdate({ ...entry, description: desc.trim(), amount: num, subCategory: sub })
    setEditing(false)
    if (document.activeElement) document.activeElement.blur()
  }

  function cancel() {
    setDesc(entry.description)
    setAmount(String(entry.amount))
    setSub(entry.subCategory)
    setEditing(false)
  }

  if (editing) {
    return (
      <li className={`bg-white rounded-xl px-4 py-3 shadow-sm border ${color.border} space-y-2`}>
        <div className="flex gap-2">
          <input
            className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-0"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save() } }}
            autoFocus
          />
          <input
            className="w-24 border border-gray-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
            type="number" min="0.01" step="0.01"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            onKeyDown={(e) => { if (e.key === 'Enter') { e.preventDefault(); save() } }}
          />
        </div>
        <select
          className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
          value={sub} onChange={(e) => setSub(e.target.value)}
        >
          {subCategories.map((s) => <option key={s} value={s}>{s}</option>)}
        </select>
        <div className="flex gap-2">
          <button onClick={save} className={`flex-1 ${color.btn} text-sm font-medium py-2 rounded-lg transition-colors`}>Save</button>
          <button onClick={cancel} className="flex-1 bg-gray-100 text-gray-700 text-sm font-medium py-2 rounded-lg hover:bg-gray-200 active:bg-gray-300 transition-colors">Cancel</button>
        </div>
      </li>
    )
  }

  return (
    <li className={`relative bg-white rounded-xl shadow-sm border ${color.border}`}>
      <button onClick={() => setEditing(true)} className="w-full text-left px-4 py-3 pr-12">
        <div className="flex items-center justify-between">
          <span className="font-medium text-gray-800 text-sm truncate mr-2">{entry.description}</span>
          <span className="font-semibold text-gray-900 text-sm whitespace-nowrap">${Number(entry.amount).toFixed(2)}</span>
        </div>
        <div className="mt-1.5">
          <span className={`inline-block text-xs font-medium px-2 py-0.5 rounded-full ${color.badge}`}>{entry.subCategory}</span>
        </div>
      </button>
      <button
        onClick={() => onDelete(entry.id)}
        className="absolute top-1/2 -translate-y-1/2 right-2 text-gray-300 hover:text-red-500 active:text-red-600 w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 active:bg-red-100 transition-colors"
        aria-label="Delete entry"
      >✕</button>
    </li>
  )
}

// ─── Entry list ───────────────────────────────────────────────────────────────
function EntryList({ entries, subCategories, color, onDelete, onUpdate }) {
  if (!entries.length) return <p className="text-sm text-gray-400 italic">No entries yet.</p>
  return (
    <ul className="space-y-2">
      {entries.map((entry) => (
        <EntryItem key={entry.id} entry={entry} subCategories={subCategories} color={color} onDelete={onDelete} onUpdate={onUpdate} />
      ))}
    </ul>
  )
}

// ─── Add entry form ────────────────────────────────────────────────────────────
function AddEntryForm({ subCategories, color, label, onAdd }) {
  const [desc, setDesc] = useState('')
  const [sub, setSub] = useState(subCategories[0] || '')
  const [amount, setAmount] = useState('')

  useEffect(() => {
    if (subCategories.length && !subCategories.includes(sub)) setSub(subCategories[0])
  }, [subCategories])

  if (!subCategories.length) {
    return <p className="text-sm text-gray-400 italic">Add sub-categories in Settings ⚙️ to log entries.</p>
  }

  function handleSubmit(e) {
    e.preventDefault()
    const num = Number(amount)
    if (!desc.trim() || !num || num <= 0) return
    onAdd({ id: uid(), description: desc.trim(), subCategory: sub, amount: num })
    setDesc(''); setAmount(''); setSub(subCategories[0] || '')
    // Blur active input so iOS keyboard dismisses and viewport resets
    if (document.activeElement) document.activeElement.blur()
  }

  return (
    <form onSubmit={handleSubmit} className={`bg-white rounded-xl p-4 shadow-sm border ${color.border} space-y-3`}>
      <div className="flex gap-2">
        <input
          className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 min-w-0"
          placeholder="Description" value={desc} onChange={(e) => setDesc(e.target.value)} required
        />
        <input
          className="w-24 border border-gray-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
          placeholder="$0.00" type="number" min="0.01" step="0.01" value={amount}
          onChange={(e) => setAmount(e.target.value)} required
        />
      </div>
      <select
        className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-300 bg-white"
        value={sub} onChange={(e) => setSub(e.target.value)}
      >
        {subCategories.map((s) => <option key={s} value={s}>{s}</option>)}
      </select>
      <button type="submit" className={`w-full ${color.btn} text-sm font-medium py-2.5 rounded-lg transition-colors`}>
        {label}
      </button>
    </form>
  )
}

// ─── Budget bar ────────────────────────────────────────────────────────────────
function BudgetBar({ spent, budget, color }) {
  const pct = Math.min((spent / budget) * 100, 100)
  const over = spent > budget
  return (
    <div className="space-y-1">
      <div className="flex justify-between text-xs text-gray-500">
        <span>Budget</span>
        <span className={over ? 'text-red-500 font-medium' : ''}>${spent.toFixed(2)} / ${budget.toFixed(2)}</span>
      </div>
      <div className="w-full bg-gray-100 rounded-full h-2 overflow-hidden">
        <div className={`h-2 rounded-full transition-all duration-300 ${over ? 'bg-red-500' : color.bar}`} style={{ width: `${pct}%` }} />
      </div>
    </div>
  )
}

// ─── Day view ─────────────────────────────────────────────────────────────────
function DayView({ day, categories, onAddEntry, onDeleteEntry, onUpdateEntry }) {
  return (
    <div className="space-y-6">
      {categories.map((cat) => {
        const entries = day.entries[cat.id] || []
        const spent = entries.reduce((s, e) => s + e.amount, 0)
        const color = palette(cat.color)
        const remaining = cat.budget != null ? cat.budget - spent : null
        return (
          <section key={cat.id}>
            <div className="flex items-center justify-between mb-2">
              <h3 className={`text-xs font-semibold uppercase tracking-widest ${color.heading}`}>{cat.name}</h3>
              {remaining != null && (
                <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${remaining < 0 ? 'bg-red-100 text-red-700' : color.badge}`}>
                  {remaining < 0 ? `$${Math.abs(remaining).toFixed(2)} over` : `$${remaining.toFixed(2)} left`}
                </span>
              )}
            </div>
            {cat.budget != null && <div className="mb-3"><BudgetBar spent={spent} budget={cat.budget} color={color} /></div>}
            <EntryList
              entries={entries} subCategories={cat.subCategories} color={color}
              onDelete={(id) => onDeleteEntry(day.id, cat.id, id)}
              onUpdate={(updated) => onUpdateEntry(day.id, cat.id, updated)}
            />
            <div className="mt-3">
              <AddEntryForm
                subCategories={cat.subCategories} color={color}
                label={`Add ${cat.name}`} onAdd={(e) => onAddEntry(day.id, cat.id, e)}
              />
            </div>
          </section>
        )
      })}
      {categories.length === 0 && (
        <p className="text-center text-gray-400 text-sm italic py-12">No categories yet — add some in Settings ⚙️</p>
      )}
    </div>
  )
}

// ─── Summary view ─────────────────────────────────────────────────────────────
function SummaryView({ days, categories }) {
  const catTotals = categories.map((cat) => {
    const spent = days.reduce((s, day) => s + (day.entries[cat.id] || []).reduce((a, e) => a + e.amount, 0), 0)
    const totalBudget = cat.budget != null ? cat.budget * days.length : null
    return { cat, spent, totalBudget }
  })
  const grandTotal = catTotals.reduce((s, { spent }) => s + spent, 0)

  return (
    <div className="space-y-4">
      {catTotals.map(({ cat, spent, totalBudget }) => {
        const color = palette(cat.color)
        const remaining = totalBudget != null ? totalBudget - spent : null
        return (
          <div key={cat.id} className={`bg-white rounded-xl p-4 shadow-sm border ${color.border}`}>
            <h3 className={`text-xs font-semibold uppercase tracking-widest mb-3 ${color.heading}`}>{cat.name}</h3>
            <div className="flex justify-between text-sm mb-1.5">
              <span className="text-gray-600">Total spent</span>
              <span className="font-semibold text-gray-900">${spent.toFixed(2)}</span>
            </div>
            {totalBudget != null && (
              <>
                <div className="flex justify-between text-sm mb-1.5">
                  <span className="text-gray-600">Budget ({days.length} days × ${cat.budget})</span>
                  <span className="font-semibold text-gray-900">${totalBudget.toFixed(2)}</span>
                </div>
                <div className={`flex justify-between text-sm font-semibold border-t pt-2 mt-1 ${color.border} ${remaining < 0 ? 'text-red-600' : 'text-green-700'}`}>
                  <span>{remaining < 0 ? 'Over budget' : 'Remaining'}</span>
                  <span>${Math.abs(remaining).toFixed(2)}</span>
                </div>
              </>
            )}
          </div>
        )
      })}

      {days.length > 0 && categories.length > 0 && (
        <div className="bg-white rounded-xl p-4 shadow-sm border border-blue-100 overflow-x-auto">
          <h3 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Per-Day Breakdown</h3>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-gray-400 border-b border-blue-100 text-xs">
                <th className="text-left pb-2 font-medium">Day</th>
                {categories.map((cat) => <th key={cat.id} className="text-right pb-2 font-medium">{cat.name}</th>)}
              </tr>
            </thead>
            <tbody>
              {days.map((day) => (
                <tr key={day.id} className="border-b border-blue-50 last:border-0">
                  <td className="py-2 text-gray-700 font-medium">{day.label}</td>
                  {categories.map((cat) => {
                    const spent = (day.entries[cat.id] || []).reduce((s, e) => s + e.amount, 0)
                    return <td key={cat.id} className="py-2 text-right text-gray-900">${spent.toFixed(2)}</td>
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="bg-blue-600 text-white rounded-xl p-4 shadow-sm flex justify-between font-bold text-base">
        <span>Grand Total</span>
        <span>${grandTotal.toFixed(2)}</span>
      </div>
    </div>
  )
}

// ─── Settings — single category card ──────────────────────────────────────────
function CategoryCard({ cat, onUpdate, onDelete }) {
  const [open, setOpen] = useState(false)
  const [newSub, setNewSub] = useState('')
  const color = palette(cat.color)

  function addSub(e) {
    e.preventDefault()
    const t = newSub.trim()
    if (!t || cat.subCategories.includes(t)) return
    onUpdate({ ...cat, subCategories: [...cat.subCategories, t] })
    setNewSub('')
  }

  function removeSub(sub) {
    onUpdate({ ...cat, subCategories: cat.subCategories.filter((s) => s !== sub) })
  }

  return (
    <div className={`bg-white rounded-xl shadow-sm border ${color.border} overflow-hidden`}>
      <button onClick={() => setOpen(!open)} className="w-full flex items-center justify-between px-4 py-3.5 min-h-[52px]">
        <div className="flex items-center gap-3">
          <span className={`w-3 h-3 rounded-full flex-shrink-0 ${color.swatch}`} />
          <span className="font-medium text-gray-800 text-sm">{cat.name}</span>
          {cat.budget != null && <span className="text-xs text-gray-400">${cat.budget}/day</span>}
        </div>
        <span className="text-gray-400 text-xs ml-2">{open ? '▲' : '▼'}</span>
      </button>

      {open && (
        <div className="px-4 pb-4 space-y-4 border-t border-gray-100 pt-4">
          {/* Name */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">Name</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
              value={cat.name} onChange={(e) => onUpdate({ ...cat, name: e.target.value })}
            />
          </div>

          {/* Color */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Color</label>
            <div className="flex flex-wrap gap-2">
              {PALETTE_KEYS.map((key) => (
                <button
                  key={key} onClick={() => onUpdate({ ...cat, color: key })}
                  className={`w-9 h-9 rounded-full ${PALETTE[key].swatch} ${cat.color === key ? 'ring-2 ring-offset-2 ring-gray-400' : ''} transition-all`}
                  aria-label={key}
                />
              ))}
            </div>
          </div>

          {/* Daily budget */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-1 block">Daily Budget (leave blank for none)</label>
            <input
              className="w-full border border-gray-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
              type="number" min="0" step="0.01" placeholder="No budget"
              value={cat.budget ?? ''}
              onChange={(e) => onUpdate({ ...cat, budget: e.target.value === '' ? null : Number(e.target.value) })}
            />
          </div>

          {/* Sub-categories */}
          <div>
            <label className="text-xs font-medium text-gray-500 uppercase tracking-wide mb-2 block">Sub-categories</label>
            <div className="flex flex-wrap gap-2 mb-3">
              {cat.subCategories.map((sub) => (
                <span key={sub} className={`inline-flex items-center gap-1 text-xs font-medium px-2.5 py-1 rounded-full ${color.badge}`}>
                  {sub}
                  <button
                    onClick={() => removeSub(sub)}
                    className="opacity-60 hover:opacity-100 active:opacity-100 w-4 h-4 flex items-center justify-center leading-none"
                    aria-label={`Remove ${sub}`}
                  >✕</button>
                </span>
              ))}
              {cat.subCategories.length === 0 && <p className="text-xs text-gray-400 italic">None yet.</p>}
            </div>
            <form onSubmit={addSub} className="flex gap-2">
              <input
                className="flex-1 border border-gray-200 rounded-lg px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
                placeholder="New sub-category" value={newSub} onChange={(e) => setNewSub(e.target.value)}
              />
              <button type="submit" className="bg-gray-100 hover:bg-gray-200 active:bg-gray-300 text-gray-700 text-sm font-medium px-4 py-2.5 rounded-lg transition-colors">
                Add
              </button>
            </form>
          </div>

          {/* Delete category */}
          <button
            onClick={onDelete}
            className="w-full text-red-500 border border-red-200 text-sm font-medium py-2.5 rounded-lg hover:bg-red-50 active:bg-red-100 transition-colors"
          >
            Delete Category
          </button>
        </div>
      )}
    </div>
  )
}

// ─── Settings view ────────────────────────────────────────────────────────────
function SettingsView({ state, onAddCategory, onUpdateCategory, onDeleteCategory, onAddDay, onRemoveDay, onUpdateDayLabel }) {
  const [newCatName, setNewCatName] = useState('')

  function handleAddCategory(e) {
    e.preventDefault()
    const name = newCatName.trim()
    if (!name) return
    onAddCategory(name)
    setNewCatName('')
  }

  return (
    <div className="space-y-8">
      {/* Days */}
      <section>
        <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Days</h2>
        <div className="space-y-2">
          {state.days.map((day) => (
            <div key={day.id} className="bg-white rounded-xl border border-blue-100 px-4 py-3 flex items-center gap-3 shadow-sm min-h-[52px]">
              <input
                className="flex-1 text-base font-medium text-gray-800 focus:outline-none border-b border-transparent focus:border-blue-300 py-0.5 bg-transparent"
                value={day.label} onChange={(e) => onUpdateDayLabel(day.id, e.target.value)}
              />
              {state.days.length > 1 && (
                <button
                  onClick={() => onRemoveDay(day.id)}
                  className="text-gray-300 hover:text-red-500 active:text-red-600 w-9 h-9 flex items-center justify-center rounded-full hover:bg-red-50 active:bg-red-100 transition-colors flex-shrink-0 text-sm"
                  aria-label="Remove day"
                >✕</button>
              )}
            </div>
          ))}
        </div>
        <button
          onClick={onAddDay}
          className="mt-2 w-full border-2 border-dashed border-blue-200 text-blue-400 hover:border-blue-400 hover:text-blue-600 active:bg-blue-50 text-sm font-medium py-3 rounded-xl transition-colors"
        >
          + Add Day
        </button>
      </section>

      {/* Categories */}
      <section>
        <h2 className="text-xs font-semibold text-blue-400 uppercase tracking-widest mb-3">Categories</h2>
        <div className="space-y-2">
          {state.categories.map((cat) => (
            <CategoryCard
              key={cat.id} cat={cat}
              onUpdate={onUpdateCategory}
              onDelete={() => onDeleteCategory(cat.id)}
            />
          ))}
        </div>
        <form onSubmit={handleAddCategory} className="mt-2 flex gap-2">
          <input
            className="flex-1 border border-blue-200 rounded-xl px-3 py-2.5 text-base focus:outline-none focus:ring-2 focus:ring-blue-300"
            placeholder="New category name" value={newCatName} onChange={(e) => setNewCatName(e.target.value)}
          />
          <button type="submit" className="bg-blue-500 hover:bg-blue-600 active:bg-blue-700 text-white text-sm font-medium px-4 py-2.5 rounded-xl transition-colors">
            Add
          </button>
        </form>
      </section>

      {/* Reset */}
      <section>
        <button
          onClick={() => {
            if (window.confirm('Reset all data? This cannot be undone.')) {
              localStorage.removeItem('budget-tracker')
              window.location.reload()
            }
          }}
          className="w-full text-red-500 border border-red-200 text-sm font-medium py-2.5 rounded-xl hover:bg-red-50 active:bg-red-100 transition-colors"
        >
          Reset All Data
        </button>
      </section>
    </div>
  )
}

// ─── Root app ─────────────────────────────────────────────────────────────────
export default function App() {
  const [state, setState] = useState(loadState)
  const [activeTab, setActiveTab] = useState(0)

  useEffect(() => {
    localStorage.setItem('budget-tracker', JSON.stringify(state))
  }, [state])

  // Clamp activeTab when days change
  const numDays = state.days.length
  const summaryTab = numDays
  const settingsTab = numDays + 1
  useEffect(() => {
    if (activeTab > settingsTab) setActiveTab(Math.min(activeTab, summaryTab))
  }, [numDays])

  // ── Entry mutations
  function addEntry(dayId, catId, entry) {
    setState((prev) => ({
      ...prev,
      days: prev.days.map((d) => d.id !== dayId ? d : {
        ...d, entries: { ...d.entries, [catId]: [...(d.entries[catId] || []), entry] },
      }),
    }))
  }

  function deleteEntry(dayId, catId, entryId) {
    setState((prev) => ({
      ...prev,
      days: prev.days.map((d) => d.id !== dayId ? d : {
        ...d, entries: { ...d.entries, [catId]: (d.entries[catId] || []).filter((e) => e.id !== entryId) },
      }),
    }))
  }

  function updateEntry(dayId, catId, updated) {
    setState((prev) => ({
      ...prev,
      days: prev.days.map((d) => d.id !== dayId ? d : {
        ...d, entries: { ...d.entries, [catId]: (d.entries[catId] || []).map((e) => e.id === updated.id ? updated : e) },
      }),
    }))
  }

  // ── Day mutations
  function addDay() {
    const id = uid()
    setState((prev) => ({
      ...prev,
      days: [...prev.days, {
        id, label: `Day ${prev.days.length + 1}`,
        entries: Object.fromEntries(prev.categories.map((c) => [c.id, []])),
      }],
    }))
  }

  function removeDay(dayId) {
    setState((prev) => ({ ...prev, days: prev.days.filter((d) => d.id !== dayId) }))
    setActiveTab((t) => Math.min(t, Math.max(0, numDays - 2)))
  }

  function updateDayLabel(dayId, label) {
    setState((prev) => ({ ...prev, days: prev.days.map((d) => d.id === dayId ? { ...d, label } : d) }))
  }

  // ── Category mutations
  function addCategory(name) {
    const id = uid()
    const colorKey = PALETTE_KEYS[state.categories.length % PALETTE_KEYS.length]
    setState((prev) => ({
      categories: [...prev.categories, { id, name, color: colorKey, budget: null, subCategories: [] }],
      days: prev.days.map((d) => ({ ...d, entries: { ...d.entries, [id]: [] } })),
      version: prev.version,
    }))
  }

  function updateCategory(updated) {
    setState((prev) => ({ ...prev, categories: prev.categories.map((c) => c.id === updated.id ? updated : c) }))
  }

  function deleteCategory(catId) {
    setState((prev) => ({
      ...prev,
      categories: prev.categories.filter((c) => c.id !== catId),
      days: prev.days.map((d) => {
        const entries = { ...d.entries }
        delete entries[catId]
        return { ...d, entries }
      }),
    }))
  }

  return (
    <div className="min-h-screen bg-blue-50 flex flex-col items-center py-6 px-3">
      <div className="w-full max-w-[420px] flex flex-col gap-4">
        {/* Header */}
        <div className="text-center">
          <h1 className="text-2xl font-bold text-blue-700 tracking-tight">Trip Expense Tracker</h1>
        </div>

        {/* Tab bar — scrollable so many days don't overflow */}
        <div className="flex bg-white rounded-xl shadow-sm border border-blue-100 p-1 gap-0.5 overflow-x-auto">
          {state.days.map((day, i) => (
            <button
              key={day.id}
              onClick={() => setActiveTab(i)}
              className={`flex-shrink-0 text-xs font-medium py-2.5 px-3 rounded-lg transition-colors ${
                activeTab === i ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
              }`}
            >
              {day.label}
            </button>
          ))}
          <button
            onClick={() => setActiveTab(summaryTab)}
            className={`flex-shrink-0 text-xs font-medium py-2.5 px-3 rounded-lg transition-colors ${
              activeTab === summaryTab ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            Summary
          </button>
          <button
            onClick={() => setActiveTab(settingsTab)}
            className={`flex-shrink-0 text-xs font-medium py-2.5 px-3 rounded-lg transition-colors ${
              activeTab === settingsTab ? 'bg-blue-500 text-white shadow-sm' : 'text-gray-500 hover:text-blue-600 hover:bg-blue-50'
            }`}
          >
            ⚙️
          </button>
        </div>

        {/* Content */}
        {activeTab < numDays ? (
          <DayView
            day={state.days[activeTab]} categories={state.categories}
            onAddEntry={addEntry} onDeleteEntry={deleteEntry} onUpdateEntry={updateEntry}
          />
        ) : activeTab === summaryTab ? (
          <SummaryView days={state.days} categories={state.categories} />
        ) : (
          <SettingsView
            state={state}
            onAddCategory={addCategory} onUpdateCategory={updateCategory} onDeleteCategory={deleteCategory}
            onAddDay={addDay} onRemoveDay={removeDay} onUpdateDayLabel={updateDayLabel}
          />
        )}
      </div>
    </div>
  )
}
