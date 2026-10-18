// 栈 + tag 模拟递归遍历：对应 MOOC 测验 CH05-06 第 25–27 页（Q12–Q14）的代码。
// 1 号访问点 = 前序，2 号 = 中序，3 号 = 后序；每步打印栈内容（底 → 顶）。
// 编译：g++ -std=c++17 -Wall -Wextra -O2 ch05_tag_stack_traversal.cpp -o ch05_tag_stack_traversal
#include <iostream>
#include <stack>
#include <string>
using namespace std;

struct Node {
    char data;
    Node *left, *right;
    Node(char d, Node *l = nullptr, Node *r = nullptr) : data(d), left(l), right(r) {}
    Node *leftchild()  { return left; }
    Node *rightchild() { return right; }
};

enum Tags { Left, Right };

struct StackElement {
    Node *pointer;
    Tags tag;
};

// 打印栈内容（底 → 顶），如 A(L) B(R)
void printStack(stack<StackElement> s) {
    string out;
    while (!s.empty()) {
        StackElement e = s.top(); s.pop();
        out = string(1, e.pointer->data) + (e.tag == Left ? "(L) " : "(R) ") + out;
    }
    cout << "    栈: [" << (out.empty() ? "空" : out) << "]\n";
}

void traverse(Node *root) {
    stack<StackElement> aStack;
    StackElement element;
    Node *pointer = root;
    string pre, in, post;

    while (!aStack.empty() || pointer) {
        while (pointer != NULL) {
            // 1号访问点
            cout << "1号 " << pointer->data << "：第一次遇到，压栈(L)，往左走\n";
            pre += pointer->data;
            element.pointer = pointer; element.tag = Left;
            aStack.push(element); pointer = pointer->leftchild();
            printStack(aStack);
        }
        element = aStack.top(); aStack.pop(); pointer = element.pointer;
        if (element.tag == Left) {
            // 2号访问点
            cout << "2号 " << pointer->data << "：弹出时 tag=L，左子树完，改 R 重新压栈，往右走\n";
            in += pointer->data;
            element.tag = Right; aStack.push(element);
            pointer = pointer->rightchild();
        } else {
            // 3号访问点
            cout << "3号 " << pointer->data << "：弹出时 tag=R，左右都完，彻底出栈\n";
            post += pointer->data;
            pointer = NULL;
        }
        printStack(aStack);
    }
    cout << "\n1号顺序（前序）: " << pre
         << "\n2号顺序（中序）: " << in
         << "\n3号顺序（后序）: " << post << "\n";
}

int main() {
    // 树：A 为根，B 是左孩子，C 是右孩子
    Node *root = new Node('A', new Node('B'), new Node('C'));
    traverse(root);
}
