# Release Note X - Icon Image Prompts

## プロジェクトカラーパレット（header.svg準拠）

```
┌─────────────────────────────────────────────────────────────┐
│  Background:   Dark Teal Gradient                           │
│                #025159 → #013d42                            │
│                                                             │
│  Accent 1:     Gold Gradient                                │
│                #F2C641 → #F2AB27                            │
│                                                             │
│  Accent 2:     Orange Gradient                              │
│                #F2AB27 → #BF573F                            │
│                                                             │
│  Accent 3:     Terracotta Gradient                          │
│                #BF573F → #730C02                            │
│                                                             │
│  Text:         White #FFFFFF                                │
└─────────────────────────────────────────────────────────────┘
```

## メインアイコン用プロンプト（カラーマップ準拠）

### プロンプト1: モダンなフラットデザイン
```
A modern flat design app icon for "Release Note X" - a GitHub release note automation tool. The icon features a stylized document/paper with a rocket ship launching upwards, symbolizing automated deployments. Dark teal gradient background (#025159 to #013d42) with gold (#F2C641) and orange (#F2AB27) accent elements. Rounded corners, 1024x1024, professional tech aesthetic, vector art style. Clean minimalist design matching the brand's dark teal and gold color scheme.
```

### プロンプト2: 3D立体スタイル
```
A 3D rendered app icon showing the mathematical bold X symbol "𝕏" in glowing gold gradient (#F2C641 to #F2AB27), floating above a stylized document with GitHub octocat silhouette. Dark teal glossy background (#025159) with subtle orange (#BF573F) rim lighting. Soft shadows, floating on a dark background, high quality 3D render, 1024x1024 pixels, modern tech startup aesthetic matching header.svg color palette.
```

### プロンプト3: イラストレーションスタイル
```
A vibrant illustration-style icon featuring a paper plane (in gold #F2C641) flying from a document page towards the X social media logo, with decorative geometric shapes in orange (#F2AB27) and terracotta (#BF573F). Dark teal circular background (#025159), clean bold lines, 1024x1024, playful but professional design. Gold-to-orange gradient flow indicating the automation workflow.
```

### プロンプト4: 円形バッジスタイル
```
A circular badge icon with a dark teal background (#025159 to #013d42). Center features a bold "X" symbol in glowing gold gradient (#F2C641 to #F2AB27). The X is overlaid on a subtle document outline. Surrounding ring transitions from gold (#F2C641) through orange (#F2AB27) to terracotta (#BF573F). Modern badge style, 1024x1024, vector graphics, matching the project's signature color scheme.
```

### プロンプト5: シンプルなロゴマーク
```
A minimal logo mark combining the letters "R" and "X" in an interconnected geometric design. The "R" forms a document outline while the "X" is stylized like the mathematical bold character "𝕏". Gold gradient (#F2C641 to #F2AB27) on dark teal background (#025159). Subtle orange accent (#F2AB27) at the intersection. Solid bold design, 1024x1024, professional icon design suitable for app store, perfectly matching header.svg aesthetics.
```

## SNS用ヘッダー画像プロンプト

### ヘッダープロンプト（X/Twitter 用）
```
A wide banner image (1500x500) for "Release Note X" X (Twitter) header matching the brand aesthetic. Dark teal gradient background (#025159 to #013d42). Left side features the mathematical bold "𝕏" symbol in glowing gold (#F2C641). Center shows flowing golden connection lines from a GitHub repository icon to "𝕏" and Discord icons. Subtle geometric decorative circles in gold (#F2C641) and orange (#F2AB27) with 15% opacity. Right side displays project name "Release Note X" in white with glow effect. Clean, modern tech aesthetic with the signature dark teal and gold color scheme.
```

## OG画像用プロンプト

### OG画像プロンプト（1200x630）
```
An Open Graph image (1200x630) for GitHub release automation tool "Release Note X". Dark teal gradient background (#025159 to #013d42). Center features a stylized document with a paper plane launching towards a glowing "𝕏" symbol in gold gradient (#F2C641 to #F2AB27). Text overlay at top: "Release Note X" in white. Subtitle: "GitHub Releases → X & Discord Auto Poster" in gold (#F2C641). Decorative geometric shapes in orange (#F2AB27) and terracotta (#BF573F) with low opacity. Modern developer tool aesthetic matching header.svg style, clean and professional.
```

