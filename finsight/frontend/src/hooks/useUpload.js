const uploadFile = async (file, companyName, year) => {
  setUploading(true)
  setError(null)

  const formData = new FormData()
  formData.append('file', file)
  formData.append('company_name', companyName)
  formData.append('year', year)

  try {
    const res = await axios.post(
      'https://finsight-production-b9e2.up.railway.app/api/ingest',
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    )

    setUploadedFiles(prev => [
      ...prev,
      {
        company: companyName,
        year,
        chunks: res.data.chunks_created
      }
    ])

    return true

  } catch (err) {
    setError(err.response?.data?.detail || 'Upload failed')
    return false

  } finally {
    setUploading(false)
  }
}