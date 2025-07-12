import storage from '@react-native-firebase/storage';
import auth from '@react-native-firebase/auth';
import RNFS from 'react-native-fs';
import { Platform } from 'react-native';

// Simple test function to upload a text file
const testBasicUpload = async () => {
  try {
    console.log('🔥 Testing Firebase Storage Upload...');
    
    // Create a simple test file in cache directory
    const testContent = `Test upload at ${new Date().toISOString()}\nPlatform: ${Platform.OS}\nStorage Bucket: capitalprop-2e6d3.firebasestorage.app\nSDK Version: v22.4.0`;
    const fileName = `test_${Date.now()}.txt`;
    const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    
    console.log('📁 Creating test file:', filePath);
    await RNFS.writeFile(filePath, testContent, 'utf8');
    
    // Check if file exists
    const fileExists = await RNFS.exists(filePath);
    console.log('✅ Test file created:', fileExists);
    
    // Get file stats
    const stats = await RNFS.stat(filePath);
    console.log('📊 File stats:', { size: stats.size, path: stats.path, isFile: stats.isFile() });
    
    // Create Firebase Storage reference
    const reference = storage().ref(`test_uploads/${fileName}`);
    console.log('🚀 Starting Firebase Storage upload...');
    
    console.log('📍 Storage reference created:', reference.fullPath);
    console.log('🪣 Bucket name:', reference.bucket);
    
    // Upload file
    const task = reference.putFile(filePath);
    
    // Monitor upload progress
    task.on('state_changed', snapshot => {
      const progress = (snapshot.bytesTransferred / snapshot.totalBytes) * 100;
      console.log('📊 Upload progress:', progress.toFixed(2) + '%');
      console.log('📈 Bytes transferred:', snapshot.bytesTransferred + '/' + snapshot.totalBytes);
    }, error => {
      console.log('❌ Upload error in listener:', error);
      console.log('❌ Error code:', error.code);
      console.log('❌ Error message:', error.message);
      if (error.nativeErrorMessage) {
        console.log('❌ Native error:', error.nativeErrorMessage);
      }
    });
    
    // Wait for completion
    const snapshot = await task;
    console.log('🎉 Upload completed!');
    console.log('📋 Final snapshot:', {
      state: snapshot.state,
      bytesTransferred: snapshot.bytesTransferred,
      totalBytes: snapshot.totalBytes,
      metadata: snapshot.metadata
    });
    
    // Get download URL
    const downloadURL = await reference.getDownloadURL();
    console.log('🔗 Download URL:', downloadURL);
    
    // Clean up test file
    await RNFS.unlink(filePath);
    console.log('🧹 Test file cleaned up');
    
    return { success: true, downloadURL, fileName };
    
  } catch (error) {
    console.log('💥 Test upload failed:', error);
    console.log('💥 Error code:', error.code);
    console.log('💥 Error message:', error.message);
    if (error.nativeErrorMessage) {
      console.log('💥 Native error:', error.nativeErrorMessage);
    }
    console.log('💥 Full error object:', JSON.stringify(error));
    
    return { success: false, error };
  }
};

// Test image URI simulation
const testImageUpload = async () => {
  try {
    console.log('\n🖼️ Testing Image Upload Simulation...');
    
    // Create a fake image file for testing
    const imageContent = 'FAKE_IMAGE_DATA_FOR_TESTING_' + Date.now();
    const fileName = `test_image_${Date.now()}.jpg`;
    const filePath = `${RNFS.CachesDirectoryPath}/${fileName}`;
    
    console.log('📱 Creating fake image file:', filePath);
    await RNFS.writeFile(filePath, imageContent, 'utf8');
    
    const reference = storage().ref(`test_images/${fileName}`);
    console.log('🔄 Uploading fake image file...');
    
    const task = reference.putFile(filePath);
    const snapshot = await task;
    
    console.log('🎉 Image upload completed!');
    
    const downloadURL = await reference.getDownloadURL();
    console.log('🔗 Image download URL:', downloadURL);
    
    // Clean up
    await RNFS.unlink(filePath);
    
    return { success: true, downloadURL, fileName };
    
  } catch (error) {
    console.log('❌ Image upload error:', error.code, error.message);
    return { success: false, error };
  }
};

// Main test runner
export const runStorageTests = async () => {
  console.log('🧪 Starting Firebase Storage Tests...');
  console.log('\n=== TEST 1: Basic Text File Upload ===');
  
  const result1 = await testBasicUpload();
  
  console.log('\n=== TEST 2: Image File Upload Simulation ===');
  const result2 = await testImageUpload();
  
  console.log('\n📋 TEST SUMMARY:');
  console.log('Basic upload:', result1.success ? '✅ SUCCESS' : '❌ FAILED');
  console.log('Image upload:', result2.success ? '✅ SUCCESS' : '❌ FAILED');
  
  if (result1.success && result2.success) {
    console.log('\n🎉 ALL TESTS PASSED! Firebase Storage is working correctly.');
  } else {
    console.log('\n🚨 SOME TESTS FAILED. Check the errors above.');
  }
  
  return { basicUpload: result1, imageUpload: result2 };
}; 