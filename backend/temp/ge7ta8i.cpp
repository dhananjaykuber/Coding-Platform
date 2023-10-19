#include <iostream>
using namespace std;

int subtractTwoNumbers(int a, int b) {
    return a-b;
}

int main() {
    int a, b;
    cin >> a >> b;
    cout << subtractTwoNumbers(a, b);
    return 0;
}