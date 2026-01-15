import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';

export async function initializeTensorFlow() {
  try {
    // Set backend ke WebGL untuk performa terbaik
    await tf.setBackend('webgl');
    await tf.ready();

    console.log('✅ TensorFlow.js ready');
    console.log('Backend:', tf.getBackend());
    console.log('WebGL supported:', await tf.env().getAsync('WEBGL_VERSION'));

    return true;
  } catch (error) {
    console.error('❌ TensorFlow initialization failed:', error);

    // Fallback ke CPU jika WebGL gagal
    try {
      await tf.setBackend('cpu');
      await tf.ready();
      console.warn('⚠️ Fallback to CPU backend');
      return true;
    } catch (cpuError) {
      console.error('❌ CPU backend also failed:', cpuError);
      return false;
    }
  }
}