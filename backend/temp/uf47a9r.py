def subtractTwoNumbers(a, b):
    return a-b;

if __name__ == "__main__":
    a, b = map(int, input().split())
    result = subtractTwoNumbers(a, b)
    print(result)