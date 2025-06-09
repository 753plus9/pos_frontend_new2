"use client";

import { useEffect } from "react";
import { BrowserMultiFormatReader } from "@zxing/browser";

type Props = {
  onDetected: (code: string) => void;
  onClose: () => void;
};

export default function BarcodeScanner({ onDetected, onClose }: Props) {
  useEffect(() => {
    const codeReader = new BrowserMultiFormatReader();
    const videoEl = document.getElementById("barcode-video") as HTMLVideoElement;
    if (!videoEl) return;

    let controls: any;

    (async () => {
      controls = await codeReader.decodeFromVideoDevice(
        undefined,
        videoEl,
        (result, error, ctrl) => {
          if (result) {
            const code = result.getText();
            if (/^\d{13}$/.test(code)) {
              onDetected(code);
              ctrl.stop();
              onClose(); // スキャン後に閉じる
            }
          }
        }
      );
    })();

    return () => {
      if (controls) controls.stop();
    };
  }, [onDetected, onClose]);

  return (
    <div className="relative w-full">
      <video id="barcode-video" className="w-full aspect-video rounded-lg border" />
      <button
        onClick={onClose}
        className="absolute top-2 right-2 bg-red-600 text-white text-sm px-3 py-1 rounded-full"
      >
        ✕ 閉じる
      </button>
    </div>
  );
}
