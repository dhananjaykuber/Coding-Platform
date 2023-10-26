#include <iostream>
using namespace std;

int findIndex(int size, int arr[], int target) {
    return -1;
}

int main() {
    int size,  target;
    cin >> size;
    cin >> target;

    int arr[size];

    for (int i = 0; i < size; i++) {
        cin >> arr[i];
    }

    cout << findIndex(size, arr, target);
    return 0;
}
