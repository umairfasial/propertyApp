export const getReadableFileName = url => {
  const decodedUrl = decodeURIComponent(url);
  const match = decodedUrl.match(/_(The.+\.pdf)/i);
  return match ? match[1] : null;
};
