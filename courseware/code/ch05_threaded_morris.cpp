// 线索二叉树与 Morris 遍历：对应第五章 PPT 第 14–17 页的代码。
// 编译：g++ -std=c++17 -Wall -Wextra -O2 ch05_threaded_morris.cpp -o ch05_threaded_morris
#include <cstdio>
#include <memory>
#include <vector>

using T = int;

struct Node {
    T value;
    Node* left = nullptr;
    Node* right = nullptr;
    bool left_thread = false;    // true：left 存的是中序前驱
    bool right_thread = false;   // true：right 存的是中序后继
};

// ---------------- 普通递归中序（用来对照） ----------------
template <typename Visitor>
static void inorder_impl(const Node* node, Visitor& visit) {
    if (node == nullptr) return;
    inorder_impl(node->left, visit);
    visit(node->value);
    inorder_impl(node->right, visit);
}

// ---------------- Morris 中序周游 ----------------
// 额外空间 O(1)。中途临时改树，结束时恢复原样。
template <typename Visitor>
static void morris_inorder(Node* root, Visitor& visit) {
    Node* cur = root;
    while (cur != nullptr) {
        if (cur->left == nullptr) {            // 没有左子树：访问，往右走
            visit(cur->value);
            cur = cur->right;                  // 可能是真孩子，也可能是临时线索
            continue;
        }
        Node* pre = cur->left;                 // 找中序前驱：左子树最右下
        while (pre->right != nullptr && pre->right != cur) pre = pre->right;
        if (pre->right == nullptr) {           // 第一次到 cur：搭线索，进左子树
            pre->right = cur;
            cur = cur->left;
        } else {                               // 第二次到 cur：左子树已走完
            pre->right = nullptr;              // 拆线索，恢复原树
            visit(cur->value);
            cur = cur->right;
        }
    }
}

// ---------------- 线索二叉树 ----------------
// 线索化：按中序走一遍，pre 是上一个访问到的结点
static void thread_impl(Node* node, Node*& pre) {
    if (node == nullptr) return;
    thread_impl(node->left, pre);
    if (node->left == nullptr) {                   // 空左指针 → 存中序前驱
        node->left = pre;
        node->left_thread = true;
    }
    if (pre != nullptr && pre->right == nullptr) { // 上一个结点的空右指针 → 存后继
        pre->right = node;
        pre->right_thread = true;
    }
    pre = node;
    thread_impl(node->right, pre);
}

static void make_threaded(Node* root) {
    Node* pre = nullptr;
    thread_impl(root, pre);
    if (pre != nullptr) pre->right_thread = true;  // 最后一个结点：后继为空
}

// 中序后继：右指针是线索就直接跳；否则是右子树里最左下的结点
static Node* next(Node* node) {
    if (node->right_thread) return node->right;
    node = node->right;
    while (!node->left_thread) node = node->left;
    return node;
}

template <typename Visitor>
static void inorder_threaded(Node* root, Visitor& visit) {
    if (root == nullptr) return;
    Node* node = root;
    while (!node->left_thread) node = node->left;  // 中序第一个：最左下
    for (; node != nullptr; node = next(node)) visit(node->value);
}

// ---------------- 演示 ----------------
// 结点统一放在 pool 里，由 unique_ptr 释放：线索化之后树上有回指，不能再递归 delete。
struct Tree {
    std::vector<std::unique_ptr<Node>> pool;
    Node* make(T v, Node* l = nullptr, Node* r = nullptr) {
        pool.push_back(std::make_unique<Node>());
        Node* n = pool.back().get();
        n->value = v;
        n->left = l;
        n->right = r;
        return n;
    }
};

static std::vector<T> collect_recursive(const Node* root) {
    std::vector<T> out;
    auto visit = [&](T v) { out.push_back(v); };
    inorder_impl(root, visit);
    return out;
}

static void print(const char* name, const std::vector<T>& seq) {
    std::printf("%-10s:", name);
    for (T v : seq) std::printf(" %d", v);
    std::printf("\n");
}

int main() {
    // 课件上的例子：1(2(4, 5), 3)
    Tree t;
    Node* root = t.make(1, t.make(2, t.make(4), t.make(5)), t.make(3));

    std::vector<T> expect = collect_recursive(root);
    print("递归中序", expect);

    std::vector<T> morris;
    auto visit_m = [&](T v) { morris.push_back(v); };
    morris_inorder(root, visit_m);
    print("Morris", morris);

    bool restored = collect_recursive(root) == expect;   // Morris 结束后树应恢复原样
    std::printf("Morris 后树恢复原样：%s\n", restored ? "是" : "否");

    make_threaded(root);   // 线索化之后不能再调用普通递归周游（空指针已被占用）
    std::vector<T> threaded;
    auto visit_t = [&](T v) { threaded.push_back(v); };
    inorder_threaded(root, visit_t);
    print("线索周游", threaded);

    bool ok = morris == expect && threaded == expect && restored;
    std::printf("%s\n", ok ? "全部一致" : "不一致！");
    return ok ? 0 : 1;
}
