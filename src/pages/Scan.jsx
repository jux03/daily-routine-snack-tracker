import React, { useEffect, useRef, useState } from 'react';
import { BrowserMultiFormatReader } from '@zxing/library';

export default function Scan() {
  const videoRef = useRef(null);
  const [scanning, setScanning] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState('');
  const codeReaderRef = useRef(null);

  useEffect(() => {
    codeReaderRef.current = new BrowserMultiFormatReader();
    return () => {
      stopScan();
      codeReaderRef.current = null;
    };
  }, []);

  async function startScan() {
    setResult(null);
    setError('');
    setScanning(true);
    try {
      const constraints = { video: { facingMode: { ideal: 'environment' } } };
      const stream = await navigator.mediaDevices.getUserMedia(constraints);
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        await videoRef.current.play();
      }
      const code = await codeReaderRef.current.decodeOnceFromVideoDevice(undefined, videoRef.current);
      await handleBarcode(code?.text);
    } catch (e) {
      setError(e?.message || 'Failed to start scanner');
      setScanning(false);
      stopScan();
    }
  }

  function stopScan() {
    setScanning(false);
    const media = videoRef.current?.srcObject;
    if (media) {
      media.getTracks().forEach(t => t.stop());
    }
    if (videoRef.current) {
      videoRef.current.srcObject = null;
    }
  }

  async function handleBarcode(barcode) {
    try {
      if (!barcode) return;
      // OpenFoodFacts lookup
      const res = await fetch(`https://world.openfoodfacts.org/api/v2/product/${barcode}.json`);
      const data = await res.json();
      if (data?.product) {
        const product = data.product;
        const kcal100 = product.nutriments?.['energy-kcal_100g'];
        const servingKcal = product.nutriments?.['energy-kcal_serving'];
        setResult({
          code: barcode,
          name: product.product_name || 'Unknown',
          brand: product.brands,
          caloriesPer100g: kcal100,
          caloriesPerServing: servingKcal,
        });
      } else {
        setResult({ code: barcode, notFound: true });
      }
    } catch (e) {
      setError('Lookup failed');
    } finally {
      stopScan();
    }
  }

  return (
    <div className="container-narrow py-4 space-y-4">
      <h2 className="text-xl font-semibold">Scan Snack (Optional)</h2>
      <div className="card space-y-3">
        <video ref={videoRef} className="w-full rounded-md bg-black aspect-video" muted playsInline />
        <div className="flex gap-2">
          <button className="btn-primary" onClick={startScan} disabled={scanning}>Start Scan</button>
          <button className="btn-secondary" onClick={stopScan} disabled={!scanning}>Stop</button>
        </div>
        {error && <div className="text-red-500 text-sm">{error}</div>}
        {result && (
          <div className="border-t border-gray-200 dark:border-gray-700 pt-3">
            {result.notFound ? (
              <div>Barcode {result.code} not found in database.</div>
            ) : (
              <div className="space-y-1">
                <div className="font-medium">{result.name}</div>
                <div className="text-sm opacity-70">{result.brand}</div>
                <div className="text-sm">Calories/100g: <span className="font-semibold">{result.caloriesPer100g ?? 'N/A'}</span></div>
                <div className="text-sm">Calories/serving: <span className="font-semibold">{result.caloriesPerServing ?? 'N/A'}</span></div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}


