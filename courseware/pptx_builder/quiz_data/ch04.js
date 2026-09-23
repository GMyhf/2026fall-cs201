// MOOC 课堂提问：第四章 字符串（取自 homework/DSA_MOOC_solution.md）
const ch4 = {
  label: "Chapter 4", name: "第四章 字符串",
  questions: [
    {
      kind: "单选题", title: "KMP 特征向量 next",
      stem: "求字符串 \"BAAABBBAA\" 的特征向量（next 数组）：",
      options: [
        "{-1, 0, 0, 0, 0, 0, 0, 1, 2}",
        "{-1, 0, 0, 0, 0, 1, 1, 1, 2}",
        "{-1, 0, 0, 0, 0, 0, 1, 1, 2}",
        "{-1, 0, 0, 0, 1, 1, 1, 1, 2}",
      ],
      correct: ["B"], answer: "B",
      notes: [
        "next[i] = P[0..i−1] 最长的相等真前缀、真后缀的长度；next[0] = −1。",
        "i = 1…4：B、BA、BAA、BAAA 没有相等前后缀 → 0",
        "i = 5、6、7：BAAAB、BAAABB、BAAABBB 以 B 结尾，与开头 B 相等 → 1",
        "i = 8：BAAABBBA 以 BA 结尾 → 2",
      ],
    },
    {
      kind: "单选题", title: "串的基本概念",
      stem: "下面关于串的叙述中，哪一个是不正确的？",
      options: [
        "串是字符的有限序列。",
        "模式匹配是串的一种重要运算。",
        "串是一种数据对象和操作都特殊的线性表。",
        "空串是由空格构成的串。",
      ],
      correct: ["D"], answer: "D",
      notes: [
        "空串长度为 0。",
        "由空格组成的串叫空白串（blank string），长度不为 0。",
      ],
    },
    {
      kind: "单选题", title: "串运算组合",
      stem: "S1 = 'ABCDEFG'，S2 = '9898'，S3 = '###'，S4 = '012345'，求下式的值（substr(S, i, j) 从下标 i 起取 j 个字符，下标从 0 开始）：",
      code: "concat(replace(S1, substr(S1, length(S2), length(S3)), S3),\n       substr(S4, index(S2, '8'), length(S2)))",
      options: ["ABC###G0123", "ABCD###2345", "ABCD###1234", "ABC###G2345"],
      correct: ["C"], answer: "C",
      notes: [
        "substr(S1, 4, 3) = 'EFG'",
        "replace(S1, 'EFG', '###') = 'ABCD###'",
        "index(S2, '8') = 1，substr(S4, 1, 4) = '1234'",
        "concat → 'ABCD###1234'",
      ],
    },
    {
      kind: "单选题", title: "串的性质",
      stem: "下列说法正确的是：",
      options: [
        "空串就是空白串。",
        "空串是任意字符串的子串。",
        "串只可以采用顺序存储，不可以采用链式存储。",
        "在 C++ 标准中，`char S[M]` 最多能表示长度为 M 的字符串。",
      ],
      correct: ["B"], answer: "B",
      notes: [
        "A ✗ 空串长度为 0，空白串由空格组成。",
        "C ✗ 串也可以链式存储（如块链）。",
        "D ✗ 末尾要留一个位置放 '\\0'，最多表示长度 M−1 的串。",
      ],
    },
    {
      kind: "单选题", title: "模式匹配",
      stem: "设有两个串 p 和 q，其中 q 是 p 的子串，求 q 在 p 中首次出现的位置的算法称为：",
      options: ["求子串", "联接", "匹配", "求串长"],
      correct: ["C"], answer: "C",
      notes: ["在主串中找模式串首次出现的位置就是模式匹配，如朴素匹配、KMP。"],
    },
    {
      kind: "多选题", title: "互补回文串",
      stem: "DNA 序列由 A、C、G、T 组成，A–T、C–G 互补。若一个串的互补串反转后等于它自身，称为互补回文串（如 ATCATGAT 的互补串 TAGTACTA 反转后即原串）。下列是互补回文串的有：",
      options: ["CTGATCAG", "AATTAATT", "TGCAACGT", "CATGGTAC", "GTACGTAC", "AGCTAGCT"],
      correct: ["A", "B", "E", "F"], answer: "A、B、E、F",
      notes: [
        "做法：先取互补串，再反转，看是否等于原串。",
        "A：CTGATCAG → GACTAGTC → 反转 CTGATCAG ✓",
        "C：TGCAACGT → 反转互补 ACGTTGCA ✗",
        "D：CATGGTAC → 反转互补 GTACCATG ✗",
        "B、E、F 同理成立。",
      ],
    },
    {
      kind: "填空题", title: "KMP 匹配的比较次数",
      stem: "模式 P = \"BAAABBBAA\" 与目标 T = \"BAAABBBCDDDCCHHHHBBBAAABBBAADD\" 进行匹配，至少需要多少次字符比较？（利用优化后的 next 数组）",
      answer: "31",
      notes: [
        "优化后的 nextval = [−1, 0, 0, 0, −1, 1, 1, 0, 0]",
        "失配时 P 右滑到 nextval 所指位置；值为 −1 时 T 的指针前进一位。",
        "在 T 的下标 19 处匹配成功，累计比较 31 次（用未优化的 next 要 32 次）。",
      ],
    },
    {
      kind: "填空题", title: "判断对称串",
      stem: "下列程序判断串 s 是否对称，对称返回 1，否则返回 0。如 f(\"abba\") 返回 1，f(\"abab\") 返回 0。填空（三个答案用空格分隔）：",
      code: "int f(char s[]) {\n    int i=0, j=0;\n    while(s[j]) (1)__++;\n    for(j--; i < j && s[i] == s[j]; i++, j--);\n    return((2)__>=(3)__);\n}",
      answer: "j i j",
      notes: [
        "(1) `j++`：j 走到串尾的 '\\0'",
        "`j--` 后 j 指向最后一个字符，i、j 相向比较。",
        "对称时循环因 i >= j 结束；不对称时因 s[i] != s[j] 提前退出（此时 i < j）。",
        "所以返回 `i >= j`。",
      ],
    },
    {
      kind: "填空题", title: "奇偶位重排",
      stem: "S = \"S1S2…Sn\" 存放在数组中，改造为：奇数位字符按下标从小到大放在前半部分，偶数位字符按下标从大到小放在后半部分。例如 'ABCDEFGHIJKL' 改造后为 'ACEGIKLJHFDB'。则 'algorithm' 改造后为：",
      answer: "agrtmhiol",
      notes: [
        "位置从 1 开始数。",
        "奇数位 a g r t m，按原顺序 → agrtm",
        "偶数位 l o i h，倒序 → hiol",
        "拼起来：agrtm + hiol",
      ],
    },
    {
      kind: "填空题", title: "单表代换加密",
      stem: "利用给定的字母映射表进行加密（映射表见原题）。若 \"encrypt\" 被加密为 \"tkzwsdf\"，则 \"algorithm\" 被加密为：",
      answer: "neopwmfbl",
      notes: [
        "由已知一对可读出：e→t, n→k, c→z, r→w, y→s, p→d, t→f",
        "其余字母查映射表：a→n, l→e, g→o, o→p, i→m, h→b, m→l",
        "algorithm → neopwmfbl（其中 r→w、t→f 与上面一致）",
      ],
    },
    {
      kind: "填空题", title: "串运算表达式",
      stem: "设 A = \"\"，B = \"MULE\"，C = \"OLD\"，D = \"MY\"。计算下列表达式（答案之间用空格隔开）：",
      code: "(1) D + C + B\n(2) B.substr(3, 2)\n(3) A.strlength()",
      answer: "MYOLDMULE E 0",
      notes: [
        "(1) MY + OLD + MULE = MYOLDMULE",
        "(2) 从下标 3 起取 2 个，但 MULE 从下标 3 起只剩 E",
        "(3) 空串长度为 0",
      ],
    },
    {
      kind: "填空题", title: "子串个数（algorithm）",
      stem: "若字符串 s = \"algorithm\"，则其子串个数为：",
      answer: "46",
      notes: [
        "9 个字符两两不同，非空子串 9 + 8 + … + 1 = 9×10/2 = 45 个。",
        "再加上空串：45 + 1 = 46。",
      ],
    },
    {
      kind: "填空题", title: "子串个数（software）",
      stem: "若字符串 s = \"software\"，则其子串个数为：",
      answer: "37",
      notes: ["8 个字符两两不同：8×9/2 + 1 = 37。"],
    },
  ],
};

module.exports = [ch4];
