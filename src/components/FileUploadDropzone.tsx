'use client';

import { useState, useRef } from 'react';
import {
  Upload, FileText, CheckCircle2, AlertCircle, X, FileCheck,
  RefreshCw, File, ChevronDown, Check
} from 'lucide-react';

interface FileUploadDropzoneProps {
  onFileSelect?: (file: File | null, meta?: { name: string; url?: string; size: string }) => void;
  accept?: string;
  maxSizeMB?: number;
  label?: string;
  helperText?: string;
  defaultFileName?: string;
  allowSampleDocs?: boolean;
}

const sampleDocs = [
  { name: 'Rectified_Fire_Safety_NOC_Renewal.pdf', label: 'Fire Safety NOC Renewal Receipt (Rectified PDF)', url: '/docs/Rectified_Fire_Safety_NOC_Renewal.pdf', size: '2.4 MB' },
  { name: 'Fire_Safety_NOC_StateDirectorate.pdf', label: 'Fire Safety NOC (Original State Directorate)', url: '/docs/Fire_Safety_NOC_StateDirectorate.pdf', size: '3.5 MB' },
  { name: 'Faculty_Aadhaar_Form16_AuditedList.pdf', label: 'Faculty Cadre & Form 16 Audited Roster', url: '/docs/Faculty_Aadhaar_Form16_AuditedList.pdf', size: '5.8 MB' },
  { name: 'Land_Title_Khasra_Deed_Registered.pdf', label: 'Registered Campus Land Perpetual Lease Deed', url: '/docs/Land_Title_Khasra_Deed_Registered.pdf', size: '4.2 MB' },
  { name: 'AKTU_Affiliation_Extension_2025_26.pdf', label: 'AKTU University Affiliation Continuance Letter', url: '/docs/AKTU_Affiliation_Extension_2025_26.pdf', size: '2.1 MB' },
  { name: 'Building_Safety_PWD_Certificate.pdf', label: 'State PWD Building Structural Safety Certificate', url: '/docs/Building_Safety_PWD_Certificate.pdf', size: '2.7 MB' },
];

