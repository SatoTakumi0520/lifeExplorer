import React from 'react';
import Link from 'next/link';

export const metadata = {
  title: '利用規約 | Life Explorer',
};

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-[#FDFCF8] px-6 py-12 max-w-2xl mx-auto text-stone-800">
      <div className="mb-8">
        <Link href="/" className="text-sm text-stone-400 hover:text-stone-700 transition-colors">
          ← Life Explorer に戻る
        </Link>
      </div>

      <h1 className="text-2xl font-bold mb-2">利用規約</h1>
      <p className="text-sm text-stone-400 mb-8">最終更新日：2026年4月3日</p>

      <div className="space-y-8 text-sm leading-relaxed text-stone-700">
        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">1. 本規約への同意</h2>
          <p>
            Life Explorer（以下「本アプリ」）をご利用になるにあたり、本利用規約に同意いただく必要があります。
            同意いただけない場合は、本アプリをご利用いただけません。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">2. サービスの内容</h2>
          <p>
            本アプリは、ユーザーが自分のライフスタイルを探索・設計するためのルーティン管理ツールです。
            様々なペルソナのルーティンを参考にしながら、自分だけの一日の過ごし方を見つけることを目的としています。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">3. アカウント</h2>
          <ul className="list-disc pl-5 space-y-2">
            <li>アカウント登録には正確な情報の提供が必要です。</li>
            <li>アカウントのセキュリティはユーザー自身の責任で管理してください。</li>
            <li>不正利用を発見した場合は速やかにご連絡ください。</li>
            <li>1人のユーザーにつき1アカウントのみ作成できます。</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">4. 禁止事項</h2>
          <p>以下の行為を禁止します：</p>
          <ul className="list-disc pl-5 space-y-2 mt-2">
            <li>他のユーザーへの嫌がらせや不適切なコンテンツの投稿</li>
            <li>本アプリのサービスへの不正アクセスや妨害行為</li>
            <li>スパムや自動化ツールを用いた大量のデータ送信</li>
            <li>法律に違反する行為、または第三者の権利を侵害する行為</li>
          </ul>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">5. 知的財産</h2>
          <p>
            本アプリのデザイン、コンテンツ、ブランドに関する権利は運営者に帰属します。
            ユーザーが作成したルーティンデータはユーザー自身のものです。
            ユーザーはルーティンを公開（Option B以降）することで、他のユーザーが参照できることに同意したものとみなします。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">6. 免責事項</h2>
          <p>
            本アプリは「現状のまま」提供されます。運営者は、本アプリの利用により生じた損害について、
            法律の定める範囲を超えた責任を負いません。
            本アプリで提供されるルーティン・イベント情報はあくまで参考情報です。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">7. サービスの変更・終了</h2>
          <p>
            運営者は、予告なくサービスの内容を変更、または終了する場合があります。
            重要な変更がある場合はアプリ内または登録メールアドレスにてお知らせします。
          </p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">8. 準拠法</h2>
          <p>本規約は日本法に準拠し、日本国内の裁判所を専属的合意管轄とします。</p>
        </section>

        <section>
          <h2 className="font-bold text-base text-stone-800 mb-2">9. お問い合わせ</h2>
          <p>本規約に関するご質問はアプリ内の設定画面からお問い合わせください。</p>
        </section>
      </div>
    </div>
  );
}