### GitHub Social Image 用プロンプト（1280x640）
```
A GitHub social preview image (1280x640) for "Release Note X" repository. Dark teal background (#025159). Large mathematical bold "𝕏" character centered in glowing gold gradient (#F2C641 to #F2AB27). Below it: "Release Note X" in white text. Tagline: "Automated GitHub Release Notes to X & Discord" in gold (#F2C641). Subtle decorative corner elements in gold and orange (#F2AB27) with 15% opacity. Minimal, modern, matching the project's dark teal and gold brand identity.
```

## スタイルガイド

### カラーパレット（header.svg 準拠）
```css
/* Background - Dark Teal Gradient */
--bg-teal-start: #025159;
--bg-teal-end:   #013d42;

/* Accent 1 - Gold Gradient */
--gold-start:    #F2C641;
--gold-end:      #F2AB27;

/* Accent 2 - Orange Gradient */
--orange-start:  #F2AB27;
--orange-end:    #BF573F;

/* Accent 3 - Terracotta Gradient */
--terracotta-start: #BF573F;
--terracotta-end:   #730C02;

/* Text */
--text-white:    #FFFFFF;
--text-gold:     #F2C641;
```

### デザイン原則（header.svg 準拠）
1. **シンプルで認識しやすい**: 小さなサイズでも判別可能
2. **ダークティール × ゴールド**: プロジェクトの署名配色を使用
3. **グラデーション活用**: ゴールド→オレンジ→テラコッタの流れ
4. **数値太字 "𝕏"**: ブランドアイデンティティの核となる要素
5. **自動化を表現**: 紙飛行機、接続線、矢印など
6. **サブティルな装飾**: 低透過度（15-20%）の幾何学要素

### ビジュアルモチーフ
- **メインシンボル**: 数値太字 "𝕏"（header.svg:56参照）
- **ドキュメント**: リリースノートを表す紙/ドキュメントアイコン
- **接続/フロー**: GitHub → X/Discord の自動投稿フロー
- **装飾要素**: 円形、角のパス（header.svg:46-53参照）

## レンダリング設定推奨

### DALL-E 3
```
明確にカラーコードを指定したプロンプトを使用
スタイル: "Modern vector art style" または "Flat design with subtle gradients"
```

### Midjourney
```
--style raw --stylize 250 --quality 2
カラーパレット指定: "#025159, #F2C641, #F2AB27, #BF573F"
```

### Stable Diffusion
```prompt
Steps: 30-50
CFG Scale: 7-9
Sampler: DPM++ 2M Karras
Size: 1024x1024

Negative Prompt:
blurry, low quality, distorted, text watermark, signature,
bright neon colors, purple, blue discord, twitter blue,
cluttered, messy, photorealistic

Color Token:
dark teal #025159, gold #F2C641, orange #F2AB27, terracotta #BF573F
```

### プロンプト構成テンプレート
```
[デザインスタイル] app icon for "Release Note X".
[メイン要素] in gold gradient (#F2C641 to #F2AB27).
Dark teal background (#025159 to #013d42).
[追加要素] in orange (#F2AB27) accents.
[サイズ・仕様] 1024x1024, modern tech aesthetic,
matching header.svg color palette.
```

## 参照: header.svg デザイン要素

```svg
<!-- これらの要素をアイコンに反映 -->

1. 数値太字 "𝕏" (line 56)
   → アイコンのメインシンボルとして使用

2. ダークティールグラデーション (line 4-6)
   → アイコンの背景色

3. ゴールド→オレンジ→テラコッタのアクセント (line 9-24)
   → アイコンの強調色

4. 装飾用の円形 (line 50-53)
   → サブティルな背景要素（opacity 15-20%）

5. グロー効果 (line 28-33)
   → メイン要素の発光効果

6. 角の装飾パス (line 46-47)
   → 勢いのあるアクセント要素
```