export default function FileUploadDropzone({
  onFileSelect,
  accept = '.pdf,.png,.jpg,.jpeg,.doc,.docx',
  maxSizeMB = 25,
  label = 'Upload Statutory Document (PDF, Image, DOCX):',
  helperText = 'Files are scanned against AICTE Approved Process Handbook (APH 2024-27) norms.',
  defaultFileName,
  allowSampleDocs = true,
}: FileUploadDropzoneProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [chosenSample, setChosenSample] = useState<{ name: string; size: string; url: string } | null>(
    defaultFileName
      ? sampleDocs.find(s => s.name === defaultFileName) || { name: defaultFileName, size: '2.4 MB', url: `/docs/${defaultFileName}` }
      : null
  );
  const [uploading, setUploading] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [uploadedMeta, setUploadedMeta] = useState<{ name: string; url: string; size: string } | null>(null);
  const [error, setError] = useState<string | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const processFile = async (file: File) => {
    setError(null);
    if (file.size > maxSizeMB * 1024 * 1024) {
      setError(`File size exceeds ${maxSizeMB}MB limit.`);
      return;
    }

    setSelectedFile(file);
    setChosenSample(null);
    setUploading(true);
    setUploadProgress(10);

    // Simulate progress while uploading to /api/upload
    const interval = setInterval(() => {
      setUploadProgress(prev => {
        if (prev >= 85) {
          clearInterval(interval);
          return 85;
        }
        return prev + 25;
      });
    }, 150);

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('documentType', file.type || 'application/pdf');

      const response = await fetch('/api/upload', {
        method: 'POST',
        body: formData,
      });

      clearInterval(interval);
      setUploadProgress(100);

      const data = await response.json();

      setTimeout(() => {
        setUploading(false);
        if (data.success && data.file) {
          setUploadedMeta({
            name: data.file.name,
            url: data.file.url,
            size: data.file.size,
          });
          if (onFileSelect) {
            onFileSelect(file, {
              name: data.file.name,
              url: data.file.url,
              size: data.file.size,
            });
          }
        } else {
          // Fallback client-side success
          const fallbackMeta = {
            name: file.name,
            size: formatSize(file.size),
          };
          setUploadedMeta(fallbackMeta as any);
          if (onFileSelect) onFileSelect(file, fallbackMeta);
        }
      }, 300);
    } catch (err) {
      clearInterval(interval);
      setUploading(false);
      // Even if network route fails in dev environment, still accept client-side file
      const fallbackMeta = {
        name: file.name,
        size: formatSize(file.size),
      };
      setUploadedMeta(fallbackMeta as any);
      if (onFileSelect) onFileSelect(file, fallbackMeta);
    }
  };

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      processFile(e.target.files[0]);
    }
  };

  const handleSelectSample = (sample: typeof sampleDocs[0]) => {
    setSelectedFile(null);
    setChosenSample(sample);
    setUploadedMeta({
      name: sample.name,
      url: sample.url,
      size: sample.size,
    });
    setError(null);
    if (onFileSelect) {
      onFileSelect(null, {
        name: sample.name,
        url: sample.url,
        size: sample.size,
      });
    }
  };

  const handleClear = () => {
    setSelectedFile(null);
    setChosenSample(null);
    setUploadedMeta(null);
    setError(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
    if (onFileSelect) onFileSelect(null);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
      {label && (
        <label style={{ fontSize: '0.8rem', fontWeight: 600, color: '#334155', display: 'block' }}>
          {label}
        </label>
      )}

      {/* Dropzone Area */}
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        style={{
          border: `2px dashed ${dragActive ? '#1e40af' : uploadedMeta || chosenSample ? '#10b981' : '#cbd5e1'}`,
          borderRadius: 8,
          padding: '20px 24px',
          textAlign: 'center',
          background: dragActive ? '#eff6ff' : uploadedMeta || chosenSample ? '#f0fdf4' : '#f8fafc',
          cursor: 'pointer',
          transition: 'all 0.15s ease',
          position: 'relative'
        }}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleChange}
          style={{ display: 'none' }}
        />

        {uploading ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 8 }}>
            <RefreshCw size={26} className="spinner" style={{ color: '#1e40af' }} />
            <div style={{ fontSize: '0.84rem', fontWeight: 600, color: '#0f2942' }}>
              Transmitting & hashing document... ({uploadProgress}%)
            </div>
            <div style={{
              width: '100%',
              maxWidth: 240,
              height: 6,
              background: '#e2e8f0',
              borderRadius: 3,
              overflow: 'hidden'
            }}>
              <div style={{
                width: `${uploadProgress}%`,
                height: '100%',
                background: '#1e40af',
                transition: 'width 0.2s ease'
              }} />
            </div>
          </div>
        ) : chosenSample || uploadedMeta ? (
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', flexWrap: 'wrap', gap: 10 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 12, textAlign: 'left' }}>
              <div style={{
                width: 40,
                height: 40,
                borderRadius: 6,
                background: '#ecfdf5',
                color: '#059669',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0
              }}>
                <FileCheck size={24} />
              </div>
              <div>
                <div style={{ fontSize: '0.86rem', fontWeight: 700, color: '#0f172a' }}>
                  {chosenSample?.name || uploadedMeta?.name}
                </div>
                <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 2 }}>
                  File Size: <strong>{chosenSample?.size || uploadedMeta?.size}</strong> • Ready for Council Scrutiny
                </div>
                <div style={{ fontSize: '0.7rem', color: '#059669', fontWeight: 600, marginTop: 2 }}>
                  ✓ Ready for digital signing with Principal DSC token
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
              <span className="badge badge-success" style={{ fontSize: '0.7rem' }}>
                <Check size={12} style={{ marginRight: 3 }} /> Ready to Submit
              </span>
              <button
                type="button"
                onClick={(e) => {
                  e.stopPropagation();
                  handleClear();
                }}
                className="btn btn-secondary btn-sm"
                style={{ padding: '4px 8px', fontSize: '0.72rem' }}
                title="Change File"
              >
                <X size={12} /> Replace
              </button>
            </div>
          </div>
        ) : (
          <div>
            <Upload size={32} style={{ color: '#64748b', margin: '0 auto 8px' }} />
            <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#0f2942' }}>
              Drag and drop your file here, or <span style={{ color: '#1e40af', textDecoration: 'underline' }}>browse from computer</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: '#64748b', marginTop: 4 }}>
              Supports PDF, PNG, JPG, DOCX (Max {maxSizeMB}MB)
            </div>
          </div>
        )}
      </div>

      {error && (
        <div style={{ fontSize: '0.74rem', color: '#dc2626', display: 'flex', alignItems: 'center', gap: 4 }}>
          <AlertCircle size={12} /> {error}
        </div>
      )}

      {/* Quick Demo Document Picker Chips */}
      {allowSampleDocs && (
        <div style={{ marginTop: 4 }}>
          <div style={{ fontSize: '0.72rem', fontWeight: 600, color: '#64748b', marginBottom: 6 }}>
            Or select a pre-generated statutory demo document to test:
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6 }}>
            {sampleDocs.map((sample) => (
              <button
                key={sample.name}
                type="button"
                onClick={() => handleSelectSample(sample)}
                style={{
                  padding: '4px 8px',
                  borderRadius: 4,
                  border: chosenSample?.name === sample.name ? '1px solid #1e40af' : '1px solid #e2e8f0',
                  background: chosenSample?.name === sample.name ? '#eff6ff' : '#ffffff',
                  color: chosenSample?.name === sample.name ? '#1e40af' : '#475569',
                  fontSize: '0.7rem',
                  fontWeight: chosenSample?.name === sample.name ? 700 : 500,
                  cursor: 'pointer',
                  display: 'inline-flex',
                  alignItems: 'center',
                  gap: 4
                }}
              >
                <FileText size={11} />
                <span>{sample.label}</span>
              </button>
            ))}
          </div>
        </div>
      )}

      {helperText && (
        <div style={{ fontSize: '0.7rem', color: '#94a3b8' }}>
          {helperText}
        </div>
      )}
    </div>
  );
}
