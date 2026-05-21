import { useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import useUpload from '../hooks/useUpload'

export default function UploadPanel() {
  const [company, setCompany] = useState('')
  const [year, setYear] = useState('')
  const [file, setFile] = useState(null)
  const [dragOver, setDragOver] = useState(false)
  const fileRef = useRef()
  const { uploading, uploadedFiles, error, uploadFile } = useUpload()

  const handleDrop = (e) => {
    e.preventDefault()
    setDragOver(false)
    const dropped = e.dataTransfer.files[0]
    if (dropped?.type === 'application/pdf') setFile(dropped)
  }

  const handleSubmit = async () => {
    if (!file || !company || !year) return
    const ok = await uploadFile(file, company, year)
    if (ok) { setFile(null); setCompany(''); setYear('') }
  }

  return (
    <div className="p-4 border-b border-border">
      <h3 className="text-white font-semibold text-sm mb-3">Upload Filing</h3>

      {/* Drop Zone */}
      <motion.div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileRef.current.click()}
        animate={{ borderColor: dragOver ? '#0ea5e9' : '#334155' }}
        className="border-2 border-dashed rounded-lg p-4 text-center cursor-pointer mb-3 transition-colors"
      >
        <input ref={fileRef} type="file" accept=".pdf" className="hidden"
          onChange={e => setFile(e.target.files[0])} />
        {file
          ? <p className="text-primary text-xs font-medium">{file.name}</p>
          : <p className="text-slate-500 text-xs">Drop PDF or click to upload</p>
        }
      </motion.div>

      {/* Inputs */}
      <input
        type="text"
        placeholder="Company name (e.g. Apple)"
        value={company}
        onChange={e => setCompany(e.target.value)}
        className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 mb-2 focus:outline-none focus:border-primary"
      />
      <input
        type="text"
        placeholder="Year (e.g. 2023)"
        value={year}
        onChange={e => setYear(e.target.value)}
        className="w-full bg-dark border border-border rounded-lg px-3 py-2 text-sm text-white placeholder-slate-500 mb-3 focus:outline-none focus:border-primary"
      />

      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleSubmit}
        disabled={uploading || !file || !company || !year}
        className="w-full bg-primary text-white py-2 rounded-lg text-sm font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-sky-400 transition-colors"
      >
        {uploading ? 'Processing...' : 'Ingest Filing'}
      </motion.button>

      {error && <p className="text-red-400 text-xs mt-2">{error}</p>}

      {/* Uploaded files */}
      <AnimatePresence>
        {uploadedFiles.map((f, i) => (
          <motion.div
            key={i}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 bg-dark border border-border rounded-lg px-3 py-2"
          >
            <p className="text-white text-xs font-medium">{f.company} {f.year}</p>
            <p className="text-slate-500 text-xs">{f.chunks} chunks indexed</p>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  )
}