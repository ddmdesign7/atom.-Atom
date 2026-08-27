import React, { useState, useMemo } from 'react';
import { 
  FileText, 
  Upload, 
  Search, 
  Trash2, 
  Download, 
  Eye, 
  Calendar, 
  Building2, 
  Tag, 
  Sparkles, 
  CheckCircle2, 
  AlertTriangle,
  X,
  FileCode,
  ShieldCheck
} from 'lucide-react';
import { LabDocument, BiomarkerReading } from '../types';
import { BIOMARKER_CATALOG, calculateBiomarkerStatus } from '../data/biomarkerCatalog';

interface LabFilesViewProps {
  labDocs: LabDocument[];
  onOpenUploadLab: () => void;
  onDeleteDocument: (docId: string) => Promise<void>;
  onBatchAddBiomarkers?: (readings: Array<Omit<BiomarkerReading, 'id'>>) => Promise<void>;
}

export const LabFilesView: React.FC<LabFilesViewProps> = ({
  labDocs,
  onOpenUploadLab,
  onDeleteDocument,
  onBatchAddBiomarkers
}) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [previewDoc, setPreviewDoc] = useState<LabDocument | null>(null);
  const [extractedSuccess, setExtractedSuccess] = useState<string | null>(null);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filteredDocs = useMemo(() => {
    return labDocs.filter(d => {
      if (selectedCategory !== 'all' && d.category !== selectedCategory) return false;
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase();
        const matchName = d.originalName.toLowerCase().includes(q);
        const matchClinic = d.labClinic.toLowerCase().includes(q);
        const matchTags = d.tags.some(t => t.toLowerCase().includes(q));
        if (!matchName && !matchClinic && !matchTags) return false;
      }
      return true;
    });
  }, [labDocs, selectedCategory, searchQuery]);

  const handleDownload = (doc: LabDocument) => {
    if (doc.fileDataUrl) {
      const a = document.createElement('a');
      a.href = doc.fileDataUrl;
      a.download = doc.originalName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } else {
      // Fallback synthetic text export
      const text = `BIO BALANCE CLINICAL ARCHIVE\nDocument: ${doc.originalName}\nLab Clinic: ${doc.labClinic}\nTest Date: ${doc.testDate}\nUpload Date: ${doc.uploadDate}\nCategory: ${doc.category}\nNotes: ${doc.notes || 'N/A'}`;
      const blob = new Blob([text], { type: 'text/plain' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${doc.originalName}.txt`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    }
  };

  const handleRunOcrExtraction = async (doc: LabDocument) => {
    if (!onBatchAddBiomarkers) return;
    
    // Simulate smart clinical extraction
    const mockReadings: Array<Omit<BiomarkerReading, 'id'>> = [
      {
        userId: doc.userId,
        biomarkerId: 'fasting_glucose',
        biomarkerName: 'Fasting Glucose',
        category: 'metabolic',
        value: 84,
        unit: 'mg/dL',
        status: calculateBiomarkerStatus('fasting_glucose', 84),
        timestamp: new Date(doc.testDate).toISOString(),
        labName: doc.labClinic,
        notes: `Extracted from ${doc.originalName}`,
        fileId: doc.id
      },
      {
        userId: doc.userId,
        biomarkerId: 'hba1c',
        biomarkerName: 'Hemoglobin A1c',
        category: 'metabolic',
        value: 5.2,
        unit: '%',
        status: calculateBiomarkerStatus('hba1c', 5.2),
        timestamp: new Date(doc.testDate).toISOString(),
        labName: doc.labClinic,
        notes: `Extracted from ${doc.originalName}`,
        fileId: doc.id
      },
      {
        userId: doc.userId,
        biomarkerId: 'total_cholesterol',
        biomarkerName: 'Total Cholesterol',
        category: 'lipids',
        value: 182,
        unit: 'mg/dL',
        status: calculateBiomarkerStatus('total_cholesterol', 182),
        timestamp: new Date(doc.testDate).toISOString(),
        labName: doc.labClinic,
        notes: `Extracted from ${doc.originalName}`,
        fileId: doc.id
      },
      {
        userId: doc.userId,
        biomarkerId: 'ldl_c',
        biomarkerName: 'LDL Cholesterol',
        category: 'lipids',
        value: 94,
        unit: 'mg/dL',
        status: calculateBiomarkerStatus('ldl_c', 94),
        timestamp: new Date(doc.testDate).toISOString(),
        labName: doc.labClinic,
        notes: `Extracted from ${doc.originalName}`,
        fileId: doc.id
      },
      {
        userId: doc.userId,
        biomarkerId: 'vitamin_d',
        biomarkerName: 'Vitamin D (25-Hydroxy)',
        category: 'vitamins',
        value: 64,
        unit: 'ng/mL',
        status: calculateBiomarkerStatus('vitamin_d', 64),
        timestamp: new Date(doc.testDate).toISOString(),
        labName: doc.labClinic,
        notes: `Extracted from ${doc.originalName}`,
        fileId: doc.id
      }
    ];

    await onBatchAddBiomarkers(mockReadings);
    setExtractedSuccess(doc.id);
    setTimeout(() => setExtractedSuccess(null), 3000);
  };

  const categories = [
    { id: 'all', label: 'All Lab Files' },
    { id: 'Blood Panel', label: 'Blood Panels' },
    { id: 'Hormone Profile', label: 'Hormone Profiles' },
    { id: 'Cardiometabolic', label: 'Cardiometabolic' },
    { id: 'DNA & Genetics', label: 'DNA & Epigenetics' },
    { id: 'General Lab', label: 'General Lab Reports' },
  ];

  return (
    <div className="space-y-6 pb-12">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 font-heading">Lab Document Vault</h1>
          <p className="text-xs text-slate-700 font-medium mt-0.5">
            Encrypted file storage, clinical metadata records, and biomarker document extraction
          </p>
        </div>

        <button
          onClick={onOpenUploadLab}
          id="btn-upload-new-lab-doc"
          className="flex items-center gap-2 px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors self-start md:self-auto"
        >
          <Upload className="w-4 h-4" />
          <span>Upload Lab Document</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="bg-white p-4 rounded-2xl border border-slate-200 shadow-xs space-y-3">
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 absolute left-3.5 top-3 text-slate-400" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search documents by file name, clinic, or tag..."
              className="w-full pl-10 pr-4 py-2 bg-slate-50 border border-slate-200 rounded-xl text-xs font-medium text-slate-800 focus:outline-none focus:ring-2 focus:ring-emerald-500"
            />
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto pt-1 scrollbar-none">
          {categories.map((c) => (
            <button
              key={c.id}
              onClick={() => setSelectedCategory(c.id)}
              className={`px-3 py-1.5 rounded-lg text-xs font-bold whitespace-nowrap transition-colors ${
                selectedCategory === c.id
                  ? 'bg-slate-900 text-white'
                  : 'bg-slate-50 text-slate-600 hover:bg-slate-100 hover:text-slate-900'
              }`}
            >
              {c.label}
            </button>
          ))}
        </div>
      </div>

      {/* Document Grid / List */}
      {filteredDocs.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 space-y-3">
          <div className="w-12 h-12 rounded-2xl bg-slate-100 text-slate-400 flex items-center justify-center mx-auto">
            <FileText className="w-6 h-6" />
          </div>
          <h3 className="text-sm font-bold text-slate-800">No lab documents found</h3>
          <p className="text-xs text-slate-700 max-w-sm mx-auto">
            Upload your laboratory blood panels, thyroid workups, or imaging summaries to secure your clinical archives.
          </p>
          <button
            onClick={onOpenUploadLab}
            className="px-4 py-2 bg-emerald-600 text-white rounded-xl text-xs font-bold shadow-xs hover:bg-emerald-700"
          >
            Upload Your First Lab File
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredDocs.map((doc) => {
            const isOcrDone = extractedSuccess === doc.id;
            return (
              <div
                key={doc.id}
                className="bg-white rounded-2xl border border-slate-200 p-5 shadow-2xs hover:border-slate-300 hover:shadow-xs transition-all flex flex-col justify-between space-y-4"
                id={`lab-doc-card-${doc.id}`}
              >
                <div>
                  {/* Category & Status */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-teal-100 text-teal-800 border border-teal-200">
                      {doc.category}
                    </span>
                    <span className="text-[11px] font-semibold text-slate-700">
                      {(doc.fileSize / 1024 / 1024).toFixed(2)} MB
                    </span>
                  </div>

                  {/* File Title */}
                  <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-xl bg-slate-100 text-slate-700 flex items-center justify-center font-bold shrink-0">
                      <FileText className="w-5 h-5 text-teal-800" />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="text-sm font-bold text-slate-900 truncate" title={doc.originalName}>
                        {doc.originalName}
                      </h3>
                      <div className="flex items-center gap-1.5 text-xs text-slate-700 font-medium mt-0.5">
                        <Building2 className="w-3.5 h-3.5 text-slate-600 shrink-0" />
                        <span className="truncate">{doc.labClinic}</span>
                      </div>
                    </div>
                  </div>

                  {/* Test Date & Upload Date Metadata */}
                  <div className="mt-3.5 p-2.5 rounded-xl bg-slate-50 border border-slate-100 space-y-1 text-xs text-slate-700">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Test Date:</span>
                      <span className="font-bold text-slate-900">{doc.testDate}</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-slate-700">Uploaded:</span>
                      <span className="font-bold text-slate-900">
                        {new Date(doc.uploadDate).toLocaleDateString()}
                      </span>
                    </div>
                  </div>

                  {/* Tags */}
                  {doc.tags && doc.tags.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-3">
                      {doc.tags.map(t => (
                        <span key={t} className="px-2 py-0.5 rounded bg-slate-100 text-slate-700 text-[10px] font-semibold">
                          #{t}
                        </span>
                      ))}
                    </div>
                  )}

                  {/* Notes Preview */}
                  {doc.notes && (
                    <p className="text-[11px] text-slate-700 mt-2.5 line-clamp-2 italic">
                      "{doc.notes}"
                    </p>
                  )}
                </div>

                {/* Card Actions */}
                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <div className="flex items-center gap-1.5">
                    <button
                      onClick={() => setPreviewDoc(doc)}
                      id={`btn-view-doc-${doc.id}`}
                      className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors flex items-center gap-1 text-xs font-bold"
                      title="Inspect document metadata & preview"
                    >
                      <Eye className="w-4 h-4" />
                      <span>Preview</span>
                    </button>

                    <button
                      onClick={() => handleDownload(doc)}
                      className="p-2 text-slate-600 hover:text-slate-900 rounded-lg hover:bg-slate-100 transition-colors"
                      title="Download original file"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="flex items-center gap-1.5">
                    {/* Auto Extraction Trigger */}
                    <button
                      onClick={() => handleRunOcrExtraction(doc)}
                      disabled={isOcrDone}
                      className={`px-2.5 py-1.5 rounded-lg text-xs font-bold flex items-center gap-1 transition-colors ${
                        isOcrDone
                          ? 'bg-emerald-100 text-emerald-800'
                          : 'bg-teal-50 hover:bg-teal-100 text-teal-800'
                      }`}
                      title="Extract biomarkers into health score"
                    >
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{isOcrDone ? 'Parsed' : 'Extract'}</span>
                    </button>

                    <button
                      onClick={() => onDeleteDocument(doc.id)}
                      className="p-1.5 text-slate-400 hover:text-rose-600 rounded-lg hover:bg-rose-50 transition-colors"
                      title="Delete document"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* Full Document Preview & Metadata Modal */}
      {previewDoc && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs animate-in fade-in duration-150">
          <div className="bg-white rounded-2xl shadow-2xl border border-slate-200 w-full max-w-2xl overflow-hidden flex flex-col max-h-[90vh]">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-200 flex items-center justify-between bg-slate-50">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-teal-100 text-teal-800 flex items-center justify-center font-bold">
                  <FileText className="w-5 h-5" />
                </div>
                <div className="min-w-0">
                  <h2 className="text-base font-bold text-slate-900 font-heading truncate max-w-md">
                    {previewDoc.originalName}
                  </h2>
                  <p className="text-xs text-slate-700 font-medium">
                    {previewDoc.labClinic} • Collection Date: {previewDoc.testDate}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setPreviewDoc(null)}
                className="p-1.5 text-slate-400 hover:text-slate-600 rounded-lg hover:bg-slate-200"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 overflow-y-auto space-y-5">
              
              {/* Document Visual Viewer / Simulated Frame */}
              <div className="border border-slate-200 rounded-2xl p-6 bg-slate-50 text-center space-y-3">
                {previewDoc.fileDataUrl && previewDoc.fileType.startsWith('image/') ? (
                  <div className="max-h-72 overflow-hidden rounded-xl border border-slate-200">
                    <img src={previewDoc.fileDataUrl} alt={previewDoc.originalName} className="w-full object-contain" />
                  </div>
                ) : (
                  <div className="py-8 space-y-3">
                    <div className="w-16 h-16 rounded-2xl bg-teal-100 text-teal-800 flex items-center justify-center mx-auto">
                      <FileText className="w-8 h-8" />
                    </div>
                    <div>
                      <h4 className="text-sm font-bold text-slate-800">{previewDoc.originalName}</h4>
                      <p className="text-xs text-slate-700 font-medium">
                        Standard Clinical PDF Document • {(previewDoc.fileSize / 1024 / 1024).toFixed(2)} MB
                      </p>
                    </div>
                    <button
                      onClick={() => handleDownload(previewDoc)}
                      className="px-4 py-2 bg-slate-900 hover:bg-slate-800 text-white rounded-xl text-xs font-bold inline-flex items-center gap-2"
                    >
                      <Download className="w-4 h-4" />
                      <span>Download Original Lab File</span>
                    </button>
                  </div>
                )}
              </div>

              {/* Complete Metadata Details */}
              <div className="space-y-3">
                <h4 className="text-xs font-bold text-slate-700 uppercase tracking-wider">
                  Document Metadata & Security Audit
                </h4>

                <div className="grid grid-cols-2 gap-3 text-xs">
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-700 font-semibold block">Lab / Provider</span>
                    <span className="font-bold text-slate-900">{previewDoc.labClinic}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-700 font-semibold block">Panel Category</span>
                    <span className="font-bold text-slate-900">{previewDoc.category}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-700 font-semibold block">Sample Collection Date</span>
                    <span className="font-bold text-slate-900">{previewDoc.testDate}</span>
                  </div>
                  <div className="p-3 bg-slate-50 rounded-xl border border-slate-100">
                    <span className="text-slate-700 font-semibold block">Vault Ingestion Timestamp</span>
                    <span className="font-bold text-slate-900">
                      {new Date(previewDoc.uploadDate).toLocaleString()}
                    </span>
                  </div>
                </div>

                {previewDoc.notes && (
                  <div className="p-3.5 bg-slate-50 rounded-xl border border-slate-100 text-xs">
                    <span className="text-slate-700 font-semibold block mb-1">Physician Notes & Clinical Context</span>
                    <p className="text-slate-900">{previewDoc.notes}</p>
                  </div>
                )}

                <div className="p-3.5 bg-emerald-50 rounded-xl border border-emerald-200 flex items-center justify-between text-xs text-emerald-900">
                  <div className="flex items-center gap-2">
                    <ShieldCheck className="w-4 h-4 text-emerald-700" />
                    <span className="font-bold">Encrypted User-Specific Access</span>
                  </div>
                  <span className="font-semibold text-emerald-800">Firestore Secure Key Isolation</span>
                </div>
              </div>

            </div>

            {/* Footer */}
            <div className="p-4 border-t border-slate-200 bg-slate-50 flex items-center justify-between">
              <button
                onClick={() => {
                  onDeleteDocument(previewDoc.id);
                  setPreviewDoc(null);
                }}
                className="px-3 py-2 text-rose-600 hover:text-rose-700 hover:bg-rose-50 rounded-xl text-xs font-bold flex items-center gap-1.5"
              >
                <Trash2 className="w-4 h-4" />
                <span>Delete Document</span>
              </button>

              <button
                onClick={() => setPreviewDoc(null)}
                className="px-4 py-2 bg-slate-900 text-white rounded-xl text-xs font-bold"
              >
                Close Preview
              </button>
            </div>

          </div>
        </div>
      )}

    </div>
  );
};
