import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

async function main() {
  // サンプル記事の作成
  const articles = [
    {
      title: "革命的な塗料技術が塗装業界を変える",
      content: `最新のナノテクノロジーを活用した革命的な塗料が、塗装業界に大きな変化をもたらしています。

      ## 新技術の特徴

      この新しい塗料技術の主な特徴は以下の通りです：

      1. **耐久性の大幅向上** - 従来の塗料に比べて5倍の耐久性
      2. **環境への配慮** - VOC（揮発性有機化合物）を大幅削減
      3. **施工性の改善** - 塗りやすく、仕上がりが美しい

      ## 業界への影響

      この技術革新により、塗装業界は新たな局面を迎えています。職人の技術向上と最新技術の融合により、これまで以上に質の高い仕上がりが可能になります。

      特に、外壁塗装においては長期間のメンテナンス不要を実現し、顧客満足度の向上が期待されています。`,
      excerpt: "ナノテクノロジーを活用した革命的な塗料が塗装業界に変革をもたらします。耐久性、環境配慮、施工性が大幅に改善された新技術について詳しく解説します。",
      slug: "revolutionary-paint-technology",
      published: true,
      featured: true,
      category: "技術革新",
      tags: JSON.stringify(["ナノテクノロジー", "環境配慮", "耐久性", "外壁塗装"]),
      imageUrl: "https://images.unsplash.com/photo-1562259949-e8e7689d7828?w=800&h=400&fit=crop",
      author: "技術部チーム",
      publishedAt: new Date("2024-12-01"),
    },
    {
      title: "職人インタビュー：40年のキャリアが語る塗装の真実",
      content: `塗装一筋40年のベテラン職人、田中さん（仮名）にインタビューを行いました。

      ## 職人としての歩み

      「最初は見よう見まねで始めた塗装の仕事でしたが、40年経った今でも毎日が学びの連続です。」

      田中さんは建築塗装の分野で数々の難工事を手がけ、その技術は業界内でも高く評価されています。

      ## 技術の変遷

      40年間で塗装技術は大きく変わりました：
      
      - **1980年代**: 油性塗料が主流
      - **1990年代**: 水性塗料の普及
      - **2000年代**: 遮熱・断熱塗料の登場
      - **2010年代以降**: 機能性塗料の多様化

      ## 若い職人へのメッセージ

      「技術は日々進歩しますが、基本となる職人の心構えと丁寧な仕事は変わりません。お客様の大切な住まいを預かる責任を忘れずに。」`,
      excerpt: "塗装業界で40年のキャリアを積んだベテラン職人が語る、技術の変遷と職人としての心構え。若い世代へのメッセージも必見です。",
      slug: "veteran-craftsman-interview",
      published: true,
      featured: true,
      category: "インタビュー",
      tags: JSON.stringify(["職人", "インタビュー", "技術継承", "建築塗装"]),
      imageUrl: "https://images.unsplash.com/photo-1504307651254-35680f356dfd?w=800&h=400&fit=crop",
      author: "編集部",
      publishedAt: new Date("2024-11-25"),
    },
    {
      title: "海外塗装トレンド2024：欧州から学ぶ最新技術",
      content: `2024年の海外塗装業界のトレンドを欧州の展示会レポートと共にお届けします。

      ## 欧州塗装展示会2024ハイライト

      今年のドイツ・ケルンで開催された国際塗装展示会では、持続可能性をテーマとした製品が多数出展されました。

      ### 注目の新技術

      1. **バイオベース塗料**
         - 植物由来の原料を使用
         - CO2削減効果が期待される

      2. **AI診断システム**
         - 塗膜の劣化を自動診断
         - 最適な補修タイミングを予測

      3. **ロボット塗装技術**
         - 高所作業の安全性向上
         - 均一な仕上がりを実現

      ## 日本への応用可能性

      これらの技術は日本の気候や建築様式に適応する必要がありますが、特に高齢化が進む塗装業界における省力化技術として注目されています。`,
      excerpt: "欧州の国際塗装展示会から見えてきた2024年のトレンド。バイオベース塗料、AI診断、ロボット技術など最新技術を詳しく解説します。",
      slug: "european-painting-trends-2024",
      published: true,
      featured: false,
      category: "海外動向",
      tags: JSON.stringify(["海外トレンド", "欧州", "AI技術", "ロボット", "持続可能性"]),
      imageUrl: "https://images.unsplash.com/photo-1586953208448-b95a79798f07?w=800&h=400&fit=crop",
      author: "海外特派員",
      publishedAt: new Date("2024-11-20"),
    },
  ]

  for (const article of articles) {
    await prisma.article.upsert({
      where: { slug: article.slug },
      update: {},
      create: article,
    })
  }

  console.log('Sample articles created successfully!')
}

main()
  .catch((e) => {
    console.error(e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })