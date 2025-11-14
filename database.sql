-- 诗词赏析网站数据库结构
-- 请在 Supabase SQL Editor 中执行此文件

-- 1. 创建 authors 表（作者表）
CREATE TABLE IF NOT EXISTS authors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name VARCHAR(100) NOT NULL,
  dynasty VARCHAR(50) NOT NULL,
  birth_year INTEGER,
  death_year INTEGER,
  biography TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 2. 创建 poems 表（诗词表）
CREATE TABLE IF NOT EXISTS poems (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  title VARCHAR(200) NOT NULL,
  content TEXT NOT NULL,
  author_id UUID REFERENCES authors(id) ON DELETE CASCADE,
  appreciation TEXT,
  translation TEXT,
  views INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 3. 创建 collections 表（收藏表）
CREATE TABLE IF NOT EXISTS collections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id VARCHAR(100) NOT NULL,
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(user_id, poem_id)
);

-- 4. 创建 comments 表（评论表）
CREATE TABLE IF NOT EXISTS comments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  poem_id UUID REFERENCES poems(id) ON DELETE CASCADE,
  user_id VARCHAR(100) NOT NULL,
  content TEXT NOT NULL,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- 创建索引以提高查询性能
CREATE INDEX IF NOT EXISTS idx_poems_author_id ON poems(author_id);
CREATE INDEX IF NOT EXISTS idx_poems_views ON poems(views DESC);
CREATE INDEX IF NOT EXISTS idx_collections_user_id ON collections(user_id);
CREATE INDEX IF NOT EXISTS idx_collections_poem_id ON collections(poem_id);
CREATE INDEX IF NOT EXISTS idx_comments_poem_id ON comments(poem_id);

