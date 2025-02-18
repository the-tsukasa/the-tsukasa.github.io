YoBi - AIショッピングアシスタント　HEW 就職作品（展示用）　
- 開発言語：HTML, JavaScript, CSS
- 制作者：HAL東京 PI11B 14 (PI021)
- プレビュー：>>>>https://the-tsukasa.github.io/AI-Shopping-Assistant/index.html<<<<  
⚠️ 注意：  
クイックプレビューでは、商品詳細ページが読み込めない、AIアシスタントの接続に失敗するなどの問題が発生する可能性があります。  
 ローカル環境での実行を推奨します。  
🚀 インストール方法  
1.ファイルのダウンロード- 圧縮ファイルをダウンロードし、ローカルに解凍してください。  
2.プロジェクトを開く   - VS Code を開き、解凍したフォルダを開く。  
3.依存関係をインストール- ターミナルで以下のコマンドを実行：npm install  
4.サーバーを起動         -ターミナルで以下のコマンドを実行： node server.js  
5.WEBを開く　	     -ブラウザで http://localhost:3000/ を開く。  
---
作品概要:  
	「AIショッピングアシスタント」は、AI技術を活用したWebアプリケーションです。
	商品の検索、最適なおすすめ提案、在庫確認、配送状況の確認など、ユーザーの質問に24時間365日対応可能です。
	直感的なUIと選択式ボタンで誰でも簡単に操作でき、快適なショッピング体験を提供します。
	また、企業のカスタマーサポート負担を軽減し、業務効率化と顧客満足度向上にも貢献します。

1. ウェブサイトのレイアウト概要  
	1.1 シンプルなショッピングサイトのレイアウト（共通要素）- 最上位ページ（ホーム）- パンくずリスト- 商品ページ- 会社情報- サポート- ロゴ欄- 検索バー- ログイン／新規登録ボタン- 個人ページ  
	1.2 最上位ページ（ホーム）- ウェブサイトの紹介- おすすめ商品- 商品ニュース（News）- AIショッピングの流れ  
	1.3 商品ページ- フィルター機能- 自動調整可能な商品カード- 商品詳細ページ  
	1.4 会社情報- チーム紹介- 会社概要- 会社の歴史- 事業内容- 経営理念- 所在地マップ（Google MAP）  
	1.5 サポート- 24時間AIカスタマーサポート- よくある質問（FAQ）- 延長保証プラン- お問い合わせ方法

2. AIショッピングアシスタントの紹介  
	2.1 AIアシスタントのUI- 画面右下に表示- GIFアイコンでアニメーション- マウスオーバーで挨拶メッセージを表示- クリックで開閉  
	2.2 検索バーとの連携- AIショッピングアシスタントが検索候補の商品名またはIDを監視- 自動で検索バーに入力  
	2.3 入力方式- テキスト入力対応- クイックボタン対応  
	2.4 FAQの優先対応- まずFAQデータと照合し、該当する質問に回答（例：「おすすめ」「注文」「配送」など）- 満足できない場合は「別のおすすめを見る」ボタンで再提案  
	2.5 FAQ外の質問（LLMモデルによる対応）- FAQに該当しない質問はAPIを介してLLMモデル（DeepSeek/OpenAI）で回答  
		今後の最適化の方向:   
			           1. AIの調整が必要（カスタマーサポートらしい回答、簡潔で迅速なレスポンス、サイト内の商品との関連性向上）  
			           2. フィルタリング機能の実装（業務外の質問をブロックし、API tokenの消費を抑える）  
			           3. APIコスト削減のため、ローカルモデルへの移行    
	2.6 クイックボタンの紹介と設計- 
	「PCを選ぶ」（ユーザーの手動選択）質問に回答しながら、最適な商品を推薦 
	「AIおすすめ」（AIによるおすすめ）サイト内の閲覧履歴、検索履歴、過去の購入履歴を基に商品を推定（現状: 底層ロジック未実装、アルゴリズム開発が必要）
	「人気商品」（売れ筋商品の表示）サイトの販売データをもとに自動推薦- 
	「注文・配送」（注文履歴・配送状況の確認）ボタンをクリックするだけで、注文履歴や配送状況を照会可能

3. その他の工夫点  
	3.1 フィルター機能- カテゴリ: 商品の種類別にフィルタリング- 価格範囲: 価格帯を指定可能- ブランド: ブランド別にフィルタリング- システム: OSやスペックで分類- 価格順: 価格の昇順・降順で並び替え- 複数条件の組み合わせ検索も可能  
	3.2 自適応商品カード- 商品データを動的に読み込み- 画像・商品名・簡単な説明・価格を表示- クリックで詳細ページへ遷移  
	3.3 検索バー- 名前のあいまい検索が可能（例: "macbookpro16"）- ID検索: "id:1,2,..."（最大5つまで指定可能）- サイト内のどのページからでも検索可能- Enterキーで商品ページに遷移
        3.3 デスクトップとモバイルデバイス向けに表示最適化を実施
        3.4 ログイン/登録（バックエンド未実装）

4. 今後の改善方向  
        4.1 AIショッピングアシスタントについて  
        4.1.1 ウェブサイト管理者向け  
               FAQ管理機能を提供し、FAQの追加・編集・削除を簡単に行えるようにする; 満足度分析レポートを導入し、AIアシスタントの回答品質を向上させる;   
              AIおすすめ機能の最適化：履歴データを活用し、パーソナライズされた提案を強化; 多言語対応（日本語・英語・中国語など）、海外ユーザー向けに拡張 
        4.1.2 顧客向け
	      チャット履歴の保存：過去の問い合わせ内容を確認できるようにする 
	      文脈理解機能：会話の流れを理解し、より自然な応答を実現 
              音声入力対応：音声アシスタントを利用して商品検索やレコメンドを行う 
	      AIカスタマーサポートのモード切り替え：AI対応から有人対応へスムーズに切り替え    
        4.2  ショッピングサイト本体の改善  
        4.2.1 データベース統合-データベースを接続し、商品データ・ユーザーデータ・注文履歴・チャット履歴を管理  
           在庫管理機能を実装し、在庫状況と商品表示をリアルタイムで同期  
           ユーザーデータの活用：購買履歴や閲覧履歴を分析し、レコメンドの精度を向上  
        4.2.2 管理者向けのバックエンドシステム  
           管理者と一般ユーザーの権限分離を行い、セキュリティを確保  
           可視化された管理パネルで、注文・売上データ・顧客フィードバックを一元管理  
           カスタマーサポート管理機能：オペレーターがAIの対応履歴を確認できる  
           注文・物流管理：管理者が注文状況をリアルタイムで確認し、物流システムと連携  
       4.2.3 ウェブサイトの機能改善  
           商品詳細ページの改善：ユーザーレビュー・製品比較機能を追加し、購買体験を向上  
           レコメンドアルゴリズムの最適化：ユーザー行動データを活用し、より適切な商品を推薦  
           検索機能とフィルターの強化：より精度の高い検索と、柔軟なフィルター条件を実装  
        

