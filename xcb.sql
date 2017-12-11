-- phpMyAdmin SQL Dump
-- version 3.5.3
-- http://www.phpmyadmin.net
--
-- 主机: localhost
-- 生成日期: 2015 年 11 月 10 日 15:57
-- 服务器版本: 5.5.19
-- PHP 版本: 5.2.17

SET SQL_MODE="NO_AUTO_VALUE_ON_ZERO";
SET time_zone = "+00:00";


/*!40101 SET @OLD_CHARACTER_SET_CLIENT=@@CHARACTER_SET_CLIENT */;
/*!40101 SET @OLD_CHARACTER_SET_RESULTS=@@CHARACTER_SET_RESULTS */;
/*!40101 SET @OLD_COLLATION_CONNECTION=@@COLLATION_CONNECTION */;
/*!40101 SET NAMES utf8 */;

--
-- 数据库: `xcb`
--

-- --------------------------------------------------------

--
-- 表的结构 `admin`
--

CREATE TABLE IF NOT EXISTS `admin` (
  `admin_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(20) NOT NULL DEFAULT '',
  `nick` char(20) NOT NULL DEFAULT '',
  `email` char(30) NOT NULL DEFAULT '',
  `password` char(32) NOT NULL DEFAULT '',
  `salt` char(15) NOT NULL DEFAULT '',
  `lastlogin` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`admin_id`),
  UNIQUE KEY `name` (`name`),
  UNIQUE KEY `name_2` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=2 ;

--
-- 转存表中的数据 `admin`
--

INSERT INTO `admin` (`admin_id`, `name`, `nick`, `email`, `password`, `salt`, `lastlogin`) VALUES
(1, 'test', '', '', 'ba6e52c6faa1c79b0535811a16c0456e', '|gT5FnWz', 1445516396);

-- --------------------------------------------------------

--
-- 表的结构 `art`
--

CREATE TABLE IF NOT EXISTS `art` (
  `art_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `cat_id` smallint(5) unsigned DEFAULT '0',
  `user_id` int(10) unsigned DEFAULT '0',
  `nick` varchar(45) DEFAULT '',
  `title` varchar(45) DEFAULT '',
  `content` text,
  `pic` varchar(100) NOT NULL DEFAULT '',
  `thumb` varchar(200) NOT NULL DEFAULT '',
  `pubtime` int(10) unsigned NOT NULL DEFAULT '0',
  `lastup` int(10) unsigned DEFAULT '0',
  `comm` smallint(5) unsigned NOT NULL DEFAULT '0',
  `arttag` char(50) NOT NULL DEFAULT '',
  PRIMARY KEY (`art_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 COMMENT='文章表' AUTO_INCREMENT=17 ;

--
-- 转存表中的数据 `art`
--

INSERT INTO `art` (`art_id`, `cat_id`, `user_id`, `nick`, `title`, `content`, `pic`, `thumb`, `pubtime`, `lastup`, `comm`, `arttag`) VALUES
(7, 1, 0, '', 'What Do You Mean?-- Justin Bieber', '<div id="arts2">\r\n					<embed src="http://player.yinyuetai.com/video/player/2361905/v_0.swf" quality="high" width="480px" height="334" align="middle"  allowScriptAccess="sameDomain" allowfullscreen="true" type="application/x-shockwave-flash"></embed>\r\n				</div>', '', '', 1443441507, 0, 7, 'mv,Justin Bieber'),
(4, 1, 0, '', '美丽的颐和园', '<p>一进颐和园大门，映入眼帘的是澄碧入镜的昆明湖。风轻轻拂过，湖面漾起了粼粼的波纹。太阳照向湖面，使湖面金光闪闪,颐和园真是太美了！</p>\r\n    <p>一进颐和园大门，映入眼帘的是澄碧入镜的昆明湖。风轻轻拂过，湖面漾起了粼粼的波纹。太阳照向湖面，使湖面金光闪闪。五光四色。在湖面上，有几艘小船在荡漾，犹入一只只水鸟自由自在的浮在水面，为一望无际的昆明湖另填了几分色彩，犹如玉带明珠。湖岸边，争芳斗艳的荷花尽情的绽放。一朵朵荷花说：“我们是最美的！”游人们一边观赏一边评说，颐和园顿时热闹起来。</p>\r\n    <p>再往前走，那就来到了艺术长廊。长廊真是名不虚传，一共犹100多间。这儿到处都洋溢着一种古香古色的味道。</p>\r\n    <p>长廊的柱子上。栏杆上。天板上有着古代画家的名画，还有些题诗题词和人物花草鸟兽，栩栩如生，别有一番情趣每个小间都很别致。很生动。人们在里面欣赏诗画简直是一种美的享受。看累了，还可以在长椅上，休息一下。长廊两旁百花争艳，粉的似霞，红的似火，黄的似金，绚丽无比，一簇一簇，美不胜收。</p>\r\n    <p>穿过长廊我们登上半山腰，金碧辉煌的佛香阁展现在我们面前，这儿塑立着形态各异的菩萨。有爱笑的弥勒佛，有拿着净瓶的净瓶菩萨，还有贪睡的卧地佛。而最大的佛则是地藏王，他身上还镀着金子，金光闪闪。见的哦我就拜，我恭恭敬敬地向他们作仪，愿他们保佑我们全家平安快乐。佛香阁是用条形方砖建成的。古代劳动人民真是太伟大了，把佛香阁打扮得如此漂亮，那个时候没有汽车起重机，是一步一步搬上去的。站在佛香阁上，能够望穿整个颐和园。艳阳高照，青山绿水鲜花。让颐和园多了几分壮美，多了几分迷恋。</p>\r\n    <p>更令人注目的是十七孔桥。十七孔桥面向昆明湖正中心小岛。十七孔桥，因为桥下有十七阁桥洞，因此得名。这座桥长约58米，宽约4米。桥的扶手。栏杆上雕有各种各样的图案。特别是石狮子，大小不同。姿态各异。栩栩如生，一个个活灵活现。有的飞奔向前，有的正在嬉戏玩耍，正是独具匠心，叫人称绝。传说，这座桥是幸福快乐的象征，于是我走上这座桥。</p>\r\n    <p>参观完颐和园，禁不住赞叹出一句：“颐和园真是太美了，不愧为最美的园林，不愧为人民劳动的结晶，不愧为中国文化的愧宝！”</p>', '/upload/2015/09/28/xk8N.jpg', '/upload/2015/09/28/WjeY.png', 1443440154, 0, 0, ''),
(5, 1, 0, '', '北京香山', '<p>北国风光，千里冰封，万里雪飘。望长城内外，惟余莽莽；大河上下，顿失滔滔。山舞银蛇，原驰蜡象，欲与天公试比高。须晴日，看红装素裹，分外妖娆。 江山如此多娇，引无数英雄竞折腰。惜秦皇汉武，略输文采；唐宗宋祖，稍逊风骚。一代天骄，成吉思汗，只识弯弓射大雕。俱往矣，数风流人物，还看今朝。 人们都说，秋天的香山最好看。深秋时节，我们去香山旅游，那天阳光明媚，天气十分晴朗。我和爸爸、妈妈、姐姐一起坐车去香山，听同学说那里的景色如同一幅会动的画，他们还说只有到了香山才知道它的名不虚传。 　　离香山还有一段距离，我们远远的就看见了连绵起伏的香山了，起伏的山中点缀着一片片红稠子似的枫叶。一阵秋风拂过，枫树来回摇曳着，好像一片烈火在山坡上猛烈地燃烧，谁见了都会发出赞叹：这景色真是太美了！</p>　\r\n	<p>走进香山公园的大门，便可以看到路两旁都布满了菊花。它们吐蕊展瓣，争艳斗丽。红的像燃烧的火焰，黄的如耀眼的黄金，粉的像西天的晚霞，每朵菊花都散发出诱人的香味儿。继续向前走，周围的小草都变黄了，阳光照在草地上，好像大地上都铺上了一层金色的被子。那一棵棵四季常青的迎客松仍然那样从容地迎接着来来往往的游客，它们是那样挺拔，那样苍翠。 　　我们开始向山顶爬，只见满地都是红叶，小路旁边德枫树上都长满了似火的红叶，微风吹来，一片一片的红叶都飘了起来，好像一只只美丽的蝴蝶在翩翩起舞。我被这景色深深地陶醉了，也被迷住了。</p>　\r\n	<p>我们鼓着劲一直往上爬，终于爬到了香炉峰，我看了美丽的天空离我们这么近，我正看着，妈妈叫我：“倩倩，快过来看，多美呀！”我急忙赶过来，从上往下看，哇，太美了，底下全是红叶，简直就是一副美丽的动态画卷。美丽极了。我禁不住脱口而出：“香山的美果然是名不虚传呀！”</p> 　　\r\n	<p>香山，真是旅游的好地方，我喜欢美丽的秋天，更喜欢深秋的香山红叶。</p>', '/upload/2015/09/28/4cHQ.jpg', '/upload/2015/09/28/Anat.png', 1443440394, 0, 0, '北京,景点'),
(6, 1, 0, '', '我与天堂', '<p>金色的阳光普照着大地，蓝天上，几朵白云在慢慢的浮动着。我兴致勃勃地和妈妈来到了距今已有600余年历史的古建筑——天坛公园游玩。</p>\r\n<p>走进公园的大门，一股股花的清香扑鼻而来。大道两旁的古松给人一种庄严、肃穆的感觉，一棵棵古松就像列队的士兵，守护着这古老的建筑。</p>\r\n<p>我们伴着欢快的鸟叫声，登上了明、清两代皇帝用来祭天和祈祷的祈年殿的台基。经过三层汉白玉的台阶后，展现在我眼前的是一个直径246米，高38。2米的圆形大殿，这就是祈年殿。祈年殿由16根红红的木柱支撑着。其中雕有金龙的4根靠内的柱子代表春、夏、秋、冬四个季节。其余的12根没雕金龙的柱子代表十二个月和十二个时辰。中间的神位是皇帝用来祭天的。大殿给人一种庄重、典雅的感觉。蓝蓝的琉璃瓦屋顶与蓝蓝的天空融为一体。</p>\r\n<p>穿过一条汉白玉铺成的大道后，我们就来到了大家所熟知的回音壁。我怀着好奇的心情，请妈妈站在离我很远的地方对着墙壁说话。我站在这边捂住一只耳朵，把另一只耳朵紧紧地贴在墙壁上，屏住呼息，仔细地停。</p>\r\n<p>只听见回音壁里传来：“你听见我的声音了吗？”</p>\r\n<p>我立刻回答：“听见了，您听见了吗？”</p>\r\n<p>“听见了，很清楚！”妈妈回答道。</p>\r\n<p>“哇，这墙壁可真神奇呀！”我不由地赞叹道。</p>\r\n<p>咦，那就是建于1530年的圜丘吧！听说它不论石阶、石柱，都采用“9”或“9”的倍数。我连忙跑到哪里，想看个究竟。“1、2、3、4、5、6……”真是9阶。再数数雕有二龙戏珠的柱子。第一层是81个，第二层是72个，第三层是63个。果然都是“9”或“9”的倍数，真是名不虚传呀！有句话叫：“土之高者曰丘，取之然之丘圜者，象天圜也。”天，我也算是登了一次“天”了。</p>\r\n<p>在回去的途中，我想：天坛，这几百年屹立于此的精美建筑，体现了我国悠久的历史和雕刻家的高超技艺。它是我们民族的骄傲！</p>', '/upload/2015/09/28/rvUX.jpg', '/upload/2015/09/28/2d9z.png', 1443441252, 0, 2, '北京,景点,天堂');

-- --------------------------------------------------------

--
-- 表的结构 `cat`
--

CREATE TABLE IF NOT EXISTS `cat` (
  `cat_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `catname` char(30) NOT NULL DEFAULT '',
  `num` smallint(5) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`cat_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=5 ;

--
-- 转存表中的数据 `cat`
--

INSERT INTO `cat` (`cat_id`, `catname`, `num`) VALUES
(1, '人生', 4),
(2, '哲学', 0),
(3, '技术', 0);

-- --------------------------------------------------------

--
-- 表的结构 `comment`
--

CREATE TABLE IF NOT EXISTS `comment` (
  `comment_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `art_id` int(10) unsigned NOT NULL,
  `user_id` int(10) unsigned NOT NULL DEFAULT '0',
  `nick` varchar(45) NOT NULL DEFAULT '',
  `email` varchar(100) NOT NULL DEFAULT '',
  `content` varchar(1000) NOT NULL DEFAULT '',
  `ip` int(10) unsigned NOT NULL DEFAULT '0',
  `pubtime` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`comment_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=30 ;

--
-- 转存表中的数据 `comment`
--

INSERT INTO `comment` (`comment_id`, `art_id`, `user_id`, `nick`, `email`, `content`, `ip`, `pubtime`) VALUES
(22, 7, 0, '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', 'w', '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', 1991935937, 1443712091),
(20, 7, 0, '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', '1', '1', 1991935937, 1443711759),
(21, 7, 0, '2', '2', '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', 1991935937, 1443711792),
(23, 7, 0, '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', 1991935937, 1443712171),
(25, 7, 0, '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', 'a', 'a', 1991935937, 1443713184),
(26, 7, 0, 's', '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', 's', 1991935937, 1443713196),
(27, 7, 0, 'd', 'd', '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', 1991935937, 1443713204),
(28, 6, 0, '好', '好', '好', 3054660632, 1443887006),
(29, 6, 0, 'FED', 'fd', 'F D', 1991935937, 1444451187);

-- --------------------------------------------------------

--
-- 表的结构 `msg`
--

CREATE TABLE IF NOT EXISTS `msg` (
  `msg_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `user_id` int(20) unsigned NOT NULL DEFAULT '0',
  `title` char(50) NOT NULL DEFAULT '',
  `name` char(20) NOT NULL DEFAULT '',
  `content` varchar(200) NOT NULL DEFAULT '',
  `ip` int(10) unsigned NOT NULL DEFAULT '0',
  `pubtime` int(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`msg_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=11 ;

--
-- 转存表中的数据 `msg`
--

INSERT INTO `msg` (`msg_id`, `user_id`, `title`, `name`, `content`, `ip`, `pubtime`) VALUES
(1, 0, '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', '1', '11', 1991935937, 1443711887),
(2, 0, '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', '1', '1', 1991935937, 1443711896),
(3, 0, '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', '1', '3', 1991935937, 1443711905),
(4, 0, '2', '1', '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', 1991935937, 1443711914),
(5, 0, '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', '1', '3', 1991935937, 1443712235),
(6, 0, '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', '1', '55555', 1991935937, 1443712243),
(7, 0, '333', '1', '&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', 1991935937, 1443712254),
(8, 0, 'dfdsfdsf', '1', 'f&lt;script&gt;alert(''fdfd'')&lt;/script&gt;', 1991935937, 1443712265),
(9, 0, 'RER', '2', 'RER', 1991935937, 1444451323);

-- --------------------------------------------------------

--
-- 表的结构 `tag`
--

CREATE TABLE IF NOT EXISTS `tag` (
  `tag_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `art_id` int(10) unsigned NOT NULL DEFAULT '0',
  `tag` char(10) NOT NULL DEFAULT '0',
  PRIMARY KEY (`tag_id`),
  KEY `at` (`art_id`,`tag`),
  KEY `ta` (`tag`,`art_id`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=8 ;

--
-- 转存表中的数据 `tag`
--

INSERT INTO `tag` (`tag_id`, `art_id`, `tag`) VALUES
(1, 0, '北京'),
(2, 0, '景点'),
(3, 0, '北京'),
(4, 0, '景点'),
(5, 0, '天堂'),
(6, 0, 'mv'),
(7, 0, 'Justin Bie');

-- --------------------------------------------------------

--
-- 表的结构 `user`
--

CREATE TABLE IF NOT EXISTS `user` (
  `user_id` int(10) unsigned NOT NULL AUTO_INCREMENT,
  `name` char(20) NOT NULL DEFAULT '',
  `gender` char(10) NOT NULL DEFAULT '',
  `area` char(10) NOT NULL DEFAULT '',
  `email` char(30) NOT NULL DEFAULT '',
  `password` char(32) NOT NULL DEFAULT '',
  `salt` char(15) NOT NULL DEFAULT '',
  `intro` varchar(200) NOT NULL DEFAULT '',
  `lastlogin` int(10) unsigned NOT NULL DEFAULT '0',
  PRIMARY KEY (`user_id`),
  UNIQUE KEY `name` (`name`)
) ENGINE=InnoDB  DEFAULT CHARSET=utf8 AUTO_INCREMENT=12 ;

--
-- 转存表中的数据 `user`
--

INSERT INTO `user` (`user_id`, `name`, `gender`, `area`, `email`, `password`, `salt`, `intro`, `lastlogin`) VALUES
(2, '1', '男', '北京', '1', '2cf28b894ead0c0438aeef4a1b0381fd', 'A4h7G$uc', '1', 1443713170),
(7, '2', '男', '北京', '2', 'c2d6a875f607fdbc952aa5ab644103d8', 'gQ3vtgz7', '2', 1444451176),
(11, 'fengcaiyiyi', '男', '北京', '995360738@qq.om', '695fac66d0a0da88819da17d5ac83f37', 'wEhvzPGu', '', 1444971606);

/*!40101 SET CHARACTER_SET_CLIENT=@OLD_CHARACTER_SET_CLIENT */;
/*!40101 SET CHARACTER_SET_RESULTS=@OLD_CHARACTER_SET_RESULTS */;
/*!40101 SET COLLATION_CONNECTION=@OLD_COLLATION_CONNECTION */;