-- 创建增加浏览量的函数
CREATE OR REPLACE FUNCTION increment_views(poem_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE poems SET views = views + 1 WHERE id = poem_id;
END;
$$ LANGUAGE plpgsql;

-- 插入示例作者数据
INSERT INTO authors (name, dynasty, birth_year, death_year, biography) VALUES
('李白', '唐', 701, 762, '李白，字太白，号青莲居士，唐代伟大的浪漫主义诗人，被后人誉为"诗仙"。他的诗歌雄奇飘逸，艺术成就极高，对后代产生了极为深远的影响。'),
('杜甫', '唐', 712, 770, '杜甫，字子美，自号少陵野老，唐代伟大的现实主义诗人，被后人誉为"诗圣"。其诗沉郁顿挫，语言精炼，格律严谨，对后世影响深远。'),
('苏轼', '宋', 1037, 1101, '苏轼，字子瞻，号东坡居士，北宋著名文学家、书法家、画家。唐宋八大家之一，词开豪放一派，对后世影响巨大。')
ON CONFLICT DO NOTHING;

-- 插入示例诗词数据
INSERT INTO poems (title, content, author_id, appreciation, translation) VALUES
('静夜思', '床前明月光，疑是地上霜。\n举头望明月，低头思故乡。', 
 (SELECT id FROM authors WHERE name = '李白' LIMIT 1),
 '这首诗写的是在寂静的月夜思念家乡的感受。诗人通过"疑是地上霜"这一形象的比喻，写出了月光的皎洁，也表现了季节的寒冷。全诗语言清新朴素而韵味含蓄无穷，历来广为传诵。',
 '明亮的月光洒在床前的窗户纸上，好像地上泛起了一层霜。我禁不住抬起头来，看那天窗外空中的明月，不由得低头沉思，想起远方的家乡。'),

('春晓', '春眠不觉晓，处处闻啼鸟。\n夜来风雨声，花落知多少。',
 (SELECT id FROM authors WHERE name = '李白' LIMIT 1),
 '这首诗是诗人隐居在鹿门山时所作，描写了春天早晨醒来时的情景。诗人抓住春天的早晨刚刚醒来时的一瞬间展开描写和联想，生动地表达了诗人对春天的热爱和怜惜之情。',
 '春日里贪睡不知不觉天已破晓，搅乱我酣眠的是那啁啾的小鸟。昨天夜里风声雨声一直不断，那娇美的春花不知被吹落了多少？'),

('望庐山瀑布', '日照香炉生紫烟，遥看瀑布挂前川。\n飞流直下三千尺，疑是银河落九天。',
 (SELECT id FROM authors WHERE name = '李白' LIMIT 1),
 '这是一首写景诗，描绘了庐山瀑布的壮丽景象。诗人运用夸张的手法，将瀑布的高和急描写得淋漓尽致。"疑是银河落九天"一句，想象奇特，气势磅礴，成为千古名句。',
 '香炉峰在阳光的照射下生起紫色烟霞，远远望见瀑布似白色绢绸悬挂在山前。高崖上飞腾直落的瀑布好像有几千尺，让人恍惚以为银河从天上泻落到人间。'),

('春望', '国破山河在，城春草木深。\n感时花溅泪，恨别鸟惊心。\n烽火连三月，家书抵万金。\n白头搔更短，浑欲不胜簪。',
 (SELECT id FROM authors WHERE name = '杜甫' LIMIT 1),
 '这首诗是杜甫被安史叛军俘获后困居长安时所作。全诗围绕"望"字展开，表达了诗人对国家前途的忧虑和对亲人的思念。诗中"感时花溅泪，恨别鸟惊心"两句，移情于物，感人至深。',
 '长安沦陷，国家破碎，只有山河依旧；春天来了，人烟稀少的长安城里草木茂密。感伤国事，不禁涕泪四溅，鸟鸣惊心，徒增离愁别恨。连绵的战火已经延续了半年多，家书难得，一封抵得上万两黄金。愁绪缠绕，搔头思考，白发越搔越短，简直要不能插簪了。'),

('水调歌头·明月几时有', '明月几时有？把酒问青天。不知天上宫阙，今夕是何年。我欲乘风归去，又恐琼楼玉宇，高处不胜寒。起舞弄清影，何似在人间。\n转朱阁，低绮户，照无眠。不应有恨，何事长向别时圆？人有悲欢离合，月有阴晴圆缺，此事古难全。但愿人长久，千里共婵娟。',
 (SELECT id FROM authors WHERE name = '苏轼' LIMIT 1),
 '这首词是中秋望月怀人之作，表达了对胞弟苏辙的无限怀念。全词意境豪放而阔大，情怀乐观而旷达，对明月的向往之情，对人间的眷恋之意，以及那浪漫的色彩，潇洒的风格和行云流水一般的语言，至今仍能给人们以健康的美学享受。',
 '明月从什么时候才开始出现的？我端起酒杯遥问苍天。不知道在天上的宫殿，何年何月。我想要乘御清风回到天上，又恐怕在美玉砌成的楼宇，受不住高耸九天的寒冷。翩翩起舞玩赏着月下清影，哪像是在人间。\n月儿转过朱红色的楼阁，低低地挂在雕花的窗户上，照着没有睡意的自己。明月不该对人们有什么怨恨吧，为什么偏在人们离别时才圆呢？人有悲欢离合的变迁，月有阴晴圆缺的转换，这种事自古来难以周全。只希望这世上所有人的亲人能平安健康，即便相隔千里，也能共享这美好的月光。')
ON CONFLICT DO NOTHING;

-- 配置 Row Level Security (RLS)
-- 允许匿名用户读取所有表
ALTER TABLE authors ENABLE ROW LEVEL SECURITY;
ALTER TABLE poems ENABLE ROW LEVEL SECURITY;
ALTER TABLE collections ENABLE ROW LEVEL SECURITY;
ALTER TABLE comments ENABLE ROW LEVEL SECURITY;

-- 创建允许所有人读取的策略
CREATE POLICY "Allow public read access on authors" ON authors
  FOR SELECT USING (true);

CREATE POLICY "Allow public read access on poems" ON poems
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on collections" ON collections
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public delete on collections" ON collections
  FOR DELETE USING (true);

CREATE POLICY "Allow public read on collections" ON collections
  FOR SELECT USING (true);

CREATE POLICY "Allow public insert on comments" ON comments
  FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow public read on comments" ON comments
  FOR SELECT USING (true);

-- 允许更新 poems 表的 views 字段
CREATE POLICY "Allow public update views on poems" ON poems
  FOR UPDATE USING (true);

