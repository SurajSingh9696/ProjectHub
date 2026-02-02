import { NextResponse } from 'next/server';
import dbConnect from '@/lib/db/mongoose';
import User from '@/lib/models/User';
import { getAuthUser } from '@/lib/auth/jwt';
import Busboy from 'busboy';
import { Readable } from 'stream';

export async function POST(request) {
  try {
    const userId = await getAuthUser(request);

    if (!userId) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    await dbConnect();

    const contentType = request.headers.get('content-type');
    
    if (!contentType || !contentType.includes('multipart/form-data')) {
      return NextResponse.json(
        { error: 'Invalid content type' },
        { status: 400 }
      );
    }

    // Handle both file upload and avatarUrl with busboy
    // Handle both file upload and avatarUrl with busboy
    return new Promise((resolve) => {
      const chunks = [];
      let fileSize = 0;
      let fileName = '';
      let mimeType = '';
      let fileReceived = false;
      let avatarUrl = null;

      const busboy = Busboy({ 
        headers: {
          'content-type': contentType
        },
        limits: {
          fileSize: 1 * 1024 * 1024, // 1MB limit
          files: 1
        }
      });

      // Handle form fields (like avatarUrl)
      busboy.on('field', (fieldname, value) => {
        if (fieldname === 'avatarUrl') {
          avatarUrl = value;
        }
      });

      busboy.on('file', (fieldname, file, info) => {
        fileName = info.filename;
        mimeType = info.mimeType;

        // Validate file type
        if (!mimeType.startsWith('image/')) {
          file.resume();
          resolve(NextResponse.json(
            { error: 'Only image files are allowed' },
            { status: 400 }
          ));
          return;
        }

        fileReceived = true;

        file.on('data', (data) => {
          fileSize += data.length;
          
          // Check file size limit
          if (fileSize > 1 * 1024 * 1024) {
            file.resume();
            resolve(NextResponse.json(
              { error: 'File size must be less than 1MB' },
              { status: 400 }
            ));
            return;
          }
          
          chunks.push(data);
        });

        file.on('end', async () => {
          if (chunks.length === 0) {
            resolve(NextResponse.json(
              { error: 'Empty file received' },
              { status: 400 }
            ));
            return;
          }

          try {
            // Combine chunks and convert to base64
            const buffer = Buffer.concat(chunks);
            const base64Image = `data:${mimeType};base64,${buffer.toString('base64')}`;

            // Update user avatar in database
            const user = await User.findByIdAndUpdate(
              userId,
              { avatar: base64Image },
              { new: true }
            ).select('-password');

            if (!user) {
              resolve(NextResponse.json(
                { error: 'User not found' },
                { status: 404 }
              ));
              return;
            }

            resolve(NextResponse.json({ 
              message: 'Avatar uploaded successfully',
              avatar: base64Image,
              user
            }));
          } catch (error) {
            console.error('Avatar save error:', error);
            resolve(NextResponse.json(
              { error: 'Failed to save avatar' },
              { status: 500 }
            ));
          }
        });

        file.on('error', (error) => {
          console.error('File stream error:', error);
          resolve(NextResponse.json(
            { error: 'Failed to process file' },
            { status: 500 }
          ));
        });
      });

      busboy.on('finish', () => {
        if (!fileReceived && !avatarUrl) {
          resolve(NextResponse.json(
            { error: 'No file or avatar URL provided' },
            { status: 400 }
          ));
          return;
        }

        // If avatarUrl was provided (default avatar selection)
        if (avatarUrl && !fileReceived) {
          User.findByIdAndUpdate(
            userId,
            { avatar: avatarUrl },
            { new: true }
          )
            .select('-password')
            .then(user => {
              if (!user) {
                resolve(NextResponse.json(
                  { error: 'User not found' },
                  { status: 404 }
                ));
                return;
              }

              resolve(NextResponse.json({ 
                message: 'Avatar updated successfully',
                avatar: avatarUrl,
                user
              }));
            })
            .catch(error => {
              console.error('Avatar update error:', error);
              resolve(NextResponse.json(
                { error: 'Failed to update avatar' },
                { status: 500 }
              ));
            });
        }
      });

      busboy.on('error', (error) => {
        console.error('Busboy error:', error);
        resolve(NextResponse.json(
          { error: 'Failed to upload file' },
          { status: 500 }
        ));
      });

      // Convert request to stream and pipe to busboy
      const reader = request.body?.getReader();
      if (reader) {
        const stream = new Readable({
          async read() {
            try {
              const { done, value } = await reader.read();
              if (done) {
                this.push(null);
              } else {
                this.push(Buffer.from(value));
              }
            } catch (error) {
              this.destroy(error);
            }
          }
        });
        stream.pipe(busboy);
      } else {
        resolve(NextResponse.json(
          { error: 'Invalid request body' },
          { status: 400 }
        ));
      }
    });
  } catch (error) {
    console.error('Avatar upload error:', error);
    return NextResponse.json(
      { error: 'Failed to upload avatar' },
      { status: 500 }
    );
  }
}
