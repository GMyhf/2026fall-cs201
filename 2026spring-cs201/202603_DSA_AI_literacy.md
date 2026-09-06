# 人工智能

*Updated 2026-06-14 20:51 GMT+8*  
*Compiled by Hongfei Yan (2025 Summer)*    

https://github.com/GMyhf/2025fall-cs201/blob/main/AI_literacy.md



> 2025年秋季数算B的笔试内容与往年不同，因为只有我们一个班，自主出题。内容是构建大语言模型相关。如：附录B 大模型自我检测指南
>
> 2025年秋季计概B的人工智能部分，也是这份讲义，但是笔试考到的可能只有AI三大流派、AI的三要素两个小部分。



人工智能（artificial intelligence, AI）是对程序系统的研究，该程序系统在一定程度上能模仿人类的活动，如感知、思考、学习和反应。

> 人工智能是研究和开发能够执行通常需要人类智能的任务的技术和方法的学科，包括语音识别、图像理解、自然语言处理、机器人等[1] [2]。

早在1950年，艾伦·图灵提出了检验机器智能的“模仿游戏”（即**图灵测试**），检验机器是否能让人分不清其与人类对话的区别。1956年达特茅斯会议（**Dartmouth AI Workshop**）召开，被认为是人工智能领域的创始时刻，约翰·麦卡锡等人首次正式提出“人工智能”这一术语[1]。此后，AI发展经历了多次高潮与低谷，到21世纪依赖于强大的计算资源、海量数据和新算法的**深度学习**技术实现突破，推动AI进入广泛应用阶段。

人工智能（AI）与智能体（Agent）之间的关系可以概括为：“能力与载体”或“大脑与身体”的关系。AI 是智能体用来解决问题的核心技术（大脑），而智能体是将 AI 技术具体化、用于与环境交互的系统（实体）。

- **人工智能 (AI) —— 关注“能力”与“算法”**定义： 是一门学科或技术集合（如深度学习、NLP、计算机视觉）。它关注的是<mark>如何实现</mark>智能，比如如何识别语音、如何理解图像、如何制定策略。角色： 它是“大脑”。它负责处理数据、进行思考、学习和决策。
- **智能体 (Agent) —— 关注“行为”与“交互”定义：** 是一个具有自主性的系统（无论是软件还是硬件）。它关注的是<mark>如何应用</mark>智能去感知环境并完成任务。角色： 它是“实体”。它拥有感知器（眼睛/摄像头/键盘输入）和执行器（手/轮子/屏幕输出/API调用），负责与外界互动。

> **图灵测试**
> 在1950年，阿兰，图灵提出了图灵测试，这个测试提出了机器具有智能的一个定义。该测试的方法是，简单地比较人类的智能行为和计算机的智能行为。一个询问者对计算机和人类都提出一组问题，然后，询问者得到两组答案，但他不知道哪一组是来自人类，哪一组来自计算机。在仔细检查两组答案后，如果询问者不能肯定地说出哪一组来自人类，哪一组来自计算机，那么，计算机就通过了具有智能行为的图灵测试。

> **智能体**
> 智能体是一个能智能地感知环境、从环境中学习并与环境进行交互的系统。智能体可以分成两大类：软件智能体和物理智能体。
>
> **1.软件智能体**
> 软件智能体是一组用来完成特殊任务的程序。例如，有些智能系统能用来整理电子邮件e-mail)，能检查收到的邮件的内容，然后把它们归到不同的类别中(垃圾、不重要、重要非常重要等)。另外一个软件智能体的例子是搜索引擎，它搜索万维网，发现能提供与查询主题相关信息的网址。
>
> **2.物理智能体**
> 物理智能体(机器人)是一个用来完成各项任务的可编程系统。简单的机器人可以用在制造行业，从事一些日常的工作，如装配、焊接或油漆。有些组织使用移动机器人去做一些日常的分发工作，如分发邮件或明信片到不同的房间。移动机器人可以在水下探测石油。人型机器人是一种自治的移动机器人，它模仿人类的行为。虽然人型机器人只在科幻小说中流行，但是要使这种机器人能合理地与周围环境交互并从环境里发生的事件中学习，这里面还有很多工作要做。



# 1. AI三大流派

人工智能的发展思想分为三个主要流派：

- **符号主义（Symbolic AI）**：核心观点是通过符号表示和逻辑推理来实现智能。典型方法包括专家系统、搜索算法、逻辑推理（如一阶逻辑）、规划系统等。代表人物有艾伦·纽厄尔、赫伯特·西蒙、约翰·麦卡锡等。符号主义强调可解释性强，适用于有明确规则的任务（如数学推理、棋类游戏）。其代表成果包括20世纪80年代的专家系统（如DEC公司的XCON系统，显著提高了配置效率）以及IBM的棋类程序**深蓝（Deep Blue）**，1997年击败国际象棋冠军卡斯帕罗夫。但符号主义的缺点是学习能力弱，难以处理模糊信息，需要大量手工编码规则。

  > 虽然人工智能作为一门独立的学科是相对年轻的，但它还是经历了一段发展的时间。可以这样说，当2400年前希腊哲学家亚里多斯德发明了逻辑推理这个概念时，人工智能就开始了，接着莱布尼茨和牛顿完成了逻辑语言的定稿。乔治·布尔在19世纪逐步提出的布尔代数奠定计算机电子电路的基础。

- **连接主义（Connectionism）**：核心观点是通过模拟人脑神经元网络结构来实现智能，依赖数据驱动学习。主要方法是各种人工神经网络（ANN）和深度学习（如卷积神经网络CNN、循环神经网络RNN、Transformer等）。代表人物包括Geoffrey Hinton、Yann LeCun、Ilya Sutskever、David Rumelhart等。约翰·霍普菲尔德（John Hopfield）与Geoffrey Hinton于2024年获得诺贝尔物理学奖，以表彰他们在神经网络领域的奠基性贡献。连接主义流派引领了近年来AI的主要突破（“强数据、弱规则”）。其代表成果包括最早的单层感知机（Perceptron，1958年）以及1986年Rumelhart等人提出的**误差反向传播算法**（Backpropagation），使多层神经网络得以高效训练。现代连接主义系统在图像识别、语音识别、自然语言处理、自动驾驶等领域均取得了巨大成功，例如Google的AlphaGo和各种视觉模型、OpenAI的GPT系列语言模型等[3]。

- **行为主义（Behaviorism）**：在AI领域常指“机器人行动派”或强化学习思想。其核心思想是智能体通过与环境交互并根据反馈（奖惩）自主学习，无需事先假设内部知识结构。代表人物有罗德尼·布鲁克斯（Rodney Brooks）、李开复等。行为主义AI强调“行动优先”，对现代机器人学和强化学习影响深远。典型应用是基于强化学习的系统，如**AlphaGo/AlphaZero**（通过自我博弈学习围棋策略）和自动驾驶等。行为主义流派下的智能体可视为通过试错和环境反馈来优化决策。



# 2. AI的三要素：算法、算力和数据

人工智能的发展依赖于三大要素：**算法**（Algorithm）、**算力**（Compute）和**数据**（Data）。

- **算法（灵魂）**：不同任务类型对应不同算法范式。常见分类包括监督学习（使用标注数据训练模型进行分类或回归）、无监督学习（从无标签数据中挖掘结构，如聚类）、强化学习（使用奖惩机制优化策略）。例如，逻辑回归用于分类（监督学习），KMeans用于聚类（无监督学习）。机器学习和深度学习的算法不断演进，引入了多层神经网络、注意力机制等创新架构。
- **算力（引擎）**：深度学习模型往往需要巨大的计算资源。GPU/TPU等高性能硬件使得训练大规模神经网络成为可能。以PyTorch为例，我们可以简单检测当前硬件环境中GPU或Apple MPS的可用性。
- **数据（燃料）**：训练模型需要大量高质量的数据。监督学习尤其依赖标注数据。例如，李飞飞等人在2006年发起的ImageNet计划收集了数千万张图像，并依托众包标注创造了包含1400万张标注图片的大型数据集，大大推动了计算机视觉算法的发展。与此同时，无标签数据也通过自动记录等方式提供了海量信息，可用于无监督学习。总之，算法、算力与数据三者共同构成AI系统的基础。



# 3. 应用案例和简单示例

- **智能博弈：AlphaGo/AlphaZero**：DeepMind的AlphaGo结合了深度卷积神经网络（CNN）、强化学习和蒙特卡洛树搜索（MCTS），成为首个战胜围棋人类冠军的AI系统。2016年AlphaGo以4:1击败李世石，2017年以3:0战胜柯洁。其强化学习版本AlphaGo Zero无需人类棋谱，从随机对弈中自学，经过数周训练便超越了原版AlphaGo。进一步的AlphaZero甚至能从零开始自学多种棋类（围棋、国际象棋、日本将棋等），展现出超强的策略学习能力。它证明了放弃人类经验、有条件的自我对弈（self-play）学习在某些领域能带来更优解。
- **自然语言处理：Transformer与GPT**：Transformer模型由Google研究者在2017年提出（著名论文*Attention Is All You Need*），其核心是**自注意力机制**，允许模型并行处理序列并捕捉远距离依赖[4]。Transformer架构广泛应用于大规模自然语言处理和其他领域，催生了众多预训练模型如GPT系列和BERT[4]。GPT（Generative Pre-trained Transformer）是OpenAI推出的一类语言模型，采用巨大的Transformer解码器结构进行无监督预训练后再微调。GPT-3于2020年问世，拥有约1750亿参数[2]，能够生成连贯流畅的文本，支持零样本学习（zero-shot）和少样本学习（few-shot），在翻译、对话、写作等任务中表现优异。**GPT-4**（2023年发布）在GPT-3.5基础上进一步扩展规模和能力，是一个支持文本和图像输入的**多模态大模型**[5] [3]。GPT-4在包括模拟律师资格考试（bar exam）在内的多项专业测试中表现出类人水平（成绩在前10%）[3]。与前代模型相比，GPT-4更加可靠、富有创造力，能够处理更复杂、更长的指令[5]。GPT系列模型被广泛应用于对话机器人、内容生成、编程辅助、教育辅导等场景。



## 3.1 示例 2048 游戏

​	选择2048游戏作为教学案例。2048 游戏是 2014 年由 Gabriele Cirulli 推出的单人数字游戏。设计 2048 AI 的算法思路与技巧在游戏算法设计中很具有代表性，且 2048 游戏规则简单，在探索解法的过程中充满趣味性，是一个非常适合作为计算机科学方面相关教学的益智游戏 。本节以问题求解为导向，以流行的单人数字游戏 2048 的 AI 算法设计问题为主线，试图在剖析问题、提出思路、拓展延伸等完整的问题求解过程中激发学习者能动性，使学习者对游戏 AI 算法的设计思路和常见算法达到较高的认知水平。

​	2048 游戏界面如图5-23所示，玩家需要在 $4\times4$ 的数字方格矩阵中做上、下、左、右四个方向之一的滑动操作。每次滑动操作会使得所有方块全部沿着某个方向滑动直至被边界或其他方块阻挡。当两个数字方格中的数字相同，且滑动后两方格相邻，则这两个数字方格会被合并为一个方格，其数字为原来两方块之和，如图5-24所示。执行上滑操作后，最左列的两个 2 合并为 4，并上移至第二行；左数第三列的上方两个相邻 8 合并为 16 并上移；最右一行的上下两对相邻的 2 均合并为 4，并上移至第1和第 2 行，这一列值得注意的是，该次操作合并过的两个方块 4 并不会继续合并。每次滑动操作后，系统随机在一个没有数字的方格中按照分别 90%、10% 的概率随机生成 2 或 4 两种之一的数字方格。游戏的初始局面为在空棋盘上按上述规则随机生成两个方块后的棋盘。游戏目标是产生数字尽可能大的方块。为便于之后测试算法效率，本书设计的 2048 游戏任务无方块数字的上限，达到 2048 后游戏仍然继续，当且仅当局面无法进行任何滑动操作时游戏结束。



<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20230109211246988.png" alt="image-20230109211246988" style="zoom: 33%;" />

<center>图 2048 游戏初始界面</center>



<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20230109211322682.png" alt="image-20230109211322682" style="zoom:33%;" />

<center>图 一次向上滑动示意图，右图左下侧的2为系统生成的新方块</center>



​	2048 游戏规则的具体实现有一个易错之处：在同行或者同列中进行某方向的滑动时，这行或这列中的方块从前往后（记滑动方向的一侧为前）依次向前合并，且此次操作已经合并过的方块不能再次合并。与游戏相关的题目，包括2048的游戏规则模拟（http://cs101.openjudge.cn/practice/20052/），和一个需要深入挖掘2048规则性质的动态规划问题（http://codeforces.com/problemset/problem/413/D），帮助学生深入理解游戏规则。在线体验 2048 游戏的网页有： https://play2048.co/ ，https://2048game.com 。



### 1. game_2048.py

请帮我写一个python程序，就是在Mac terminal中可以运行的 2048 游戏，可以没有GUI。

目标设为 2048，但在达到 2048 后不会自动结束，你可以继续游戏争取更高的数字：



<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20250219221003001.png" alt="image-20250219221003001" style="zoom:50%;" />



```python
#!/usr/bin/env python3
import random
import os
import sys

BOARD_SIZE = 4
TARGET = 2048

def init_board():
    board = [[0] * BOARD_SIZE for _ in range(BOARD_SIZE)]
    add_random_tile(board)
    add_random_tile(board)
    return board

def add_random_tile(board):
    empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
    if not empty:
        return
    i, j = random.choice(empty)
    board[i][j] = 4 if random.random() < 0.1 else 2

def print_board(board):
    os.system('clear')  # 清屏
    print("-" * (BOARD_SIZE * 7 + 1))
    for row in board:
        print("|", end="")
        for num in row:
            if num == 0:
                print("      |", end="")
            else:
                print(f"{num:^6}|", end="")
        print()
        print("-" * (BOARD_SIZE * 7 + 1))

def slide_and_merge(line):
    new_line = [num for num in line if num != 0]
    merged_line = []
    skip = False
    for i in range(len(new_line)):
        if skip:
            skip = False
            continue
        if i + 1 < len(new_line) and new_line[i] == new_line[i + 1]:
            merged_line.append(new_line[i] * 2)
            skip = True
        else:
            merged_line.append(new_line[i])
    merged_line += [0] * (BOARD_SIZE - len(merged_line))
    return merged_line

def move_left(board):
    return [slide_and_merge(row) for row in board]

def reverse(board):
    return [list(reversed(row)) for row in board]

def transpose(board):
    return [list(row) for row in zip(*board)]

def move_right(board):
    return reverse(move_left(reverse(board)))

def move_up(board):
    transposed = transpose(board)
    moved = move_left(transposed)
    return transpose(moved)

def move_down(board):
    transposed = transpose(board)
    moved = move_right(transposed)
    return transpose(moved)

def boards_equal(b1, b2):
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if b1[i][j] != b2[i][j]:
                return False
    return True

def can_move(board):
    for row in board:
        if 0 in row:
            return True
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if j + 1 < BOARD_SIZE and board[i][j] == board[i][j + 1]:
                return True
            if i + 1 < BOARD_SIZE and board[i][j] == board[i + 1][j]:
                return True
    return False

def reached_target(board):
    for row in board:
        if any(num >= TARGET for num in row):
            return True
    return False

def main():
    board = init_board()
    has_printed_win = False  # 避免重复打印获胜消息
    print_board(board)
    while True:
        move = input("请输入移动方向 (w/a/s/d)，或 q 退出：").lower().strip()
        if move not in ['w', 'a', 's', 'd', 'q']:
            continue
        if move == 'q':
            print("退出游戏。")
            sys.exit(0)

        if move == 'w':
            new_board = move_up(board)
        elif move == 'a':
            new_board = move_left(board)
        elif move == 's':
            new_board = move_down(board)
        elif move == 'd':
            new_board = move_right(board)

        if not boards_equal(board, new_board):
            board = new_board
            add_random_tile(board)
        else:
            print("无效移动！")
        print_board(board)

        if reached_target(board) and not has_printed_win:
            print("恭喜你达到了 2048！当然，如果能合成更大的数字就更好！")
            has_printed_win = True

        if not can_move(board):
            print("游戏结束，无法移动！")
            break

if __name__ == "__main__":
    main()
```

**使用说明**

1. 将代码保存为文件（例如 `game_2048.py`）。
2. 在终端中执行 `chmod +x game_2048.py` 给予执行权限。
3. 运行 `./game_2048.py` 启动游戏。

游戏中输入 `w/a/s/d` 分别控制上、左、下、右移动，输入 `q` 退出。达到 2048 后会显示提示，但你仍可继续游戏，挑战更高的分数。



### 2. auto_2048.py

帮我做一个升级版本，就是自动演示上下左右移动的2048游戏



下面是一份自动演示版 2048 游戏的 Python 代码，运行时会自动随机选择上、下、左、右移动，并在终端中展示移动过程。你可以直接在 Mac Terminal 中运行该脚本：

```python
#!/usr/bin/env python3
import random
import os
import sys
import time

BOARD_SIZE = 4
TARGET = 2048

def init_board():
    board = [[0] * BOARD_SIZE for _ in range(BOARD_SIZE)]
    add_random_tile(board)
    add_random_tile(board)
    return board

def add_random_tile(board):
    empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
    if not empty:
        return
    i, j = random.choice(empty)
    # 以 10% 的概率生成 4，其余生成 2
    board[i][j] = 4 if random.random() < 0.1 else 2

def print_board(board):
    os.system('clear')  # 清屏
    print("-" * (BOARD_SIZE * 7 + 1))
    for row in board:
        print("|", end="")
        for num in row:
            if num == 0:
                print("      |", end="")
            else:
                print(f"{num:^6}|", end="")
        print()
        print("-" * (BOARD_SIZE * 7 + 1))

def slide_and_merge(line):
    # 去除所有零值
    new_line = [num for num in line if num != 0]
    merged_line = []
    skip = False
    for i in range(len(new_line)):
        if skip:
            skip = False
            continue
        # 若相邻数字相等，则合并
        if i + 1 < len(new_line) and new_line[i] == new_line[i + 1]:
            merged_line.append(new_line[i] * 2)
            skip = True
        else:
            merged_line.append(new_line[i])
    # 补0使长度固定
    merged_line += [0] * (BOARD_SIZE - len(merged_line))
    return merged_line

def move_left(board):
    new_board = []
    for row in board:
        new_board.append(slide_and_merge(row))
    return new_board

def reverse(board):
    return [list(reversed(row)) for row in board]

def transpose(board):
    return [list(row) for row in zip(*board)]

def move_right(board):
    return reverse(move_left(reverse(board)))

def move_up(board):
    transposed = transpose(board)
    moved = move_left(transposed)
    return transpose(moved)

def move_down(board):
    transposed = transpose(board)
    moved = move_right(transposed)
    return transpose(moved)

def boards_equal(b1, b2):
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if b1[i][j] != b2[i][j]:
                return False
    return True

def can_move(board):
    # 若有空格则肯定能移动
    for row in board:
        if 0 in row:
            return True
    # 检查水平和垂直是否有可合并的数字
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if j + 1 < BOARD_SIZE and board[i][j] == board[i][j + 1]:
                return True
            if i + 1 < BOARD_SIZE and board[i][j] == board[i + 1][j]:
                return True
    return False

def reached_target(board):
    for row in board:
        if any(num >= TARGET for num in row):
            return True
    return False

def main():
    board = init_board()
    has_printed_win = False  # 避免重复打印获胜消息
    print_board(board)
    while True:
        if not can_move(board):
            print("游戏结束，无法移动！")
            break

        # 自动随机选择一个方向
        move = random.choice(['w', 'a', 's', 'd'])
        print(f"自动移动：{move}")
        if move == 'w':
            new_board = move_up(board)
        elif move == 'a':
            new_board = move_left(board)
        elif move == 's':
            new_board = move_down(board)
        elif move == 'd':
            new_board = move_right(board)

        if not boards_equal(board, new_board):
            board = new_board
            add_random_tile(board)
        else:
            print("无效移动，尝试其他方向。")

        print_board(board)
        if reached_target(board) and not has_printed_win:
            print("已达到 2048！继续自动移动以获得更高分数。")
            has_printed_win = True

        time.sleep(0.01)  # 延时0.5秒，便于观察演示效果

if __name__ == "__main__":
    main()
```

---

**使用说明**

1. 将上述代码保存为文件（例如 `auto_2048.py`）。
2. 在终端中运行命令 `chmod +x auto_2048.py` 赋予执行权限。
3. 运行 `./auto_2048.py` 启动自动演示。

程序将自动随机选择上、下、左、右方向进行移动，并以 0.5 秒的间隔更新显示。你可以通过修改 `time.sleep` 的延时参数来调整演示速度。





### 3. auto_2048_intelligent.py

能智能些吗？刚运行auto_2048，才累积到128，就游戏结束无法移动了。



下面是一份升级版自动演示 2048 游戏代码，加入了简单的启发式策略。程序会对四个方向的移动进行模拟，<mark>选择能使空格最多的那一步，从而尽量延长游戏时间，避免早期卡死</mark>。你可以直接在 Mac Terminal 下运行该脚本：

```python
#!/usr/bin/env python3
import random
import os
import sys
import time

BOARD_SIZE = 4
TARGET = 2048

def init_board():
    board = [[0] * BOARD_SIZE for _ in range(BOARD_SIZE)]
    add_random_tile(board)
    add_random_tile(board)
    return board

def add_random_tile(board):
    empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
    if not empty:
        return
    i, j = random.choice(empty)
    board[i][j] = 4 if random.random() < 0.1 else 2

def print_board(board):
    os.system('clear')  # 清屏
    print("-" * (BOARD_SIZE * 7 + 1))
    for row in board:
        print("|", end="")
        for num in row:
            if num == 0:
                print("      |", end="")
            else:
                print(f"{num:^6}|", end="")
        print()
        print("-" * (BOARD_SIZE * 7 + 1))

def slide_and_merge(line):
    new_line = [num for num in line if num != 0]
    merged_line = []
    skip = False
    for i in range(len(new_line)):
        if skip:
            skip = False
            continue
        if i + 1 < len(new_line) and new_line[i] == new_line[i + 1]:
            merged_line.append(new_line[i] * 2)
            skip = True
        else:
            merged_line.append(new_line[i])
    merged_line += [0] * (BOARD_SIZE - len(merged_line))
    return merged_line

def move_left(board):
    return [slide_and_merge(row) for row in board]

def reverse(board):
    return [list(reversed(row)) for row in board]

def transpose(board):
    return [list(row) for row in zip(*board)]

def move_right(board):
    return reverse(move_left(reverse(board)))

def move_up(board):
    transposed = transpose(board)
    moved = move_left(transposed)
    return transpose(moved)

def move_down(board):
    transposed = transpose(board)
    moved = move_right(transposed)
    return transpose(moved)

def boards_equal(b1, b2):
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if b1[i][j] != b2[i][j]:
                return False
    return True

def can_move(board):
    for row in board:
        if 0 in row:
            return True
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if j + 1 < BOARD_SIZE and board[i][j] == board[i][j + 1]:
                return True
            if i + 1 < BOARD_SIZE and board[i][j] == board[i + 1][j]:
                return True
    return False

def reached_target(board):
    for row in board:
        if any(num >= TARGET for num in row):
            return True
    return False

def count_empty(board):
    return sum(row.count(0) for row in board)

def choose_best_move(board):
    moves = {
        'w': move_up,
        'a': move_left,
        's': move_down,
        'd': move_right
    }
    best_move = None
    best_score = -1
    best_new_board = None
    for move, func in moves.items():
        new_board = func(board)
        if boards_equal(board, new_board):
            continue
        score = count_empty(new_board)
        if score > best_score:
            best_score = score
            best_move = move
            best_new_board = new_board
    return best_move, best_new_board

def main():
    board = init_board()
    has_printed_win = False
    print_board(board)
    while True:
        if not can_move(board):
            print("游戏结束，无法移动！")
            break

        move, new_board = choose_best_move(board)
        if move is None:
            print("没有有效移动，游戏结束！")
            break

        print(f"自动移动：{move}")
        board = new_board
        add_random_tile(board)
        print_board(board)

        if reached_target(board) and not has_printed_win:
            print("已达到 2048！继续自动移动以获得更高分数。")
            has_printed_win = True

        time.sleep(0.01)

if __name__ == "__main__":
    main()
```

---

使用说明

1. 将上述代码保存为文件（例如 `auto_2048_intelligent.py`）。
2. 在终端中执行 `chmod +x auto_2048_intelligent.py` 赋予执行权限。
3. 运行 `./auto_2048_intelligent.py` 启动自动演示。

程序会自动选择四个方向中使空格最多的移动方向，尽量保持棋盘宽松，帮助你累积到更高的分数。你也可以调整 `time.sleep` 延时参数来观察移动过程。



### 4. auto_2048_ai.py

还是不够智能，到128就结束了



下面是一份升级版自动演示 2048 游戏代码，<mark>采用了简单的“1 层期望搜索（expectimax）”策略和启发式评估函数</mark>，从而尽可能选择对局面更有利的移动。该代码在模拟每个可能移动后，对随机新增块进行平均评估，然后选择评分最高的移动方向，从而延长游戏时间，争取更高分数：

```python
#!/usr/bin/env python3
import random
import os
import sys
import time
import copy

BOARD_SIZE = 4
TARGET = 2048

def init_board():
    board = [[0] * BOARD_SIZE for _ in range(BOARD_SIZE)]
    add_random_tile(board)
    add_random_tile(board)
    return board

def add_random_tile(board):
    empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
    if not empty:
        return
    i, j = random.choice(empty)
    board[i][j] = 4 if random.random() < 0.1 else 2

def print_board(board):
    os.system('clear')  # Mac/Linux 下清屏
    print("-" * (BOARD_SIZE * 7 + 1))
    for row in board:
        print("|", end="")
        for num in row:
            if num == 0:
                print("      |", end="")
            else:
                print(f"{num:^6}|", end="")
        print()
        print("-" * (BOARD_SIZE * 7 + 1))

def slide_and_merge(line):
    # 去除0值
    new_line = [num for num in line if num != 0]
    merged_line = []
    skip = False
    for i in range(len(new_line)):
        if skip:
            skip = False
            continue
        if i + 1 < len(new_line) and new_line[i] == new_line[i+1]:
            merged_line.append(new_line[i] * 2)
            skip = True
        else:
            merged_line.append(new_line[i])
    merged_line += [0] * (BOARD_SIZE - len(merged_line))
    return merged_line

def move_left(board):
    return [slide_and_merge(row) for row in board]

def reverse(board):
    return [list(reversed(row)) for row in board]

def transpose(board):
    return [list(row) for row in zip(*board)]

def move_right(board):
    return reverse(move_left(reverse(board)))

def move_up(board):
    transposed = transpose(board)
    moved = move_left(transposed)
    return transpose(moved)

def move_down(board):
    transposed = transpose(board)
    moved = move_right(transposed)
    return transpose(moved)

def boards_equal(b1, b2):
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if b1[i][j] != b2[i][j]:
                return False
    return True

def can_move(board):
    for row in board:
        if 0 in row:
            return True
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if j+1 < BOARD_SIZE and board[i][j] == board[i][j+1]:
                return True
            if i+1 < BOARD_SIZE and board[i][j] == board[i+1][j]:
                return True
    return False

def reached_target(board):
    for row in board:
        if any(num >= TARGET for num in row):
            return True
    return False

def count_empty(board):
    return sum(row.count(0) for row in board)

def evaluate_board(board):
    """
    一个简单的评估函数，综合考虑：
    1. 空格数：空格越多越好（乘以较大权重）
    2. 最大数字是否在角落：在角落奖励
    3. 行列单调性：如果整行或整列是单调的，给予一定奖励
    """
    score = count_empty(board) * 100

    max_tile = max(max(row) for row in board)
    # 如果最大数字在角落，则奖励
    corners = [board[0][0], board[0][BOARD_SIZE-1], board[BOARD_SIZE-1][0], board[BOARD_SIZE-1][BOARD_SIZE-1]]
    if max_tile in corners:
        score += max_tile * 10

    # 行单调性奖励
    for row in board:
        if all(row[i] >= row[i+1] for i in range(len(row)-1)) or all(row[i] <= row[i+1] for i in range(len(row)-1)):
            score += sum(row) * 0.1
    # 列单调性奖励
    for col in zip(*board):
        if all(col[i] >= col[i+1] for i in range(len(col)-1)) or all(col[i] <= col[i+1] for i in range(len(col)-1)):
            score += sum(col) * 0.1

    return score

def expectimax_value(board):
    """
    1层期望搜索：
    对当前局面，模拟在每个空格上随机生成2（概率0.9）或4（概率0.1），
    返回平均评估得分。
    """
    empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
    if not empty:
        return evaluate_board(board)
    total = 0
    for (i, j) in empty:
        board2 = copy.deepcopy(board)
        board2[i][j] = 2
        score2 = evaluate_board(board2)
        board4 = copy.deepcopy(board)
        board4[i][j] = 4
        score4 = evaluate_board(board4)
        total += 0.9 * score2 + 0.1 * score4
    return total / len(empty)

def choose_best_move(board):
    moves = {
        'w': move_up,
        'a': move_left,
        's': move_down,
        'd': move_right
    }
    best_move = None
    best_score = -float('inf')
    best_new_board = None
    for move, func in moves.items():
        new_board = func(board)
        if boards_equal(board, new_board):
            continue
        # 使用1层期望搜索的评估
        score = expectimax_value(new_board)
        if score > best_score:
            best_score = score
            best_move = move
            best_new_board = new_board
    return best_move, best_new_board

def main():
    board = init_board()
    has_printed_win = False
    print_board(board)
    while True:
        if not can_move(board):
            print("游戏结束，无法移动！")
            break

        move, new_board = choose_best_move(board)
        if move is None:
            print("没有有效移动，游戏结束！")
            break

        print(f"自动移动：{move}")
        board = new_board
        add_random_tile(board)
        print_board(board)

        if reached_target(board) and not has_printed_win:
            print("已达到 2048！继续自动移动以获得更高分数。")
            has_printed_win = True

        time.sleep(0.01)

if __name__ == "__main__":
    main()
```

---

**使用说明**

1. 将上述代码保存为文件（例如 `auto_2048_ai.py`）。
2. 在终端中执行 `chmod +x auto_2048_ai.py` 赋予执行权限。
3. 运行 `./auto_2048_ai.py` 启动自动演示。

此版本采用了简单的启发式评估和1层期望搜索：  
• 每个可能的移动后，程序会模拟在所有空位上新增数字（2 和 4）后计算平均评估分数；  
• 评估函数综合考虑了空格数量、最大数字是否处于角落以及行列的单调性。  

这样有助于程序选择更加“智能”的移动方向，争取获得更高的分数而不是早早卡死。  
请根据需要调整权重和延时（time.sleep）参数以获得最佳效果。





### 5.auto_2048_expectimax.py

还是不够智能，到256就结束了



下面这份代码<mark>使用了多层（深度 3）期望搜索（expectimax），并在评估函数中加入了角落权重、空格奖励以及行列单调性奖励</mark>，以期使 AI 在选择移动时更“聪明”，尽量避免早期卡死。请注意，由于搜索深度增加，运行速度可能会变慢一些，但通常能在 4×4 棋盘上接受。

```python
#!/usr/bin/env python3
import random
import os
import sys
import time
import copy

BOARD_SIZE = 4
TARGET = 2048
SEARCH_DEPTH = 3  # 增加搜索深度

def init_board():
    board = [[0] * BOARD_SIZE for _ in range(BOARD_SIZE)]
    add_random_tile(board)
    add_random_tile(board)
    return board

def add_random_tile(board):
    empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
    if not empty:
        return
    i, j = random.choice(empty)
    board[i][j] = 4 if random.random() < 0.1 else 2

def print_board(board):
    os.system('clear')  # Mac/Linux 下清屏
    print("-" * (BOARD_SIZE * 7 + 1))
    for row in board:
        print("|", end="")
        for num in row:
            if num == 0:
                print("      |", end="")
            else:
                print(f"{num:^6}|", end="")
        print()
        print("-" * (BOARD_SIZE * 7 + 1))

def slide_and_merge(line):
    new_line = [num for num in line if num != 0]
    merged_line = []
    skip = False
    for i in range(len(new_line)):
        if skip:
            skip = False
            continue
        if i + 1 < len(new_line) and new_line[i] == new_line[i + 1]:
            merged_line.append(new_line[i] * 2)
            skip = True
        else:
            merged_line.append(new_line[i])
    merged_line += [0] * (BOARD_SIZE - len(merged_line))
    return merged_line

def move_left(board):
    return [slide_and_merge(row) for row in board]

def reverse(board):
    return [list(reversed(row)) for row in board]

def transpose(board):
    return [list(row) for row in zip(*board)]

def move_right(board):
    return reverse(move_left(reverse(board)))

def move_up(board):
    return transpose(move_left(transpose(board)))

def move_down(board):
    return transpose(move_right(transpose(board)))

def boards_equal(b1, b2):
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if b1[i][j] != b2[i][j]:
                return False
    return True

def can_move(board):
    for row in board:
        if 0 in row:
            return True
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if j + 1 < BOARD_SIZE and board[i][j] == board[i][j + 1]:
                return True
            if i + 1 < BOARD_SIZE and board[i][j] == board[i + 1][j]:
                return True
    return False

def reached_target(board):
    for row in board:
        if any(num >= TARGET for num in row):
            return True
    return False

def evaluate_board(board):
    score = 0
    # 奖励空格
    empty = sum(row.count(0) for row in board)
    score += empty * 100

    # 使用一个预设的权重矩阵，鼓励最大值位于角落（这里采用蛇形布局）
    weights = [
        [65536, 32768, 16384, 8192],
        [512,   1024,  2048,  4096],
        [256,    512,  1024,  2048],
        [128,    256,   512,  1024]
    ]
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            score += board[i][j] * weights[i][j]

    # 奖励行单调性
    for row in board:
        if all(row[i] >= row[i+1] for i in range(len(row)-1)) or all(row[i] <= row[i+1] for i in range(len(row)-1)):
            score += sum(row)
    # 奖励列单调性
    for col in zip(*board):
        if all(col[i] >= col[i+1] for i in range(len(col)-1)) or all(col[i] <= col[i+1] for i in range(len(col)-1)):
            score += sum(col)

    return score

def expectimax(board, depth, is_player):
    if depth == 0 or not can_move(board):
        return evaluate_board(board)
    if is_player:
        best = -float('inf')
        # 玩家节点：尝试所有四个方向
        for move_func in [move_up, move_down, move_left, move_right]:
            new_board = move_func(board)
            if boards_equal(board, new_board):
                continue
            value = expectimax(new_board, depth, False)
            best = max(best, value)
        return best if best != -float('inf') else evaluate_board(board)
    else:
        # 概率节点：模拟在所有空格上随机出现 2 或 4
        empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
        if not empty:
            return evaluate_board(board)
        total = 0.0
        for (i, j) in empty:
            for tile, prob in [(2, 0.9), (4, 0.1)]:
                new_board = copy.deepcopy(board)
                new_board[i][j] = tile
                total += prob * expectimax(new_board, depth - 1, True)
        return total / len(empty)

def choose_best_move(board):
    moves = {
        'w': move_up,
        'a': move_left,
        's': move_down,
        'd': move_right
    }
    best_move = None
    best_score = -float('inf')
    best_new_board = None
    for move, func in moves.items():
        new_board = func(board)
        if boards_equal(board, new_board):
            continue
        # 此处使用多层期望搜索，后续节点为概率节点
        score = expectimax(new_board, SEARCH_DEPTH, False)
        if score > best_score:
            best_score = score
            best_move = move
            best_new_board = new_board
    return best_move, best_new_board

def main():
    board = init_board()
    has_printed_win = False
    print_board(board)
    while True:
        if not can_move(board):
            print("游戏结束，无法移动！")
            break

        move, new_board = choose_best_move(board)
        if move is None:
            print("没有有效移动，游戏结束！")
            break

        print(f"自动移动：{move}")
        board = new_board
        add_random_tile(board)
        print_board(board)

        if reached_target(board) and not has_printed_win:
            print("已达到 2048！继续自动移动以获得更高分数。")
            has_printed_win = True

        time.sleep(0.01)

if __name__ == "__main__":
    main()
```

---

**使用说明**

1. 将上述代码保存为文件（例如 `auto_2048_expectimax.py`）。
2. 在终端中运行命令 `chmod +x auto_2048_expectimax.py` 赋予执行权限。
3. 运行 `./auto_2048_expectimax.py` 启动自动演示。

此版本在玩家决策节点中采用了 3 层期望搜索，在概率节点上模拟所有可能的随机新增块，并结合改进的评估函数，以期延长游戏时间、尽量避免早期陷入死局。你可以根据需要调整 SEARCH_DEPTH、权重矩阵或延时参数（time.sleep）以获得更佳效果。







### 6.auto_2048_optimized.py

运行太慢了，能优化吗？并且能取得2048结果或者更高



下面是经过优化后的版本，主要做了以下改进：

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20250219230024196.png" alt="image-20250219230024196" style="zoom:50%;" />



• 用局部函数替换 copy.deepcopy，改用 [row[:] for row in board] 进行浅拷贝  
• 增加了缓存（转置表）来保存 expectimax 计算结果，避免重复搜索，从而提升搜索速度  
• 保持 SEARCH_DEPTH 为 3（可根据性能和效果调整）

该版本<mark>在 4×4 棋盘上运行速度有较大提升，并能更智能地选择移动</mark>，从而有望达到 2048 甚至更高分数。

```python
#!/usr/bin/env python3
import random
import os
import sys
import time

BOARD_SIZE = 4
TARGET = 2048
SEARCH_DEPTH = 3  # 搜索深度

# 缓存 expectimax 计算结果
cache = {}

def board_to_key(board):
    return tuple(tuple(row) for row in board)

def init_board():
    board = [[0] * BOARD_SIZE for _ in range(BOARD_SIZE)]
    add_random_tile(board)
    add_random_tile(board)
    return board

def add_random_tile(board):
    empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
    if not empty:
        return
    i, j = random.choice(empty)
    board[i][j] = 4 if random.random() < 0.1 else 2

def print_board(board):
    os.system('clear')
    print("-" * (BOARD_SIZE * 7 + 1))
    for row in board:
        print("|", end="")
        for num in row:
            if num == 0:
                print("      |", end="")
            else:
                print(f"{num:^6}|", end="")
        print()
        print("-" * (BOARD_SIZE * 7 + 1))

def slide_and_merge(line):
    new_line = [num for num in line if num != 0]
    merged_line = []
    skip = False
    for i in range(len(new_line)):
        if skip:
            skip = False
            continue
        if i + 1 < len(new_line) and new_line[i] == new_line[i+1]:
            merged_line.append(new_line[i] * 2)
            skip = True
        else:
            merged_line.append(new_line[i])
    merged_line += [0] * (BOARD_SIZE - len(merged_line))
    return merged_line

def move_left(board):
    return [slide_and_merge(row) for row in board]

def reverse(board):
    return [list(reversed(row)) for row in board]

def transpose(board):
    return [list(row) for row in zip(*board)]

def move_right(board):
    return reverse(move_left(reverse(board)))

def move_up(board):
    return transpose(move_left(transpose(board)))

def move_down(board):
    return transpose(move_right(transpose(board)))

def boards_equal(b1, b2):
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if b1[i][j] != b2[i][j]:
                return False
    return True

def can_move(board):
    for row in board:
        if 0 in row:
            return True
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if j + 1 < BOARD_SIZE and board[i][j] == board[i][j+1]:
                return True
            if i + 1 < BOARD_SIZE and board[i][j] == board[i+1][j]:
                return True
    return False

def reached_target(board):
    for row in board:
        if any(num >= TARGET for num in row):
            return True
    return False

def count_empty(board):
    return sum(row.count(0) for row in board)

def evaluate_board(board):
    score = 0
    # 奖励空格
    empty = count_empty(board)
    score += empty * 100

    # 权重矩阵（蛇形布局），鼓励最大数字位于角落
    weights = [
        [65536, 32768, 16384, 8192],
        [512,   1024,  2048,  4096],
        [256,    512,  1024,  2048],
        [128,    256,   512,  1024]
    ]
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            score += board[i][j] * weights[i][j]

    # 奖励行单调性
    for row in board:
        if all(row[i] >= row[i+1] for i in range(len(row)-1)) or all(row[i] <= row[i+1] for i in range(len(row)-1)):
            score += sum(row)
    # 奖励列单调性
    for col in zip(*board):
        if all(col[i] >= col[i+1] for i in range(len(col)-1)) or all(col[i] <= col[i+1] for i in range(len(col)-1)):
            score += sum(col)
    return score

def expectimax(board, depth, is_player):
    key = (board_to_key(board), depth, is_player)
    if key in cache:
        return cache[key]
    if depth == 0 or not can_move(board):
        val = evaluate_board(board)
        cache[key] = val
        return val
    if is_player:
        best = -float('inf')
        for move_func in [move_up, move_down, move_left, move_right]:
            new_board = move_func(board)
            if boards_equal(board, new_board):
                continue
            val = expectimax(new_board, depth, False)
            best = max(best, val)
        result = best if best != -float('inf') else evaluate_board(board)
    else:
        empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
        if not empty:
            result = evaluate_board(board)
        else:
            total = 0.0
            for (i, j) in empty:
                for tile, prob in [(2, 0.9), (4, 0.1)]:
                    board_copy = [row[:] for row in board]
                    board_copy[i][j] = tile
                    total += prob * expectimax(board_copy, depth - 1, True)
            result = total / len(empty)
    cache[key] = result
    return result

def choose_best_move(board):
    moves = {
        'w': move_up,
        'a': move_left,
        's': move_down,
        'd': move_right
    }
    best_move = None
    best_score = -float('inf')
    best_new_board = None
    for move, func in moves.items():
        new_board = func(board)
        if boards_equal(board, new_board):
            continue
        score = expectimax(new_board, SEARCH_DEPTH, False)
        if score > best_score:
            best_score = score
            best_move = move
            best_new_board = new_board
    return best_move, best_new_board

def main():
    board = init_board()
    has_printed_win = False
    print_board(board)
    while True:
        if not can_move(board):
            print("游戏结束，无法移动！")
            break

        move, new_board = choose_best_move(board)
        if move is None:
            print("没有有效移动，游戏结束！")
            break

        print(f"自动移动：{move}")
        board = new_board
        add_random_tile(board)
        print_board(board)

        if reached_target(board) and not has_printed_win:
            print("已达到 2048！继续自动移动以获得更高分数。")
            has_printed_win = True

        time.sleep(0.01)

if __name__ == "__main__":
    main()
```

---

使用说明

1. 将上述代码保存为文件（例如 `auto_2048_optimized.py`）。  
2. 在终端中运行 `chmod +x auto_2048_optimized.py` 赋予执行权限。  
3. 运行 `./auto_2048_optimized.py` 启动自动演示。

通过缓存和改进的拷贝方式，此版本在保证一定搜索深度的前提下速度有明显提升。希望这版能够更稳定地达到 2048 或更高分数，同时运行速度更快。





### 7. auto_2048_optimized4.py

并不能总是得到大于等于2048，还有优化方法吗?



✅ **修正点解析：**

1. LRU缓存机制：
   - 用 `functools.lru_cache` 替代手动维护的字典缓存。
   - 设定了最大缓存大小 `MAX_CACHE_SIZE`，控制缓存不会无限增长，避免内存无限膨胀导致的 Out of memory 问题。
2. 哈希键和反序列化：
   - `board_to_key()` 将棋盘转为不可变的 `tuple` 格式用于哈希。
   - `key_to_board()` 则反序列化，用于从缓存提取结果后恢复棋盘状态。

> 💡 **额外优化建议：**
>
> 1. 动态调整缓存大小：
>
>    可以基于机器的可用内存动态调整`MAX_CACHE_SIZE`：
>
>    ```python
>    import psutil
>    
>    mem = psutil.virtual_memory()
>    MAX_CACHE_SIZE = min(100000, mem.available // (1024 * 1024 * 10))  # 10MB per cache entry
>    ```
>
> 2. 监控缓存命中率：
>
>    如果想要调试缓存效果，可以加入缓存命中率监控：
>
>    ```python
>    print(f"Cache info: {expectimax_cached.cache_info()}")
>    ```
>
>
>    ```
> Cache info: CacheInfo(hits=2732535, misses=5037289, maxsize=40960000, currsize=5037284)
> Cache info: CacheInfo(hits=2732535, misses=5037290, maxsize=40960000, currsize=5037285)
> Cache info: CacheInfo(hits=2732535, misses=5037291, maxsize=40960000, currsize=5037286)
> Cache info: CacheInfo(hits=2732535, misses=5037292, maxsize=40960000, currsize=5037287)
> Cache info: CacheInfo(hits=2732535, misses=5037293, maxsize=40960000, currsize=5037288)
> Cache info: CacheInfo(hits=2732535, misses=5037294, maxsize=40960000, currsize=5037289)
> Cache info: CacheInfo(hits=2732535, misses=5037295, maxsize=40960000, currsize=5037291)
> Cache info: CacheInfo(hits=2732535, misses=5037296, maxsize=40960000, currsize=5037291)
> Cache info: CacheInfo(hits=2732535, misses=5037297, maxsize=40960000, currsize=5037292)
> Cache info: CacheInfo(hits=2732535, misses=5037298, maxsize=40960000, currsize=5037293)
> Cache info: CacheInfo(hits=2732535, misses=5037299, maxsize=40960000, currsize=5037294)
> Cache info: CacheInfo(hits=2732535, misses=5037300, maxsize=40960000, currsize=5037295)
> Cache info: CacheInfo(hits=2732535, misses=5037301, maxsize=40960000, currsize=5037296)
> Cache info: CacheInfo(hits=2732535, misses=5037302, maxsize=40960000, currsize=5037297)
> Cache info: CacheInfo(hits=2732535, misses=5037303, maxsize=40960000, currsize=5037298)
> Cache info: CacheInfo(hits=2732535, misses=5037304, maxsize=40960000, currsize=5037299)
>    ```
>
> 



`auto_2048_optimized.py`代码实现了**Expectimax** 搜索，并使用了 **启发式评估函数** 进行决策。然而，**2048 不能保证每次都成功达成**，主要受以下几个因素影响：

1. **搜索深度不够（SEARCH_DEPTH = 3）**
   - 搜索深度越深，决策越准确，但计算量也随之增长。
   - 目前 `SEARCH_DEPTH = 3`，可能不足以找到最佳策略，导致游戏中期无法维持局势。
2. **启发式函数改进空间**
   - 现有 **权重矩阵** (snake pattern) 过于固定，可能无法适应不同局势。
   - 需要额外考虑“平滑度 (smoothness)” 和“空格数 (emptiness)”，防止早期失控。
3. **未使用 **Pruning（剪枝）
   - 目前代码会尝试所有可能情况，而一些显然较差的决策应该提前剪枝，以提高搜索效率，允许更深的搜索深度。



**优化方案**

以下改进可以显著提高胜率，使模型更稳定地达到 2048，甚至 4096：

**1️⃣ 提高搜索深度**

- 增加搜索深度 `SEARCH_DEPTH = 5` 或 `SEARCH_DEPTH = 6`
- **动态搜索深度**（前期较浅，后期较深）

```
python


CopyEdit
def get_dynamic_depth(board):
    """根据局势动态调整搜索深度"""
    empty_cells = count_empty(board)
    if empty_cells >= 6:
        return 3
    elif empty_cells >= 3:
        return 4
    else:
        return 5  # 终局时加深搜索深度
```

修改 `choose_best_move` 调用：

```
python


CopyEdit
score = expectimax(new_board, get_dynamic_depth(board), False)
```

------

**2️⃣ 改进启发式函数**

**✅ 增加 "平滑度" (smoothness)**

- <mark>保持相邻数字的大小尽量接近，避免大数被困住</mark>
- 计算相邻格子的 **差值总和**，越小越好

```
python


CopyEdit
def calculate_smoothness(board):
    smoothness = 0
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE - 1):
            smoothness -= abs(board[i][j] - board[i][j+1])  # 行
            smoothness -= abs(board[j][i] - board[j+1][i])  # 列
    return smoothness
```

**✅ 增加 "单调性" (monotonicity)**

- <mark>检查是否从左到右递减，从上到下递减</mark>

```
python


CopyEdit
def calculate_monotonicity(board):
    mono_rows = sum(board[i][j] >= board[i][j+1] for i in range(BOARD_SIZE) for j in range(BOARD_SIZE - 1))
    mono_cols = sum(board[j][i] >= board[j+1][i] for i in range(BOARD_SIZE) for j in range(BOARD_SIZE - 1))
    return mono_rows + mono_cols
```

**改进 `evaluate_board`：**

```python
def evaluate_board(board):
    empty = count_empty(board)
    smoothness = calculate_smoothness(board)
    monotonicity = calculate_monotonicity(board)

    weights = [
        [65536, 32768, 16384, 8192],
        [512,   1024,  2048,  4096],
        [256,    512,  1024,  2048],
        [128,    256,   512,  1024]
    ]
    weight_score = sum(board[i][j] * weights[i][j] for i in range(BOARD_SIZE) for j in range(BOARD_SIZE))

    return weight_score + empty * 500 + smoothness * 5 + monotonicity * 100
```

------



完整代码 `auto_2048_optimized4.py`

```python
#!/usr/bin/env python3
import random
import os
import time
from functools import lru_cache

BOARD_SIZE = 4
TARGET = 2048

# 设置最大缓存大小，防止无限占用内存
MAX_CACHE_SIZE = 10000*4096

def board_to_key(board):
    """将棋盘转化为不可变哈希键"""
    return tuple(tuple(row) for row in board)

def key_to_board(key):
    """将哈希键转回棋盘"""
    return [list(row) for row in key]

@lru_cache(maxsize=MAX_CACHE_SIZE)
def expectimax_cached(board_key, depth, is_player):
    board = key_to_board(board_key)
    #print(f"Cache info: {expectimax_cached.cache_info()}")
    return expectimax(board, depth, is_player)

def init_board():
    board = [[0] * BOARD_SIZE for _ in range(BOARD_SIZE)]
    add_random_tile(board)
    add_random_tile(board)
    return board

def add_random_tile(board):
    empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
    if not empty:
        return
    i, j = random.choice(empty)
    board[i][j] = 4 if random.random() < 0.1 else 2

def print_board(board):
    # 使用 ANSI 转义码清屏，避免依赖外部命令
    print('\033[H\033[J', end='')
    print("-" * (BOARD_SIZE * 7 + 1))
    for row in board:
        print("|", end="")
        for num in row:
            if num == 0:
                print("      |", end="")
            else:
                print(f"{num:^6}|", end="")
        print()
        print("-" * (BOARD_SIZE * 7 + 1))

def slide_and_merge(line):
    new_line = [num for num in line if num != 0]
    merged_line = []
    skip = False
    for i in range(len(new_line)):
        if skip:
            skip = False
            continue
        if i + 1 < len(new_line) and new_line[i] == new_line[i+1]:
            merged_line.append(new_line[i] * 2)
            skip = True
        else:
            merged_line.append(new_line[i])
    merged_line += [0] * (BOARD_SIZE - len(merged_line))
    return merged_line

def move_left(board):
    return [slide_and_merge(row) for row in board]

def reverse(board):
    return [list(reversed(row)) for row in board]

def transpose(board):
    return [list(row) for row in zip(*board)]

def move_right(board):
    return reverse(move_left(reverse(board)))

def move_up(board):
    return transpose(move_left(transpose(board)))

def move_down(board):
    return transpose(move_right(transpose(board)))

def boards_equal(b1, b2):
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if b1[i][j] != b2[i][j]:
                return False
    return True

def can_move(board):
    for row in board:
        if 0 in row:
            return True
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if j + 1 < BOARD_SIZE and board[i][j] == board[i][j+1]:
                return True
            if i + 1 < BOARD_SIZE and board[i][j] == board[i+1][j]:
                return True
    return False

def reached_target(board):
    for row in board:
        if any(num >= TARGET for num in row):
            return True
    return False

def count_empty(board):
    return sum(row.count(0) for row in board)

def calculate_smoothness(board):
    """计算平滑度：相邻单元格差值的总和（差值越小越好）"""
    smooth = 0
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE - 1):
            smooth -= abs(board[i][j] - board[i][j+1])
    for j in range(BOARD_SIZE):
        for i in range(BOARD_SIZE - 1):
            smooth -= abs(board[i][j] - board[i+1][j])
    return smooth

def calculate_monotonicity(board):
    """计算单调性：如果行或列单调性好则奖励"""
    mono_rows = 0
    mono_cols = 0
    for row in board:
        if all(row[i] >= row[i+1] for i in range(BOARD_SIZE - 1)) or all(row[i] <= row[i+1] for i in range(BOARD_SIZE - 1)):
            mono_rows += 1
    for col in zip(*board):
        if all(col[i] >= col[i+1] for i in range(BOARD_SIZE - 1)) or all(col[i] <= col[i+1] for i in range(BOARD_SIZE - 1)):
            mono_cols += 1
    return mono_rows + mono_cols

def evaluate_board(board):
    empty = count_empty(board)
    smoothness = calculate_smoothness(board)
    monotonicity = calculate_monotonicity(board)
    # 原始权重矩阵（蛇形布局），鼓励大数集中在角落
    weights = [
        [65536, 32768, 16384, 8192],
        [512,   1024,  2048,  4096],
        [256,    512,  1024,  2048],
        [128,    256,   512,  1024]
    ]
    weight_score = sum(board[i][j] * weights[i][j] for i in range(BOARD_SIZE) for j in range(BOARD_SIZE))
    # 增加空格、平滑度和单调性的奖励
    return weight_score + empty * 500 + smoothness * 5 + monotonicity * 100

def expectimax(board, depth, is_player):
    if depth == 0 or not can_move(board):
        return evaluate_board(board)
    if is_player:
        best = -float('inf')
        for move_func in [move_up, move_down, move_left, move_right]:
            new_board = move_func(board)
            if boards_equal(board, new_board):
                continue
            val = expectimax_cached(board_to_key(new_board), depth - 1, False)
            best = max(best, val)
        return best if best != -float('inf') else evaluate_board(board)
    else:
        empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
        if not empty:
            return evaluate_board(board)
        total = 0.0
        for (i, j) in empty:
            for tile, prob in [(2, 0.9), (4, 0.1)]:
                board_copy = [row[:] for row in board]
                board_copy[i][j] = tile
                total += prob * expectimax_cached(board_to_key(board_copy), depth - 1, True)
        return total / len(empty)

def get_dynamic_depth(board):
    """根据当前空格数量动态调整搜索深度：空格越少搜索深度越深"""
    empty_cells = count_empty(board)
    if empty_cells >= 6:
        return 4
    elif empty_cells >= 3:
        return 5
    else:
        return 6

def choose_best_move(board):
    moves = {
        'w': move_up,
        'a': move_left,
        's': move_down,
        'd': move_right
    }
    best_move = None
    best_score = -float('inf')
    best_new_board = None
    depth = get_dynamic_depth(board)
    for move, func in moves.items():
        new_board = func(board)
        if boards_equal(board, new_board):
            continue
        score = expectimax(new_board, depth, False)
        if score > best_score:
            best_score = score
            best_move = move
            best_new_board = new_board
    return best_move, best_new_board

def main():
    board = init_board()
    has_printed_win = False
    print_board(board)
    while True:
        if not can_move(board):
            print("游戏结束，无法移动！")
            break
        move, new_board = choose_best_move(board)
        if move is None:
            print("没有有效移动，游戏结束！")
            break
        print(f"自动移动：{move}")
        board = new_board
        add_random_tile(board)
        print_board(board)
        if reached_target(board) and not has_printed_win:
            print("已达到 2048！继续自动移动以获得更高分数。")
            has_printed_win = True
        time.sleep(0.0001)

if __name__ == "__main__":
    main()


```

Q. `print('\033[H\033[J', end='')` 是什么意思？

这是一个在Python中使用的ANSI转义序列，用于控制终端（命令行界面）中的光标位置和清除屏幕内容

`\033` 是八进制表示的ESC (Escape) 字符的ASCII码，用于表示转义序列的开始。
`[` 是左方括号，与ESC字符一起组成转义序列的开始。
`H` 表示将光标移动到行首（home position）。
`J` 表示清除从光标位置到屏幕末尾的内容。

因此，`\033[H\033[J` 的意思是：将光标移动到终端的左上角（行首），然后清除从光标所在位置到屏幕末尾的所有内容。在Python字符串中，`end=''` 参数表示在打印结束后不要换行。

**结论**

- 2048 游戏**本质上是概率问题**，但通过 **更好的启发式评分 +  动态搜索深度**，胜率可以大幅提升。
- 经过优化，通常能稳定达到 2048 或 4096。





### 8. auto_2048_expectimax_ab.py

**Alpha-Beta剪枝剪枝的基本原理**

Alpha-Beta剪枝是一种用于减少搜索空间的技术，主要应用于Minimax算法及其变种（如Expectimax）。其核心思想是通过维护两个值：

- **Alpha（α）**: 当前路径上Max节点的最佳选择（即最小化对手得分的最大值）。
- **Beta（β）**: 当前路径上Min节点的最佳选择（即最大化玩家得分的最小值）。

当某个节点的值不可能影响最终决策时，可以提前剪去该节点及其子树，从而减少计算量。

**说明：**

- **仅在玩家（max）节点使用 alpha‑beta 剪枝**  
  在 chance（非玩家）节点，由于期望值计算的性质，不再使用 beta 更新和剪枝。这样可以避免过早剪枝导致决策失误。

- 其他部分保持原有改进（动态搜索深度、改进评估函数、LRU 缓存等）。

完整代码 `auto_2048_expectimax_ab.py`

```python
#!/usr/bin/env python3
import random
import os
import time
from functools import lru_cache

BOARD_SIZE = 4
TARGET = 2048
MAX_CACHE_SIZE = 10000

def board_to_key(board):
    """将棋盘转化为不可变的哈希键"""
    return tuple(tuple(row) for row in board)

def key_to_board(key):
    """将哈希键转回棋盘"""
    return [list(row) for row in key]

@lru_cache(maxsize=MAX_CACHE_SIZE)
def expectimax_ab(board_key, depth, is_player, alpha, beta):
    """
    使用 alpha-beta 剪枝的 Expectimax 搜索。
    注意：仅在玩家（max）节点使用剪枝，
    在 chance 节点不做剪枝，直接计算期望值。
    """
    board = key_to_board(board_key)
    if depth == 0 or not can_move(board):
        return evaluate_board(board)
    
    if is_player:
        best = -float('inf')
        a = alpha
        for move_func in [move_up, move_down, move_left, move_right]:
            new_board = move_func(board)
            if boards_equal(board, new_board):
                continue
            val = expectimax_ab(board_to_key(new_board), depth - 1, False, a, beta)
            best = max(best, val)
            a = max(a, best)
            if a >= beta:
                break  # 剪枝：当前分支已经足够好
        return best
    else:
        # 在 chance 节点直接计算所有可能情况的期望值，不进行剪枝
        empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
        if not empty:
            return evaluate_board(board)
        total = 0.0
        for (i, j) in empty:
            for tile, prob in [(2, 0.9), (4, 0.1)]:
                board_copy = [row[:] for row in board]
                board_copy[i][j] = tile
                val = expectimax_ab(board_to_key(board_copy), depth - 1, True, alpha, beta)
                total += prob * val
        return total / len(empty)

def init_board():
    board = [[0] * BOARD_SIZE for _ in range(BOARD_SIZE)]
    add_random_tile(board)
    add_random_tile(board)
    return board

def add_random_tile(board):
    empty = [(i, j) for i in range(BOARD_SIZE) for j in range(BOARD_SIZE) if board[i][j] == 0]
    if not empty:
        return
    i, j = random.choice(empty)
    board[i][j] = 4 if random.random() < 0.1 else 2

def print_board(board):
    # 使用 ANSI 转义码清屏
    print('\033[H\033[J', end='')
    print("-" * (BOARD_SIZE * 7 + 1))
    for row in board:
        print("|", end="")
        for num in row:
            if num == 0:
                print("      |", end="")
            else:
                print(f"{num:^6}|", end="")
        print()
        print("-" * (BOARD_SIZE * 7 + 1))

def slide_and_merge(line):
    new_line = [num for num in line if num != 0]
    merged_line = []
    skip = False
    for i in range(len(new_line)):
        if skip:
            skip = False
            continue
        if i + 1 < len(new_line) and new_line[i] == new_line[i+1]:
            merged_line.append(new_line[i] * 2)
            skip = True
        else:
            merged_line.append(new_line[i])
    merged_line += [0] * (BOARD_SIZE - len(merged_line))
    return merged_line

def move_left(board):
    return [slide_and_merge(row) for row in board]

def reverse(board):
    return [list(reversed(row)) for row in board]

def transpose(board):
    return [list(row) for row in zip(*board)]

def move_right(board):
    return reverse(move_left(reverse(board)))

def move_up(board):
    return transpose(move_left(transpose(board)))

def move_down(board):
    return transpose(move_right(transpose(board)))

def boards_equal(b1, b2):
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if b1[i][j] != b2[i][j]:
                return False
    return True

def can_move(board):
    for row in board:
        if 0 in row:
            return True
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE):
            if j + 1 < BOARD_SIZE and board[i][j] == board[i][j+1]:
                return True
            if i + 1 < BOARD_SIZE and board[i][j] == board[i+1][j]:
                return True
    return False

def reached_target(board):
    for row in board:
        if any(num >= TARGET for num in row):
            return True
    return False

def count_empty(board):
    return sum(row.count(0) for row in board)

def calculate_smoothness(board):
    """计算平滑度：相邻单元格差值的总和（差值越小越好）"""
    smooth = 0
    for i in range(BOARD_SIZE):
        for j in range(BOARD_SIZE - 1):
            smooth -= abs(board[i][j] - board[i][j+1])
    for j in range(BOARD_SIZE):
        for i in range(BOARD_SIZE - 1):
            smooth -= abs(board[i][j] - board[i+1][j])
    return smooth

def calculate_monotonicity(board):
    """计算单调性：如果行或列单调性好则奖励"""
    mono_rows = 0
    mono_cols = 0
    for row in board:
        if all(row[i] >= row[i+1] for i in range(BOARD_SIZE-1)) or all(row[i] <= row[i+1] for i in range(BOARD_SIZE-1)):
            mono_rows += 1
    for col in zip(*board):
        if all(col[i] >= col[i+1] for i in range(BOARD_SIZE-1)) or all(col[i] <= col[i+1] for i in range(BOARD_SIZE-1)):
            mono_cols += 1
    return mono_rows + mono_cols

def evaluate_board(board):
    empty = count_empty(board)
    smoothness = calculate_smoothness(board)
    monotonicity = calculate_monotonicity(board)
    # 权重矩阵（蛇形布局），鼓励大数集中在角落
    weights = [
        [65536, 32768, 16384, 8192],
        [512,   1024,  2048,  4096],
        [256,    512,  1024,  2048],
        [128,    256,   512,  1024]
    ]
    weight_score = sum(board[i][j] * weights[i][j] for i in range(BOARD_SIZE) for j in range(BOARD_SIZE))
    return weight_score + empty * 500 + smoothness * 5 + monotonicity * 100

def get_dynamic_depth(board):
    """根据当前空格数量动态调整搜索深度：空格越少，局势越紧张，搜索深度加深"""
    empty_cells = count_empty(board)
    if empty_cells >= 6:
        return 4
    elif empty_cells >= 3:
        return 5
    else:
        return 6

def choose_best_move(board):
    moves = {
        'w': move_up,
        'a': move_left,
        's': move_down,
        'd': move_right
    }
    best_move = None
    best_score = -float('inf')
    best_new_board = None
    depth = get_dynamic_depth(board)
    for move, func in moves.items():
        new_board = func(board)
        if boards_equal(board, new_board):
            continue
        score = expectimax_ab(board_to_key(new_board), depth, False, -float('inf'), float('inf'))
        if score > best_score:
            best_score = score
            best_move = move
            best_new_board = new_board
    return best_move, best_new_board

def main():
    board = init_board()
    has_printed_win = False
    print_board(board)
    while True:
        if not can_move(board):
            print("游戏结束，无法移动！")
            break
        move, new_board = choose_best_move(board)
        if move is None:
            print("没有有效移动，游戏结束！")
            break
        print(f"自动移动：{move}")
        board = new_board
        add_random_tile(board)
        print_board(board)
        if reached_target(board) and not has_printed_win:
            print("已达到 2048！继续自动移动以获得更高分数。")
            has_printed_win = True
        time.sleep(0.0001)

if __name__ == "__main__":
    main()
```

---

说明

1. **剪枝修正：**  
   - 在玩家节点中更新 alpha 并进行剪枝；  
   - 在 chance 节点中不更新 beta，也不进行剪枝，而是计算所有可能结果的平均值。

2. **动态搜索深度：**  
   - 根据空格数返回搜索深度 4、5 或 6。

3. **其他优化：**
   - 评估函数结合了权重矩阵、空格奖励、平滑度和单调性。  
   - 使用 LRU 缓存防止内存无限增长。



效果一样，C8运行时间应该更短。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20250227232724861.png" alt="image-20250227232724861" style="zoom:50%;" />





### Q. vi 里面如何拷贝整个文件?

在Vi或Vim编辑器中，拷贝整个文件的内容可以通过以下步骤实现：

#### 方法一：使用Vim命令

1. 打开你的文件：

   ```bash
   vim yourfile.txt
   ```

2. 进入命令模式（按 `Esc` 键确保你在命令模式下）。

3. 输入以下命令以选中整个文件的文本：

   ```
   ggVG
   ```

   - `gg` 将光标移动到文件的第一行。
   - `V` 进入可视行选择模式。
   - `G` 选择从当前行到文件末尾的所有行，组合起来就是全选整个文件。

4. 复制选中的内容（在命令模式下）：

   ```
   y
   ```

   这里的 `y` 是 yank 的缩写，用于复制选中的文本。

5. 现在，文件的所有内容已经被复制到了Vim的寄存器中。你可以通过打开另一个文件或者在同一文件中不同的位置粘贴这些内容：

   - 打开新文件进行粘贴：

     ```bash
     :e newfile.txt
     ```

     在新文件中，进入插入模式前按 `p` 键粘贴内容。

#### 方法二：直接使用系统剪贴板（如果支持）

如果你的Vim版本支持与系统剪贴板交互，并且你正在使用图形界面版本的Vim（如gvim），可以直接将文件内容发送到系统剪贴板：

1. 在正常模式下输入以下命令来选择并复制整个文件至系统剪贴板：

   ```
   :%y+
   ```

   这里的 `%` 表示整个文件范围，`y+` 表示将选中的内容复制到系统剪贴板。

2. 然后你可以切换到其他应用程序中粘贴这个内容。

请注意，对于方法二，需要确保你的Vim安装了对系统剪贴板的支持（通常需要`+clipboard`特性）。可以通过运行 `vim --version | grep clipboard` 来检查是否支持。如果输出中有 `+clipboard` 则表示支持，如果有 `-clipboard` 则不支持，这种情况下可能需要安装额外的包或使用另一种方法。



### Q.Alpha-Beta剪枝的基本原理

Alpha-Beta剪枝是一种用于博弈树搜索的优化技术，目的是减少评估节点的数量，从而提高Minimax算法的效率。它通过忽略那些不会影响最终决策的部分搜索树来实现这一点。下面是Alpha-Beta剪枝的基本原理的简要说明。

#### 1. 核心概念

不要死记硬背 Alpha 和 Beta，请这样理解：

*   **Max（你）**：想要分数越高越好。
*   **Min（对手）**：想要分数越低越好。
*   **Alpha（$\alpha$）**：**你的底线**。意思是“我现在手里已经稳拿 X 分了，更烂的我不要”。
*   **Beta（$\beta$）**：**对手的底线**（也是你的天花板）。意思是“对手已经能把分压到 Y 分了，如果我这边算出个比 Y 更高的分，对手绝不会让我走这条路”。

#### 2. 树形图表示

假设我们有这样一棵树。

*   **第一层（Max）**：轮到你走。
*   **第二层（Min）**：轮到对手走。
*   **第三层（数字）**：最终的得分。

我们按照**从左到右**的顺序计算。

```text
             [Max: 根节点]
           /       |       \
        (A)       (B)      (C)    <-- 对手(Min)层
       /   \     /   \    /   \
      3     5   2    ?   9    ?
```

#### 3. 剪枝过程详解（一步步看）

**第一步：探索左边分支 (A)**

1.  电脑先看左边。对手(Min)在 A 节点面临两个选择：3 和 5。
2.  对手很聪明，肯定选小的。所以 **A 节点的价值是 3**。
3.  **更新 Alpha（你的底线）**：这时候你（Max）知道了，走左边这一路，**最差也能得 3 分**。
    *   当前 **$\alpha = 3$**。

**第二步：探索中间分支 (B) —— 【剪枝发生时刻！】**

1.  电脑开始计算 B 节点。
2.  先看了 B 的第一个子节点：**是 2**。
3.  **停！思考一下：**
    *   对手(Min)在 B 节点，发现了一个 2。因为对手想要分越低越好，所以不管 B 后面那个问号（?）是多少（哪怕是 0 或 -100），对手在 B 这一路的选择**绝对不会超过 2**。
    *   也就是：**B 节点的最终价值 $\le$ 2**。
4.  **与你的底线对比**：
    *   你（Max）手里已经握着左边的 **3分**（Alpha=3）。
    *   而中间这条路（B），对手最仁慈也只会让你得 **2分**。
5.  **结论**：你是个正常人，既然左边能得3分，你绝不会选只能得2分的中间这条路。
6.  **剪枝**：B 节点后面剩下的那个问号（?），**根本不用算了！** 直接砍掉。

**第三步：探索右边分支 (C)**

1.  电脑开始计算 C 节点。
2.  先看了 C 的第一个子节点：**是 9**。
3.  **思考**：
    *   对手(Min)在 C 节点看到 9。对手还在找有没有比 9 更小的数。
    *   目前 C 的价值 $\le$ 9。
4.  **与你的底线对比**：
    *   你的底线 Alpha 是 3。
    *   目前 C 这条路有可能给你 9 分（如果对手后面没别的招）。
    *   $9 > 3$，这比你现在的底线好！所以**不能剪枝**，必须继续看 C 后面的问号（?），万一后面是个 1 呢？那对手肯定选 1，你就得不到 9 了。
5.  所以 C 分支必须算完。



#### 总结原理

上面的过程翻译成“剪枝原理”就是：

1.  **Alpha 剪枝（发生在 Min 节点，如 B）**：
    *   当**对手(Min)** 发现这一步如果走下去，分数比 **你(Max)** 已经拥有的底线（Alpha）还要低。
    *   **Max 心里话**：“这路太烂了，比我刚才找的路还烂，我不可能走这儿，别算了。” -> **剪掉！**

2.  **Beta 剪枝（发生在 Max 节点，反过来）**：
    *   当 **你(Max)** 发现这一步如果走下去，分数比 **对手(Min)** 已经设下的限制（Beta）还要高。
    *   **Min 心里话**：“你想得美！刚才我已经找到让你只能得5分的办法，现在你想走这条得100分的路？我绝不会让你走到这个节点的。” -> **剪掉！**



**记住一句话：**
**剪枝就是因为“已经有一条更好的退路（对 Max 来说）”或者“对手已经抓住了你的把柄（对 Min 来说）”，导致当前的探索变得毫无意义。**

通过这种方式，Alpha-Beta剪枝能够在不改变最终结果的情况下显著减少需要评估的节点数，特别是在理想情况下（比如对手的最佳移动总是最先被考察），它可以将搜索效率提高一倍。



## 3.2 更好的 2048 游戏

这是2026年春季《数算B》课程，同学的课程大作业。

仓库地址：https://github.com/zhiryuan/2048-game

**环境**

| 组件   | 版本                 |
| ------ | -------------------- |
| Python | ≥ 3.10               |
| Pygame | ≥ 2.6.1              |
| C++    | clang++ / g++，C++17 |

pygame 似乎暂不支持 Python ≥ 3.14，高版本需要用pygame-ce。

### 背景、简介

#### 1. 项目背景

作为古法编程爱好者，在数算B课上看到一道模拟2048的题目，觉得很有意思，希望能不借助AI Coding自己写一写。起初，弄清楚pygame的逻辑后，写了一个有点复杂的类，用代码绘制了出来游戏背景。又过了几天，加上了数字方块的绘制，把各种颜色存在一个字典里，数字方块的管理也写成一个类。接着，把移动、判断胜负的逻辑加上。实现动画是困难的部分，搞了一个队列表示每刻需要处理的动画，然后去一点点处理。经过一两天调试后，竟然真的能跑了。

大喜，然后加上各种有意思的内容，包括`×2` `×4` `×0` `#`这些方块。这又花了几天时间。

后来看到要求加上游戏AI，希望能在常规模式下跑AI，于是做了一个menu界面，选择大小、模式。这个花了我很久，主要是UI界面有很多细节，按钮事件也不太好搞。另外，由于建立在之前代码基础上，之前代码也都是手写的，一开始还很优雅，加着加着东西就乱了，尤其是之前定义很多全局变量不太好处理。并且之前没写过这么长的代码，手写的代码没有组织好，是在改的过程中一点点学应该怎么写的。

然后为了向外接东西，搞了一个socket的连接，写server和client，跑通了，可以对接一个简单的wasd的AI（比随机AI好很多），还可以在不修改原代码的基础上，对接一个命令行控制的代码。

游戏AI很难搞，正好deepseek出v4降价，就下了一个claude code，接入deepseek，查网上资料，跟它博弈好几天，做出的算法一直卡在1024上不去。后来让他参考github上开源代码的思路，发现原来方法中的几个关键问题，最后跑通了，几十分钟的训练就能跑到8192，再训练一下还能跑到16384，可惜不小心把40min训练的那个文件覆盖了，现在只有一个15min的版本，临近期末，做下README就交了吧。

#### 2. 项目简介

本项目是一个具有流畅动画效果、界面制作精巧、提供多种模式、具有丰富彩蛋的2048小游戏。
同时实现了多种游戏AI，通过socket server接口与外部AI对接，使得AI逻辑与游戏本体分离，
可以在不重新编译原有游戏代码的基础上，配备若干个用任意语言编写的AI。
基于n-tuple network + TD afterstate learning的AI目前可以在4x4常规模式稳定玩到8192。

#### 3. 项目结构

主要文件如下

```
2048-game/
├── 2048game_2.py          # Pygame GUI 游戏（含 Unix socket server）
├── ntuple_ai_run.sh       # 启动 ntuple-AI
├── cyclic_2048_ai.py      # 启动 简单wasd循环AI
├── cli_2048_not_ai.py     # 启动 命令行界面
├── cpp_ai/                # C++ N-tuple TD-learning AI
│   ├── 2048_ai            # 编译后二进制
│   ├── types.hpp          # 类型 / RNG / 窗口分桶
│   ├── board.hpp          # 64-bit bitboard / 移动 LUT / 游戏逻辑
│   ├── ntuple.hpp         # N-tuple 网络 / 权重保存加载
│   ├── main.cpp           # 训练 / 评估 / play 三模式
│   ├── cpp_ai_15min.bin   # 预训练权重 (8.5 MB)
│   └── Makefile
├── Arial.ttf
├── pyproject.toml
└── README.md
```

### 运行指南

#### 游戏界面与内容

运行`2048game_2.py`，弹出如下2048游戏窗口，初始为默认大小`4*4`，常规(`regular`)模式。你可以用`WASD`或者`↑←↓→`来移动方块
（win下注意关闭中文输入法），点击`restart`按钮可以重开，`best`会记录最佳分数，`current`记录当前分数。

![截屏2026-06-13 20.57.34](https://raw.githubusercontent.com/GMyhf/img/main/img/%E6%88%AA%E5%B1%8F2026-06-13%2020.57.34.png)

![截屏2026-06-13 22.24.23](https://cdn.jsdelivr.net/gh/zhiryuan/image-host@main/img/%E6%88%AA%E5%B1%8F2026-06-13%2022.24.23.png)

点击`menu`按钮，进入如下的菜单页面。你可以点击`Size`栏里`n`、`m`右边的上/下按钮，调整网格大小，
点击`Mode`栏里的上/下按钮，调整游戏模式，然后点击`Restart`开始新游戏（不会保留之前的进度）。
或者，你也可以按`Continue`回到原来的游戏继续。
游戏支持`n≠m`的情况，并且花了一些工夫调整各种大小的网格显示，让缝隙宽度、字体大小都比较合适，
n,m可以从1取到100，都能流畅运行，n*m较大时会自动降帧。

![截屏2026-06-13 22.22.40](https://raw.githubusercontent.com/GMyhf/img/main/img/%E6%88%AA%E5%B1%8F2026-06-13%2022.22.40.png)

![截屏2026-06-13 21.13.19](https://cdn.jsdelivr.net/gh/zhiryuan/image-host@main/img/%E6%88%AA%E5%B1%8F2026-06-13%2021.13.19.png)



项目除了`cpp_ai`文件夹里实现的AI算法借助deepseek(in claude code)完成，其他部分都是手写的，
核心的2048game_2.py从配置字体、绘制圆角方块、实现2048动画、处理时序、实现2048逻辑、
，到建构菜单界面、处理按钮逻辑、实现`socket server`接口与交互逻辑，都是自己一点点写的。

你可以发现，移动方块时方块会平滑地运动，生成新方块时会有放大的效果，加分时上方的积分板会有加分动画，
从下往上淡出。光标移动到游戏界面和菜单界面每个按钮上，这些按钮都会有偏暗的效果。
这些都是从pygame里简陋的`surface+blit`的UI方式实现的，花了我不少时间来写，
但是看到原先简陋的界面一点点变得很完善，还是觉得比较有趣的。

#### socket连接游戏AI

游戏已经启动，并且尚未连接，就可从`ntuple_ai_run.sh`、`cyclic_2048_ai.py`、`cli_2048_not_ai.py`三者中选一个运行，
它会自动与游戏进行socket连接（在mac上正常运行，win还没有测试），同一时间只能连接一个。

（注：`ntuple_ai_run.sh`需要当前大小为`4*4`，并且建议在`Regular`模式下使用）

按`[Esc]`可以减少动画帧数，让AI更快运行。

| 程序               | 作用                                                | 使用限制          |
| ------------------ | --------------------------------------------------- | ----------------- |
| ntuple_ai_run.sh   | 启动`cpp_ai/`里的程序运行ntuple AI                  | 只能在大小4*4使用 |
| cyclic_2048_ai.py  | 最简单的wasd轮询AI                                  | 任意大小和模式    |
| cli_2048_not_ai.py | 测试连接用，可在运行后从命令行输入`w/a/s/d`控制游戏 | 任意大小和模式    |

#### 游戏模式与按键

##### 游戏模式

在menu里可选择如下模式：

| 模式     | 说明                        |
| -------- | --------------------------- |
| Regular  | 标准 2048，90% 2 + 10% 4    |
| Featured | 额外生成 `×2` `×4` `×0` `#` |
| ???      | 随机基础因子                |

非Regular模式，会生成 `×2` `×4` `×0` `#`这些方格

两个`#`可以合成`×2`，两个`×2`可以合成`×4`，同时获得大量分数

`#`与任意`x`合成后仍为`x`，它的作用相当于有一定概率不生成东西

 `×2` `×4`与某数合成后会将其翻2/4倍

`×0`与任意数合成后将其变为`#`，但是会获得大量分数

##### 按键控制

| 键    | 动作                   |
| ----- | ---------------------- |
| W / ↑ | 上                     |
| A / ← | 左                     |
| S / ↓ | 下                     |
| D / → | 右                     |
| Esc   | 加速动画，再次按下恢复 |

### C++ AI部分

参考 [moporgic/TDL2048](https://github.com/moporgic/TDL2048) 实现的 n-tuple network + TD afterstate learning，这一部分是借助AI（deepseek in claude code）、查阅网上资料完成的。

使用cpp+多核并行加速，极大提升了运行效率，是python+并行的5~6倍，只需经过15min训练，便可以超过人类平均水平（以50%以上概率跑到8192）。

#### 算法概要

##### 1. 棋盘表示

4×4 棋盘，用单个 `uint64_t` 表示，每格 4 bit，存储 tile 值的 **log₂**。

每行 4 格 × 4 bit = 16 bit = `uint16_t`，共 2^16 = **65536** 种可能

##### 2. 移动

预计算所有 65536 种行的**左移结果和得分**。对每个 16-bit 行：

```
1. 提取 4 个 nibble: [v0, v1, v2, v3]（v=0 表示空格）
2. 去零压缩: 非零值按序排列到左侧
3. 从左到右扫描相邻相等值:
   if v[i] == v[i+1]:
     合并: v[i] = min(v[i]+1, 15);  score += 2^(v[i]+1)
     v[i+1] = 0; i += 2
   else: i += 1
4. 再去零压缩，右侧补零
```

##### 3. N-tuple Network

n-tuple 是棋盘上一组**固定位置**的格子，由于总可能数2^64过大，为了将训练时的状态存储，采用类似于hash的方法，把每个tuple覆盖的几格的值组合成索引去查权重表。每个 tuple 独立建表，通过把棋盘分解为小的tuple，减少参数量。

每个 n-tuple 把其覆盖格子的 tile 值组合成一个线性索引，查权重表得到一个标量。**所有模式的和 = 棋盘评估值 V(board)**：

```
V(board) = Σ_{pattern p} Σ_{symmetry s} weight_p[ index_{p,s}(board) ]
```

模式定义是格子位置的线性索引，分两类：17 个 4-tuple（4 行 + 4 列 + 9 个 2×2 方块），直接 16 桶编码；6个 6-tuple（2×3 矩形），窗口分桶编码。

若直接 16 桶编码，索引空间 16⁶ = 16,777,216。为节省内存，使用**窗口分桶**，即选取4 个滑动窗口，每个覆盖 5 个连续 log₂ 值。

**总参数量：** 17×65536 + 6×4×46656 ≈ 2,231,168 个 float ≈ **8.7 MB**。

由于2048 棋盘有 8 种对称变换（D4 二面体群），每个模式的 8 种对称对应 8 套不同的格子位置（共享同一权重表），它们索引到权重表的不同位置。**8 种对称在同一个权重表中各自更新，自然学到对称不变性**，等效数据增强 ×8。

```
sym[0]: (r,c) → (r,c)          恒等
sym[1]: (r,c) → (c,3-r)        rot90
sym[2]: (r,c) → (3-r,3-c)      rot180
sym[3]: (r,c) → (3-c,r)        rot270
sym[4]: (r,c) → (r,3-c)        水平反射
sym[5]: (r,c) → (3-r,c)        垂直反射
sym[6]: (r,c) → (c,r)          转置
sym[7]: (r,c) → (3-c,3-r)      反对角反射
```

##### 4. 训练：TD(0) afterstate，纯 greedy，8 线程 lock-free

2048 状态转移分两步：

```
state sₜ  →  action aₜ  →  afterstate s'ₜ  →  spawn tile  →  state sₜ₊₁
   (玩家选择)     (确定性：移动+合并)            (随机：选空格+放 2/4)
```

使用afterstate（移动后、tile 生成前）而非state，是因为这样的转移是**确定性的**。因此 afterstate 比 state 更适合作为值函数的学习对象——不需要显式取期望。

有如下方程：

```
V(s'ₜ) = E_{sₜ₊₁ ~ P(·|s'ₜ)} [ max_a ( r(sₜ₊₁, a) + V(s'(sₜ₊₁, a)) ) ]
```

其中：

- `r(s, a)` = 从 state s 执行动作 a 的合并得分
- `s'(s, a)` = 从 state s 执行动作 a 后的 afterstate
- `P(sₜ₊₁ | s'ₜ)` = 随机 tile 生成分布：在 N 个空格中均匀选一个，90% 放 2，10% 放 4

用单次采样 sₜ₊₁ 近似期望，进行如下更新：

```
非终止: target = max_a [ r(sₜ₊₁, a) + V(s'(sₜ₊₁, a)) ]
终止:   target = 0

V(s'ₜ) ← V(s'ₜ) + α × (target - V(s'ₜ))
```

α = 0.1 / 328 ≈ 3×10⁻⁴ 每 feature（总 α=0.1，均分到 328 个 feature）。

探索策略为**纯 greedy，不做显式探索**，理由是：

- 2048 的 tile 随机性（位置随机 + 2/4 随机）已提供足够多样性
- 每次随机 tile 生成把局面推入不同的状态空间区域
- ε-greedy 的随机动作会主动破坏角落（角上大 tile 被弹到中间 → 快速死亡）
- SOTA (TDL2048) 也用纯 greedy，训练量管够（数亿局）即可

###### 收敛性分析：

**单次采样方差大：** 开局 ~14 个空格，采样一个 sₜ₊₁ 忽略了 13/14 的可能性。不同空格对 max V 的影响差异极大（放角落旁 vs 放中间）。

**Max 操作偏差：** `Max` 对噪声不对称——被噪声"抬高"的动作被选入 max，被"压低"的被忽略。结果 max 估计值系统性偏高。

**缓解：**

- 巨量训练（数亿次更新）让统计平均生效
- 深层 expectimax 在测试时补偿 V 的不精确
- 学习率恒定不衰减，避免早期收敛的 V 被过度信任

##### 5. Expectimax 搜索、置换表

2048 的博弈树天然分两层：

| 层        | 角色 | 操作                                   |
| --------- | ---- | -------------------------------------- |
| Max 层    | 玩家 | 枚举 4 个方向 → 取 max                 |
| Chance 层 | 环境 | 枚举 N 个空格 × 2 种 tile → 取加权平均 |

定义如下深度：

```
1-ply = Max层 → 直接 eval afterstate V(s')
2-ply = Max层 → Chance层 → Max层 → eval
3-ply = Max层 → Chance层 → Max层 → Chance层 → Max层 → eval
```

对于不同深度的搜索，评估次数有差异：

| depth | 近似分支                | 每步评估次数 |
| ----- | ----------------------- | ------------ |
| 1-ply | 4                       | 4            |
| 2-ply | 4 × 14×2 × 4            | ~448         |
| 3-ply | 4 × 14×2 × 4 × 13×2 × 4 | ~23,000      |

使用置换表。开放寻址 hash 表，board 的 64 bit 值自身用作 hash（无碰撞），大幅削减重复节点。

##### 6. 多线程并行

- 8 个 `std::thread`，每线程独立训练
- **所有权重表共享，无锁读写**（浮点 `+=` 非原子）（冲突概率极低，偶发冲突（lost update）= 等效学习率轻微降低，对 SGD 收敛无影响）
- 每线程独立 RNG（xoshiro256**，不同种子）
- `std::atomic<long long>` 分配 episode 编号

#### 编译

```bash
cd cpp_ai && make
```

#### 训练

将下面的weight.bin更换为所需文件

```bash
./2048_ai train --episodes 200000 --threads 8 --alpha 0.1 --save weights.bin
```

| 参数           | 默认               | 说明           |
| -------------- | ------------------ | -------------- |
| `--episodes N` | 100000             | 训练局数       |
| `--threads N`  | 8                  | 线程数         |
| `--alpha F`    | 0.1                | 学习率         |
| `--load FILE`  | —                  | 加载预训练权重 |
| `--save FILE`  | cpp_ai_weights.bin | 保存权重       |

15 分钟训练预期 best tile ≥ 8192。

#### 评估

将下面的weight.bin更换为所需文件，已经训练好的是cpp_ai_15min.bin

```bash
./2048_ai eval --episodes 100 --depth 2 --tt-size 256 --load weights.bin
```

| 参数           | 默认 | 说明            |
| -------------- | ---- | --------------- |
| `--episodes N` | 100  | 局数            |
| `--depth N`    | 2    | 搜索深度（ply） |
| `--tt-size N`  | 256  | 置换表（MB）    |

#### 对接游戏

```bash
# 终端1：启动游戏
python 2048game_2.py

# 终端2：启动 AI
./ntuple_ai_run.sh
```

游戏通过 `/tmp/2048game.sock` (Unix domain socket) 通信。协议：

```
游戏 → AI: move\n4 4\nv00 v01 v02 v03\n...\n\n
AI → 游戏: w | a | s | d
```

脚本中默认 depth=3。

#### 评估结果（260K episodes模型）

| depth | 8192 | 4096 | 平均分  | 速度    |
| ----- | ---- | ---- | ------- | ------- |
| 1-ply | 50%  | 42%  | 100,578 | 72 g/s  |
| 2-ply | 60%  | 35%  | 112,858 | 2.6 g/s |
| 3-ply | 100% | 0%   | 152,340 | 0.1 g/s |





### Q：对课程项目进行评估

> 这份2048课程项目在工程实现、算法设计以及系统解耦方面表现出了不错的完整性。以下从设计亮点、技术实现、改进空间等多个维度对该项目进行客观评价。
>
> ---
>
> #### 一、 项目设计亮点
>
> ##### 1. 架构解耦与通信设计（Socket 接口）
> 项目最显著的工程亮点在于**游戏本体与 AI 逻辑的解耦**。
> * **设计合理性**：通过 Unix Domain Socket 建立客户端-服务器模式，将 Pygame 渲染引擎作为服务端，AI 作为客户端。这种设计避免了将复杂的 C++ 编译环境或重量级算法直接嵌入 Python 界面代码中，保持了代码库的单一职责原则。
> * **扩展性**：通过通用的字符协议（`w/a/s/d`），不仅能接入复杂的 C++ N-tuple AI，还能无缝接入简单的循环测试脚本（`cyclic_2048_ai.py`）或纯命令行交互（`cli_2048_not_ai.py`），为后续开发其他算法（如 MCTS、DQN）预留了接口。
>
> ##### 2. GUI 细节与鲁棒性
> * **动态自适应布局**：支持从 $1 \times 1$ 到 $100 \times 100$ 的网格自适应缩放，且能自动调整间距、字体大小，并在大网格下自动降帧。这说明在界面开发中对坐标计算和事件循环进行了较细致的处理。
> * **动画时序控制**：通过队列机制处理滑行、放大、浮动加分等时序动画，缓解了 Pygame 简陋的绘图机制在处理高频动态刷新时的卡顿和错位问题。
> * **特色模式扩展**：引入了特殊符号方块（`×2`, `×4`, `×0`, `#`）以及合成链条。这不仅丰富了玩法，还考验了底层状态机在处理非标准数值合成时的鲁棒性。
>
> ##### 3. C++ AI 的算法实现与性能优化
> AI 部分参考了学术界主流的 $N$-tuple network 与 TD learning 方案（类似于 TDL2048），在底层性能优化上做了较深入的工作：
> * **高效的数据结构**：采用 `uint64_t` 的 bitboard 结构存储 $4 \times 4$ 棋盘，并预计算 $2^{16}$（65536）种行状态的左移结果与得分。这种位运算与查表法（LUT）的设计，极大地降低了单步模拟的开销。
> * **状态表示与对称性（D4 群）**：利用 $8$ 种二面体群对称变换共享权重表，起到了数据增强和加速收敛的作用。
> * **无锁多线程（Hogwild! 风格）**：采用 8 线程并行训练，利用无锁（Lock-free）更新共享权重。虽然技术上存在数据竞争，但在时序差分（TD）更新中，这种微小的覆盖损失（Lost Update）往往能被其带来的计算效率提升所弥补。
> * **Expectimax 与置换表（Transposition Table）**：结合了基于游戏状态哈希的置换表，减少了深度搜索中的重复计算。
>
> ---
>
> #### 二、 值得讨论与改进的方向
>
> 尽管项目完成度较高，但在代码架构、跨平台兼容性以及算法理论细节上，仍有一些可以进一步完善的地方：
>
> ##### 1. 跨平台兼容性限制
> * **问题**：目前项目中的通信采用的是 Unix Domain Socket（`/tmp/2048game.sock`）。由于 Windows 系统对 Unix 套接字的支持历史较杂（虽然较新版本的 Win10/11 支持，但配置仍有差异），这导致该项目在 Windows 环境下无法直接开箱即用。
> * **建议**：可提供一个基于本地回环 TCP Socket（如 `127.0.0.1:port`）的备选方案，或者在代码中根据当前操作系统（`sys.platform`）自动切换通信协议，以提高项目的跨平台兼容性。
>
> ##### 2. 局部代码维护性（Technical Debt）
> * **问题**：如你在背景中所提到的，“加着加着东西就乱了，尤其是之前定义很多全局变量不太好处理”。这是个人手写中大型 GUI 项目时常见的通病。
> * **建议**：
>   * **状态管理重构**：建议将游戏的核心状态（如棋盘矩阵、当前得分、游戏阶段）从 Pygame 绘制逻辑中彻底剥离，封装成一个独立的 `GameState` 类。
>   * **消除全局变量**：通过将全局变量作为类成员变量，或者引入一个中央配置对象（`Config` 类）来统一管理参数（如颜色、字体、网格大小），提高代码的可读性与单元测试的可行性。
>
> ##### 3. C++ 多线程写入的未定义行为（Undefined Behavior）
> * **问题**：在 C++ 中，多线程并发非原子地读写同一个浮点数（`float`）在标准语法中属于**未定义行为**（Undefined Behavior, UB）。虽然在实践中（如深度学习、SGD 训练）这种无锁写入能够正常运行且效率极高，但从严谨的工程角度看，存在导致数据损坏或编译器优化异常的隐患。
> * **建议**：可以使用 `std::atomic<float>`（在支持 C++20 的环境下提供原子加法支持），或者在各线程内部使用轻量级的局部分级累加，并在局数结束时统一合并至主权重表，以此在安全性和性能之间取得更好的平衡。
>
> ##### 4. 特殊模式（Featured Mode）下的 AI 适配
> * **问题**：当前的 C++ AI 仅支持 $4 \times 4$ 的 Regular 模式。由于 Featured 模式引入了特殊方块（如带有乘除、清零性质的符号），现有的状态表示（4-bit 存储 $\log_2$ 码值）和评估网络将无法直接适用。
> * **建议**：如果未来需要扩展，可以尝试将特殊符号方块也编码进状态空间，但由于状态转移概率发生变化（非单纯的合成），需要重新设计状态转移估算逻辑，或者提供一个规则基（Rule-based）的启发式微调。
>
> ---
>
> #### 三、 总结
>
> 作为一个课程项目，本项目不仅完成了标准的 2048 游戏复现，还通过**界面动态化**、**特殊游戏模式**、**Socket 通信解耦**以及**高性能 C++ 强化学习 AI** 等模块，将项目拓宽到了多学科交叉的层面（游戏开发、网络编程、并行计算、强化学习）。
>
> 虽然在早期手写代码的组织结构上存在一些可以重构的遗留问题，但整体的系统设计思路是清晰且务实的。15 分钟的训练即可达到 50% 以上的 8192 成功率，证明了底层算法实现的有效性。



### Q：我的机器是 mac studio

有20 (16 Performance and 4 Efficiency)。如何运行训练？比如：训练一下还能跑到16384，40min训练的

> 针对你的 Mac Studio（16 个性能核 + 4 个能效核）硬件配置，要重现并优化“40分钟训练出能跑到 16384 权重”的过程，可以从**编译优化**、**线程数分配**以及**训练参数估算**三个方面进行配置。
>
> 以下是具体的运行与优化指南：
>
> ### 1. 编译优化（针对 Apple Silicon）
>
> 在编译 C++ AI 之前，确保编译器开启了最适合 Apple Silicon 的优化选项。
>
> 打开 `cpp_ai/Makefile`，检查或修改编译选项（`CXXFLAGS`）。建议确保包含以下参数：
> ```makefile
> CXX = clang++
> CXXFLAGS = -std=c++17 -O3 -flto -DNDEBUG
> ```
> * `-O3`：开启高强度优化。
> * `-flto`：开启链接时优化（Link-Time Optimization），能带来轻微的性能提升。
> * `-DNDEBUG`：关闭断言，释放全部运行速度。
>
> 在 `cpp_ai` 目录下执行编译：
> ```bash
> cd cpp_ai
> make clean
> make
> ```
>
> ---
>
> ### 2. 线程数（Thread）分配策略
>
> 你的 Mac Studio 拥有 20 个物理核心，但采用了大小核架构（16 P-Cores + 4 E-Cores）。
> 对于这种高度密集的计算任务（尤其是无锁的多线程冲突写入），**强烈建议将线程数设置为 16，而不是 20**。
>
> * **原因**：如果设置为 20 线程，操作系统会将其中 4 个线程分配给慢速的能效核（E-Core）。在多线程同步或共享权重表随机访问时，慢速核可能会拖慢整体的吞吐量。将线程限制在 16，可以确保所有训练线程全部运行在满血的性能核（P-Core）上，从而获得最高且最稳定的 Episodes/second（每秒训练局数）。
>
> ---
>
> ### 3. 训练参数估算与命令
>
> 在 8 线程的普通 CPU 上，15 分钟大约能跑 20 万局（200,000 episodes）。
> 在 Mac Studio 的 16 个性能核上，计算效率预计会翻倍。要在 40 分钟左右达到更深度的收敛以冲击 16384，可以尝试将目标设为 **100 万局（1,000,000 episodes）**。
>
> #### 启动训练命令：
> 回到项目根目录，运行以下命令（注意调整 `--threads` 为 16，并将 episodes 设为 1,000,000）：
>
> ```bash
> ./cpp_ai/2048_ai train \
>   --episodes 1000000 \
>   --threads 16 \
>   --alpha 0.1 \
>   --save cpp_ai_40min_16384.bin
> ```
>
> *如果你想在训练过程中观察耗时，可以先跑一个 10 万局的测试，计算每秒处理的局数，从而精确推算 40 分钟能跑多少局：*
> ```bash
> # 10万局测试命令
> ./cpp_ai/2048_ai train --episodes 100000 --threads 16 --alpha 0.1 --save test.bin
> ```
> *根据这次测试的耗时 $T$（秒），用公式 $\text{Episodes} = \frac{2400}{T} \times 100000$ 即可算出 40 分钟对应的精确局数。*
>
> ---
>
> ### 4. 验证与评估训练成果
>
> 由于 16384 是一个极高的目标，单凭 1-ply（直观评估）可能很难稳定达到。建议在评估和实际连接游戏时，使用更深的搜索层数（如 3-ply 或 4-ply）来发挥该权重的潜力。
>
> #### 离线评估新权重：
> 使用刚才训练好的权重进行 100 局测试，搜索深度设为 3（可以较好地展现 16384 的实力）：
>
> ```bash
> ./cpp_ai/2048_ai eval \
>   --episodes 100 \
>   --depth 3 \
>   --tt-size 512 \
>   --load cpp_ai_40min_16384.bin
> ```
> * `--tt-size 512`：将置换表（Transposition Table）扩大到 512MB（Mac Studio 内存充足，增大置换表可以显著加快 depth 3 及以上的搜索速度）。
>
> #### 连接 Pygame 运行：
> 1. 启动游戏本体：
>    ```bash
>    python 2048game_2.py
>    ```
> 2. 修改 `ntuple_ai_run.sh` 脚本中的权重路径为 `cpp_ai_40min_16384.bin`，并确保搜索深度适合实机演示（如 `--depth 3`）。然后运行：
>    ```bash
>    ./ntuple_ai_run.sh
>    ```
>    *提示：在游戏运行中按下 `[Esc]` 键可以降低 Pygame 动画延迟，以便 AI 以最快速度迈向 16384。*



### Q：预训练 & 评估

按照说明，训练了 cpp_ai_70min_16384.bin模型。还有socket通信，属于网络编程了。

> %./cpp_ai/2048_ai train --episodes 100000 --threads 16 --alpha 0.1 --save test.bin
>
> Training: 100000 episodes, 16 threads, alpha=0.1
> Done! 100000 episodes in 346.8s (288 eps/s)steps=3657     
>
> Best tile: 8192 Avg score: 65382 Avg steps: 2986
> Weights saved to test.bin (8 MB)
>
>
> hfyan@HongfeideMac-Studio 2048-game % python3
>
> Python 3.14.3 (main, Feb 3 2026, 15:32:20) [Clang 17.0.0 (clang-1700.6.3.2)] on darwin
> Type "help", "copyright", "credits" or "license" for more information.
> \>>> 100000*2400/360
> 666666.6666666666
> \>>> exit()
>
>
> % ./cpp_ai/2048_ai train \
>  --episodes 1000000 \
>  --threads 16 \
>  --alpha 0.1 \
>  --save cpp_ai_40min_16384.bin
>
> Training: 1000000 episodes, 16 threads, alpha=0.1
> Done! 1000000 episodes in 4229.3s (236 eps/s) steps=3900     
>
> Best tile: 16384 Avg score: 82970 Avg steps: 3633
> Weights saved to cpp_ai_40min_16384.bin (8 MB)
>
>
> % mv cpp_ai_40min_16384.bin cpp_ai_70min_16384.bin
>
>
> % ./cpp_ai/2048_ai eval
> episodes 100 \
> depth 3tt-size 512
> load cpp_ai_70min_16384.bin
> Weights loaded from cpp_ai_70min_16384.bin
> Evaluating:100 games,depth=3, TT=512MB
> Done! 100games in 2155.3s (0.0 games/s)
>
> Max tile distribution:
> 2048:1(1.0%)
> 4096:1(1.0%)
> 8192:98 (98.0%)
> Average score: 137696

![e205a3dba35087e4baca4820188c1c16](https://raw.githubusercontent.com/GMyhf/img/main/img/e205a3dba35087e4baca4820188c1c16.png)



> Q：训练不用GPU?我在跑  100 万局（1,000,000 episodes，用activity monitor看GPU利用率很低。
>
> 你的观察非常准确。在这个训练过程中，**GPU 的利用率确实会非常低（几乎为零），因为该 AI 的训练完全是在 CPU 上运行的。**
>
> 这主要由该算法的底层原理以及硬件设计决定，具体原因如下：
>
> ### 1. 算法本质是“查表法”，而非“深度学习”
> 虽然这个算法被称为“N-tuple 神经网络”，但它与当前主流的深度神经网络（如 CNN、Transformer、MCTS + Policy Net）有本质区别：
> * **无矩阵乘法**：深度学习需要进行大量的矩阵乘法（Dense Matrix Multiplication），这种计算非常适合 GPU 的成百上千个流处理器。
> * **高频随机查表**：N-tuple 算法的核心是**查表（Lookup Table）与稀疏更新**。它将棋盘状态转换为一个索引，然后直接去内存里的权重数组中读取和更新一个浮点数：
>   $$\text{weight}[index] \leftarrow \text{weight}[index] + \alpha \times \delta$$
>   这种操作在计算机体系结构中属于**访存密集型（Memory-bound）**和**稀疏随机访问**，而不是计算密集型。GPU 在处理这种零散、随机的内存读写时效率反而不如 CPU。
>
> ### 2. 权重数据极小，完美契合 CPU 缓存
> 整个 N-tuple 网络的总参数量只有约 **8.7 MB**：
> * 你的 Mac Studio（M 芯片）拥有极大的高速缓存（L2 Cache 和 System Cache，通常在数数十兆字节）。
> * 这 8.7 MB 的权重表在训练开始后，会**几乎完整地被加载进 CPU 的高速缓存（Cache）**中。
> * CPU 直接在纳秒级的 Cache 中进行读写更新，速度极快。如果把这些数据频繁地在 CPU 和 GPU 之间传输，反而会因为总线延迟和调度开销（Overhead）导致速度急剧下降。
>
> ### 3. 代码没有编写 GPU 加速指令
> 从工程实现角度看，`cpp_ai` 目录下的代码使用的是标准 C++ 语法和线程库（`std::thread`）。
> * 要使用 GPU 训练，代码必须显式调用图形或通用计算 API（如 Apple 的 **Metal** 框架、OpenCL 或 NVIDIA 的 CUDA）。
> * 本项目的代码中并没有编写这些 GPU 硬件加速接口，因此编译器（Clang）会将代码全部编译为 CPU 的机器指令，完全由 CPU 的 16 个性能核来承担计算。
>
> ### 总结
> 对于 2048 这种状态空间相对较小、使用时序差分查表法（TD-learning with LUT）的游戏，**多核 CPU 是最合适的计算介质**。你的 Mac Studio 拥有 16 个高带宽、低延迟的性能核，它们全载运行该算法时的效率已经远超普通的 GPU 实现。



> 从你分享的截图中可以看到，整个系统已经成功串联并流畅运行。
>
> ### 1. 训练与评估数据分析
>
> 从右侧终端的输出可以得出以下几个客观结论：
>
> * **训练吞吐量**：在 16 线程下，100 万局（1,000,000 episodes）耗时约 4229 秒（约 70.5 分钟），平均速度达到 **236 episodes/s**。这充分利用了 Mac Studio 性能核的并发优势，且在训练期间成功试探出了 **16384** 的上限（`Best tile: 16384`）。
> * **评估稳定性（Depth 3）**：在 `depth=3` 的深度评估中（100 局测试）：
>   * 达到 **8192** 的概率高达 **98.0%**。
>   * 平均分达到了 **137,696 分**。
>   这说明该权重在深度搜索的辅助下，已经具备了极高的鲁棒性，基本可以稳定在 8192 以上。
>   * *注：由于 depth=3 的决策树分支数呈指数级上升（Chance 层与 Max 层交替），100 局测试耗时 2155 秒（约 36 分钟），这也是高精度决策带来的计算代价。*
>
> ---
>
> ### 2. 关于 Socket 通信与本地网络编程
>
> 你提到的 **Socket 通信** 的确是本项目在工程设计上的一个重要闪光点。虽然它运行在单台机器上，但它使用了标准的**网络编程接口**。
>
> * **Unix 域套接字（Unix Domain Socket, `AF_UNIX`）**：
>   从脚本配置和日志中可以看到，项目使用的是 `/tmp/2048game.sock`。这是一种特殊的 Socket，它不需要经过网络协议栈（如 TCP/IP 的三次握手、IP 报头封装等），而是直接在内核中通过内存缓冲区传输数据。
> * **架构层面的解耦**：
>   这种“网络化”的设计让 Python（Pygame GUI 进程）作为服务器端，C++ AI 进程作为客户端。两者通过标准的套接字协议（`send`/`recv`）交换数据。
>   这种设计的精妙之处在于，**即便未来你将 C++ AI 部署在另一台局域网内的服务器上，或者改用其他语言（如 Rust 或 Go）重新编写 AI 客户端，游戏本体的代码也完全不需要做任何修改**，只需将 Unix Domain Socket 改为标准的 TCP Socket（`AF_INET`）即可。
>
> ---
>
> ### 3. 一个有趣的 GUI 渲染细节观察
>
> 从 Pygame 运行窗口（中间偏左）可以看到，当分数达到 97248 时，`current:` 和 `best:` 后面的数字末尾（`8`）似乎与前一个数字有轻微的重叠，或者字形有些拥挤。
>
> 这在 Pygame 字体渲染中是比较常见的现象：
> * **原因**：Pygame 的 `font.render()` 在渲染某些无衬线字体（如 Arial）的特定动态数字组合时，字宽计算可能会有微小偏差，或者在刷新文字时，前一次渲染的背景没有被完全擦除干净（导致前一个数字的残影留在了原处）。
> * **可能的微调方式**：在 Python 渲染分数的逻辑中，可以在每次绘制新分数前，用底色（浅灰色背景块）完全覆盖（blit）该区域，或者给字符之间手动增加一点像素间距（padding），这样可以使高分状态下的界面显示更加清晰。
>
> 目前，整个项目的闭环已经顺利完成，从底层的高并发算法训练到上层的跨进程网络协同，都得到了实际运行的验证。



## 3.3 示例：使用预训练模型进行问答

以Hugging Face Transformer为例，下述 `first_qa.py`代码载入本地中文预训练模型进行问答推理：



> | 模型                                     | 适用语言 | 用途     |
> | ---------------------------------------- | -------- | -------- |
> | `distilbert-base-cased-distilled-squad`  | 英文     | 英文问答 |
> | `uer/roberta-base-chinese-extractive-qa` | 中文     | 中文问答 |
>
> Q: 如何用**浏览器手动下载** `uer/roberta-base-chinese-extractive-qa` 模型，做到完全 **离线部署** 的步骤：
>
> 1. 打开模型页面
>
> 浏览器访问：https://huggingface.co/uer/roberta-base-chinese-extractive-qa
>
> 2. 进入 “Files and versions” 页面，手动下载以下几个关键文件：
>
> | 文件名                    | 说明                           |
>| ------------------------- | ------------------------------ |
> | `config.json`             | 模型结构配置                   |
> | `pytorch_model.bin`       | 模型权重（很大，400MB 左右）   |
> | `tokenizer_config.json`   | tokenizer 配置                 |
> | `vocab.txt`               | 中文词表（必需）               |
> | `special_tokens_map.json` | 特殊符号定义（可选但推荐）     |
> | `tokenizer.json`          | tokenizer 的二进制形式（可选） |
> 
> 你可以在网页中依次点击这些文件，然后点击右上角 “Download”。
>
> 
>
> 或者这里下载：
>
> https://disk.pku.edu.cn/link/AA5F507BA7BC504334ACA7FCBECFE64995
>Name: model-roberta-chinese-qa.zip
> Expires: Never
> Pickup Code: zXih



我的clab云虚拟机beijing.zhengmao.ltd，`AI_literacy`文件夹

```
[rocky@jensen AI_literacy]$ tree
.
├── first_qa.py
└── models
    └── roberta-chinese-qa
        ├── config.json
        ├── pytorch_model.bin
        ├── special_tokens_map.json
        ├── tokenizer_config.json
        └── vocab.txt

```



**创建独立的虚拟环境 & 安装 深度学习框架 PyTorch**

> 为每个项目创建独立的虚拟环境，避免依赖冲突。
>
> ```
> cd ~/AI_literacy  # 替换为你的项目路径
> python3 -m venv .venv
> source .venv/bin/activate
> ```
>
> > 退出虚拟环境命令：`deactivate`
>
> 
>
> 安装 深度学习框架 PyTorch  
> pip install -U transformers  
> pip install torch



`first_qa.py`

```python
from transformers import pipeline

qa = pipeline(
    "question-answering",
    #model="./models/distilbert-base-cased-distilled-squad",
    model="./models/roberta-chinese-qa",
    tokenizer="./models/roberta-chinese-qa",
    framework="pt"  # 显式要求使用 PyTorch
)

result = qa(
    question="谁是人工智能之父？",
    context="艾伦·图灵是人工智能之父，被誉为计算机科学的奠基人。"
)

print(result)       # 看完整结果
print(result["answer"])  # 输出应为：艾伦·图灵
```

上述代码中，指定了本地下载的中文问答模型目录，通过pipeline接口直接进行抽取式问答推理。在真实应用中，可替换为更强大的模型（如GPT-4）并结合语言提示（Prompt）实现更复杂的自然语言任务。

运行结果展示

```
(.venv) [rocky@jensen AI_literacy]$ python first_qa.py 
Device set to use cpu
{'score': 0.31832563877105713, 'start': 0, 'end': 5, 'answer': '艾伦·图灵'}
艾伦·图灵
```



> 用一个本地的中文问答模型，在一段文本里提取问题的答案。
>
> 1. 引入 Hugging Face 的 `pipeline`
>
> ```python
>from transformers import pipeline
> ```
> 
> 这是 Hugging Face `transformers` 提供的简洁 API，用于快速构建 NLP 任务管道，例如文本分类、问答、翻译等。
>
> 
>
> 2. 构造问答任务的 pipeline（使用本地模型）
>
> ```python
>qa = pipeline(
>  "question-answering",
>  #model="./distilbert-base-cased-distilled-squad",
>     model="./roberta-chinese-qa",      # 使用本地中文模型目录
>     framework="pt"                     # 强制使用 PyTorch
>    )
> ```
> 
> 参数说明：
>
> | 参数                           | 含义                                                         |
>| ------------------------------ | ------------------------------------------------------------ |
> | `"question-answering"`         | 指定任务类型是抽取式问答（extractive QA）                    |
> | `model="./roberta-chinese-qa"` | 指向本地下载的模型文件夹，里面包含 `pytorch_model.bin`、`config.json` 等 |
> | `framework="pt"`               | 显式要求使用 PyTorch，而不是 TensorFlow，防止意外加载 TF 模型引发错误 |
> 
> `tokenizer` 会自动从模型目录中加载，无需单独指定。
>
> ------
>
> 3. 运行问答推理
>
> ```python
>result = qa(
>  question="谁是人工智能之父？",
>  context="艾伦·图灵是人工智能之父，被誉为计算机科学的奠基人。"
>    )
> ```
> 
> 说明：
>
> - 输入的 `question` 是用户要问的问题；
>- `context` 是包含答案的上下文文本（模型会在里面查找答案）；
> - 返回的是一个包含 **预测答案位置、内容、置信度** 的字典结构。
> 
> 
>
> 🛠 常见补充建议：
>
> - **更复杂 context**：你可以给它更多段落，它会找最有可能的答案；
>
> - **中文精度提高**：你可以尝试 `hfl/chinese-roberta-wwm-ext-large` 之类的模型；
>
> 



# 4. 神经网络、深度学习和具体应用

如果智能体应该表现得像人类一样，那么它可能需要学习。学习是一种复杂的生物现象，即使是人类自己也没有完全理解。要使人工智能体学习肯定不是件容易的事情。但是在过去已经有好几种方法为未来建立了希望。大多数方法使用了归纳学习或从例子中学习这意味着把很大集合的问题和解法都给计算机，让计算机从中学习。其中一种方法不必使用复杂的数学概念来描述，它就是**神经网络**（neural networks）。神经网络试图使用神经元网络去模仿人脑的学习过程。

![image-20251210102820746](https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251210102820746.png)



图 这一层级关系图展示了不同领域之间的关系。大语言模型是深度学习技术的具体应用，能够处理和生成类似人类语言的文本；深度学习是机器学习的一个分支，主要使用多层神经网络；机器学习和深度学习致力于开发算法，使计算机能够从数据中学习，并执行需要人类智能水平的任务

如图所示，深度学习是机器学习的一个分支，它主要利用3层及以上的神经网络（深度神经网络）来建模数据中的复杂模式和抽象特征。与深度学习不同，传统的机器学习往往需要人工进行特征提取。这意味着人类专家需要为模型识别和挑选出最相关的特征。
尽管人工智能领域现在由机器学习和深度学习所主导，但该领域也涉及其他方法，比如基于规则的系统、遗传算法、专家系统、模糊逻辑或符号推理



**生物神经元**（biological neurons）

人脑中有数以亿计的处理单元，称为**神经元**（neurons）。每个神经元平均与数以千计的其他神经元相连。神经元由三部分构成：胞体（soma）、轴突（axon）和树突（dendrites）。如图所示。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251207131353912.png" alt="image-20251207131353912" style="zoom:50%;" />

<center>图：一个简单的神经元</center>



胞体(身体)中含有细胞核（nucleus）：它是处理器。树突起到输人设备的作用：它接收其他神经元的输人。轴突起到输出设备的作用：它把输出送到其他神经元。神经键（synapse）是神经元的轴突和其他神经元的树突的连接点。树突从相邻的神经元中收集电信号，把它传给胞体。神经键的工作就是给传到相邻神经元的信号上加上权重：它根据产生的化学物质的数量来判断是强连接还是弱连接。

一个神经元有两种状态：兴奋和抑制。如果接收的信号总量达到一个值，身体就兴奋，并触发一个输出信号，该信号传给轴突，最终传给其他的神经元。如果接收的信号总量没有达到阈值，神经元仍然处于抑制状态：它不触发或产生输出。

**感知器**（perceptrons）

感知器是一个类似于单个生物神经元的人工神经元。它带有一组具有权重的输入，对输入求和，把结果与阈值进行比较。如果结果大于阈值，感知器触发;否则，不触发。当感知器触发时，输出为1；不触发，输出为0。图显示了一个带有5个输人(`x1~x5`)和5个权重(`w1~w5`)的感知器。在这个感知器中，如果T是阈值，输出值确定如下：
S=x1·w1+x2·w2+x3·w3+x4·w4+x5·w5

if S>T, then y=1, else y=0

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251207132606730.png" alt="image-20251207132606730" style="zoom: 67%;" />

<center>感知器</center>



**多层网络**（multilayer networks）

几个层次的感知器可以组合起来，形成多层**神经网络**。每一层的输出变成下一层的输人。第一层称为输入层（input layer），中间层称为隐藏层（hidden layers），最后一层称为输出层（output layer）。输人层中的节点不是神经元，它们是分配器。隐藏的节点通常用来给上一层的输出加上权重的。图显示了一个三层的神经网络。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251207133112125.png" alt="image-20251207133112125" style="zoom: 67%;" />

<center>多层神经网络</center>



> **T29741: 神经网络之国**
>
> 卷积、快速幂，http://cs101.openjudge.cn/practice/29741/
>
> 随着深度学习的兴起，许多国家也变得越来越像神经网络。这些“神经网络国家”被构建成了层级结构，每一层代表一个城市层，具有多个城市，并且整个国家从一个入口城市出发，最终到达一个出口城市。
>
> 现在，这个神经网络国家一共有 L 层，每层有 N 个城市。对于任意两个相邻的层 L_1 和 L_2，L_1 中的每个城市都与 L_2 中的每个城市相连。更具体地说，从 L_1 的任意城市出发到 L_2 中的第 j 个城市的代价为 c_j，而这个代价与 L_1 中的起点城市无关（即所有从 L_1 出发到 L_2 的边，指向同一目标城市的代价相同）。
>
> 整个国家的路径可以分为三段：
>
> 1. 从入口点到第 1 层中的每个城市（共 N 个代价）。
> 2. 各相邻层之间的连接代价（每一对相邻层之间有 N 个代价）。
> 3. 从第 L 层中的每个城市到出口点的代价（N 个代价）。
>
> Doctor P. 现在需要你帮助他计算，有多少条从入口到出口的路径，其总代价可以被给定的整数 M 整除。
>
> 你只需输出这样的路径条数，结果对 10^9 + 7 取模。
>
> 样例图示：
>
> <img src="http://media.openjudge.cn/images/upload/1705/1764416020.jpg" alt="img" style="zoom: 15%;" />
>
> **输入**
>
> 输入共四行。
>
> \- 第一行包含三个整数 N, L, M，分别表示每层的城市数量、层数，以及所需整除的代价模数。
> \- 第二行包含 N 个整数，表示从入口点到第 1 层每个城市的代价。
> \- 第三行包含 N 个整数，表示任意相邻层之间的代价数组 c_1, c_2, ..., c_N，其中 c_j 表示连接至每层中第 j 个城市的代价。
> \- 第四行包含 N 个整数，表示从第 L 层的每个城市到出口的代价。
>
> 1 <= N <= 10^6
>
> 2 <= L <= 10^5
>
> 2 <= M <= 100
>
> 0 <= cost <= M
>
> **输出**
>
> 输出一个整数，表示从入口到出口总代价可以被 M 整除的路径条数，结果对 10^9 + 7 取模。
>
> 样例输入
>
> ```
> 2 3 13
> 4 6
> 2 1
> 3 4
> ```
>
> 样例输出
>
> ```
> 2
> ```
>
> 提示
>
> 动态规划
>
> 该国家结构如下，共有 3 层，每层有 2 个城市：
>
> \- 入口到第一层城市的代价分别为 4 和 6。
> \- 每对相邻层之间，连接至第一个城市的代价为 2，至第二个城市的代价为 1。
> \- 最后一层到出口的代价分别为 3 和 4。
>
> 共计有 N^L = 2^3 = 8 条路径。仅有两条路径的总代价可被 13 整除。
>
> 来源
>
> TA-xjk



> ## M29740:神经网络
>
> 拓扑排序, AI, http://cs101.openjudge.cn/2025springcs201testing/M29740/
>
> 随着深度学习技术的发展，神经网络已广泛应用于图像识别、自然语言处理、推荐系统等多个领域。近年来，图神经网络（Graph Neural Networks, GNN）作为一种能够处理非欧式结构化数据的深度学习方法，越来越受到研究者关注。小P同学最近在学习图神经网络的基础知识时，尝试设计了一个简化的“前馈图神经网络”模型，并希望借助编程来验证其推理过程是否合理。
>
> 在小P的模型中，一个图神经网络被抽象成一个**有向图**，图中的节点代表神经元（或计算单元），边则表示信息的传递通道。任意两个节点之间逻辑上至多视为一条有向边。下图是一个神经元节点的示意图：
>
> <img src="http://media.openjudge.cn/images/upload/8957/1749021962.jpg" alt="img" style="zoom: 33%;" />
>
> 神经元（编号为 i）
>
> 图中，X1 ~ X3 表示来自上游节点的信息输入，Y1 ~ Y2 是向下游节点的输出通道，Ci 表示神经元当前的激活值（activation），而 Ui 是该节点的偏置项（bias），可视为其内在的阈值参数。
>
> 神经元按一定的顺序排列，构成整个图神经网络。在小P的模型之中，神经元近似于分层摆放，可以近似视作输入层、若干隐藏层与输出层；信息只能沿有向边由前向后传播。下图是一个最简单的三层神经网络的例子。
>
> <img src="http://media.openjudge.cn/images/upload/8775/1749021978.jpg" alt="img" style="zoom:33%;" />
>
> > 现实中若某些突触损坏，会产生“闭环反馈”使整个网络失效。若这幅有向图 **存在回路（哪怕仅为自环）**，称为**神经坏死**，网络将彻底无法工作。
>
> 小P定义的神经元更新规则如下（令 n 表示总神经元数量）：
>
> <img src="http://media.openjudge.cn/images/upload/1261/1749022001.jpg" alt="img" style="zoom: 50%;" />
>
> 其中：
>
> - Wji 表示从节点 j 到节点 i 的边权重（可以为负值）
> - Cj 是上游神经元的当前激活值
> - Ui 是当前神经元的偏置项
> - 若 Ci > 0，则该神经元处于激活（active）状态，下一时刻将以强度Ci 向下一层传递信号；否则，它将保持静默（inactive）
>
> 当输入层（入度为0的节点）的神经元激活后，该网络模型将以类似于图神经网络的方式逐层传播信号，最终在输出层（出度为0的节点）产生结果。
>
> 输入
>
> 输入文件第一行是两个整数 n（1≤n≤100）和 p（0 ≤ p ≤ n(n-1)）。
>
> 接下来 n 行，每行 2 个整数，第 i+1 行是神经元 i 最初状态和其阈值（Ui），非输入层的神经元开始时状态必然为 0。
>
> 再下面 p 行，每行有两个整数 i,j 及一个整数 Wij，表示连接神经元 i,j 的边权值为 Wij。(i,j) 二元组可重复出现，若重复则视作一条边，将权重累加即可。
>
> 输出
>
> 输出文件包含若干行，每行有 2 个整数，分别对应一个神经元的编号，及其最后的状态，2 个整数间以空格分隔。仅输出最后状态大于 0 的输出层神经元状态，并且按照编号由小到大顺序输出。
>
> 若图中存在任何有向环（神经坏死），或所有输出层神经元最后状态均 ≤0，则输出 NULL。
>
> 样例输入
>
> ```
> 样例1：
> 5 6
> 1 0
> 1 0
> 0 1
> 0 1
> 0 1
> 1 3 1
> 1 4 1
> 1 5 1
> 2 3 1
> 2 4 1
> 2 5 1
> 
> 样例2：
> 2 2
> 1 0
> 0 0
> 1 2 1
> 2 1 1
> ```
>
> 样例输出
>
> ```
> 样例1：
> 3 1
> 4 1
> 5 1
> 
> 样例2：
> NULL
> ```
>
> 提示
>
> 拓扑排序，AI
>
> 输入层神经元状态不需减去其偏置项
> 输入层可以激活也可以不激活，C <= 0 是不激活输入层
>
> C/C++，变量类型需要考虑long long以防止溢出
>
> 来源
>
> TA-xjk



深度学习是连接主义流派的核心方法之一，其核心思想是利用**多层神经网络**自动从数据中学习层次化的特征表示。本节将系统介绍神经网络的关键训练机制——**反向传播算法**，并结合5个由浅入深的应用示例，帮助读者掌握从基础建模到复杂图像分类任务的完整流程。



**反向传播**（Backpropagation）

**反向传播** 是训练神经网络的基石算法。它通过两个阶段协同工作： 

1. **前向传播**：输入数据逐层经过加权求和与非线性激活函数（如 ReLU、Softmax），最终输出预测结果； 
2. **反向传播**：基于损失函数（如交叉熵、均方误差）计算预测值与真实标签之间的误差，并利用**链式法则**高效地计算损失对每一层参数的梯度。

随后，优化器（如 SGD、Adam）依据这些梯度更新网络权重，目标是最小化整体损失。这一机制使得训练包含数十甚至上百层的深度网络成为可能，直接推动了深度学习的爆发式发展。

**反向传播算法流程**

1. **前向传播**：输入 → 逐层计算 → 输出预测值 $\hat{y}$ 
2. **损失计算**：$L = \text{Loss}(\hat{y}, y)$ 
3. **梯度反传**：从输出层向输入层，逐层计算 $\frac{\partial L}{\partial w}$ 和 $\frac{\partial L}{\partial b}$ 
4. **参数更新**：例如使用梯度下降：
   $$ w \leftarrow w - \eta \cdot \frac{\partial L}{\partial w} $$
   其中 $\eta$ 为学习率。 
5. **迭代训练**：遍历训练集多个 epoch，直至损失收敛或达到预设轮次。

> **只要你按梯度的反方向走，数学保证你的 $L$ 一定会减小（只要步长 $\eta$ 别太大）。**
>
> 一次迭代变化量是 **学习率 $\times$ 梯度**（$\eta \cdot \frac{\partial L}{\partial w}$）。
>
> * **前向传播**算出你在多高 ($L$)。
>
> * **反向传播**算出你脚下的坡度 ($\frac{\partial L}{\partial w}$)。物理意义是：“当你改变一点点 `w` 时，`L` 变化得有多快（以及往哪个方向变）。”
>
> * **参数更新**决定你往下跳多远 ($\Delta w = -\eta \cdot \text{梯度}$)。
>
>   
>
> $$ \Delta w = - \eta \times \frac{\partial L}{\partial w} $$
> 其中：
>
> *   $\Delta w$：参数的变化量（这一步走多远）。
> *   $\eta$（Eta）：**学习率**（是一个预设的常数，比如 0.01），而不是损失值 $L$。
> *   $\frac{\partial L}{\partial w}$：**梯度/偏导数**（告诉我们哪个方向下降最快，以及有多陡）。
>
> **Q：如何直观理解这三个物理量？**
>
> 为了理解“单位时间变化”，可以用**“下山”**的物理模型来类比：
>
> *   **$L$ (Loss / 损失)**：代表你当前所在的**海拔高度**。
>     *   *目标*：走到海拔最低的山谷。
> *   **$w$ (Weight / 参数)**：代表你所在的**地图坐标**（经纬度）。
> *   **$\frac{\partial L}{\partial w}$ (Gradient / 梯度)**：代表你脚下地面的**坡度（倾斜程度）**。
>     *   如果坡度很大，说明这里很陡；如果坡度为0，说明是平地。
> *   **$\eta$ (Learning Rate / 学习率)**：代表你的**步长**（或者可以说是你跨出一步的时间跨度）。
>
> **现在的逻辑是：**你需要用**“步长（$\eta$）”**乘以**“坡度（梯度）”**，来决定你下一步往那个方向迈多大。
>
> **Q：为什么是“学习率 $\times$ 偏导”？**
>
> 在微积分中：
>
> 1.  **导数（偏导）的物理意义是“速度”或“趋势”**：
>     $\frac{\partial L}{\partial w}$ 告诉我们在当前点，如果我们稍微改变一点点 $w$，$L$ 会变化多快。
>
> 2.  **更新公式的本质**：
>     我们希望 $w$ 往 $L$ 减小的方向移动。
>     $$ w_{new} = w_{old} - \text{步长} \times \text{坡度} $$
>     *   如果**坡度很大**（梯度大），说明离谷底还远或者地形很陡，我们通常会走得比较急（变化量大）。
>     *   如果**坡度很小**（梯度接近0），说明快到谷底了，我们会慢慢走（变化量小），以免走过头。
>     *   **学习率 $\eta$** 起到了调节器的作用。
>
> 

> ⚠️ **注意**：深层网络易遭遇**梯度消失**（vanishing gradients）或**梯度爆炸**（exploding gradients）问题，尤其在使用 Sigmoid 或 Tanh 激活函数时。现代实践中常采用 **ReLU 激活函数**、**批归一化（BatchNorm）** 和**残差连接（ResNet）** 等技术加以缓解。



**交互可视化：理解神经网络**

Google 提供了一个优秀的交互式神经网络训练工具，帮助直观理解模型如何分离非线性可分数据：

https://developers.google.com/machine-learning/crash-course/neural-networks/interactive-exercises?hl=zh-cn

**任务目标**：配置一个神经网络，使其能够将下图中的橙点与蓝点分开，并在训练数据和测试数据上实现低于 0.2 的损失。

**操作指南：**

1. 调整网络结构：
   - 点击 **HIDDEN LAYERS** 左侧的 **+ / –** 添加/删除隐藏层；
   - 点击某隐藏层上方的 **+ / –** 调整该层神经元数量。
2. 修改超参数：
   - 从 **Learning rate** 下拉菜单选择合适的学习率（建议尝试 0.01 ~ 0.1）；
   - 从 **Activation** 下拉菜单选择激活函数（推荐 **ReLU**）。
3. 点击 ▶️ 开始训练，观察损失曲线与决策边界演化。
4. 若未达标，点击 **Reset** 并尝试新配置。

**成功示例截图如下**（损失均低于 0.2）：

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/6e8ec7f85c470b44edc373985d94337c.png" alt="6e8ec7f85c470b44edc373985d94337c" style="zoom: 50%;" />



**PyTorch 实战：5 个神经网络应用示例**

以下示例涵盖从手动实现到现代架构的完整演进路径。后四个示例使用PyTorch编写， 教程在 https://www.runoob.com/pytorch/pytorch-tutorial.html 或参看附录 A。

| 编号 | 示例名称                     | 内容概述                                          | 技术要点                                   |
| ---- | ---------------------------- | ------------------------------------------------- | ------------------------------------------ |
| 1    | `0_xor_bp_neural_net_manual` | 手动实现反向传播，解决 XOR 非线性分类问题         | 张量运算、梯度手动计算、无框架依赖         |
| 2    | `1_iris_neural_network`      | 使用全连接网络对鸢尾花数据集进行三分类            | 数据加载、`nn.Module`、交叉熵损失          |
| 3    | `2_mnist_resnet18`           | 微调 ResNet18 对 MNIST 手写数字分类               | 迁移学习、图像预处理、`torchvision.models` |
| 4    | `3_cifar10_resnet18`         | 在 CIFAR-10 上训练 ResNet18                       | 数据增强、学习率调度、GPU 加速             |
| 5    | `4_tiny_imagenet_resnet50`   | 使用 ResNet50 处理更复杂的 Tiny ImageNet 分类任务 | 大规模数据处理、模型微调、性能评估         |

> 所有代码均可在配套仓库（https://github.com/GMyhf/2025spring-cs201/tree/main/LLM）中找到，建议按顺序实践，逐步掌握从“理解原理”到“工程部署”的完整技能链。



## 4.1 在异或问题（XOR）中手动实现反向传播

异或问题是经典的非线性可分问题，用来演示神经网络的学习能力。一个简单的神经网络可手动实现反向传播来解决异或。以下先给出简洁的伪代码，再给出可以运行的Python代码示例展示了反向传播更新权重的方式：

```python
# 假设网络结构：输入层2个节点，隐藏层2个节点，输出层1个节点
# 初始化权重
W1 = random([...])  # 输入到隐藏层
W2 = random([...])  # 隐藏层到输出层
learning_rate = 0.1

for epoch in range(epochs):
    # 前向计算
    hidden = sigmoid(X @ W1)       # X为输入[四组XOR输入]
    output = sigmoid(hidden @ W2)  # 预测
    # 计算误差
    error = (y - output)           # y为真实标签
    # 反向传播（链式法则）
    dW2 = hidden.T @ (error * output * (1 - output))
    dW1 = X.T @ ((error * output * (1 - output)) @ W2.T * hidden * (1 - hidden))
    # 更新权重
    W2 += learning_rate * dW2
    W1 += learning_rate * dW1

```



Backpropagation in Neural Network

https://www.geeksforgeeks.org/machine-learning/backpropagation-in-neural-network/



反向传播（Back Propagation），又称为“误差的反向传播”，是一种用于训练神经网络的方法。其目标是通过调整网络中的权重（weights）和偏置（biases），来减小模型预测输出与实际输出之间的差异。

它通过迭代方式更新权重和偏置，以最小化损失函数（cost function）。在每一个训练周期（epoch）中，模型会根据误差梯度（error gradient）更新参数，常用的优化算法包括梯度下降（Gradient Descent）或随机梯度下降（SGD）。该算法使用微积分中的<mark>链式法则</mark>来计算梯度，从而能够有效地穿越复杂的神经网络结构，优化损失函数。

> Back Propagation is also known as "Backward Propagation of Errors" is a method used to train neural network . Its goal is to reduce the difference between the model’s predicted output and the actual output by adjusting the weights and biases in the network.
>
> It works iteratively to adjust weights and bias to minimize the cost function. In each epoch the model adapts these parameters by reducing loss by following the error gradient. It often uses optimization algorithms like **gradient descent** or **stochastic gradient descent**. The algorithm computes the gradient using the chain rule from calculus allowing it to effectively navigate complex layers in the neural network to minimize the cost function.

<img src="https://media.geeksforgeeks.org/wp-content/uploads/20250701163824448467/Backpropagation-in-Neural-Network-1.webp" alt="Backpropagation-in-Neural-Network-1" style="zoom:67%;" />

<center>A simple illustration of how the backpropagation works by adjustments of weights</center>

<center>通过权重调整，简单展示反向传播的工作方式</center>



**反向传播的重要性：**

- **高效的权重更新**：利用链式法则计算损失函数对每个权重的梯度，从而高效地更新参数。
- **良好的扩展性**：适用于多层结构和复杂架构，是深度学习可行的核心算法。
- **自动学习能力**：训练过程自动进行，模型会不断调整自身来优化性能。

> **Back Propagation** plays a critical role in how neural networks improve over time. Here's why:
>
> 1. **Efficient Weight Update**: It computes the gradient of the loss function with respect to each weight using the chain rule making it possible to update weights efficiently.
> 2. **Scalability**: The Back Propagation algorithm scales well to networks with multiple layers and complex architectures making deep learning feasible.
> 3. **Automated Learning**: With Back Propagation the learning process becomes automated and the model can adjust itself to optimize its performance.



### 4.1.1 反向传播算法的工作流程

反向传播算法包括两个主要步骤：**前向传播（Forward Pass）** 和 **反向传播（Backward Pass）**

#### 1. 前向传播

输入数据从输入层开始，经过带权重的连接传递到隐藏层。例如，一个有两个隐藏层 h1 和 h2 的网络中，h1 的输出作为 h2 的输入。在应用激活函数前，还会加上偏置项。

每一层都会计算输入的加权和（记作 `a`），再通过如 ReLU 等激活函数得到输出 `o`。最终，输出层通常会使用 softmax 激活函数将结果转换为分类概率。

> ### Working of Back Propagation Algorithm
>
> The Back Propagation algorithm involves two main steps: the **Forward Pass** and the **Backward Pass**.
>
> ### 1. Forward Pass Work
>
> In **forward pass** the input data is fed into the input layer. These inputs combined with their respective weights are passed to hidden layers. For example in a network with two hidden layers (h1 and h2) the output from h1 serves as the input to h2. Before applying an activation function, a bias is added to the weighted inputs.
>
> Each hidden layer computes the weighted sum (`a`) of the inputs then applies an activation function like [**ReLU (Rectified Linear Unit)**](https://www.geeksforgeeks.org/deep-learning/relu-activation-function-in-deep-learning/) to obtain the output (`o`). The output is passed to the next layer where an activation function such as [**softmax**](https://www.geeksforgeeks.org/deep-learning/the-role-of-softmax-in-neural-networks-detailed-explanation-and-applications/) converts the weighted outputs into probabilities for classification.

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/Backpropagation-in-Neural-Network-2.webp" alt="Backpropagation-in-Neural-Network-2" style="zoom:67%;" />

<center>The forward pass using weights and biases</center>

> h1,h2，表示隐藏层的两个神经元



#### 2. Backward Pass反向传播

反向传播阶段会将预测输出与实际输出的误差向后传递，并调整每一层的权重和偏置。常见的误差计算方法是**均方误差（MSE）**：

$MSE = (\text{Predicted Output} − \text{Actual Output})^2$

在误差计算之后，通过链式法则计算梯度，这些梯度用于指导权重和偏置的更新方向和幅度。反向传播过程是逐层执行的，<mark>激活函数的导数在梯度计算中起着关键作用</mark>。



**反向传播的示例：机器学习中的案例**

假设我们使用 sigmoid 激活函数，目标输出为 0.5，学习率为 1。

> #### 2. Backward Pass
>
> In the backward pass the error (the difference between the predicted and actual output) is propagated back through the network to adjust the weights and biases. One common method for error calculation is the [**Mean Squared Error (MSE)**](https://www.geeksforgeeks.org/maths/mean-squared-error/) given by:
>
> $MSE = (\text{Predicted Output} − \text{Actual Output})^2$
>
> Once the error is calculated the network adjusts weights using **gradients** which are computed with the chain rule. These gradients indicate how much each weight and bias should be adjusted to minimize the error in the next iteration. The backward pass continues layer by layer ensuring that the network learns and improves its performance. The activation function through its derivative plays a crucial role in computing these gradients during Back Propagation.
>
> 
>
> **Example of Back Propagation in Machine Learning**
>
> Let’s walk through an example of Back Propagation in machine learning. Assume the neurons use the sigmoid activation function for the forward and backward pass. The target output is 0.5 and the learning rate is 1.

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/Backpropagation-in-Neural-Network-3.webp" alt="Backpropagation-in-Neural-Network-3" style="zoom:67%;" />

<center>Example (1) of backpropagation sum</center>



### 4.1.2 前向传播

#### 1. 初始计算

The weighted sum at each node is calculated using:

> $a_j=\sum(w_{i,j}∗x_i)$

Where,

- $a_j$ is the weighted sum of all the inputs and weights at each node
- $w_{i,j}$ represents the weights between the $i^{th}$ input and the $j^{th}$ neuron
- $x_i$ represents the value of the $i^{th}$ input

`O (output):`After applying the activation function to `a`, we get the output of the neuron:

> $o_j = \text{activation function}(a_j)$

#### 2. Sigmoid函数

The sigmoid function returns a value between 0 and 1, introducing non-linearity into the model.

> $y_j = \frac{1}{1+e^{−a_j}}$ 

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/Backpropagation-in-Neural-Network-4.webp" alt="Backpropagation-in-Neural-Network-4" style="zoom:67%;" />

<center>To find the outputs of y3, y4 and y5</center>



#### 3. 输出计算

h1 节点：
$$
a_1 = (w_{1,1} \times x_1) + (w_{2,1} \times x_2)
$$

$$
a_1 = (0.2 \times 0.35) + (0.2 \times 0.7) = 0.21
$$

计算完 $a_1$ 后，我们可以继续计算 $y_3$ 的值：

$$
y_j = F(a_j) = \frac{1}{1 + e^{-a_1}}
$$

$$
y_3 = F(0.21) = \frac{1}{1 + e^{-0.21}} = 0.56
$$



h2 节点：
$$
a_2 = (w_{1,2} \times x_1) + (w_{2,2} \times x_2) = (0.3 \times 0.35) + (0.3 \times 0.7) = 0.315
$$

$$
y_4 = F(0.315) = \frac{1}{1 + e^{-0.315}} = 0.578
$$



输出节点 O3：
$$
a_3 = (w_{1,3} \times y_3) + (w_{2,3} \times y_4) = (0.3 \times 0.56) + (0.9 \times 0.58) = 0.702
$$

$$
y_5 = F(0.702) = \frac{1}{1 + e^{-0.702}} = 0.67
$$



> At h1 node
>
> Once we calculated the a1 value, we can now proceed to find the y3 value:
>
> Similarly find the values of y4 at h2 and y5 at O3



<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/Backpropagation-in-Neural-Network-5.webp" alt="Backpropagation-in-Neural-Network-5" style="zoom:67%;" />

<center>Values of y3, y4 and y5</center>



#### 4. 误差计算

Our actual output is 0.5 but we obtained 0.67**.** To calculate the error we can use the below formula:

> $Error_j=y_{target}−y_5$ 

=> 0.5−0.67=−0.17

Using this error value we will be backpropagating.



### 4.1.3 反向传播

#### 1. Calculating Gradients计算梯度

The change in each weight is calculated as:

> $Δw_{ij}=η×δ_j×O_j$

Where:

- $δ_j$ is the error term for each unit,
- $η$ is the learning rate.

#### 2. Output Unit Error输出层误差

For O3:

> $δ_5=y_5(1−y_5)(y_{target}−y_5)$

=0.67(1−0.67)(−0.17)=−0.0376

#### 3. Hidden Unit Error隐藏层误差

For h1:

> $δ_3=y_3(1−y_3)(w_{1,3}×δ_5)$

=0.56(1−0.56)(0.3×−0.0376)=−0.0027



For h2:

> $δ_4=y_4(1−y_4)(w_{2,3}×δ_5)$

=0.59(1−0.59)(0.9×−0.0376)=−0.0819



#### 4. Weight Updates权重更新

For the weights from hidden to output layer:

> $Δw_{2,3}=1×(−0.0376)×0.59=−0.022184$

New weight:

> $w_{2,3}(new)=−0.022184+0.9=0.877816$

For weights from input to hidden layer:

> $Δw_{1,1}=1×(−0.0027)×0.35=0.000945$

New weight:

> $w_{1,1}(new)=0.000945+0.2=0.200945$

Similarly other weights are updated:

- $w_{1,2}(new)=0.273225$
- $w_{1,3}(new)=0.086615$
- $w_{2,1}(new)=0.269445$
- $w_{2,2}(new)=0.18534$

The updated weights are illustrated below

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/Backpropagation-in-Neural-Network-5-20251127160556998.webp" alt="Backpropagation-in-Neural-Network-5" style="zoom:67%;" />

<center>Through backward pass the weights are updated</center>

> 上图权重没有更新，例如：$w_{2,2}$应该更新为0.18534



After updating the weights the forward pass is repeated yielding:

- y3=0.57
- y4=0.56
- y5=0.61

仍未达到目标值 0.5，因此继续进行反向传播，直到收敛。

> Since y5=0.61 is still not the target output the process of calculating the error and backpropagating continues until the desired output is reached.



This process demonstrates how Back Propagation iteratively updates weights by minimizing errors until the network accurately predicts the output.

> $Error=y_{target}−y_5$

=0.5−0.61=−0.11=0.5−0.61=−0.11

This process is said to be continued until the actual output is gained by the neural network.



### 4.1.4 用于 XOR 问题的反向传播实现

**Q: XOR 问题是什么？**

> XOR（异或）是一个经典的逻辑问题，它的输入输出如下：
>
> | 输入 A | 输入 B | 输出 |
> | ------ | ------ | ---- |
> | 0      | 0      | 0    |
> | 0      | 1      | 1    |
> | 1      | 0      | 1    |
> | 1      | 1      | 0    |
>
> 这个问题**不能用一条直线分开**（不是线性可分的），所以单层感知机无法解决，必须用**至少一个隐藏层的神经网络**。



> “**单层感知机**”（Single-Layer Perceptron）是神经网络最原始、最简单的形式，由 Frank Rosenblatt 在 1957 年提出。理解它，有助于明白为什么像 **XOR 这样的问题无法被它解决**，从而引出多层神经网络和反向传播的必要性。
>
> 单层感知机结构：
>
> - **输入层**：接收特征（比如 $x_1, x_2$）
> - **输出层**：**直接输出结果**（没有隐藏层！）
> - 每个输入有一个对应的权重 $w_1, w_2$，还有一个偏置 $b$
>
> **数学表达：**
> $$
> z = w_1 x_1 + w_2 x_2 + b
> \nonumber
> $$
>
> $$
> \text{output} = \begin{cases} 1 & \text{if } z \geq 0 \\ 0 & \text{if } z < 0 \end{cases}
> \nonumber
> $$
>
> > 注意：**没有激活函数（或只有阶跃函数）**，**没有隐藏层**，所以叫“单层”。
> >
> > 阶跃函数是“硬判决”，适合理论分析；但因为不可导，不能用于现代神经网络的训练。
>
> ------
>
> **单层感知机能做什么**？
>
> 它只能解决 **线性可分**（linearly separable）的问题。
>
> **例子：AND 门**
>
> | x₁   | x₂   | y    |
> | ---- | ---- | ---- |
> | 0    | 0    | 0    |
> | 0    | 1    | 0    |
> | 1    | 0    | 0    |
> | 1    | 1    | 1    |
>
> 可以用一条直线分开 0 和 1 → **线性可分** → **单层感知机可以学会**
>
> 比如：
> 取 (w_1 = 1, w_2 = 1, b = -1.5)
> 则：
>
> - (0+0-1.5 = -1.5 < 0 → 0)
> - (1+1-1.5 = 0.5 ≥ 0 → 1)
>
> 完美！
>
> ------
>
> **单层感知机不能做什么？**
>
> **XOR 问题（异或）：**
>
> | x₁   | x₂   | y    |
> | ---- | ---- | ---- |
> | 0    | 0    | 0    |
> | 0    | 1    | 1    |
> | 1    | 0    | 1    |
> | 1    | 1    | 0    |
>
> 在二维平面上画出来：
>
> ```
> (0,1) ● (y=1)        (1,1) ○ (y=0)
> 
> (0,0) ○ (y=0)        (1,0) ● (y=1)
> ```
>
> 你会发现：**无法用一条直线把 ● 和 ○ 完全分开**！
>
> → 这就是 **非线性可分问题**。
>
> **结论**： 
>
> > **单层感知机无法解决 XOR 问题**，因为它缺乏非线性表达能力。
>
> ------
>
> ** 那怎么办？——引入隐藏层！**
>
> 1969 年，Minsky 和 Papert 在《Perceptrons》一书中指出了这个局限，导致神经网络研究一度停滞。
>
> 直到后来人们发现：
>
> > **只要加一个隐藏层，并使用非线性激活函数（如 sigmoid、ReLU），神经网络就能逼近任意函数**（万能近似定理）。
>
> 于是，**多层感知机**（MLP） + **反向传播** 成为解决方案。
>
> ------
>
> **🔄 对比总结**
>
> | 特性                | 单层感知机         | 多层感知机（带反向传播） |
> | ------------------- | ------------------ | ------------------------ |
> | 隐藏层              | ❌ 没有             | ✅ 有（至少1层）          |
> | 激活函数            | 阶跃函数（不可导） | Sigmoid / ReLU（可导）   |
> | 能否解决 AND/OR/NOT | ✅ 可以             | ✅ 可以                   |
> | 能否解决 XOR        | ❌ 不行             | ✅ 可以                   |
> | 是否支持反向传播    | ❌ 不支持（不可导） | ✅ 支持                   |
> | 学习能力            | 仅线性分类         | 非线性建模               |
>
> ------
>
> 小知识
>
> - “感知机”（Perceptron）通常特指**单层、使用阶跃激活、用感知机学习规则更新权重**的模型。
> - 而我们今天说的“神经网络”，一般指**多层、可微激活、用梯度下降+反向传播训练**的模型，也叫 **多层感知机**（MLP），尽管名字里有“感知机”，但已经完全不同了。
>
> 



以下代码演示了如何在神经网络中使用反向传播来解决 XOR 问题。该神经网络包含：

> This code demonstrates how Back Propagation is used in a neural network to solve the XOR problem. The neural network consists of:
>

#### 1. 定义神经网络结构

输入层：2个节点，隐藏层：4个神经元，输出层：1个神经元，激活函数：Sigmoid

> We define a neural network as Input layer with 2 inputs, Hidden layer with 4 neurons, Output layer with 1 output neuron and use **Sigmoid** function as activation function.

- **self.input_size = input_size**: stores the size of the input layer
- **self.hidden_size = hidden_size:** stores the size of the hidden layer
- **self.weights_input_hidden = np.random.randn(self.input_size, self.hidden_size)**: initializes weights for input to hidden layer
- **self.weights_hidden_output = np.random.randn(self.hidden_size, self.output_size)**: initializes weights for hidden to output layer
- **self.bias_hidden = np.zeros((1, self.hidden_size)):** initializes bias for hidden layer
- **self.bias_output = np.zeros((1, self.output_size)):** initializes bias for output layer



```python3
import numpy as np


class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        self.input_size = input_size
        self.hidden_size = hidden_size
        self.output_size = output_size

        self.weights_input_hidden = np.random.randn(
            self.input_size, self.hidden_size)
        self.weights_hidden_output = np.random.randn(
            self.hidden_size, self.output_size)

        self.bias_hidden = np.zeros((1, self.hidden_size))
        self.bias_output = np.zeros((1, self.output_size))

    def sigmoid(self, x):
        return 1 / (1 + np.exp(-x))

    def sigmoid_derivative(self, x):
        return x * (1 - x)
```



#### 2. 定义前向传播

In Forward pass inputs are passed through the network activating the hidden and output layers using the sigmoid function.

- **self.hidden_activation = np.dot(X, self.weights_input_hidden) + self.bias_hidden**: calculates activation for hidden layer
- **self.hidden_output= self.sigmoid(self.hidden_activation)**: applies activation function to hidden layer
- **self.output_activation= np.dot(self.hidden_output, self.weights_hidden_output) + self.bias_output:** calculates activation for output layer
- **self.predicted_output = self.sigmoid(self.output_activation):** applies activation function to output layer





```python3
def feedforward(self, X):
    self.hidden_activation = np.dot(
        X, self.weights_input_hidden) + self.bias_hidden
    self.hidden_output = self.sigmoid(self.hidden_activation)

    self.output_activation = np.dot(
        self.hidden_output, self.weights_hidden_output) + self.bias_output
    self.predicted_output = self.sigmoid(self.output_activation)

    return self.predicted_output
```



#### 3. 定义反向传播

In Backward pass or Back Propagation the errors between the predicted and actual outputs are computed. The gradients are calculated using the derivative of the sigmoid function and weights and biases are updated accordingly.

- **output_error = y - self.predicted_output:** calculates the error at the output layer
- **output_delta = output_error * self.sigmoid_derivative(self.predicted_output):** calculates the delta for the output layer
- **hidden_error = np.dot(output_delta, self.weights_hidden_output.T):** calculates the error at the hidden layer
- **hidden_delta = hidden_error \* self.sigmoid_derivative(self.hidden_output):** calculates the delta for the hidden layer
- **self.weights_hidden_output += np.dot(self.hidden_output.T, output_delta) * learning_rate:** updates weights between hidden and output layers
- **self.weights_input_hidden += np.dot(X.T, hidden_delta) * learning_rate:** updates weights between input and hidden layers



```python3
def backward(self, X, y, learning_rate):
    output_error = y - self.predicted_output
    output_delta = output_error * \
        self.sigmoid_derivative(self.predicted_output)

    hidden_error = np.dot(output_delta, self.weights_hidden_output.T)
    hidden_delta = hidden_error * self.sigmoid_derivative(self.hidden_output)

    self.weights_hidden_output += np.dot(self.hidden_output.T,
                                         output_delta) * learning_rate
    self.bias_output += np.sum(output_delta, axis=0,
                               keepdims=True) * learning_rate
    self.weights_input_hidden += np.dot(X.T, hidden_delta) * learning_rate
    self.bias_hidden += np.sum(hidden_delta, axis=0,
                               keepdims=True) * learning_rate
```



#### 4. 训练网络

The network is trained over 10,000 epochs using the Back Propagation algorithm with a learning rate of 0.1 progressively reducing the error.

- **output = self.feedforward(X):** computes the output for the current inputs
- **self.backward(X, y, learning_rate):** updates weights and biases using Back Propagation
- **loss = np.mean(np.square(y - output)):** calculates the mean squared error (MSE) loss



```python3
def train(self, X, y, epochs, learning_rate):
    for epoch in range(epochs):
        output = self.feedforward(X)
        self.backward(X, y, learning_rate)
        if epoch % 4000 == 0:
            loss = np.mean(np.square(y - output))
            print(f"Epoch {epoch}, Loss:{loss}")
```

#### 5. 测试神经网络

- **X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]]):** defines the input data
- **y = np.array([[0], [1], [1], [0]]):** defines the target values
- **nn = NeuralNetwork(input_size=2, hidden_size=4, output_size=1):** initializes the neural network
- **nn.train(X, y, epochs=10000, learning_rate=0.1):** trains the network
- **output = nn.feedforward(X):** gets the final predictions after training





```python3
X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])

nn = NeuralNetwork(input_size=2, hidden_size=4, output_size=1)
nn.train(X, y, epochs=10000, learning_rate=0.1)

output = nn.feedforward(X)
print("Predictions after training:")
print(output)
```

**Output:**

![Screenshot-2025-03-07-130223](https://raw.githubusercontent.com/GMyhf/img/main/img/Screenshot-2025-03-07-130223.png)

<center>Trained Model</center>



训练初期损失为 0.2713，逐步下降到 0.0066（第8000轮）。最终模型可以很好地逼近 XOR 函数的输出，即：

- 对于输入 [0,0] 和 [1,1]，输出接近 0

- 对于输入 [0,1] 和 [1,0]，输出接近 1

  

> - The output shows the training progress of a neural network over 10,000 epochs. Initially the loss was high (0.2713) but it gradually decreased as the network learned reaching a low value of 0.0066 by epoch 8000.
> - The final predictions are close to the expected XOR outputs: approximately 0 for [0, 0] and [1, 1] and approximately 1 for [0, 1] and [1, 0] indicating that the network successfully learned to approximate the XOR function.



### 4.1.5 反向传播的优点

**易于实现**：适合初学者，无需太多神经网络背景

**结构简单，灵活应用**：从简单前馈到复杂卷积/循环网络都可使用

**高效**：直接根据误差更新权重，学习速度快

**良好的泛化能力**：有助于模型在新数据上表现更好

**可扩展性好**：适用于大型数据集和深层模型

> **Advantages of Back Propagation for Neural Network Training**
>
> The key benefits of using the Back Propagation algorithm are:
>
> 1. **Ease of Implementation:** Back Propagation is beginner-friendly requiring no prior neural network knowledge and simplifies programming by adjusting weights with error derivatives.
> 2. **Simplicity and Flexibility:** Its straightforward design suits a range of tasks from basic feedforward to complex convolutional or recurrent networks.
> 3. **Efficiency**: Back Propagation accelerates learning by directly updating weights based on error especially in deep networks.
> 4. **Generalization:** It helps models generalize well to new data improving prediction accuracy on unseen examples.
> 5. **Scalability:** The algorithm scales efficiently with larger datasets and more complex networks making it ideal for large-scale tasks.



### 4.1.6 反向传播面临的挑战

**梯度消失**：在深层网络中梯度可能过小，导致学习困难（特别是在使用 sigmoid/tanh 时）

**梯度爆炸**：梯度可能变得过大，使训练不稳定

**过拟合**：模型结构过于复杂时，可能记住训练集而非学习一般性规律

> **Challenges with Back Propagation**
>
> While Back Propagation is useful it does face some challenges:
>
> 1. **Vanishing Gradient Problem**: In deep networks the gradients can become very small during Back Propagation making it difficult for the network to learn. This is common when using activation functions like sigmoid or tanh.
> 2. **Exploding Gradients**: The gradients can also become excessively large causing the network to diverge during training.
> 3. **Overfitting:** If the network is too complex it might memorize the training data instead of learning general patterns.



### 4.1.7 完整代码

`xor_nn.py`

```python
# 对于XOR问题（输入为[0,0], [0,1], [1,0], [1,1]），期望输出为[0,1,1,0]
# 手动实现反向传播，没有使用深度学习框架，这有助于理解底层原理
# https://www.geeksforgeeks.org/backpropagation-in-neural-network/
import numpy as np


class NeuralNetwork:
    def __init__(self, input_size, hidden_size, output_size):
        self.input_size = input_size  # 输入特征维度
        self.hidden_size = hidden_size  # 隐藏层神经元数量
        self.output_size = output_size  # 输出层神经元数量

        # 输入层到隐藏层的权重，形状为 (输入维度, 隐藏层维度)
        self.weights_input_hidden = np.random.randn(self.input_size, self.hidden_size)
        # 隐藏层到输出层的权重，形状为 (隐藏层维度, 输出层维度)
        self.weights_hidden_output = np.random.randn(self.hidden_size, self.output_size)

        # 隐藏层的偏置，形状为 (1, 隐藏层维度)
        self.bias_hidden = np.zeros((1, self.hidden_size))
        # 输出层的偏置，形状为 (1, 输出层维度)
        self.bias_output = np.zeros((1, self.output_size))

    def sigmoid(self, x):  # 激活函数，将输入压缩到(0,1)区间
        return 1 / (1 + np.exp(-x))

    def sigmoid_derivative(self, x):
        return x * (1 - x)  # Sigmoid的导数，用于反向传播中的梯度计算

    def feedforward(self, X):
        # 隐藏层计算
        self.hidden_activation = np.dot(X, self.weights_input_hidden) + self.bias_hidden  # 线性变换
        self.hidden_output = self.sigmoid(self.hidden_activation)  # 激活函数

        # 输出层计算
        self.output_activation = np.dot(self.hidden_output, self.weights_hidden_output) + self.bias_output
        self.predicted_output = self.sigmoid(self.output_activation)

        return self.predicted_output

    def backward(self, X, y, learning_rate):
        # 计算输出层误差
        output_error = y - self.predicted_output  # 误差 = 真实值 - 预测值
        # 计算输出层的delta（梯度的一部分，损失对激活输入的梯度）
        output_delta = output_error * self.sigmoid_derivative(self.predicted_output)  # Delta = 误差 × 激活函数导数
        # output_delta = (y - ŷ) * σ'(z_output)

        # 计算隐藏层误差（反向传播）
        hidden_error = np.dot(output_delta, self.weights_hidden_output.T)  # 将误差从输出层反向传播到隐藏层
        # hidden_error = output_delta @ W_hidden_output^T
        # 计算隐藏层的delta（损失对隐藏层激活输入的梯度）
        hidden_delta = hidden_error * self.sigmoid_derivative(self.hidden_output)  # Delta = 误差 × 激活函数导数
        # hidden_delta = (hidden_error) * σ'(z_hidden)

        # 更新权重和偏置（使用梯度下降法）
        # 计算并更新隐藏层到输出层的权重
        self.weights_hidden_output += np.dot(self.hidden_output.T,
                                             output_delta) * learning_rate  # 权重更新量 = 学习率 × (隐藏层输出转置 × 输出层delta)
        # W_hidden_output += learning_rate * (hidden_output^T @ output_delta)

        # 更新输出层偏置，基于所有样本的输出层delta沿列求和
        self.bias_output += np.sum(output_delta, axis=0, keepdims=True) * learning_rate  # 偏置更新量 = 学习率 × (沿列求和输出层delta)
        # b_output += learning_rate * sum(output_delta)

        # 计算并更新从输入层到隐藏层的权重的梯度
        self.weights_input_hidden += np.dot(X.T, hidden_delta) * learning_rate  # 权重更新量 = 学习率 × (输入数据转置 × 隐藏层delta)
        # W_input_hidden += learning_rate * (X^T @ hidden_delta)

        # 更新隐藏层偏置，基于所有样本的隐藏层delta沿列求和
        # axis=0：沿列求和，聚合所有样本的梯度
        # keepdims=True：保持原矩阵的行数维度，确保偏置更新的形状兼容性
        self.bias_hidden += np.sum(hidden_delta, axis=0, keepdims=True) * learning_rate  # 偏置更新量 = 学习率 × (沿列求和隐藏层delta)
        # b_hidden += learning_rate * sum(hidden_delta)

    def train(self, X, y, epochs, learning_rate):
        for epoch in range(epochs):
            output = self.feedforward(X)  # 前向传播
            self.backward(X, y, learning_rate)  # 反向传播与参数更新
            if epoch % 4000 == 0:
                loss = np.mean(np.square(y - output))  # 计算均方误差
                print(f"Epoch {epoch}, Loss:{loss}")


X = np.array([[0, 0], [0, 1], [1, 0], [1, 1]])
y = np.array([[0], [1], [1], [0]])

# 输入维度 2（二维二进制特征），隐藏层4个神经元，输出层1个神经元（二分类问题）
nn = NeuralNetwork(input_size=2, hidden_size=4, output_size=1)
# 训练总轮次, 学习率
nn.train(X, y, epochs=10000, learning_rate=0.1)

output = nn.feedforward(X)
print("Predictions after training:")
print(output)
"""
Epoch 0, Loss:0.2653166263520884
Epoch 4000, Loss:0.007000926683956338
Epoch 8000, Loss:0.001973630232951721
Predictions after training:
[[0.03613239]
 [0.96431351]
 [0.96058291]
 [0.03919372]]
"""
```



最终训练后，该网络可以准确学习XOR逻辑（训练数据：${([0,0]\to0),([0,1]\to1),([1,0]\to1),([1,1]\to0)}$），输出接近预期。该示例验证了多层网络和反向传播能解决线性模型无法处理的问题。



## 4.2 基于简单的全连接网络鸢尾花数据集分类

**任务描述**：使用全连接神经网络对经典的Iris（鸢尾花）数据集进行多分类。鸢（yuān）尾花数据集包含三个类别，每个类别有50个样本，每个样本有四个特征：花萼长度、花萼宽度、花瓣长度、花瓣宽度。目标是根据这四个特征预测花的种类，属于多分类问题。

**关键步骤**：数据预处理（标准化、训练/测试集划分）、模型构建、训练与评估。示例代码（PyTorch）：



### 准备数据

鸢尾花数据集通常是通过scikit-learn的datasets模块获取的，所以可能需要结合scikit-learn来加载数据，然后转换成PyTorch的Tensor。

数据预处理方面，需要将特征数据和标签分开。特征数据需要标准化或归一化，因为不同特征的量纲可能不同，这对神经网络的训练有帮助。标签需要转换成数值形式，比如0、1、2，然后可能还需要转换为长整型张量，因为交叉熵损失函数在PyTorch中通常要求这样的格式。



### 训练模型和验证

构建神经网络模型。考虑到鸢尾花数据集相对简单，可能不需要很深的网络。一个简单的全连接网络可能就足够了。比如，输入层4个节点，隐藏层可以选择10个节点，输出层3个节点对应三个类别。激活函数可以用ReLU，输出层用Softmax，不过更常见的做法是使用CrossEntropyLoss，它内部已经结合了Softmax，所以输出层不需要显式应用Softmax。

接下来是数据集的划分，通常分为训练集和测试集。这里需要注意的是，鸢尾花数据集样本较少，可能需要进行分层抽样，确保每个类别的样本在训练集和测试集中的比例一致。或者使用交叉验证，但由于用户可能希望一个简单的示例，可能直接采用80-20的划分。

将数据转换为PyTorch的DataLoader，方便批量训练。数据集进行训练可以分小批量处理。

训练过程中，定义损失函数和优化器。交叉熵损失函数适用于多分类问题，优化器可以选择Adam或SGD。学习率需要适当设置，比如0.01或0.001。

训练循环部分，需要迭代多个epoch，在每个epoch中进行前向传播、计算损失、反向传播和参数更新。同时，可以监控训练过程中的损失和准确率的变化。

验证阶段，使用测试集评估模型的准确率，确保模型没有过拟合，并且泛化能力良好。

可能需要注意的问题包括数据标准化应该在训练集上计算均值和标准差，然后应用到测试集，避免数据泄漏。另外，标签是否需要转换为one-hot编码？在PyTorch中，CrossEntropyLoss不需要，因为标签是类别的索引。

现在，将这些步骤整合成代码：

1. 导入必要的库：torch, sklearn.datasets中的load_iris，sklearn.model_selection的train_test_split，以及相关的PyTorch模块。
2. 加载数据，划分训练集和测试集，并进行标准化处理。使用StandardScaler对特征进行标准化，处理时注意仅拟合训练数据。
3. 转换数据为PyTorch的Tensor，并创建DataLoader。可能由于数据量小，直接使用整个数据集作为批量。
4. 定义神经网络模型的结构，使用全连接层和ReLU激活函数。
5. 初始化模型、损失函数和优化器。
6. 编写训练循环，迭代epoch，计算损失，反向传播，记录准确率。
7. 在测试集上评估模型性能。

另外，由于鸢尾花数据集样本较少，模型可能会很快过拟合，所以可能需要早停或者调整网络结构，比如减少隐藏层的大小，或者添加正则化，比如Dropout层。不过，作为示例，可能保持简单即可。

这样应该能完成一个基本的分类任务。不过可能需要调整超参数，比如学习率、epoch次数，或者网络结构，以达到更好的效果。例如，如果准确率不够高，可以尝试增加隐藏层的大小，或者增加更多的层。但鸢尾花数据集相对简单，可能简单的模型就足够。

另外，可能需要注意数据划分时的随机种子，确保结果可复现。此外，标准化处理是否正确应用，避免数据泄漏。在示例中，已经正确使用fit_transform在训练集，transform在测试集。



以下是使用PyTorch实现Fisher鸢尾花数据集分类的Python程序`iris_neural_network.py`，强调使用了神经网络进行分类。

如果缺少module，安装即可，例如：pip install torch scikit-learn torchvision matplotlib等。



**完整`iris_neural_network.py`代码**

```python
import torch, torch.nn as nn, torch.optim as optim
from torch.utils.data import TensorDataset, DataLoader
from sklearn.datasets import load_iris
from sklearn.model_selection import train_test_split
from sklearn.preprocessing import StandardScaler


# 定义模型结构
class IrisNet(nn.Module):
    def __init__(self, input_size=4, hidden_size=10, num_classes=3):
        super(IrisNet, self).__init__()
        self.net = nn.Sequential(
            nn.Linear(input_size, hidden_size),
            nn.ReLU(),
            nn.Linear(hidden_size, num_classes)
        )

    def forward(self, x):
        return self.net(x)


# 训练函数
def train(model, dataloader, criterion, optimizer, device):
    model.train()
    running_loss = 0.0
    for batch_X, batch_y in dataloader:
        batch_X, batch_y = batch_X.to(device), batch_y.to(device)

        optimizer.zero_grad()
        outputs = model(batch_X)
        loss = criterion(outputs, batch_y)
        loss.backward()
        optimizer.step()

        running_loss += loss.item() * batch_X.size(0)

    return running_loss / len(dataloader.dataset)


# 测试函数
def evaluate(model, X, y, device):
    model.eval()
    with torch.no_grad():
        X, y = X.to(device), y.to(device)
        outputs = model(X)
        _, predicted = torch.max(outputs, 1)
        accuracy = (predicted == y).float().mean().item()
    return accuracy, predicted


# 主程序
def main():
    # 设置设备
    if torch.backends.mps.is_available():
        device = torch.device("mps")
    elif torch.cuda.is_available():
        device = torch.device("cuda")
    else:
        device = torch.device("cpu")

    # 加载数据
    iris = load_iris()
    X, y = iris.data, iris.target

    X_train, X_test, y_train, y_test = train_test_split(
        X, y, test_size=0.2, random_state=42, stratify=y
    )
    """
    random_state=42
    设定随机数种子，从而确保每次运行代码时数据划分的结果都是相同的。这样做可以使实验具有可重复性，
    有利于调试和结果对比。

    stratify=y
    这个参数表示按照 y 中的标签进行分层抽样，也就是说，训练集和测试集中各类别的
    比例会与原始数据中的类别比例保持一致。这对于类别不平衡的数据集尤为重要，可以
    避免某一类别在划分时被严重低估或过采样。
    """

    # 标准化：只在训练集上计算均值和标准差，再将相同的变换应用到测试集上
    scaler = StandardScaler()
    X_train = scaler.fit_transform(X_train)
    X_test = scaler.transform(X_test)

    # 转换为 Tensor
    X_train = torch.tensor(X_train, dtype=torch.float32)
    X_test = torch.tensor(X_test, dtype=torch.float32)
    y_train = torch.tensor(y_train, dtype=torch.long)
    y_test = torch.tensor(y_test, dtype=torch.long)

    # 构造 DataLoader
    train_dataset = TensorDataset(X_train, y_train)
    train_loader = DataLoader(train_dataset, batch_size=16, shuffle=True)

    # 模型、损失函数、优化器
    model = IrisNet().to(device)
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.Adam(model.parameters(), lr=0.01)

    # 训练
    num_epochs = 100
    for epoch in range(1, num_epochs + 1):
        loss = train(model, train_loader, criterion, optimizer, device)
        if epoch % 10 == 0:
            print(f"Epoch [{epoch:3d}/{num_epochs}], Loss: {loss:.4f}")

    # 评估
    test_acc, test_pred = evaluate(model, X_test, y_test, device)
    print(f"\n✅ Test Accuracy: {test_acc * 100:.2f}%")

    # 示例预测
    sample = X_test[0].unsqueeze(0)
    sample_pred = model(sample.to(device))
    pred_class = torch.argmax(sample_pred, dim=1).item()
    print(f"🔍 Sample Prediction: True = {y_test[0].item()}, Predicted = {pred_class}")


if __name__ == "__main__":
    main()

```

> 如果无法使用GPU
>
> **在运行时强制使用CPU调试**
>
> ```
> CUDA_VISIBLE_DEVICES="" python iris_neural_network.py
> ```
>
> 这样禁用CUDA，使用CPU。



> 云虚拟机运行结果：
>
> ![image-20250915152854981](https://raw.githubusercontent.com/GMyhf/img/main/img/image-20250915152854981.png)



**代码说明：**

1. **数据准备**：
   - 使用scikit-learn加载鸢尾花数据集
   - 将数据划分为训练集（80%）和测试集（20%）
   - 使用标准化处理（StandardScaler）对特征进行归一化

2. **神经网络结构**：
   - 输入层：4个神经元（对应4个特征）
   - 隐藏层：10个神经元（使用ReLU激活函数）
   - 输出层：3个神经元（对应3个类别）

3. **训练配置**：
   - 使用交叉熵损失函数（CrossEntropyLoss）
   - 使用Adam优化器（学习率0.01）
   - 训练100个epoch

4. **训练过程**：
   - 每个epoch记录损失和准确率
   - 每10个epoch打印训练进度

5. **评估与预测**：
   - 最终在测试集上评估模型准确率
   - 包含一个预测示例展示



该网络经过训练后，通常能在测试集上达到90%以上的准确率。实验结果表明，使用多层全连接网络即可较好解决该多分类任务（Iris数据集规模小，网络不需过深）。



> **注意事项：**
>
> 1. 由于数据集较小，模型可能很快达到100%训练准确率
> 2. 可以调整以下参数优化性能：
>    - 隐藏层大小（10）
>    - 学习率（0.01）
>    - epoch数量（100）
>    - 优化器（尝试SGD等）
> 3. 添加正则化（如Dropout层）可以防止过拟合
> 4. 可以使用GPU加速（将数据和模型移动到`cuda`设备）



> **可视化：监督学习 + 无监督学习（Iris 数据集）**
>
> ```python
> import numpy as np
> import matplotlib.pyplot as plt
> from sklearn.datasets import load_iris
> from sklearn.linear_model import LogisticRegression
> from sklearn.cluster import KMeans
> from sklearn.model_selection import train_test_split
> from sklearn.preprocessing import StandardScaler
> from sklearn.metrics import accuracy_score
> 
> # 1. 加载数据
> iris = load_iris()
> X = iris.data
> y = iris.target
> 
> # 2. 标准化数据
> scaler = StandardScaler()
> X_scaled = scaler.fit_transform(X)
> 
> # 3. 划分训练集和测试集（用于监督学习）
> train_x, test_x, train_y, test_y = train_test_split(X_scaled, y, test_size=0.3, random_state=42)
> 
> # 4. 监督学习：逻辑回归分类
> clf = LogisticRegression(max_iter=200)
> clf.fit(train_x, train_y)
> pred = clf.predict(test_x)
> print("Logistic Regression Accuracy:", accuracy_score(test_y, pred))
> 
> # 5. 无监督学习：KMeans 聚类（聚成3类）
> kmeans = KMeans(n_clusters=3, random_state=42)
> clusters = kmeans.fit_predict(X_scaled)
> 
> # 6. 可视化聚类（降维到二维）
> from sklearn.decomposition import PCA
> pca = PCA(n_components=2)
> X_2d = pca.fit_transform(X_scaled)
> 
> plt.figure(figsize=(10, 5))
> 
> # 聚类结果
> plt.subplot(1, 2, 1)
> plt.scatter(X_2d[:, 0], X_2d[:, 1], c=clusters, cmap='viridis', s=50)
> plt.title("KMeans Clustering (unsupervised)")
> 
> # 原始标签
> plt.subplot(1, 2, 2)
> plt.scatter(X_2d[:, 0], X_2d[:, 1], c=y, cmap='Set1', s=50)
> plt.title("Ground Truth Labels (supervised)")
> 
> plt.show()
> 
> ```
>
> > 使用 `LogisticRegression` 训练一个有监督分类器，并输出测试集准确率；
> >
> > 使用 `KMeans` 进行无监督聚类；
> >
> > 使用 PCA 将 4 维数据降维为 2 维，以便可视化聚类结果和真实标签；
> >
>
> 如图所示，通过使用PCA将特征降至二维，可视化聚类效果与真实分类的对比：
>
> 
>
> <img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20250727143806445.png" alt="image-20250727143806445" style="zoom: 67%;" />
>
> <center>图：Iris 数据聚类（左：网络聚类结果；右：真实类别）</center>
>



## 4.3 基于 ResNet18 的MNIST手写数字识别

通过手写数字识别的实例，我们可以看到神经网络的强大，也可以更好地理解它是如何运行的。

MNIST 是计算机视觉领域最经典的基准数据集之一，包含 60,000 张训练图像和 10,000 张测试图像，均为 28×28 像素的灰度手写数字（0–9）。尽管任务看似简单，但它常被用于验证深度学习模型的基本能力。

本示例使用 **ResNet18** 架构对 MNIST 进行分类。虽然 ResNet18 原为 RGB 图像（3通道）设计，但通过适当调整输入层，我们可将其成功应用于单通道灰度图像，并在 MNIST 上轻松达到 **99%+ 的准确率**。

**关键步骤**

1. **数据加载与增强**

   - 使用 `torchvision.datasets.MNIST` 加载数据。
   - 对训练集应用轻微的数据增强（如随机旋转 ±10°），提升泛化能力。
   - 对图像进行标准化：均值和标准差均为 `0.5`（因像素值范围为 [0,1]）。

2. **模型适配**

   - 将 ResNet18 的首层卷积从 3 通道输入改为 **1 通道**：

     ```python
     net.conv1 = nn.Conv2d(1, 64, kernel_size=7, stride=2, padding=3, bias=False)
     ```

   - 修改全连接层输出维度为 **10**（对应 0–9 十个类别）。

3. **训练策略**

   - 优化器：SGD（学习率 0.01，动量 0.9，权重衰减 5e-4）
   - 学习率调度：余弦退火（`CosineAnnealingLR`）
   - 早停机制：若连续 10 个 epoch 验证损失无显著下降，则提前终止

4. **评估与可视化**

   - 报告整体准确率及每类准确率
   - 可视化部分测试样本及其预测结果



**完整`mnist_resnet18.py`代码**

```python
import torch
import torchvision
import torchvision.transforms as transforms
import torch.nn as nn
import torch.optim as optim
import torchvision.models as models
import matplotlib.pyplot as plt
import numpy as np
import time

def main():
    # 1. 数据增强 + 预处理
    transform_train = transforms.Compose([
        transforms.RandomRotation(10),  # 随机旋转
        transforms.ToTensor(),
        transforms.Normalize((0.5,), (0.5,))  # MNIST 是单通道，使用 (0.5,) 来规范化
    ])

    transform_test = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.5,), (0.5,))
    ])

    # 加载 MNIST 数据集
    trainset = torchvision.datasets.MNIST(root='./data', train=True, download=True, transform=transform_train)
    trainloader = torch.utils.data.DataLoader(trainset, batch_size=128, shuffle=True, num_workers=2, pin_memory=True)

    testset = torchvision.datasets.MNIST(root='./data', train=False, download=True, transform=transform_test)
    testloader = torch.utils.data.DataLoader(testset, batch_size=100, shuffle=False, num_workers=2, pin_memory=True)

    classes = [str(i) for i in range(10)]  # MNIST 类别是 0 到 9

    # 2. 设置设备和模型
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    print("Using device:", device)

    # 加载预定义的 ResNet18 并修改输入层和输出层
    net = models.resnet18(weights=None)
    # 修改输入层的第一个卷积层，使其接受单通道（1通道灰度图像）
    net.conv1 = nn.Conv2d(1, 64, kernel_size=(7, 7), stride=(2, 2), padding=(3, 3), bias=False)
    net.fc = nn.Linear(net.fc.in_features, 10)  # MNIST 10 类
    net.to(device)

    # 定义损失函数和优化器
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(net.parameters(), lr=0.01, momentum=0.9, weight_decay=5e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)

    # 3. 训练过程
    best_loss = float('inf')
    patience = 10  # 提高耐心
    patience_counter = 0

    start_time = time.time()
    print("Starting training with early stopping...")
    for epoch in range(800):  # 可适当增大 epoch
        net.train()
        epoch_loss = 0.0
        for i, data in enumerate(trainloader, 0):
            inputs, labels = data
            inputs, labels = inputs.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = net(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item()
            if i % 100 == 99:
                print(f"[{epoch + 1}, {i + 1:5d}] loss: {loss.item():.3f}")

        avg_loss = epoch_loss / len(trainloader)
        print(f"[{epoch+1}] Avg Loss: {avg_loss:.3f}")

        if avg_loss < best_loss - 1e-4:
            best_loss = avg_loss
            patience_counter = 0
        else:
            patience_counter += 1
            print(f"No improvement. Patience: {patience_counter}/{patience}")
            if patience_counter >= patience:
                print("Early stopping triggered.")
                break

    end_time = time.time()
    execution_time_minutes = (end_time - start_time) / 60
    print(f"✅ Training completed in {execution_time_minutes:.2f} minutes.")

    # 保存模型
    torch.save(net.state_dict(), './resnet18_mnist.pth')

    # 4. 测试准确率
    correct = 0
    total = 0
    net.eval()
    with torch.no_grad():
        for data in testloader:
            images, labels = data
            images, labels = images.to(device), labels.to(device)
            outputs = net(images)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

    print(f"Accuracy on test images: {100 * correct / total:.2f}%")

    # 每类准确率
    class_correct = list(0. for _ in range(10))
    class_total = list(0. for _ in range(10))
    with torch.no_grad():
        for data in testloader:
            images, labels = data
            images, labels = images.to(device), labels.to(device)
            outputs = net(images)
            _, predicted = torch.max(outputs.data, 1)
            c = (predicted == labels).squeeze()
            for i in range(len(labels)):
                class_correct[labels[i]] += c[i].item()
                class_total[labels[i]] += 1

    for i in range(10):
        print(f'Accuracy of {classes[i]:5s}: {100 * class_correct[i] / class_total[i]:.2f}%')

    # --- 可视化预测 ---

    def imshow_grid(images, labels, preds=None, classes=None, rows=8, cols=8):
        images = images.cpu() / 2 + 0.5  # unnormalize
        npimg = images.numpy()
        fig, axes = plt.subplots(rows, cols, figsize=(cols * 1.5, rows * 1.5))
        for i in range(rows * cols):
            r, c = divmod(i, cols)
            ax = axes[r, c]
            img = np.transpose(npimg[i], (1, 2, 0))
            ax.imshow(img.squeeze(), cmap="gray")
            title = f'{classes[labels[i]]}'
            if preds is not None:
                title += f'\n→ {classes[preds[i]]}'
            ax.set_title(title, fontsize=8)
            ax.axis('off')
        plt.tight_layout()
        plt.show()

    # 获取一批图像用于显示
    dataiter = iter(testloader)
    images, labels = next(dataiter)
    while images.size(0) < 64:
        more_images, more_labels = next(dataiter)
        images = torch.cat([images, more_images], dim=0)
        labels = torch.cat([labels, more_labels], dim=0)
    images = images[:64]
    labels = labels[:64]

    # 预测
    net.eval()
    with torch.no_grad():
        outputs = net(images.to(device))
        _, predicted = torch.max(outputs, 1)

    # 显示图像网格
    imshow_grid(images, labels, predicted.cpu(), classes=classes, rows=8, cols=8)

if __name__ == "__main__":
    import torch.multiprocessing
    torch.multiprocessing.set_start_method('spawn', force=True)
    main()


```

典型结果：使用ResNet18能在MNIST上达到99%以上的准确率。该任务展示了深度卷积网络在图像分类中的强大能力。



**常见问题解答**

**Q: 为什么需要修改 `net.conv1`？**

> ResNet18 默认输入为 3 通道（RGB），而 MNIST 是单通道灰度图。必须将第一个卷积层的输入通道数从 3 改为 1，否则会报维度不匹配错误。其余结构（如 kernel size=7、stride=2 等）保持不变以保留原始设计意图。
>
> **`nn.Conv2d(1, 64, kernel_size=(7, 7), stride=(2, 2), padding=(3, 3), bias=False)`** 这一行就是修改原来 `ResNet18` 中第一个卷积层（`conv1`）的定义，以使其能接收单通道的灰度图像（`1` 通道）。
>
> - **`1`**: 输入图像的通道数（即 MNIST 图像的灰度通道数）。
> - **`64`**: 输出的卷积通道数（ResNet18 中通常是 64）。
> - **`kernel_size=(7, 7)`**: 卷积核的大小为 7x7。这个值与原始 ResNet18 中的设置一致。
> - **`stride=(2, 2)`**: 卷积的步长为 2，这意味着每次卷积后，图像尺寸会减少一半。
> - **`padding=(3, 3)`**: 填充为 3，保持输入图像的尺寸在卷积后不至于变化太大（确保卷积后输出的空间维度适当）。
> - **`bias=False`**: 通常在深度网络中，如果使用了批量归一化（BatchNorm）等层，卷积层可以去掉偏置项。

**Q: 能否在 CPU 上运行？**

> 可以。若无 GPU 或 MPS（Apple Silicon）支持，程序会自动回退到 CPU。如需强制使用 CPU（例如调试时），可运行：
>
> ```bash
> CUDA_VISIBLE_DEVICES="" python mnist_resnet18.py
> ```



**总结**

本项目展示了如何将为自然图像设计的现代 CNN（如 ResNet18）迁移到简单但经典的 MNIST 任务上。通过**输入层适配**、**合理训练策略**和**结果可视化**，不仅验证了模型有效性，也加深了对神经网络工作原理的理解。

> **提示**：对于 MNIST 这类简单任务，小型 CNN（如 LeNet-5）已足够高效。使用 ResNet18 更多是为了演示模型迁移与适配技巧。



### 实验结果

#### 在16GB内存的 Mac mini 运行

> 运行机器
>
> <img src="https://raw.githubusercontent.com/GMyhf/img/main/img/202507261935350.png" alt="b452b39cfb47eb8bf5b640c828b6b71b" style="zoom:50%;" />
>
> 
>
> 详细训练日志
>
> ```
> /Users/hfyan/miniconda3/bin/python /Users/hfyan/git/2025spring-cs201/LLM/mnist_resnet18.py 
> 100%|██████████| 9.91M/9.91M [02:52<00:00, 57.6kB/s]
> 100%|██████████| 28.9k/28.9k [00:00<00:00, 97.2kB/s]
> 100%|██████████| 1.65M/1.65M [00:04<00:00, 374kB/s]
> 100%|██████████| 4.54k/4.54k [00:00<00:00, 6.74kB/s]
> Using device: mps
> Starting training with early stopping...
> /Users/hfyan/miniconda3/lib/python3.10/site-packages/torch/utils/data/dataloader.py:683: UserWarning: 'pin_memory' argument is set as true but not supported on MPS now, then device pinned memory won't be used.
>   warnings.warn(warn_msg)
> [1,   100] loss: 0.136
> [1,   200] loss: 0.132
> [1,   300] loss: 0.035
> [1,   400] loss: 0.098
> [1] Avg Loss: 0.150
> [2,   100] loss: 0.137
> [2,   200] loss: 0.030
> [2,   300] loss: 0.030
> [2,   400] loss: 0.015
> [2] Avg Loss: 0.052
> [3,   100] loss: 0.018
> [3,   200] loss: 0.105
> [3,   300] loss: 0.078
> [3,   400] loss: 0.026
> [3] Avg Loss: 0.039
> [4,   100] loss: 0.032
> [4,   200] loss: 0.056
> [4,   300] loss: 0.008
> [4,   400] loss: 0.013
> [4] Avg Loss: 0.031
> [5,   100] loss: 0.003
> [5,   200] loss: 0.025
> [5,   300] loss: 0.029
> [5,   400] loss: 0.022
> [5] Avg Loss: 0.027
> [6,   100] loss: 0.041
> [6,   200] loss: 0.022
> [6,   300] loss: 0.047
> [6,   400] loss: 0.005
> [6] Avg Loss: 0.023
> 
> ...
> 
> No improvement. Patience: 6/10
> [43,   100] loss: 0.010
> [43,   200] loss: 0.000
> [43,   300] loss: 0.012
> [43,   400] loss: 0.002
> [43] Avg Loss: 0.008
> No improvement. Patience: 7/10
> [44,   100] loss: 0.001
> [44,   200] loss: 0.004
> [44,   300] loss: 0.035
> [44,   400] loss: 0.000
> [44] Avg Loss: 0.011
> No improvement. Patience: 8/10
> [45,   100] loss: 0.002
> [45,   200] loss: 0.014
> [45,   300] loss: 0.010
> [45,   400] loss: 0.014
> [45] Avg Loss: 0.010
> No improvement. Patience: 9/10
> [46,   100] loss: 0.001
> [46,   200] loss: 0.076
> [46,   300] loss: 0.001
> [46,   400] loss: 0.004
> [46] Avg Loss: 0.009
> No improvement. Patience: 10/10
> Early stopping triggered.
> ✅ Training completed in 27.72 minutes.
> Accuracy on test images: 99.57%
> Accuracy of 0    : 99.59%
> Accuracy of 1    : 99.91%
> Accuracy of 2    : 99.71%
> Accuracy of 3    : 99.80%
> Accuracy of 4    : 99.49%
> Accuracy of 5    : 99.33%
> Accuracy of 6    : 99.37%
> Accuracy of 7    : 99.22%
> Accuracy of 8    : 99.90%
> Accuracy of 9    : 99.31%
> 
> Process finished with exit code 0
> 
> ```
> 
> 
> 
> <img src="https://raw.githubusercontent.com/GMyhf/img/main/img/202507261936331.png" alt="22485e1e277b7dfea954fe0cd8a1af4f" style="zoom:50%;" />
> 
> 



#### 在16GB内存的 window 机器运行

> 在window机器，用 WSL 安装 Ubuntu，用cpu运行
>
> 环境设置，可以参考：https://github.com/GMyhf/2025fall-cs201/blob/main/LLM/Build%20LLM%20Setup_window.md
>
> ```
> $ CUDA_VISIBLE_DEVICES="" python mnist_resnet18.py
> ```
>
> Windows 10 专业版，版本号22H2，安装日期 2021/6/12
>
> 处理器 Intel(R)Xeon(R)W-2223 CPU @ 3.60GHz 3.60GHz
> 机带 RAM 16.0 GB (15.7 GB 可用)
> 系统类型 64 位操作系统, 基于 x64 的处理器
>
> ```
> 100%|████████████| 9.91M/9.91M [00:06<00:00, 1.52MB/s]
> 100%|████████████| 28.9k/28.9k [00:00<00:00, 133kB/s]
> 100%|████████████| 1.65M/1.65M [00:01<00:00, 905kB/s]
> 100%|████████████| 4.54k/4.54k [00:00<00:00, 9.23MB/s]
> Using device: cpu
> Starting training with early stopping...
> /home/yhf/.venv/lib/python3.12/site-packages/torch/utils/data/dataloader.py:666: UserWarning: 'pin_memory' argument is set as true but no accelerator is found, then device pinned memory won't be used.
>   warnings.warn(warn_msg)
> [1,   100] loss: 0.099
> [1,   200] loss: 0.072
> [1,   300] loss: 0.038
> [1,   400] loss: 0.079
> [1] Avg Loss: 0.149
> [2,   100] loss: 0.028
> [2,   200] loss: 0.010
> [2,   300] loss: 0.012
> [2,   400] loss: 0.112
> [2] Avg Loss: 0.053
> [3,   100] loss: 0.017
> [3,   200] loss: 0.032
> [3,   300] loss: 0.009
> [3,   400] loss: 0.027
> [3] Avg Loss: 0.037
> [4,   100] loss: 0.024
> [4,   200] loss: 0.087
> [4,   300] loss: 0.010
> [4,   400] loss: 0.045
> [4] Avg Loss: 0.032
> [5,   100] loss: 0.034
> [5,   200] loss: 0.009
> [5,   300] loss: 0.019
> [5,   400] loss: 0.038
> [5] Avg Loss: 0.026
> [6,   100] loss: 0.032
> [6,   200] loss: 0.046
> [6,   300] loss: 0.037
> [6,   400] loss: 0.039
> [6] Avg Loss: 0.023
> [7,   100] loss: 0.038
> 
> ...
> 
> [43] Avg Loss: 0.008
> No improvement. Patience: 5/10
> [44,   100] loss: 0.046
> [44,   200] loss: 0.002
> [44,   300] loss: 0.023
> [44,   400] loss: 0.008
> [44] Avg Loss: 0.010
> No improvement. Patience: 6/10
> [45,   100] loss: 0.021
> [45,   200] loss: 0.001
> [45,   300] loss: 0.006
> [45,   400] loss: 0.001
> [45] Avg Loss: 0.011
> No improvement. Patience: 7/10
> [46,   100] loss: 0.008
> [46,   200] loss: 0.006
> [46,   300] loss: 0.002
> [46,   400] loss: 0.049
> [46] Avg Loss: 0.010
> No improvement. Patience: 8/10
> [47,   100] loss: 0.001
> [47,   200] loss: 0.015
> [47,   300] loss: 0.001
> [47,   400] loss: 0.026
> [47] Avg Loss: 0.008
> No improvement. Patience: 9/10
> [48,   100] loss: 0.002
> [48,   200] loss: 0.002
> [48,   300] loss: 0.002
> [48,   400] loss: 0.004
> [48] Avg Loss: 0.010
> No improvement. Patience: 10/10
> Early stopping triggered.
> ✅ Training completed in 75.11 minutes.
> Accuracy on test images: 99.35%
> Accuracy of 0    : 99.59%
> Accuracy of 1    : 99.91%
> Accuracy of 2    : 99.22%
> Accuracy of 3    : 99.50%
> Accuracy of 4    : 99.59%
> Accuracy of 5    : 99.22%
> Accuracy of 6    : 99.37%
> Accuracy of 7    : 99.22%
> Accuracy of 8    : 99.38%
> Accuracy of 9    : 98.41%
> /home/yhf/NNCode/mnist_resnet18.py:142: UserWarning: FigureCanvasAgg is non-interactive, and thus cannot be shown
> plt.show()
> ```
> 
> 



#### 在32GB内存的 clab 云虚拟机运行

2025年11月26日，在clab云虚拟机跑。虚拟机只有CPU。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/33caace9ba4252b9bcc6707b67f18746.png" alt="33caace9ba4252b9bcc6707b67f18746" style="zoom: 33%;" />



clab虚拟机需要登录网关，能访问外网，因为要下载数据

> 否则，报302错误
>
> (.venv) [rocky@jensen AI_literacy]$ python MNIST_nn.py 
> Traceback (most recent call last):
> File "/home/rocky/AI_literacy/MNIST_nn.py", line 166, in <module>
> main()
> File "/home/rocky/AI_literacy/MNIST_nn.py", line 25, in main
> trainset = torchvision.datasets.MNIST(root='./data', train=True, download=True, transform=transform_train)
> File "/home/rocky/AI_literacy/.venv/lib64/python3.9/site-packages/torchvision/datasets/mnist.py", line 100, in __init__
>
> self.download()
>
> File "/home/rocky/AI_literacy/.venv/lib64/python3.9/site-packages/torchvision/datasets/mnist.py", line 197, in download
> raise RuntimeError(s)
> RuntimeError: Error downloading train-images-idx3-ubyte.gz:
> Tried https://ossci-datasets.s3.amazonaws.com/mnist/, got:
> <urlopen error [Errno 110] Connection timed out>
> Tried http://yann.lecun.com/exdb/mnist/, got:
> HTTP Error 302: Moved Temporarily



> 
>
> ```
> (.venv) [rocky@jensen AI_literacy]$ python MNIST_nn.py 
> 100%|██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 9.91M/9.91M [06:09<00:00, 26.8kB/s]
> 100%|███████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 28.9k/28.9k [00:00<00:00, 113kB/s]
> 100%|██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 1.65M/1.65M [00:01<00:00, 1.12MB/s]
> 100%|██████████████████████████████████████████████████████████████████████████████████████████████████████████████████████| 4.54k/4.54k [00:00<00:00, 4.41MB/s]
> Using device: cpu
> Starting training with early stopping...
> /home/rocky/AI_literacy/.venv/lib64/python3.9/site-packages/torch/utils/data/dataloader.py:666: UserWarning: 'pin_memory' argument is set as true but no accelerator is found, then device pinned memory won't be used.
>   warnings.warn(warn_msg)
> [1,   100] loss: 0.200
> [1,   200] loss: 0.084
> [1,   300] loss: 0.060
> [1,   400] loss: 0.100
> [1] Avg Loss: 0.150
> [2,   100] loss: 0.095
> [2,   200] loss: 0.102
> [2,   300] loss: 0.010
> [2,   400] loss: 0.032
> [2] Avg Loss: 0.049
> [3,   100] loss: 0.024
> [3,   200] loss: 0.051
> [3,   300] loss: 0.064
> [3,   400] loss: 0.019
> [3] Avg Loss: 0.039
> [4,   100] loss: 0.040
> [4,   200] loss: 0.071
> [4,   300] loss: 0.068
> [4,   400] loss: 0.052
> [4] Avg Loss: 0.030
> [5,   100] loss: 0.039
> [5,   200] loss: 0.031
> [5,   300] loss: 0.005
> [5,   400] loss: 0.002
> [5] Avg Loss: 0.025
> [6,   100] loss: 0.081
> [6,   200] loss: 0.019
> [6,   300] loss: 0.040
> [6,   400] loss: 0.006
> [6] Avg Loss: 0.023
> 
> ...
> 
> [40,   200] loss: 0.001
> [40,   300] loss: 0.019
> [40,   400] loss: 0.076
> [40] Avg Loss: 0.010
> No improvement. Patience: 4/10
> [41,   100] loss: 0.001
> [41,   200] loss: 0.012
> [41,   300] loss: 0.014
> [41,   400] loss: 0.009
> [41] Avg Loss: 0.012
> No improvement. Patience: 5/10
> [42,   100] loss: 0.003
> [42,   200] loss: 0.002
> [42,   300] loss: 0.053
> [42,   400] loss: 0.001
> [42] Avg Loss: 0.010
> No improvement. Patience: 6/10
> [43,   100] loss: 0.011
> [43,   200] loss: 0.000
> [43,   300] loss: 0.006
> [43,   400] loss: 0.005
> [43] Avg Loss: 0.008
> No improvement. Patience: 7/10
> [44,   100] loss: 0.013
> [44,   200] loss: 0.030
> [44,   300] loss: 0.021
> [44,   400] loss: 0.004
> [44] Avg Loss: 0.010
> No improvement. Patience: 8/10
> [45,   100] loss: 0.003
> [45,   200] loss: 0.012
> [45,   300] loss: 0.002
> [45,   400] loss: 0.037
> [45] Avg Loss: 0.008
> No improvement. Patience: 9/10
> [46,   100] loss: 0.001
> [46,   200] loss: 0.006
> [46,   300] loss: 0.000
> [46,   400] loss: 0.020
> [46] Avg Loss: 0.010
> No improvement. Patience: 10/10
> Early stopping triggered.
> ✅ Training completed in 91.75 minutes.
> Accuracy on test images: 99.43%
> Accuracy of 0    : 99.80%
> Accuracy of 1    : 99.65%
> Accuracy of 2    : 99.03%
> Accuracy of 3    : 99.70%
> Accuracy of 4    : 99.19%
> Accuracy of 5    : 98.77%
> Accuracy of 6    : 99.37%
> Accuracy of 7    : 99.71%
> Accuracy of 8    : 99.38%
> Accuracy of 9    : 99.60%
> ```
> 
> 



## 4.4 基于 ResNet18 的 CIFAR-10 图像分类

本项目旨在复现并改进 菜鸟教程（https://www.runoob.com/pytorch/pytorch-image-classification.html）中的 CIFAR-10 分类示例。原始实现仅达到约 **76.8%** 的测试准确率，低于经典基线（如 cuda-convnet 报告的 **82%+**）。为此，我们引入 **ResNet18 架构**、**增强的数据预处理策略** 和 **学习率调度机制**，显著提升模型性能。

最终在 Mac Studio（M1 Ultra）与 Clab 云服务器上均实现了 **>83.5%** 的测试准确率，成功超越基础 CNN 基线。



### 数据集简介：CIFAR-10

CIFAR-10 是由 Alex Krizhevsky 等人构建的经典图像分类数据集，源自 80 Million Tiny Images（http://people.csail.mit.edu/torralba/tinyimages/）。

- **图像数量**：60,000 张 32×32 彩色图像 
- **类别数**：10 类（互斥） 
  - airplane, automobile, bird, cat, deer, dog, frog, horse, ship, truck
- **划分**：
  - 训练集：50,000 张（每类 5,000）
  - 测试集：10,000 张（每类 1,000，均匀采样）

> 官网：https://www.cs.toronto.edu/~kriz/cifar.html

| Class      | 示例图像                                                     |
| ---------- | ------------------------------------------------------------ |
| airplane   | ![airplane](https://www.cs.toronto.edu/~kriz/cifar-10-sample/airplane1.png) … |
| automobile | ![automobile](https://www.cs.toronto.edu/~kriz/cifar-10-sample/automobile1.png) … |
| ...        | （其余略，详见官网）                                         |

> 注意：“automobile” 指轿车/SUV，“truck” 仅指大型卡车，两者无重叠。
>
> **Baseline results**
>
> You can find some baseline replicable results on this dataset [on the project page for cuda-convnet](http://code.google.com/p/cuda-convnet/). These results were obtained with a convolutional neural network. Briefly, they are **18%** test error without data augmentation and 11% with. Additionally, [Jasper Snoek](http://www.cs.toronto.edu/~jasper/) has a [new paper](http://hips.seas.harvard.edu/content/practical-bayesian-optimization-machine-learning-algorithms) in which he used Bayesian hyperparameter optimization to find nice settings of the weight decay and other hyperparameters, which allowed him to obtain a test error rate of 15% (without data augmentation) using the architecture of the net that got 18%.

------



### 改进措施

**现代网络架构（ResNet18） + 充分的数据增强 + 学习率调度**

| 改进项         | 具体实现                                                     |
| -------------- | ------------------------------------------------------------ |
| **网络架构**   | 使用 `torchvision.models.resnet18(weights=None)`，从头训练   |
| **输入尺寸**   | 保留原始 32×32（无需 Resize，因未加载 ImageNet 预训练权重）  |
| **数据增强**   | `RandomCrop`, `HorizontalFlip`, `RandomRotation`, `ColorJitter` |
| **优化器**     | SGD + momentum=0.9 + weight_decay=5e-4                       |
| **学习率调度** | `CosineAnnealingLR`（平滑衰减）                              |
| **训练控制**   | Early stopping（patience=10）防止过拟合                      |
| **评估指标**   | 总体准确率 + 每类准确率 + 可视化预测网格                     |



完整 `image_classification-ResNet18-RandomCropFlipLR_Cosine.py`代码

```python
import torch
import torchvision
import torchvision.transforms as transforms
import torch.nn as nn
import torch.optim as optim
import torchvision.models as models
import matplotlib.pyplot as plt
import numpy as np
import time

def main():
    # === 1. 数据增强与加载 ===
    transform_train = transforms.Compose([
        transforms.RandomCrop(32, padding=4),
        transforms.RandomHorizontalFlip(),
        transforms.RandomRotation(10),  # 随机旋转
        transforms.ColorJitter(brightness=0.2, contrast=0.2, saturation=0.2, hue=0.2),  # 色彩调整
        transforms.ToTensor(),
        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
    ])

    transform_test = transforms.Compose([
        transforms.ToTensor(),
        transforms.Normalize((0.5, 0.5, 0.5), (0.5, 0.5, 0.5))
    ])

    trainset = torchvision.datasets.CIFAR10(root='./data', train=True, download=True, transform=transform_train)
    trainloader = torch.utils.data.DataLoader(trainset, batch_size=128, shuffle=True, num_workers=2, pin_memory=True)

    testset = torchvision.datasets.CIFAR10(root='./data', train=False, download=True, transform=transform_test)
    testloader = torch.utils.data.DataLoader(testset, batch_size=100, shuffle=False, num_workers=2, pin_memory=True)

    classes = ('plane', 'car', 'bird', 'cat', 'deer',
               'dog', 'frog', 'horse', 'ship', 'truck')

    # === 2. 模型与训练配置 ===
    device = torch.device("mps" if torch.backends.mps.is_available() else "cpu")
    print("Using device:", device)

    # 加载预定义的 ResNet18 并修改输出层
    net = models.resnet18(weights=None)
    net.fc = nn.Linear(net.fc.in_features, 10)  # CIFAR10 10 类
    net.to(device)

    # 定义损失函数和优化器
    criterion = nn.CrossEntropyLoss()
    optimizer = optim.SGD(net.parameters(), lr=0.01, momentum=0.9, weight_decay=5e-4)
    scheduler = optim.lr_scheduler.CosineAnnealingLR(optimizer, T_max=100)

    # === 3. 训练循环（含 Early Stopping）===
    best_loss = float('inf')
    patience = 10 # 提高耐心
    patience_counter = 0

    start_time = time.time()
    print("Starting training with early stopping...")
    for epoch in range(800):  # 可适当增大 epoch
        net.train()
        epoch_loss = 0.0
        for i, data in enumerate(trainloader, 0):
            inputs, labels = data
            inputs, labels = inputs.to(device), labels.to(device)

            optimizer.zero_grad()
            outputs = net(inputs)
            loss = criterion(outputs, labels)
            loss.backward()
            optimizer.step()

            epoch_loss += loss.item()
            if i % 100 == 99:
                print(f"[{epoch + 1}, {i + 1:5d}] loss: {loss.item():.3f}")

        avg_loss = epoch_loss / len(trainloader)
        print(f"[{epoch+1}] Avg Loss: {avg_loss:.3f}")

        if avg_loss < best_loss - 1e-4:
            best_loss = avg_loss
            patience_counter = 0
        else:
            patience_counter += 1
            print(f"No improvement. Patience: {patience_counter}/{patience}")
            if patience_counter >= patience:
                print("Early stopping triggered.")
                break



    end_time = time.time()
    execution_time_minutes = (end_time - start_time) / 60
    print(f"✅ Training completed in {execution_time_minutes:.2f} minutes.")


    # 保存模型
    torch.save(net.state_dict(), './resnet18_cifar10_data_augument.pth')

    # === 4. 测试评估 ===
    correct = 0
    total = 0
    net.eval()
    with torch.no_grad():
        for data in testloader:
            images, labels = data
            images, labels = images.to(device), labels.to(device)
            outputs = net(images)
            _, predicted = torch.max(outputs.data, 1)
            total += labels.size(0)
            correct += (predicted == labels).sum().item()

    print(f"Accuracy on test images: {100 * correct / total:.2f}%")

    # 每类准确率
    class_correct = list(0. for _ in range(10))
    class_total = list(0. for _ in range(10))
    with torch.no_grad():
        for data in testloader:
            images, labels = data
            images, labels = images.to(device), labels.to(device)
            outputs = net(images)
            _, predicted = torch.max(outputs.data, 1)
            c = (predicted == labels).squeeze()
            for i in range(len(labels)):
                class_correct[labels[i]] += c[i].item()
                class_total[labels[i]] += 1

    for i in range(10):
        print(f'Accuracy of {classes[i]:5s}: {100 * class_correct[i] / class_total[i]:.2f}%')

    # === 5. 可视化预测结果 ===
    def imshow_grid(images, labels, preds=None, classes=None, rows=8, cols=8):
        images = images.cpu() / 2 + 0.5  # unnormalize
        npimg = images.numpy()
        fig, axes = plt.subplots(rows, cols, figsize=(cols * 1.5, rows * 1.5))
        for i in range(rows * cols):
            r, c = divmod(i, cols)
            ax = axes[r, c]
            img = np.transpose(npimg[i], (1, 2, 0))
            ax.imshow(img)
            title = f'{classes[labels[i]]}'
            if preds is not None:
                title += f'\n→ {classes[preds[i]]}'
            ax.set_title(title, fontsize=8)
            ax.axis('off')
        plt.tight_layout()
        plt.show()

    # 获取一批图像用于显示
    dataiter = iter(testloader)
    images, labels = next(dataiter)
    while images.size(0) < 64:
        more_images, more_labels = next(dataiter)
        images = torch.cat([images, more_images], dim=0)
        labels = torch.cat([labels, more_labels], dim=0)
    images = images[:64]
    labels = labels[:64]

    # 预测
    net.eval()
    with torch.no_grad():
        outputs = net(images.to(device))
        _, predicted = torch.max(outputs, 1)

    # 显示图像网格
    imshow_grid(images, labels, predicted.cpu(), classes=classes, rows=8, cols=8)

if __name__ == "__main__":
    import torch.multiprocessing
    torch.multiprocessing.set_start_method('spawn', force=True)
    main()

```



### 实验结果

#### 在 Apple M1 Ultra (Mac Studio, 64GB RAM)

- **设备**：`mps`
- **训练耗时**：79.91 分钟
- **早停轮次**：第 208 轮
- **测试准确率**：**83.57%**

| 类别    | 准确率              |
| ------- | ------------------- |
| plane   | 83.70%              |
| car     | 92.20%              |
| bird    | 78.70%              |
| **cat** | **60.40%** ← 最弱项 |
| deer    | 79.30%              |
| dog     | 77.40%              |
| frog    | 90.30%              |
| horse   | 92.50%              |
| ship    | 88.50%              |
| truck   | 92.70%              |

> 预测可视化：
> <img src="https://raw.githubusercontent.com/GMyhf/img/main/img/202507280020181.jpg" alt="预测结果" style="zoom: 50%;" />

> 运行输出结果如下：
>
> ```
> /Users/hfyan/miniconda3/bin/python /Users/hfyan/Desktop/LLMs-from-scratch-main/runoob/pytorch-image-classification/image_classification-ResNet18-RandomCropFlipLR_Cosine.py 
> Using device: mps
> Starting training with early stopping...
> [1,   100] loss: 1.752
> [1,   200] loss: 1.675
> [1,   300] loss: 1.654
> [1] Avg Loss: 1.806
> [2,   100] loss: 1.497
> [2,   200] loss: 1.459
> [2,   300] loss: 1.453
> [2] Avg Loss: 1.520
> [3,   100] loss: 1.534
> [3,   200] loss: 1.383
> [3,   300] loss: 1.167
> [3] Avg Loss: 1.372
> [4,   100] loss: 1.390
> [4,   200] loss: 1.221
> [4,   300] loss: 1.238
> [4] Avg Loss: 1.244
> [5,   100] loss: 1.089
> [5,   200] loss: 1.020
> [5,   300] loss: 1.133
> [5] Avg Loss: 1.159
> ......
> No improvement. Patience: 1/10
> [192,   100] loss: 0.187
> [192,   200] loss: 0.293
> [192,   300] loss: 0.356
> [192] Avg Loss: 0.302
> [193,   100] loss: 0.223
> [193,   200] loss: 0.348
> [193,   300] loss: 0.309
> [193] Avg Loss: 0.301
> [194,   100] loss: 0.303
> [194,   200] loss: 0.219
> [194,   300] loss: 0.280
> [194] Avg Loss: 0.304
> No improvement. Patience: 1/10
> [195,   100] loss: 0.279
> [195,   200] loss: 0.296
> [195,   300] loss: 0.313
> [195] Avg Loss: 0.296
> [196,   100] loss: 0.254
> [196,   200] loss: 0.385
> [196,   300] loss: 0.280
> [196] Avg Loss: 0.300
> No improvement. Patience: 1/10
> [197,   100] loss: 0.216
> [197,   200] loss: 0.298
> [197,   300] loss: 0.290
> [197] Avg Loss: 0.298
> No improvement. Patience: 2/10
> [198,   100] loss: 0.267
> [198,   200] loss: 0.218
> [198,   300] loss: 0.367
> [198] Avg Loss: 0.290
> [199,   100] loss: 0.270
> [199,   200] loss: 0.240
> [199,   300] loss: 0.351
> [199] Avg Loss: 0.301
> No improvement. Patience: 1/10
> [200,   100] loss: 0.251
> [200,   200] loss: 0.227
> [200,   300] loss: 0.302
> [200] Avg Loss: 0.299
> No improvement. Patience: 2/10
> [201,   100] loss: 0.348
> [201,   200] loss: 0.301
> [201,   300] loss: 0.193
> [201] Avg Loss: 0.299
> No improvement. Patience: 3/10
> [202,   100] loss: 0.313
> [202,   200] loss: 0.329
> [202,   300] loss: 0.305
> [202] Avg Loss: 0.295
> No improvement. Patience: 4/10
> [203,   100] loss: 0.266
> [203,   200] loss: 0.254
> [203,   300] loss: 0.307
> [203] Avg Loss: 0.294
> No improvement. Patience: 5/10
> [204,   100] loss: 0.372
> [204,   200] loss: 0.295
> [204,   300] loss: 0.348
> [204] Avg Loss: 0.300
> No improvement. Patience: 6/10
> [205,   100] loss: 0.392
> [205,   200] loss: 0.353
> [205,   300] loss: 0.306
> [205] Avg Loss: 0.296
> No improvement. Patience: 7/10
> [206,   100] loss: 0.262
> [206,   200] loss: 0.213
> [206,   300] loss: 0.396
> [206] Avg Loss: 0.293
> No improvement. Patience: 8/10
> [207,   100] loss: 0.293
> [207,   200] loss: 0.204
> [207,   300] loss: 0.337
> [207] Avg Loss: 0.291
> No improvement. Patience: 9/10
> [208,   100] loss: 0.413
> [208,   200] loss: 0.294
> [208,   300] loss: 0.315
> [208] Avg Loss: 0.295
> No improvement. Patience: 10/10
> Early stopping triggered.
> ✅ Training completed in 79.91 minutes.
> Accuracy on test images: 83.57%
> Accuracy of plane: 83.70%
> Accuracy of car  : 92.20%
> Accuracy of bird : 78.70%
> Accuracy of cat  : 60.40%
> Accuracy of deer : 79.30%
> Accuracy of dog  : 77.40%
> Accuracy of frog : 90.30%
> Accuracy of horse: 92.50%
> Accuracy of ship : 88.50%
> Accuracy of truck: 92.70%
> 
> Process finished with exit code 0
> ```
>
> 



#### 在 Clab 云服务器 (32 vCPU, 32GB RAM)

- **设备**：`cpu`
- **训练耗时**：636.54 分钟（约 10.6 小时）
- **早停轮次**：第 277 轮
- **测试准确率**：**83.67%**

| 类别    | 准确率                |
| ------- | --------------------- |
| plane   | 84.70%                |
| car     | 91.90%                |
| bird    | 84.00%                |
| **cat** | **65.90%**** ← 最弱项 |
| deer    | 81.10%                |
| dog     | 77.60%                |
| frog    | 89.40%                |
| horse   | 85.00%                |
| ship    | 91.70%                |
| truck   | 85.40%                |

> 预测可视化：
> <img src="https://raw.githubusercontent.com/GMyhf/img/main/img/b353056ebdc1085718fc43ab6d2a1316.png" alt="云服务器结果" style="zoom:50%;" />



> 结果如下：
>
> ```
> /home/rocky/AI_literacy/.venv/bin/python /home/rocky/AI_literacy/CIFAR-10_nn.py 
> 100%|██████████| 170M/170M [00:15<00:00, 11.1MB/s]
> /usr/lib64/python3.9/tarfile.py:2288: RuntimeWarning: The default behavior of tarfile extraction has been changed to disallow common exploits (including CVE-2007-4559). By default, absolute/parent paths are disallowed and some mode bits are cleared. See https://access.redhat.com/articles/7004769 for more details.
>   warnings.warn(
> Using device: cpu
> Starting training with early stopping...
> /home/rocky/AI_literacy/.venv/lib64/python3.9/site-packages/torch/utils/data/dataloader.py:666: UserWarning: 'pin_memory' argument is set as true but no accelerator is found, then device pinned memory won't be used.
>   warnings.warn(warn_msg)
> [1,   100] loss: 1.893
> [1,   200] loss: 1.658
> [1,   300] loss: 1.698
> [1] Avg Loss: 1.804
> [2,   100] loss: 1.399
> [2,   200] loss: 1.580
> [2,   300] loss: 1.407
> [2] Avg Loss: 1.517
> [3,   100] loss: 1.346
> [3,   200] loss: 1.492
> [3,   300] loss: 1.097
> [3] Avg Loss: 1.373
> [4,   100] loss: 1.309
> [4,   200] loss: 1.182
> [4,   300] loss: 1.187
> [4] Avg Loss: 1.244
> [5,   100] loss: 1.104
> [5,   200] loss: 1.084
> [5,   300] loss: 1.081
> [5] Avg Loss: 1.151
> ......
> [267,   100] loss: 0.278
> [267,   200] loss: 0.226
> [267,   300] loss: 0.188
> [267] Avg Loss: 0.249
> [268,   100] loss: 0.218
> [268,   200] loss: 0.220
> [268,   300] loss: 0.206
> [268] Avg Loss: 0.256
> No improvement. Patience: 1/10
> [269,   100] loss: 0.200
> [269,   200] loss: 0.175
> [269,   300] loss: 0.298
> [269] Avg Loss: 0.256
> No improvement. Patience: 2/10
> [270,   100] loss: 0.325
> [270,   200] loss: 0.265
> [270,   300] loss: 0.319
> [270] Avg Loss: 0.258
> No improvement. Patience: 3/10
> [271,   100] loss: 0.316
> [271,   200] loss: 0.139
> [271,   300] loss: 0.263
> [271] Avg Loss: 0.251
> No improvement. Patience: 4/10
> [272,   100] loss: 0.260
> [272,   200] loss: 0.184
> [272,   300] loss: 0.141
> [272] Avg Loss: 0.256
> No improvement. Patience: 5/10
> [273,   100] loss: 0.263
> [273,   200] loss: 0.327
> [273,   300] loss: 0.246
> [273] Avg Loss: 0.250
> No improvement. Patience: 6/10
> [274,   100] loss: 0.193
> [274,   200] loss: 0.221
> [274,   300] loss: 0.227
> [274] Avg Loss: 0.250
> No improvement. Patience: 7/10
> [275,   100] loss: 0.185
> [275,   200] loss: 0.354
> [275,   300] loss: 0.254
> [275] Avg Loss: 0.258
> No improvement. Patience: 8/10
> [276,   100] loss: 0.354
> [276,   200] loss: 0.326
> [276,   300] loss: 0.246
> [276] Avg Loss: 0.250
> No improvement. Patience: 9/10
> [277,   100] loss: 0.183
> [277,   200] loss: 0.383
> [277,   300] loss: 0.295
> [277] Avg Loss: 0.256
> No improvement. Patience: 10/10
> Early stopping triggered.
> ✅ Training completed in 636.54 minutes.
> Accuracy on test images: 83.67%
> Accuracy of plane: 84.70%
> Accuracy of car  : 91.90%
> Accuracy of bird : 84.00%
> Accuracy of cat  : 65.90%
> Accuracy of deer : 81.10%
> Accuracy of dog  : 77.60%
> Accuracy of frog : 89.40%
> Accuracy of horse: 85.00%
> Accuracy of ship : 91.70%
> Accuracy of truck: 85.40%
> 
> Process finished with exit code 0
> 
> ```
>
> 
>
> ![f44849630ac92c19ff8f0b2e922801ab](https://raw.githubusercontent.com/GMyhf/img/main/img/f44849630ac92c19ff8f0b2e922801ab.png)
>
> 



### 常见问题解答（FAQ）

**Q1: 为什么不用 `transforms.Resize(224)`？**

- **关键点**：是否使用预训练权重。
  - 若 `weights=None`（从头训练）→ **不需要 Resize**，可直接用 32×32 输入。
  - 若 `weights=ResNet18_Weights.DEFAULT` → 必须 Resize 到 ≥224×224，或修改首层卷积核。

> 本项目选择从头训练，故保留原始分辨率，避免信息失真。

------

**Q2: 如何解读 `_, predicted = torch.max(outputs, 1)`？**

- `outputs`：形状为 `(N, 10)` 的 logits 张量。
- `torch.max(..., dim=1)`：沿类别维度（dim=1）找最大值。
  - 返回 `(values, indices)`
  - `_` 忽略最大值，`predicted` 保留类别索引（0~9）

> 示例：若输出 `[2.1, 4.2, ..., 3.3]`，则 `predicted = 1`（对应 "automobile"）

------

**Q3: 每类准确率是如何计算的？**

通过遍历测试集，对每个样本：

1. 判断 `predicted == label`
2. 累加到对应类别的 `class_correct[label]`
3. 同时累加 `class_total[label]`

最终：`accuracy[i] = class_correct[i] / class_total[i]`

> 这能揭示模型弱点（如“猫”类准确率显著偏低）。



### 与 Baseline 对比总结

| 方法                          | 准确率     | 是否超越 82%？ |
| ----------------------------- | ---------- | -------------- |
| 原始简易 CNN                  | 76.77%     | ❌              |
| **本项目（ResNet18 + 增强）** | **83.57%** | ✅              |
| cuda-convnet（无增强）        | 82%        | —              |
| cuda-convnet（有增强）        | 89%        | ⚠️ 仍有差距     |

> 下一步可尝试：MixUp、Cutout、Label Smoothing、更大模型（如 ResNet50）、迁移学习等。

------



> 附录：ImageNet Top-5 错误率演进（参考）
>
> ![ImageNet Top-5 Error](https://raw.githubusercontent.com/GMyhf/img/main/img/image-20250726164756658.png)
>
> - **2012 AlexNet**：开启深度学习时代（16.4% < 26%）
> - **2015 ResNet**：首次超越人类（3.6% < 5.0%）
> - **Top-5 定义**：只要真实标签在模型预测的前5名中，即视为正确。



### 结论

通过合理使用 **现代网络架构（ResNet18）** + **充分的数据增强** + **学习率调度**，我们在 CIFAR-10 上轻松超越了早期 CNN 基线，验证了“更强模型 + 更好训练策略 = 更高性能”的原则。





## 4.5 基于 ResNet50 的 Tiny ImageNet 图像分类

本项目演示如何使用 **PyTorch** 和 **torchvision** 在 **Tiny ImageNet** 数据集上微调 **预训练 ResNet50 模型**，完成图像分类任务。尽管 Tiny ImageNet（约 500MB）远小于完整 ImageNet（150GB+），但仍需合理配置数据路径、批大小（batch size）和设备资源。我们在 Apple Silicon（MPS 后端）上成功完成 25 轮训练，验证准确率达 **80.14%**，耗时约 4.5 小时。



### 1. 背景知识

#### 1.1 为什么选择 Tiny ImageNet？

| 特性     | ImageNet                 | Tiny ImageNet     |
| -------- | ------------------------ | ----------------- |
| 类别数   | 1,000                    | 200               |
| 训练图像 | ~128 万张                | 10 万张（500/类） |
| 验证图像 | 5 万张                   | 1 万张（50/类）   |
| 图像尺寸 | 通常 224×224（原始更大） | 固定 64×64        |
| 磁盘占用 | ~150 GB                  | ~250 MB（压缩后） |

Tiny ImageNet 保留了 ImageNet 的语义多样性，同时大幅降低计算开销，非常适合教学、原型验证和本地调试。

#### 1.2 为什么使用 ResNet50？

ResNet50 是由 He et al. (2015) 提出的经典深度卷积网络，其核心创新是**残差连接（skip connection）**，有效缓解了深层网络中的梯度消失与退化问题。

- **结构**：50 层（含卷积、池化、全连接）
- **输入尺寸**：224×224（需对 64×64 图像进行上采样）
- **迁移学习优势**：在 ImageNet 上预训练的权重可显著加速收敛
- **输出层**：默认 1000 类 → 微调为 200 类

------

### 2. 数据准备

#### 2.1 下载与预处理

官方数据集地址： 

```bash
wget http://cs231n.stanford.edu/tiny-imagenet-200.zip
```

> 或者直接下载预处理好的数据。
>
> tiny-imagenet-200.zip, https://disk.pku.edu.cn/link/AA068C93E37D564808A74B8F282DCE0F11
> Name: tiny-imagenet-200.zip
> Expires: Never



解压后，`val/` 目录下的所有图像位于同一文件夹，不符合 `torchvision.datasets.ImageFolder` 的要求（需按类别分目录）。我们提供自动化脚本 `tinyimagenet.sh` 完成整理：

```bash
#!/bin/bash

# download and unzip dataset
#wget http://cs231n.stanford.edu/tiny-imagenet-200.zip
unzip tiny-imagenet-200.zip

current="$(pwd)/tiny-imagenet-200"

# training data
cd $current/train
for DIR in $(ls); do
   cd $DIR
   rm *.txt
   mv images/* .
   rm -r images
   cd ..
done

# validation data
cd $current/val
annotate_file="val_annotations.txt"
length=$(cat $annotate_file | wc -l)
for i in $(seq 1 $length); do
    # fetch i th line
    line=$(sed -n ${i}p $annotate_file)
    # get file name and directory name
    file=$(echo $line | cut -f1 -d" " )
    directory=$(echo $line | cut -f2 -d" ")
    mkdir -p $directory
    mv images/$file $directory
done
rm -r images
echo "done"
```

运行后目录结构如下：

```
tiny-imagenet-200/
├── train/          # 200 个子目录，每类 500 张图
├── val/            # 200 个子目录，每类 50 张图
├── test/           # 无标签（用于竞赛）
├── wnids.txt       # 类别 ID 列表
└── words.txt       # 类别名称映射
```

> 总大小约 **472 MB**。

------

### 3. 模型训练

#### 3.1 环境与硬件

- **设备**：Mac Studio (Apple M1 Ultra, 64GB 统一内存)
- **PyTorch 后端**：MPS（Metal Performance Shaders）
- **关键限制**：MPS **不支持 float64**，需显式使用 `.float()`

#### 3.2 完整代码

 `tiny_imagenet_resnet50_epoch25.py` 

```python
import os
import copy
import torch
import torch.nn as nn
import torch.optim as optim
from torchvision import datasets, models, transforms

# 训练和验证函数
def train_model(model, criterion, optimizer, scheduler, dataloaders, dataset_sizes, num_epochs=25, device='cpu'):
    best_model_wts = copy.deepcopy(model.state_dict())
    best_acc = 0.0

    for epoch in range(num_epochs):
        print('Epoch {}/{}'.format(epoch+1, num_epochs))
        print('-' * 10)

        # 每个 epoch 分为训练和验证阶段
        for phase in ['train', 'val']:
            if phase == 'train':
                model.train()  # 设置为训练模式
            else:
                model.eval()   # 设置为评估模式

            running_loss = 0.0
            running_corrects = 0

            # 遍历数据
            for inputs, labels in dataloaders[phase]:
                inputs = inputs.to(device)
                labels = labels.to(device)

                optimizer.zero_grad()  # 梯度清零

                # 前向传播
                with torch.set_grad_enabled(phase == 'train'):
                    outputs = model(inputs)
                    _, preds = torch.max(outputs, 1)
                    loss = criterion(outputs, labels)

                    # 仅在训练阶段反向传播与参数更新
                    if phase == 'train':
                        loss.backward()
                        optimizer.step()

                running_loss += loss.item() * inputs.size(0)
                running_corrects += torch.sum(preds == labels.data)

            if phase == 'train':
                scheduler.step()

            epoch_loss = running_loss / dataset_sizes[phase]

            # MPS 后端不支持 float64 运算。解决方法是使用 float32，即调用 .float()。
            #epoch_acc = running_corrects.double() / dataset_sizes[phase]
            epoch_acc = running_corrects.float() / dataset_sizes[phase]

            print('{} Loss: {:.4f} Acc: {:.4f}'.format(phase, epoch_loss, epoch_acc))

            # 保存最佳模型参数
            if phase == 'val' and epoch_acc > best_acc:
                best_acc = epoch_acc
                best_model_wts = copy.deepcopy(model.state_dict())
        print()

    print('Best val Acc: {:.4f}'.format(best_acc))
    model.load_state_dict(best_model_wts)
    return model

def main():
    # 1. 数据预处理与加载
    # 注意：此处假定ImageNet数据集按照train/val文件夹分别存放各类别图片，
    # 且每个类别作为一个子文件夹存在
    data_transforms = {
        'train': transforms.Compose([
            transforms.RandomResizedCrop(224),           # 随机裁剪为224×224
            transforms.RandomHorizontalFlip(),           # 随机水平翻转
            transforms.ToTensor(),                         # 转为Tensor
            transforms.Normalize([0.485, 0.456, 0.406],    # ImageNet均值
                                 [0.229, 0.224, 0.225])      # ImageNet标准差
        ]),
        'val': transforms.Compose([
            transforms.Resize(256),
            transforms.CenterCrop(224),                           # 中心裁剪
            transforms.ToTensor(),
            transforms.Normalize([0.485, 0.456, 0.406],
                                 [0.229, 0.224, 0.225])
        ]),
    }

    # Tiny ImageNet 数据路径
    data_dir = '/Users/hfyan/data/tiny-imagenet-200'
    image_datasets = {x: datasets.ImageFolder(os.path.join(data_dir, x),
                                                data_transforms[x])
                      for x in ['train', 'val']}

    # 设置 num_workers 为 8 以利用多进程数据加载
    dataloaders = {x: torch.utils.data.DataLoader(image_datasets[x],
                                                    batch_size=128,    # 可根据实际情况调整
                                                    shuffle=True,
                                                    num_workers=8)
                   for x in ['train', 'val']}

    dataset_sizes = {x: len(image_datasets[x]) for x in ['train', 'val']}
    class_names = image_datasets['train'].classes

    #device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    # 使用 MPS 作为 GPU 后端（适用于 Apple Silicon）
    if torch.backends.mps.is_available():
        device = torch.device("mps")
        print("Using MPS device for GPU acceleration")
    else:
        device = torch.device("cpu")
        print("MPS device not available, using CPU")

    #2. 构建模型（使用预训练 ResNet50）
    # 这里我们加载预训练的 ResNet50 模型，并修改最后的全连接层以适应Tiny ImageNet的类别数（200类）
    model_ft = models.resnet50(weights=models.ResNet50_Weights.DEFAULT)
    num_ftrs = model_ft.fc.in_features
    model_ft.fc = nn.Linear(num_ftrs, len(class_names))
    model_ft = model_ft.to(device)

    criterion = nn.CrossEntropyLoss()
    optimizer_ft = optim.SGD(model_ft.parameters(), lr=0.001, momentum=0.9)

    # 学习率调整策略，每7个epoch降低一次学习率
    exp_lr_scheduler = optim.lr_scheduler.StepLR(optimizer_ft, step_size=7, gamma=0.1)

    #3. 训练模型
    num_epochs = 25  # 可根据需要调整epoch数量
    model_ft = train_model(model_ft, criterion, optimizer_ft, exp_lr_scheduler,
                           dataloaders, dataset_sizes, num_epochs=num_epochs, device=device)

    #4. 保存模型，文件名建议为 tiny_imagenet_resnet50_epoch25.pth
    torch.save(model_ft.state_dict(), 'tiny_imagenet_resnet50_epoch25.pth')
    print("Model saved as tiny_imagenet_resnet50_epoch25.pth")

if __name__ == '__main__':
    main()
```

> **说明**
>
> - **数据预处理**
>   使用了 `transforms` 对数据进行了数据增强（如随机裁剪、水平翻转）以及归一化（ImageNet常用的均值和标准差）。数据文件夹需要符合 `ImageFolder` 的要求，每个类别存放在独立的子文件夹中。
> - **模型构建**
>   本示例中采用预训练的 ResNet50 模型，并修改了最后一层全连接层以输出与类别数匹配的概率分布。
> - **训练过程**
>   代码中定义了 `train_model` 函数，对模型进行训练和验证，并在验证集上选取准确率最高的模型参数。学习率调度器用于逐步降低学习率以便更好地收敛。
> - **注意事项**
>   - ImageNet 数据集较大，建议在使用时注意数据加载、内存管理和训练时长。
>   - 如需更深入的模型调优或使用分布式训练，请参考 PyTorch 官方文档和相关资料。
>
> 该示例代码为入门级示例，实际项目中可能需要更多的优化和配置。
>
> 
>
> **主入口保护**：所有涉及多进程或多线程的代码都封装在 `if __name__ == '__main__':` 下，避免 macOS 下的启动问题。



**2025/2/24 11:30开始运行，16:00结束**

>  File "/Users/hfyan/data/tiny_imagenet_resnet50_epoch25.py", line 47, in train_model
>
>  epoch_acc = running_corrects.double() / dataset_sizes[phase]
>
>  TypeError: Cannot convert a MPS Tensor to float64 dtype as the MPS framework doesn't support float64. Please use float32 instead.
>
>  (base) hfyan@HongfeideMac-Studio data % python tiny_imagenet_resnet50_epoch25.py 

```
(base) hfyan@HongfeideMac-Studio data % python tiny_imagenet_resnet50_epoch25.py 
Using MPS device for GPU acceleration
Epoch 1/25
----------
train Loss: 5.0366 Acc: 0.0720
val Loss: 4.1348 Acc: 0.2819

Epoch 2/25
----------
train Loss: 3.2563 Acc: 0.3406
val Loss: 1.7006 Acc: 0.6197

Epoch 3/25
----------
train Loss: 2.1834 Acc: 0.5065
val Loss: 1.2068 Acc: 0.7062

Epoch 4/25
----------
train Loss: 1.8635 Acc: 0.5663
val Loss: 1.0010 Acc: 0.7498

Epoch 5/25
----------
train Loss: 1.6788 Acc: 0.6029
val Loss: 0.8927 Acc: 0.7702

Epoch 6/25
----------
train Loss: 1.5723 Acc: 0.6268
val Loss: 0.8407 Acc: 0.7808

Epoch 7/25
----------
train Loss: 1.5044 Acc: 0.6390
val Loss: 0.7990 Acc: 0.7907

Epoch 8/25
----------
train Loss: 1.4324 Acc: 0.6567
val Loss: 0.7788 Acc: 0.7939

Epoch 9/25
----------
train Loss: 1.4212 Acc: 0.6571
val Loss: 0.7701 Acc: 0.7981

Epoch 10/25
----------
train Loss: 1.4054 Acc: 0.6614
val Loss: 0.7669 Acc: 0.7966

Epoch 11/25
----------
train Loss: 1.4035 Acc: 0.6615
val Loss: 0.7634 Acc: 0.7980

Epoch 12/25
----------
train Loss: 1.3995 Acc: 0.6626
val Loss: 0.7595 Acc: 0.7990

Epoch 13/25
----------
train Loss: 1.3882 Acc: 0.6647
val Loss: 0.7558 Acc: 0.7988

Epoch 14/25
----------
train Loss: 1.3747 Acc: 0.6680
val Loss: 0.7517 Acc: 0.7997

Epoch 15/25
----------
train Loss: 1.3754 Acc: 0.6683
val Loss: 0.7490 Acc: 0.8006

Epoch 16/25
----------
train Loss: 1.3685 Acc: 0.6689
val Loss: 0.7592 Acc: 0.7970

Epoch 17/25
----------
train Loss: 1.3771 Acc: 0.6681
val Loss: 0.7567 Acc: 0.8009

Epoch 18/25
----------
train Loss: 1.3690 Acc: 0.6688
val Loss: 0.7508 Acc: 0.8011

Epoch 19/25
----------
train Loss: 1.3716 Acc: 0.6694
val Loss: 0.7521 Acc: 0.8008

Epoch 20/25
----------
train Loss: 1.3729 Acc: 0.6687
val Loss: 0.7527 Acc: 0.8002

Epoch 21/25
----------
train Loss: 1.3709 Acc: 0.6689
val Loss: 0.7501 Acc: 0.8014

Epoch 22/25
----------
train Loss: 1.3706 Acc: 0.6708
val Loss: 0.7516 Acc: 0.8008

Epoch 23/25
----------
train Loss: 1.3681 Acc: 0.6696
val Loss: 0.7502 Acc: 0.8002

Epoch 24/25
----------
train Loss: 1.3725 Acc: 0.6698
val Loss: 0.7508 Acc: 0.8003

Epoch 25/25
----------
train Loss: 1.3708 Acc: 0.6696
val Loss: 0.7480 Acc: 0.8004

Best val Acc: 0.8014
Model saved as tiny_imagenet_resnet50_epoch25.pth

```

跑了4小时30分钟。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20250224171542842.png" alt="image-20250224171542842" style="zoom:50%;" />



```
% ls -lh *.pth
-rw-r--r--  1 hfyan  staff    92M Feb 24 16:02 tiny_imagenet_resnet50_epoch25.pth
```







#### 3.3 常见问题解答

##### Q1：为何每次运行都重新下载 ResNet50 权重？

PyTorch 默认缓存至 `~/.cache/torch/hub/checkpoints/`。若重复下载，请检查：

- 文件是否存在且完整（`resnet50-11ad3fa6.pth` ≈ 97MB）
- 目录写权限
- 是否使用临时环境（如容器）

可通过设置环境变量指定缓存路径：

```bash
export TORCH_HOME=/path/to/stable/cache
```

##### Q2：MPS 报错 “Cannot convert to float64”？

Apple MPS 不支持 double 精度。务必使用：

```python
accuracy = correct.float() / total  # ✅ 正确
# accuracy = correct.double() / total  # ❌ 错误
```

##### Q3：如何命名模型文件？

推荐格式：`{dataset}_{model}_{epochs}.pth`
示例：`tiny_imagenet_resnet50_epoch25.pth`

------

### 4. 模型评估

前面已经保存了模型权重，可以通过如下步骤加载模型并在验证集上进行评估：

1. **加载模型结构和权重**  
   请确保你定义的模型结构与训练时保持一致。使用 `torch.load` 加载权重，并用 `model.load_state_dict` 导入。

2. **切换到评估模式**  
   调用 `model.eval()` 确保模型关闭 BatchNorm、Dropout 等训练时特有的行为。

3. **遍历验证数据并计算准确率**  
   使用 `torch.no_grad()` 关闭梯度计算，加快验证速度，并防止内存浪费。

下面是一个完整的示例代码，`eval_tiny_imagenet_resnet50_epoch25_pth.py `：

```python
import os
import torch
import torch.nn as nn
from torchvision import datasets, models, transforms

# 数据预处理
data_transforms = {
    'val': transforms.Compose([
        transforms.Resize(256),
        transforms.CenterCrop(224),
        transforms.ToTensor(),
        transforms.Normalize([0.485, 0.456, 0.406],
                             [0.229, 0.224, 0.225])
    ]),
}

# 确保子进程安全启动
if __name__ == '__main__':
    data_dir = '/Users/hfyan/data/tiny-imagenet-200'
    val_dir = os.path.join(data_dir, 'val')
    val_dataset = datasets.ImageFolder(val_dir, data_transforms['val'])
    val_loader = torch.utils.data.DataLoader(val_dataset, batch_size=64,
                                             shuffle=False, num_workers=4)

    # 选择设备
    if torch.backends.mps.is_available():
        device = torch.device("mps")
        print("Using MPS device for GPU acceleration")
    else:
        device = torch.device("cpu")
        print("MPS device not available, using CPU")

    # 加载模型
    model_ft = models.resnet50(pretrained=False)
    num_ftrs = model_ft.fc.in_features
    model_ft.fc = nn.Linear(num_ftrs, len(val_dataset.classes))
    model_ft = model_ft.to(device)

    # 加载模型权重
    model_path = 'tiny_imagenet_resnet50_epoch25.pth'
    model_ft.load_state_dict(torch.load(model_path, map_location=device))

    # 评估模式
    model_ft.eval()

    # 模型评估
    running_corrects = 0
    total_samples = 0

    with torch.no_grad():
        for inputs, labels in val_loader:
            inputs = inputs.to(device)
            labels = labels.to(device)

            outputs = model_ft(inputs)
            _, preds = torch.max(outputs, 1)
            running_corrects += torch.sum(preds == labels.data)
            total_samples += inputs.size(0)

    val_acc = running_corrects.float() / total_samples
    print('Validation Accuracy: {:.4f}'.format(val_acc))

```

验证步骤：  

> - 加载与你训练时一致的模型结构。  
> - 使用 `model.load_state_dict()` 加载权重。  
> - 调用 `model.eval()` 进入验证模式。  
> - 遍历验证数据集，计算准确率或其他指标。
>
> 这样，你就可以加载已保存的模型并对验证集数据进行测试。
>
> ![image-20250224171857564](https://raw.githubusercontent.com/GMyhf/img/main/img/image-20250224171857564.png)
>
> 
>
> ```python
> (base) hfyan@HongfeideMac-Studio data % python eval_tiny_imagenet_resnet50_epoch25_pth.py 
> Using MPS device for GPU acceleration
> /Users/hfyan/miniconda3/lib/python3.10/site-packages/torchvision/models/_utils.py:208: UserWarning: The parameter 'pretrained' is deprecated since 0.13 and may be removed in the future, please use 'weights' instead.
>   warnings.warn(
> /Users/hfyan/miniconda3/lib/python3.10/site-packages/torchvision/models/_utils.py:223: UserWarning: Arguments other than a weight enum or `None` for 'weights' are deprecated since 0.13 and may be removed in the future. The current behavior is equivalent to passing `weights=None`.
>   warnings.warn(msg)
> Validation Accuracy: 0.8014
> (base) hfyan@HongfeideMac-Studio data % 
> ```





### 5. 扩展与优化

#### 5.1 性能对比：ImageNet vs Tiny ImageNet

| 指标      | ImageNet (ResNet50)           | Tiny ImageNet (本实验)   |
| --------- | ----------------------------- | ------------------------ |
| Top-1 Acc | ~76.5%（原始）→ 84%（优化后） | **80.14%**               |
| 训练时间  | 数天（8×V100）                | **4.5 小时**（M1 Ultra） |
| 显存需求  | >16 GB                        | <8 GB（batch=128）       |

------

#### 5.2 关于多进程与 GIL

- `DataLoader(num_workers>0)` 使用 **多进程**（非线程），绕过 Python GIL
- PyTorch 底层计算（C++/CUDA/Metal）不受 GIL 限制
- 小规模任务（如小矩阵乘法）并行可能因通信开销而变慢



#### 总结

本项目完整展示了从数据准备、模型微调到评估的全流程，适合入门者理解迁移学习与 PyTorch 实践。通过合理利用 Apple Silicon 的 MPS 加速，可在消费级设备上高效完成中等规模视觉任务。



# 5.强化学习

## 5.1 Pong 游戏智能体

包含多种强化学习算法（Q-learning, DQN, A2C）用于训练 Pong 游戏智能体的仓库。本项目提供了完整的训练环境、算法实现以及可视化工具。

> 【25级工学院同学】贡献几个RL的实例，《动手学强化学习》https://hrl.boyuai.com 上的前面的算法，都用自己创建的一个乒乓球小游戏的环境在cpu上面跑通过。然后还看了一些yutube上面斯坦福的cs231n。

https://github.com/DawnTilDusk/RL-pong



![b4b9b09baae54999124c0d40b103f821](https://raw.githubusercontent.com/GMyhf/img/main/img/b4b9b09baae54999124c0d40b103f821.png)



![069863b29821d10dce6ac5be5b672f88](https://raw.githubusercontent.com/GMyhf/img/main/img/069863b29821d10dce6ac5be5b672f88.png)



![f2b4206a1e4b9b226b94b1cdf6080e36](https://raw.githubusercontent.com/GMyhf/img/main/img/f2b4206a1e4b9b226b94b1cdf6080e36.png)



## 5.2 2048 游戏智能体

图形界面，上下左右键玩2048

https://github.com/GMyhf/2025spring-cs201/blob/main/code/2048/1_game_2048_gui.py

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/4c2083c36ead794a176139ce9b55a844.png" alt="4c2083c36ead794a176139ce9b55a844" style="zoom:50%;" />



用强化学习 DQN 算法训练，在我的Mac Studio 运行19个小时。

https://github.com/GMyhf/2025spring-cs201/blob/main/code/2048/DQN_train_2048.py

![8be359d76c8a61f2095958c2562a4214](https://raw.githubusercontent.com/GMyhf/img/main/img/8be359d76c8a61f2095958c2562a4214.png)



获得模型参数文件 https://github.com/GMyhf/2025spring-cs201/blob/main/code/2048/2048_bot.pth



利用模型，自动玩2048，https://github.com/GMyhf/2025spring-cs201/blob/main/code/2048/play_2048.py

![d22f25773c3cc351bc791c1a77a0e5d9](https://raw.githubusercontent.com/GMyhf/img/main/img/d22f25773c3cc351bc791c1a77a0e5d9.png)





# 6. 运行《从零构建大模型》代码

《从零构建大模型》代码，https://github.com/rasbt/LLMs-from-scratch

Build a Large Language Model (From Scratch)

可以在本地 mac 或者 window 运行，配置方法方法如： ...Setup_....md。

https://github.com/GMyhf/2025fall-cs201/tree/main/LLM



附录B《大模型自我检测指南》（Test Yourself On Build a Large Language.pdf）的结构与《从零构建大语言模型》完全对应，聚焦于各章节的核心概念。可以通过多项选择题、代码与关键概念相关问题，以及需要深入思考的开放式问答题来检验自己的理解。所有题目均附有答案。

无论你当前的知识水平如何，指南都能以不同方式助你一臂之力：在阅读完某一章后使用它，可巩固所学内容；而在阅读前先浏览它，同样大有裨益——通过预先测试核心概念及其相互关系，你能更轻松地理解章节内容，并为吸收新知识做好准备。



# 附录A PyTorch教程

https://www.runoob.com/pytorch/pytorch-tutorial.html

PyTorch 是一个开源的机器学习库，主要用于进行计算机视觉（CV）、自然语言处理（NLP）、语音识别等领域的研究和开发。

PyTorch由 Facebook 的人工智能研究团队开发，并在机器学习和深度学习社区中广泛使用。

PyTorch 以其灵活性和易用性而闻名，特别适合于深度学习研究和开发。



## A.1 PyTorch安装

在已经安装好的python环境中，在terminal窗口命令行中，激活环境，并安装torch包

> Python开发环境配置指南，https://github.com/GMyhf/2025fall-cs101/blob/main/Python_Development_Setup_Mac_Windows.md

```
[hfyan@HongfeideMac-Studio MyPythonApp % source .venv/bin/activate
(.venv) hfyan@HongfeideMac-Studio MyPythonApp % uv pip install torch torchvision torchaudio

```



**验证安装**

为了确保 PyTorch 已正确安装，我们可以通过执行以下 PyTorch 代码来验证是否安装成功：

**实例**

```python
import torch

# 当前安装的 PyTorch 库的版本
print(torch.__version__)

# 检测 MPS 作为 GPU 后端是否可用（适用于 Apple Silicon）
if torch.backends.mps.is_available():
    device = torch.device("mps")
    print("Using MPS device for GPU acceleration")
else:   # 检查 CUDA 是否可用，即你的系统有 NVIDIA 的 GPU
    device = torch.device("cuda:0" if torch.cuda.is_available() else "cpu")
    print("MPS device not available, using CPU")

"""
2.9.1
Using MPS device for GPU acceleration
"""
```



一个简单的实例，构建一个随机初始化的张量：

```python
import torch
x = torch.rand(5, 3)
print(x)
```

如果安装成功，输出结果类似如下：

```
tensor([[0.8622, 0.5916, 0.8073],
        [0.8955, 0.7416, 0.3482],
        [0.8059, 0.1414, 0.2828],
        [0.0923, 0.0113, 0.4226],
        [0.4438, 0.9789, 0.9048]])
```



**实例**

下面的是 PyTorch 中一些基本的张量操作：如何创建随机张量、进行逐元素运算、访问特定元素以及计算总和和最大值。

```python
import torch

# 设置数据类型和设备
dtype = torch.float  # 张量数据类型为浮点型
device = torch.device("cpu")  # 本次计算在 CPU 上进行

# 创建并打印两个随机张量 a 和 b
a = torch.randn(2, 3, device=device, dtype=dtype)  # 创建一个 2x3 的随机张量
b = torch.randn(2, 3, device=device, dtype=dtype)  # 创建另一个 2x3 的随机张量

print("张量 a:")
print(a)

print("张量 b:")
print(b)

# 逐元素相乘并输出结果
print("a 和 b 的逐元素乘积:")
print(a * b)

# 输出张量 a 所有元素的总和
print("张量 a 所有元素的总和:")
print(a.sum())

# 输出张量 a 中第 2 行第 3 列的元素（注意索引从 0 开始）
print("张量 a 第 2 行第 3 列的元素:")
print(a[1, 2])

# 输出张量 a 中的最大值
print("张量 a 中的最大值:")
print(a.max())

"""
张量 a:
tensor([[ 0.8182,  0.4718,  0.8318],
        [ 0.8146,  0.1508, -1.7619]])
张量 b:
tensor([[-1.7713,  0.8521,  0.4598],
        [ 0.3082,  0.0558,  0.1254]])
a 和 b 的逐元素乘积:
tensor([[-1.4493,  0.4020,  0.3824],
        [ 0.2510,  0.0084, -0.2209]])
张量 a 所有元素的总和:
tensor(1.3252)
张量 a 第 2 行第 3 列的元素:
tensor(-1.7619)
张量 a 中的最大值:
tensor(0.8318)
"""
```



## A.2 PyTorch 简介

PyTorch 是一个开源的 Python 机器学习库，基于 Torch 库，底层由 C++ 实现，应用于人工智能领域，如计算机视觉和自然语言处理。

PyTorch 最初由 Meta Platforms 的人工智能研究团队开发，现在属 于Linux 基金会的一部分。

许多深度学习软件都是基于 PyTorch 构建的，包括特斯拉自动驾驶、Uber 的 Pyro、Hugging Face 的 Transformers、 PyTorch Lightning 和 Catalyst。

**PyTorch 主要有两大特征：**

- 类似于 NumPy 的张量计算，能在 GPU 或 MPS 等硬件加速器上加速。
- 基于带自动微分系统的深度神经网络。

PyTorch 包括 torch.autograd、torch.nn、torch.optim 等子模块。

PyTorch 包含多种损失函数，包括 MSE（均方误差 = L2 范数）、交叉熵损失和负熵似然损失（对分类器有用）等。

### PyTorch 特性

- **动态计算图（Dynamic Computation Graphs）**： PyTorch 的计算图是动态的，这意味着它们在运行时构建，并且可以随时改变。这为实验和调试提供了极大的灵活性，因为开发者可以逐行执行代码，查看中间结果。
- **自动微分（Automatic Differentiation）**： PyTorch 的自动微分系统允许开发者轻松地计算梯度，这对于训练深度学习模型至关重要。它通过反向传播算法自动计算出损失函数对模型参数的梯度。
- **张量计算（Tensor Computation）**： PyTorch 提供了类似于 NumPy 的张量操作，这些操作可以在 CPU 和 GPU 上执行，从而加速计算过程。张量是 PyTorch 中的基本数据结构，用于存储和操作数据。
- **丰富的 API**： PyTorch 提供了大量的预定义层、损失函数和优化算法，这些都是构建深度学习模型的常用组件。
- **多语言支持**： PyTorch 虽然以 Python 为主要接口，但也提供了 C++ 接口，允许更底层的集成和控制。

#### 动态计算图（Dynamic Computation Graph）

PyTorch 最显著的特点之一是其动态计算图的机制。

与 TensorFlow 的静态计算图（graph）不同，PyTorch 在执行时构建计算图，这意味着在每次计算时，图都会根据输入数据的形状自动变化。

**动态计算图的优点：**

- 更加灵活，特别适用于需要条件判断或递归的场景。
- 方便调试和修改，能够直接查看中间结果。
- 更接近 Python 编程的风格，易于上手。

#### 张量（Tensor）与自动求导（Autograd）

PyTorch 中的核心数据结构是 **张量（Tensor）**，它是一个多维矩阵，可以在 CPU 或 GPU 上高效地进行计算。张量的操作支持自动求导（Autograd）机制，使得在反向传播过程中自动计算梯度，这对于深度学习中的梯度下降优化算法至关重要。

**张量（Tensor）：**

- 支持在 CPU 和 GPU 之间进行切换。
- 提供了类似 NumPy 的接口，支持元素级运算。
- 支持自动求导，可以方便地进行梯度计算。

**自动求导（Autograd）：**

- PyTorch 内置的自动求导引擎，能够自动追踪所有张量的操作，并在反向传播时计算梯度。
- 通过 `requires_grad` 属性，可以指定张量需要计算梯度。
- 支持高效的反向传播，适用于神经网络的训练。

#### 模型定义与训练

PyTorch 提供了 `torch.nn` 模块，允许用户通过继承 `nn.Module` 类来定义神经网络模型。使用 `forward` 函数指定前向传播，自动反向传播（通过 `autograd`）和梯度计算也由 PyTorch 内部处理。

**神经网络模块（torch.nn）：**

- 提供了常用的层（如线性层、卷积层、池化层等）。
- 支持定义复杂的神经网络架构（包括多输入、多输出的网络）。
- 兼容与优化器（如 `torch.optim`）一起使用。

#### GPU 加速

PyTorch 完全支持在 GPU 上运行，以加速深度学习模型的训练。通过简单的 `.to(device)` 方法，用户可以将模型和张量转移到 GPU 上进行计算。PyTorch 支持多 GPU 训练，能够利用 NVIDIA CUDA 技术显著提高计算效率。

**GPU 支持：**

- 自动选择 GPU 或 CPU。
- 支持通过 CUDA 加速运算。
- 支持多 GPU 并行计算（`DataParallel` 或 `torch.distributed`）。

#### 生态系统与社区支持

PyTorch 作为一个开源项目，拥有一个庞大的社区和生态系统。它不仅在学术界得到了广泛的应用，也在工业界，特别是在计算机视觉、自然语言处理等领域中得到了广泛部署。PyTorch 还提供了许多与深度学习相关的工具和库，如：

- **torchvision**：用于计算机视觉任务的数据集和模型。
- **torchtext**：用于自然语言处理任务的数据集和预处理工具。
- **torchaudio**：用于音频处理的工具包。
- **PyTorch Lightning**：一种简化 PyTorch 代码的高层库，专注于研究和实验的快速迭代。

------

### 与其他框架的对比

PyTorch 由于其灵活性、易用性和社区支持，已经成为很多深度学习研究者和开发者的首选框架。

#### TensorFlow vs PyTorch

- PyTorch 的动态计算图使得它更加灵活，适合快速实验和研究；而 TensorFlow 的静态计算图在生产环境中更具优化空间。
- PyTorch 在调试时更加方便，TensorFlow 则在部署上更加成熟，支持更广泛的硬件和平台。
- 近年来，TensorFlow 也引入了动态图（如 TensorFlow 2.x），使得两者在功能上趋于接近。
- 其他深度学习框架，如 Keras、Caffe 等也有一定应用，但 PyTorch 由于其灵活性、易用性和社区支持，已经成为很多深度学习研究者和开发者的首选框架。

| 特性               | **TensorFlow**                                          | **PyTorch**                                                  |
| :----------------- | :------------------------------------------------------ | :----------------------------------------------------------- |
| **开发公司**       | Google                                                  | Facebook (FAIR)                                              |
| **计算图类型**     | 静态计算图（定义后再执行）                              | 动态计算图（定义即执行）                                     |
| **灵活性**         | 低（计算图在编译时构建，不易修改）                      | 高（计算图在执行时动态创建，易于修改和调试）                 |
| **调试**           | 较难（需要使用 `tf.debugging` 或外部工具调试）          | 容易（可以直接在 Python 中进行调试）                         |
| **易用性**         | 低（较复杂，API 较多，学习曲线较陡峭）                  | 高（API 简洁，语法更加接近 Python，容易上手）                |
| **部署**           | 强（支持广泛的硬件，如 TensorFlow Lite、TensorFlow.js） | 较弱（部署工具和平台相对较少，虽然有 TensorFlow 支持）       |
| **社区支持**       | 很强（成熟且庞大的社区，广泛的教程和文档）              | 很强（社区活跃，特别是在学术界，快速发展的生态）             |
| **模型训练**       | 支持分布式训练，支持多种设备（如 CPU、GPU、TPU）        | 支持分布式训练，支持多 GPU、CPU 和 TPU                       |
| **API 层级**       | 高级API：Keras；低级API：TensorFlow Core                | 高级API：TorchVision、TorchText 等；低级API：Torch           |
| **性能**           | 高（优化方面成熟，适合生产环境）                        | 高（适合研究和原型开发，生产性能也在提升）                   |
| **自动求导**       | 通过 `tf.GradientTape` 实现动态求导（较复杂）           | 通过 `autograd` 动态求导（更简洁和直观）                     |
| **调优与可扩展性** | 强（支持在多平台上运行，如 TensorFlow Serving 等）      | 较弱（虽然在学术和实验环境中表现优越，但生产环境支持相对较少） |
| **框架灵活性**     | 较低（TensorFlow 2.x 引入了动态图特性，但仍不完全灵活） | 高（动态图带来更高的灵活性）                                 |
| **支持多种语言**   | 支持多种语言（Python, C++, Java, JavaScript, etc.）     | 主要支持 Python（但也有 C++ API）                            |
| **兼容性与迁移**   | TensorFlow 2.x 与旧版本兼容性较好                       | 与 TensorFlow 兼容性差，迁移较难                             |

#### PyTorch vs NumPy

| 特性         | PyTorch            | NumPy            |
| :----------- | :----------------- | :--------------- |
| **目标**     | 深度学习专用       | 通用科学计算     |
| **GPU 支持** | 原生支持 CUDA      | 不直接支持       |
| **自动微分** | 内置自动求导       | 需要手动计算梯度 |
| **神经网络** | 丰富的神经网络模块 | 需要从零实现     |
| **学习成本** | 相对较高           | 相对较低         |

------

### PyTorch 的历史与发展

PyTorch 的前身是 Torch，这是一个基于 Lua 语言的科学计算框架。随着 Python 在机器学习领域的兴起，Facebook 团队决定将 Torch 的核心思想移植到 Python 上，从而诞生了 PyTorch。

- **2016年**：Facebook 发布 PyTorch 0.1 版本
- **2017年**：PyTorch 0.2 引入分布式训练支持
- **2018年**：PyTorch 1.0 发布，增加了生产部署能力
- **2019年**：PyTorch 1.3 引入移动端支持
- **2020年**：PyTorch 1.6 增加了自动混合精度训练
- **2021年**：PyTorch 1.9 引入 TorchScript 和 C++ 前端
- **2022年**：PyTorch 1.12 优化了性能和稳定性
- **2023年**：PyTorch 2.0 发布，引入编译模式大幅提升性能



## A.3 PyTorch 基础

PyTorch 是一个开源的深度学习框架，以其灵活性和动态计算图而广受欢迎。

PyTorch 主要有以下几个基础概念：张量（Tensor）、自动求导（Autograd）、神经网络模块（nn.Module）、优化器（optim）等。

- **张量（Tensor）**：PyTorch 的核心数据结构，支持多维数组，并可以在 CPU 或 GPU 上进行加速计算。
- **自动求导（Autograd）**：PyTorch 提供了自动求导功能，可以轻松计算模型的梯度，便于进行反向传播和优化。
- **神经网络（nn.Module）**：PyTorch 提供了简单且强大的 API 来构建神经网络模型，可以方便地进行前向传播和模型定义。
- **优化器（Optimizers）**：使用优化器（如 Adam、SGD 等）来更新模型的参数，使得损失最小化。
- **设备（Device）**：可以将模型和张量移动到 GPU 上以加速计算。

------

### PyTorch 架构总览

PyTorch 采用模块化设计，由多个相互协作的核心组件构成。理解这些组件的作用和相互关系，是掌握 PyTorch 的关键。

**PyTorch 架构图**

```
┌─────────────────────────────────────────────────────────────┐
│                    PyTorch 生态系统                          │
├─────────────────────────────────────────────────────────────┤
│  torchvision  │  torchtext  │  torchaudio  │  其他专业库     │
├─────────────────────────────────────────────────────────────┤
│                     PyTorch 核心                            │
├───────────────┬─────────────────┬───────────────────────────┤
│   torch.nn    │   torch.optim   │      torch.utils          │
│   (神经网络)   │   (优化器)      │      (工具函数)           │
├───────────────┼─────────────────┼───────────────────────────┤
│               │                 │   torch.utils.data        │
│  torch 核心   │  autograd       │   (数据加载)              │
│  (张量计算)   │  (自动微分)     │                           │
└───────────────┴─────────────────┴───────────────────────────┘
```

PyTorch 采用**分层架构**设计，从上层到底层依次为： 

**1、Python API（顶层）**

- `torch`：核心张量计算（类似NumPy，支持GPU）。 
- `torch.nn`：神经网络层、损失函数等。 
- `torch.autograd`：自动微分（反向传播）。 
- 开发者直接调用的接口，简单易用。 

**2、C++核心（中层）**

- **ATen**：张量运算核心库（400+操作）。 
- **JIT**：即时编译优化模型。 
- **Autograd引擎**：自动微分的底层实现。 
- 高性能计算，连接Python与底层硬件。 

**3、基础库（底层）**

- **TH/THNN**：C语言实现的基础张量和神经网络操作。 
- **THC/THCUNN**：对应的CUDA（GPU）版本。 
- 直接操作硬件（CPU/GPU），极致优化速度。 

**执行流程**：
Python代码 → C++核心计算 → 底层CUDA/C库加速 → 返回结果。
既保持易用性，又确保高性能。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/iGWbOXL.png" alt="img" style="zoom:67%;" />

**张量（Tensor）**

张量（Tensor）是 PyTorch 中的核心数据结构，用于存储和操作多维数组。

张量可以视为一个多维数组，支持加速计算的操作。

在 PyTorch 中，张量的概念类似于 NumPy 中的数组，但是 PyTorch 的张量可以运行在不同的设备上，比如 CPU 和 GPU，这使得它们非常适合于进行大规模并行计算，特别是在深度学习领域。

- **维度（Dimensionality）**：张量的维度指的是数据的多维数组结构。例如，一个标量（0维张量）是一个单独的数字，一个向量（1维张量）是一个一维数组，一个矩阵（2维张量）是一个二维数组，以此类推。
- **形状（Shape）**：张量的形状是指每个维度上的大小。例如，一个形状为`(3, 4)`的张量意味着它有3行4列。
- **数据类型（Dtype）**：张量中的数据类型定义了存储每个元素所需的内存大小和解释方式。PyTorch支持多种数据类型，包括整数型（如`torch.int8`、`torch.int32`）、浮点型（如`torch.float32`、`torch.float64`）和布尔型（`torch.bool`）。

**张量创建：**

**实例**

```python
import torch

# 创建一个 2x3 的全 0 张量
a = torch.zeros(2, 3)
print(a)

# 创建一个 2x3 的全 1 张量
b = torch.ones(2, 3)
print(b)

# 创建一个 2x3 的随机数张量
c = torch.randn(2, 3)
print(c)

# 从 NumPy 数组创建张量
import numpy as np
numpy_array = np.array([[1, 2], [3, 4]])
tensor_from_numpy = torch.from_numpy(numpy_array)
print(tensor_from_numpy)

# 在指定设备（CPU/GPU）上创建张量
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")
d = torch.randn(2, 3, device=device)
print(d)
```

输出结果类似如下：

```
tensor([[0., 0., 0.],
        [0., 0., 0.]])
tensor([[1., 1., 1.],
        [1., 1., 1.]])
tensor([[ 1.0189, -0.5718, -1.2814],
        [-0.5865,  1.0855,  1.1727]])
tensor([[1, 2],
        [3, 4]])
tensor([[-0.3360,  0.2203,  1.3463],
        [-0.5982, -0.2704,  0.5429]])
```

**常用张量操作：**

**实例**

```py
# 张量相加
e = torch.randn(2, 3)
f = torch.randn(2, 3)
print(e + f)

# 逐元素乘法
print(e * f)

# 张量的转置
g = torch.randn(3, 2)
print(g.t()) # 或者 g.transpose(0, 1)

# 张量的形状
print(g.shape) # 返回形状
```



**张量与设备**

PyTorch 张量可以存在于不同的设备上，包括CPU和GPU，你可以将张量移动到 GPU 上以加速计算：

```
if torch.cuda.is_available():
    tensor_gpu = tensor_from_list.to('cuda')  # 将张量移动到GPU
```

**梯度和自动微分**

PyTorch的张量支持自动微分，这是深度学习中的关键特性。当你创建一个需要梯度的张量时，PyTorch可以自动计算其梯度：

**实例**

```python
# 创建一个需要梯度的张量
tensor_requires_grad = torch.tensor([1.0], requires_grad=True)

# 进行一些操作
tensor_result = tensor_requires_grad * 2

# 计算梯度
tensor_result.backward()
print(tensor_requires_grad.grad) # 输出梯度
```



**内存和性能**

PyTorch 张量还提供了一些内存管理功能，比如.clone()、.detach() 和 .to() 方法，它们可以帮助你优化内存使用和提高性能。

------

### 自动求导（Autograd）

自动求导（Automatic Differentiation，简称Autograd）是深度学习框架中的一个核心特性，它允许计算机自动计算数学函数的导数。

在深度学习中，自动求导主要用于两个方面：**一是在训练神经网络时计算梯度**，**二是进行反向传播算法的实现**。

自动求导基于链式法则（Chain Rule），这是一个用于计算复杂函数导数的数学法则。链式法则表明，复合函数的导数是其各个组成部分导数的乘积。在深度学习中，模型通常是由许多层组成的复杂函数，自动求导能够高效地计算这些层的梯度。

**动态图与静态图：**

- **动态图（Dynamic Graph）**：在动态图中，计算图在运行时动态构建。每次执行操作时，计算图都会更新，这使得调试和修改模型变得更加容易。PyTorch使用的是动态图。
- **静态图（Static Graph）**：在静态图中，计算图在开始执行之前构建完成，并且不会改变。TensorFlow最初使用的是静态图，但后来也支持动态图。

PyTorch 提供了自动求导功能，通过 autograd 模块来自动计算梯度。

torch.Tensor 对象有一个 requires_grad 属性，用于指示是否需要计算该张量的梯度。

当你创建一个 requires_grad=True 的张量时，PyTorch 会自动跟踪所有对它的操作，以便在之后计算梯度。

创建需要梯度的张量:

**实例**

```python
# 创建一个需要计算梯度的张量
x = torch.randn(2, 2, requires_grad=True)
print(x)

# 执行某些操作
y = x + 2
z = y * y * 3
out = z.mean()

print(out)


```

输出结果类似如下：

```
tensor([[0., 0., 0.],
        [0., 0., 0.]])
tensor([[1., 1., 1.],
        [1., 1., 1.]])
tensor([[ 1.0189, -0.5718, -1.2814],
        [-0.5865,  1.0855,  1.1727]])
tensor([[1, 2],
        [3, 4]])
tensor([[-0.3360,  0.2203,  1.3463],
        [-0.5982, -0.2704,  0.5429]])
tianqixin@Mac-mini runoob-test % python3 test.py
tensor([[-0.1908,  0.2811],
        [ 0.8068,  0.8002]], requires_grad=True)
tensor(18.1469, grad_fn=<MeanBackward0>)
```

### 反向传播（Backpropagation）

一旦定义了计算图，可以通过 **.backward()** 方法来计算梯度。

**实例**

```python
# 反向传播，计算梯度
out.backward()

# 查看 x 的梯度
print(x.grad)
```

在神经网络训练中，自动求导主要用于实现反向传播算法。

反向传播是一种通过计算损失函数关于网络参数的梯度来训练神经网络的方法。在每次迭代中，网络的前向传播会计算输出和损失，然后反向传播会计算损失关于每个参数的梯度，并使用这些梯度来更新参数。

**停止梯度计算**

如果你不希望某些张量的梯度被计算（例如，当你不需要反向传播时），可以使用 **torch.no_grad()** 或设置 **requires_grad=False**。

**实例**

```python
# 使用 torch.no_grad() 禁用梯度计算
with torch.no_grad():
  y = x * 2
```



------

### 神经网络（nn.Module）

神经网络是一种模仿人脑神经元连接的计算模型，由多层节点（神经元）组成，用于学习数据之间的复杂模式和关系。

神经网络通过调整神经元之间的连接权重来优化预测结果，这一过程涉及前向传播、损失计算、反向传播和参数更新。

神经网络的类型包括前馈神经网络、卷积神经网络（CNN）、循环神经网络（RNN）和长短期记忆网络（LSTM），它们在图像识别、语音处理、自然语言处理等多个领域都有广泛应用。

PyTorch 提供了一个非常方便的接口来构建神经网络模型，即 **torch.nn.Module**。

我们可以继承 nn.Module 类并定义自己的网络层。

创建一个简单的神经网络：

**实例**

```python
import torch.nn as nn
import torch.optim as optim

# 定义一个简单的全连接神经网络
class SimpleNN(nn.Module):
  def init(self):
    super(SimpleNN, self).__init__()
    self.fc1 = nn.Linear(2, 2) # 输入层到隐藏层
    self.fc2 = nn.Linear(2, 1) # 隐藏层到输出层

  def forward(self, x):
    x = torch.relu(self.fc1(x)) # ReLU 激活函数
    x = self.fc2(x)
    return x

# 创建网络实例
model = SimpleNN()

# 打印模型结构
print(model)

```

输出结果：

```
SimpleNN(
  (fc1): Linear(in_features=2, out_features=2, bias=True)
  (fc2): Linear(in_features=2, out_features=1, bias=True)
)
```

**训练过程：**

1. **前向传播（Forward Propagation）**： 在前向传播阶段，输入数据通过网络层传递，每层应用权重和激活函数，直到产生输出。
2. **计算损失（Calculate Loss）**： 根据网络的输出和真实标签，计算损失函数的值。
3. **反向传播（Backpropagation）**： 反向传播利用自动求导技术计算损失函数关于每个参数的梯度。
4. **参数更新（Parameter Update）**： 使用优化器根据梯度更新网络的权重和偏置。
5. **迭代（Iteration）**： 重复上述过程，直到模型在训练数据上的性能达到满意的水平。

### 前向传播与损失计算

**实例**

```python
# 随机输入
x = torch.randn(1, 2)

# 前向传播
output = model(x)
print(output)

# 定义损失函数（例如均方误差 MSE）
criterion = nn.MSELoss()

# 假设目标值为 1
target = torch.randn(1, 1)

# 计算损失
loss = criterion(output, target)
print(loss)
```



### 优化器（Optimizers）

优化器在训练过程中更新神经网络的参数，以减少损失函数的值。

PyTorch 提供了多种优化器，例如 SGD、Adam 等。

使用优化器进行参数更新：

**实例**

```python
# 定义优化器（使用 Adam 优化器）
optimizer = optim.Adam(model.parameters(), lr=0.001)

# 训练步骤
optimizer.zero_grad() # 清空梯度
loss.backward() # 反向传播
optimizer.step() # 更新参数
```



------

### 训练模型

训练模型是机器学习和深度学习中的核心过程，旨在通过大量数据学习模型参数，以便模型能够对新的、未见过的数据做出准确的预测。

训练模型通常包括以下几个步骤：

1. **数据准备**：
   - 收集和处理数据，包括清洗、标准化和归一化。
   - 将数据分为训练集、验证集和测试集。
2. **定义模型**：
   - 选择模型架构，例如决策树、神经网络等。
   - 初始化模型参数（权重和偏置）。
3. **选择损失函数**：
   - 根据任务类型（如分类、回归）选择合适的损失函数。
4. **选择优化器**：
   - 选择一个优化算法，如SGD、Adam等，来更新模型参数。
5. **前向传播**：
   - 在每次迭代中，将输入数据通过模型传递，计算预测输出。
6. **计算损失**：
   - 使用损失函数评估预测输出与真实标签之间的差异。
7. **反向传播**：
   - 利用自动求导计算损失相对于模型参数的梯度。
8. **参数更新**：
   - 根据计算出的梯度和优化器的策略更新模型参数。
9. **迭代优化**：
   - 重复步骤5-8，直到模型在验证集上的性能不再提升或达到预定的迭代次数。
10. **评估和测试**：
    - 使用测试集评估模型的最终性能，确保模型没有过拟合。
11. **模型调优**：
    - 根据模型在测试集上的表现进行调参，如改变学习率、增加正则化等。
12. **部署模型**：
    - 将训练好的模型部署到生产环境中，用于实际的预测任务。

**实例**

```py
import torch
import torch.nn as nn
import torch.optim as optim

# 1. 定义一个简单的神经网络模型
class SimpleNN(nn.Module):
  def init(self):
    super(SimpleNN, self).init()
    self.fc1 = nn.Linear(2, 2) # 输入层到隐藏层
    self.fc2 = nn.Linear(2, 1) # 隐藏层到输出层

  def forward(self, x):
    x = torch.relu(self.fc1(x)) # ReLU 激活函数
    x = self.fc2(x)
    return x

# 2. 创建模型实例
model = SimpleNN()

# 3. 定义损失函数和优化器
criterion = nn.MSELoss() # 均方误差损失函数
optimizer = optim.Adam(model.parameters(), lr=0.001) # Adam 优化器

# 4. 假设我们有训练数据 X 和 Y
X = torch.randn(10, 2) # 10 个样本，2 个特征
Y = torch.randn(10, 1) # 10 个目标值

# 5. 训练循环
for epoch in range(100):  # 训练 100 轮
  optimizer.zero_grad() # 清空之前的梯度
  output = model(X) # 前向传播
  loss = criterion(output, Y) # 计算损失
  loss.backward() # 反向传播
  optimizer.step() # 更新参数

  # 每 10 轮输出一次损失
  if (epoch+1) % 10 == 0:
    print(f'Epoch [{epoch+1}/100], Loss: {loss.item():.4f}')
```

输出结果如下：

```
Epoch [10/100], Loss: 1.7180
Epoch [20/100], Loss: 1.6352
Epoch [30/100], Loss: 1.5590
Epoch [40/100], Loss: 1.4896
Epoch [50/100], Loss: 1.4268
Epoch [60/100], Loss: 1.3704
Epoch [70/100], Loss: 1.3198
Epoch [80/100], Loss: 1.2747
Epoch [90/100], Loss: 1.2346
Epoch [100/100], Loss: 1.1991
```

在每 10 轮，程序会输出当前的损失值，帮助我们跟踪模型的训练进度。随着训练的进行，损失值应该会逐渐降低，表示模型在不断学习并优化其参数。

训练模型是一个迭代的过程，需要不断地调整和优化，直到达到满意的性能。这个过程涉及到大量的实验和调优，目的是使模型在新的、未见过的数据上也能有良好的泛化能力。

------

### 设备（Device）

PyTorch 允许你将模型和数据移动到 GPU 上进行加速。

使用 **torch.device** 来指定计算设备。

将模型和数据移至 GPU:

**实例**

```python
device = torch.device("cuda" if torch.cuda.is_available() else "cpu")

# 将模型移动到设备
model.to(device)

# 将数据移动到设备
X = X.to(device)
Y = Y.to(device)
```

在训练过程中，所有张量和模型都应该移到同一个设备上（要么都在 CPU 上，要么都在 GPU 上）。



## A.4 PyTorch 张量（Tensor）

张量是一个多维数组，可以是标量、向量、矩阵或更高维度的数据结构。

在 PyTorch 中，张量（Tensor）是数据的核心表示形式，类似于 NumPy 的多维数组，但具有更强大的功能，例如支持 GPU 加速和自动梯度计算。

张量支持多种数据类型（整型、浮点型、布尔型等）。

张量可以存储在 CPU 或 GPU 中，GPU 张量可显著加速计算。

下图展示了不同维度的张量（Tensor）在 PyTorch 中的表示方法：

![img](https://raw.githubusercontent.com/GMyhf/img/main/img/1__D5ZvufDS38WkhK9rK32hQ.jpg)

**说明：**

- **1D Tensor / Vector（一维张量/向量）:** 最基本的张量形式，可以看作是一个数组，图中的例子是一个包含 10 个元素的向量。
- **2D Tensor / Matrix（二维张量/矩阵）:** 二维数组，通常用于表示矩阵，图中的例子是一个 4x5 的矩阵，包含了 20 个元素。
- **3D Tensor / Cube（三维张量/立方体）:** 三维数组，可以看作是由多个矩阵堆叠而成的立方体，图中的例子展示了一个 3x4x5 的立方体，其中每个 5x5 的矩阵代表立方体的一个"层"。
- **4D Tensor / Vector of Cubes（四维张量/立方体向量）:** 四维数组，可以看作是由多个立方体组成的向量，图中的例子没有具体数值，但可以理解为一个包含多个 3D 张量的集合。
- **5D Tensor / Matrix of Cubes（五维张量/立方体矩阵）:** 五维数组，可以看作是由多个4D张量组成的矩阵，图中的例子同样没有具体数值，但可以理解为一个包含多个 4D 张量的集合。

------

**创建张量**

张量创建的方式有：

| **方法**                            | **说明**                                               | **示例代码**                                |
| :---------------------------------- | :----------------------------------------------------- | :------------------------------------------ |
| `torch.tensor(data)`                | 从 Python 列表或 NumPy 数组创建张量。                  | `x = torch.tensor([[1, 2], [3, 4]])`        |
| `torch.zeros(size)`                 | 创建一个全为零的张量。                                 | `x = torch.zeros((2, 3))`                   |
| `torch.ones(size)`                  | 创建一个全为 1 的张量。                                | `x = torch.ones((2, 3))`                    |
| `torch.empty(size)`                 | 创建一个未初始化的张量。                               | `x = torch.empty((2, 3))`                   |
| `torch.rand(size)`                  | 创建一个服从均匀分布的随机张量，值在 `[0, 1)`。        | `x = torch.rand((2, 3))`                    |
| `torch.randn(size)`                 | 创建一个服从正态分布的随机张量，均值为 0，标准差为 1。 | `x = torch.randn((2, 3))`                   |
| `torch.arange(start, end, step)`    | 创建一个一维序列张量，类似于 Python 的 `range`。       | `x = torch.arange(0, 10, 2)`                |
| `torch.linspace(start, end, steps)` | 创建一个在指定范围内等间隔的序列张量。                 | `x = torch.linspace(0, 1, 5)`               |
| `torch.eye(size)`                   | 创建一个单位矩阵（对角线为 1，其他为 0）。             | `x = torch.eye(3)`                          |
| `torch.from_numpy(ndarray)`         | 将 NumPy 数组转换为张量。                              | `x = torch.from_numpy(np.array([1, 2, 3]))` |

使用 **torch.tensor()** 函数，你可以将一个列表或数组转换为张量：

**实例**

```python
import torch

tensor = torch.tensor([1, 2, 3])
print(tensor)
```

输出如下：

```
tensor([1, 2, 3])
```

如果你有一个 NumPy 数组，可以使用 torch.from_numpy() 将其转换为张量：

实例

```python
import numpy as np

np_array = np.array([1, 2, 3])
tensor = torch.from_numpy(np_array)
print(tensor)
```

输出如下：

```
tensor([1, 2, 3])
```

创建 2D 张量（矩阵）：

**实例**

```python
import torch

tensor_2d = torch.tensor([
  [-9, 4, 2, 5, 7],
  [3, 0, 12, 8, 6],
  [1, 23, -6, 45, 2],
  [22, 3, -1, 72, 6]
])
print("2D Tensor (Matrix):\n", tensor_2d)
print("Shape:", tensor_2d.shape) # 形状
```

输出如下：

```
2D Tensor (Matrix):
 tensor([[-9,  4,  2,  5,  7],
        [ 3,  0, 12,  8,  6],
        [ 1, 23, -6, 45,  2],
        [22,  3, -1, 72,  6]])
Shape: torch.Size([4, 5])
```

其他维度的创建：

```python
# 创建 3D 张量（立方体）
tensor_3d = torch.stack([tensor_2d, tensor_2d + 10, tensor_2d - 5])  # 堆叠 3 个 2D 张量
print("3D Tensor (Cube):\n", tensor_3d)
print("Shape:", tensor_3d.shape)  # 形状

# 创建 4D 张量（向量的立方体）
tensor_4d = torch.stack([tensor_3d, tensor_3d + 100])  # 堆叠 2 个 3D 张量
print("4D Tensor (Vector of Cubes):\n", tensor_4d)
print("Shape:", tensor_4d.shape)  # 形状

# 创建 5D 张量（矩阵的立方体）
tensor_5d = torch.stack([tensor_4d, tensor_4d + 1000])  # 堆叠 2 个 4D 张量
print("5D Tensor (Matrix of Cubes):\n", tensor_5d)
print("Shape:", tensor_5d.shape)  # 形状
```

------

**张量的属性**

张量的属性如下表：

| **属性**           | **说明**                         | **示例**                 |
| :----------------- | :------------------------------- | :----------------------- |
| `.shape`           | 获取张量的形状                   | `tensor.shape`           |
| `.size()`          | 获取张量的形状                   | `tensor.size()`          |
| `.dtype`           | 获取张量的数据类型               | `tensor.dtype`           |
| `.device`          | 查看张量所在的设备 (CPU/GPU)     | `tensor.device`          |
| `.dim()`           | 获取张量的维度数                 | `tensor.dim()`           |
| `.requires_grad`   | 是否启用梯度计算                 | `tensor.requires_grad`   |
| `.numel()`         | 获取张量中的元素总数             | `tensor.numel()`         |
| `.is_cuda`         | 检查张量是否在 GPU 上            | `tensor.is_cuda`         |
| `.T`               | 获取张量的转置（适用于 2D 张量） | `tensor.T`               |
| `.item()`          | 获取单元素张量的值               | `tensor.item()`          |
| `.is_contiguous()` | 检查张量是否连续存储             | `tensor.is_contiguous()` |

**实例**

```python
import torch

# 创建一个 2D 张量
tensor = torch.tensor([[1, 2, 3], [4, 5, 6]], dtype=torch.float32)

# 张量的属性
print("Tensor:\n", tensor)
print("Shape:", tensor.shape) # 获取形状
print("Size:", tensor.size()) # 获取形状（另一种方法）
print("Data Type:", tensor.dtype) # 数据类型
print("Device:", tensor.device) # 设备
print("Dimensions:", tensor.dim()) # 维度数
print("Total Elements:", tensor.numel()) # 元素总数
print("Requires Grad:", tensor.requires_grad) # 是否启用梯度
print("Is CUDA:", tensor.is_cuda) # 是否在 GPU 上
print("Is Contiguous:", tensor.is_contiguous()) # 是否连续存储

\# 获取单元素值
single_value = torch.tensor(42)
print("Single Element Value:", single_value.item())

\# 转置张量
tensor_T = tensor.T
print("Transposed Tensor:\n", tensor_T)
```

输出结果：

```
Tensor:
 tensor([[1., 2., 3.],
         [4., 5., 6.]])
Shape: torch.Size([2, 3])
Size: torch.Size([2, 3])
Data Type: torch.float32
Device: cpu
Dimensions: 2
Total Elements: 6
Requires Grad: False
Is CUDA: False
Is Contiguous: True
Single Element Value: 42
Transposed Tensor:
 tensor([[1., 4.],
         [2., 5.],
         [3., 6.]])
```

------

**张量的操作**

张量操作方法说明如下。

**基础操作：**

| **操作**                | **说明**                       | **示例代码**                  |
| :---------------------- | :----------------------------- | :---------------------------- |
| `+`, `-`, `*`, `/`      | 元素级加法、减法、乘法、除法。 | `z = x + y`                   |
| `torch.matmul(x, y)`    | 矩阵乘法。                     | `z = torch.matmul(x, y)`      |
| `torch.dot(x, y)`       | 向量点积（仅适用于 1D 张量）。 | `z = torch.dot(x, y)`         |
| `torch.sum(x)`          | 求和。                         | `z = torch.sum(x)`            |
| `torch.mean(x)`         | 求均值。                       | `z = torch.mean(x)`           |
| `torch.max(x)`          | 求最大值。                     | `z = torch.max(x)`            |
| `torch.min(x)`          | 求最小值。                     | `z = torch.min(x)`            |
| `torch.argmax(x, dim)`  | 返回最大值的索引（指定维度）。 | `z = torch.argmax(x, dim=1)`  |
| `torch.softmax(x, dim)` | 计算 softmax（指定维度）。     | `z = torch.softmax(x, dim=1)` |

形状操作

| **操作**                 | **说明**                       | **示例代码**                   |
| :----------------------- | :----------------------------- | :----------------------------- |
| `x.view(shape)`          | 改变张量的形状（不改变数据）。 | `z = x.view(3, 4)`             |
| `x.reshape(shape)`       | 类似于 `view`，但更灵活。      | `z = x.reshape(3, 4)`          |
| `x.t()`                  | 转置矩阵。                     | `z = x.t()`                    |
| `x.unsqueeze(dim)`       | 在指定维度添加一个维度。       | `z = x.unsqueeze(0)`           |
| `x.squeeze(dim)`         | 去掉指定维度为 1 的维度。      | `z = x.squeeze(0)`             |
| `torch.cat((x, y), dim)` | 按指定维度连接多个张量。       | `z = torch.cat((x, y), dim=1)` |

**实例**

```python
import torch

# 创建一个 2D 张量
tensor = torch.tensor([[1, 2, 3], [4, 5, 6]], dtype=torch.float32)
print("原始张量:\n", tensor)

# 1. 索引和切片操作
print("\n【索引和切片】")
print("获取第一行:", tensor[0]) # 获取第一行
print("获取第一行第一列的元素:", tensor[0, 0]) # 获取特定元素
print("获取第二列的所有元素:", tensor[:, 1]) # 获取第二列所有元素

# 2. 形状变换操作
print("\n【形状变换】")
reshaped = tensor.view(3, 2) # 改变张量形状为 3x2
print("改变形状后的张量:\n", reshaped)
flattened = tensor.flatten() # 将张量展平成一维
print("展平后的张量:\n", flattened)

# 3. 数学运算操作
print("\n【数学运算】")
tensor_add = tensor + 10 # 张量加法
print("张量加 10:\n", tensor_add)
tensor_mul = tensor * 2 # 张量乘法
print("张量乘 2:\n", tensor_mul)
tensor_sum = tensor.sum() # 计算所有元素的和
print("张量元素的和:", tensor_sum.item())

# 4. 与其他张量的操作
print("\n【与其他张量操作】")
tensor2 = torch.tensor([[1, 1, 1], [1, 1, 1]], dtype=torch.float32)
print("另一个张量:\n", tensor2)
tensor_dot = torch.matmul(tensor, tensor2.T) # 张量矩阵乘法
print("矩阵乘法结果:\n", tensor_dot)

# 5. 条件判断和筛选
print("\n【条件判断和筛选】")
mask = tensor > 3 # 创建一个布尔掩码
print("大于 3 的元素的布尔掩码:\n", mask)
filtered_tensor = tensor[tensor > 3] # 筛选出符合条件的元素
print("大于 3 的元素:\n", filtered_tensor)
```

输出结果：

```
原始张量:
 tensor([[1., 2., 3.],
         [4., 5., 6.]])

【索引和切片】
获取第一行: tensor([1., 2., 3.])
获取第一行第一列的元素: tensor(1.)
获取第二列的所有元素: tensor([2., 5.])

【形状变换】
改变形状后的张量:
 tensor([[1., 2.],
         [3., 4.],
         [5., 6.]])
展平后的张量:
 tensor([1., 2., 3., 4., 5., 6.])

【数学运算】
张量加 10:
 tensor([[11., 12., 13.],
         [14., 15., 16.]])
张量乘 2:
 tensor([[ 2.,  4.,  6.],
         [ 8., 10., 12.]])
张量元素的和: 21.0

【与其他张量操作】
另一个张量:
 tensor([[1., 1., 1.],
         [1., 1., 1.]])
矩阵乘法结果:
 tensor([[ 6.,  6.],
         [15., 15.]])

【条件判断和筛选】
大于 3 的元素的布尔掩码:
 tensor([[False, False, False],
         [ True,  True,  True]])
大于 3 的元素:
 tensor([4., 5., 6.])
```

------

**张量的 GPU 加速**

将张量转移到 GPU：

```python
device = torch.device('cuda' if torch.cuda.is_available() else 'cpu')
x = torch.tensor([1.0, 2.0, 3.0], device=device)
```

检查 GPU 是否可用：

```python
torch.cuda.is_available()  # 返回 True 或 False
```

------

**张量与 NumPy 的互操作**

张量与 NumPy 的互操作如下表所示：

| **操作**                    | **说明**                                   | **示例代码**                     |
| :-------------------------- | :----------------------------------------- | :------------------------------- |
| `torch.from_numpy(ndarray)` | 将 NumPy 数组转换为张量。                  | `x = torch.from_numpy(np_array)` |
| `x.numpy()`                 | 将张量转换为 NumPy 数组（仅限 CPU 张量）。 | `np_array = x.numpy()`           |

**实例**

```python
import torch
import numpy as np

# 1. NumPy 数组转换为 PyTorch 张量
print("1. NumPy 转为 PyTorch 张量")
numpy_array = np.array([[1, 2, 3], [4, 5, 6]])
print("NumPy 数组:\n", numpy_array)

# 使用 torch.from_numpy() 将 NumPy 数组转换为张量
tensor_from_numpy = torch.from_numpy(numpy_array)
print("转换后的 PyTorch 张量:\n", tensor_from_numpy)

# 修改 NumPy 数组，观察张量的变化（共享内存）
numpy_array[0, 0] = 100
print("修改后的 NumPy 数组:\n", numpy_array)
print("PyTorch 张量也会同步变化:\n", tensor_from_numpy)

# 2. PyTorch 张量转换为 NumPy 数组
print("\n2. PyTorch 张量转为 NumPy 数组")
tensor = torch.tensor([[7, 8, 9], [10, 11, 12]], dtype=torch.float32)
print("PyTorch 张量:\n", tensor)

# 使用 tensor.numpy() 将张量转换为 NumPy 数组
numpy_from_tensor = tensor.numpy()
print("转换后的 NumPy 数组:\n", numpy_from_tensor)

# 修改张量，观察 NumPy 数组的变化（共享内存）
tensor[0, 0] = 77
print("修改后的 PyTorch 张量:\n", tensor)
print("NumPy 数组也会同步变化:\n", numpy_from_tensor)

# 3. 注意：不共享内存的情况（需要复制数据）
print("\n3. 使用 clone() 保证独立数据")
tensor_independent = torch.tensor([[13, 14, 15], [16, 17, 18]], dtype=torch.float32)
numpy_independent = tensor_independent.clone().numpy() # 使用 clone 复制数据
print("原始张量:\n", tensor_independent)
tensor_independent[0, 0] = 0 # 修改张量数据
print("修改后的张量:\n", tensor_independent)
print("NumPy 数组（不会同步变化）:\n", numpy_independent)
```

输出结果：

```
1. NumPy 转为 PyTorch 张量
NumPy 数组:
 [[1 2 3]
 [4 5 6]]
转换后的 PyTorch 张量:
 tensor([[1, 2, 3],
         [4, 5, 6]])

修改后的 NumPy 数组:
 [[100   2   3]
 [  4   5   6]]
PyTorch 张量也会同步变化:
 tensor([[100,   2,   3],
         [  4,   5,   6]])

2. PyTorch 张量转为 NumPy 数组
PyTorch 张量:
 tensor([[ 7.,  8.,  9.],
         [10., 11., 12.]])
转换后的 NumPy 数组:
 [[ 7.  8.  9.]
 [10. 11. 12.]]

修改后的 PyTorch 张量:
 tensor([[77.,  8.,  9.],
         [10., 11., 12.]])
NumPy 数组也会同步变化:
 [[77.  8.  9.]
 [10. 11. 12.]]

3. 使用 clone() 保证独立数据
原始张量:
 tensor([[13., 14., 15.],
         [16., 17., 18.]])
修改后的张量:
 tensor([[ 0., 14., 15.],
         [16., 17., 18.]])
NumPy 数组（不会同步变化）:
 [[13. 14. 15.]
 [16. 17. 18.]]
```



## A.5 PyTorch 神经网络基础

神经网络是一种模仿人脑处理信息方式的计算模型，它由许多相互连接的节点（神经元）组成，这些节点按层次排列。

神经网络的强大之处在于其能够自动从大量数据中学习复杂的模式和特征，无需人工设计特征提取器。

随着深度学习的发展，神经网络已经成为解决许多复杂问题的关键技术。

**神经元（Neuron）**

神经元是神经网络的基本单元，它接收输入信号，通过加权求和后与偏置（bias）相加，然后通过激活函数处理以产生输出。

神经元的权重和偏置是网络学习过程中需要调整的参数。

**输入和输出:**

- **输入（Input）**：输入是网络的起始点，可以是特征数据，如图像的像素值或文本的词向量。
- **输出（Output）**：输出是网络的终点，表示模型的预测结果，如分类任务中的类别标签。

神经元接收多个输入（例如x1, x2, ..., xn），如果输入的加权和大于激活阈值（activation potential），则产生二进制输出。

![img](https://raw.githubusercontent.com/GMyhf/img/main/img/1_upfpVueoUuKPkyX3PR3KBg.png)

神经元的输出可以看作是输入的加权和加上偏置（bias），神经元的数学表示：

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/f0b929045ae6eef23514bd7024be62f0.png" alt="img" style="zoom:50%;" />

这里，**wj** 是权重，**xj** 是输入，而 **Bias** 是偏置项。

**层（Layer）**

输入层和输出层之间的层被称为隐藏层，层与层之间的连接密度和类型构成了网络的配置。

神经网络由多个层组成，包括：

- **输入层（Input Layer）**：接收原始输入数据。
- **隐藏层（Hidden Layer）**：对输入数据进行处理，可以有多个隐藏层。
- **输出层（Output Layer）**：产生最终的输出结果。

典型的神经网络架构:

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/1_3fA77_mLNiJTSgZFhYnU0Q3K5DV4.webp" alt="img" style="zoom: 50%;" />



**前馈神经网络（Feedforward Neural Network，FNN）**

前馈神经网络（Feedforward Neural Network，FNN）是神经网络家族中的基本单元。

前馈神经网络特点是数据从输入层开始，经过一个或多个隐藏层，最后到达输出层，全过程没有循环或反馈。

![img](https://raw.githubusercontent.com/GMyhf/img/main/img/neural-net.png)

**前馈神经网络的基本结构：**

- **输入层：** 数据进入网络的入口点。输入层的每个节点代表一个输入特征。
- **隐藏层：**一个或多个层，用于捕获数据的非线性特征。每个隐藏层由多个神经元组成，每个神经元通过激活函数增加非线性能力。
- **输出层：**输出网络的预测结果。节点数和问题类型相关，例如分类问题的输出节点数等于类别数。
- **连接权重与偏置：**每个神经元的输入通过权重进行加权求和，并加上偏置值，然后通过激活函数传递。



**循环神经网络（Recurrent Neural Network, RNN）**

循环神经网络（Recurrent Neural Network, RNN）络是一类专门处理序列数据的神经网络，能够捕获输入数据中时间或顺序信息的依赖关系。

RNN 的特别之处在于它具有"记忆能力"，可以在网络的隐藏状态中保存之前时间步的信息。

循环神经网络用于处理随时间变化的数据模式。

在 RNN 中，相同的层被用来接收输入参数，并在指定的神经网络中显示输出参数。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/0_xs3Dya3qQBx6IU7C.png" alt="img" style="zoom:67%;" />

PyTorch 提供了强大的工具来构建和训练神经网络。

神经网络在 PyTorch 中是通过 **torch.nn** 模块来实现的。

**torch.nn** 模块提供了各种网络层（如全连接层、卷积层等）、损失函数和优化器，让神经网络的构建和训练变得更加方便。

![img](https://raw.githubusercontent.com/GMyhf/img/main/img/1_3DUs-90altOgaBcVJ9LTGg.png)

在 PyTorch 中，构建神经网络通常需要继承 nn.Module 类。

nn.Module 是所有神经网络模块的基类，你需要定义以下两个部分：

- **`__init__()`**：定义网络层。
- **`forward()`**：定义数据的前向传播过程。

简单的全连接神经网络（Fully Connected Network）：

**实例**

```python
import torch
import torch.nn as nn

# 定义一个简单的神经网络模型
class SimpleNN(nn.Module):
  def init(self):
    super(SimpleNN, self).init()
    # 定义一个输入层到隐藏层的全连接层
    self.fc1 = nn.Linear(2, 2) # 输入 2 个特征，输出 2 个特征
    # 定义一个隐藏层到输出层的全连接层
    self.fc2 = nn.Linear(2, 1) # 输入 2 个特征，输出 1 个预测值

  def forward(self, x):
    # 前向传播过程
    x = torch.relu(self.fc1(x)) # 使用 ReLU 激活函数
    x = self.fc2(x) # 输出层
    return x

# 创建模型实例
model = SimpleNN()

# 打印模型
print(model)
```

输出结果如下：

```
SimpleNN(
  (fc1): Linear(in_features=2, out_features=2, bias=True)
  (fc2): Linear(in_features=2, out_features=1, bias=True)
)
```

PyTorch 提供了许多<mark>常见的神经网络层</mark>，以下是几个常见的：

- **`nn.Linear(in_features, out_features)`**：全连接层，输入 `in_features` 个特征，输出 `out_features` 个特征。
- **`nn.Conv2d(in_channels, out_channels, kernel_size)`**：2D 卷积层，用于图像处理。
- **`nn.MaxPool2d(kernel_size)`**：2D 最大池化层，用于降维。
- **`nn.ReLU()`**：ReLU 激活函数，常用于隐藏层。
- **`nn.Softmax(dim)`**：Softmax 激活函数，通常用于输出层，适用于多类分类问题。



**激活函数（Activation Function）**

激活函数决定了神经元是否应该被激活。它们是非线性函数，使得神经网络能够学习和执行更复杂的任务。常见的激活函数包括：

- Sigmoid：用于二分类问题，输出值在 0 和 1 之间。
- Tanh：输出值在 -1 和 1 之间，常用于输出层之前。
- ReLU（Rectified Linear Unit）：目前最流行的激活函数之一，定义为 `f(x) = max(0, x)`，有助于解决梯度消失问题。
- Softmax：常用于多分类问题的输出层，将输出转换为概率分布。

**实例**

```python
import torch.nn.functional as F

# ReLU 激活
output = F.relu(input_tensor)

# Sigmoid 激活
output = torch.sigmoid(input_tensor)

# Tanh 激活
output = torch.tanh(input_tensor)
```



**损失函数（Loss Function）**

损失函数用于衡量模型的预测值与真实值之间的差异。

常见的损失函数包括：

- **均方误差（MSELoss）**：回归问题常用，计算输出与目标值的平方差。
- **交叉熵损失（CrossEntropyLoss）**：分类问题常用，计算输出和真实标签之间的交叉熵。
- **BCEWithLogitsLoss**：二分类问题，结合了 Sigmoid 激活和二元交叉熵损失。

**实例**

```python
# 均方误差损失
criterion = nn.MSELoss()

# 交叉熵损失
criterion = nn.CrossEntropyLoss()

# 二分类交叉熵损失
criterion = nn.BCEWithLogitsLoss()
```



**优化器（Optimizer）**

<mark>优化器负责在训练过程中更新网络的权重和偏置</mark>。

常见的优化器包括：

- SGD（随机梯度下降）
- Adam（自适应矩估计）
- RMSprop（均方根传播）

**实例**

```python
import torch.optim as optim

# 使用 SGD 优化器
optimizer = optim.SGD(model.parameters(), lr=0.01)

# 使用 Adam 优化器
optimizer = optim.Adam(model.parameters(), lr=0.001)
```



**训练过程（Training Process）**

训练神经网络涉及以下步骤：

1. **准备数据**：通过 `DataLoader` 加载数据。
2. **定义损失函数和优化器**。
3. **前向传播**：计算模型的输出。
4. **计算损失**：与目标进行比较，得到损失值。
5. **反向传播**：通过 `loss.backward()` 计算梯度。
6. **更新参数**：通过 `optimizer.step()` 更新模型的参数。
7. **重复上述步骤**，直到达到预定的训练轮数。

**实例**

```python
\# 假设已经定义好了模型、损失函数和优化器

\# 训练数据示例
X = torch.randn(10, 2) # 10 个样本，每个样本有 2 个特征
Y = torch.randn(10, 1) # 10 个目标标签

\# 训练过程
for epoch in range(100):  # 训练 100 轮
  model.train() # 设置模型为训练模式
  optimizer.zero_grad() # 清除梯度
  output = model(X) # 前向传播
  loss = criterion(output, Y) # 计算损失
  loss.backward() # 反向传播
  optimizer.step() # 更新权重
  
  if (epoch + 1) % 10 == 0:  # 每 10 轮输出一次损失
    print(f'Epoch [{epoch + 1}/100], Loss: {loss.item():.4f}')
```



**测试与评估**

训练完成后，需要对模型进行测试和评估。

常见的步骤包括：

- **计算测试集的损失**：测试模型在未见过的数据上的表现。
- **计算准确率（Accuracy）**：对于分类问题，计算正确预测的比例。

**实例**

```python
# 假设你有测试集 X_test 和 Y_test
model.eval() # 设置模型为评估模式
with torch.no_grad():  # 在评估过程中禁用梯度计算
  output = model(X_test)
  loss = criterion(output, Y_test)
  print(f'Test Loss: {loss.item():.4f}')
```



**神经网络类型**

1. **前馈神经网络（Feedforward Neural Networks）**：数据单向流动，从输入层到输出层，无反馈连接。
2. **卷积神经网络（Convolutional Neural Networks, CNNs）**：适用于图像处理，使用卷积层提取空间特征。
3. **循环神经网络（Recurrent Neural Networks, RNNs）**：适用于序列数据，如时间序列分析和自然语言处理，允许信息反馈循环。
4. **长短期记忆网络（Long Short-Term Memory, LSTM）**：一种特殊的RNN，能够学习长期依赖关系。



## A.6 PyTorch 第一个神经网络

本章节我们将介绍如何用 PyTorch 实现一个简单的前馈神经网络，完成一个二分类任务。

以下实例展示了如何使用 PyTorch 实现一个简单的神经网络进行二分类任务训练。

网络结构包括输入层、隐藏层和输出层，使用了 ReLU 激活函数和 Sigmoid 激活函数。

采用了均方误差损失函数和随机梯度下降优化器。

训练过程是通过前向传播、计算损失、反向传播和参数更新来逐步调整模型参数。

**实例**

```python
# 导入PyTorch库
import torch
import torch.nn as nn

# 定义输入层大小、隐藏层大小、输出层大小和批量大小
n_in, n_h, n_out, batch_size = 10, 5, 1, 10

# 创建虚拟输入数据和目标数据
x = torch.randn(batch_size, n_in) # 随机生成输入数据
y = torch.tensor([[1.0], [0.0], [0.0],
         [1.0], [1.0], [1.0], [0.0], [0.0], [1.0], [1.0]]) # 目标输出数据

# 创建顺序模型，包含线性层、ReLU激活函数和Sigmoid激活函数
model = nn.Sequential(
  nn.Linear(n_in, n_h), # 输入层到隐藏层的线性变换
  nn.ReLU(),       # 隐藏层的ReLU激活函数
  nn.Linear(n_h, n_out), # 隐藏层到输出层的线性变换
  nn.Sigmoid()      # 输出层的Sigmoid激活函数
)

# 定义均方误差损失函数和随机梯度下降优化器
criterion = torch.nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.01) # 学习率为0.01

# 执行梯度下降算法进行模型训练
for epoch in range(50):  # 迭代50次
  y_pred = model(x) # 前向传播，计算预测值
  loss = criterion(y_pred, y) # 计算损失
  print('epoch: ', epoch, 'loss: ', loss.item()) # 打印损失值

  optimizer.zero_grad() # 清零梯度
  loss.backward() # 反向传播，计算梯度
  optimizer.step() # 更新模型参数
```

输出结果类似如下：

```
epoch:  0 loss:  0.2302265167236328
epoch:  1 loss:  0.23012931644916534
epoch:  2 loss:  0.23003216087818146
epoch:  3 loss:  0.22993502020835876
epoch:  4 loss:  0.22983793914318085
...
```

定义网络参数：

```
n_in, n_h, n_out, batch_size = 10, 5, 1, 10
```

- `n_in`：输入层大小为 10，即每个数据点有 10 个特征。
- `n_h`：隐藏层大小为 5，即隐藏层包含 5 个神经元。
- `n_out`：输出层大小为 1，即输出一个标量，表示二分类结果（0 或 1）。
- `batch_size`：每个批次包含 10 个样本。

生成输入数据和目标数据：

```python
x = torch.randn(batch_size, n_in)  # 随机生成输入数据
y = torch.tensor([[1.0], [0.0], [0.0], 
                 [1.0], [1.0], [1.0], [0.0], [0.0], [1.0], [1.0]])  # 目标输出数据
```

- `x`：随机生成一个形状为 `(10, 10)` 的输入数据矩阵，表示 10 个样本，每个样本有 10 个特征。
- `y`：目标输出数据（标签），表示每个输入样本的类别标签（0 或 1），是一个 10×1 的张量。

定义神经网络模型：

```python
model = nn.Sequential(
   nn.Linear(n_in, n_h),  # 输入层到隐藏层的线性变换
   nn.ReLU(),            # 隐藏层的ReLU激活函数
   nn.Linear(n_h, n_out),  # 隐藏层到输出层的线性变换
   nn.Sigmoid()           # 输出层的Sigmoid激活函数
)
```

`nn.Sequential` 用于按顺序定义网络层。

- `nn.Linear(n_in, n_h)`：定义输入层到隐藏层的线性变换，输入特征是 10 个，隐藏层有 5 个神经元。
- `nn.ReLU()`：在隐藏层后添加 ReLU 激活函数，增加非线性。
- `nn.Linear(n_h, n_out)`：定义隐藏层到输出层的线性变换，输出为 1 个神经元。
- `nn.Sigmoid()`：输出层使用 Sigmoid 激活函数，将结果映射到 0 到 1 之间，用于二分类任务。

定义损失函数和优化器：

```python
criterion = torch.nn.MSELoss()  # 使用均方误差损失函数
optimizer = torch.optim.SGD(model.parameters(), lr=0.01)  # 使用随机梯度下降优化器，学习率为 0.01
```

训练循环：

```python
for epoch in range(50):  # 训练50轮
   y_pred = model(x)  # 前向传播，计算预测值
   loss = criterion(y_pred, y)  # 计算损失
   print('epoch: ', epoch, 'loss: ', loss.item())  # 打印损失值

   optimizer.zero_grad()  # 清零梯度
   loss.backward()  # 反向传播，计算梯度
   optimizer.step()  # 更新模型参数
```

- `for epoch in range(50)`：进行 50 次训练迭代。
- `y_pred = model(x)`：进行前向传播，使用当前模型参数计算输入数据 `x` 的预测值。
- `loss = criterion(y_pred, y)`：计算预测值和目标值 `y` 之间的损失。
- `optimizer.zero_grad()`：清除上一轮训练时的梯度值。
- `loss.backward()`：反向传播，计算损失函数相对于模型参数的梯度。
- `optimizer.step()`：根据计算出的梯度更新模型参数。

可视化代码：

**实例**

```python
import torch
import torch.nn as nn
import matplotlib.pyplot as plt

# 定义输入层大小、隐藏层大小、输出层大小和批量大小
n_in, n_h, n_out, batch_size = 10, 5, 1, 10

# 创建虚拟输入数据和目标数据
x = torch.randn(batch_size, n_in) # 随机生成输入数据
y = torch.tensor([[1.0], [0.0], [0.0],
         [1.0], [1.0], [1.0], [0.0], [0.0], [1.0], [1.0]]) # 目标输出数据

# 创建顺序模型，包含线性层、ReLU激活函数和Sigmoid激活函数
model = nn.Sequential(
  nn.Linear(n_in, n_h), # 输入层到隐藏层的线性变换
  nn.ReLU(),       # 隐藏层的ReLU激活函数
  nn.Linear(n_h, n_out), # 隐藏层到输出层的线性变换
  nn.Sigmoid()      # 输出层的Sigmoid激活函数
)

# 定义均方误差损失函数和随机梯度下降优化器
criterion = torch.nn.MSELoss()
optimizer = torch.optim.SGD(model.parameters(), lr=0.01) # 学习率为0.01

# 用于存储每轮的损失值
losses = []

# 执行梯度下降算法进行模型训练
for epoch in range(50):  # 迭代50次
  y_pred = model(x) # 前向传播，计算预测值
  loss = criterion(y_pred, y) # 计算损失
  losses.append(loss.item()) # 记录损失值
  print(f'Epoch [{epoch+1}/50], Loss: {loss.item():.4f}') # 打印损失值

  optimizer.zero_grad() # 清零梯度
  loss.backward() # 反向传播，计算梯度
  optimizer.step() # 更新模型参数

# 可视化损失变化曲线
plt.figure(figsize=(8, 5))
plt.plot(range(1, 51), losses, label='Loss')
plt.xlabel('Epoch')
plt.ylabel('Loss')
plt.title('Training Loss Over Epochs')
plt.legend()
plt.grid()
plt.show()

# 可视化预测结果与实际目标值对比
y_pred_final = model(x).detach().numpy() # 最终预测值
y_actual = y.numpy() # 实际值

plt.figure(figsize=(8, 5))
plt.plot(range(1, batch_size + 1), y_actual, 'o-', label='Actual', color='blue')
plt.plot(range(1, batch_size + 1), y_pred_final, 'x--', label='Predicted', color='red')
plt.xlabel('Sample Index')
plt.ylabel('Value')
plt.title('Actual vs Predicted Values')
plt.legend()
plt.grid()
plt.show()
```

显示如下所示：

![img](https://raw.githubusercontent.com/GMyhf/img/main/img/first_n_runoob_1.png)



![a6fa1566dbdce1daa784f116d603c117](https://raw.githubusercontent.com/GMyhf/img/main/img/a6fa1566dbdce1daa784f116d603c117.png)



**另外一个实例**

我们假设有一个二维数据集，目标是根据点的位置将它们分类到两个类别中（例如，红色和蓝色点）。

以下实例展示了如何使用神经网络完成简单的二分类任务，为更复杂的任务奠定了基础，通过 PyTorch 的模块化接口，神经网络的构建、训练和可视化都非常直观。

**1、数据准备**

首先，我们生成一些简单的二维数据：

**实例**

```python
import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt

# 生成一些随机数据
n_samples = 100
data = torch.randn(n_samples, 2) # 生成 100 个二维数据点
labels = (data[:, 0]**2 + data[:, 1]**2 < 1).float().unsqueeze(1) # 点在圆内为1，圆外为0

# 可视化数据
plt.scatter(data[:, 0], data[:, 1], c=labels.squeeze(), cmap='coolwarm')
plt.title("Generated Data")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.show()
```

**数据说明：**

- `data` 是输入的二维点，每个点有两个特征。
- `labels` 是目标分类，点在圆形区域内为 1，否则为 0。

显示如下：

![cfe5820ca03600fe0c1c18945556a892](https://raw.githubusercontent.com/GMyhf/img/main/img/cfe5820ca03600fe0c1c18945556a892.png)



**2、定义神经网络**

用 PyTorch 创建一个简单的前馈神经网络。

前馈神经网络使用了一层隐藏层，通过简单的线性变换和激活函数捕获数据的非线性模式。

**实例**

```python
class SimpleNN(nn.Module):
  def __init__(self):
    super(SimpleNN, self).__init__()
    # 定义神经网络的层
    self.fc1 = nn.Linear(2, 4) # 输入层有 2 个特征，隐藏层有 4 个神经元
    self.fc2 = nn.Linear(4, 1) # 隐藏层输出到 1 个神经元（用于二分类）
    self.sigmoid = nn.Sigmoid() # 二分类激活函数

  def forward(self, x):
    x = torch.relu(self.fc1(x)) # 使用 ReLU 激活函数
    x = self.sigmoid(self.fc2(x)) # 输出层使用 Sigmoid 激活函数
    return x

# 实例化模型
model = SimpleNN()
```



**3、定义损失函数和优化器**

**实例**

```python
# 定义二分类的损失函数和优化器
criterion = nn.BCELoss() # 二元交叉熵损失
optimizer = optim.SGD(model.parameters(), lr=0.1) # 使用随机梯度下降优化器
```



**4、训练模型**

用数据训练模型，让它学会分类。

**实例**

```python
# 训练
epochs = 100
for epoch in range(epochs):
  # 前向传播
  outputs = model(data)
  loss = criterion(outputs, labels)

  # 反向传播
  optimizer.zero_grad()
  loss.backward()
  optimizer.step()

  # 每 10 轮打印一次损失
  if (epoch + 1) % 10 == 0:
    print(f'Epoch [{epoch + 1}/{epochs}], Loss: {loss.item():.4f}')
```



**5、测试模型并可视化结果**

我们测试模型，并在图像上绘制决策边界。

**实例**

```python
# 可视化决策边界
def plot_decision_boundary(model, data):
  x_min, x_max = data[:, 0].min() - 1, data[:, 0].max() + 1
  y_min, y_max = data[:, 1].min() - 1, data[:, 1].max() + 1
  xx, yy = torch.meshgrid(torch.arange(x_min, x_max, 0.1), torch.arange(y_min, y_max, 0.1), indexing='ij')
  grid = torch.cat([xx.reshape(-1, 1), yy.reshape(-1, 1)], dim=1)
  predictions = model(grid).detach().numpy().reshape(xx.shape)
  plt.contourf(xx, yy, predictions, levels=[0, 0.5, 1], cmap='coolwarm', alpha=0.7)
  plt.scatter(data[:, 0], data[:, 1], c=labels.squeeze(), cmap='coolwarm', edgecolors='k')
  plt.title("Decision Boundary")
  plt.show()

plot_decision_boundary(model, data)
```



**6、完整代码**

完整代码如下：

实例

```python
import torch
import torch.nn as nn
import torch.optim as optim
import matplotlib.pyplot as plt

# 生成一些随机数据
n_samples = 100
data = torch.randn(n_samples, 2)  # 生成 100 个二维数据点
labels = (data[:, 0]**2 + data[:, 1]**2 < 1).float().unsqueeze(1)  # 点在圆内为1，圆外为0

# 可视化数据
plt.scatter(data[:, 0], data[:, 1], c=labels.squeeze(), cmap='coolwarm')
plt.title("Generated Data")
plt.xlabel("Feature 1")
plt.ylabel("Feature 2")
plt.show()

# 定义前馈神经网络
class SimpleNN(nn.Module):
    def __init__(self):
        super(SimpleNN, self).__init__()
        # 定义神经网络的层
        self.fc1 = nn.Linear(2, 4)  # 输入层有 2 个特征，隐藏层有 4 个神经元
        self.fc2 = nn.Linear(4, 1)  # 隐藏层输出到 1 个神经元（用于二分类）
        self.sigmoid = nn.Sigmoid()  # 二分类激活函数

    def forward(self, x):
        x = torch.relu(self.fc1(x))  # 使用 ReLU 激活函数
        x = self.sigmoid(self.fc2(x))  # 输出层使用 Sigmoid 激活函数
        return x

# 实例化模型
model = SimpleNN()

# 定义损失函数和优化器
criterion = nn.BCELoss()  # 二元交叉熵损失
optimizer = optim.SGD(model.parameters(), lr=0.1)  # 使用随机梯度下降优化器

# 训练
epochs = 2000
for epoch in range(epochs):
    # 前向传播
    outputs = model(data)
    loss = criterion(outputs, labels)

    # 反向传播
    optimizer.zero_grad()
    loss.backward()
    optimizer.step()

    # 每 10 轮打印一次损失
    if (epoch + 1) % 10 == 0:
        print(f'Epoch [{epoch + 1}/{epochs}], Loss: {loss.item():.4f}')

# 可视化决策边界
def plot_decision_boundary(model, data):
    x_min, x_max = data[:, 0].min() - 1, data[:, 0].max() + 1
    y_min, y_max = data[:, 1].min() - 1, data[:, 1].max() + 1
    xx, yy = torch.meshgrid(torch.arange(x_min, x_max, 0.1), torch.arange(y_min, y_max, 0.1), indexing='ij')
    grid = torch.cat([xx.reshape(-1, 1), yy.reshape(-1, 1)], dim=1)
    predictions = model(grid).detach().numpy().reshape(xx.shape)
    plt.contourf(xx, yy, predictions, levels=[0, 0.5, 1], cmap='coolwarm', alpha=0.7)
    plt.scatter(data[:, 0], data[:, 1], c=labels.squeeze(), cmap='coolwarm', edgecolors='k')
    plt.title("Decision Boundary")
    plt.show()

plot_decision_boundary(model, data)
```

训练时的损失输出：

```
Epoch [10/2000], Loss: 0.6547
Epoch [20/2000], Loss: 0.6451
Epoch [30/2000], Loss: 0.6363
...
Epoch [1980/2000], Loss: 0.0664
Epoch [1990/2000], Loss: 0.0662
Epoch [2000/2000], Loss: 0.0659
```

图中显示了原始数据点（红色和蓝色），以及模型学习到的分类边界。

![e9e452ad8bc0bc8b241d0c6c2d7d5d31](https://raw.githubusercontent.com/GMyhf/img/main/img/e9e452ad8bc0bc8b241d0c6c2d7d5d31.png)



# 附录B 大模型自我检测指南

Test Yourself on Build a Large Language Model

关于本书

塞巴斯蒂安·拉施卡（Sebastian Raschka）的畅销书《从零构建大语言模型》（Build a Large Language Model (From Scratch)）是学习大语言模型工作原理的最佳途径。全书共七章，另附五个附录，总计350余页，循序渐进地指导你构建一个类似于GPT-2的完整大语言模型。书中使用Python语言和PyTorch深度学习库，采用了一种独特而高效的学习方式——许多人认为，唯有亲手构建模型，才能真正掌握这一领域。

尽管原书已提供了清晰的讲解、图示和代码，但学习如此复杂的主题依然颇具挑战。本《自我检测指南》（Test Yourself guide）旨在让这一过程变得稍微轻松一些。其结构与《从零构建大语言模型》完全对应，聚焦于各章节的核心概念。你可以通过多项选择题、代码与关键概念相关问题，以及需要深入思考的开放式问答题来检验自己的理解。所有题目均附有答案。

无论你当前的知识水平如何，本指南都能以不同方式助你一臂之力：在阅读完某一章后使用它，可巩固所学内容；而在阅读前先浏览它，同样大有裨益——通过预先测试核心概念及其相互关系，你能更轻松地理解章节内容，并为吸收新知识做好准备。

建议在阅读前后都使用本指南，并在日后开始遗忘相关内容时再次回顾。重复学习有助于强化记忆，并将新知识与长期记忆中已有的相关知识有机整合。



## 1 理解大语言模型

第1章对大语言模型（LLM）进行了高层次的概述，探讨了其应用场景、构建阶段以及底层的Transformer架构。本章讨论了预训练（pretraining）和微调（fine-tuning）这两个开发高效LLM的关键步骤，并介绍了Transformer架构及其核心组件，包括编码器（encoder）和解码器（decoder）模块，以及自注意力（self-attention）机制。此外，本章还提出了一个从零开始构建LLM的实施计划，概述了三个主要阶段：<mark>数据准备与采样、注意力机制的实现，以及在无标签数据上进行预训练</mark>，从而获得一个基础模型，用于后续的微调。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251207202936020.png" alt="image-20251207202936020" style="zoom:33%;" />

### **核心概念快速问答**

1. 在大语言模型的背景下，深度学习与传统机器学习的主要区别是什么？
   A. 深度学习更适合处理结构化数据，而传统机器学习更适合非结构化数据。
   **B. 深度学习无需手动特征提取，而传统机器学习需要。**
   C. 深度学习在所有任务上都比传统机器学习更准确。
   D. 深度学习比传统机器学习计算效率更高。
2. 大语言模型（LLM）的主要功能是什么？

​	A. 分析和解读图像。
​	B. 预测未来事件。
​	**C. 理解、生成并回应类人文本。**
​	D. 控制和操作机器人。

3. 与通用大语言模型相比，定制构建的大语言模型（custom-built LLMs）的主要优势是什么？
   **A. 它们在特定任务或领域中可以超越通用大语言模型。**
   B. 它们更具通用性，可用于更广泛的任务。
   C. 它们在处理大型数据集时效率更高。
   D. 它们的训练成本更低。

4. Transformer架构在大语言模型中的重要意义是什么？
   A. 它为大型数据集提供了更快的处理速度。
   **B. 它使模型在进行预测时能够有选择性地关注输入文本的不同部分。**
   C. 它使模型能够从未标注的数据中学习。
   D. 它使模型无需专门训练即可实现语言翻译。

5. 对大语言模型进行预训练（pretraining）的主要目的是什么？
   A. 为特定任务微调模型。
   B. 评估模型在各种任务上的表现。
   C. 创建一个能够翻译语言的模型。
   **D. 通过在大规模、多样化的数据集上训练，使模型获得对语言的广泛理解。**

**按章节小节划分的问题**
接下来，将更详细地逐节回顾本章内容。

### 1.1 什么是大语言模型？

1. 什么是大语言模型（LLM）？它是如何工作的？ 

   An LLM is a deep neural network trained on massive amounts of text data to understand, generate, and respond to human-like text. It uses a transformer architecture to pay attention to different parts of the input, making it adept at handling language nuances. LLMs are trained on the task of predicting the next word in a sequence, which allows them to
   learn context, structure, and relationships within text.

2. “大语言模型”中的“大”有何重要意义？

   The 'large' refers to both the model's size in terms of parameters (adjustable weights) and the immense dataset it's trained on. LLMs often have tens or hundreds of billions of parameters, which are optimized during training to predict the next word in a sequence.

3. How do LLMs relate to generative AI?

   LLMs are often considered a form of generative AI because they can generate text. Generative AI is a broader term encompassing AI systems that create new content, such as text, images, or music.

4. Label this diagram 

   

5. What is the difference between traditional machine learning and deep learning in terms of feature extraction?

   AI is the broader field of creating machines that can perform tasks requiring human-like intelligence. Machine learning is a subset of AI that focuses on algorithms that learn from data. Deep learning is a subset of machine learning that uses deep neural networks with multiple layers to model complex patterns in data

6. 将术语与其右侧的描述进行匹配：

| Large Language Model (LLM) |      | A subset of machine learning that uses deep neural networks to model complex patterns and abstractions in data. |
| -------------------------- | ---- | ------------------------------------------------------------ |
| Transformer                |      | A type of artificial intelligence that can create new content, such as text, images, or audio. |
| Generative AI              |      | An architecture used in LLMs that allows them to pay selective attention to different parts of the input when making predictions, making them adept at handling the nuances of human language. |
| Deep Learning              |      | A type of artificial intelligence that uses deep learning to understand, generate, and respond to human-like text. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 4    | 3    | 2    | 1    |



### 1.2 大语言模型的应用

1. What are some of the key applications of LLMs in various domains?

LLMs are used in machine translation, text generation, sentiment analysis, text summarization, content creation, powering chatbots and virtual assistants, and knowledge retrieval from specialized areas like medicine and law.

2. How do LLMs contribute to the development of chatbots and virtual assistants?

LLMs enable chatbots and virtual assistants like ChatGPT and Gemini to understand and respond to user queries in a natural language, enhancing their ability to provide information and complete tasks.

3. Explain the role of LLMs in knowledge retrieval from specialized fields.

LLMs can analyze vast amounts of text in fields like medicine or law, summarizing lengthy passages, answering technical questions, and facilitating efficient knowledge retrieval.

4. What is the potential impact of LLMs on our relationship with technology?

LLMs have the potential to make technology more conversational, intuitive, and accessible by automating text-based tasks and enabling natural language interactions with AI systems.

5. 将术语与其右侧的描述进行匹配：

| Natural Language Processing |      | a field of computer science that focuses on enabling computers to understand and process human language. |
| --------------------------- | ---- | ------------------------------------------------------------ |
| Machine Translation         |      | computer programs designed to simulate conversation with human users. |
| Chatbots                    |      | the process of extracting relevant information from large amounts of data. |
| Knowledge Retrieval         |      | the automatic translation of text from one language to another. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 1    | 4    | 2    | 3    |





### 1.3 构建和使用大语言模型的各个阶段

1. What are the main advantages of building custom LLMs compared to using general-purpose LLMs like ChatGPT?

Custom LLMs offer advantages like improved performance for specific tasks or domains, enhanced data privacy by avoiding reliance on thirdparty providers, and the ability to deploy models locally on devices for reduced latency and costs.

2. Describe the two-stage training process involved in creating an LLM.

The process begins with pretraining, where the model learns a broad understanding of language from a large, diverse dataset. This pretrained model is then fine-tuned on a smaller, more specific dataset to adapt it to particular tasks or domains.

3. What is the purpose of pretraining an LLM, and what type of data is used in this stage?

Pretraining aims to develop a foundational model with a general understanding of language. It uses large amounts of unlabeled text data, often referred to as 'raw' text, to train the model to predict the next word in a sequence.

4. Explain the concept of self-supervised learning in the context of pretraining LLMs.

Self-supervised learning allows LLMs to generate their own labels from the input data during pretraining. This eliminates the need for manually labeled data, which is a common requirement in traditional supervised learning.

5. What are the two main categories of fine-tuning LLMs, and how do they differ in terms of the labeled data used?

Instruction fine-tuning uses labeled data consisting of instruction-answer pairs, while classification fine-tuning uses labeled data with texts and associated class labels.

6. 将术语与其右侧的描述进行匹配：

| Pretraining                |      | A type of fine-tuning where the labeled dataset consists of instruction and answer pairs, such as a query to translate a text accompanied by the correctly translated text. |
| -------------------------- | ---- | ------------------------------------------------------------ |
| Fine-tuning                |      | A type of fine-tuning where the labeled dataset consists of texts and associated class labels, for example, emails associated with "spam" and "not spam" labels. |
| Instruction Fine-tuning    |      | The process of further training a pretrained LLM on a narrower dataset that is more specific to particular tasks or domains. |
| Classification Fine-tuning |      | The initial phase of training an LLM on a large, diverse dataset to develop a broad understanding of language. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 4    | 3    | 1    | 2    |



### 1.4 Transformer架构介绍

1. What is the transformer architecture and what is its significance in the development of LLMs?

The transformer architecture is a deep neural network architecture that revolutionized natural language processing. It's the foundation for most modern LLMs, enabling them to process and understand language effectively.



2. Which label in the diagram does the output of the Embeddings stage go to?

The output of the Embeddings stage goes to the Decoder, label 2.

大部分的现代大语言模型基于Transformer架构，这是一种深度神经网络架构，该架构是在谷歌于2017年发表的论文“Attention Is All You Need”中首次提出的。为了理解大语言模型，我们需要简单回顾一下最初的Transformer。Transformer最初是为机器翻译任务（比如将英文翻译成德语和法语）开发的。Transformer架构的一个简化版本如图1-4所示。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/202512262332497.png" alt="image-20251226233223052" style="zoom: 33%;" />

图1-4　原始Transformer架构的简化描述，这是一种用于机器翻译的深度学习模型。Transformer由两部分组成：一个是编码器，用于处理输入文本并生成文本嵌入（一种能够在不同维度中捕获许多不同因素的数值表示）；另一个是解码器，用于使用这些文本嵌入逐词生成翻译后的文本。请注意，图中展示的是翻译过程的最后阶段，此时解码器根据原始输入文本(“This is an example”)和部分翻译的句子(“Das ist ein”)，生成最后一个单词(“Beispiel”)以完成翻译。



3. Describe the two main components of the transformer architecture and their roles in language processing.

  The transformer architecture consists of an encoder and a decoder. The encoder processes the input text and converts it into numerical representations, while the decoder uses these representations to generate the output text.

4. What is the self-attention mechanism and how does it contribute to the transformer's effectiveness?

  The self-attention mechanism allows the transformer to weigh the importance of different words in a sequence relative to each other. This helps the model capture long-range dependencies and contextual relationships, leading to more coherent and relevant output.

5. Explain the key differences between BERT and GPT models in terms of their training approaches and primary applications.

BERT focuses on masked word prediction and excels in tasks like text classification, while GPT is designed for generative tasks like text completion, translation, and summarization



6. What are zero-shot and few-shot learning, and how do they relate to GPT models?

Zero-shot learning allows GPT models to perform tasks without prior training on specific examples, while few-shot learning enables them to learn from a minimal number of examples. These capabilities demonstrate GPT's versatility and adaptability.



### 1.5 利用大型数据集

1. What are the key characteristics of the training datasets used for large language models like GPT-3 and BERT?

  These datasets are vast, encompassing billions of words and covering a wide range of topics and languages. They are designed to expose the models to diverse text, enabling them to learn language syntax, semantics, and context.

2. Explain the significance of the size and diversity of the training dataset for the performance of large language models.

  The scale and diversity of the training data allow these models to perform well on various tasks, including those requiring general knowledge. The models learn to understand and generate text that reflects the real-world complexities of language.

3. What is the concept of 'tokenization' in the context of large language models?

  Tokenization is the process of converting text into individual units called tokens, which are the basic building blocks that the model reads and processes. These tokens can be words, punctuation marks, or other meaningful units of text.

4. Describe the concept of 'pretraining' in the context of large language models and its significance.

  Pretraining involves training a large language model on a massive dataset to learn general language patterns and knowledge. This pre-trained model serves as a foundation, making it adaptable for various downstream tasks through fine-tuning, which involves further training on specific datasets for specific applications.

5. Explain the concept of 'fine-tuning' in the context of large language models and its advantages.

Fine-tuning involves further training a pre-trained large language model on a smaller, task-specific dataset. This process adapts the model to perform well on specific tasks, such as text summarization or question answering, while leveraging the general knowledge learned during pretraining.

6. 将术语与其右侧的描述进行匹配：

| Encoder                  |      | The ability of a model to generalize to completely unseen tasks without any prior specific examples. |
| ------------------------ | ---- | ------------------------------------------------------------ |
| Decoder                  |      | The part of the transformer architecture that takes the encoded vectors from the encoder and generates the output text. |
| Self-attention mechanism |      | The part of the transformer architecture that processes the input text and encodes it into a series of numerical representations or vectors that capture the contextual information of the input. |
| Zero-shot learning       |      | Allows the model to weigh the importance of different words or tokens in a sequence relative to each other, enabling it to capture long-range dependencies and contextual relationships within the input data. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 3    | 2    | 4    | 1    |





### 1.6 深入剖析GPT架构

1. What is the primary task that GPT models are trained on, and how does this relate to their ability to perform other tasks like translation?

  GPT models are primarily trained on a next-word prediction task, which involves predicting the next word in a sequence. This seemingly simple task allows the models to learn the relationships between words and phrases, enabling them to perform other tasks like translation, even though they were not explicitly trained for it.

2. Explain the concept of self-supervised learning in the context of GPT models.

  GPT models utilize self-supervised learning, where the model learns from the data itself without requiring explicit labels. In the case of GPT, <mark>the next word in a sentence serves as the label for the model to predict</mark>, allowing for training on massive unlabeled text datasets.

3. How does the GPT architecture differ from the original transformer architecture, and what are the implications of this difference?

  The GPT architecture uses only the decoder portion of the transformer, making it a decoder-only model. This design makes it suitable for text generation and next-word prediction tasks, as it generates text one word at a time in a unidirectional, left-to-right manner.

4. What is happening at the labels 1 and 2 in the diagram?

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/202512270002412.png" alt="image-20251227000239924" style="zoom:33%;" />

图1-8　GPT架构仅使用原始的Transformer解码器部分。它被设计为单向的从左到右处理，这使得它非常适合文本生成和下一单词预测任务，可以逐个词地迭代生成文本

| Label | Description                                                  |
| ----- | ------------------------------------------------------------ |
| 1     | The next word is created based on the input text             |
| 2     | The output of the previous round becomes the input to the next round |

5. What is the significance of GPT models being considered autoregressive models?

  Autoregressive models, like GPT, incorporate their previous outputs as inputs for future predictions. This means that each new word generated by GPT is based on the preceding sequence, ensuring coherence and fluency in the generated text.

6. Describe the relationship between the size and complexity of GPT models and their capabilities.

GPT models, particularly GPT-3, are significantly larger than the original transformer model, with a greater number of layers and parameters. This increased size and complexity contribute to their ability to perform a wider range of tasks and achieve higher accuracy.

7. 将术语与其右侧的描述进行匹配：

| Pretrained Models |      | Pretrained models that serve as a foundation for further fine-tuning on specific tasks. |
| ----------------- | ---- | ------------------------------------------------------------ |
| Fine-tuning       |      | The models are trained on massive datasets of text and code, allowing them to perform well on various tasks, including language syntax, semantics, and context. |
| Base Models       |      | A process of adapting a pretrained model to a specific task by training it on a smaller dataset related to that task. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    |
| ----------------- | ---- | ---- | ---- |
| Right Hand Column | 2    | 3    | 1    |





### 1.7 构建大语言模型

1. What are the three main stages involved in building a large language model from scratch?

   The three stages are implementing the LLM architecture and data preparation process, pretraining an LLM to create a foundation model, and fine-tuning the foundation model for specific tasks

2. What is the key idea behind the transformer architecture used in LLMs?

   The transformer architecture utilizes an attention mechanism that allows the LLM to selectively access the entire input sequence when generating output, word by word.

3. What is the primary task used for pretraining LLMs like GPT-3?

   LLMs like GPT-3 are pretrained on a massive corpus of text by predicting the next word in a sentence, using this prediction as a label.

4. Explain the concept of emergent properties in LLMs.

   While the primary pretraining task for GPT-like models is next-word prediction, they exhibit emergent properties, meaning they can perform tasks like classification, translation, and summarization without explicit training for those tasks.

5. Why is fine-tuning a pretrained LLM beneficial for specific tasks?

   Fine-tuning a pretrained LLM on a custom dataset allows it to specialize in specific tasks and potentially outperform general LLMs on those tasks.

6. Put these stages of creating a pretrained LLM (base model) in order:

   A. Evaluate the model's performance on text generation tasks.

   B. Implement the transformer decoder architecture (GPT-like).

   C. Prepare the text data by cleaning and tokenizing it.

   D. Train the model using a next-word prediction task on a large text dataset.

Fill the table with your answer:

| Step Order  | Step  |
| ----------- | ---- |
| 1 |  C   |
| 2 |  B   |
| 4 |  D   |
| 4 |  A   |



7. 将术语与其右侧的描述进行匹配：

| Autoregressive Model      |      | The task of predicting the next word in a sequence, which is used to train GPT models. |
| ------------------------- | ---- | ------------------------------------------------------------ |
| Self-Supervised Learning  |      | A type of machine learning where the model learns from the data itself, without requiring explicit labels. |
| Next-Word Prediction      |      | A type of model that generates text by predicting the next word in a sequence based on the words that have already been generated. |
| Decoder-Only Architecture |      | The architecture of GPT models, which uses only the decoder portion of the transformer architecture, making it suitable for text generation. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 3    | 2    | 1    | 4    |





## 2 处理文本数据

第二章重点介绍如何通过将文本转换为称为“嵌入”（embeddings）的数值表示形式，为大语言模型（LLM）的训练准备文本数据。本章探讨了分词（tokenization）过程，即将文本拆分为单个词或子词单元，并利用词汇表将这些词元（tokens）转换为对应的数值ID。书中涵盖了多种分词技术，包括GPT等模型所采用的字节对编码（Byte Pair Encoding, BPE）。此外，本章还解释了如何创建词元嵌入（token embeddings）——即词元的向量表示，并加入位置嵌入（positional embeddings）以编码词元在序列中的位置信息，从而为后续的大语言模型模块提供必要的输入。



<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251207203013472.png" alt="image-20251207203013472" style="zoom:33%;" />

### 核心概念快速问答

1. 在大语言模型（LLMs）的上下文中，分词（tokenization）的主要目的是什么？
   A. 分词用于将文本转换为小写。
   **B. 分词将文本拆分为单个词或特殊字符。**
   C. 分词用于识别句子中的词性。
   D. 分词用于从文本中移除停用词。
2. 在用于大语言模型的词汇表中，<|unk|> 词元的作用是什么？
   A. <|unk|> 词元用于表示标点符号。
   ​B. <|unk|> 词元用于标记句子的开头。
   **C. <|unk|> 词元用于表示训练数据中未出现过的未知词。**
   ​D. <|unk|> 词元用于标记句子的结尾。

1. 大语言模型（LLM）在训练期间的主要任务是什么？
   A. LLM 被训练用于将文本从一种语言翻译成另一种语言。
   B. LLM 被训练用于对文本进行摘要。
   C. LLM 被训练用于根据给定文本回答问题。
   **D. LLM 被训练用于根据前面的上下文预测序列中的下一个词。**
2. 绝对位置嵌入（absolute positional embeddings）与相对位置嵌入（relative positional embeddings）之间的区别是什么？
   **A. 绝对位置嵌入编码词元在序列中的确切位置，而相对位置嵌入编码词元之间的相对距离。**
   B. 绝对位置嵌入仅用于短序列，而相对位置嵌入用于长序列。
   C. 绝对位置嵌入比相对位置嵌入更高效。
   D. 相对位置嵌入比绝对位置嵌入更准确。
3. 在大语言模型的上下文中，________ 的作用是提供序列中词元的顺序和位置信息，帮助模型理解词语之间的关系。
   A. 注意力机制（attention mechanism）
   **B. 位置嵌入（positional embeddings）**
   C. 分词（tokenization）

6. 在输入处理流程中，送入大语言模型主层之前的最终输出是什么？
   A. 最终输出是词汇表中每个词的概率张量。
   B. 最终输出是文本词元的张量。
   **C. 最终输出是输入嵌入张量，由词元嵌入和位置嵌入组合而成。**
   D. 最终输出是词元 ID 的张量。



### 2.1 理解词嵌入

1. Why are word embeddings necessary for processing text data in deep learning models?

Deep learning models operate on numerical data, while text is categorical. Word embeddings convert words into continuous-valued vectors, making them compatible with the mathematical operations used in neural networks. 

2. What is the main idea behind the Word2Vec approach to generating word embeddings?

Word2Vec trains a neural network to predict the context of a word given the target word or vice versa. This approach assumes that words appearing in similar contexts tend to have similar meanings, resulting in clustered representations of related words in the embedding space.

3. Explain the trade-off involved in choosing the dimensionality of word embeddings.

Higher dimensionality in word embeddings can capture more nuanced relationships between words but comes at the cost of computational efficiency. Lower dimensionality offers faster processing but may sacrifice some semantic detail.

4. How do LLMs typically handle word embeddings compared to using pretrained models like Word2Vec?

LLMs often generate their own embeddings as part of the input layer and optimize them during training. This allows for embeddings tailored to the specific task and data, potentially leading to better performance than using pre-trained embeddings.

5. What is the primary challenge associated with visualizing highdimensional word embeddings?

Our visual perception and common graphical representations are limited to three dimensions or fewer. Visualizing high-dimensional embeddings requires specialized techniques or dimensionality reduction methods.



### 2.2 文本分词

1. What is the purpose of tokenizing text in the context of building a large language model?

Tokenization is a crucial preprocessing step for creating embeddings for an LLM. It involves splitting input text into individual tokens, which are either words or special characters, to prepare the text for further processing and embedding creation.

2. Describe the process of tokenizing text using Python's regular expression library 're'.

The 're.split' function can be used to split text based on specific patterns. By defining a regular expression that matches whitespace characters, punctuation marks, and other special characters, we can separate the text into individual tokens. The resulting list can then be further processed to remove redundant whitespace characters.

3. Why is it important to consider capitalization when tokenizing text for LLM training?

  Capitalization helps LLMs distinguish between proper nouns and common nouns, understand sentence structure, and learn to generate text with proper capitalization. Therefore, preserving capitalization during tokenization is beneficial for training effective language models.

4. Explain the trade-off between removing whitespaces during tokenization and keeping them.

Removing whitespaces reduces memory and computing requirements. However, keeping whitespaces can be useful for training models that are sensitive to the exact structure of the text, such as Python code, which relies on indentation and spacing.

5. 将术语与其右侧的描述进行匹配：

| Word Embeddings |      | The process of converting various data types, such as text, audio, or video, into a dense vector representation that deep learning models can understand. |
| --------------- | ---- | ------------------------------------------------------------ |
| Embedding       |      | The dimensionality of a word embedding, which determines the number of dimensions used to represent each word, influencing the complexity and computational efficiency of the model. |
| Word2Vec        |      | An algorithm that generates word embeddings by predicting the context of a word given the target word or vice versa, based on the idea that words appearing in similar contexts tend to have similar meanings. |
| Embedding Size  |      | A method of representing words as continuous-valued vectors, allowing deep learning models to process text data. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 4    | 1    | 3    | 2    |





### 2.3 将词元转换为词元ID

1. What is the purpose of converting tokens into token IDs?

   Converting tokens into token IDs is an intermediate step before converting them into embedding vectors. This process allows for efficient representation and processing of text data within a language model.

2. How is a vocabulary created for tokenization?

   A vocabulary is created by tokenizing the entire training dataset, sorting the unique tokens alphabetically, and assigning a unique integer to each token. This mapping allows for efficient conversion between tokens and their corresponding integer representations.

3. What is the purpose of the encode method in the SimpleTokenizerV1 class?

   The encode method takes text as input, splits it into tokens, and uses the vocabulary to convert these tokens into their corresponding integer IDs. This process allows for representing text data as a sequence of integers, which can be processed by the language model.

4. What is the purpose of the decode method in the SimpleTokenizerV1 class?

   The decode method takes a sequence of token IDs as input and uses the inverse vocabulary to convert these IDs back into their corresponding text tokens. This process allows for converting the output of the language model, which is a sequence of integers, back into human-readable text.

5. What is the limitation of using a vocabulary built from a small training set?

   Using a vocabulary built from a small training set can lead to issues when encountering new words or phrases not present in the training data. This can result in errors during tokenization and decoding, highlighting the importance of using large and diverse training sets for building robust
   language models.

6. 将术语与其右侧的描述进行匹配：

| Tokenization |  | individual units of text that result from tokenization, representing words, punctuation, or other special characters. | 
|--------------|---|------------------------------------------------------------------------------------------------------------------| 
| Tokens       |  | used to define patterns in text, allowing for flexible and precise text manipulation, including tokenization.     | 
| Regular Expressions |  | initial steps taken to prepare text data for further processing, such as tokenization, which makes the text suitable for use in language models. | 
| Preprocessing |  | splitting text into individual units, called tokens, which can be words, punctuation marks, or other special characters. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 4    | 1    | 2    | 3    |





### 2.4 引入特殊上下文词元

1. What are the two special tokens added to the vocabulary and what are their purposes?

   The two special tokens added are <|unk|> and <|endoftext|>. <|unk|> represents unknown words not in the training data, while <|endoftext|> separates unrelated text sources, helping the LLM understand their
   distinct nature.

2. How does the modified SimpleTokenizerV2 handle unknown words?

   When encountering a word not in the vocabulary, SimpleTokenizerV2 replaces it with the <|unk|> token, ensuring that all words are represented in the encoded text.

3. Explain the purpose of the <|endoftext|> token when training on multiple independent documents.

   The <|endoftext|> token acts as a marker between unrelated text sources, signaling the start or end of a particular segment. This helps the LLM understand that these texts, though concatenated for training, are
   distinct entities。

4. A piece of the code has been removed from this listing. Which of these terms has been removed and where should it go?

```
A unk B \n C <|unk|> D |unk|
```



```python
def encode(self, text):
    preprocessed = re.split(r'([,.:;?_!"()\']|--|\s)', text)
    preprocessed = [
        item.strip() for item in preprocessed if item.strip()
    ]
    preprocessed = [item if item in self.str_to_int
                    else "__1__" for item in preprocessed]
    
    ids = [self.str_to_int[s] for s in preprocessed]
    return ids
```

Fill out the table with your answer

| Position | 1    |
| -------- | ---- |
| Term     | C    |



5. What are the additional special tokens commonly used in LLMs, and what are their functions?

   Other common special tokens include [BOS] (beginning of sequence), [EOS] (end of sequence), and [PAD] (padding). [BOS] marks the start of a text, [EOS] indicates the end, and [PAD] is used to extend shorter texts

6. 将术语与其右侧的描述进行匹配：

| Vocabulary   |      | integer representations of tokens, used as an intermediate step before converting tokens into embedding vectors. |
| ------------ | ---- | ------------------------------------------------------------ |
| Token IDs    |      | the dataset used to build the vocabulary and train the language model. |
| Tokenizer    |      | a mapping from unique tokens to unique integer values, created by tokenizing the entire training dataset and sorting the tokens alphabetically. |
| Training Set |      | a class that implements methods for encoding text into token IDs and decoding token IDs back into text. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 3    | 1    | 4    | 2    |



### 2.5 Byte pair encoding

1. What are the two stages in this diagram?

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/202512272049569.png" alt="image-20251227204908944" style="zoom: 33%;" />



Fill out the table with your answers:

| Stage | Description |
| ----- | ----------- |
| 1     | Tokens      |
| 2     | Token IDs   |

2. What is the primary advantage of using Byte Pair Encoding (BPE) for tokenization, especially when dealing with unknown words?

  BPE tokenizers break down unknown words into smaller subword units or even individual characters. This allows them to handle any word without needing a special <|unk|> token, ensuring that the tokenizer and the LLM can process any text, even if it contains words not present in the training data.

3. What is the total vocabulary size of the BPE tokenizer used in models like GPT-2, GPT-3, and the original ChatGPT?

  The BPE tokenizer used in these models has a vocabulary size of 50,257, with the <|endoftext|> token assigned the largest token ID.

4. How does the BPE tokenizer handle unknown words, such as someunknownPlace, without using <|unk|> tokens?

  The BPE tokenizer breaks down unknown words into smaller subword units or individual characters. This allows it to represent any word as a sequence of known subword tokens or characters, enabling it to process any text without needing a special token for unknown words

5. What Python library is used to implement the BPE tokenizer in the provided code example?

The code uses the tiktoken library, which is an open-source Python library that efficiently implements the BPE algorithm based on Rust code.



### 2.6 使用滑动窗口进行数据采样

1. Explain the purpose of creating input-target pairs in the context of training a large language model (LLM).

  Input-target pairs are essential for training LLMs because they provide the model with examples of text sequences and their corresponding next words. This allows the LLM to learn the relationships between words and predict the most likely next word in a given context.

2. Describe the sliding window approach used for generating input-target pairs and how it works.

  The sliding window approach involves iterating through a text sequence and extracting overlapping chunks of text as inputs. Each input chunk is paired with the corresponding next word as the target. The window slides across the text, creating multiple input-target pairs for training.

3. Pieces of the code have been removed from three places in this listing. Which of these terms have been removed and where should they go?

```
A torch.vector B tiktoken C tokenizer D torch.tensor
```



| Position | 1    | 2    | 3    |
| -------- | ---- | ---- | ---- |
| Term     | C    | D    | D    |



4. What is the role of the stride parameter in the GPTDatasetV1 class, and how does it affect the generation of input-target pairs?

  The stride parameter determines the step size of the sliding window. A smaller stride results in more overlapping input chunks, while a larger stride creates less overlap. The choice of stride influences the amount of data generated and the potential for capturing long-range dependencies in the text.

5. Explain the purpose of the max_length parameter in the GPTDatasetV1 class and its impact on the input-target pairs.

  The max_length parameter defines the size of the input chunks extracted from the text. It determines the number of tokens included in each input sequence. A larger max_length allows the LLM to process longer
contexts, but it also increases the computational cost of training.

6. Pieces of the code have been removed from two places in this listing. Which of these terms have been removed and where should they go?

```
A tokenizer B tiktoken C dataset D dataloader
```



```python
def create_dataloader_v1(txt, batch_size=4, max_length=256,
                         stride=128, shuffle=True, drop_last=True,
                         num_workers=0):
    tokenizer = __1__.get_encoding("gpt2")
    dataset = GPTDatasetV1(txt, tokenizer, max_length, stride)
    dataloader = DataLoader(
        __2__,
        batch_size=batch_size,
        shuffle=shuffle,
        drop_last=drop_last,
        num_workers=num_workers
    )
    return dataloader
```

Fill out the table with your answers

| Position | 1    | 2    |
| -------- | ---- | ---- |
| Term     | B    | C    |



7. What is the significance of using PyTorch's Dataset and DataLoader classes for creating a data loader for LLM training?

PyTorch's Dataset and DataLoader classes provide a convenient and efficient way to manage and iterate over large datasets. They allow for batching, shuffling, and parallel data loading, which are crucial for
optimizing the training process of LLMs.

8. 将术语与其右侧的描述进行匹配：

| Byte Pair Encoding (BPE)      |      | words that are not present in the tokenizer's predefined vocabulary. |
| ----------------------------- | ---- | ------------------------------------------------------------ |
| Subword Units                 |      | total number of unique tokens that a tokenizer can recognize and represent. |
| Out-of-Vocabulary (OOV) Words |      | smaller units of text that a BPE tokenizer breaks down words into, which can be individual characters or combinations of characters. |
| Vocabulary Size               |      | a tokenization scheme that breaks down words into smaller subword units or individual characters, allowing it to handle unknown words by representing them as sequences of subword tokens or characters. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 4    | 3    | 1    | 2    |



### 2.7 创建词元嵌入

1. Why are embedding vectors necessary for training GPT-like LLMs?

   Embedding vectors are essential for training GPT-like LLMs because these models are deep neural networks that rely on the backpropagation algorithm for learning. Backpropagation requires continuous vector representations, which embedding vectors provide.

2. How are embedding weights initialized in the beginning of LLM training?

   Embedding weights are initially assigned random values. These random values serve as the starting point for the LLM's learning process. During training, the embedding weights are optimized through backpropagation to improve the model's performance.

3. What is the missing stage from this diagram?

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/202512270039347.png" alt="image-20251227003848539" style="zoom:33%;" />



The missing stage in the diagram is Token IDs.



4. Describe the process of converting a token ID into an embedding vector using an embedding layer

   The embedding layer acts as a lookup table. When given a token ID, it retrieves the corresponding embedding vector from its weight matrix. This embedding vector is a continuous representation of the token, allowing the LLM to process it effectively.

5. How does the embedding layer's weight matrix relate to the vocabulary size and embedding dimension?

   The embedding layer's weight matrix has a number of rows equal to the vocabulary size, representing each unique token. The number of columns corresponds to the embedding dimension, which determines the size of the embedding vector for each token.



6. 将术语与其右侧的描述进行匹配：

| Context Size       |      | number of positions the input window is shifted when creating the next batch of input-target pairs. |
| ------------------ | ---- | ------------------------------------------------------------ |
| Input-Target Pairs |      | a technique used to create input-target pairs from a text dataset by moving a window of tokens across the text. |
| Sliding Window     |      | number of tokens that the LLM uses as input to predict the next word. |
| Stride             |      | a set of data used to train an LLM, where the input is a sequence of tokens and the target is the next token in the sequence. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 3    | 4    | 2    | 1    |



### 2.8 编码单词位置信息

1. What is the main shortcoming of LLMs in terms of token order and how is it addressed?

   LLMs' self-attention mechanism lacks a notion of token order. To address this, positional embeddings are introduced, which provide information about the position of each token within a sequence.

2. Explain the difference between absolute and relative positional embeddings.

   Absolute positional embeddings assign a unique embedding to each position in a sequence, indicating its exact location. Relative positional embeddings focus on the relative distance between tokens, allowing the
   model to generalize better to sequences of varying lengths.

3. How are positional embeddings used in OpenAI's GPT models?

   GPT models use absolute positional embeddings that are optimized during training. These embeddings are not fixed or predefined but are learned alongside the model's other parameters.

4. Describe the process of creating input embeddings for an LLM using token embeddings and positional embeddings.

   Token embeddings are generated by mapping token IDs to vectors. Positional embeddings are then added to these token embeddings, resulting in input embeddings that incorporate both token identity and positional information.

5. What is the purpose of the token_embedding_layer and pos_embedding_layer in the code provided?

   The token_embedding_layer converts token IDs into embedding vectors, while the pos_embedding_layer generates positional embeddings based on the position of each token in the sequence.



## 3 编码注意力机制

第三章重点介绍在大语言模型（LLMs）中至关重要的各类注意力机制的编码实现，尤其聚焦于GPT架构中所采用的自注意力（self-attention）机制。自注意力是一种机制，它允许输入序列中的每个位置在计算序列表示时，考虑（或“关注”）同一序列中所有其他位置的相关性。自注意力是基于Transformer架构的当代大语言模型（如GPT系列）的核心组成部分。



<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251207203049082.png" alt="image-20251207203049082" style="zoom:33%;" />



### 核心概念快速问答

1. 使用传统的编码器-解码器RNN架构进行语言翻译时，尤其是在处理长句子时，主要存在什么问题？
   **A. RNN难以保留输入序列早期部分的上下文信息，因为它依赖于单一的隐藏状态。**
   B. RNN容易出现梯度消失问题，难以学习长期依赖关系。
   C. RNN计算开销大，训练速度慢。
   D. RNN不适合处理文本等序列数据。
2. 自注意力机制中“查询（query）”向量的作用是什么？
   A. 查询向量用于组合键（key）和值（value）向量。
   B. 查询向量用于计算注意力权重。
   **C. 查询向量代表序列中当前模型关注的元素，并用于探测其他元素的相关性。**
   D. 查询向量用于生成输出序列。
3. 语言模型中注意力机制的主要功能是什么？
   A. 提高模型处理长序列的能力。
   B. 降低模型的计算复杂度。
   C. 生成更具创造性和多样性的输出。
   **D. 有选择性地聚焦于输入序列的特定部分。**
4. 在____________注意力机制中，使用多个注意力头（attention heads）的主要优势在于，使模型能够同时关注输入序列的不同方面，从而更好地捕捉复杂关系。
   **A. 多头注意力（multi-head attention）**
   B. 单头注意力（single-head attention）
   C. 神经注意力（neural attention）
5. 注意力机制中的____________用于在训练过程中随机丢弃部分注意力权重，防止模型过度依赖某些特定连接。
   **A. 丢弃法（dropout）**
   B. 正则化（regularization）
   C. 编码（encoding）
6. ____________类在一个单一类中集成了多头功能，而MultiHeadAttentionWrapper类则使用多个独立的CausalAttention对象组成的列表。
   A. CausalAttention
   **B. MultiHeadAttention**
   C. Functionality
7. MultiHeadAttention类中输出投影层（output projection layer）的作用是什么？
   **A. 将多个注意力头的合并输出转换为期望的输出维度。**
   B. 降低注意力机制的计算复杂度。
   C. 确保注意力权重之和为1。
   D. 增强模型对噪声的鲁棒性。



### 3.1 长序列建模中的问题

1. What is the main challenge in translating text from one language to another, and why can't we simply translate word by word?

   The challenge lies in the grammatical structures of different languages. Direct word-by-word translation often fails to capture the meaning and context due to differences in sentence structure and word order.

2. Describe the role of the encoder and decoder in a language translation model.

   The encoder processes the entire input text and encodes its meaning into a hidden state. The decoder then uses this hidden state to generate the translated text, one word at a time.  

3. What is the primary limitation of encoder-decoder RNNs in handling long sequences?

   Encoder-decoder RNNs rely solely on the current hidden state during decoding, which can lead to a loss of context, especially when dependencies span long distances in complex sentences.  

4. Explain the concept of a hidden state in the context of encoder-decoder RNNs.

   The hidden state is a compressed representation of the input sequence, capturing the meaning of the entire text. It acts as a memory cell that the decoder uses to generate the translated output.



### 3.2 使用注意力机制捕获数据依赖关系

1. What is the main limitation of RNNs for translating longer texts?

   RNNs struggle with long texts because they need to remember the entire encoded input in a single hidden state before decoding, making it difficult to retain information from earlier parts of the input.

2. What is the significance of self-attention in the context of LLMs?

   Self-attention is a crucial component of contemporary LLMs based on the transformer architecture, such as the GPT series, enabling them to capture long-range dependencies and understand the relationships between words in a sentence.

3. 将术语与其右侧的描述进行匹配：

| Attention Mechanism      |      | A neural network architecture that relies on self-attention mechanisms to process sequential data, enabling it to handle long-range dependencies and outperform traditional RNNs in tasks like machine translation and text generation. |
| ------------------------ | ---- | ------------------------------------------------------------ |
| Self-Attention           |      | A family of large language models based on the transformer architecture, known for their impressive capabilities in generating human-like text, translating languages, and performing various other language-related tasks. |
| Transformer Architecture |      | A technique that allows a neural network to focus on specific parts of an input sequence when generating an output, enabling it to capture long-range dependencies and improve performance on tasks like machine translation. |
| GPT Series               |      | A type of attention mechanism where each element in a sequence can attend to all other elements in the same sequence, allowing the model to learn relationships and dependencies within the input. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 3    | 4    | 1    | 2    |



### 3.3 通过自注意力机制关注输入的不同部分

1. What is the purpose of the 'self' in self-attention?

   The 'self' in self-attention refers to the mechanism's ability to compute attention weights by relating different positions within a single input sequence. It assesses and learns the relationships and dependencies between various parts of the input itself.

2. Explain the concept of a context vector in self-attention.

   A context vector is an enriched embedding vector that incorporates information from all other elements in the input sequence. It represents an enhanced understanding of each element by considering its relationships with other elements.

3. What is the role of attention scores in self-attention?

   Attention scores are intermediate values that represent the similarity between the query element and each other element in the input sequence. They are calculated using dot products and indicate the degree of attention or focus on each element.

4. Why is normalization applied to attention scores?

   Normalization is applied to attention scores to obtain attention weights that sum up to 1. This normalization is a convention that is useful for interpretation and maintaining training stability in an LLM.

5. What function has been removed from this code at position 1?...

   The dot() function has been removed. This calculates the dot product of the query.

6. What is the purpose of the softmax function in self-attention?

   The softmax function is used to normalize attention scores, ensuring that the attention weights are always positive and sum to 1. It provides a more stable and interpretable representation of attention weights as probabilities or relative importance.

7. The diagram shows a simple attention mechanism. What does each numbered stage represent?...

   The labels in the diagram represent (Figure 3.7):

| Label | Description                                                  |
| ----- | ------------------------------------------------------------ |
| 1     | Input vector corresponding to the first token                |
| 2     | Attention weight to weigh the importance of input vector x (1) |
| 3     | The context vector z (2 ) is computed as a combination of all input<br/>vectors weighted with respect to input element x (2) |

  

8. Fill out the table with your answers:

  | Label | Description |
  | ----- | ----------- |
  | 1     |             |
  | 2     |             |
  | 3     |             |

  

9. How are context vectors calculated using attention weights?

   Context vectors are calculated by multiplying the embedded input tokens with their corresponding attention weights and then summing the resulting vectors. This weighted sum combines information from all input elements, creating an enriched representation of each element.

10. 将术语与其右侧的描述进行匹配：

| Context Vector    |      | Intermediate values calculated as dot products between the query element and all other input elements, representing the similarity or attention between them. |
| ----------------- | ---- | ------------------------------------------------------------ |
| Attention Scores  |      | Normalized attention scores that sum up to 1, representing the relative importance or contribution of each input element to the context vector. |
| Attention Weights |      | An enriched embedding vector that incorporates information about a specific input element and all other elements in the input sequence, creating a more comprehensive representation. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    |
| ----------------- | ---- | ---- | ---- |
| Right Hand Column | 3    | 1    | 2    |



### 3.4 实现带可训练权重的自注意力机制

1. Explain the purpose of the weight matrices Wq, Wk, and Wv in the selfattention mechanism.

   These matrices are used to project the embedded input tokens into query, key, and value vectors, respectively. This projection allows the model to learn relationships between different parts of the input sequence and determine the importance of each input element for generating context
   vectors.

2. Describe the process of computing attention scores and attention weights in the self-attention mechanism.

   Attention scores are calculated by taking the dot product of the query vector with each key vector. These scores are then normalized using the softmax function to obtain attention weights, which represent the relative importance of each input element for the current query.

3. Why is the scaling by the square root of the embedding dimension (d_k) important in the scaled-dot product attention mechanism?

   Scaling by the square root of d_k helps to prevent small gradients during backpropagation, especially when dealing with large embedding dimensions. This scaling ensures that the softmax function operates in a more stable range, leading to more effective model training.

4. The removed pieces map to the positions like this:...

   

5. What is the purpose of the SelfAttention_v1 and SelfAttention_v2 classes, and how do they differ in their implementation?

   Both classes implement the self-attention mechanism. SelfAttention_v1 uses manual weight initialization with nn.Parameter, while SelfAttention_v2 utilizes nn.Linear layers for weight matrices, which offers optimized weight initialization and improved training stability.





### 3.5 利用因果注意力隐藏未来词汇

1. What is the purpose of causal attention, and how does it differ from standard self-attention?

   Causal attention, also known as masked attention, restricts a model to consider only previous and current inputs in a sequence when processing any given token. This is in contrast to standard self-attention, which allows access to the entire input sequence at once.

2. What does this diagram show?...

   The diagram shows that in causal attention, we mask out the attention weights above the diagonal so that for a given input, the LLM can’t access future tokens when computing the context vectors using the attention weights. (Figure 3.19)

3. Describe the process of applying a causal attention mask to attention weights. What is the goal of this masking?

   The causal attention mask is applied to the attention weights by zeroing out the elements above the diagonal, effectively preventing the model from attending to future tokens. This ensures that the model's predictions are based solely on past and current information.

4. Explain the concept of information leakage in the context of causal attention and how it is addressed.

   Information leakage occurs when masked positions still influence the softmax calculation. However, renormalizing the attention weights after masking effectively nullifies the effect of masked positions, ensuring that there is no information leakage from future tokens.

5. What is the purpose of dropout in the attention mechanism, and how is it applied in the context of causal attention?

   Dropout is a technique used to prevent overfitting by randomly dropping out hidden layer units during training. In causal attention, dropout is typically applied after calculating the attention weights, randomly zeroing out some of the weights and scaling up the remaining ones.  

6. What is the significance of the register_buffer method in the CausalAttention class?

   The register_buffer method ensures that the causal mask is automatically moved to the appropriate device (CPU or GPU) along with the model, avoiding device mismatch errors during training.

7. 将术语与其右侧的描述进行匹配：

| Causal Attention          |      | Used to project input tokens into query, key, and value vectors, which are then used to compute attention scores and weights. |
| ------------------------- | ---- | ------------------------------------------------------------ |
| Trainable Weight Matrices |      | Used to selectively hide certain values during computation, often used to implement causal attention. |
| Mask                      |      | A specialized form of self-attention that restricts a model to only consider previous and current inputs in a sequence when processing any given token. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    |
| ----------------- | ---- | ---- | ---- |
| Right Hand Column | 3    | 1    | 1    |





### 3.6 将单头注意力扩展到多头注意力

1. What is the main purpose of multi-head attention in LLMs?

   Multi-head attention allows LLMs to process information from different perspectives by running the attention mechanism multiple times with different learned linear projections. This enables the model to capture more complex patterns and relationships within the input data.

2. How does the MultiHeadAttentionWrapper class implement multi-head attention?

   The MultiHeadAttentionWrapper class creates multiple instances of the CausalAttention module, each representing a separate attention head. It then combines the outputs from these heads by concatenating them.  

3. Explain the key difference between the MultiHeadAttentionWrapper and the MultiHeadAttention class.

   The MultiHeadAttentionWrapper stacks multiple single-head attention modules, while the MultiHeadAttention class integrates multi-head functionality within a single class. The MultiHeadAttention class splits the input into multiple heads by reshaping the projected query, key, and value tensors and then combines the results from these heads after computing attention.

  

4. Pieces of the code have been...

   

5. What is the purpose of the output projection layer in the MultiHeadAttention class?

   The output projection layer in the MultiHeadAttention class is used to project the combined outputs from all attention heads back to the original embedding dimension. This layer is not strictly necessary but is commonly used in many LLM architectures.

6. Why is the MultiHeadAttention class more efficient than the MultiHeadAttentionWrapper?

   The MultiHeadAttention class is more efficient because it performs matrix multiplications for the queries, keys, and values only once, instead of repeating them for each attention head as in the
   MultiHeadAttentionWrapper.

  

7. 将术语与其右侧的描述进行匹配：

| Masked Attention     |      | A specialized form of self-attention that restricts a model to only consider previous and current inputs in a sequence when processing any given token. |
| -------------------- | ---- | ------------------------------------------------------------ |
| Masked Attention     |      | A technique used during training to randomly ignore hidden layer units, preventing overfitting by ensuring that a model does not become overly reliant on any specific set of units. |
| Multi-Head Attention |      | The process of dividing the attention mechanism into multiple independent heads, each with its own set of weights, to enhance pattern recognition and improve model performance. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    |
| ----------------- | ---- | ---- | ---- |
| Right Hand Column | 3    | 2    | 1    |





## 4 从头实现GPT模型进行文本生成

第四章重点介绍实现类似 GPT 的大语言模型（LLM）架构，包括其 Transformer 块——其中包含上一章所讲的带掩码的多头注意力模块。本章解释了层归一化（layer normalization）、前馈网络（feed-forward networks）和捷径连接（shortcut connections）等概念。此外，本章还涵盖如何组装一个 GPT 模型，并使用该模型逐个 token 地生成文本。本章以拥有 1.24 亿参数的 GPT-2 模型为参考，明确了相关配置并演示了如何实例化该模型。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251207202746531.png" alt="image-20251207202746531" style="zoom:33%;" />



### 核心概念快速问答

1. GPT_CONFIG_124M 字典中的 context_length 参数的作用是什么？
   A. 指定模型中 Transformer 块的数量。
   B. 表示多头注意力机制中注意力头的数量。
   C. 表示嵌入维度大小，将每个 token 转换为向量。
   **D. 表示模型通过位置编码所能处理的最大输入 token 数量。** 
2. GPT 模型中层归一化（layer normalization）的主要目的是将神经网络层的激活值调整为均值为 0、__________ 为 1。
   **A. 方差（variance）**
   B. 梯度（gradient）
   C. 权重（weight） 
3. 在大语言模型（LLMs）中，层归一化相较于批归一化（batch normalization）的主要优势是什么？
   A. 层归一化更适合处理序列数据。
   **B. 层归一化对每个输入独立进行归一化，不依赖于批次大小。**
   C. 层归一化的计算效率更高。
   D. 层归一化在防止过拟合方面更有效。 
4. GPT-2 等大语言模型中常用的激活函数是什么？它比 ReLU 更平滑。
   A. ReLU（Rectified Linear Unit）
   **B. GELU（Gaussian Error Linear Unit）**
   C. Sigmoid
   D. Tanh 
5. 深度神经网络中捷径连接（shortcut connections）的主要作用是什么？
   A. 减少模型参数数量。
   **B. 在训练的反向传播过程中保持梯度流动。**
   C. 通过在训练期间随机丢弃神经元来防止过拟合。
   D. 提高模型的计算效率。 
6. GPT 模型中一个 Transformer 块的主要组成部分有哪些？
   A. 卷积层、池化层和 Maxout 激活函数。
   B. 线性层、ReLU 激活函数和批归一化。
   **C. 多头注意力、层归一化、Dropout、前馈层和 GELU 激活函数。**
   D. Token 嵌入、位置嵌入和 Dropout。 
7. 为什么未经过训练的 GPT 模型会生成无意义的乱码？
   A. 模型没有使用正确的激活函数。
   B. 模型没有使用正确的分词器（tokenizer）。
   **C. 模型尚未学习到词语之间以及语言中的模式关系。**
   D. 模型没有使用正确的 Dropout 比率。



### 4.1 构建一个大语言模型架构

1. What is the main purpose of a GPT model, and how does it achieve this?

   A GPT model is designed to generate new text one word at a time. It achieves this by using a large deep neural network architecture that learns patterns from a massive dataset of text and then uses these
   patterns to predict the next word in a sequence.

2. Label this diagram:...

   

3. What are the key components of a GPT model, and how do they contribute to the model's functionality?

   The key components of a GPT model include embedding layers, transformer blocks, and an output layer. Embedding layers convert words into numerical representations, transformer blocks process these representations to capture relationships between words, and the output layer predicts the probability of each word in the vocabulary.

4. Explain the concept of 'parameters' in the context of LLMs like GPT.

   Parameters in LLMs refer to the trainable weights of the model. These weights are adjusted during training to minimize a loss function, allowing the model to learn from the training data and improve its ability to generate text.

5. What are the main differences between GPT-2 and GPT-3, and why is GPT-2 a better choice for learning LLM implementation?

   GPT-3 is a larger model with more parameters and trained on more data than GPT-2. However, GPT-2 is more suitable for learning LLM implementation because its pretrained weights are publicly available, and it can be run on a single laptop computer, unlike GPT-3, which requires a GPU cluster.

6. Describe the purpose of the GPT_CONFIG_124M dictionary and explain the meaning of each key-value pair.

   The GPT_CONFIG_124M dictionary defines the configuration of the small GPT-2 model. It includes parameters like vocabulary size, context length, embedding dimension, number of attention heads, number of layers, dropout rate, and query-key-value bias, which determine the model's architecture and behavior.

7. What is the role of the DummyGPTModel class in the code, and how does it contribute to the overall implementation of the GPT model?

   The DummyGPTModel class provides a placeholder architecture for the GPT model, outlining the main components and their order. It serves as a starting point for building the full GPT model by defining the data flow and providing a framework for implementing the individual components.



### 4.2 使用层归一化进行归一化激活

1. What is the main purpose of layer normalization in neural networks, and how does it contribute to improved training dynamics?

   Layer normalization aims to stabilize and accelerate neural network training by adjusting the activations of a layer to have a mean of 0 and a variance of 1. This normalization process helps prevent vanishing or exploding gradients, ensuring consistent and reliable training.

2. Describe the typical placement of layer normalization within GPT-2 and modern transformer architectures.

   Layer normalization is commonly applied both before and after the multihead attention module in GPT-2 and modern transformer architectures. It is also applied before the final output layer.

3. Pieces of the code have...

  

4. Explain the difference between biased and unbiased variance calculation, and why is the biased approach preferred in the context of LLMs?

   Biased variance calculation divides by the number of inputs *n*, while unbiased variance uses *n* – *1* in the denominator to correct for bias. In LLMs, where the embedding dimension *n* is large, the difference
   between these approaches is negligible, and the biased method is preferred for compatibility with GPT-2's normalization layers and TensorFlow's default behavior.

5. What are the key differences between layer normalization and batch normalization, and why is layer normalization often favored in LLMs?

   Layer normalization normalizes across the feature dimension, while batch normalization normalizes across the batch dimension. Layer normalization offers greater flexibility and stability, especially in scenarios with varying batch sizes or resource constraints, making it suitable for LLMs.

6. 将术语与其右侧的描述进行匹配：

| Transformer Block |  | The core building block of a GPT model, consisting of a masked multi-head attention module and a feedforward neural network, which are applied sequentially to the input data. |
| -------------------- | ---- | ------------------------------------------------------------ |
| Layer Normalization |  | A technique used to normalize the output of each layer in a neural network, ensuring that the data has a mean of zero and a standard deviation of one, which helps to improve the stability and performance of the model. |
| Parameters |  | The trainable weights of a neural network model, which are adjusted during the training process to minimize a specific loss function. |
| Logits |  | The output of a neural network model before applying the softmax function, representing the unnormalized probabilities of each possible output class. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column |      |      |      |      |



### 4.3 实现具有GELU激活函数的前馈神经网络

1. What is the GELU activation function and how does it differ from the ReLU activation function?

   The GELU activation function is a smooth, nonlinear function that approximates ReLU but with a non-zero gradient for almost all negative values. Unlike ReLU, which outputs zero for any negative input, GELU allows for a small, non-zero output for negative values.

2. Explain the purpose and structure of the FeedForward module in the context of an LLM.

   The FeedForward module is a small neural network consisting of two linear layers and a GELU activation function. It expands the embedding dimension into a higher-dimensional space, applies a nonlinear transformation, and then contracts back to the original dimension, allowing for richer representation learning.

3. Pieces of the code have...

  

4. How does the FeedForward module contribute to the model's ability to learn and generalize data?

   The FeedForward module enhances the model's ability to learn and generalize data by exploring a richer representation space through the expansion and contraction of the embedding dimension. This allows the model to capture more complex relationships within the data.

5. What is the significance of the FeedForward module having the same input and output dimensions?

   The uniformity in input and output dimensions simplifies the architecture by enabling the stacking of multiple layers without the need to adjust dimensions between them, making the model more scalable.

  

### 4.4 添加快捷连接

1. What is the vanishing gradient problem and how does it affect training deep neural networks?

   The vanishing gradient problem occurs when gradients become progressively smaller as they propagate backward through the layers of a deep neural network, making it difficult to effectively train earlier layers. This can hinder the learning process and prevent the model from achieving optimal performance.

2. Explain the concept of shortcut connections and how they address the vanishing gradient problem.

   Shortcut connections, also known as skip connections, create alternative paths for gradients to flow through the network by bypassing certain layers. This helps preserve the flow of gradients during the backward pass, mitigating the vanishing gradient problem and enabling more effective training of deeper networks.

3. How are shortcut connections implemented in this code listing:...

   In the code, shortcut connections are implemented by adding the output of a layer to the output of a later layer. This is done conditionally based on the use_shortcut attribute, allowing for the inclusion or exclusion of shortcut connections during the forward pass.

4. What is the purpose of the print_gradients function and how does it demonstrate the effectiveness of shortcut connections?

   The print_gradients function calculates and displays the mean absolute gradient values for each layer in the model. By comparing the gradient values of models with and without shortcut connections, we can see that shortcut connections help maintain a more consistent gradient flow across layers, preventing the gradients from vanishing in earlier layers.

5. This diagram shows (on the left) a deep neural network consisting of five layers and one with shortcut connections (on the right). Why are the values of the gradients bigger in the network on the right?...

   The bigger gradient values on the right are because of the shortcut connections -these stop the gradient values from getting vanishingly small through the layers.

  

### 4.5 连接Transformer块中的注意力层和线性层

1. What are the key components of a transformer block and how do they contribute to the processing of input sequences?

   A transformer block consists of multi-head attention, feed forward layers, layer normalization, and dropout. The multi-head attention analyzes relationships between elements in the input sequence, while the feed forward network modifies the data individually at each position. Layer normalization ensures consistent scaling, and dropout prevents overfitting.  

2. Explain the concept of Pre-LayerNorm and its significance in the transformer block architecture.

   Pre-LayerNorm refers to applying layer normalization before the multihead attention and feed forward layers. This approach, unlike PostLayerNorm, has been shown to improve training dynamics and lead to better performance in transformer models.

3. Describe the role of shortcut connections in the transformer block and their impact on gradient flow.

   Shortcut connections add the input of the block to its output, allowing gradients to flow more easily through the network during training. This helps to prevent vanishing gradients and improves the learning of deep models.

4. How does the transformer block preserve the input dimensions in its output?

   The transformer block maintains the input dimensions by applying operations that do not alter the shape of the input sequence. This allows for a one-to-one correspondence between input and output vectors, enabling its use in various sequence-to-sequence.

5. Explain how the transformer block integrates contextual information from the entire input sequence into its output.

   While the transformer block preserves the physical dimensions of the input sequence, the content of each output vector is re-encoded to incorporate contextual information from across the entire input sequence. This allows the model to capture complex relationships between elements in the sequence.

  

### 4.6 实现GPT模型

1. What is the purpose of the GPTModel class and how does it relate to the TransformerBlock class?

   The GPTModel class assembles the complete GPT architecture, utilizing the previously defined TransformerBlock class as a building block. It combines token and positional embeddings, applies multiple TransformerBlock layers, and finally projects the output into the vocabulary space to predict the next token.

2. Explain the role of the LayerNorm layer in the GPTModel architecture.

   The LayerNorm layer is applied after the transformer blocks to normalize the output, ensuring that the data has a consistent scale and distribution. This helps to stabilize the learning process and improve the model's performance.

3. What is weight tying and how does it affect the number of parameters in a GPT model?

   Weight tying is a technique where the weights of the token embedding layer are reused in the output layer. This reduces the number of trainable parameters, leading to a smaller model footprint and potentially faster training.

4. Describe the process of converting the output of the GPTModel into text.

   The output of the GPTModel is a tensor of shape [batch_size, num_tokens, vocab_size], representing the logits for each token in the vocabulary. To convert these logits into text, we need to apply a softmax
   function to obtain probabilities, then select the token with the highest probability for each position in the sequence.

5. Pieces of the code have been removed from three places in this listing. Which of these terms have been removed and where should they go?...

   

6. How does the number of transformer blocks affect the complexity and performance of a GPT model?

   Increasing the number of transformer blocks in a GPT model generally leads to a larger model with more parameters, requiring more computational resources. However, it can also improve the model's ability to capture long-range dependencies in the input text, potentially leading to better performance on tasks like text generation.

7. 将术语与其右侧的描述进行匹配：

| Multi-Head Attention |      | a technique that normalizes the activations of a layer to have a mean of zero and a standard deviation of one, improving the stability and performance of the model. |
| -------------------- | ---- | ------------------------------------------------------------ |
| Layer Normalization  |      | allows the gradient to flow directly from the input to the output of a layer, preventing the vanishing gradient problem and enabling the training of deeper models. |
| Shortcut Connection  |      | allows the model to attend to different parts of the input sequence simultaneously, capturing complex relationships between words and phrases. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    |
| ----------------- | ---- | ---- | ---- |
| Right Hand Column | 3    | 1    | 2    |



### 4.7 生成文本

1. Explain the process by which a GPT model generates text, starting from its output tensors.

   The GPT model converts its output tensors into text by decoding them, selecting tokens based on a probability distribution derived from the softmax function, and then converting these tokens back into humanreadable text.

2. Describe the role of the softmax function in the text generation process.

   The `softmax` function transforms the output logits into a probability distribution, where each value represents the likelihood of a particular token being the next in the sequence. This allows the model to select the most probable token for generation.

3. What is the purpose of the generate_text_simple function, and how does it work?

   The generate_text_simple function implements a simple generative loop for a language model. It iteratively predicts the next token based on the current context, appends it to the input sequence, and repeats this process until a specified number of new tokens are generated.

4. Why is the softmax step technically redundant in the generate_text_simple function?

   The softmax function is monotonic, meaning it preserves the order of its inputs. Therefore, applying torch.argmax directly to the logits tensor would yield the same result as applying it to the softmax output, as the position of the highest value remains unchanged.

5. What is the significance of the greedy decoding approach in text generation?

   Greedy decoding refers to the strategy of always selecting the most likely token at each step. While this approach can be efficient, it can also lead to repetitive or predictable text, as the model always chooses the most obvious continuation.

6. Why does the GPT model generate gibberish when it hasn't been trained?

     The model generates incoherent text because it has not yet learned the relationships between words and their contexts. Training is crucial for the model to develop the ability to generate meaningful and coherent text.

7. Put these steps to implement the GPTModel architecture into the correct order:
     A. Initialize token and positional embeddings, dropout, and a linear output layer.

     B. Implement the forward pass, combining embeddings, transformer blocks, layer normalization, and the output layer.
     C. Create a sequential container for TransformerBlock instances.
     D. Create a GPTModel class inheriting from nn.Module. Fill the table with your answers:

| Step Order | Step |
| ---------- | ---- |
| 1          | D    |
| 2          | A    |
| 3          | C    |
| 4          | B    |





## 5 在无标签数据上进行预训练

第五章聚焦于大型语言模型（LLM）的预训练，并通过计算训练损失和验证损失等方法评估其性能。本章还探讨了多种解码策略，包括温度调节（temperature scaling）和 top-k 采样（top-k sampling），以控制生成文本的随机性并提升其原创性。此外，本章还介绍了保存和加载模型权重的实际操作步骤，使用户能够恢复训练，或从 OpenAI 的 GPT 模型等来源加载预训练权重。这些步骤对于开发和微调 LLM 以适应各种下游任务至关重要。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251207202838273.png" alt="image-20251207202838273" style="zoom:33%;" />



### 核心概念快速问答

1. 交叉熵损失函数在 LLM 训练中的主要作用是什么？
   A. 为评估目的生成文本样本。
   B. 防止模型对训练数据过拟合。
   C. 评估模型在特定任务（如文本分类）上的表现。
   **D. 衡量模型预测的词元概率分布与训练数据中真实词元分布之间的差异。**
2. 文本生成中温度调节（temperature scaling）的作用是什么？
   **A. 通过调整词元的概率分布，控制生成文本的随机性和多样性。**
   B. 提高模型预测下一个词元的准确性。
   C. 降低文本生成的计算成本。
   D. 防止模型对训练数据过拟合。
3. 大型语言模型（LLM）预训练的主要目标是什么？
   A. 提升模型生成连贯且语法正确的文本的能力。
   B. 针对特定任务（如文本分类）对模型进行微调。
   **C. 从海量文本数据中学习通用的语言模式和表征。**
   D. 降低模型训练的计算成本。
4. 使用 OpenAI 提供的预训练权重对 LLM 的主要好处是什么？
   **A. 无需从头开始进行大量且昂贵的预训练。**
   B. 降低模型对训练数据过拟合的风险。
   C. 保证模型在任何任务上都能表现良好。
   D. 简化针对特定任务微调模型的过程。
5. 在 PyTorch 中保存模型状态字典（state dictionary）的主要优势是什么？
   A. 提高模型在未见数据上的表现。
   **B. 允许加载并复用已训练好的模型，而无需从头重新训练。**
   C. 防止模型对训练数据过拟合。
   D. 降低模型训练的计算成本。



### 5.1 评估文本生成模型

1. What is the purpose of the generate_text_simple function and how does it work?

   The generate_text_simple function generates text by taking a starting context, converting it to token IDs, feeding it into the GPT model, and then converting the model's output logits back into token IDs, which are then decoded into text.

2. Explain the concept of text generation loss and its significance in evaluating the quality of generated text.

   Text generation loss is a numerical measure used to evaluate the quality of generated text. It quantifies the difference between the model's predicted output (token probabilities) and the actual desired output (target tokens). A lower loss indicates better text generation quality.  

3. Describe the role of backpropagation in training an LLM and how it relates to the text generation loss.

   Backpropagation is a technique used to update the model's weights during training. It uses the text generation loss to adjust the weights so that the model produces outputs closer to the target tokens, thereby minimizing the loss and improving the quality of generated text.

4. What is cross entropy loss and how is it used in evaluating LLMs?

   Cross entropy loss is a measure of the difference between two probability distributions, typically the true distribution of labels (tokens) and the predicted distribution from the model. It is used to evaluate the performance of LLMs by quantifying how well the model's predicted probability distribution matches the actual distribution of tokens in the dataset.

5. Label this diagram...

   

6. Explain the concept of perplexity and its relationship to cross entropy loss.

   Perplexity is a measure derived from cross entropy loss that provides a more interpretable way to understand the uncertainty of a model in predicting the next token. It represents the effective vocabulary size about which the model is uncertain at each step. A lower perplexity indicates less uncertainty and better model performance.

7. Pieces of the code ...

   

### 5.2 训练大语言模型

1. What is the purpose of the train_model_simple function and what are its key components?

   The train_model_simple function implements a basic training loop for the LLM. It iterates over epochs, processes batches, calculates loss, updates weights, and evaluates the model's performance using validation data.

2. Explain the role of the evaluate_model function in the training process.

   The evaluate_model function calculates the loss on both the training and validation sets to assess the model's performance. It ensures the model is in evaluation mode, disabling gradient tracking and dropout for accurate evaluation.

3. Pieces of the code...

   

4. What is the purpose of the generate_and_print_sample function and how does it work?

   The generate_and_print_sample function generates text samples from the model to visually assess its progress during training. It takes a text snippet as input, converts it to token IDs, and uses the
   generate_text_simple function to generate new text.

   

5. The terms are connected like this: ...

   

6. What is AdamW and why is it preferred over Adam for training LLMs?

   AdamW is a variant of the Adam optimizer that improves weight decay, a technique that penalizes larger weights to prevent overfitting. This makes AdamW more effective for regularizing and generalizing LLMs.

7. What is the significance of the training and validation loss curves in Figure 5.12?

   The curves show that the model initially learns well, but the training loss continues to decrease while the validation loss stagnates. This indicates overfitting, where the model memorizes the training data instead of generalizing to new data.

  

7. 将术语与其右侧的描述进行匹配：

| Text Generation Loss |      | a common measure in machine learning that quantifies the difference between two probability distributions, typically the true distribution of labels and the predicted distribution from a model. |
| -------------------- | ---- | ------------------------------------------------------------ |
| Cross Entropy Loss   |      | a standard technique for training deep neural networks that involves updating the model's weights to minimize the difference between the model's predicted output and the actual desired output. |
| Perplexity           |      | a measure used alongside cross entropy loss to evaluate the performance of models in tasks like language modeling, providing a more interpretable way to understand the uncertainty of a model in predicting the next token in a sequence. |
| Backpropagation      |      | a numerical measure used to assess the quality of text generated during training, indicating how well the model's predictions align with the desired target text. |

Fill the table with the column mappings:  ⚠️这个连线题目答案给的是 3 1 4 2，是错的。应该是 4 1 3 2。

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 4    | 1    | 3    | 2    |



### 5.3 控制随机性的解码策略

1. What is the purpose of temperature scaling in text generation?

   Temperature scaling adjusts the probability distribution of the next token by dividing the logits by a temperature value. Higher temperatures create a more uniform distribution, leading to more diverse outputs, while lower temperatures sharpen the distribution, favoring the most likely tokens.

2. Explain how top-k sampling works and its benefit in text generation.

   Top-k sampling selects only the top-k most likely tokens for the next token prediction. This helps to reduce the generation of nonsensical or grammatically incorrect text by focusing on the most probable options.

3. Describe the difference between greedy decoding and probabilistic sampling in text generation.

   Greedy decoding always selects the token with the highest probability, while probabilistic sampling chooses tokens based on their probability distribution. Probabilistic sampling introduces randomness and can lead to more diverse outputs.

4. What is the purpose of the Inf Masking step in the top-k sampling process?...

   The correct answer is C, “To set logits not in the top-k to negative infinity, removing them from consideration”

5. How does the generate function incorporate temperature scaling and top-k sampling?

   The generate function allows for the specification of temperature and top-k values. If a temperature is provided, the logits are scaled accordingly. If a top-k value is given, the logits are masked to exclude tokens outside the top-k most likely options

   

### 5.4 使用 PyTorch 加载和保存模型权重

1. Why is it important to save the model weights after training a large language model?

   Saving the model weights allows you to reuse the trained model without retraining it from scratch, saving significant computational time and resources. This is especially important for large language models, which can take a long time to train.

2. What is the recommended way to save a PyTorch model's weights?

   The recommended way is to save the model's state_dict, which is a dictionary mapping each layer to its parameters, using the torch.save function. This allows you to easily load the weights into a new model
   instance later.

3. What is the purpose of the model.eval() method in PyTorch?

   The model.eval() method switches the model to evaluation mode, disabling dropout layers. This is important for inference, as we don't want to randomly drop out information during prediction.

4. Why is it important to save the optimizer state when saving a model?

   Saving the optimizer state allows you to resume training from where you left off. This is important for adaptive optimizers like AdamW, which store historical data to adjust learning rates dynamically. Without the optimizer state, the model may learn suboptimally or fail to converge properly.

5. Pieces of the code have ...

   

6. 将术语与其右侧的描述进行匹配：

| AdamW           |      | the process of iterating over the training data multiple times, calculating the loss for each batch, and updating the model weights to minimize the loss |
| --------------- | ---- | ------------------------------------------------------------ |
| Training Loop   |      | a variant of the Adam optimizer that improves the weight decay approach, which aims to minimize model complexity and prevent overfitting by penalizing larger weights |
| Overfitting     |      | the loss calculated on a separate dataset that is not used for training, which provides an estimate of the model's performance on unseen data |
| Validation Loss |      | a phenomenon that occurs when a model learns the training data too well and performs poorly on unseen data |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 2    | 1    | 4    | 3    |



### 5.5 从 OpenAI 加载预训练权重

1. What is the primary advantage of using pretrained weights from OpenAI for a GPT-2 model?

   Using pretrained weights from OpenAI eliminates the need for extensive training on a large corpus, saving significant time and computational resources

2. What are the key components of the settings and params dictionaries obtained from OpenAI's GPT-2 model weights?

   The settings dictionary contains the LLM architecture settings, while the params dictionary holds the actual weight tensors for the model's layers.

3. How are the pretrained weights from OpenAI loaded into a custom GPTModel instance?

   The load_weights_into_gpt function carefully matches the weights from OpenAI's implementation with the corresponding layers in the custom GPTModel instance, ensuring consistency and functionality.

4. What is the significance of the model_configs dictionary in the context of loading pretrained weights?

   The model_configs dictionary provides the specific architectural settings for different GPT-2 model sizes, allowing for the selection and loading of weights for the desired model.

5. Why is it necessary to update the NEW_CONFIG dictionary with context_length and qkv_bias settings?

   The pretrained GPT-2 models from OpenAI were trained with a different context_length and used bias vectors in the attention module, requiring these settings to be updated for compatibility.  

6. 将术语与其右侧的描述进行匹配：

| State Dict      |      | a dictionary containing the parameters of each layer in a PyTorch model. |
| --------------- | ---- | ------------------------------------------------------------ |
| Model Weights   |      | a dictionary containing the internal state of the optimizer, such as the learning rate and momentum. |
| Optimizer State |      | the parameters that are learned during the training process and are used to make predictions. |
| Evaluation Mode |      | a mode in which the model is used for inference, and dropout layers are disabled. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 1    | 3    | 2    | 4    |





## 6 针对分类的微调 

第6章聚焦于分类微调（classification fine-tuning），这是一种将预训练的大语言模型（LLM）适配到特定分类任务的技术，例如识别垃圾短信。本章引导读者完成以下步骤：准备一个短信文本数据集；通过替换预训练LLM的输出层以适应分类任务；并实现一个训练函数，对模型进行微调以执行垃圾短信分类。此外，本章还涵盖了如何评估微调后模型的准确率，并演示了如何使用该模型将新的短信文本分类为“垃圾”或“非垃圾”。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251207202547257.png" alt="image-20251207202547257" style="zoom: 33%;" />



### 核心概念快速问答

1. ____________ 的主要目的是训练模型识别并预测特定的类别标签。
   **A. 分类微调（classification-finetuning）**
   B. 回归（regression）
   C. 聚类（clustering）
2. 语言模型微调的两大主要类别是什么？
   **A. 指令微调（Instruction-finetuning）和分类微调（classification-finetuning）**
   B. 生成式模型与判别式模型（Generative and discriminative models）
   C. 预训练与微调（Pretraining and fine-tuning）
   D. 监督学习与无监督学习（Supervised and unsupervised learning）
3. 在垃圾短信数据集中对文本消息进行填充（padding）的目的是什么？
   **A. 确保所有文本消息具有相同长度，以便进行批处理（batch processing）。**
   B. 降低处理文本消息的计算成本。
   C. 从文本消息中移除无关信息。
   D. 提高模型理解文本上下文的能力。
4. 在 SpamDataset 类中，填充标记（padding token）的作用是什么？
   A. 标记文本消息的开始和结束。
   B. 表示新句子的开始。
   C. 表示未知词或词汇表外的词（out-of-vocabulary words）。
   **D. 填充较短文本消息中的空缺，使其长度与最长消息一致。**
5. 为什么在分类微调中选择 GPT 模型的最后一个输出 token 进行分类？
   A. 因为最后一个 token 最有可能包含类别标签信息。
   B. 因为最后一个 token 对模型来说最容易处理。
   C. 因为最后一个 token 是文本消息中最重要的 token。
   **D. 因为由于因果注意力掩码（causal attention mask），最后一个 token 能够累积来自所有先前 token 的信息。**
6. 在垃圾短信分类任务中，交叉熵损失函数（cross entropy loss function）的作用是什么？
   A. 确定训练所需的轮数（epochs）。
   B. 计算模型预测的准确率。
   **C. 衡量模型预测概率与真实类别标签之间的差异。**
   D. 识别文本消息中最重要的特征。
7. 模型在测试集上的准确率有何意义？
   **A. 它表明模型在新、未见过的数据上的泛化能力。**
   B. 它决定了训练所需的轮数。
   C. 它反映了模型在训练数据上的表现。
   D. 它表明模型从训练数据中学习的能力。



### 6.1 不同类型的微调

1. What are the two most common ways to fine-tune language models?

   The two most common ways to fine-tune language models are instruction fine-tuning and classification fine-tuning. Instruction fine-tuning focuses on training the model to understand and execute tasks based on natural language prompts, while classification fine-tuning trains the model to recognize specific class labels.

2. Describe the purpose of instruction fine-tuning and provide an example.

   Instruction fine-tuning aims to improve a model's ability to understand and execute tasks based on natural language instructions. For example, training a model to translate English sentences into German using specific instructions would be an instance of instruction fine-tuning.

3. Explain the concept of classification fine-tuning and give an example.

   Classification fine-tuning involves training a model to recognize specific class labels. For instance, training a model to identify whether an email is spam or not spam is an example of classification fine-tuning. This approach is also used in tasks like image classification and sentiment analysis.

4. What is the key limitation of a classification fine-tuned model?

   A classification fine-tuned model is restricted to predicting classes it has encountered during training. It can only classify data into the predefined categories it was trained on, limiting its ability to handle tasks outside its training scope.

5. Compare the flexibility of instruction fine-tuned models and classification fine-tuned models.

   Instruction fine-tuned models are more flexible and can handle a broader range of tasks based on user instructions. Classification fine-tuned models are highly specialized and excel at categorizing data into
   predefined classes, but they lack the flexibility of instruction fine-tuned models.  

6. When is instruction fine-tuning the preferred approach?

   Instruction fine-tuning is best suited for models that need to handle a variety of tasks based on complex user instructions, improving flexibility and interaction quality. It is ideal for applications requiring adaptability and the ability to respond to diverse user requests.

  

### 6.2 准备数据集

1. What is the purpose of the dataset used in this section and what type of data does it contain?

   The dataset used is a collection of text messages classified as either 'spam' or 'non-spam' (also known as 'ham'). This dataset is used to demonstrate the process of fine-tuning a large language model for
   classification tasks.

2. Why is the dataset undersampled to include an equal number of 'spam' and 'non-spam' messages?

   The original dataset has a significant imbalance between 'spam' and 'nonspam' messages. Undersampling creates a balanced dataset, which is beneficial for training a classification model as it prevents the model from being biased towards the majority class.

3. How are the 'string' class labels ('ham' and 'spam') converted into integer class labels?

   The 'string' class labels are converted into integer class labels (0 and 1) using a mapping dictionary. This process is similar to converting text into token IDs, but instead of using the GPT vocabulary, it uses only two token IDs.

4. Describe the purpose of the random_split function and how it divides the dataset.

   The random_split function divides the dataset into three parts: training, validation, and testing. The training set is used to train the model, the validation set is used to adjust hyperparameters and prevent overfitting, and the testing set is used to evaluate the model's performance on unseen data.

5. Pieces of the code have been removed from two places in this listing. Which of these terms have been removed and where should they go?...

   

6. What is the significance of saving the dataset as CSV files?...

   Saving the dataset as CSV files allows for easy reuse of the data in future steps. This ensures that the prepared dataset can be readily accessed for further analysis and model training.

7. 将术语与其右侧的描述进行匹配：

| Instruction Fine-Tuning    |      | The process of training a language model on a set of tasks using specific instructions to improve its ability to understand and execute tasks described in natural language prompts. |
| -------------------------- | ---- | ------------------------------------------------------------ |
| Classification Fine-Tuning |      | A model that can perform well across a variety of tasks.     |
| Generalist Model           |      | A model that is highly trained to perform a specific task.   |
| Specialized Model          |      | A method of training a model to recognize a specific set of class labels, such as 'spam' and 'not spam'. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 1    | 4    | 2    | 3    |



### 6.3 创建数据加载器

1. What are the two primary options for batching text messages of varying lengths?

   The two options are truncating all messages to the length of the shortest message or padding all messages to the length of the longest message. Truncation is computationally cheaper but can lead to information loss, while padding preserves the entire content of all messages.

2. Pieces of the code have been removed from four places in this listing. Which of these terms have been removed and where should they go? Note that a term may appear more than once!...

  

3. What is the purpose of the padding token and how is it used in the SpamDataset class?

   The padding token is used to ensure that all text messages in a batch have the same length. In the SpamDataset class, shorter messages are padded with the padding token ID (50256) to match the length of the longest message.

4. What is the role of the SpamDataset class in the data loading process?

   The SpamDataset class handles several key tasks: loading data from CSV files, tokenizing text messages using the GPT-2 tokenizer, and padding or truncating sequences to a uniform length. It also provides methods to access individual data samples and the overall dataset length.

5. Label this diagram by assigning the label numbers to the matching description...

   

6. How are the validation and test sets padded and truncated in relation to the training set?

   The validation and test sets are padded to match the length of the longest training sequence. Any samples exceeding this length are truncated. This ensures consistency in input lengths across all datasets.

7. Describe the structure of a single training batch in terms of input and target tensors.

   A single training batch consists of eight text messages represented as token IDs, each with 120 tokens. The corresponding class labels for each message are stored in a separate tensor. This structure allows for efficient processing of multiple training examples simultaneously.

8. What is the purpose of the DataLoader class and how is it used to create training, validation, and test loaders?

   The DataLoader class is used to create data loaders that efficiently load and process data in batches. It takes a dataset as input and allows for customization of parameters like batch size, shuffling, and number of workers. Separate data loaders are created for training, validation, and testing, each with specific configurations.

  

### 6.4 初始化带有预训练权重的模型

1. What is the purpose of initializing a pretrained model before fine-tuning for classification?

   Initializing a pretrained model prepares it for classification fine-tuning by loading the weights learned during pretraining on unlabeled data. This allows the model to leverage its existing knowledge and accelerate the learning process for the specific classification task.

2. Describe the process of loading pretrained weights into the GPT model.

   The process involves using the download_and_load_gpt2 function to retrieve the pretrained weights based on the chosen model size. These weights are then loaded into the GPTModel using the
   load_weights_into_gpt function, ensuring the model is ready for finetuning.

3. How is the model's ability to generate coherent text used to verify that the pretrained weights have been loaded correctly?

   By providing a prompt and generating text using the generate_text_simple function, we can assess whether the model produces coherent and meaningful output. If the generated text is sensible, it indicates that the pretrained weights have been loaded successfully.

4. What is the purpose of prompting the model with a spam message before fine-tuning?

   Prompting the model with a spam message allows us to evaluate its initial ability to classify spam. This provides a baseline understanding of the model's performance before fine-tuning and helps identify areas for improvement.

  

### 6.5 添加分类头

1. Why is it necessary to modify the output layer of a pretrained LLM for classification fine-tuning?

   The original output layer of a pretrained LLM is designed for language generation, mapping hidden representations to a large vocabulary of tokens. For classification, we need a smaller output layer that maps to the specific classes we want to predict.

2. Explain the rationale behind using a number of output nodes equal to the number of classes in a classification task.

   Using a separate output node for each class allows for a more general approach to classification, as it avoids the need to modify the loss function for binary tasks. This approach is easily adaptable to multi-class problems.

3. Why is it often sufficient to fine-tune only the last layers of a pretrained LLM for a new task?

   The lower layers of a pretrained LLM typically capture general language structures and semantics, while the upper layers learn task-specific features. Fine-tuning only the last layers allows for efficient adaptation to new tasks without disrupting the learned general language knowledge.

4. Describe the process of freezing and unfreezing layers in a pretrained LLM for fine-tuning.

   Freezing layers prevents their weights from being updated during training. This is done by setting the requires_grad attribute of their parameters to False. Unfreezing layers allows their weights to be
   updated by setting requires_grad to True.

5. Why is the last token in a sequence considered the most informative for classification tasks using a causal attention mask?

   The causal attention mask restricts each token's attention to itself and preceding tokens. As a result, the last token accumulates information from all previous tokens, making it the most comprehensive
   representation of the input sequence.

6. Explain the significance of focusing on the last output token for classification fine-tuning in a GPT-like model.

   Since the last token in a sequence has access to information from all preceding tokens due to the causal attention mask, it provides the most relevant context for classification. Therefore, fine-tuning based on the last token's output allows for more accurate predictions



### 6.6 计算分类损失和准确率

1. Explain how the model's output is converted into a class label prediction for spam classification.

   The model's output for the last token is a 2-dimensional tensor representing the probability scores for each class (spam or not spam). The class label is determined by finding the index of the highest
   probability score using the argmax function.

2. What is the purpose of the softmax function in this context, and why is it optional?

   The softmax function converts the model's output into probabilities that sum to 1. It is optional because the largest output values directly correspond to the highest probability scores, so argmax can be applied directly to the output tensor

3. Describe the function of the calc_accuracy_loader function and how it is used to calculate the classification accuracy.

   The calc_accuracy_loader function iterates through a data loader, applies the argmax prediction to each input, and calculates the proportion of correct predictions. It returns the classification accuracy as a percentage.

4. Why is cross-entropy loss used as a proxy for maximizing classification accuracy?

   Classification accuracy is not a differentiable function, making it unsuitable for optimization. Cross-entropy loss is a differentiable function that can be used to optimize the model's parameters to indirectly maximize classification accuracy.

5. Explain the key difference between the calc_loss_batch function used for classification and the one used for language modeling.

   The classification calc_loss_batch function focuses on optimizing only the last token's output, while the language modeling version optimizes the output of all tokens. This difference reflects the focus on predicting the class label for the last token in classification.



### 6.7 在有监督数据上微调模型

1. What is the primary difference between the training loop used for finetuning and the one used for pretraining?

   The primary difference is that during fine-tuning, we calculate the classification accuracy instead of generating sample text to evaluate the model's performance.

2. Describe the key modifications made to the train_classifier_simple function compared to the train_model_simple function used for pretraining.

   The train_classifier_simple function tracks the number of training examples seen instead of tokens and calculates accuracy after each epoch. It also omits the step of printing a sample text.

3. What is the purpose of the evaluate_model function in the context of fine-tuning?

   The evaluate_model function calculates the loss for both the training and validation sets, providing insights into the model's performance on both seen and unseen data.

4. Explain the significance of the loss curves plotted here:...

   The loss curves in Figure 6.16 show a sharp decline in both training and validation loss during the initial epochs, indicating effective learning. The close proximity of the curves suggests that the model is generalizing well to unseen data and not overfitting.

5. What factors influence the choice of the number of epochs during finetuning?

   The number of epochs depends on the dataset's complexity and the task's difficulty. Overfitting may necessitate reducing the number of epochs, while insufficient training might require increasing them.

6. Pieces of the code have been removed from three places in this listing. Which of these terms have been removed and where should they go?...

   

7. How does the eval_iter parameter affect the accuracy estimations during training?

   The eval_iter parameter determines the number of batches used to calculate training and validation accuracy. A smaller eval_iter value leads to faster training but less accurate performance estimations.

8. Put these steps to prepare and fine-tune the GPT-2 Model into the correct order:
   A. Load pretrained GPT-2 model weights.
   B. Train the model using the training data loader for a specified number of epochs.
   C. Freeze all model parameters except the output layer and the last transformer block.
   D. Initialize an AdamW optimizer.

   E. Define functions to calculate loss and accuracy for a batch and a data loader.
   F. Set the requires_grad attribute to True for the new output layer and the last transformer block.
   G. Replace the original output layer with a new linear layer mapping to two classes (spam\/not spam).
   H. Evaluate the model's performance on the validation set after each epoch.
   Fill the table with your answers – two are already in place:

| Step Order | Step |
| ---------- | ---- |
| 1          | A    |
| 2          | C    |
| 3          | G    |
| 4          | F    |
| 5          | E    |
| 6          | D    |
| 7          | B    |
| 8          | H    |

   

### 6.8 使用大语言模型作为垃圾分类分类器

1. Describe the process of using a fine-tuned LLM for spam classification.

   The process involves using a pre-trained LLM, fine-tuned for classification, to predict the class label (spam or not spam) for a given text message. This is achieved by converting the text into token IDs, feeding it to the model, and obtaining the predicted class label based on the model's
   output.

2. Explain the role of the classify_review function in spam classification.

   The classify_review function takes a text message as input, preprocesses it, converts it into token IDs, feeds it to the fine-tuned model, and predicts the class label (spam or not spam) based on the
   model's output. It then returns the corresponding class name.

3. How is the classification accuracy of a spam classification model evaluated?

  The classification accuracy is evaluated by calculating the fraction or percentage of correct predictions made by the model on a test dataset. This metric indicates how well the model is able to correctly classify spam and non-spam messages.

4. In this code listing, order the stages to match the numbers in the listing:...

   

5. What is the purpose of saving a fine-tuned spam classification model?

   Saving the model allows for its reuse later without the need for retraining. This is useful for deploying the model for real-time spam detection or for further experimentation and analysis.

6. How does the classification fine-tuning process differ from the pretraining
  process of an LLM?

  While both processes involve converting text into token IDs and using a cross-entropy loss function, classification fine-tuning focuses on training the model to output a correct class label, whereas pretraining aims to predict the next token in a sequence. Classification fine-tuning also involves replacing the output layer of the LLM with a smaller classification layer.

  

## 7 通过微调遵循人类指令

第7章探讨了指令微调（instruction fine-tuning），这是一种使预训练大语言模型（LLM）能够遵循特定指令并生成期望响应的过程，从而超越其最初的文本补全能力。本章内容包括：准备指令数据集、将数据组织成批次以实现高效训练、加载预训练的LLM，以及对模型进行微调以使其能够遵循指令。此外，还介绍了如何提取和评估LLM生成的响应，以衡量微调后模型的性能，并讲解了使用另一个LLM（例如Llama 3）对响应进行评分等技术。第7章强调的目标是提升LLM理解和有效执行指令的能力，这与第6章专注于用于分类任务的微调相呼应。

<img src="https://raw.githubusercontent.com/GMyhf/img/main/img/image-20251207202654653.png" alt="image-20251207202654653" style="zoom:33%;" />



### 核心概念快速问答

1. 预训练大语言模型在处理指令时通常面临的主要挑战是什么？
   A. 无法完成句子。
   B. 难以生成连贯文本。
   C. 词汇量有限。
   **D. 难以处理特定指令，如语法修正或语态转换。**
2. 在为监督式指令微调准备数据集时，关键组成部分是什么？
   A. 预训练语言模型。
   B. 优化算法。
   **C. 指令-响应对（instruction-response pairs）。**
   D. 分词（tokenization）算法。
3. 指令数据集通常采用哪种数据格式，因其对人类和机器都具有良好的可读性？
   **A. JSON（JavaScript对象表示法）。**
   B. CSV（逗号分隔值）。
   C. YAML（YAML Ain't Markup Language）。
   D. XML（可扩展标记语言）。
4. 在指令微调中，自定义整合函数（custom collate function）的作用是什么？
   A. 优化模型架构。
   **B. 处理指令微调数据集特有的格式和要求。**
   C. 对输入数据进行预处理。
   D. 评估模型性能。
5. 在自定义整合函数中使用 ignore_index 参数（值为 -100）的目的是什么？
   A. 标记序列的结束。
   B. 表示未知词元（token）。
   **C. 在损失计算中排除填充（padding）词元。**
   D. 标识序列的开始。
6. 保存微调后模型的状态字典（state dictionary）的目的是什么？
   A. 压缩模型以节省存储空间。
   B. 可视化模型架构。
   **C. 保存模型参数，以便后续使用或在其他项目中复用。**
   D. 提升模型性能。



### 7.1 指令微调介绍

1. What is the primary function of a pretrained LLM?

   A pretrained LLM is primarily capable of text completion, meaning it can finish sentences or write text paragraphs given a fragment as input.

2. What is the challenge that pretrained LLMs often face?

   Pretrained LLMs often struggle with specific instructions, such as grammar correction or voice conversion, requiring further fine-tuning.

3. What is the purpose of instruction fine-tuning?

   Instruction fine-tuning aims to improve an LLM's ability to follow specific instructions and generate desired responses based on those instructions.

4. What is a crucial aspect of instruction fine-tuning?

   Preparing a suitable dataset is a key aspect of instruction fine-tuning, providing the model with examples of instructions and desired responses.

   

### 7.2 为有监督指令微调准备数据

1. What is the purpose of the instruction dataset used for fine-tuning a pretrained LLM?

  The instruction dataset consists of instruction-response pairs that are used to train the LLM to follow instructions and generate appropriate responses based on given inputs.

2. Describe the format of the instruction dataset used in this section.

   The dataset is stored in a JSON file and contains entries that are Python dictionary objects. Each entry includes an 'instruction', 'input', and 'output' field, representing the task, input data, and desired response, respectively.

3. What are the two prompt styles mentioned in the section, and how do they differ?

  The two prompt styles are Alpaca and Phi-3. Alpaca uses a structured format with defined sections for instruction, input, and response, while Phi-3 employs a simpler format with designated <|user|> and
  <|assistant|> tokens.

4. What is the purpose of the format_input function, and how does it work?

  The format_input function converts the entries in the instruction dataset into the Alpaca-style input format. It constructs a formatted string that includes the instruction, input (if available), and a placeholder for the response.

5. How is the instruction dataset divided into training, validation, and test sets?

  The dataset is divided into training, validation, and test sets using a specific ratio. The training set is used to train the model, the validation set is used to evaluate the model's performance during training, and the test set is used to evaluate the model's final performance.

6. 将术语与其右侧的描述进行匹配：

| Instruction-Response Pairs |      | Different formats for presenting instructions and inputs to a language model, influencing how the model interprets and responds to the task. |
| -------------------------- | ---- | ------------------------------------------------------------ |
| Prompt Styles              |      | A simpler format for instruction fine-tuning that uses designated tokens to mark user input and assistant output, allowing for more flexibility in task presentation. |
| Alpaca Prompt Style        |      | The dataset consists of pairs of instructions and their corresponding responses, providing examples of how to complete tasks. |
| Phi-3 Prompt Style         |      | A structured format for instruction fine-tuning that uses separate sections for the instruction, input, and response, making it clear for the model to understand the task. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 3    | 4    | 2    | 1    |



### 7.3 将数据组织成训练批次

1. What is the purpose of a custom collate function in instruction finetuning?

   A custom collate function is used to handle the specific requirements and formatting of the instruction fine-tuning dataset. It ensures that training examples are padded to the same length within each batch, allowing for efficient processing by the model.

2. How does the custom collate function handle padding in instruction finetuning?

   The custom collate function pads training examples to the length of the longest example in each batch, using the <|endoftext|> token ID (50256). This minimizes unnecessary padding by only extending
   sequences to match the longest one in each batch.

3. Explain the role of target token IDs in instruction fine-tuning and how they are generated.

   Target token IDs represent the desired output sequence that the model should generate. They are created by shifting the input token IDs one position to the right, omitting the first token and appending an end-oftext token. This setup allows the model to learn how to predict the next token in a sequence.

4. Why are padding tokens replaced with the -100 placeholder value in the target token IDs?

  Replacing padding tokens with -100 allows the cross entropy loss function to ignore them during training. This ensures that only meaningful data influences model learning and prevents padding tokens from contributing to the loss calculation.

5. What is the purpose of retaining one end-of-text token in the target sequence?

  Retaining one end-of-text token in the target sequence helps the LLM learn to generate end-of-text tokens, which act as an indicator that the generated response is complete.

6. Pieces of the code have been removed from four places in this listing. Which of these terms have been removed and where should they go?
  Note that a term may appear more than once!...

  

### 7.4 创建指令数据集的数据加载器

1. What is the purpose of the custom_collate_fn function in the context of instruction fine-tuning?

  The custom_collate_fn function is used to batch the instruction dataset, ensuring that the input and target tensors are moved to the specified device (CPU, GPU, or MPS) before being fed into the LLM for fine-tuning.

2. Explain the advantage of moving data to the target device within the custom_collate_fn function instead of the main training loop.

  By performing the device transfer within the custom_collate_fn, the process becomes a background task, preventing it from blocking the GPU during model training and improving efficiency.

3. How is the device setting determined and used in the custom_collate_fn function?

  The device setting is determined based on the availability of a GPU or MPS. The partial function from functools is used to create a new version of the custom_collate_fn with the device argument prefilled,
  ensuring that the function uses the correct device for data transfer.

4. What is the purpose of the allowed_max_length parameter in the customized_collate_fn function?

  The allowed_max_length parameter is used to truncate the data to the maximum context length supported by the LLM model being fine-tuned, in this case, the GPT-2 model.

5. Describe the process of creating data loaders for the training, validation, and test sets using the DataLoader class.

  The DataLoader class is used to create data loaders for each set (training, validation, and test). The batch_size, collate_fn, shuffle, drop_last, and num_workers parameters are configured to control the
  batching process, shuffling, and data loading behavior.

6. Pieces of the code have been removed from four places in this listing. Which of these terms have been removed and where should they go?
  Note that a term may appear more than once!...

  

7. 将术语与其右侧的描述进行匹配：

| Batching Process        |      | A function that defines how to combine individual data samples into a batch, specifically tailored for the requirements of instruction fine-tuning. |
| ----------------------- | ---- | ------------------------------------------------------------ |
| Custom Collate Function |      | The process of organizing training data into groups of samples, called batches, to improve training efficiency. |
| Padding Tokens          |      | Special tokens added to the end of sequences to ensure all inputs in a batch have the same length, allowing for efficient processing by the model. |
| Ignore Index            |      | A special value, typically -100, used to indicate padding tokens in the target sequence, preventing them from contributing to the loss calculation during training. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    | 4    |
| ----------------- | ---- | ---- | ---- | ---- |
| Right Hand Column | 2    | 1    | 3    | 4    |



### 7.5 加载预训练的大语言模型

1. Why is a larger pretrained model, like 'gpt2-medium', preferred for instruction fine-tuning compared to the smaller 'gpt2-small' model?

  The smaller model lacks the capacity to learn and retain the complex patterns and nuanced behaviors required for high-quality instructionfollowing tasks. The larger model has more parameters, allowing it to handle more intricate instructions and generate more accurate responses.

2. What is the purpose of loading a pretrained LLM before starting instruction fine-tuning?

  Loading a pretrained LLM provides a foundation for the fine-tuning process. It allows the model to leverage existing knowledge and patterns learned during pretraining, enabling it to learn new tasks more efficiently and effectively.

3. How does the code for loading a pretrained model differ from the code used for pretraining or classification fine-tuning?

  The code remains largely the same, but instead of specifying the 'gpt2-small' model, we now specify 'gpt2-medium' to load the larger model with 355 million parameters. This change reflects the choice of a more capable model for instruction fine-tuning.

4. What is the purpose of evaluating the pretrained LLM's performance on a validation task before fine-tuning?

  Evaluating the pretrained LLM's performance provides a baseline understanding of its capabilities before fine-tuning. This allows us to assess the impact of fine-tuning on the model's ability to follow
  instructions and generate accurate responses.

5. How is the model's generated response isolated from the input instruction in the provided code?

  The code subtracts the length of the input instruction from the start of the generated text, effectively removing the input text and leaving only the model's generated response. The strip() function is then applied to remove any extra whitespace.

  

### 7.6 在指令数据上微调大语言模型

1. What is the purpose of fine-tuning an LLM on instruction data?

   Fine-tuning an LLM on instruction data aims to improve its ability to understand and follow instructions, leading to more accurate and relevant responses to user prompts.

2. Describe the process of fine-tuning an LLM on instruction data, highlighting the key steps involved.

  The process involves loading a pretrained LLM, preparing an instruction dataset, and training the model on this dataset using a suitable loss function and optimizer. The training process aims to minimize the loss, indicating improved performance in following instructions.

3. What are some potential challenges encountered during fine-tuning an LLM on instruction data, and how can these challenges be addressed?

  Challenges include hardware limitations, such as memory constraints, which can be addressed by using a smaller model, reducing the batch size, or utilizing a GPU for faster training. Additionally, managing the length of input sequences can be crucial for efficient training.

4. How is the effectiveness of fine-tuning evaluated during the training process?

  The effectiveness is evaluated by monitoring the training and validation losses. A decrease in these losses indicates that the model is learning to follow instructions better. Additionally, inspecting the generated responses during training provides qualitative insights into the model's progress.

5. What is the significance of the Alpaca dataset in the context of fine-tuning LLMs?

  The Alpaca dataset is a valuable resource for fine-tuning LLMs on instruction data. It provides a large collection of diverse instructions and corresponding responses, enabling the model to learn a wider range of task-specific behaviors.

  

### 7.7 抽取并保存模型回复

1. Describe the process of evaluating the performance of an instruction-finetuned Large Language Model (LLM) after training.

   Evaluation involves extracting model-generated responses from a heldout test set, manually analyzing them, and then quantifying the response quality using various methods such as benchmarks, human comparison, or automated metrics

2. What are the different methods for evaluating the performance of instruction-fine-tuned LLMs, and what are their relative strengths and weaknesses?

  Methods include short-answer benchmarks (e.g., MMLU), human preference comparisons, and automated conversational benchmarks (e.g., AlpacaEval). Human evaluation provides valuable insights but is time-consuming, while automated methods are efficient but may lack the nuance of human judgment.

3. What is meant by 'conversational performance' in the context of LLMs, and why is it important?

  Conversational performance refers to an LLM's ability to engage in human-like communication, understanding context, nuance, and intent. It's crucial for applications like chatbots where natural and coherent interaction is essential.

4. How can the responses generated by an LLM be automatically evaluated using another LLM, and what are the advantages of this approach?

  An approach similar to AlpacaEval can be used, employing another LLM to evaluate the responses. This automated method is efficient, saving time and resources compared to manual human evaluation while still providing meaningful performance indicators.

5. Explain the process of appending generated model responses to a test set and saving the updated data for later analysis.

  The generated model responses are added to a dictionary containing the test data. This updated data is then saved as a JSON file (e.g., 'instruction-data-with-response.json') for easy access and analysis in
  future sessions.

  

  

### 7.8 评估微调后的大语言模型

1. What is the purpose of using a larger LLM to evaluate the responses of a fine-tuned model?

  A larger LLM, like Llama 3 or GPT-4, can be used to automatically assess the quality of responses generated by a fine-tuned model. This provides a more objective and scalable method for evaluating model performance compared to manually reviewing a few examples.

2. Describe the process of using Ollama to evaluate the responses of a finetuned model.

   Ollama, an open-source application, allows you to run LLMs locally. You can use the query_model function to send prompts to the LLM, such as asking it to score a model's response on a scale of 0 to 100. The LLM's evaluation can then be used to assess the overall performance of the fine-tuned model.

3. What are some alternative LLMs that can be used for evaluating model responses, besides the 8-billion-parameter Llama 3 model?

  Other LLMs, such as the 3.8-billion-parameter phi3 model or the larger 70-billion-parameter Llama 3 model, can be used with Ollama. The choice of model depends on the available computational resources and the desired level of performance.

4. How can the generate_model_scores function be used to assess the performance of a fine-tuned model?

  The generate_model_scores function iterates through a set of test data, sending prompts to the LLM to evaluate each model response. It then calculates the average score across all responses, providing a quantitative measure of the model's performance.

5. What are some strategies for improving the performance of a fine-tuned model?

  Strategies for improving model performance include adjusting hyperparameters during fine-tuning, increasing the size or diversity of the training dataset, experimenting with different prompts or instruction formats, and using a larger pretrained model.

6. 将术语与其右侧的描述进行匹配：

| Test Set                            |      | A method of evaluating the conversational performance of a language model using another language model to assess the quality of responses. |
| ----------------------------------- | ---- | ------------------------------------------------------------ |
| Conversational Performance          |      | The ability of a language model to engage in human-like communication, understanding context, nuance, and intent. |
| Automated Conversational Benchmarks |      | A portion of data that is held out from the training process and used to evaluate the performance of a trained model. |

Fill the table with the column mappings:

| Left Hand Column  | 1    | 2    | 3    |
| ----------------- | ---- | ---- | ---- |
| Right Hand Column | 3    | 2    | 1    |







# 参考文献

[1] Dartmouth workshop - Wikipedia

https://en.wikipedia.org/wiki/Dartmouth_workshop

[2]OpenAI Presents GPT-3, a 175 Billion Parameters Language Model | NVIDIA Technical Blog. July 07, 2020.

https://developer.nvidia.com/blog/openai-presents-gpt-3-a-175-billion-parameters-language-model/

[3] GPT-4 Technical Report. March 27, 2023.

https://cdn.openai.com/papers/gpt-4.pdf

[4] Transformer (deep learning architecture) - Wikipedia

https://en.wikipedia.org/wiki/Transformer_(deep_learning_architecture)

[5] GPT-4 | OpenAI. March 14, 2023.

https://openai.com/index/gpt-4-research/

[6] 从零构建大模型 (Sebastian Raschka, 塞巴斯蒂安·拉施卡, 覃立波, 冯晓骋, 刘乾) 

Build a Large Language Model (From Scratch) (Sebastian Raschka) 

[7] Test Yourself On Build a Large Language.pdf
