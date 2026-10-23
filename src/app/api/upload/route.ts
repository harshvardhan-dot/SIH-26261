import { NextRequest, NextResponse } from 'next/server';
import * as fs from 'fs';
import * as path from 'path';
import crypto from 'crypto';

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File | null;
    const documentType = (formData.get('documentType') as string) || 'Statutory Compliance Document';
    const collegeId = (formData.get('collegeId') as string) || '1-102938475';
    const notes = (formData.get('notes') as string) || '';

    if (!file) {
      return NextResponse.json({ error: 'No file uploaded' }, { status: 400 });
    }

    const uploadsDir = path.join(process.cwd(), 'public', 'uploads');
    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Compute cryptographic SHA-256 hash for provenance
    const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

    // Clean safe filename
    const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');
    const uniqueFileName = `${Date.now()}_${sanitizedName}`;
    const filePath = path.join(uploadsDir, uniqueFileName);

    fs.writeFileSync(filePath, buffer);

    const publicUrl = `/uploads/${uniqueFileName}`;
    const fileSizeFormatted = (file.size / (1024 * 1024)).toFixed(2) + ' MB';

    // Automatic classification based on filename and type
    let tier: 1 | 2 | 3 | 4 = 2;
    let category = 'Statutory Document';
    const lowerName = sanitizedName.toLowerCase();

    if (lowerName.includes('dsc') || lowerName.includes('sign') || lowerName.includes('aktu') || lowerName.includes('iit')) {
      tier = 1;
      category = 'University Affiliation / Statutory Token';
    } else if (lowerName.includes('fire') || lowerName.includes('pwd') || lowerName.includes('revenue') || lowerName.includes('digilocker')) {
      tier = 2;
      category = 'Government Department Clearance';
    } else if (lowerName.includes('faculty') || lowerName.includes('salary') || lowerName.includes('balance') || lowerName.includes('ca')) {
      tier = 3;
      category = 'Academic Faculty & Audit';
    } else if (lowerName.includes('plan') || lowerName.includes('khasra') || lowerName.includes('seal')) {
      tier = 4;
      category = 'Infrastructure & Spatial Verification';
    }

    return NextResponse.json({
      success: true,
      message: 'File successfully uploaded and cryptographically indexed.',
      file: {
        name: file.name,
        storedName: uniqueFileName,
        url: publicUrl,
        size: fileSizeFormatted,
        sizeBytes: file.size,
        mimeType: file.type || 'application/pdf',
        sha256Hash: sha256,
        uploadedAt: new Date().toISOString(),
        tier,
        category,
        documentType,
        collegeId,
        notes,
      }
    });
  } catch (error: any) {
    console.error('Error handling file upload:', error);
    return NextResponse.json(
      { error: 'Failed to process file upload', details: error.message },
      { status: 500 }
    );
  }
}
