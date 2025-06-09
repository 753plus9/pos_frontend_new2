"use client";

import { useState, KeyboardEvent } from "react";
import axios from "axios";
import BarcodeScanner from "./components/BarcodeScanner";

type Product = {
  prd_id: number;
  prd_code: number;
  prd_name: string;
  prd_price: number;
};

type PurchaseItem = Product;

export default function Page() {
  const [prdCodeInput, setPrdCodeInput] = useState("");
  const [product, setProduct] = useState<PurchaseItem | null>(null);
  const [purchaseList, setPurchaseList] = useState<PurchaseItem[]>([]);

  const [showScanner, setShowScanner] = useState(false);


  const handleDetectedCode = (code: string) => {
    setPrdCodeInput(code);
    fetchProduct(code); // 自動的に取得
  };

  const fetchProduct = async (code: string) => {
    const url = `${process.env.NEXT_PUBLIC_API_ENDPOINT}/products/${code}`;
    console.log("🔍 APIリクエストURL:", url);
  
    try {
      const res = await axios.get<Product>(url);
      console.log("✅ レスポンス:", res.data);
      setProduct(res.data);
    } catch (error: any) {
      console.error("❌ APIエラー:", error);
      alert("該当する商品が見つかりませんでした");
      setProduct(null);
    }
  };
  
  const handleKeyDown = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && prdCodeInput.trim()) {
      fetchProduct(prdCodeInput.trim());
    }
  };
  

  const handleAdd = () => {
    if (product) {
      setPurchaseList([...purchaseList, product]);
      setProduct(null);
      setPrdCodeInput("");
    }
  };

  const calcTotalExTax = () => purchaseList.reduce((sum, item) => sum + item.prd_price, 0);
  const calcTax = () => Math.floor(calcTotalExTax() * 0.1);
  const calcTotal = () => calcTotalExTax() + calcTax();

  const handlePurchase = async () => {
    try {
      const res = await axios.post(`${process.env.NEXT_PUBLIC_API_ENDPOINT}/purchase`, {
        emp_cd: "9999999999", // 固定またはログインユーザーから取得
        items: purchaseList,
      });
  
      alert(
        `お買い上げありがとうございます。\n購入金額（税抜）：${calcTotalExTax()}円\n消費税：${calcTax()}円\n購入金額（税込）：${calcTotal()}円`
      );
  
      setPurchaseList([]);
      setProduct(null);
      setPrdCodeInput("");
    } catch (error) {
      console.error("購入処理に失敗:", error);
      alert("購入処理に失敗しました");
    }
  };  

  return (
    <main className="p-4 max-w-sm mx-auto space-y-6 text-center">
      
       {/* ✅ スキャンボタン */}
       <button
        onClick={() => setShowScanner(true)}
        className="bg-cyan-500 text-white font-bold text-lg py-2 w-full rounded-full"
      >
        スキャン
      </button>

      {/* ✅ カメラ表示 */}
      {showScanner && (
        <BarcodeScanner
          onDetected={handleDetectedCode}
          onClose={() => setShowScanner(false)}
        />
      )}

      <input
        type="text"
        placeholder="商品コード"
        value={prdCodeInput}
        onChange={(e) => setPrdCodeInput(e.target.value)}
        onKeyDown={handleKeyDown}
        className="w-full p-3 rounded-xl border text-center text-lg bg-gray-100"
      />

      <div className="text-sm text-left p-2 bg-blue-50 rounded min-h-[3rem]">
        {product ? (
          <>
            <p className="font-semibold">商品名: {product.prd_name}</p>
            <p>価格: {product.prd_price}円</p>
          </>
        ) : (
          <p className="text-gray-400">商品情報を表示</p>
        )}
      </div>

      <button
        onClick={handleAdd}
        className="bg-cyan-500 text-white font-bold text-lg py-2 w-full rounded-full"
      >
        追加
      </button>

      <section className="bg-gray-100 p-4 rounded-xl space-y-3">
        <h2 className="font-semibold text-base">購入リスト</h2>
        <ul className="space-y-1 text-left text-sm max-h-32 overflow-y-auto">
          {purchaseList.length > 0 ? (
            purchaseList.map((item, i) => (
              <li key={i} className="flex justify-between">
                <span>{item.prd_name}</span>
                <span>x1</span>
                <span>{item.prd_price}円</span>
                <span>{item.prd_price}円</span>
              </li>
            ))
          ) : (
            <li className="text-gray-400">追加された商品はありません</li>
          )}
        </ul>
      </section>

      <section className="bg-gray-100 p-4 rounded-xl space-y-2 text-sm text-left">
        <h2 className="font-semibold text-center">お買い上げ金額</h2>
        <div className="flex justify-between">
          <span>合計金額（税抜）</span>
          <span>{calcTotalExTax()}円</span>
        </div>
        <div className="flex justify-between">
          <span>消費税</span>
          <span>{calcTax()}円</span>
        </div>
        <div className="flex justify-between font-bold">
          <span>合計金額（税込）</span>
          <span>{calcTotal()}円</span>
        </div>
      </section>

      <button
        onClick={handlePurchase}
        className="bg-cyan-500 text-white font-bold text-lg py-2 w-full rounded-full"
      >
        購入
      </button>
    </main>
  );
}
