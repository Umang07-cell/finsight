import { motion } from 'framer-motion'
import { useRef } from 'react'
import { BarChart, Bar, LineChart, Line, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts'
import jsPDF from 'jspdf'
import html2canvas from 'html2canvas'

function FormattedText({ content }) {
  const lines = content.split('\n')
  const elements = []
  let i = 0

  while (i < lines.length) {
    const line = lines[i]

    if (line.startsWith('|') && lines[i + 1]?.includes('---')) {
      const headers = line.split('|').filter(c => c.trim()).map(c => c.trim())
      i += 2
      const rows = []
      while (i < lines.length && lines[i].startsWith('|')) {
        rows.push(lines[i].split('|').filter(c => c.trim()).map(c => c.trim()))
        i++
      }
      elements.push(
        <div key={`table-${i}`} className="overflow-x-auto my-3 rounded-xl border border-gray-200">
          <table className="w-full text-xs">
            <thead className="bg-gray-50">
              <tr>{headers.map((h, j) => <th key={j} className="px-3 py-2 text-left font-semibold text-gray-700 border-b border-gray-200">{h}</th>)}</tr>
            </thead>
            <tbody>
              {rows.map((row, j) => (
                <tr key={j} className={j % 2 === 0 ? 'bg-white' : 'bg-gray-50'}>
                  {row.map((cell, k) => <td key={k} className="px-3 py-2 text-gray-600 border-b border-gray-100">{cell}</td>)}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )
      continue
    }

    const formatted = line
      .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
      .replace(/\*(.*?)\*/g, '<em>$1</em>')

    if (line.startsWith('# ')) {
      elements.push(<h3 key={i} className="font-bold text-base mt-3 mb-1 text-gray-900" dangerouslySetInnerHTML={{ __html: line.replace('# ', '') }} />)
    } else if (line.startsWith('## ')) {
      elements.push(<h4 key={i} className="font-semibold text-sm mt-3 mb-1 text-gray-900 border-b border-gray-100 pb-1" dangerouslySetInnerHTML={{ __html: line.replace('## ', '') }} />)
    } else if (line.startsWith('### ')) {
      elements.push(<h5 key={i} className="font-semibold text-sm mt-2 text-gray-700" dangerouslySetInnerHTML={{ __html: line.replace('### ', '') }} />)
    } else if (line.startsWith('- ') || line.startsWith('* ')) {
      elements.push(
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-blue-400 mt-1 flex-shrink-0 text-xs">▸</span>
          <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: formatted.replace(/^[-*] /, '') }} />
        </div>
      )
    } else if (/^\d+\./.test(line)) {
      elements.push(
        <div key={i} className="flex gap-2 ml-2">
          <span className="text-blue-500 font-semibold text-xs min-w-[20px] flex-shrink-0 mt-0.5">{line.match(/^\d+/)[0]}.</span>
          <span className="text-sm text-gray-700" dangerouslySetInnerHTML={{ __html: formatted.replace(/^\d+\. /, '') }} />
        </div>
      )
    } else if (line.trim() === '') {
      elements.push(<div key={i} className="h-1" />)
    } else {
      elements.push(<p key={i} className="text-sm leading-relaxed text-gray-700" dangerouslySetInnerHTML={{ __html: formatted }} />)
    }
    i++
  }

  return <div className="space-y-1.5">{elements}</div>
}

const CHART_COLORS = ['#3b82f6', '#10b981', '#f59e0b', '#ef4444', '#8b5cf6', '#06b6d4']

function ChartBlock({ chartData }) {
  if (!chartData?.labels || !chartData?.values) return null

  const data = chartData.labels.map((label, i) => ({
    name: label,
    value: chartData.values[i]
  }))

  return (
    <div className="bg-white border border-gray-200 rounded-2xl p-4 mt-3">
      <h5 className="text-sm font-semibold text-gray-700 mb-3">{chartData.title}</h5>
      <ResponsiveContainer width="100%" height={220}>
        {chartData.type === 'pie' ? (
          <PieChart>
            <Pie data={data} dataKey="value" nameKey="name" cx="50%" cy="50%" outerRadius={80}
              label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}>
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Pie>
            <Tooltip formatter={(v) => `${v} ${chartData.unit || ''}`} />
          </PieChart>
        ) : chartData.type === 'line' ? (
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v} ${chartData.unit || ''}`} />
            <Line type="monotone" dataKey="value" stroke="#3b82f6" strokeWidth={2} dot={{ fill: '#3b82f6', r: 4 }} />
          </LineChart>
        ) : (
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11 }} />
            <YAxis tick={{ fontSize: 11 }} />
            <Tooltip formatter={(v) => `${v} ${chartData.unit || ''}`} />
            <Bar dataKey="value" radius={[6, 6, 0, 0]}>
              {data.map((_, i) => <Cell key={i} fill={CHART_COLORS[i % CHART_COLORS.length]} />)}
            </Bar>
          </BarChart>
        )}
      </ResponsiveContainer>
      {chartData.unit && <p className="text-xs text-gray-400 mt-1 text-center">Unit: {chartData.unit}</p>}
    </div>
  )
}

function ReportCard({ report }) {
  const reportRef = useRef()

const downloadPDF = async () => {
  const element = reportRef.current
  const canvas = await html2canvas(element, {
    scale: 2,
    backgroundColor: '#ffffff',
    useCORS: true,
    logging: false
  })
  const imgData = canvas.toDataURL('image/png')
  const pdf = new jsPDF('p', 'mm', 'a4')
  const pdfWidth = pdf.internal.pageSize.getWidth()
  const pdfHeight = pdf.internal.pageSize.getHeight()
  const imgWidth = pdfWidth
  const imgHeight = (canvas.height * pdfWidth) / canvas.width
  let heightLeft = imgHeight
  let position = 0

  pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
  heightLeft -= pdfHeight

  while (heightLeft > 0) {
    position = heightLeft - imgHeight
    pdf.addPage()
    pdf.addImage(imgData, 'PNG', 0, position, imgWidth, imgHeight)
    heightLeft -= pdfHeight
  }

  pdf.save('FinSight-Report.pdf')
}

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-3 mt-2 max-w-2xl"
    >
      {/* Download button */}
      <motion.button
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={downloadPDF}
        className="flex items-center gap-2 bg-gray-900 text-white px-4 py-2 rounded-xl text-xs font-medium hover:bg-gray-700 transition-colors"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
        </svg>
        Download Report as PDF
      </motion.button>

      {/* Report content */}
      <div ref={reportRef} className="space-y-3 bg-white p-2 rounded-2xl">

        {/* Summary */}
        <div className="bg-gradient-to-br from-blue-50 to-white border border-blue-100 rounded-2xl p-5">
          <h4 className="text-blue-600 font-semibold text-sm mb-2 flex items-center gap-2">
            <span>📋</span> Executive Summary
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">{report.summary}</p>
        </div>

        {/* Chart */}
        {report.chart_data && <ChartBlock chartData={report.chart_data} />}

        {/* Key Findings */}
        <div className="bg-gradient-to-br from-amber-50 to-white border border-amber-100 rounded-2xl p-5">
          <h4 className="text-amber-600 font-semibold text-sm mb-3 flex items-center gap-2">
            <span>🔍</span> Key Findings
          </h4>
          <ul className="space-y-2">
            {report.key_findings?.map((f, i) => (
              <li key={i} className="flex gap-2 text-sm text-gray-700">
                <span className="text-amber-400 mt-1 flex-shrink-0 text-xs">▸</span>
                <span>{f}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Positives and Risks */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-green-50 to-white border border-green-100 rounded-2xl p-5">
            <h4 className="text-green-600 font-semibold text-sm mb-3 flex items-center gap-2">
              <span>✅</span> Positives
            </h4>
            <ul className="space-y-2">
              {report.positives?.map((p, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-green-500 font-bold flex-shrink-0">+</span>
                  <span>{p}</span>
                </li>
              ))}
            </ul>
          </div>
          <div className="bg-gradient-to-br from-red-50 to-white border border-red-100 rounded-2xl p-5">
            <h4 className="text-red-500 font-semibold text-sm mb-3 flex items-center gap-2">
              <span>⚠️</span> Risks
            </h4>
            <ul className="space-y-2">
              {report.risks?.map((r, i) => (
                <li key={i} className="flex gap-2 text-sm text-gray-700">
                  <span className="text-red-400 font-bold flex-shrink-0">−</span>
                  <span>{r}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* Recommendation */}
        <div className="bg-gradient-to-br from-violet-50 to-white border border-violet-100 rounded-2xl p-5">
          <h4 className="text-violet-600 font-semibold text-sm mb-2 flex items-center gap-2">
            <span>💡</span> Recommendation
          </h4>
          <p className="text-gray-700 text-sm leading-relaxed">{report.recommendation}</p>
          {report.confidence && (
            <span className={`inline-flex items-center gap-1 mt-3 text-xs px-3 py-1 rounded-full font-medium ${
              report.confidence === 'High' ? 'bg-green-100 text-green-700' :
              report.confidence === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
              'bg-red-100 text-red-700'
            }`}>
              <span className="w-1.5 h-1.5 rounded-full bg-current"></span>
              {report.confidence} Confidence
            </span>
          )}
        </div>

      </div>
    </motion.div>
  )
}

export default function MessageBubble({ message, darkMode = false }) {
  const isUser = message.role === 'user'

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-5`}
    >
      <div className={`max-w-[88%] ${isUser ? 'order-2' : 'order-1'}`}>
        {!isUser && (
          <div className="flex items-center gap-2 mb-1.5">
            <div className="w-6 h-6 rounded-full bg-gray-900 flex items-center justify-center text-xs text-white font-bold">F</div>
            <span className="text-gray-400 text-xs">{message.model}</span>
            {message.mode && (
              <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${
                message.mode === 'fast' ? 'bg-emerald-100 text-emerald-700' :
                message.mode === 'deep' ? 'bg-violet-100 text-violet-700' :
                'bg-blue-100 text-blue-700'
              }`}>
                {message.mode}
              </span>
            )}
          </div>
        )}

        {message.report ? (
          <ReportCard report={message.report} />
        ) : (
          <div className={`rounded-2xl px-4 py-3 ${
           isUser
             ? 'bg-gray-900 text-white rounded-tr-sm text-sm'
             : `${darkMode ? 'bg-slate-800 border-slate-700 text-slate-100' : 'bg-white border-gray-200 text-gray-800'} border rounded-tl-sm shadow-sm`
    }`}>
            {isUser ? message.content : <FormattedText content={message.content} />}
          </div>
        )}

        {message.sources?.length > 0 && (
          <div className="mt-2 space-y-1">
            {message.sources.slice(0, 3).map((s, i) => (
              <div key={i} className="bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-xs text-gray-500">
                📄 {s.company} {s.year} — Page {s.page}
              </div>
            ))}
          </div>
        )}
      </div>
    </motion.div>
  )
}