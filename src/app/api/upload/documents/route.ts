import { NextRequest, NextResponse } from 'next/server';
import { getCollection } from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

// POST - Upload document files
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const userId = formData.get('userId') as string;
    const files = formData.getAll('files') as File[];
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!files || files.length === 0) {
      return NextResponse.json(
        { success: false, message: 'No files provided' },
        { status: 400 }
      );
    }

    // Process uploaded files
    const uploadedDocuments = [];
    
    for (const file of files) {
      // Validate file type
      const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'application/pdf'];
      if (!allowedTypes.includes(file.type)) {
        return NextResponse.json(
          { success: false, message: `Invalid file type: ${file.type}` },
          { status: 400 }
        );
      }

      // Validate file size (10MB limit)
      const maxSize = 10 * 1024 * 1024; // 10MB
      if (file.size > maxSize) {
        return NextResponse.json(
          { success: false, message: `File too large: ${file.name}` },
          { status: 400 }
        );
      }

      // Convert file to buffer for MongoDB storage
      const buffer = Buffer.from(await file.arrayBuffer());
      
      // Store file metadata and content in MongoDB
      const documentData = {
        userId: new ObjectId(userId),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        fileContent: buffer,
        uploadedAt: new Date(),
        status: 'pending_verification'
      };

      // Store in documents collection
      const documentsCollection = await getCollection('documents');
      const result = await documentsCollection.insertOne(documentData);
      
      uploadedDocuments.push({
        documentId: result.insertedId.toString(),
        fileName: file.name,
        fileType: file.type,
        fileSize: file.size,
        uploadedAt: documentData.uploadedAt
      });
    }

    // Update user's withdrawal info with document references
    const usersCollection = await getCollection('users');
    await usersCollection.updateOne(
      { _id: new ObjectId(userId) },
      { 
        $set: { 
          'withdrawalInfo.documentsUploaded': true,
          'withdrawalInfo.uploadedDocuments': uploadedDocuments,
          'withdrawalInfo.lastDocumentUpload': new Date()
        }
      }
    );

    return NextResponse.json({
      success: true,
      message: 'Documents uploaded successfully',
      data: {
        uploadedDocuments,
        totalFiles: uploadedDocuments.length
      }
    });

  } catch (error) {
    console.error('Error uploading documents:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}

// GET - Retrieve user's uploaded documents
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const userId = searchParams.get('userId');
    
    if (!userId) {
      return NextResponse.json(
        { success: false, message: 'User ID is required' },
        { status: 400 }
      );
    }

    const documentsCollection = await getCollection('documents');
    const documents = await documentsCollection.find({ 
      userId: new ObjectId(userId) 
    }).sort({ uploadedAt: -1 }).toArray();

    // Return document metadata without file content
    const documentList = documents.map(doc => ({
      documentId: doc._id.toString(),
      fileName: doc.fileName,
      fileType: doc.fileType,
      fileSize: doc.fileSize,
      uploadedAt: doc.uploadedAt,
      status: doc.status
    }));

    return NextResponse.json({
      success: true,
      data: documentList
    });

  } catch (error) {
    console.error('Error fetching documents:', error);
    return NextResponse.json(
      { success: false, message: 'Internal server error' },
      { status: 500 }
    );
  }
}
