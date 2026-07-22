import { useState } from 'react'
import axios from 'axios'

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000'

export default function useUpload() {
  const [uploading, setUploading] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState([])
  const [error, setError] = useState(null)

  const uploadFile = async (file, companyName, year) => {
    setUploading(true)
    setError(null)

    const formData = new FormData()
    formData.append('file', file)
    formData.append('company_name', companyName)
    formData.append('year', year)

    try {
      const res = await axios.post(
        `${API_URL}/api/ingest/`,
        formData,
        { headers: { 'Content-Type': 'multipart/form-data' } }
      )
      setUploadedFiles(prev => [...prev, {
        company: companyName,
        year,
        chunks: res.data.chunks_created
      }])
      return true
    } catch (err) {
      setError(err.response?.data?.detail || 'Upload failed')
      return false
    } finally {
      setUploading(false)
    }
  }

  return { uploading, uploadedFiles, error, uploadFile }
}