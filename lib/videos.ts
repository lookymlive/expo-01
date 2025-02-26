// filepath: c:\Users\usuario\Desktop\expo-01\lib\videos.ts
import { supabase } from './supabase';

interface VideoData {
  title: string;
  description?: string;
  business_name: string;
  thumbnail_url?: string;
}

/**
 * Uploads a video file to the Supabase storage bucket and creates a database record.
 */
export async function uploadVideo(
  fileName: string,
  file: Blob,
  videoData: VideoData
) {
  const newFileName = `${Date.now()}-${fileName}`;

  // Upload to storage
  const { data: storageData, error: storageError } = await supabase.storage
    .from('videos')
    .upload(newFileName, file);

  if (storageError) throw storageError;

  // Get the public URL
  const {
    data: { publicUrl },
  } = supabase.storage.from('videos').getPublicUrl(storageData.path);

  // Create database record
  const { data: dbData, error: dbError } = await supabase
    .from('videos')
    .insert([
      {
        title: videoData.title,
        description: videoData.description,
        url: publicUrl,
        thumbnail_url: videoData.thumbnail_url,
        business_name: videoData.business_name,
        user_id: (await supabase.auth.getUser()).data.user?.id,
      },
    ])
    .select()
    .single();

  if (dbError) throw dbError;

  return dbData;
}

/**
 * Retrieves videos for the current business user
 */
export async function getBusinessVideos() {
  const {
    data: { user },
  } = await supabase.auth.getUser();
  if (!user) throw new Error('No user authenticated');

  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Retrieves all approved videos for regular users
 */
export async function getApprovedVideos() {
  const { data, error } = await supabase
    .from('videos')
    .select('*')
    .eq('status', 'approved')
    .order('created_at', { ascending: false });

  if (error) throw error;
  return data;
}

/**
 * Retrieves the public URL for a file stored in the 'videos' bucket.
 * @param path - The storage path of the file.
 * @returns The public URL of the file.
 */
export function getVideoPublicUrl(path: string) {
  const { data } = supabase.storage.from('videos').getPublicUrl(path);
  return data.publicUrl;
}
