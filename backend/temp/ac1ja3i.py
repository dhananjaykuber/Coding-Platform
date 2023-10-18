def addTwoNumbers(a, b):
    # Your code here
return a+b;

if __name__ == "__main__":
    a, b = map(int, input().split())
    result = addTwoNumbers(a, b)
    print(result)