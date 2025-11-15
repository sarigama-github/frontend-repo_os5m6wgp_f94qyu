import { useState } from 'react'

const BACKEND = import.meta.env.VITE_BACKEND_URL || ''

function App() {
  const [form, setForm] = useState({
    nama: '',
    harga: '',
    deskripsi: '',
    kondisi: 'baru',
    kategori: '',
    gambar: null,
  })
  const [submitting, setSubmitting] = useState(false)
  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)

  const onChange = (e) => {
    const { name, value, type, files } = e.target
    if (type === 'file') {
      setForm((s) => ({ ...s, [name]: files[0] }))
    } else {
      setForm((s) => ({ ...s, [name]: value }))
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setSubmitting(true)
    setError(null)
    setResult(null)

    try {
      const fd = new FormData()
      fd.append('nama', form.nama)
      fd.append('harga', form.harga)
      fd.append('deskripsi', form.deskripsi)
      fd.append('kondisi', form.kondisi)
      fd.append('kategori', form.kategori)
      if (form.gambar) fd.append('gambar', form.gambar)

      const res = await fetch(`${BACKEND}/barang`, {
        method: 'POST',
        body: fd,
      })
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Gagal mengirim data')
      setResult(data.data)
    } catch (err) {
      setError(err.message)
    } finally {
      setSubmitting(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-blue-50 p-6">
      <div className="max-w-3xl mx-auto">
        <div className="bg-white/80 backdrop-blur rounded-xl shadow-lg p-6">
          <h1 className="text-2xl font-bold text-gray-800">Master Barang</h1>
          <p className="text-gray-600 mb-6">Form dengan 6 input: text, textarea, radio, select, dan upload gambar.</p>

          {error && (
            <div className="mb-4 p-3 rounded-lg border border-red-200 bg-red-50 text-red-700">{error}</div>
          )}
          {result && (
            <div className="mb-4 p-3 rounded-lg border border-green-200 bg-green-50 text-green-700">
              Berhasil menyimpan barang.
            </div>
          )}

          <form onSubmit={handleSubmit} className="grid gap-4 md:grid-cols-2">
            <div className="space-y-1">
              <label className="font-semibold">Nama Barang</label>
              <input name="nama" value={form.nama} onChange={onChange} placeholder="Laptop Pro 14" className="w-full border rounded-lg px-3 py-2" required />
            </div>
            <div className="space-y-1">
              <label className="font-semibold">Harga</label>
              <input type="number" name="harga" value={form.harga} onChange={onChange} min="0" step="1000" placeholder="15000000" className="w-full border rounded-lg px-3 py-2" required />
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-semibold">Deskripsi</label>
              <textarea name="deskripsi" value={form.deskripsi} onChange={onChange} rows="4" placeholder="Tulis deskripsi..." className="w-full border rounded-lg px-3 py-2" required />
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Kondisi</label>
              <div className="flex gap-4 items-center border rounded-lg px-3 py-2">
                <label className="flex items-center gap-2">
                  <input type="radio" name="kondisi" value="baru" checked={form.kondisi === 'baru'} onChange={onChange} /> Baru
                </label>
                <label className="flex items-center gap-2">
                  <input type="radio" name="kondisi" value="bekas" checked={form.kondisi === 'bekas'} onChange={onChange} /> Bekas
                </label>
              </div>
            </div>

            <div className="space-y-1">
              <label className="font-semibold">Kategori</label>
              <select name="kategori" value={form.kategori} onChange={onChange} className="w-full border rounded-lg px-3 py-2" required>
                <option value="" disabled>Pilih kategori</option>
                <option value="elektronik">Elektronik</option>
                <option value="fashion">Fashion</option>
                <option value="makanan">Makanan</option>
                <option value="lainnya">Lainnya</option>
              </select>
            </div>

            <div className="md:col-span-2 space-y-1">
              <label className="font-semibold">Upload Gambar</label>
              <input type="file" name="gambar" accept="image/*" onChange={onChange} className="w-full border rounded-lg px-3 py-2" required />
            </div>

            <div className="md:col-span-2">
              <button disabled={submitting} className="bg-blue-600 hover:bg-blue-700 text-white font-semibold px-4 py-2 rounded-lg">
                {submitting ? 'Menyimpan...' : 'Simpan'}
              </button>
            </div>
          </form>

          {result && (
            <div className="mt-6 border-t pt-4">
              <h2 className="font-semibold mb-2">Data Terkirim</h2>
              <div className="flex gap-4 items-start">
                {result.gambar_url && (
                  <img src={`${BACKEND}${result.gambar_url}`} alt="preview" className="w-36 h-36 object-cover rounded-lg border" />
                )}
                <ul className="text-sm text-gray-700 space-y-1">
                  <li><strong>Nama:</strong> {result.nama}</li>
                  <li><strong>Harga:</strong> Rp {Number(result.harga).toLocaleString('id-ID')}</li>
                  <li><strong>Kondisi:</strong> {result.kondisi}</li>
                  <li><strong>Kategori:</strong> {result.kategori}</li>
                  <li><strong>Deskripsi:</strong> {result.deskripsi}</li>
                </ul>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default App
