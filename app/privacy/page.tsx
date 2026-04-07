import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: 'プライバシーポリシー | Life Explorer',
};

export default function PrivacyPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] px-6 py-12 max-w-2xl mx-auto text-stone-800">
      <div className="mb-8">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
          ← Life Explorer に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">プライバシーポリシー</h1>
      <p className="text-sm text-stone-400 mb-8">最終更新日：2026年4月3日</p>

      <div className="space-y-8 text-sm leading-relaxed text-stone-700">
        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">1. はじめに</h2>
          <p>
            Life Explorer（以下「本アプリ」）は、ユーザーの皆様のプライバシーを尊重し、個人情報の保護に努めています。
            本ポリシーは、本アプリが収集する情報、その利用方法、および皆様の権利について説明するものです。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">2. 収集する情報</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li><strong>アカウント情報：</strong>メールアドレスおよびパスワード（Supabase Auth により安全に管理）</li>
            <li><strong>利用データ：</strong>ルーティンタスク、お借り入れ履歴、アクティビティ記録、お気に入りペルソナ</li>
            <li><strong>設定情報：</strong>カテゴリ設定、ライフスタイルリズム、都道府県設定</li>
            <li><strong>AIサービス利用：</strong>AIペルソナ生成のためにユーザーが任意で入力するAPIキー（暗号化して保存）</li>
          </ul>
          <p className="mt-3">本アプリは、位置情報・カメラ・マイクなどのセンサーデータは収集しません。</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">3. 情報の利用目的</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>本アプリのサービス提供および機能の改善</li>
            <li>ルーティンのパーソナライズおよびイベント提案</li>
            <li>アクティビティストリークの計算と表示</li>
            <li>サービスに関する重要なお知らせの送信</li>
          </ul>
          <p className="mt-3">収集した情報は第三者へ販売しません。</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">4. データの保管</h2>
          <p>
            ユーザーデータはSupabase（米国）のサーバーに保存されます。Supabaseはデータを暗号化して保管し、
            SOC 2 Type II 認定を取得しています。
            デモモードで利用した場合、データはお使いのデバイスのローカルストレージにのみ保存されます。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">5. データの削除</h2>
          <p>
            設定画面の「アカウントを削除」からアカウントとすべての関連データを完全に削除できます。
            削除後はデータを復元することができません。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">6. お問い合わせ</h2>
          <p>
            プライバシーに関するご質問は、アプリ内の設定画面からお問い合わせください。
          </p>
        </section>
      </div>
    </div>
  );
}
