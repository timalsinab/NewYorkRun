// apiService.tsx
export const uploadPhoto = async (file: File) => {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('https://localhost:7025/api/upload/upload', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Upload failed: ${errorText}`);
  }

  return response.json();
};
